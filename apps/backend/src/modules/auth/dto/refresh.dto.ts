/**
 * @file refresh.dto.ts
 * @description DTO for token refresh request
 * @task TASK-001-D
 * @design_state_version 0.2.0
 */
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
