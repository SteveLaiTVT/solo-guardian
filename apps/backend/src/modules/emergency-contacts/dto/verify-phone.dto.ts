/**
 * @file verify-phone.dto.ts
 * @description DTO for phone verification request
 * @task TASK-036
 * @design_state_version 3.4.0
 */
import { IsString, Length, Matches } from 'class-validator';

/**
 * DTO for verifying phone number with OTP code
 * DONE(B): Defined VerifyPhoneDto - TASK-036
 * @task TASK-036
 */
export class VerifyPhoneDto {
  @IsString()
  @Length(6, 6, { message: 'OTP code must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP code must contain only digits' })
  otpCode: string;
}
