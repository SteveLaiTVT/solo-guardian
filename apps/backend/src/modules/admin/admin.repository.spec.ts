import { Test, TestingModule } from '@nestjs/testing';
import { AdminRepository } from './admin.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { AlertStatus } from '@prisma/client';

describe('AdminRepository', () => {
  let repository: AdminRepository;
  let prisma: jest.Mocked<PrismaService>;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    checkIns: [{ checkInDate: '2025-01-15' }],
    checkInSettings: { deadlineTime: '09:00', reminderTime: '08:00', timezone: 'UTC' },
    _count: { emergencyContacts: 2, checkIns: 10, alerts: 1 },
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
    const mockPrisma = {
      user: {
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      checkIn: {
        count: jest.fn(),
      },
      alert: {
        count: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<AdminRepository>(AdminRepository);
    prisma = module.get(PrismaService);
  });

  describe('countUsers', () => {
    it('should return total user count', async () => {
      (prisma.user.count as jest.Mock).mockResolvedValue(100);

      const result = await repository.countUsers();

      expect(prisma.user.count).toHaveBeenCalled();
      expect(result).toBe(100);
    });
  });

  describe('countActiveUsers', () => {
    it('should return active user count', async () => {
      (prisma.user.count as jest.Mock).mockResolvedValue(85);

      const result = await repository.countActiveUsers();

      expect(result).toBe(85);
    });
  });

  describe('countTodayCheckIns', () => {
    it('should return today check-in count', async () => {
      (prisma.checkIn.count as jest.Mock).mockResolvedValue(50);

      const result = await repository.countTodayCheckIns();

      expect(prisma.checkIn.count).toHaveBeenCalledWith({
        where: { checkInDate: expect.any(String) },
      });
      expect(result).toBe(50);
    });
  });

  describe('countPendingAlerts', () => {
    it('should return pending alerts count', async () => {
      (prisma.alert.count as jest.Mock).mockResolvedValue(5);

      const result = await repository.countPendingAlerts();

      expect(prisma.alert.count).toHaveBeenCalledWith({
        where: { status: AlertStatus.triggered },
      });
      expect(result).toBe(5);
    });
  });

  describe('getUserList', () => {
    it('should return paginated user list', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([mockUser]);
      (prisma.user.count as jest.Mock).mockResolvedValue(1);

      const result = await repository.getUserList({ page: 1, limit: 10 });

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.users[0].role).toBe('user');
      expect(result.users[0].status).toBe('active');
    });

    it('should filter by search term', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.user.count as jest.Mock).mockResolvedValue(0);

      await repository.getUserList({ page: 1, limit: 10, search: 'test' });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: 'test', mode: 'insensitive' } },
              { email: { contains: 'test', mode: 'insensitive' } },
            ],
          },
        }),
      );
    });

    it('should paginate correctly', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.user.count as jest.Mock).mockResolvedValue(0);

      await repository.getUserList({ page: 2, limit: 10 });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });
  });

  describe('getUserDetail', () => {
    it('should return user detail with counts', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await repository.getUserDetail('user-1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: expect.any(Object),
      });
      expect(result).toBeDefined();
      expect(result?.role).toBe('user');
      expect(result?.status).toBe('active');
    });

    it('should return null when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.getUserDetail('unknown-user');

      expect(result).toBeNull();
    });
  });

  describe('updateUserStatus', () => {
    it('should log status update', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await repository.updateUserStatus('user-1', 'suspended');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getAlertList', () => {
    it('should return paginated alert list', async () => {
      (prisma.alert.findMany as jest.Mock).mockResolvedValue([mockAlert]);
      (prisma.alert.count as jest.Mock).mockResolvedValue(1);

      const result = await repository.getAlertList({ page: 1, limit: 10 });

      expect(result.alerts).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should filter by status', async () => {
      (prisma.alert.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.alert.count as jest.Mock).mockResolvedValue(0);

      await repository.getAlertList({ page: 1, limit: 10, status: AlertStatus.resolved });

      expect(prisma.alert.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: AlertStatus.resolved },
        }),
      );
    });
  });

  describe('getUserGrowth', () => {
    it('should return user growth for last 7 days', async () => {
      (prisma.user.count as jest.Mock).mockResolvedValue(5);

      const result = await repository.getUserGrowth();

      expect(result).toHaveLength(7);
      expect(prisma.user.count).toHaveBeenCalledTimes(7);
    });

    it('should accept custom days parameter', async () => {
      (prisma.user.count as jest.Mock).mockResolvedValue(2);

      const result = await repository.getUserGrowth(3);

      expect(result).toHaveLength(3);
      expect(prisma.user.count).toHaveBeenCalledTimes(3);
    });
  });

  describe('getAtRiskUsers', () => {
    it('should return users with consecutive missed check-ins', async () => {
      const userWithMisses = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        checkIns: [],
        checkInSettings: { deadlineTime: '00:01', timezone: 'UTC' },
        _count: { emergencyContacts: 2 },
      };
      (prisma.user.findMany as jest.Mock).mockResolvedValue([userWithMisses]);

      const result = await repository.getAtRiskUsers(2);

      expect(result).toBeInstanceOf(Array);
    });

    it('should use default minConsecutiveMisses of 2', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.getAtRiskUsers();

      expect(result).toEqual([]);
    });

    it('should skip users without check-in settings', async () => {
      const userNoSettings = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        checkIns: [],
        checkInSettings: null,
        _count: { emergencyContacts: 0 },
      };
      (prisma.user.findMany as jest.Mock).mockResolvedValue([userNoSettings]);

      const result = await repository.getAtRiskUsers();

      expect(result).toEqual([]);
    });
  });
});
