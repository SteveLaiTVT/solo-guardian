/**
 * @file update-profile.dto.ts
 * @description DTO for updating user profile
 */
import { IsString, IsOptional, IsInt, Min, Max, MinLength, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2020)
  birthYear?: number | null;
}

export class ProfileResponseDto {
  id: string;
  name: string;
  email: string | null;
  username: string | null;
  phone: string | null;
  birthYear: number | null;
  createdAt: Date;
}
