import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let service: jest.Mocked<AdminService>;

  const mockDashboardStats = {
    totalUsers: 100,
    activeUsers: 85,
    todayCheckIns: 50,
    pendingAlerts: 5,
    checkInRate: 58.8,
    userGrowth: [1, 2, 3, 4, 5, 6, 7],
  };

  const mockUserListResponse = {
    users: [
      {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user' as const,
        status: 'active' as const,
        lastCheckIn: '2025-01-15',
        createdAt: new Date(),
      },
    ],
    total: 1,
    page: 1,
    limit: 10,
  };

  const mockUserDetail = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user' as const,
    status: 'active' as const,
    lastCheckIn: '2025-01-15',
    createdAt: new Date(),
    checkInSettings: { deadlineTime: '09:00', reminderTime: '08:00', timezone: 'UTC' },
    emergencyContactsCount: 2,
    totalCheckIns: 10,
    alertsCount: 1,
  };

  const mockAlertListResponse = {
    alerts: [
      {
        id: 'alert-1',
        userId: 'user-1',
        userName: 'Test User',
        userEmail: 'test@example.com',
        status: 'triggered' as const,
        triggeredAt: new Date(),
        resolvedAt: null,
      },
    ],
    total: 1,
    page: 1,
    limit: 10,
  };

  const mockAtRiskUsersResponse = {
    users: [
      {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        consecutiveMisses: 3,
        lastCheckIn: '2025-01-12',
        emergencyContactsCount: 2,
      },
    ],
    total: 1,
  };

  beforeEach(async () => {
    const mockService = {
      getDashboardStats: jest.fn(),
      getUserList: jest.fn(),
      getUserDetail: jest.fn(),
      updateUserStatus: jest.fn(),
      getAlertList: jest.fn(),
      getAtRiskUsers: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: AdminService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get(AdminService);
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      service.getDashboardStats.mockResolvedValue(mockDashboardStats);

      const result = await controller.getDashboardStats();

      expect(service.getDashboardStats).toHaveBeenCalled();
      expect(result).toEqual({ success: true, data: mockDashboardStats });
    });
  });

  describe('getUsers', () => {
    it('should return paginated user list', async () => {
      service.getUserList.mockResolvedValue(mockUserListResponse);

      const result = await controller.getUsers({ page: 1, limit: 10 });

      expect(service.getUserList).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(result).toEqual({ success: true, data: mockUserListResponse });
    });

    it('should pass search parameter', async () => {
      service.getUserList.mockResolvedValue({ ...mockUserListResponse, users: [] });

      await controller.getUsers({ page: 1, limit: 10, search: 'test' });

      expect(service.getUserList).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: 'test',
      });
    });
  });

  describe('getUser', () => {
    it('should return user detail', async () => {
      service.getUserDetail.mockResolvedValue(mockUserDetail);

      const result = await controller.getUser('user-1');

      expect(service.getUserDetail).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({ success: true, data: mockUserDetail });
    });
  });

  describe('updateUserStatus', () => {
    it('should update user status', async () => {
      service.updateUserStatus.mockResolvedValue(undefined);

      const result = await controller.updateUserStatus('user-1', { status: 'suspended' });

      expect(service.updateUserStatus).toHaveBeenCalledWith('user-1', 'suspended');
      expect(result).toEqual({ success: true, data: { message: 'User status updated' } });
    });
  });

  describe('getAlerts', () => {
    it('should return paginated alert list', async () => {
      service.getAlertList.mockResolvedValue(mockAlertListResponse);

      const result = await controller.getAlerts({ page: 1, limit: 10 });

      expect(service.getAlertList).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(result).toEqual({ success: true, data: mockAlertListResponse });
    });
  });

  describe('getAtRiskUsers', () => {
    it('should return at-risk users', async () => {
      service.getAtRiskUsers.mockResolvedValue(mockAtRiskUsersResponse);

      const result = await controller.getAtRiskUsers();

      expect(service.getAtRiskUsers).toHaveBeenCalled();
      expect(result).toEqual({ success: true, data: mockAtRiskUsersResponse });
    });
  });
});
