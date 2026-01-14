/**
 * @file check-in.repository.ts
 * @description Repository for check-in database operations
 * @task TASK-006
 * @design_state_version 0.8.0
 */
import { Injectable } from '@nestjs/common';
import { CheckIn, CheckInSettings } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CheckInRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertCheckIn(data: {
    userId: string;
    checkInDate: string;
    note?: string;
  }): Promise<CheckIn> {
    return this.prisma.checkIn.upsert({
      where: {
        userId_checkInDate: {
          userId: data.userId,
          checkInDate: data.checkInDate,
        },
      },
      update: {
        note: data.note,
        checkedInAt: new Date(),
      },
      create: {
        userId: data.userId,
        checkInDate: data.checkInDate,
        note: data.note,
      },
    });
  }

  async findByDate(
    userId: string,
    checkInDate: string,
  ): Promise<CheckIn | null> {
    return this.prisma.checkIn.findUnique({
      where: {
        userId_checkInDate: {
          userId,
          checkInDate,
        },
      },
    });
  }

  async findHistory(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<{ checkIns: CheckIn[]; total: number }> {
    const skip = (page - 1) * pageSize;

    const [checkIns, total] = await Promise.all([
      this.prisma.checkIn.findMany({
        where: { userId },
        orderBy: { checkInDate: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.checkIn.count({
        where: { userId },
      }),
    ]);

    return { checkIns, total };
  }

  async getOrCreateSettings(userId: string): Promise<CheckInSettings> {
    return this.prisma.checkInSettings.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        deadlineTime: '10:00',
        reminderTime: '09:00',
        reminderEnabled: true,
        timezone: 'Asia/Shanghai',
      },
    });
  }

  async updateSettings(
    userId: string,
    data: {
      deadlineTime?: string;
      reminderTime?: string;
      reminderEnabled?: boolean;
    },
  ): Promise<CheckInSettings> {
    return this.prisma.checkInSettings.update({
      where: { userId },
      data,
    });
  }
}
