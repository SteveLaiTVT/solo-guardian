// ============================================================
// SMS Service - Twilio SMS integration
// @task TASK-034
// @design_state_version 3.0.0
// ============================================================

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

/**
 * E.164 phone number format validation
 * Must start with + followed by 7-15 digits
 */
const E164_REGEX = /^\+[1-9]\d{6,14}$/;

/**
 * Mask phone number for logging (show only last 4 digits)
 */
function maskPhoneNumber(phone: string): string {
  if (phone.length <= 4) return '****';
  return '*'.repeat(phone.length - 4) + phone.slice(-4);
}

/**
 * SMS Service - Sends SMS via Twilio
 * DONE(B): SMS provider integration - TASK-034
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly client: Twilio | null;
  private readonly fromNumber: string;
  private readonly isConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.fromNumber =
      this.configService.get<string>('TWILIO_PHONE_NUMBER') || '';

    if (accountSid && authToken && this.fromNumber) {
      this.client = new Twilio(accountSid, authToken);
      this.isConfigured = true;
      this.logger.log('SMS service initialized with Twilio');
    } else {
      this.client = null;
      this.isConfigured = false;
      this.logger.warn(
        'SMS service not configured - missing Twilio credentials',
      );
    }
  }

  /**
   * Check if SMS service is configured and ready
   */
  isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Validate phone number is in E.164 format
   */
  validatePhoneNumber(phone: string): boolean {
    return E164_REGEX.test(phone);
  }

  /**
   * Send SMS to a phone number
   * @param to - Phone number in E.164 format
   * @param body - SMS message body
   * @returns true on success, false on failure
   */
  async sendSms(to: string, body: string): Promise<boolean> {
    const maskedPhone = maskPhoneNumber(to);

    if (!this.isConfigured || !this.client) {
      this.logger.warn(`SMS not configured, skipping send to ${maskedPhone}`);
      return false;
    }

    if (!this.validatePhoneNumber(to)) {
      this.logger.warn(`Invalid phone number format: ${maskedPhone}`);
      return false;
    }

    try {
      const message = await this.client.messages.create({
        body,
        from: this.fromNumber,
        to,
      });

      this.logger.log(
        `SMS sent to ${maskedPhone}, SID: ${message.sid}, Status: ${message.status}`,
      );
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send SMS to ${maskedPhone}: ${errorMessage}`);

      // Retry once on network errors
      if (this.isNetworkError(error)) {
        return this.retrySend(to, body, maskedPhone);
      }

      return false;
    }
  }

  /**
   * Check if error is a network-related error
   */
  private isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      const networkKeywords = ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND'];
      return networkKeywords.some((keyword) =>
        error.message.includes(keyword),
      );
    }
    return false;
  }

  /**
   * Retry sending SMS once
   */
  private async retrySend(
    to: string,
    body: string,
    maskedPhone: string,
  ): Promise<boolean> {
    this.logger.log(`Retrying SMS to ${maskedPhone}...`);
    try {
      const message = await this.client!.messages.create({
        body,
        from: this.fromNumber,
        to,
      });
      this.logger.log(`SMS retry successful to ${maskedPhone}, SID: ${message.sid}`);
      return true;
    } catch (retryError) {
      const errorMessage =
        retryError instanceof Error ? retryError.message : 'Unknown error';
      this.logger.error(`SMS retry failed to ${maskedPhone}: ${errorMessage}`);
      return false;
    }
  }

  /**
   * Send alert SMS to emergency contact
   * @param to - Phone number in E.164 format
   * @param contactName - Name of the emergency contact
   * @param userName - Name of the user who missed check-in
   * @param alertDate - Date of missed check-in (YYYY-MM-DD)
   * @returns true on success, false on failure
   */
  async sendAlertSms(
    to: string,
    contactName: string,
    userName: string,
    alertDate: string,
  ): Promise<boolean> {
    const message = this.formatAlertMessage(userName, alertDate);
    return this.sendSms(to, message);
  }

  /**
   * Format alert message (kept under 160 chars for single SMS segment)
   */
  private formatAlertMessage(userName: string, alertDate: string): string {
    return (
      `[Solo Guardian] ALERT: ${userName} has not checked in today (${alertDate}). ` +
      `Please check on them.`
    );
  }
}
