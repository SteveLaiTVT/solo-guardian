/**
 * @file early-warning.service.ts
 * @description Service for early warning system logic
 * @task TASK-100
 * @design_state_version 3.12.0
 */
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EarlyWarningRepository } from './early-warning.repository';
import {
  WarningSeverity,
  WarningRuleType,
  CreateWarningRuleDto,
  UpdateWarningRuleDto,
  WarningRuleResponseDto,
  EarlyWarningResponseDto,
  WarningFilterDto,
  WarningDashboardDto,
  AtRiskUserDto,
} from './dto';

@Injectable()
export class EarlyWarningService {
  private readonly logger = new Logger(EarlyWarningService.name);
  private isRunning = false;

  constructor(private readonly repository: EarlyWarningRepository) {}

  /**
   * Run warning detection job - every 30 minutes
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async runWarningDetection(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      this.logger.log('Starting early warning detection...');

      const rules = await this.repository.findActiveRules();
      let warningsCreated = 0;

      for (const rule of rules) {
        try {
          const created = await this.processRule(rule);
          warningsCreated += created;
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Unknown error';
          this.logger.error(`Error processing rule ${rule.name}: ${msg}`);
        }
      }

      if (warningsCreated > 0) {
        this.logger.log(`Warning detection complete: ${warningsCreated} warnings created`);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Warning detection failed: ${msg}`);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Process a single warning rule
   */
  private async processRule(rule: {
    id: string;
    name: string;
    type: string;
    severity: string;
    threshold: number;
    lookbackDays: number | null;
  }): Promise<number> {
    let warningsCreated = 0;

    switch (rule.type as WarningRuleType) {
      case WarningRuleType.CONSECUTIVE_MISSED: {
        const users = await this.repository.getUsersWithConsecutiveMisses(
          rule.threshold,
          rule.lookbackDays || 7,
        );

        for (const user of users) {
          const hasRecent = await this.repository.hasRecentWarning(user.userId, rule.id);
          if (!hasRecent) {
            await this.repository.createWarning({
              userId: user.userId,
              ruleId: rule.id,
              severity: rule.severity as WarningSeverity,
              details: `User has missed ${user.consecutiveMissedCount} check-ins in the last ${rule.lookbackDays || 7} days`,
            });
            warningsCreated++;
            this.logger.warn(
              `[${rule.severity.toUpperCase()}] Created warning for ${user.userName}: consecutive missed check-ins`,
            );
          }
        }
        break;
      }

      case WarningRuleType.NO_CONTACTS: {
        const users = await this.repository.getUsersWithoutContacts();

        for (const user of users) {
          const hasRecent = await this.repository.hasRecentWarning(user.id, rule.id);
          if (!hasRecent) {
            await this.repository.createWarning({
              userId: user.id,
              ruleId: rule.id,
              severity: rule.severity as WarningSeverity,
              details: 'User has check-in enabled but no emergency contacts configured',
            });
            warningsCreated++;
            this.logger.warn(
              `[${rule.severity.toUpperCase()}] Created warning for ${user.name}: no emergency contacts`,
            );
          }
        }
        break;
      }

      case WarningRuleType.SETTINGS_DISABLED: {
        const settings = await this.repository.getUsersWithDisabledCheckIn();

        for (const setting of settings) {
          const hasRecent = await this.repository.hasRecentWarning(setting.userId, rule.id);
          if (!hasRecent) {
            await this.repository.createWarning({
              userId: setting.userId,
              ruleId: rule.id,
              severity: rule.severity as WarningSeverity,
              details: 'User has disabled their check-in feature',
            });
            warningsCreated++;
            this.logger.warn(
              `[${rule.severity.toUpperCase()}] Created warning for ${setting.user.name}: check-in disabled`,
            );
          }
        }
        break;
      }

      // Add more rule types as needed
      default:
        this.logger.debug(`Rule type ${rule.type} not implemented yet`);
    }

    return warningsCreated;
  }

  /**
   * Create a warning rule
   */
  async createRule(dto: CreateWarningRuleDto): Promise<WarningRuleResponseDto> {
    const rule = await this.repository.createRule(dto);
    return this.mapRuleToResponse(rule);
  }

  /**
   * Update a warning rule
   */
  async updateRule(id: string, dto: UpdateWarningRuleDto): Promise<WarningRuleResponseDto> {
    const rule = await this.repository.updateRule(id, dto);
    return this.mapRuleToResponse(rule);
  }

  /**
   * Delete a warning rule
   */
  async deleteRule(id: string): Promise<void> {
    await this.repository.deleteRule(id);
  }

  /**
   * Get all warning rules
   */
  async getAllRules(): Promise<WarningRuleResponseDto[]> {
    const rules = await this.repository.findAllRules();
    return rules.map((r: Parameters<typeof this.mapRuleToResponse>[0]) => this.mapRuleToResponse(r));
  }

