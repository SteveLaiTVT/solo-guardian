/**
 * @file create-check-in.dto.ts
 * @description DTO for creating a check-in
 * @task TASK-006
 * @design_state_version 0.8.0
 */
import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * DTO for creating a daily check-in
 * DONE(B): Validation complete - TASK-006
 */
export class CreateCheckInDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
