/**
 * @file alert.service.ts
 * @description Alert Service - Business logic for alerts
 * @task TASK-027, TASK-070
 * @design_state_version 3.9.0
 */

import { Injectable, Logger, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AlertRepository } from './alert.repository';
import { NotificationService } from '../notifications';
// DONE(B): Import EmergencyContactsService - TASK-027
import { EmergencyContactsService } from '../emergency-contacts';
import { ContactResponseDto } from '../emergency-contacts/dto';
import type { Alert } from '@prisma/client';

// DONE(B): Implemented AlertService - TASK-027
@Injectable()
export class AlertService implements OnModuleInit {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    private readonly alertRepository: AlertRepository,
    private readonly notificationService: NotificationService,
    // DONE(B): Inject EmergencyContactsService with forwardRef - TASK-027, TASK-070
    @Inject(forwardRef(() => EmergencyContactsService))
    private readonly emergencyContactsService: EmergencyContactsService,
    private readonly moduleRef: ModuleRef,
  ) {}

  /**
   * Set up circular dependency reference on module init
   */
  onModuleInit(): void {
    // Set AlertService reference in NotificationService to handle circular dependency
    this.notificationService.setAlertService(this);
  }

  /**
   * Create an alert for missed check-in and queue notifications
   * DONE(B): Implement createAlert - TASK-027
   */
  async createAlert(
    userId: string,
    userName: string,
    alertDate: string,
  ): Promise<Alert | null> {
    // Check for existing alert (prevent duplicates)
    const existing = await this.alertRepository.findActiveByUserAndDate(userId, alertDate);
    if (existing) {
      this.logger.log(`Alert already exists for user ${userId} on ${alertDate}`);
      return null;
    }

    // Create alert
    const triggeredAt = new Date();
    const alert = await this.alertRepository.create({
      userId,
      alertDate,
      triggeredAt,
    });

    this.logger.log(`Created alert ${alert.id} for user ${userId} on ${alertDate}`);

    // Get active emergency contacts
    const allContacts: ContactResponseDto[] = await this.emergencyContactsService.findAll(userId);
    const activeContacts = allContacts.filter((c: ContactResponseDto) => c.isActive);

    if (activeContacts.length === 0) {
      this.logger.warn(`No active emergency contacts for user ${userId}, no notifications sent`);
      return alert;
    }

    // Queue notifications
    const contacts = activeContacts.map((c: ContactResponseDto) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
    }));

    await this.notificationService.queueAlertNotifications(
      alert.id,
      alertDate,
      triggeredAt,
      userName,
      contacts,
    );

    this.logger.log(`Queued ${contacts.length} notifications for alert ${alert.id}`);

    return alert;
  }

  /**
   * Resolve an alert (user checked in late)
   * DONE(B): Implement resolveAlert - TASK-027
   */
  async resolveAlert(userId: string, alertDate: string): Promise<Alert | null> {
    const alert = await this.alertRepository.findActiveByUserAndDate(userId, alertDate);
    if (!alert) {
      this.logger.log(`No active alert found for user ${userId} on ${alertDate}`);
      return null;
    }

    const resolved = await this.alertRepository.resolve(alert.id);
    this.logger.log(`Resolved alert ${alert.id} for user ${userId} (late check-in)`);

    return resolved;
  }

  /**
   * Mark alert as notified (all notifications sent)
   * DONE(B): Implement markAlertNotified - TASK-027
   */
  async markAlertNotified(alertId: string): Promise<void> {
    await this.alertRepository.markAsNotified(alertId);
    this.logger.log(`Alert ${alertId} marked as notified`);
  }

  /**
   * Get alerts for a user with pagination
   * DONE(B): Implement getUserAlerts - TASK-027
   */
  async getUserAlerts(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    data: Alert[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.alertRepository.findByUserId(userId, skip, limit),
      this.alertRepository.countByUserId(userId),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Get alert details with notifications
   * DONE(B): Implement getAlertDetails - TASK-027
   */
  async getAlertDetails(
    alertId: string,
    userId: string,
  ): Promise<{ alert: Alert; notifications: unknown[] } | null> {
    const alert = await this.alertRepository.findById(alertId);
    if (!alert || alert.userId !== userId) {
      return null;
    }

    const notifications = await this.notificationService.getAlertNotifications(alertId);

    return { alert, notifications };
  }

  /**
   * Expire old alerts
   * DONE(B): Implement expireOldAlerts - TASK-027
   */
  async expireOldAlerts(beforeDate: string): Promise<number> {
    const expirableAlerts = await this.alertRepository.findExpirableAlerts(beforeDate);

    for (const alert of expirableAlerts) {
      await this.alertRepository.expire(alert.id);
    }

    if (expirableAlerts.length > 0) {
      this.logger.log(`Expired ${expirableAlerts.length} old alerts before ${beforeDate}`);
    }

    return expirableAlerts.length;
  }

  async getActiveAlertsForUser(userId: string): Promise<Alert[]> {
    return this.alertRepository.findActiveAlertsByUserId(userId);
  }

  async hasActiveAlerts(userId: string): Promise<boolean> {
    const alerts = await this.alertRepository.findActiveAlertsByUserId(userId);
    return alerts.length > 0;
  }
}
