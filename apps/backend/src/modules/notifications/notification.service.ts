/**
 * @file notification.service.ts
 * @description Notification Service - Business logic for notifications
 * @task TASK-026, TASK-035
 * @design_state_version 3.2.1
 */

import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
// DONE(B): Import InjectQueue from @nestjs/bull - TASK-026
import { InjectQueue } from '@nestjs/bull';
// DONE(B): Import Queue from 'bull' - TASK-026
import { Queue } from 'bull';
import { NotificationRepository } from './notification.repository';
import { QUEUE_NAMES, NOTIFICATION_JOB_TYPES, SendEmailJobData, SendSmsJobData } from '../queue';
import type { Notification, NotificationChannel } from '@prisma/client';

// Forward reference type for AlertService to avoid circular dependency
interface AlertServiceInterface {
  markAlertNotified(alertId: string): Promise<void>;
}

// DONE(B): Implemented NotificationService - TASK-026
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private alertService: AlertServiceInterface | null = null;

  constructor(
    private readonly notificationRepository: NotificationRepository,
    // DONE(B): Inject notification queue - TASK-026
    // DONE(B): Update Queue type to union - TASK-035
    @InjectQueue(QUEUE_NAMES.NOTIFICATION)
    private readonly notificationQueue: Queue<SendEmailJobData | SendSmsJobData>,
  ) {}

  /**
   * Set alert service reference (called by AlertModule to avoid circular dependency)
   */
  setAlertService(alertService: AlertServiceInterface): void {
    this.alertService = alertService;
  }

  /**
   * Queue notifications for all emergency contacts of a user
   * DONE(B): Implement queueAlertNotifications - TASK-026
   * DONE(B): Add SMS channel support - TASK-035
   * @task TASK-035
   */
  async queueAlertNotifications(
    alertId: string,
    alertDate: string,
    triggeredAt: Date,
    userName: string,
    contacts: Array<{
      id: string;
      name: string;
      email: string;
      phone: string | null;
      preferredChannel?: NotificationChannel;
    }>,
  ): Promise<string[]> {
    this.logger.log(`Queueing notifications for alert ${alertId} to ${contacts.length} contacts`);

    const notificationIds: string[] = [];

    for (const contact of contacts) {
      // DONE(B): Determine channel based on preferredChannel and available contact info - TASK-035
      // If preferredChannel is 'sms' and phone exists, use SMS; otherwise use email
      const channel: NotificationChannel = this.determineChannel(contact);

      // Create notification record
      const notification = await this.notificationRepository.create({
        alertId,
        contactId: contact.id,
        channel,
      });

      notificationIds.push(notification.id);

      // DONE(B): Queue appropriate job based on channel - TASK-035
      await this.queueNotificationJob(notification.id, alertId, contact, userName, alertDate, triggeredAt, channel);
    }

    return notificationIds;
  }

  /**
   * Determine the notification channel for a contact
   * @task TASK-035
   */
  private determineChannel(contact: {
    phone: string | null;
    preferredChannel?: NotificationChannel;
  }): NotificationChannel {
    // Use SMS only if preferred and phone number is available
    if (contact.preferredChannel === 'sms' && contact.phone) {
      return 'sms';
    }
    // Default to email (fallback if SMS not possible)
    return 'email';
  }

  /**
   * Queue the appropriate notification job based on channel
   * @task TASK-035
   */
  private async queueNotificationJob(
    notificationId: string,
    alertId: string,
    contact: { id: string; name: string; email: string; phone: string | null },
    userName: string,
    alertDate: string,
    triggeredAt: Date,
    channel: NotificationChannel,
  ): Promise<void> {
    if (channel === 'sms' && contact.phone) {
      const smsJobData: SendSmsJobData = {
        notificationId,
        alertId,
        contactId: contact.id,
        contactName: contact.name,
        contactPhone: contact.phone,
        userName,
        alertDate,
        triggeredAt: triggeredAt.toISOString(),
      };
      await this.notificationQueue.add(NOTIFICATION_JOB_TYPES.SEND_SMS, smsJobData);
      this.logger.log(`Queued SMS notification ${notificationId} for contact ${contact.name}`);
    } else {
      const emailJobData: SendEmailJobData = {
        notificationId,
        alertId,
        contactId: contact.id,
        contactName: contact.name,
        contactEmail: contact.email,
        userName,
        alertDate,
        triggeredAt: triggeredAt.toISOString(),
      };
      await this.notificationQueue.add(NOTIFICATION_JOB_TYPES.SEND_EMAIL, emailJobData);
      this.logger.log(`Queued email notification ${notificationId} for contact ${contact.name}`);
    }
  }

  /**
   * Handle successful notification send
   * DONE(B): Implement handleNotificationSent - TASK-026
   */
  async handleNotificationSent(
    notificationId: string,
    alertId: string,
  ): Promise<void> {
    await this.notificationRepository.markAsSent(notificationId);
    this.logger.log(`Notification ${notificationId} marked as sent`);

    // Check if all notifications for this alert are now sent or failed
    const pendingCount = await this.notificationRepository.countByAlertAndStatus(
      alertId,
      'pending',
    );

    if (pendingCount === 0 && this.alertService) {
      await this.alertService.markAlertNotified(alertId);
      this.logger.log(`All notifications for alert ${alertId} processed, marked as notified`);
    }
  }

  /**
   * Handle failed notification
   * DONE(B): Implement handleNotificationFailed - TASK-026
   */
  async handleNotificationFailed(
    notificationId: string,
    error: string,
  ): Promise<void> {
    await this.notificationRepository.markAsFailed(notificationId, error);
    this.logger.error(`Notification ${notificationId} failed: ${error}`);
  }

  /**
   * Get notifications for an alert
   * DONE(B): Implement getAlertNotifications - TASK-026
   */
  async getAlertNotifications(alertId: string): Promise<
    Array<
      Notification & {
        contact: { id: string; name: string; email: string } | null;
      }
    >
  > {
    return this.notificationRepository.findByAlertId(alertId);
  }
}
