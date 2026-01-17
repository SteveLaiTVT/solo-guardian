import { Test, TestingModule } from '@nestjs/testing';
import { NotificationRepository } from './notification.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('NotificationRepository', () => {
  let repository: NotificationRepository;
  let prisma: jest.Mocked<PrismaService>;

  const mockNotification = {
    id: 'notification-1',
    alertId: 'alert-1',
    contactId: 'contact-1',
    channel: 'email' as const,
    status: 'pending' as const,
    sentAt: null,
    error: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrisma = {
      notification: {
        create: jest.fn(),
        createMany: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<NotificationRepository>(NotificationRepository);
    prisma = module.get(PrismaService);
  });

  describe('create', () => {
    it('should create a notification', async () => {
      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);

      const result = await repository.create({
        alertId: 'alert-1',
        contactId: 'contact-1',
        channel: 'email',
      });

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: {
          alertId: 'alert-1',
          contactId: 'contact-1',
          channel: 'email',
          status: 'pending',
        },
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('createMany', () => {
    it('should create multiple notifications', async () => {
      (prisma.notification.createMany as jest.Mock).mockResolvedValue({ count: 2 });

      const result = await repository.createMany([
        { alertId: 'alert-1', contactId: 'contact-1', channel: 'email' },
        { alertId: 'alert-1', contactId: 'contact-2', channel: 'sms' },
      ]);

      expect(prisma.notification.createMany).toHaveBeenCalled();
      expect(result.count).toBe(2);
    });
  });

  describe('markAsSent', () => {
    it('should mark notification as sent', async () => {
      const sent = { ...mockNotification, status: 'sent' as const, sentAt: new Date() };
      (prisma.notification.update as jest.Mock).mockResolvedValue(sent);

      const result = await repository.markAsSent('notification-1');

      expect(prisma.notification.update).toHaveBeenCalledWith({
        where: { id: 'notification-1' },
        data: { status: 'sent', sentAt: expect.any(Date) },
      });
      expect(result.status).toBe('sent');
    });
  });

  describe('markAsFailed', () => {
    it('should mark notification as failed', async () => {
      const failed = { ...mockNotification, status: 'failed' as const, error: 'SMTP error' };
      (prisma.notification.update as jest.Mock).mockResolvedValue(failed);

      const result = await repository.markAsFailed('notification-1', 'SMTP error');

      expect(prisma.notification.update).toHaveBeenCalledWith({
        where: { id: 'notification-1' },
        data: { status: 'failed', error: 'SMTP error' },
      });
      expect(result.status).toBe('failed');
    });
  });

  describe('findByAlertId', () => {
    it('should find notifications for alert', async () => {
      const notifications = [{ ...mockNotification, contact: { id: 'c1', name: 'John', email: 'john@example.com' } }];
      (prisma.notification.findMany as jest.Mock).mockResolvedValue(notifications);

      const result = await repository.findByAlertId('alert-1');

      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { alertId: 'alert-1' },
        include: { contact: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual(notifications);
    });
  });

  describe('findById', () => {
    it('should find notification by id', async () => {
      const notification = {
        ...mockNotification,
        contact: { id: 'c1', name: 'John', email: 'john@example.com' },
        alert: { id: 'alert-1', alertDate: '2025-01-15', status: 'triggered' },
      };
      (prisma.notification.findUnique as jest.Mock).mockResolvedValue(notification);

      const result = await repository.findById('notification-1');

      expect(result).toEqual(notification);
    });
  });

  describe('countByAlertAndStatus', () => {
    it('should count notifications by status', async () => {
      (prisma.notification.count as jest.Mock).mockResolvedValue(3);

      const result = await repository.countByAlertAndStatus('alert-1', 'sent');

      expect(prisma.notification.count).toHaveBeenCalledWith({
        where: { alertId: 'alert-1', status: 'sent' },
      });
      expect(result).toBe(3);
    });
  });
});
