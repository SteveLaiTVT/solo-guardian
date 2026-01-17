/**
 * @file invitation.dto.ts
 * @description DTOs for caregiver invitation system
 * @task TASK-058
 * @design_state_version 3.8.0
 */
import { IsString, IsEmail, IsOptional, IsIn } from 'class-validator';

export type RelationshipType = 'caregiver' | 'family' | 'caretaker';

export class CreateInvitationDto {
  @IsString()
  @IsIn(['caregiver', 'family', 'caretaker'])
  relationshipType: RelationshipType;

  @IsEmail()
  @IsOptional()
  targetEmail?: string;

  @IsString()
  @IsOptional()
  targetPhone?: string;
}

export class InvitationResponseDto {
  id: string;
  token: string;
  relationshipType: RelationshipType;
  targetEmail: string | null;
  targetPhone: string | null;
  expiresAt: Date;
  inviterName: string;
  qrUrl: string;
}

export class InvitationDetailsDto {
  id: string;
  relationshipType: RelationshipType;
  inviter: {
    id: string;
    name: string;
    email: string;
  };
  expiresAt: Date;
  isExpired: boolean;
  isAccepted: boolean;
}
