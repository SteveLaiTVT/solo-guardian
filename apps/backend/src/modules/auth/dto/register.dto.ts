import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

/**
 * DTO for user registration
 * DONE(B): Validation implemented - TASK-001
 */
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}
