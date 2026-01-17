import { Test, TestingModule } from '@nestjs/testing';
import { CheckInSettingsController } from './check-in-settings.controller';
import { CheckInService } from './check-in.service';

describe('CheckInSettingsController', () => {
  let controller: CheckInSettingsController;
  let service: jest.Mocked<CheckInService>;

  const mockSettings = {
    userId: 'user-1',
    deadlineTime: '10:00',
    reminderTime: '09:00',
    reminderEnabled: true,
    timezone: 'Asia/Shanghai',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockService = {
      getSettings: jest.fn(),
      updateSettings: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckInSettingsController],
      providers: [{ provide: CheckInService, useValue: mockService }],
    }).compile();

    controller = module.get<CheckInSettingsController>(CheckInSettingsController);
    service = module.get(CheckInService);
  });

  describe('getSettings', () => {
    it('should return user settings', async () => {
      service.getSettings.mockResolvedValue(mockSettings);

      const result = await controller.getSettings('user-1');

      expect(service.getSettings).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockSettings);
    });
  });

  describe('updateSettings', () => {
    it('should update settings', async () => {
      const updatedSettings = {
        ...mockSettings,
        deadlineTime: '11:00',
      };
      service.updateSettings.mockResolvedValue(updatedSettings);

      const result = await controller.updateSettings(
        { deadlineTime: '11:00' },
        'user-1'
      );

      expect(service.updateSettings).toHaveBeenCalledWith('user-1', {
        deadlineTime: '11:00',
      });
      expect(result.deadlineTime).toBe('11:00');
    });
  });
});
