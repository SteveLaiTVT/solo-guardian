/**
 * @file logout.dto.ts
 * @description DTO for logout request
 * @task TASK-001-D
 * @design_state_version 0.2.0
 */
import { IsString, IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
