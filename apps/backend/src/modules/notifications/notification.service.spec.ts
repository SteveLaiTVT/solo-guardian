import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { QUEUE_NAMES, NOTIFICATION_JOB_TYPES } from '../queue';

describe('NotificationService', () => {
  let service: NotificationService;
  let repository: jest.Mocked<NotificationRepository>;
  let notificationQueue: { add: jest.Mock };

  const mockNotification = {
    id: 'notification-1',
    alertId: 'alert-1',
    contactId: 'contact-1',
    channel: 'email' as const,
    status: 'pending' as const,
    sentAt: null,
    deliveredAt: null,
    error: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockContact = {
    id: 'contact-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    preferredChannel: 'email' as const,
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      markAsSent: jest.fn(),
      markAsFailed: jest.fn(),
      findByAlertId: jest.fn(),
      countByAlertAndStatus: jest.fn(),
    };

    notificationQueue = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: NotificationRepository, useValue: mockRepository },
        { provide: getQueueToken(QUEUE_NAMES.NOTIFICATION), useValue: notificationQueue },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    repository = module.get(NotificationRepository);
  });

  describe('setAlertService', () => {
    it('should set alert service reference', () => {
      const mockAlertService = { markAlertNotified: jest.fn() };
      service.setAlertService(mockAlertService);
      expect(service['alertService']).toBe(mockAlertService);
    });
  });

  describe('queueAlertNotifications', () => {
    it('should create notifications and queue email jobs', async () => {
      repository.create.mockResolvedValue(mockNotification);

      const result = await service.queueAlertNotifications(
        'alert-1',
        '2025-01-15',
        new Date(),
        'Test User',
        [mockContact],
      );

      expect(repository.create).toHaveBeenCalledWith({
        alertId: 'alert-1',
        contactId: 'contact-1',
        channel: 'email',
      });
      expect(notificationQueue.add).toHaveBeenCalledWith(
        NOTIFICATION_JOB_TYPES.SEND_EMAIL,
        expect.objectContaining({
          notificationId: 'notification-1',
          alertId: 'alert-1',
          contactEmail: 'john@example.com',
        }),
      );
      expect(result).toEqual(['notification-1']);
    });

    it('should queue SMS job when preferred channel is sms and phone exists', async () => {
      const smsContact = { ...mockContact, preferredChannel: 'sms' as const };
      const smsNotification = { ...mockNotification, channel: 'sms' as const };
      repository.create.mockResolvedValue(smsNotification);

      await service.queueAlertNotifications(
        'alert-1',
        '2025-01-15',
        new Date(),
        'Test User',
        [smsContact],
      );

      expect(repository.create).toHaveBeenCalledWith({
        alertId: 'alert-1',
        contactId: 'contact-1',
        channel: 'sms',
      });
      expect(notificationQueue.add).toHaveBeenCalledWith(
        NOTIFICATION_JOB_TYPES.SEND_SMS,
        expect.objectContaining({
          notificationId: 'notification-1',
          contactPhone: '+1234567890',
        }),
      );
    });

    it('should fallback to email when sms preferred but no phone', async () => {
      const contactNoPhone = { ...mockContact, phone: null, preferredChannel: 'sms' as const };
      repository.create.mockResolvedValue(mockNotification);

      await service.queueAlertNotifications(
        'alert-1',
        '2025-01-15',
        new Date(),
        'Test User',
        [contactNoPhone],
      );

      expect(repository.create).toHaveBeenCalledWith({
        alertId: 'alert-1',
        contactId: 'contact-1',
        channel: 'email',
      });
    });

    it('should handle multiple contacts', async () => {
      const contact2 = { ...mockContact, id: 'contact-2', email: 'jane@example.com' };
      const notification2 = { ...mockNotification, id: 'notification-2', contactId: 'contact-2' };

      repository.create
        .mockResolvedValueOnce(mockNotification)
        .mockResolvedValueOnce(notification2);

      const result = await service.queueAlertNotifications(
        'alert-1',
        '2025-01-15',
        new Date(),
        'Test User',
        [mockContact, contact2],
      );

      expect(result).toHaveLength(2);
      expect(repository.create).toHaveBeenCalledTimes(2);
      expect(notificationQueue.add).toHaveBeenCalledTimes(2);
    });
  });

  describe('handleNotificationSent', () => {
    it('should mark notification as sent', async () => {
      repository.markAsSent.mockResolvedValue({ ...mockNotification, status: 'sent' as const });
      repository.countByAlertAndStatus.mockResolvedValue(1);

      await service.handleNotificationSent('notification-1', 'alert-1');

      expect(repository.markAsSent).toHaveBeenCalledWith('notification-1');
    });

    it('should mark alert as notified when all notifications processed', async () => {
      const mockAlertService = { markAlertNotified: jest.fn() };
      service.setAlertService(mockAlertService);

      repository.markAsSent.mockResolvedValue({ ...mockNotification, status: 'sent' as const });
      repository.countByAlertAndStatus.mockResolvedValue(0);

      await service.handleNotificationSent('notification-1', 'alert-1');

      expect(mockAlertService.markAlertNotified).toHaveBeenCalledWith('alert-1');
    });

    it('should not mark alert as notified when pending notifications remain', async () => {
      const mockAlertService = { markAlertNotified: jest.fn() };
      service.setAlertService(mockAlertService);

      repository.markAsSent.mockResolvedValue({ ...mockNotification, status: 'sent' as const });
      repository.countByAlertAndStatus.mockResolvedValue(2);

      await service.handleNotificationSent('notification-1', 'alert-1');

      expect(mockAlertService.markAlertNotified).not.toHaveBeenCalled();
    });
  });

  describe('handleNotificationFailed', () => {
    it('should mark notification as failed with error', async () => {
      const failed = { ...mockNotification, status: 'failed' as const, error: 'SMTP error' };
      repository.markAsFailed.mockResolvedValue(failed);

      await service.handleNotificationFailed('notification-1', 'SMTP error');

      expect(repository.markAsFailed).toHaveBeenCalledWith('notification-1', 'SMTP error');
    });
  });

  describe('getAlertNotifications', () => {
    it('should return notifications for alert', async () => {
      const notifications = [
        { ...mockNotification, contact: { id: 'c1', name: 'John', email: 'john@example.com' } },
      ];
      repository.findByAlertId.mockResolvedValue(notifications);

      const result = await service.getAlertNotifications('alert-1');

      expect(repository.findByAlertId).toHaveBeenCalledWith('alert-1');
      expect(result).toEqual(notifications);
    });
  });
});