  /**
   * Get a warning rule by ID
   */
  async getRuleById(id: string): Promise<WarningRuleResponseDto | null> {
    const rule = await this.repository.findRuleById(id);
    return rule ? this.mapRuleToResponse(rule) : null;
  }

  /**
   * Get warnings with filters
   */
  async getWarnings(filters: WarningFilterDto): Promise<{
    warnings: EarlyWarningResponseDto[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const skip = ((filters.page || 1) - 1) * (filters.pageSize || 50);
    const { warnings, total } = await this.repository.findWarnings({
      severity: filters.severity,
      acknowledged: filters.acknowledged,
      userId: filters.userId,
      skip,
      take: filters.pageSize || 50,
    });

    return {
      warnings: warnings.map((w) => this.mapWarningToResponse(w)),
      total,
      page: filters.page || 1,
      pageSize: filters.pageSize || 50,
    };
  }

  /**
   * Acknowledge a warning
   */
  async acknowledgeWarning(
    id: string,
    adminId: string,
    notes?: string,
  ): Promise<EarlyWarningResponseDto> {
    const warning = await this.repository.acknowledgeWarning(id, adminId, notes);
    return this.mapWarningToResponse(warning);
  }

  /**
   * Get dashboard summary
   */
  async getDashboard(): Promise<WarningDashboardDto> {
    const [bySeverity, atRiskUsersRaw, { warnings: recentWarnings, total }] = await Promise.all([
      this.repository.getWarningCountsBySeverity(),
      this.repository.getAtRiskUsers(10),
      this.repository.findWarnings({
        acknowledged: false,
        take: 10,
      }),
    ]);

    const unacknowledgedCount =
      bySeverity.low + bySeverity.medium + bySeverity.high + bySeverity.critical;

    const atRiskUsers: AtRiskUserDto[] = atRiskUsersRaw.map((u) => ({
      userId: u.userId,
      userName: u.userName,
      userEmail: u.userEmail || undefined,
      warningCount: u.warningCount,
      highestSeverity: u.highestSeverity,
      warnings: u.warnings.map((w) =>
        this.mapWarningToResponse({
          ...w,
          user: { id: u.userId, name: u.userName, email: u.userEmail },
        }),
      ),
      consecutiveMissedCount: 0, // Would need to calculate
      lastCheckInDate: u.lastCheckInDate || undefined,
      hasEmergencyContacts: u.hasEmergencyContacts,
      checkInEnabled: u.checkInEnabled,
    }));

    return {
      totalWarnings: total,
      unacknowledgedCount,
      bySeverity,
      atRiskUsers,
      recentWarnings: recentWarnings.map((w) => this.mapWarningToResponse(w)),
    };
  }

  /**
   * Manually trigger warning detection
   */
  async triggerDetection(): Promise<{ warningsCreated: number }> {
    if (this.isRunning) {
      return { warningsCreated: 0 };
    }

    this.isRunning = true;
    let warningsCreated = 0;

    try {
      const rules = await this.repository.findActiveRules();

      for (const rule of rules) {
        try {
          const created = await this.processRule(rule);
          warningsCreated += created;
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Unknown error';
          this.logger.error(`Error processing rule ${rule.name}: ${msg}`);
        }
      }
    } finally {
      this.isRunning = false;
    }

    return { warningsCreated };
  }

  private mapRuleToResponse(rule: {
    id: string;
    name: string;
    description: string | null;
    type: string;
    severity: string;
    threshold: number;
    lookbackDays: number | null;
    isActive: boolean;
    notifyAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): WarningRuleResponseDto {
    return {
      id: rule.id,
      name: rule.name,
      description: rule.description || undefined,
      type: rule.type as WarningRuleType,
      severity: rule.severity as WarningSeverity,
      threshold: rule.threshold,
      lookbackDays: rule.lookbackDays || undefined,
      isActive: rule.isActive,
      notifyAdmin: rule.notifyAdmin,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    };
  }

  private mapWarningToResponse(warning: {
    id: string;
    userId: string;
    ruleId: string;
    severity: string;
    details: string;
    isAcknowledged: boolean;
    acknowledgedAt: Date | null;
    acknowledgedBy: string | null;
    createdAt: Date;
    user: { id: string; name: string; email: string | null };
    rule: { id: string; name: string; type: string };
  }): EarlyWarningResponseDto {
    return {
      id: warning.id,
      userId: warning.userId,
      userName: warning.user.name,
      userEmail: warning.user.email || undefined,
      ruleId: warning.ruleId,
      ruleName: warning.rule.name,
      ruleType: warning.rule.type as WarningRuleType,
      severity: warning.severity as WarningSeverity,
      details: warning.details,
      isAcknowledged: warning.isAcknowledged,
      acknowledgedAt: warning.acknowledgedAt || undefined,
      acknowledgedBy: warning.acknowledgedBy || undefined,
      createdAt: warning.createdAt,
    };
  }
}
