/**
 * @file admin.repository.ts
 * @description Admin repository for database operations
 * @task TASK-046
 * @design_state_version 3.7.0
 * @note Uses fallback values for role/status until migration runs
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { AlertStatus } from '@prisma/client';

// Type aliases for migration compatibility
export type UserStatusType = 'active' | 'suspended' | 'deleted';
export type UserRoleType = 'user' | 'caregiver' | 'admin' | 'super_admin';

interface UserListParams {
  page: number;
  limit: number;
  search?: string;
  status?: UserStatusType;
}

interface AlertListParams {
  page: number;
  limit: number;
  status?: AlertStatus;
}

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async countUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  async countActiveUsers(): Promise<number> {
    // Without status field, count all users
    return this.prisma.user.count();
  }

  async countTodayCheckIns(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    return this.prisma.checkIn.count({
      where: { checkInDate: today },
    });
  }

  async countPendingAlerts(): Promise<number> {
    return this.prisma.alert.count({
      where: { status: AlertStatus.triggered },
    });
  }

  async getUserList(params: UserListParams): Promise<{
    users: Array<{
      id: string;
      email: string;
      name: string;
      role: UserRoleType;
      status: UserStatusType;
      createdAt: Date;
      checkIns: Array<{ checkInDate: string }>;
    }>;
    total: number;
  }> {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          checkIns: {
            orderBy: { checkInDate: 'desc' },
            take: 1,
            select: { checkInDate: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    // Add default role and status (until migration runs)
    const usersWithDefaults = users.map((user) => ({
      ...user,
      role: 'user' as UserRoleType,
      status: 'active' as UserStatusType,
    }));

    return { users: usersWithDefaults, total };
  }

  async getUserDetail(userId: string): Promise<{
    id: string;
    email: string;
    name: string;
    role: UserRoleType;
    status: UserStatusType;
    createdAt: Date;
    checkIns: Array<{ checkInDate: string }>;
    checkInSettings: {
      deadlineTime: string;
      reminderTime: string;
      timezone: string;
    } | null;
    _count: {
      emergencyContacts: number;
      checkIns: number;
      alerts: number;
    };
  } | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        checkIns: {
          orderBy: { checkInDate: 'desc' },
          take: 1,
          select: { checkInDate: true },
        },
        checkInSettings: {
          select: {
            deadlineTime: true,
            reminderTime: true,
            timezone: true,
          },
        },
        _count: {
          select: {
            emergencyContacts: true,
            checkIns: true,
            alerts: true,
          },
        },
      },
    });

    if (!user) return null;

    // Add default role and status
    return {
      ...user,
      role: 'user' as UserRoleType,
      status: 'active' as UserStatusType,
    };
  }

  async updateUserStatus(userId: string, _status: UserStatusType): Promise<void> {
    // Log the status update (actual update requires migration)
    console.log(`[AdminRepository] Status update for user ${userId}: ${_status}`);
    // After migration, uncomment:
    // await this.prisma.user.update({
    //   where: { id: userId },
    //   data: { status },
    // });
  }

  async getAlertList(params: AlertListParams): Promise<{
    alerts: Array<{
      id: string;
      userId: string;
      status: AlertStatus;
      triggeredAt: Date;
      resolvedAt: Date | null;
      user: { name: string; email: string };
    }>;
    total: number;
  }> {
    const { page, limit, status } = params;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [alerts, total] = await Promise.all([
      this.prisma.alert.findMany({
        where,
        skip,
        take: limit,
        orderBy: { triggeredAt: 'desc' },
        select: {
          id: true,
          userId: true,
          status: true,
          triggeredAt: true,
          resolvedAt: true,
          user: {
            select: { name: true, email: true },
          },
        },
      }),
      this.prisma.alert.count({ where }),
    ]);

    return { alerts, total };
  }

  async getUserGrowth(days: number = 7): Promise<number[]> {
    const growth: number[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const count = await this.prisma.user.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });
      growth.push(count);
    }

    return growth;
  }
}
