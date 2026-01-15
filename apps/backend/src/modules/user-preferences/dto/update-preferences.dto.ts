/**
 * @file update-preferences.dto.ts
 * @description DTO for updating user preferences
 * @task TASK-021
 * @design_state_version 1.6.0
 */
import { IsBoolean, IsInt, IsOptional, Min, Max } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsBoolean()
  preferFeaturesOn?: boolean;

  @IsOptional()
  @IsInt()
  @Min(14)
  @Max(24)
  fontSize?: number;

  @IsOptional()
  @IsBoolean()
  highContrast?: boolean;

  @IsOptional()
  @IsBoolean()
  reducedMotion?: boolean;

  @IsOptional()
  @IsBoolean()
  warmColors?: boolean;

  @IsOptional()
  @IsBoolean()
  hobbyCheckIn?: boolean;

  @IsOptional()
  @IsBoolean()
  familyAccess?: boolean;
}
