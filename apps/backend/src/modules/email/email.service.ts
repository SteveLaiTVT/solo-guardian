/**
 * @file email.service.ts
 * @description Email Service - Send emails via nodemailer
 * @task TASK-025, TASK-029, TASK-032
 * @design_state_version 2.0.0
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

  // ============================================================
  // Reminder Email - TASK-029
  // ============================================================

  /**
   * Send a reminder email to user before deadline
   * DONE(B): Implement sendReminderEmail - TASK-029
   */
  async sendReminderEmail(
    to: string,
    userName: string,
    deadlineTime: string,
    timezone: string,
  ): Promise<boolean> {
    this.logger.log(`Attempting to send reminder email to: ${to}`);

    if (!this.transporter) {
      this.logger.error('Email transporter not initialized');
      return false;
    }

    try {
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      const subject = `[Solo Guardian] Reminder: Check in before ${deadlineTime}`;
      const html = this.getReminderEmailHtml(userName, deadlineTime, appUrl);
      const text = this.getReminderEmailText(userName, deadlineTime, appUrl);

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'Solo Guardian <noreply@sologuardian.app>',
        to,
        subject,
        html,
        text,
      });

      this.logger.log(`Reminder email sent successfully to: ${to}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send reminder email to ${to}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return false;
    }
  }

  /**
   * Generate HTML content for reminder email
   * DONE(B): Implement getReminderEmailHtml - TASK-029
   */
  private getReminderEmailHtml(
    userName: string,
    deadlineTime: string,
    appUrl: string,
  ): string {
    const checkInUrl = `${appUrl}/check-in`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
    <h2 style="color: #4A90A4; margin-top: 0;">Good Morning!</h2>
    <p>Hi ${userName},</p>
    <p>This is a friendly reminder to check in today. Your deadline is <strong>${deadlineTime}</strong>.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${checkInUrl}"
         style="background: #28a745; color: white; padding: 15px 30px;
                text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Check In Now
      </a>
    </div>
    <p style="color: #666;">Checking in takes just a second and helps your loved ones know you're safe.</p>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
    <p style="color: #6c757d; font-size: 12px; margin-bottom: 0;">
      This is an automated reminder from Solo Guardian.<br>
      You can adjust your reminder settings in the app.
    </p>
  </div>
</body>
</html>`.trim();
  }

  /**
   * Generate plain text content for reminder email
   * DONE(B): Implement getReminderEmailText - TASK-029
   */
  private getReminderEmailText(
    userName: string,
    deadlineTime: string,
    appUrl: string,
  ): string {
    const checkInUrl = `${appUrl}/check-in`;

    return `
Good Morning!

Hi ${userName},

This is a friendly reminder to check in today. Your deadline is ${deadlineTime}.

Check in now: ${checkInUrl}

Checking in takes just a second and helps your loved ones know you're safe.

---
This is an automated reminder from Solo Guardian.
You can adjust your reminder settings in the app.
    `.trim();
  }

  // ============================================================
  // Contact Verification Email - TASK-032
  // ============================================================

  /**
   * Send verification email to new emergency contact
   * DONE(B): Implement sendVerificationEmail - TASK-032
   */
  async sendVerificationEmail(
    to: string,
    contactName: string,
    userName: string,
    verificationToken: string,
  ): Promise<boolean> {
    this.logger.log(`Attempting to send verification email to: ${to}`);

    if (!this.transporter) {
      this.logger.error('Email transporter not initialized');
      return false;
    }

    try {
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      const verificationLink = `${appUrl}/verify-contact?token=${verificationToken}`;
      const subject = '[Solo Guardian] Please verify your emergency contact status';
      const html = this.getVerificationEmailHtml(contactName, userName, verificationLink);
      const text = this.getVerificationEmailText(contactName, userName, verificationLink);

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'Solo Guardian <noreply@sologuardian.app>',
        to,
        subject,
        html,
        text,
      });

      this.logger.log(`Verification email sent successfully to: ${to}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${to}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return false;
    }
  }

  /**
   * Generate HTML content for verification email
   * DONE(B): Implement getVerificationEmailHtml - TASK-032
   */
  private getVerificationEmailHtml(
    contactName: string,
    userName: string,
    verificationLink: string,
  ): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
    <h2 style="color: #333; margin-top: 0;">Emergency Contact Request</h2>
    <p>Dear ${contactName},</p>
    <p><strong>${userName}</strong> has added you as an emergency contact on Solo Guardian.</p>
    <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 0;"><strong>What is Solo Guardian?</strong></p>
      <p style="margin: 10px 0 0 0;">Solo Guardian helps people living alone stay safe by checking in daily. If ${userName} misses their check-in, you'll be notified so you can check on them.</p>
    </div>
    <p>Please verify that you agree to be an emergency contact:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationLink}"
         style="background: #28a745; color: white; padding: 15px 30px;
                text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Verify Now
      </a>
    </div>
    <p style="color: #666; font-size: 14px;">
      This link expires in 24 hours. If you didn't expect this email or don't wish to be an emergency contact, you can simply ignore it.
    </p>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
    <p style="color: #999; font-size: 12px; margin-bottom: 0;">
      Solo Guardian - Keeping loved ones safe
    </p>
  </div>
</body>
</html>`.trim();
  }

  /**
   * Generate plain text content for verification email
   * DONE(B): Implement getVerificationEmailText - TASK-032
   */
  private getVerificationEmailText(
    contactName: string,
    userName: string,
    verificationLink: string,
  ): string {
    return `
EMERGENCY CONTACT REQUEST

Dear ${contactName},

${userName} has added you as an emergency contact on Solo Guardian.

What is Solo Guardian?
Solo Guardian helps people living alone stay safe by checking in daily.
If ${userName} misses their check-in, you'll be notified so you can check on them.

Please verify that you agree to be an emergency contact by clicking this link:

${verificationLink}

This link expires in 24 hours.

If you didn't expect this email or don't wish to be an emergency contact,
you can simply ignore it.

---
Solo Guardian - Keeping loved ones safe
    `.trim();
  }
}
