/**
 * @file update-user-status.dto.ts
 * @description Update user status DTO
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { IsIn } from 'class-validator';
import { UserStatusType } from '../admin.repository';

export class UpdateUserStatusDto {
  @IsIn(['active', 'suspended', 'deleted'])
  status!: UserStatusType;
}
