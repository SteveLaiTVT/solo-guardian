/**
 * @file phone-verification.service.ts
 * @description Service for phone number verification via SMS OTP
 * @task TASK-036
 * @design_state_version 3.4.0
 */
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomInt, timingSafeEqual } from 'crypto';
import { EmergencyContactsRepository } from './emergency-contacts.repository';
import { ContactResponseDto } from './dto';
import { SmsService } from '../sms';
import { PrismaService } from '../../prisma/prisma.service';
import type { EmergencyContact } from '@prisma/client';

// DONE(B): Defined OTP_EXPIRY_MINUTES constant - TASK-036
const OTP_EXPIRY_MINUTES = 10;

@Injectable()
export class PhoneVerificationService {
  private readonly logger = new Logger(PhoneVerificationService.name);

  constructor(
    private readonly contactsRepository: EmergencyContactsRepository,
    private readonly smsService: SmsService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Send phone verification OTP to a contact
   * DONE(B): Implemented sendPhoneVerification - TASK-036
   * @task TASK-036
   */
  async sendPhoneVerification(
    contactId: string,
    userId: string,
  ): Promise<ContactResponseDto> {
    const contact = await this.contactsRepository.findById(contactId);
    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    if (!contact.phone) {
      throw new BadRequestException('Phone number not set for this contact');
    }

    if (contact.phoneVerified) {
      throw new BadRequestException('Phone number is already verified');
    }

    const otpCode = this.generateOtpCode();
    const updatedContact = await this.contactsRepository.setPhoneVerificationOtp(
      contactId,
      otpCode,
    );

    const maskedPhone = this.maskPhoneNumber(contact.phone);
    const smsSent = await this.smsService.sendVerificationSms(contact.phone, otpCode);

    if (!smsSent) {
      this.logger.error(`Failed to send verification SMS to ${maskedPhone}`);
    } else {
      this.logger.log(`Verification SMS sent to contact ${contactId} (${maskedPhone})`);
    }

    return this.mapToResponse(updatedContact);
  }

  /**
   * Verify phone number with OTP code
   * DONE(B): Implemented verifyPhone - TASK-036
   * @task TASK-036
   */
  async verifyPhone(
    contactId: string,
    userId: string,
    otpCode: string,
  ): Promise<ContactResponseDto> {
    const contact = await this.contactsRepository.findById(contactId);
    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    if (!contact.phoneOtp) {
      throw new BadRequestException('No pending phone verification');
    }

    if (!contact.phoneOtpExpiresAt || contact.phoneOtpExpiresAt < new Date()) {
      throw new BadRequestException('OTP code has expired');
    }

    // Use constant-time comparison to prevent timing attacks
    const otpMatches = this.compareOtpConstantTime(otpCode, contact.phoneOtp);
    if (!otpMatches) {
      throw new BadRequestException('Invalid OTP code');
    }

    const updatedContact = await this.contactsRepository.markPhoneVerified(contactId);
    const maskedPhone = this.maskPhoneNumber(contact.phone ?? '');
    this.logger.log(`Phone verified for contact ${contactId} (${maskedPhone})`);

    return this.mapToResponse(updatedContact);
  }

  /**
   * Resend phone verification OTP
   * DONE(B): Implemented resendPhoneVerification - TASK-036
   * @task TASK-036
   */
  async resendPhoneVerification(
    contactId: string,
    userId: string,
  ): Promise<ContactResponseDto> {
    const contact = await this.contactsRepository.findById(contactId);
    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    if (!contact.phone) {
      throw new BadRequestException('Phone number not set for this contact');
    }

    if (contact.phoneVerified) {
      throw new BadRequestException('Phone number is already verified');
    }

    const otpCode = this.generateOtpCode();
    const updatedContact = await this.contactsRepository.setPhoneVerificationOtp(
      contactId,
      otpCode,
    );

    const maskedPhone = this.maskPhoneNumber(contact.phone);
    const smsSent = await this.smsService.sendVerificationSms(contact.phone, otpCode);

    if (!smsSent) {
      this.logger.error(`Failed to resend verification SMS to ${maskedPhone}`);
    } else {
      this.logger.log(`Verification SMS resent to contact ${contactId} (${maskedPhone})`);
    }

    return this.mapToResponse(updatedContact);
  }

  /**
   * Generate a 6-digit OTP code
   * DONE(B): Implemented generateOtpCode - TASK-036
   * @task TASK-036
   */
  private generateOtpCode(): string {
    // Use crypto.randomInt for cryptographic randomness
    const code = randomInt(0, 1000000);
    return code.toString().padStart(6, '0');
  }

  /**
   * Compare OTP codes using constant-time comparison
   * Prevents timing attacks by ensuring comparison takes same time regardless of input
   * @task TASK-036
   */
  private compareOtpConstantTime(inputOtp: string, storedOtp: string): boolean {
    // Ensure both strings are the same length to prevent length-based timing attacks
    if (inputOtp.length !== storedOtp.length) {
      return false;
    }
    return timingSafeEqual(Buffer.from(inputOtp), Buffer.from(storedOtp));
  }

  /**
   * Mask phone number for privacy in logs
   * Shows only last 4 digits
   * @task TASK-036
   */
  private maskPhoneNumber(phone: string): string {
    if (phone.length <= 4) {
      return '****';
    }
    return `****${phone.slice(-4)}`;
  }

  /**
   * Map contact entity to response DTO
   * DONE(B): Implemented mapToResponse - TASK-036
   * @task TASK-036
   */
  private mapToResponse(contact: EmergencyContact): ContactResponseDto {
    return {
      id: contact.id,
      userId: contact.userId,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      priority: contact.priority,
      isVerified: contact.isVerified,
      isActive: contact.isActive,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      phoneVerified: contact.phoneVerified,
      preferredChannel: contact.preferredChannel as 'email' | 'sms',
    };
  }
}
