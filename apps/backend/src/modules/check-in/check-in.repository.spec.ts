import { Test, TestingModule } from '@nestjs/testing';
import { CheckInRepository } from './check-in.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('CheckInRepository', () => {
  let repository: CheckInRepository;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = {
      checkIn: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      checkInSettings: {
        upsert: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckInRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<CheckInRepository>(CheckInRepository);
    prisma = module.get(PrismaService);
  });

  describe('upsertCheckIn', () => {
    it('should upsert a check-in record', async () => {
      const mockCheckIn = {
        id: 'checkin-1',
        userId: 'user-1',
        checkInDate: '2025-01-15',
        checkedInAt: new Date(),
        note: 'Feeling good',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.checkIn.upsert as jest.Mock).mockResolvedValue(mockCheckIn);

      const result = await repository.upsertCheckIn({
        userId: 'user-1',
        checkInDate: '2025-01-15',
        note: 'Feeling good',
      });

      expect(prisma.checkIn.upsert).toHaveBeenCalledWith({
        where: {
          userId_checkInDate: {
            userId: 'user-1',
            checkInDate: '2025-01-15',
          },
        },
        update: {
          note: 'Feeling good',
          checkedInAt: expect.any(Date),
        },
        create: {
          userId: 'user-1',
          checkInDate: '2025-01-15',
          note: 'Feeling good',
        },
      });
      expect(result).toEqual(mockCheckIn);
    });

    it('should upsert without note', async () => {
      const mockCheckIn = {
        id: 'checkin-1',
        userId: 'user-1',
        checkInDate: '2025-01-15',
        checkedInAt: new Date(),
        note: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.checkIn.upsert as jest.Mock).mockResolvedValue(mockCheckIn);

      await repository.upsertCheckIn({
        userId: 'user-1',
        checkInDate: '2025-01-15',
      });

      expect(prisma.checkIn.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: {
            userId: 'user-1',
            checkInDate: '2025-01-15',
            note: undefined,
          },
        })
      );
    });
  });

  describe('findByDate', () => {
    it('should find check-in by user and date', async () => {
      const mockCheckIn = {
        id: 'checkin-1',
        userId: 'user-1',
        checkInDate: '2025-01-15',
        checkedInAt: new Date(),
        note: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.checkIn.findUnique as jest.Mock).mockResolvedValue(mockCheckIn);

      const result = await repository.findByDate('user-1', '2025-01-15');

      expect(prisma.checkIn.findUnique).toHaveBeenCalledWith({
        where: {
          userId_checkInDate: {
            userId: 'user-1',
            checkInDate: '2025-01-15',
          },
        },
      });
      expect(result).toEqual(mockCheckIn);
    });

    it('should return null when not found', async () => {
      (prisma.checkIn.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findByDate('user-1', '2025-01-15');

      expect(result).toBeNull();
    });
  });

  describe('findHistory', () => {
    it('should return paginated history', async () => {
      const mockCheckIns = [
        { id: 'checkin-1', checkInDate: '2025-01-15' },
        { id: 'checkin-2', checkInDate: '2025-01-14' },
      ];
      (prisma.checkIn.findMany as jest.Mock).mockResolvedValue(mockCheckIns);
      (prisma.checkIn.count as jest.Mock).mockResolvedValue(10);

      const result = await repository.findHistory('user-1', 1, 30);

      expect(prisma.checkIn.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { checkInDate: 'desc' },
        skip: 0,
        take: 30,
      });
      expect(result).toEqual({ checkIns: mockCheckIns, total: 10 });
    });

    it('should calculate correct offset for page 2', async () => {
      (prisma.checkIn.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.checkIn.count as jest.Mock).mockResolvedValue(0);

      await repository.findHistory('user-1', 2, 30);

      expect(prisma.checkIn.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 30,
          take: 30,
        })
      );
    });
  });

  describe('getOrCreateSettings', () => {
    it('should upsert settings with defaults', async () => {
      const mockSettings = {
        userId: 'user-1',
        deadlineTime: '10:00',
        reminderTime: '09:00',
        reminderEnabled: true,
        timezone: 'Asia/Shanghai',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.checkInSettings.upsert as jest.Mock).mockResolvedValue(mockSettings);

      const result = await repository.getOrCreateSettings('user-1');

      expect(prisma.checkInSettings.upsert).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        update: {},
        create: {
          userId: 'user-1',
          deadlineTime: '10:00',
          reminderTime: '09:00',
          reminderEnabled: true,
          timezone: 'Asia/Shanghai',
        },
      });
      expect(result).toEqual(mockSettings);
    });
  });

  describe('updateSettings', () => {
    it('should update settings', async () => {
      const mockSettings = {
        userId: 'user-1',
        deadlineTime: '11:00',
        reminderTime: '10:00',
        reminderEnabled: false,
        timezone: 'Asia/Shanghai',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.checkInSettings.update as jest.Mock).mockResolvedValue(mockSettings);

      const result = await repository.updateSettings('user-1', {
        deadlineTime: '11:00',
        reminderTime: '10:00',
        reminderEnabled: false,
      });

      expect(prisma.checkInSettings.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: {
          deadlineTime: '11:00',
          reminderTime: '10:00',
          reminderEnabled: false,
        },
      });
      expect(result).toEqual(mockSettings);
    });

    it('should update partial settings', async () => {
      const mockSettings = {
        userId: 'user-1',
        deadlineTime: '11:00',
        reminderTime: '09:00',
        reminderEnabled: true,
        timezone: 'Asia/Shanghai',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.checkInSettings.update as jest.Mock).mockResolvedValue(mockSettings);

      await repository.updateSettings('user-1', { deadlineTime: '11:00' });

      expect(prisma.checkInSettings.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: { deadlineTime: '11:00' },
      });
    });
  });
});
