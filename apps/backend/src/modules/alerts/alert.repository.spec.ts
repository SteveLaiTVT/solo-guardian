import { Test, TestingModule } from '@nestjs/testing';
import { AlertRepository } from './alert.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('AlertRepository', () => {
  let repository: AlertRepository;
  let prisma: jest.Mocked<PrismaService>;

  const mockAlert = {
    id: 'alert-1',
    userId: 'user-1',
    alertDate: '2025-01-15',
    status: 'triggered' as const,
    triggeredAt: new Date(),
    resolvedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrisma = {
      alert: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<AlertRepository>(AlertRepository);
    prisma = module.get(PrismaService);
  });

  describe('create', () => {
    it('should create a new alert', async () => {
      (prisma.alert.create as jest.Mock).mockResolvedValue(mockAlert);

      const result = await repository.create({
        userId: 'user-1',
        alertDate: '2025-01-15',
        triggeredAt: new Date(),
      });

      expect(prisma.alert.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          alertDate: '2025-01-15',
          triggeredAt: expect.any(Date),
          status: 'triggered',
        },
      });
      expect(result).toEqual(mockAlert);
    });
  });

  describe('markAsNotified', () => {
    it('should update alert status to notified', async () => {
      const notified = { ...mockAlert, status: 'notified' as const };
      (prisma.alert.update as jest.Mock).mockResolvedValue(notified);

      const result = await repository.markAsNotified('alert-1');

      expect(prisma.alert.update).toHaveBeenCalledWith({
        where: { id: 'alert-1' },
        data: { status: 'notified' },
      });
      expect(result.status).toBe('notified');
    });
  });

  describe('resolve', () => {
    it('should resolve alert and set resolvedAt', async () => {
      const resolved = { ...mockAlert, status: 'resolved' as const, resolvedAt: new Date() };
      (prisma.alert.update as jest.Mock).mockResolvedValue(resolved);

      const result = await repository.resolve('alert-1');

      expect(prisma.alert.update).toHaveBeenCalledWith({
        where: { id: 'alert-1' },
        data: {
          status: 'resolved',
          resolvedAt: expect.any(Date),
        },
      });
      expect(result.status).toBe('resolved');
    });
  });

  describe('expire', () => {
    it('should expire alert', async () => {
      const expired = { ...mockAlert, status: 'expired' as const };
      (prisma.alert.update as jest.Mock).mockResolvedValue(expired);

      const result = await repository.expire('alert-1');

      expect(prisma.alert.update).toHaveBeenCalledWith({
        where: { id: 'alert-1' },
        data: { status: 'expired' },
      });
      expect(result.status).toBe('expired');
    });
  });

  describe('findById', () => {
    it('should find alert by id', async () => {
      const alertWithUser = {
        ...mockAlert,
        user: { id: 'user-1', name: 'Test', email: 'test@example.com' },
      };
      (prisma.alert.findUnique as jest.Mock).mockResolvedValue(alertWithUser);

      const result = await repository.findById('alert-1');

      expect(prisma.alert.findUnique).toHaveBeenCalledWith({
        where: { id: 'alert-1' },
        include: { user: { select: { id: true, name: true, email: true } } },
      });
      expect(result).toEqual(alertWithUser);
    });
  });

  describe('findActiveByUserAndDate', () => {
    it('should find active alert for user and date', async () => {
      (prisma.alert.findFirst as jest.Mock).mockResolvedValue(mockAlert);

      const result = await repository.findActiveByUserAndDate('user-1', '2025-01-15');

      expect(prisma.alert.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          alertDate: '2025-01-15',
          status: { in: ['triggered', 'notified'] },
        },
      });
      expect(result).toEqual(mockAlert);
    });
  });

  describe('findByUserId', () => {
    it('should return paginated alerts', async () => {
      (prisma.alert.findMany as jest.Mock).mockResolvedValue([mockAlert]);

      const result = await repository.findByUserId('user-1', 0, 10);

      expect(prisma.alert.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { triggeredAt: 'desc' },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual([mockAlert]);
    });
  });

  describe('countByUserId', () => {
    it('should count alerts for user', async () => {
      (prisma.alert.count as jest.Mock).mockResolvedValue(5);

      const result = await repository.countByUserId('user-1');

      expect(result).toBe(5);
    });
  });

  describe('findExpirableAlerts', () => {
    it('should find alerts to expire', async () => {
      (prisma.alert.findMany as jest.Mock).mockResolvedValue([mockAlert]);

      const result = await repository.findExpirableAlerts('2025-01-15');

      expect(prisma.alert.findMany).toHaveBeenCalledWith({
        where: {
          alertDate: { lt: '2025-01-15' },
          status: { in: ['triggered', 'notified'] },
        },
      });
      expect(result).toEqual([mockAlert]);
    });
  });

  describe('findActiveAlertsByUserId', () => {
    it('should find active alerts for user', async () => {
      (prisma.alert.findMany as jest.Mock).mockResolvedValue([mockAlert]);

      const result = await repository.findActiveAlertsByUserId('user-1');

      expect(prisma.alert.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          status: { in: ['triggered', 'notified'] },
        },
        orderBy: { triggeredAt: 'desc' },
      });
      expect(result).toEqual([mockAlert]);
    });
  });
});
