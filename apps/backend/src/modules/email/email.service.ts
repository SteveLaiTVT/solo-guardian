/**
 * @file email.service.ts
 * @description Email Service - Send emails via nodemailer
 * @task TASK-025
 * @design_state_version 1.8.0
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
// DONE(B): Import nodemailer and Transporter type - TASK-025
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// DONE(B): Implemented EmailService - TASK-025
@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  // DONE(B): Add private transporter - TASK-025
  private transporter: Transporter | null = null;

  /**
   * Initialize transporter on module init
   * DONE(B): Implement onModuleInit - TASK-025
   */
  async onModuleInit(): Promise<void> {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await this.transporter.verify();
      this.logger.log('SMTP transporter verified successfully');
    } catch (error) {
      this.logger.warn(
        `SMTP transporter verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      // Don't throw - allow app to start even if SMTP is not configured
    }
  }

  /**
   * Send an alert email to emergency contact
   * DONE(B): Implement sendAlertEmail - TASK-025
   */
  async sendAlertEmail(
    to: string,
    contactName: string,
    userName: string,
    alertDate: string,
    triggeredAt: string,
  ): Promise<boolean> {
    this.logger.log(`Attempting to send alert email to: ${to}`);

    if (!this.transporter) {
      this.logger.error('Email transporter not initialized');
      return false;
    }

    try {
      const subject = `[Solo Guardian] Safety Alert: ${userName}`;
      const html = this.getAlertEmailHtml(contactName, userName, alertDate, triggeredAt);
      const text = this.getAlertEmailText(contactName, userName, alertDate, triggeredAt);

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'Solo Guardian <noreply@sologuardian.app>',
        to,
        subject,
        html,
        text,
      });

      this.logger.log(`Alert email sent successfully to: ${to}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send alert email to ${to}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return false;
    }
  }

  /**
   * Generate HTML content for alert email
   * DONE(B): Implement getAlertEmailHtml - TASK-025
   */
  private getAlertEmailHtml(
    contactName: string,
    userName: string,
    alertDate: string,
    triggeredAt: string,
  ): string {
    const formattedTime = new Date(triggeredAt).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
    <h2 style="color: #dc3545; margin-top: 0;">⚠️ Safety Alert</h2>
    <p>Dear ${contactName},</p>
    <p><strong>${userName}</strong> has not checked in today.</p>
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Date:</strong> ${alertDate}</p>
      <p style="margin: 5px 0;"><strong>Expected by:</strong> ${formattedTime}</p>
    </div>
    <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
      <p style="margin: 0;"><strong>Please check on ${userName} to ensure they are safe.</strong></p>
    </div>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
    <p style="color: #6c757d; font-size: 12px; margin-bottom: 0;">
      This is an automated safety alert from Solo Guardian.<br>
      You received this because you are listed as an emergency contact.
    </p>
  </div>
</body>
</html>`.trim();
  }

  /**
   * Generate plain text content for alert email (fallback)
   * DONE(B): Implement getAlertEmailText - TASK-025
   */
  private getAlertEmailText(
    contactName: string,
    userName: string,
    alertDate: string,
    triggeredAt: string,
  ): string {
    const formattedTime = new Date(triggeredAt).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    return `
SAFETY ALERT

Dear ${contactName},

${userName} has not checked in today.

Date: ${alertDate}
Expected by: ${formattedTime}

Please check on ${userName} to ensure they are safe.

---
This is an automated safety alert from Solo Guardian.
You received this because you are listed as an emergency contact.
    `.trim();
  }
}
