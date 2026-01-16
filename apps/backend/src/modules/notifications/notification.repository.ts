/**
 * @file notification.repository.ts
 * @description Notification Repository - Database operations for notifications
 * @task TASK-026
 * @design_state_version 1.8.0
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// DONE(B): Import types from @prisma/client - TASK-026
import type {
  Notification,
  NotificationStatus,
  NotificationChannel,
} from '@prisma/client';

// DONE(B): Implemented NotificationRepository - TASK-026
@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a notification record
   * DONE(B): Implement create - TASK-026
   */
  async create(data: {
    alertId: string;
    contactId: string;
    channel: NotificationChannel;
  }): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        alertId: data.alertId,
        contactId: data.contactId,
        channel: data.channel,
        status: 'pending',
      },
    });
  }

  /**
   * Create multiple notifications in a batch
   * DONE(B): Implement createMany - TASK-026
   */
  async createMany(
    data: Array<{
      alertId: string;
      contactId: string;
      channel: NotificationChannel;
    }>,
  ): Promise<{ count: number }> {
    return this.prisma.notification.createMany({
      data: data.map((d) => ({
        alertId: d.alertId,
        contactId: d.contactId,
        channel: d.channel,
        status: 'pending' as NotificationStatus,
      })),
    });
  }

  /**
   * Update notification status to sent
   * DONE(B): Implement markAsSent - TASK-026
   */
  async markAsSent(id: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
    });
  }

  /**
   * Update notification status to failed
   * DONE(B): Implement markAsFailed - TASK-026
   */
  async markAsFailed(id: string, error: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: {
        status: 'failed',
        error,
      },
    });
  }

  /**
   * Find all notifications for an alert
   * DONE(B): Implement findByAlertId - TASK-026
   */
  async findByAlertId(alertId: string): Promise<
    Array<
      Notification & {
        contact: { id: string; name: string; email: string } | null;
      }
    >
  > {
    return this.prisma.notification.findMany({
      where: { alertId },
      include: {
        contact: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Find notification by ID
   * DONE(B): Implement findById - TASK-026
   */
  async findById(id: string): Promise<
    | (Notification & {
        contact: { id: string; name: string; email: string } | null;
        alert: { id: string; alertDate: string; status: string };
      })
    | null
  > {
    return this.prisma.notification.findUnique({
      where: { id },
      include: {
        contact: {
          select: { id: true, name: true, email: true },
        },
        alert: {
          select: { id: true, alertDate: true, status: true },
        },
      },
    });
  }

  /**
   * Count notifications by status for an alert
   * DONE(B): Implement countByAlertAndStatus - TASK-026
   */
  async countByAlertAndStatus(
    alertId: string,
    status: NotificationStatus,
  ): Promise<number> {
    return this.prisma.notification.count({
      where: { alertId, status },
    });
  }
}
