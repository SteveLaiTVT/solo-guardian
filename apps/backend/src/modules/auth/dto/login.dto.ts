/**
 * @file login.dto.ts
 * @description DTO for user login with flexible identifier
 * @task TASK-079
 */
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(1, { message: 'Identifier is required' })
  identifier: string;

  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}
