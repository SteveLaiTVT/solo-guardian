import { Test, TestingModule } from '@nestjs/testing';
import { ModuleRef } from '@nestjs/core';
import { AlertService } from './alert.service';
import { AlertRepository } from './alert.repository';
import { NotificationService } from '../notifications';
import { EmergencyContactsService } from '../emergency-contacts';

describe('AlertService', () => {
  let service: AlertService;
  let repository: jest.Mocked<AlertRepository>;
  let notificationService: jest.Mocked<NotificationService>;
  let contactsService: jest.Mocked<EmergencyContactsService>;

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

  const mockContact = {
    id: 'contact-1',
    userId: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    priority: 1,
    isVerified: true,
    isActive: true,
    phoneVerified: false,
    preferredChannel: 'email' as const,
    linkedUserId: null,
    linkedUserName: null,
    invitationStatus: 'none' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      markAsNotified: jest.fn(),
      resolve: jest.fn(),
      expire: jest.fn(),
      findById: jest.fn(),
      findActiveByUserAndDate: jest.fn(),
      findByUserId: jest.fn(),
      countByUserId: jest.fn(),
      findExpirableAlerts: jest.fn(),
      findActiveAlertsByUserId: jest.fn(),
    };

    const mockNotificationService = {
      setAlertService: jest.fn(),
      queueAlertNotifications: jest.fn(),
      getAlertNotifications: jest.fn(),
    };

    const mockContactsService = {
      findAll: jest.fn(),
    };

    const mockModuleRef = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertService,
        { provide: AlertRepository, useValue: mockRepository },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: EmergencyContactsService, useValue: mockContactsService },
        { provide: ModuleRef, useValue: mockModuleRef },
      ],
    }).compile();

    service = module.get<AlertService>(AlertService);
    repository = module.get(AlertRepository);
    notificationService = module.get(NotificationService);
    contactsService = module.get(EmergencyContactsService);
  });

  describe('onModuleInit', () => {
    it('should set alert service on notification service', () => {
      service.onModuleInit();
      expect(notificationService.setAlertService).toHaveBeenCalledWith(service);
    });
  });

  describe('createAlert', () => {
    it('should create alert and queue notifications', async () => {
      repository.findActiveByUserAndDate.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockAlert);
      contactsService.findAll.mockResolvedValue([mockContact]);
      notificationService.queueAlertNotifications.mockResolvedValue(['notification-1']);

      const result = await service.createAlert('user-1', 'Test User', '2025-01-15');

      expect(repository.create).toHaveBeenCalled();
      expect(notificationService.queueAlertNotifications).toHaveBeenCalled();
      expect(result).toEqual(mockAlert);
    });

    it('should not create alert if one already exists', async () => {
      repository.findActiveByUserAndDate.mockResolvedValue(mockAlert);

      const result = await service.createAlert('user-1', 'Test User', '2025-01-15');

      expect(repository.create).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should not queue notifications if no active contacts', async () => {
      repository.findActiveByUserAndDate.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockAlert);
      contactsService.findAll.mockResolvedValue([{ ...mockContact, isActive: false }]);

      const result = await service.createAlert('user-1', 'Test User', '2025-01-15');

      expect(notificationService.queueAlertNotifications).not.toHaveBeenCalled();
      expect(result).toEqual(mockAlert);
    });
  });

  describe('resolveAlert', () => {
    it('should resolve existing alert', async () => {
      const resolvedAlert = { ...mockAlert, status: 'resolved' as const };
      repository.findActiveByUserAndDate.mockResolvedValue(mockAlert);
      repository.resolve.mockResolvedValue(resolvedAlert);

      const result = await service.resolveAlert('user-1', '2025-01-15');

      expect(repository.resolve).toHaveBeenCalledWith('alert-1');
      expect(result?.status).toBe('resolved');
    });

    it('should return null if no active alert', async () => {
      repository.findActiveByUserAndDate.mockResolvedValue(null);

      const result = await service.resolveAlert('user-1', '2025-01-15');

      expect(result).toBeNull();
    });
  });

  describe('markAlertNotified', () => {
    it('should mark alert as notified', async () => {
      repository.markAsNotified.mockResolvedValue({ ...mockAlert, status: 'notified' as const });

      await service.markAlertNotified('alert-1');

      expect(repository.markAsNotified).toHaveBeenCalledWith('alert-1');
    });
  });

  describe('getUserAlerts', () => {
    it('should return paginated alerts', async () => {
      repository.findByUserId.mockResolvedValue([mockAlert]);
      repository.countByUserId.mockResolvedValue(5);

      const result = await service.getUserAlerts('user-1', 1, 10);

      expect(repository.findByUserId).toHaveBeenCalledWith('user-1', 0, 10);
      expect(result.data).toEqual([mockAlert]);
      expect(result.total).toBe(5);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe('getAlertDetails', () => {
    it('should return alert with notifications', async () => {
      const alertWithUser = { ...mockAlert, user: { id: 'user-1', name: 'Test', email: 'test@example.com' } };
      repository.findById.mockResolvedValue(alertWithUser);
      notificationService.getAlertNotifications.mockResolvedValue([]);

      const result = await service.getAlertDetails('alert-1', 'user-1');

      expect(result?.alert).toEqual(alertWithUser);
      expect(result?.notifications).toEqual([]);
    });

    it('should return null if alert not found', async () => {
      repository.findById.mockResolvedValue(null);

      const result = await service.getAlertDetails('alert-1', 'user-1');

      expect(result).toBeNull();
    });

    it('should return null if alert belongs to different user', async () => {
      const alertWithUser = { ...mockAlert, userId: 'other-user', user: { id: 'other-user', name: 'Other', email: 'other@example.com' } };
      repository.findById.mockResolvedValue(alertWithUser);

      const result = await service.getAlertDetails('alert-1', 'user-1');

      expect(result).toBeNull();
    });
  });

  describe('expireOldAlerts', () => {
    it('should expire alerts before date', async () => {
      repository.findExpirableAlerts.mockResolvedValue([mockAlert]);
      repository.expire.mockResolvedValue({ ...mockAlert, status: 'expired' as const });

      const result = await service.expireOldAlerts('2025-01-14');

      expect(repository.expire).toHaveBeenCalledWith('alert-1');
      expect(result).toBe(1);
    });

    it('should return 0 if no alerts to expire', async () => {
      repository.findExpirableAlerts.mockResolvedValue([]);

      const result = await service.expireOldAlerts('2025-01-14');

      expect(result).toBe(0);
    });
  });

  describe('hasActiveAlerts', () => {
    it('should return true when user has active alerts', async () => {
      repository.findActiveAlertsByUserId.mockResolvedValue([mockAlert]);

      const result = await service.hasActiveAlerts('user-1');

      expect(result).toBe(true);
    });

    it('should return false when user has no active alerts', async () => {
      repository.findActiveAlertsByUserId.mockResolvedValue([]);

      const result = await service.hasActiveAlerts('user-1');

      expect(result).toBe(false);
    });
  });
});
