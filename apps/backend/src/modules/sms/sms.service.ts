/**
 * @file sms.service.ts
 * @description SMS Service - Send SMS messages via Twilio
 * @task TASK-034
 * @design_state_version 3.1.0
 */

// DONE(B): Import Injectable, Logger, OnModuleInit from '@nestjs/common' - TASK-034
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

// DONE(B): Import Twilio client - TASK-034
import twilio from 'twilio';
import type { Twilio } from 'twilio';

/**
 * SMS Service - Provides SMS sending capabilities via Twilio
 * DONE(B): Define SmsService class - TASK-034
 */
@Injectable()
export class SmsService implements OnModuleInit {
  // DONE(B): Add private logger - TASK-034
  private readonly logger = new Logger(SmsService.name);

  // DONE(B): Add private twilioClient property - TASK-034
  private twilioClient: Twilio | null = null;

  // DONE(B): Add private fromNumber property - TASK-034
  private fromNumber = '';

  /**
   * Initialize Twilio client on module startup
   * DONE(B): Implement onModuleInit - TASK-034
   */
  async onModuleInit(): Promise<void> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !phoneNumber) {
      this.logger.warn(
        'Twilio credentials not configured. SMS functionality disabled.',
      );
      return;
    }

    try {
      this.twilioClient = twilio(accountSid, authToken);
      this.fromNumber = phoneNumber;
      this.logger.log('Twilio client initialized successfully');
    } catch (error) {
      this.logger.warn(
        `Failed to initialize Twilio client: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Send an SMS alert to an emergency contact
   * DONE(B): Implement sendAlertSms - TASK-034
   *
   * @param to - Phone number in E.164 format (+1234567890)
   * @param contactName - Name of the emergency contact
   * @param userName - Name of the user who missed check-in
   * @param _alertDate - Date of the missed check-in (formatted) - unused in message
   */
  async sendAlertSms(
    to: string,
    contactName: string,
    userName: string,
    _alertDate: string,
  ): Promise<boolean> {
    const maskedPhone = this.maskPhoneNumber(to);
    this.logger.log(`Attempting to send alert SMS to: ${maskedPhone}`);

    if (!this.twilioClient) {
      this.logger.error('Twilio client not initialized');
      return false;
    }

    if (!this.validatePhoneNumber(to)) {
      this.logger.error(`Invalid phone number format: ${maskedPhone}`);
      return false;
    }

    try {
      // Message kept under 160 characters for single segment
      const message = `[Solo Guardian] Alert: ${userName} has not checked in today. Please check on them.`;

      await this.twilioClient.messages.create({
        body: message,
        from: this.fromNumber,
        to,
      });

      this.logger.log(`Alert SMS sent successfully to: ${maskedPhone}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send alert SMS to ${maskedPhone}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return false;
    }
  }

  /**
   * Send a verification SMS with OTP code
   * DONE(B): Implement sendVerificationSms - TASK-034
   *
   * @param to - Phone number in E.164 format
   * @param code - 6-digit verification code
   */
  async sendVerificationSms(to: string, code: string): Promise<boolean> {
    const maskedPhone = this.maskPhoneNumber(to);
    this.logger.log(`Attempting to send verification SMS to: ${maskedPhone}`);

    if (!this.twilioClient) {
      this.logger.error('Twilio client not initialized');
      return false;
    }

    if (!this.validatePhoneNumber(to)) {
      this.logger.error(`Invalid phone number format: ${maskedPhone}`);
      return false;
    }

    try {
      // Message kept under 160 characters for single segment
      const message = `[Solo Guardian] Your verification code is: ${code}. Valid for 10 minutes.`;

      await this.twilioClient.messages.create({
        body: message,
        from: this.fromNumber,
        to,
      });

      this.logger.log(`Verification SMS sent successfully to: ${maskedPhone}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send verification SMS to ${maskedPhone}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return false;
    }
  }

  /**
   * Validate phone number format (E.164)
   * DONE(B): Implement validatePhoneNumber - TASK-034
   *
   * @param phone - Phone number to validate
   * @returns true if valid E.164 format
   */
  validatePhoneNumber(phone: string): boolean {
    return /^\+[1-9]\d{1,14}$/.test(phone);
  }

  /**
   * Mask phone number for privacy in logs
   * Shows only last 4 digits
   * @task TASK-034
   */
  private maskPhoneNumber(phone: string): string {
    if (phone.length <= 4) {
      return '****';
    }
    return `****${phone.slice(-4)}`;
  }
}
