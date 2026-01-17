/**
 * @file admin.service.ts
 * @description Admin service for business logic
 * @task TASK-046, TASK-055
 * @design_state_version 3.8.0
 */
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { AdminRepository, UserStatusType, UserRoleType } from './admin.repository';
import {
  DashboardStatsResponse,
  UserListQueryDto,
  UserListResponse,
  UserDetailResponse,
  AlertListQueryDto,
  AlertListResponse,
  AtRiskUsersResponse,
} from './dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly adminRepository: AdminRepository) {}

  async getDashboardStats(): Promise<DashboardStatsResponse> {
    const [totalUsers, activeUsers, todayCheckIns, pendingAlerts, userGrowth] =
      await Promise.all([
        this.adminRepository.countUsers(),
        this.adminRepository.countActiveUsers(),
        this.adminRepository.countTodayCheckIns(),
        this.adminRepository.countPendingAlerts(),
        this.adminRepository.getUserGrowth(),
      ]);

    // Calculate check-in rate (today's check-ins / active users)
    const checkInRate = activeUsers > 0
      ? Math.round((todayCheckIns / activeUsers) * 100 * 10) / 10
      : 0;

    return {
      totalUsers,
      activeUsers,
      todayCheckIns,
      pendingAlerts,
      checkInRate,
      userGrowth,
    };
  }

  async getUserList(query: UserListQueryDto): Promise<UserListResponse> {
    const { page = 1, limit = 10, search, status } = query;

    const result = await this.adminRepository.getUserList({
      page,
      limit,
      search,
      status,
    });

    const users = result.users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRoleType,
      status: user.status as UserStatusType,
      lastCheckIn: user.checkIns[0]?.checkInDate || null,
      createdAt: user.createdAt,
    }));

    return {
      users,
      total: result.total,
      page,
      limit,
    };
  }

  async getUserDetail(userId: string): Promise<UserDetailResponse> {
    const user = await this.adminRepository.getUserDetail(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRoleType,
      status: user.status as UserStatusType,
      lastCheckIn: user.checkIns[0]?.checkInDate || null,
      createdAt: user.createdAt,
      checkInSettings: user.checkInSettings,
      emergencyContactsCount: user._count.emergencyContacts,
      totalCheckIns: user._count.checkIns,
      alertsCount: user._count.alerts,
    };
  }

  async updateUserStatus(userId: string, status: UserStatusType): Promise<void> {
    const user = await this.adminRepository.getUserDetail(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.adminRepository.updateUserStatus(userId, status);
    this.logger.log(`User ${userId} status updated to ${status}`);
  }

  async getAlertList(query: AlertListQueryDto): Promise<AlertListResponse> {
    const { page = 1, limit = 10, status } = query;

    const result = await this.adminRepository.getAlertList({
      page,
      limit,
      status,
    });

    const alerts = result.alerts.map((alert) => ({
      id: alert.id,
      userId: alert.userId,
      userName: alert.user.name,
      userEmail: alert.user.email,
      status: alert.status,
      triggeredAt: alert.triggeredAt,
      resolvedAt: alert.resolvedAt,
    }));

    return {
      alerts,
      total: result.total,
      page,
      limit,
    };
  }

  // DONE(B): Get at-risk users with consecutive missed check-ins - TASK-055
  async getAtRiskUsers(minConsecutiveMisses: number = 2): Promise<AtRiskUsersResponse> {
    const users = await this.adminRepository.getAtRiskUsers(minConsecutiveMisses);

    return {
      users,
      total: users.length,
    };
  }
}
