/**
 * @file user-list.dto.ts
 * @description User list DTOs for admin
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { IsOptional, IsString, IsNumber, Min, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserStatusType, UserRoleType } from '../admin.repository';

export class UserListQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value as string, 10))
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value as string, 10))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['active', 'suspended', 'deleted'])
  status?: UserStatusType;
}

export interface UserSummaryResponse {
  id: string;
  email: string | null;
  name: string;
  role: UserRoleType;
  status: UserStatusType;
  lastCheckIn: string | null;
  createdAt: Date;
}

export interface UserListResponse {
  users: UserSummaryResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface UserDetailResponse extends UserSummaryResponse {
  checkInSettings: {
    deadlineTime: string;
    reminderTime: string;
    timezone: string;
  } | null;
  emergencyContactsCount: number;
  totalCheckIns: number;
  alertsCount: number;
}
