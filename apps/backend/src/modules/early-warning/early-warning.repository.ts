/**
 * @file early-warning.repository.ts
 * @description Repository for early warning data access
 * @task TASK-100
 * @design_state_version 3.12.0
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  WarningSeverity,
  WarningRuleType,
  CreateWarningRuleDto,
  UpdateWarningRuleDto,
} from './dto';

@Injectable()
export class EarlyWarningRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a warning rule
   */
  async createRule(dto: CreateWarningRuleDto) {
    return this.prisma.earlyWarningRule.create({
      data: {
        name: dto.name,
        description: dto.description,
        ruleType: dto.type,
        severity: dto.severity,
        threshold: dto.threshold,
        timeWindowHours: dto.lookbackDays ? dto.lookbackDays * 24 : undefined,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /**
   * Update a warning rule
   */
  async updateRule(id: string, dto: UpdateWarningRuleDto) {
    return this.prisma.earlyWarningRule.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Delete a warning rule
   */
  async deleteRule(id: string) {
    return this.prisma.earlyWarningRule.delete({
      where: { id },
    });
  }

  /**
   * Get all warning rules
   */
  async findAllRules() {
    return this.prisma.earlyWarningRule.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get active warning rules
   */
  async findActiveRules() {
    return this.prisma.earlyWarningRule.findMany({
      where: { isActive: true },
      orderBy: { severity: 'desc' },
    });
  }

  /**
   * Get a warning rule by ID
   */
  async findRuleById(id: string) {
    return this.prisma.earlyWarningRule.findUnique({
      where: { id },
    });
  }

  /**
   * Create an early warning for a user
   */
  async createWarning(data: {
    userId: string;
    ruleId: string;
    severity: WarningSeverity;
    details: string;
  }) {
    return this.prisma.earlyWarning.create({
      data: {
        userId: data.userId,
        ruleId: data.ruleId,
        severity: data.severity,
        message: data.details,
        details: {},
      },
    });
  }

  /**
   * Check if a similar warning already exists for this user today
   */
  async hasRecentWarning(userId: string, ruleId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await this.prisma.earlyWarning.count({
      where: {
        userId,
        ruleId,
        createdAt: { gte: today },
      },
    });

    return count > 0;
  }

  /**
   * Acknowledge a warning
   */
  async acknowledgeWarning(id: string, adminId: string, notes?: string) {
    return this.prisma.earlyWarning.update({
      where: { id },
      data: {
        isReviewed: true,
        reviewedAt: new Date(),
        reviewedBy: adminId,
        reviewNotes: notes,
      },
    });
  }

  /**
   * Get warnings with filters
   */
  async findWarnings(filters: {
    severity?: WarningSeverity;
    acknowledged?: boolean;
    userId?: string;
    skip?: number;
    take?: number;
  }) {
    const where: Record<string, unknown> = {};

    if (filters.severity) {
      where.severity = filters.severity;
    }
    if (filters.acknowledged !== undefined) {
      where.isReviewed = filters.acknowledged;
    }
    if (filters.userId) {
      where.userId = filters.userId;
    }

    const [warnings, total] = await Promise.all([
      this.prisma.earlyWarning.findMany({
        where,
        include: {
          rule: { select: { id: true, name: true, ruleType: true } },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip: filters.skip || 0,
        take: filters.take || 50,
      }),
      this.prisma.earlyWarning.count({ where }),
    ]);

    return { warnings, total };
  }

  /**
   * Get warning counts by severity
   */
  async getWarningCountsBySeverity() {
    const counts = await this.prisma.earlyWarning.groupBy({
      by: ['severity'],
      _count: true,
      where: { isReviewed: false },
    });

    const result = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    for (const count of counts) {
      result[count.severity as keyof typeof result] = count._count;
    }

    return result;
  }

  /**
   * Get at-risk users (users with unreviewed warnings)
   */
  async getAtRiskUsers(limit = 10) {
    // Get warnings first then aggregate by user
    const warnings = await this.prisma.earlyWarning.findMany({
      where: { isReviewed: false },
      include: {
        rule: { select: { id: true, name: true, ruleType: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit * 5, // Get more to account for grouping
    });

    // Group by userId
    const userWarnings = new Map<string, typeof warnings>();
    for (const warning of warnings) {
      const existing = userWarnings.get(warning.userId) || [];
      existing.push(warning);
      userWarnings.set(warning.userId, existing);
    }

    // Get user details for users with warnings
    const userIds = Array.from(userWarnings.keys()).slice(0, limit);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      include: {
        checkInSettings: {
          select: { enabled: true },
        },
        emergencyContacts: {
          select: { id: true },
          where: { isActive: true },
        },
        checkIns: {
          select: { checkInDate: true },
          orderBy: { checkInDate: 'desc' },
          take: 1,
        },
      },
    });

    return users.map((user) => {
      const userWarns = userWarnings.get(user.id) || [];
      return {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        warningCount: userWarns.length,
        highestSeverity: this.getHighestSeverity(
          userWarns.map((w) => w.severity as WarningSeverity),
        ),
        warnings: userWarns,
        lastCheckInDate: user.checkIns[0]?.checkInDate || null,
        hasEmergencyContacts: user.emergencyContacts.length > 0,
        checkInEnabled: user.checkInSettings?.enabled ?? false,
      };
    });
  }

  /**
   * Get the highest severity from a list
   */
  private getHighestSeverity(severities: WarningSeverity[]): WarningSeverity {
    const order: WarningSeverity[] = [
      WarningSeverity.CRITICAL,
      WarningSeverity.HIGH,
      WarningSeverity.MEDIUM,
      WarningSeverity.LOW,
    ];

    for (const s of order) {
      if (severities.includes(s)) return s;
    }

    return WarningSeverity.LOW;
  }

  /**
   * Get users who have missed consecutive check-ins
   */
  async getUsersWithConsecutiveMisses(threshold: number, lookbackDays: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - lookbackDays);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Get all users with check-in settings
    const usersWithSettings = await this.prisma.checkInSettings.findMany({
      where: { enabled: true },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const result: Array<{
      userId: string;
      userName: string;
      userEmail: string | null;
      consecutiveMissedCount: number;
    }> = [];

    for (const settings of usersWithSettings) {
      // Count check-ins in the lookback period
      const checkInCount = await this.prisma.checkIn.count({
        where: {
          userId: settings.userId,
          checkInDate: { gte: startDateStr },
        },
      });

      const expectedCheckIns = lookbackDays; // Assuming daily check-ins
      const missedCount = expectedCheckIns - checkInCount;

      if (missedCount >= threshold) {
        result.push({
          userId: settings.userId,
          userName: settings.user.name,
          userEmail: settings.user.email,
          consecutiveMissedCount: missedCount,
        });
      }
    }

    return result;
  }

  /**
   * Get users without emergency contacts
   */
  async getUsersWithoutContacts() {
    return this.prisma.user.findMany({
      where: {
        emergencyContacts: { none: {} },
        checkInSettings: { enabled: true },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  /**
   * Get users who have disabled check-in
   */
  async getUsersWithDisabledCheckIn() {
    return this.prisma.checkInSettings.findMany({
      where: { enabled: false },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
