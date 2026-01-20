/**
 * @file early-warning.dto.ts
 * @description DTOs for early warning system
 * @task TASK-100
 * @design_state_version 3.12.0
 */
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  Min,
  Max,
  IsArray,
} from 'class-validator';

/**
 * Warning severity levels
 */
export enum WarningSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Warning rule types
 */
export enum WarningRuleType {
  CONSECUTIVE_MISSED = 'consecutive_missed', // Missed X consecutive check-ins
  LATE_CHECKIN_PATTERN = 'late_checkin_pattern', // Frequently checking in late
  SETTINGS_DISABLED = 'settings_disabled', // User disabled check-in
  NO_CONTACTS = 'no_contacts', // No emergency contacts configured
  INACTIVE_PERIOD = 'inactive_period', // No activity for X days
  SNOOZE_ABUSE = 'snooze_abuse', // Using snooze too frequently
}

/**
 * DTO for creating a warning rule
 */
export class CreateWarningRuleDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(WarningRuleType)
  type: WarningRuleType;

  @IsEnum(WarningSeverity)
  severity: WarningSeverity;

  @IsNumber()
  @Min(1)
  threshold: number;

  @IsNumber()
  @Min(1)
  @Max(365)
  @IsOptional()
  lookbackDays?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  notifyAdmin?: boolean;
}

/**
 * DTO for updating a warning rule
 */
export class UpdateWarningRuleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(WarningSeverity)
  @IsOptional()
  severity?: WarningSeverity;

  @IsNumber()
  @Min(1)
  @IsOptional()
  threshold?: number;

  @IsNumber()
  @Min(1)
  @Max(365)
  @IsOptional()
  lookbackDays?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  notifyAdmin?: boolean;
}

/**
 * Response DTO for warning rule
 */
export class WarningRuleResponseDto {
  id: string;
  name: string;
  description?: string;
  type: WarningRuleType;
  severity: WarningSeverity;
  threshold: number;
  lookbackDays?: number;
  isActive: boolean;
  notifyAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Response DTO for an early warning
 */
export class EarlyWarningResponseDto {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  ruleId: string;
  ruleName: string;
  ruleType: WarningRuleType;
  severity: WarningSeverity;
  details: string;
  isAcknowledged: boolean;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  createdAt: Date;
}

/**
 * DTO for acknowledging a warning
 */
export class AcknowledgeWarningDto {
  @IsString()
  @IsOptional()
  notes?: string;
}

/**
 * DTO for filtering warnings
 */
export class WarningFilterDto {
  @IsEnum(WarningSeverity)
  @IsOptional()
  severity?: WarningSeverity;

  @IsBoolean()
  @IsOptional()
  acknowledged?: boolean;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  pageSize?: number;
}

/**
 * At-risk user summary DTO
 */
export class AtRiskUserDto {
  userId: string;
  userName: string;
  userEmail?: string;
  warningCount: number;
  highestSeverity: WarningSeverity;
  warnings: EarlyWarningResponseDto[];
  consecutiveMissedCount: number;
  lastCheckInDate?: string;
  hasEmergencyContacts: boolean;
  checkInEnabled: boolean;
}

/**
 * Dashboard summary DTO
 */
export class WarningDashboardDto {
  totalWarnings: number;
  unacknowledgedCount: number;
  bySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  atRiskUsers: AtRiskUserDto[];
  recentWarnings: EarlyWarningResponseDto[];
}
