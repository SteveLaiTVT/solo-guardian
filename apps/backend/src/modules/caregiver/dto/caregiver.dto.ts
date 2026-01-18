/**
 * @file caregiver.dto.ts
 * @description Caregiver DTOs
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class InviteElderDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  message?: string;
}

export class AcceptInvitationDto {
  @IsUUID()
  caregiverId!: string;
}

export class UpdateCaregiverRelationDto {
  @IsBoolean()
  @IsOptional()
  isAccepted?: boolean;
}

export interface ElderSummary {
  id: string;
  name: string;
  email: string | null;
  lastCheckIn: string | null;
  todayStatus: 'checked_in' | 'pending' | 'overdue';
  isAccepted: boolean;
}

export interface CaregiverSummary {
  id: string;
  name: string;
  email: string | null;
  isAccepted: boolean;
}

export interface ElderDetail extends ElderSummary {
  checkInSettings: {
    deadlineTime: string;
    reminderTime: string;
    timezone: string;
  } | null;
  pendingAlerts: number;
  emergencyContacts: Array<{
    id: string;
    name: string;
    isVerified: boolean;
  }>;
}
