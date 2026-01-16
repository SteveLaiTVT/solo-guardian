/**
 * @file contact-response.dto.ts
 * @description DTO for emergency contact response
 * @task TASK-015, TASK-035
 * @design_state_version 3.0.0
 */

import { NotificationChannel } from '@prisma/client';

export class ContactResponseDto {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  priority: number;
  isVerified: boolean;
  isActive: boolean;
  // DONE(B): Added preferredChannel field - TASK-035
  preferredChannel: NotificationChannel;
  createdAt: Date;
  updatedAt: Date;
}
