/**
 * @file alert.repository.ts
 * @description Alert Repository - Database operations for alerts
 * @task TASK-027, TASK-070
 * @design_state_version 3.9.0
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// DONE(B): Import Alert, AlertStatus from @prisma/client - TASK-027
import type { Alert, AlertStatus } from '@prisma/client';

// DONE(B): Implemented AlertRepository - TASK-027
@Injectable()
export class AlertRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new alert
   * DONE(B): Implement create - TASK-027
   */
  async create(data: {
    userId: string;
    alertDate: string;
    triggeredAt: Date;
  }): Promise<Alert> {
    return this.prisma.alert.create({
      data: {
        userId: data.userId,
        alertDate: data.alertDate,
        triggeredAt: data.triggeredAt,
        status: 'triggered',
      },
    });
  }

  /**
   * Update alert status to 'notified'
   * DONE(B): Implement markAsNotified - TASK-027
   */
  async markAsNotified(id: string): Promise<Alert> {
    return this.prisma.alert.update({
      where: { id },
      data: { status: 'notified' },
    });
  }

  /**
   * Update alert status to 'resolved' (user checked in late)
   * DONE(B): Implement resolve - TASK-027
   */
  async resolve(id: string): Promise<Alert> {
    return this.prisma.alert.update({
      where: { id },
      data: {
        status: 'resolved',
        resolvedAt: new Date(),
      },
    });
  }

  /**
   * Update alert status to 'expired'
   * DONE(B): Implement expire - TASK-027
   */
  async expire(id: string): Promise<Alert> {
    return this.prisma.alert.update({
      where: { id },
      data: { status: 'expired' },
    });
  }

  /**
   * Find alert by ID
   * DONE(B): Implement findById - TASK-027
   */
  async findById(
    id: string,
  ): Promise<(Alert & { user: { id: string; name: string; email: string | null } }) | null> {
    return this.prisma.alert.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  /**
   * Find active alert for user on given date
   * DONE(B): Implement findActiveByUserAndDate - TASK-027
   */
  async findActiveByUserAndDate(
    userId: string,
    alertDate: string,
  ): Promise<Alert | null> {
    return this.prisma.alert.findFirst({
      where: {
        userId,
        alertDate,
        status: { in: ['triggered', 'notified'] },
      },
    });
  }

  /**
   * Find alerts for user with pagination
   * DONE(B): Implement findByUserId - TASK-027
   */
  async findByUserId(userId: string, skip: number, take: number): Promise<Alert[]> {
    return this.prisma.alert.findMany({
      where: { userId },
      orderBy: { triggeredAt: 'desc' },
      skip,
      take,
    });
  }

  /**
   * Count alerts for user
   * DONE(B): Implement countByUserId - TASK-027
   */
  async countByUserId(userId: string): Promise<number> {
    return this.prisma.alert.count({
      where: { userId },
    });
  }

  /**
   * Find all triggered alerts that need expiring
   * DONE(B): Implement findExpirableAlerts - TASK-027
   */
  async findExpirableAlerts(beforeDate: string): Promise<Alert[]> {
    return this.prisma.alert.findMany({
      where: {
        alertDate: { lt: beforeDate },
        status: { in: ['triggered', 'notified'] },
      },
    });
  }

  async findActiveAlertsByUserId(userId: string): Promise<Alert[]> {
    return this.prisma.alert.findMany({
      where: {
        userId,
        status: { in: ['triggered', 'notified'] },
      },
      orderBy: { triggeredAt: 'desc' },
    });
  }
}
