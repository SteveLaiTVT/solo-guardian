/**
 * @file register.dto.ts
 * @description DTO for user registration with flexible identifiers
 * @task TASK-001, TASK-078
 */
import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(USERNAME_REGEX, {
    message:
      'Username must start with a letter and contain only letters, numbers, underscores, and hyphens',
  })
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(PHONE_REGEX, {
    message: 'Phone must be in E.164 format (e.g., +1234567890)',
  })
  phone?: string;
}
