import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { AlertStatus } from '@prisma/client';

describe('AdminService', () => {
  let service: AdminService;
  let repository: jest.Mocked<AdminRepository>;

  const mockUserDetail = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user' as const,
    status: 'active' as const,
    createdAt: new Date(),
    checkIns: [{ checkInDate: '2025-01-15' }],
    checkInSettings: { deadlineTime: '09:00', reminderTime: '08:00', timezone: 'UTC' },
    _count: { emergencyContacts: 2, checkIns: 10, alerts: 1 },
  };

  const mockUserListItem = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user' as const,
    status: 'active' as const,
    createdAt: new Date(),
    checkIns: [{ checkInDate: '2025-01-15' }],
  };

  const mockAlert = {
    id: 'alert-1',
    userId: 'user-1',
    status: AlertStatus.triggered,
    triggeredAt: new Date(),
    resolvedAt: null,
    user: { name: 'Test User', email: 'test@example.com' },
  };

  beforeEach(async () => {
    const mockRepository = {
      countUsers: jest.fn(),
      countActiveUsers: jest.fn(),
      countTodayCheckIns: jest.fn(),
      countPendingAlerts: jest.fn(),
      getUserGrowth: jest.fn(),
      getUserList: jest.fn(),
      getUserDetail: jest.fn(),
      updateUserStatus: jest.fn(),
      getAlertList: jest.fn(),
      getAtRiskUsers: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: AdminRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    repository = module.get(AdminRepository);
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      repository.countUsers.mockResolvedValue(100);
      repository.countActiveUsers.mockResolvedValue(85);
      repository.countTodayCheckIns.mockResolvedValue(50);
      repository.countPendingAlerts.mockResolvedValue(5);
      repository.getUserGrowth.mockResolvedValue([1, 2, 3, 4, 5, 6, 7]);

      const result = await service.getDashboardStats();

      expect(result.totalUsers).toBe(100);
      expect(result.activeUsers).toBe(85);
      expect(result.todayCheckIns).toBe(50);
      expect(result.pendingAlerts).toBe(5);
      expect(result.userGrowth).toHaveLength(7);
    });

    it('should calculate check-in rate correctly', async () => {
      repository.countUsers.mockResolvedValue(100);
      repository.countActiveUsers.mockResolvedValue(100);
      repository.countTodayCheckIns.mockResolvedValue(75);
      repository.countPendingAlerts.mockResolvedValue(0);
      repository.getUserGrowth.mockResolvedValue([]);

      const result = await service.getDashboardStats();

      expect(result.checkInRate).toBe(75);
    });

    it('should return 0 check-in rate when no active users', async () => {
      repository.countUsers.mockResolvedValue(0);
      repository.countActiveUsers.mockResolvedValue(0);
      repository.countTodayCheckIns.mockResolvedValue(0);
      repository.countPendingAlerts.mockResolvedValue(0);
      repository.getUserGrowth.mockResolvedValue([]);

      const result = await service.getDashboardStats();

      expect(result.checkInRate).toBe(0);
    });
  });

  describe('getUserList', () => {
    it('should return paginated user list', async () => {
      repository.getUserList.mockResolvedValue({
        users: [mockUserListItem],
        total: 1,
      });

      const result = await service.getUserList({ page: 1, limit: 10 });

      expect(repository.getUserList).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        status: undefined,
      });
      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should use default pagination values', async () => {
      repository.getUserList.mockResolvedValue({ users: [], total: 0 });

      const result = await service.getUserList({});

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should map user last check-in correctly', async () => {
      repository.getUserList.mockResolvedValue({
        users: [mockUserListItem],
        total: 1,
      });

      const result = await service.getUserList({});

      expect(result.users[0].lastCheckIn).toBe('2025-01-15');
    });

    it('should handle users without check-ins', async () => {
      repository.getUserList.mockResolvedValue({
        users: [{ ...mockUserListItem, checkIns: [] }],
        total: 1,
      });

      const result = await service.getUserList({});

      expect(result.users[0].lastCheckIn).toBeNull();
    });
  });

  describe('getUserDetail', () => {
    it('should return user detail', async () => {
      repository.getUserDetail.mockResolvedValue(mockUserDetail);

      const result = await service.getUserDetail('user-1');

      expect(repository.getUserDetail).toHaveBeenCalledWith('user-1');
      expect(result.id).toBe('user-1');
      expect(result.emergencyContactsCount).toBe(2);
      expect(result.totalCheckIns).toBe(10);
      expect(result.alertsCount).toBe(1);
    });

    it('should throw NotFoundException when user not found', async () => {
      repository.getUserDetail.mockResolvedValue(null);

      await expect(service.getUserDetail('unknown-user')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUserStatus', () => {
    it('should update user status', async () => {
      repository.getUserDetail.mockResolvedValue(mockUserDetail);

      await service.updateUserStatus('user-1', 'suspended');

      expect(repository.updateUserStatus).toHaveBeenCalledWith('user-1', 'suspended');
    });

    it('should throw NotFoundException when user not found', async () => {
      repository.getUserDetail.mockResolvedValue(null);

      await expect(service.updateUserStatus('unknown-user', 'suspended')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAlertList', () => {
    it('should return paginated alert list', async () => {
      repository.getAlertList.mockResolvedValue({
        alerts: [mockAlert],
        total: 1,
      });

      const result = await service.getAlertList({ page: 1, limit: 10 });

      expect(result.alerts).toHaveLength(1);
      expect(result.alerts[0].userName).toBe('Test User');
      expect(result.alerts[0].userEmail).toBe('test@example.com');
      expect(result.total).toBe(1);
    });

    it('should filter by status', async () => {
      repository.getAlertList.mockResolvedValue({ alerts: [], total: 0 });

      await service.getAlertList({ page: 1, limit: 10, status: AlertStatus.resolved });

      expect(repository.getAlertList).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        status: AlertStatus.resolved,
      });
    });
  });

  describe('getAtRiskUsers', () => {
    it('should return at-risk users', async () => {
      const atRiskUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        consecutiveMisses: 3,
        lastCheckIn: '2025-01-12',
        emergencyContactsCount: 2,
      };
      repository.getAtRiskUsers.mockResolvedValue([atRiskUser]);

      const result = await service.getAtRiskUsers();

      expect(repository.getAtRiskUsers).toHaveBeenCalledWith(2);
      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should use custom minConsecutiveMisses', async () => {
      repository.getAtRiskUsers.mockResolvedValue([]);

      await service.getAtRiskUsers(5);

      expect(repository.getAtRiskUsers).toHaveBeenCalledWith(5);
    });
  });
});
