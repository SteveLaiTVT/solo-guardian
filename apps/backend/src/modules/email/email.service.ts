/**
 * @file email.service.ts
 * @description Email Service - Send emails via nodemailer
 * @task TASK-025, TASK-029, TASK-032
 * @design_state_version 2.0.0
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
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
  ): Promise<boolean> {
    this.logger.log(`Attempting to send alert email to: ${to}`);
    if (!this.transporter) {
      this.logger.error('Email transporter not initialized');
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'Solo Guardian <noreply@sologuardian.app>',
        to,
        subject: `[Solo Guardian] Safety Alert: ${userName}`,
        html: getAlertEmailHtml(contactName, userName, alertDate, triggeredAt),
        text: getAlertEmailText(contactName, userName, alertDate, triggeredAt),
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
    _timezone: string,
  ): Promise<boolean> {
    this.logger.log(`Attempting to send reminder email to: ${to}`);
    if (!this.transporter) {
      this.logger.error('Email transporter not initialized');
      return false;
    }

    try {
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'Solo Guardian <noreply@sologuardian.app>',
        to,
        subject: `[Solo Guardian] Reminder: Check in before ${deadlineTime}`,
        html: getReminderEmailHtml(userName, deadlineTime, appUrl),
        text: getReminderEmailText(userName, deadlineTime, appUrl),
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
  ): Promise<boolean> {
    this.logger.log(`Attempting to send verification email to: ${to}`);
    if (!this.transporter) {
      this.logger.error('Email transporter not initialized');
      return false;
    }

    try {
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      const verificationLink = `${appUrl}/verify-contact?token=${verificationToken}`;
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'Solo Guardian <noreply@sologuardian.app>',
        to,
        subject: '[Solo Guardian] Please verify your emergency contact status',
        html: getVerificationEmailHtml(contactName, userName, verificationLink),
        text: getVerificationEmailText(contactName, userName, verificationLink),
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
}
