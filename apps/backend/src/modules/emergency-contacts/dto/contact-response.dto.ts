/**
 * @file contact-response.dto.ts
 * @description DTO for emergency contact response
 * @task TASK-015, TASK-036, TASK-065
 * @design_state_version 3.9.0
 */

export class ContactResponseDto {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  priority: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // DONE(B): Added phoneVerified field - TASK-036
  phoneVerified: boolean;
  // DONE(B): Added preferredChannel field - TASK-036
  preferredChannel: 'email' | 'sms';
  // DONE(B): Added linked user fields - TASK-065
  linkedUserId: string | null;
  linkedUserName: string | null;
  invitationStatus: 'none' | 'pending' | 'accepted';
}
