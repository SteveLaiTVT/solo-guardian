/**
 * @file analytics.repository.ts
 * @description Repository for analytics event storage
 * @task TASK-100
 * @design_state_version 3.9.0
 */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateEventData {
  userId?: string;
  sessionId?: string;
  eventName: string;
  eventType: string;
  properties?: Prisma.InputJsonValue;
  platform?: string;
  appVersion?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface QueryEventsParams {
  userId?: string;
  eventName?: string;
  eventType?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a single analytics event
   */
  async createEvent(data: CreateEventData) {
    return this.prisma.analyticsEvent.create({
      data: {
        userId: data.userId,
        sessionId: data.sessionId,
        eventName: data.eventName,
        eventType: data.eventType,
        properties: data.properties ?? Prisma.JsonNull,
        platform: data.platform,
        appVersion: data.appVersion,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  /**
   * Create multiple events in batch
   */
  async createEvents(events: CreateEventData[]) {
    return this.prisma.analyticsEvent.createMany({
      data: events.map((e) => ({
        userId: e.userId,
        sessionId: e.sessionId,
        eventName: e.eventName,
        eventType: e.eventType,
        properties: e.properties ?? Prisma.JsonNull,
        platform: e.platform,
        appVersion: e.appVersion,
        ipAddress: e.ipAddress,
        userAgent: e.userAgent,
      })),
    });
  }

  /**
   * Query events with filters
   */
  async findEvents(params: QueryEventsParams) {
    const {
      userId,
      eventName,
      eventType,
      startDate,
      endDate,
      page = 1,
      pageSize = 50,
    } = params;

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (eventName) where.eventName = eventName;
    if (eventType) where.eventType = eventType;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) (where.timestamp as Record<string, unknown>).gte = startDate;
      if (endDate) (where.timestamp as Record<string, unknown>).lte = endDate;
    }

    const skip = (page - 1) * pageSize;

    const [events, total] = await Promise.all([
      this.prisma.analyticsEvent.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.analyticsEvent.count({ where }),
    ]);

    return { events, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  /**
   * Get events for export (not yet exported)
   */
  async getEventsForExport(limit: number = 1000) {
    return this.prisma.analyticsEvent.findMany({
      where: { exportedAt: null },
      orderBy: { timestamp: 'asc' },
      take: limit,
    });
  }

  /**
   * Mark events as exported
   */
  async markEventsExported(eventIds: string[], platform: string, batchId: string) {
    return this.prisma.analyticsEvent.updateMany({
      where: { id: { in: eventIds } },
      data: {
        exportedAt: new Date(),
        exportedTo: platform,
        exportBatchId: batchId,
      },
    });
  }

  /**
   * Get event statistics
   */
  async getEventStats(userId?: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: Record<string, unknown> = {
      timestamp: { gte: startDate },
    };
    if (userId) where.userId = userId;

    const events = await this.prisma.analyticsEvent.groupBy({
      by: ['eventName'],
      where,
      _count: { eventName: true },
    });

    return events.map((e) => ({
      eventName: e.eventName,
      count: e._count.eventName,
    }));
  }

  /**
   * Delete old events (for data retention)
   */
  async deleteOldEvents(beforeDate: Date) {
    return this.prisma.analyticsEvent.deleteMany({
      where: {
        timestamp: { lt: beforeDate },
        exportedAt: { not: null }, // Only delete exported events
      },
    });
  }
}
