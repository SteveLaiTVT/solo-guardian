/**
 * @file create-contact.dto.ts
 * @description DTO for creating emergency contact
 * @task TASK-015, TASK-037
 * @design_state_version 3.8.0
 */
import { IsString, IsEmail, IsOptional, IsInt, Min, Max, MaxLength, IsIn } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priority?: number;

  @IsOptional()
  @IsIn(['email', 'sms'])
  preferredChannel?: 'email' | 'sms';
}
