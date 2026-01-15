/**
 * @file contact-response.dto.ts
 * @description DTO for emergency contact response
 * @task TASK-015
 * @design_state_version 1.4.1
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
}
