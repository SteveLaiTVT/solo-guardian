/**
 * @file email.service.ts
 * @description Email Service - Send emails via nodemailer with DB template support
 * @task TASK-025, TASK-029, TASK-032, TASK-051, TASK-067
 * @design_state_version 3.9.0
 */

import { Injectable, Logger, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { TemplatesService } from '../templates';
import {
  getAlertEmailHtml,
  getAlertEmailText,
  getReminderEmailHtml,
  getReminderEmailText,
  getVerificationEmailHtml,
  getVerificationEmailText,
} from './templates';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;

  constructor(
    @Inject(forwardRef(() => TemplatesService))
    private readonly templatesService: TemplatesService,
  ) {}

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
    }
  }

  async sendAlertEmail(
    to: string,
    contactName: string,
    userName: string,
    alertDate: string,
    triggeredAt: string,
    language: string = 'en',
  ): Promise<boolean> {
    this.logger.log(`Attempting to send alert email to: ${to}`);
    if (!this.transporter) {
      this.logger.error('Email transporter not initialized');
      return false;
    }

    try {
      const formattedTime = new Date(triggeredAt).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
      });

      const dbTemplate = await this.templatesService.renderEmail('alert', language, {
        contactName,
        userName,
        alertDate,
        triggeredAt: formattedTime,
      });

      let subject: string;
      let html: string;
      let text: string;

      if (dbTemplate) {
        subject = dbTemplate.subject;
        html = dbTemplate.html;
        text = dbTemplate.text;
      } else {
        subject = `[Solo Guardian] Safety Alert: ${userName}`;
        html = getAlertEmailHtml(contactName, userName, alertDate, triggeredAt);
        text = getAlertEmailText(contactName, userName, alertDate, triggeredAt);
      }

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

  async sendReminderEmail(
    to: string,
    userName: string,
    deadlineTime: string,
    timezone: string,
    language: string = 'en',
  ): Promise<boolean> {
    this.logger.log(`Attempting to send reminder email to: ${to}`);
    if (!this.transporter) {
      this.logger.error('Email transporter not initialized');
      return false;
    }

    try {
      const appUrl = process.env.APP_URL || 'http://localhost:3000';

      const dbTemplate = await this.templatesService.renderEmail('reminder', language, {
        userName,
        deadlineTime,
        timezone,
        appUrl,
      });

      let subject: string;
      let html: string;
      let text: string;

      if (dbTemplate) {
        subject = dbTemplate.subject;
        html = dbTemplate.html;
        text = dbTemplate.text;
      } else {
        subject = `[Solo Guardian] Reminder: Check in before ${deadlineTime}`;
        html = getReminderEmailHtml(userName, deadlineTime, appUrl);
        text = getReminderEmailText(userName, deadlineTime, appUrl);
      }

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

  async sendVerificationEmail(
    to: string,
    contactName: string,
    userName: string,
    verificationToken: string,
    language: string = 'en',
  ): Promise<boolean> {
    this.logger.log(`Attempting to send verification email to: ${to}`);
    if (!this.transporter) {
      this.logger.error('Email transporter not initialized');
      return false;
    }

    try {
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      const verificationLink = `${appUrl}/verify-contact?token=${verificationToken}`;

      const dbTemplate = await this.templatesService.renderEmail('verification', language, {
        contactName,
        userName,
        verificationLink,
        appUrl,
      });

      let subject: string;
      let html: string;
      let text: string;

      if (dbTemplate) {
        subject = dbTemplate.subject;
        html = dbTemplate.html;
        text = dbTemplate.text;
      } else {
        subject = '[Solo Guardian] Please verify your emergency contact status';
        html = getVerificationEmailHtml(contactName, userName, verificationLink);
        text = getVerificationEmailText(contactName, userName, verificationLink);
      }

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

  async sendContactLinkInvitationEmail(
    to: string,
    linkedUserName: string,
    elderName: string,
    invitationToken: string,
    language: string = 'en',
  ): Promise<boolean> {
    this.logger.log(`Attempting to send contact link invitation email to: ${to}`);
    if (!this.transporter) {
      this.logger.error('Email transporter not initialized');
      return false;
    }

    try {
      const appUrl = process.env.APP_URL || 'http://localhost:5173';
      const invitationLink = `${appUrl}/accept-contact-link/${invitationToken}`;

      const dbTemplate = await this.templatesService.renderEmail('contact_link_invitation', language, {
        linkedUserName,
        elderName,
        invitationLink,
        appUrl,
      });

      let subject: string;
      let html: string;
      let text: string;

      if (dbTemplate) {
        subject = dbTemplate.subject;
        html = dbTemplate.html;
        text = dbTemplate.text;
      } else {
        subject = `[Solo Guardian] ${elderName} added you as an emergency contact`;
        html = this.getContactLinkInvitationHtml(linkedUserName, elderName, invitationLink);
        text = this.getContactLinkInvitationText(linkedUserName, elderName, invitationLink);
      }

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'Solo Guardian <noreply@sologuardian.app>',
        to,
        subject,
        html,
        text,
      });
      this.logger.log(`Contact link invitation email sent successfully to: ${to}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send contact link invitation email to ${to}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return false;
    }
  }

  private getContactLinkInvitationHtml(
    linkedUserName: string,
    elderName: string,
    invitationLink: string,
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Emergency Contact Invitation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0;">Solo Guardian</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Emergency Contact Invitation</p>
  </div>
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px;">Hello ${linkedUserName},</p>
    <p><strong>${elderName}</strong> has added you as an emergency contact on Solo Guardian.</p>
    <p>As their emergency contact, you'll be notified if they miss their daily check-in, helping ensure their safety.</p>
    <p>Since you also have a Solo Guardian account, you can link your accounts to:</p>
    <ul>
      <li>View emergency alerts for ${elderName}</li>
      <li>See their check-in status when they need help</li>
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${invitationLink}" style="background: #667eea; color: white; padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">Accept Invitation</a>
    </div>
    <p style="color: #666; font-size: 14px;">This invitation will expire in 7 days.</p>
    <p style="color: #666; font-size: 14px;">If you didn't expect this invitation, you can safely ignore this email.</p>
  </div>
  <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">Solo Guardian - Keeping loved ones safe</p>
</body>
</html>`;
  }

  private getContactLinkInvitationText(
    linkedUserName: string,
    elderName: string,
    invitationLink: string,
  ): string {
    return `
Hello ${linkedUserName},

${elderName} has added you as an emergency contact on Solo Guardian.

As their emergency contact, you'll be notified if they miss their daily check-in, helping ensure their safety.

Since you also have a Solo Guardian account, you can link your accounts to:
- View emergency alerts for ${elderName}
- See their check-in status when they need help

Accept the invitation here: ${invitationLink}

This invitation will expire in 7 days.

If you didn't expect this invitation, you can safely ignore this email.

---
Solo Guardian - Keeping loved ones safe
`;
  }
}
