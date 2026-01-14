/**
 * @file check-in-settings.dto.ts
 * @description DTO for check-in settings
 * @task TASK-006
 * @design_state_version 0.8.0
 */
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

/**
 * DTO for updating check-in settings
 *
 * TODO(B): Implement time validation
 * Requirements:
 * - deadlineTime format: HH:mm (24-hour)
 * - reminderTime format: HH:mm (24-hour)
 * - reminderEnabled defaults to true
 */
export class UpdateCheckInSettingsDto {
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'deadlineTime must be in HH:mm format (24-hour)',
  })
  deadlineTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'reminderTime must be in HH:mm format (24-hour)',
  })
  reminderTime?: string;

  @IsOptional()
  @IsBoolean()
  reminderEnabled?: boolean;
}

/**
 * Response DTO for check-in settings
 */
export class CheckInSettingsResponseDto {
  userId: string;
  deadlineTime: string;
  reminderTime: string;
  reminderEnabled: boolean;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}
