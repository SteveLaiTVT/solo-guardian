import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { AnalyticsProvider, ANALYTICS_PROVIDER } from './analytics.interface';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let mockProvider: jest.Mocked<AnalyticsProvider>;

  beforeEach(async () => {
    mockProvider = {
      trackEvent: jest.fn().mockResolvedValue(undefined),
      identifyUser: jest.fn().mockResolvedValue(undefined),
      flush: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: ANALYTICS_PROVIDER, useValue: mockProvider },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  describe('trackEvent', () => {
    it('should track event via provider', async () => {
      await service.trackEvent('user.login', { userId: 'user-1' });

      expect(mockProvider.trackEvent).toHaveBeenCalledWith('user.login', { userId: 'user-1' });
    });

    it('should not throw when provider fails', async () => {
      mockProvider.trackEvent.mockRejectedValue(new Error('Provider error'));

      await expect(service.trackEvent('user.login')).resolves.toBeUndefined();
    });
  });

  describe('identifyUser', () => {
    it('should identify user via provider', async () => {
      await service.identifyUser('user-1', { name: 'Test' });

      expect(mockProvider.identifyUser).toHaveBeenCalledWith('user-1', { name: 'Test' });
    });

    it('should not throw when provider fails', async () => {
      mockProvider.identifyUser.mockRejectedValue(new Error('Provider error'));

      await expect(service.identifyUser('user-1')).resolves.toBeUndefined();
    });
  });

  describe('flush', () => {
    it('should flush via provider', async () => {
      await service.flush();

      expect(mockProvider.flush).toHaveBeenCalled();
    });

    it('should not throw when provider fails', async () => {
      mockProvider.flush.mockRejectedValue(new Error('Provider error'));

      await expect(service.flush()).resolves.toBeUndefined();
    });
  });

  describe('convenience methods', () => {
    it('should track login', async () => {
      await service.trackLogin('user-1');
      expect(mockProvider.trackEvent).toHaveBeenCalledWith('user.login', { userId: 'user-1' });
    });

    it('should track logout', async () => {
      await service.trackLogout('user-1');
      expect(mockProvider.trackEvent).toHaveBeenCalledWith('user.logout', { userId: 'user-1' });
    });

    it('should track register', async () => {
      await service.trackRegister('user-1');
      expect(mockProvider.trackEvent).toHaveBeenCalledWith('user.register', { userId: 'user-1' });
    });

    it('should track check-in', async () => {
      await service.trackCheckIn('user-1', '2025-01-15');
      expect(mockProvider.trackEvent).toHaveBeenCalledWith('checkin.completed', {
        userId: 'user-1',
        date: '2025-01-15',
      });
    });

    it('should track missed check-in', async () => {
      await service.trackMissedCheckIn('user-1', '2025-01-15');
      expect(mockProvider.trackEvent).toHaveBeenCalledWith('checkin.missed', {
        userId: 'user-1',
        date: '2025-01-15',
      });
    });

    it('should track settings updated', async () => {
      await service.trackSettingsUpdated('user-1', 'check-in');
      expect(mockProvider.trackEvent).toHaveBeenCalledWith('settings.updated', {
        userId: 'user-1',
        settingType: 'check-in',
      });
    });

    it('should track contact added', async () => {
      await service.trackContactAdded('user-1', 'contact-1');
      expect(mockProvider.trackEvent).toHaveBeenCalledWith('contact.added', {
        userId: 'user-1',
        contactId: 'contact-1',
      });
    });

    it('should track alert triggered', async () => {
      await service.trackAlertTriggered('user-1', 'alert-1');
      expect(mockProvider.trackEvent).toHaveBeenCalledWith('alert.triggered', {
        userId: 'user-1',
        alertId: 'alert-1',
      });
    });
  });
});
