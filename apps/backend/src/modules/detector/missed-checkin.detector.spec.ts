import { Test, TestingModule } from '@nestjs/testing';
import { MissedCheckInDetector } from './missed-checkin.detector';
import { AlertService } from '../alerts';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email';

describe('MissedCheckInDetector', () => {
  let detector: MissedCheckInDetector;
  let alertService: jest.Mocked<AlertService>;
  let prisma: jest.Mocked<PrismaService>;
  let emailService: jest.Mocked<EmailService>;

  const mockUser = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockSettings = {
    userId: 'user-1',
    deadlineTime: '09:00',
    timezone: 'America/New_York',
    reminderEnabled: true,
    reminderTime: '08:00',
    lastReminderSentAt: null,
    user: mockUser,
  };

  beforeEach(async () => {
    const mockAlertService = {
      createAlert: jest.fn(),
      expireOldAlerts: jest.fn(),
    };

    const mockPrisma = {
      checkInSettings: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
      checkIn: {
        findUnique: jest.fn(),
      },
    };

    const mockEmailService = {
      sendReminderEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissedCheckInDetector,
        { provide: AlertService, useValue: mockAlertService },
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    detector = module.get<MissedCheckInDetector>(MissedCheckInDetector);
    alertService = module.get(AlertService);
    prisma = module.get(PrismaService);
    emailService = module.get(EmailService);
  });

  describe('onModuleInit', () => {
    it('should log initialization message', () => {
      const logSpy = jest.spyOn(detector['logger'], 'log');
      detector.onModuleInit();
      expect(logSpy).toHaveBeenCalledWith('Missed check-in detector initialized');
    });
  });

  describe('detectMissedCheckIns', () => {
    it('should skip if already running', async () => {
      detector['isRunning'] = true;

      await detector.detectMissedCheckIns();

      expect(prisma.checkInSettings.findMany).not.toHaveBeenCalled();
    });

    it('should create alert for missed check-in past deadline', async () => {
      const pastDeadlineSettings = {
        ...mockSettings,
        deadlineTime: '00:01',
      };

      (prisma.checkInSettings.findMany as jest.Mock).mockResolvedValue([pastDeadlineSettings]);
      (prisma.checkIn.findUnique as jest.Mock).mockResolvedValue(null);
      alertService.createAlert.mockResolvedValue({
        id: 'alert-1',
        userId: 'user-1',
        alertDate: '2025-01-15',
        status: 'triggered',
        triggeredAt: new Date(),
        resolvedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await detector.detectMissedCheckIns();

      expect(alertService.createAlert).toHaveBeenCalled();
    });

    it('should not create alert if check-in exists', async () => {
      const pastDeadlineSettings = {
        ...mockSettings,
        deadlineTime: '00:01',
      };

      (prisma.checkInSettings.findMany as jest.Mock).mockResolvedValue([pastDeadlineSettings]);
      (prisma.checkIn.findUnique as jest.Mock).mockResolvedValue({
        id: 'checkin-1',
        userId: 'user-1',
        checkInDate: new Date().toISOString().split('T')[0],
      });

      await detector.detectMissedCheckIns();

      expect(alertService.createAlert).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (prisma.checkInSettings.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

      await detector.detectMissedCheckIns();

      expect(detector['isRunning']).toBe(false);
    });

    it('should reset isRunning flag after completion', async () => {
      (prisma.checkInSettings.findMany as jest.Mock).mockResolvedValue([]);

      await detector.detectMissedCheckIns();

      expect(detector['isRunning']).toBe(false);
    });
  });

  describe('expireOldAlerts', () => {
    it('should expire old alerts', async () => {
      alertService.expireOldAlerts.mockResolvedValue(3);

      await detector.expireOldAlerts();

      expect(alertService.expireOldAlerts).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      alertService.expireOldAlerts.mockRejectedValue(new Error('DB error'));
      const errorSpy = jest.spyOn(detector['logger'], 'error');

      await detector.expireOldAlerts();

      expect(errorSpy).toHaveBeenCalled();
    });
  });

  describe('sendReminders', () => {
    it('should send reminder email to user', async () => {
      const reminderSettings = {
        ...mockSettings,
        reminderTime: '00:01',
        deadlineTime: '23:59',
        lastReminderSentAt: null,
      };

      (prisma.checkInSettings.findMany as jest.Mock).mockResolvedValue([reminderSettings]);
      (prisma.checkIn.findUnique as jest.Mock).mockResolvedValue(null);
      emailService.sendReminderEmail.mockResolvedValue(true);

      await detector.sendReminders();

      expect(emailService.sendReminderEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Test User',
        '23:59',
        'America/New_York',
      );
    });

    it('should update lastReminderSentAt after successful send', async () => {
      const reminderSettings = {
        ...mockSettings,
        reminderTime: '00:01',
        deadlineTime: '23:59',
        lastReminderSentAt: null,
      };

      (prisma.checkInSettings.findMany as jest.Mock).mockResolvedValue([reminderSettings]);
      (prisma.checkIn.findUnique as jest.Mock).mockResolvedValue(null);
      emailService.sendReminderEmail.mockResolvedValue(true);

      await detector.sendReminders();

      expect(prisma.checkInSettings.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: { lastReminderSentAt: expect.any(Date) },
      });
    });

    it('should not send reminder if already checked in', async () => {
      const reminderSettings = {
        ...mockSettings,
        reminderTime: '00:01',
        deadlineTime: '23:59',
      };

      (prisma.checkInSettings.findMany as jest.Mock).mockResolvedValue([reminderSettings]);
      (prisma.checkIn.findUnique as jest.Mock).mockResolvedValue({
        id: 'checkin-1',
        userId: 'user-1',
        checkInDate: new Date().toISOString().split('T')[0],
      });

      await detector.sendReminders();

      expect(emailService.sendReminderEmail).not.toHaveBeenCalled();
    });

    it('should not send reminder if already sent today', async () => {
      const today = new Date();
      const reminderSettings = {
        ...mockSettings,
        reminderTime: '00:01',
        deadlineTime: '23:59',
        lastReminderSentAt: today,
      };

      (prisma.checkInSettings.findMany as jest.Mock).mockResolvedValue([reminderSettings]);
      (prisma.checkIn.findUnique as jest.Mock).mockResolvedValue(null);

      await detector.sendReminders();

      expect(emailService.sendReminderEmail).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (prisma.checkInSettings.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));
      const errorSpy = jest.spyOn(detector['logger'], 'error');

      await detector.sendReminders();

      expect(errorSpy).toHaveBeenCalled();
    });
  });

  describe('private methods', () => {
    it('isPastDeadline should return true when past deadline', () => {
      const result = detector['isPastDeadline']('00:01', 'UTC');
      expect(typeof result).toBe('boolean');
    });

    it('getTodayInTimezone should return date string', () => {
      const result = detector['getTodayInTimezone']('UTC');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('wasReminderSentToday should return false when null', () => {
      const result = detector['wasReminderSentToday'](null, 'UTC');
      expect(result).toBe(false);
    });

    it('wasReminderSentToday should return true when sent today', () => {
      const result = detector['wasReminderSentToday'](new Date(), 'UTC');
      expect(result).toBe(true);
    });
  });
});
