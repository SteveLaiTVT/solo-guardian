/**
 * @file alert-list.dto.ts
 * @description Alert list DTOs for admin
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { IsOptional, IsNumber, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { AlertStatus } from '@prisma/client';

export class AlertListQueryDto {
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
  @IsEnum(AlertStatus)
  status?: AlertStatus;
}

export interface AlertSummaryResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: AlertStatus;
  triggeredAt: Date;
  resolvedAt: Date | null;
}

export interface AlertListResponse {
  alerts: AlertSummaryResponse[];
  total: number;
  page: number;
  limit: number;
}
