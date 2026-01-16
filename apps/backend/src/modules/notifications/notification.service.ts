/**
 * @file notification.service.ts
 * @description Notification Service - Business logic for notifications
 * @task TASK-026
 * @design_state_version 1.8.0
 */

import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
// DONE(B): Import InjectQueue from @nestjs/bull - TASK-026
import { InjectQueue } from '@nestjs/bull';
// DONE(B): Import Queue from 'bull' - TASK-026
import { Queue } from 'bull';
import { NotificationRepository } from './notification.repository';
import { QUEUE_NAMES, NOTIFICATION_JOB_TYPES, SendEmailJobData } from '../queue';
import type { Notification } from '@prisma/client';

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
    @InjectQueue(QUEUE_NAMES.NOTIFICATION)
    private readonly notificationQueue: Queue<SendEmailJobData>,
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
    }>,
  ): Promise<string[]> {
    this.logger.log(`Queueing notifications for alert ${alertId} to ${contacts.length} contacts`);

    const notificationIds: string[] = [];

    for (const contact of contacts) {
      // Create notification record
      const notification = await this.notificationRepository.create({
        alertId,
        contactId: contact.id,
        channel: 'email',
      });

      notificationIds.push(notification.id);

      // Queue email job
      const jobData: SendEmailJobData = {
        notificationId: notification.id,
        alertId,
        contactId: contact.id,
        contactName: contact.name,
        contactEmail: contact.email,
        userName,
        alertDate,
        triggeredAt: triggeredAt.toISOString(),
      };

      await this.notificationQueue.add(NOTIFICATION_JOB_TYPES.SEND_EMAIL, jobData);
      this.logger.log(`Queued email notification ${notification.id} for contact ${contact.name}`);
    }

    return notificationIds;
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
