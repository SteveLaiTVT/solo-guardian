import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

/**
 * DTO for user registration
 *
 * TODO(B): Add any additional validation decorators if needed
 * Constraints:
 * - Email must be valid format
 * - Password: 8-100 characters
 * - Name: 2-50 characters
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
