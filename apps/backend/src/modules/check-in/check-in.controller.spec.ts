import { Test, TestingModule } from '@nestjs/testing';
import { CheckInController } from './check-in.controller';
import { CheckInService } from './check-in.service';

describe('CheckInController', () => {
  let controller: CheckInController;
  let service: jest.Mocked<CheckInService>;

  const mockCheckInResponse = {
    id: 'checkin-1',
    userId: 'user-1',
    checkInDate: '2025-01-15',
    checkedInAt: new Date(),
    note: 'Test note',
  };

  const mockTodayStatus = {
    hasCheckedIn: true,
    checkIn: mockCheckInResponse,
    deadlineTime: '10:00',
    isOverdue: false,
  };

  const mockHistory = {
    checkIns: [mockCheckInResponse],
    total: 1,
    page: 1,
    pageSize: 30,
  };

  beforeEach(async () => {
    const mockService = {
      checkIn: jest.fn(),
      getTodayStatus: jest.fn(),
      getHistory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckInController],
      providers: [{ provide: CheckInService, useValue: mockService }],
    }).compile();

    controller = module.get<CheckInController>(CheckInController);
    service = module.get(CheckInService);
  });

  describe('checkIn', () => {
    it('should create a check-in', async () => {
      service.checkIn.mockResolvedValue(mockCheckInResponse);

      const result = await controller.checkIn({ note: 'Test' }, 'user-1');

      expect(service.checkIn).toHaveBeenCalledWith('user-1', { note: 'Test' });
      expect(result).toEqual(mockCheckInResponse);
    });
  });

  describe('getTodayStatus', () => {
    it('should return today check-in status', async () => {
      service.getTodayStatus.mockResolvedValue(mockTodayStatus);

      const result = await controller.getTodayStatus('user-1');

      expect(service.getTodayStatus).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockTodayStatus);
    });
  });

  describe('getHistory', () => {
    it('should return check-in history', async () => {
      service.getHistory.mockResolvedValue(mockHistory);

      const result = await controller.getHistory(1, 30, 'user-1');

      expect(service.getHistory).toHaveBeenCalledWith('user-1', 1, 30);
      expect(result).toEqual(mockHistory);
    });

    it('should pass pagination parameters to service', async () => {
      service.getHistory.mockResolvedValue(mockHistory);

      await controller.getHistory(2, 20, 'user-1');

      expect(service.getHistory).toHaveBeenCalledWith('user-1', 2, 20);
    });
  });
});
