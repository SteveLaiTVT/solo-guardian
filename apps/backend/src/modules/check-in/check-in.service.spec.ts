import { Test, TestingModule } from '@nestjs/testing';
import { CheckInService } from './check-in.service';
import { CheckInRepository } from './check-in.repository';
import { AnalyticsService } from '../analytics';
import { BusinessException } from '../../common/exceptions';

describe('CheckInService', () => {
  let service: CheckInService;
  let repository: jest.Mocked<CheckInRepository>;
  let analyticsService: jest.Mocked<AnalyticsService>;

  const mockSettings = {
    id: 'settings-1',
    userId: 'user-1',
    deadlineTime: '10:00',
    reminderTime: '09:00',
    reminderEnabled: true,
    timezone: 'Asia/Shanghai',
    lastReminderSentAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCheckIn = {
    id: 'checkin-1',
    userId: 'user-1',
    checkInDate: '2025-01-15',
    checkedInAt: new Date(),
    note: 'Test note',
    checkedInByCaretakerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      getOrCreateSettings: jest.fn(),
      findByDate: jest.fn(),
      upsertCheckIn: jest.fn(),
      findHistory: jest.fn(),
      updateSettings: jest.fn(),
    };

    const mockAnalyticsService = {
      trackCheckIn: jest.fn(),
      trackSettingsUpdated: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckInService,
        { provide: CheckInRepository, useValue: mockRepository },
        { provide: AnalyticsService, useValue: mockAnalyticsService },
      ],
    }).compile();

    service = module.get<CheckInService>(CheckInService);
    repository = module.get(CheckInRepository);
    analyticsService = module.get(AnalyticsService);
  });

  describe('checkIn', () => {
    it('should create a check-in successfully', async () => {
      repository.getOrCreateSettings.mockResolvedValue(mockSettings);
      repository.findByDate.mockResolvedValue(null);
      repository.upsertCheckIn.mockResolvedValue(mockCheckIn);

      const result = await service.checkIn('user-1', { note: 'Test note' });

      expect(repository.getOrCreateSettings).toHaveBeenCalledWith('user-1');
      expect(repository.upsertCheckIn).toHaveBeenCalled();
      expect(analyticsService.trackCheckIn).toHaveBeenCalled();
      expect(result.id).toBe('checkin-1');
      expect(result.note).toBe('Test note');
    });

    it('should throw BusinessException when already checked in today', async () => {
      repository.getOrCreateSettings.mockResolvedValue(mockSettings);
      repository.findByDate.mockResolvedValue(mockCheckIn);

      await expect(service.checkIn('user-1', {})).rejects.toThrow(BusinessException);
      expect(repository.upsertCheckIn).not.toHaveBeenCalled();
    });
  });

  describe('getTodayStatus', () => {
    it('should return status when checked in', async () => {
      repository.getOrCreateSettings.mockResolvedValue(mockSettings);
      repository.findByDate.mockResolvedValue(mockCheckIn);

      const result = await service.getTodayStatus('user-1');

      expect(result.hasCheckedIn).toBe(true);
      expect(result.checkIn).toBeDefined();
      expect(result.deadlineTime).toBe('10:00');
    });

    it('should return status when not checked in', async () => {
      repository.getOrCreateSettings.mockResolvedValue(mockSettings);
      repository.findByDate.mockResolvedValue(null);

      const result = await service.getTodayStatus('user-1');

      expect(result.hasCheckedIn).toBe(false);
      expect(result.checkIn).toBeNull();
    });
  });

  describe('getHistory', () => {
    it('should return paginated history', async () => {
      const checkIns = [mockCheckIn, { ...mockCheckIn, id: 'checkin-2' }];
      repository.findHistory.mockResolvedValue({ checkIns, total: 10 });

      const result = await service.getHistory('user-1', 1, 30);

      expect(repository.findHistory).toHaveBeenCalledWith('user-1', 1, 30);
      expect(result.checkIns).toHaveLength(2);
      expect(result.total).toBe(10);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(30);
    });

    it('should use default pagination', async () => {
      repository.findHistory.mockResolvedValue({ checkIns: [], total: 0 });

      await service.getHistory('user-1');

      expect(repository.findHistory).toHaveBeenCalledWith('user-1', 1, 30);
    });
  });

  describe('getSettings', () => {
    it('should return user settings', async () => {
      repository.getOrCreateSettings.mockResolvedValue(mockSettings);

      const result = await service.getSettings('user-1');

      expect(result.userId).toBe('user-1');
      expect(result.deadlineTime).toBe('10:00');
      expect(result.reminderTime).toBe('09:00');
      expect(result.reminderEnabled).toBe(true);
      expect(result.timezone).toBe('Asia/Shanghai');
    });
  });

  describe('updateSettings', () => {
    it('should update settings', async () => {
      const updatedSettings = {
        ...mockSettings,
        deadlineTime: '11:00',
        reminderTime: '10:00',
      };
      repository.getOrCreateSettings.mockResolvedValue(mockSettings);
      repository.updateSettings.mockResolvedValue(updatedSettings);

      const result = await service.updateSettings('user-1', {
        deadlineTime: '11:00',
        reminderTime: '10:00',
      });

      expect(repository.updateSettings).toHaveBeenCalledWith('user-1', {
        deadlineTime: '11:00',
        reminderTime: '10:00',
        reminderEnabled: undefined,
      });
      expect(analyticsService.trackSettingsUpdated).toHaveBeenCalledWith('user-1', 'check-in');
      expect(result.deadlineTime).toBe('11:00');
    });
  });
});
