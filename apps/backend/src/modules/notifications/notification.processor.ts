/**
 * @file notification.processor.ts
 * @description Notification Processor - Bull queue worker for notifications
 * @task TASK-026
 * @design_state_version 1.8.0
 */

import { Logger } from '@nestjs/common';
// DONE(B): Import Processor, Process from '@nestjs/bull' - TASK-026
import { Processor, Process, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
// DONE(B): Import Job from 'bull' - TASK-026
import { Job } from 'bull';
import { QUEUE_NAMES, NOTIFICATION_JOB_TYPES, SendEmailJobData } from '../queue';
import { EmailService } from '../email';
import { NotificationService } from './notification.service';

// DONE(B): Add @Processor decorator - TASK-026
@Processor(QUEUE_NAMES.NOTIFICATION)
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Process send-email job
   * DONE(B): Implement handleSendEmail - TASK-026
   */
  @Process(NOTIFICATION_JOB_TYPES.SEND_EMAIL)
  async handleSendEmail(job: Job<SendEmailJobData>): Promise<void> {
    const { notificationId, alertId, contactEmail, contactName, userName, alertDate, triggeredAt } =
      job.data;

    this.logger.log(`Processing email notification ${notificationId} to ${contactEmail}`);

    try {
      const success = await this.emailService.sendAlertEmail(
        contactEmail,
        contactName,
        userName,
        alertDate,
        triggeredAt,
      );

      if (success) {
        await this.notificationService.handleNotificationSent(notificationId, alertId);
        this.logger.log(`Email notification ${notificationId} sent successfully`);
      } else {
        // Email service returned false (handled error internally)
        throw new Error('Email service failed to send email');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Email notification ${notificationId} failed: ${errorMessage}`);

      // Mark as failed only on final attempt (Bull handles retries)
      if (job.attemptsMade >= (job.opts.attempts ?? 3) - 1) {
        await this.notificationService.handleNotificationFailed(notificationId, errorMessage);
      }

      // Re-throw to trigger Bull retry
      throw error;
    }
  }

  /**
   * Handle job completion
   * DONE(B): Implement onCompleted - TASK-026
   */
  @OnQueueCompleted()
  onCompleted(job: Job<SendEmailJobData>): void {
    this.logger.log(`Job ${job.id} completed for notification ${job.data.notificationId}`);
  }

  /**
   * Handle job failure
   * DONE(B): Implement onFailed - TASK-026
   */
  @OnQueueFailed()
  onFailed(job: Job<SendEmailJobData>, error: Error): void {
    this.logger.error(
      `Job ${job.id} failed for notification ${job.data.notificationId}: ${error.message}`,
    );
  }
}
