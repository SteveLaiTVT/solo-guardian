import { Test, TestingModule } from '@nestjs/testing';
import { CaregiverController } from './caregiver.controller';
import { CaregiverService } from './caregiver.service';

describe('CaregiverController', () => {
  let controller: CaregiverController;
  let service: jest.Mocked<CaregiverService>;

  const mockUserId = 'user-1';

  const mockElderSummary = {
    id: 'elder-1',
    name: 'Elder',
    email: 'elder@example.com',
    lastCheckIn: '2025-01-15',
    todayStatus: 'checked_in' as const,
    isAccepted: true,
  };

  const mockCaregiverSummary = {
    id: 'caregiver-1',
    name: 'Caregiver',
    email: 'caregiver@example.com',
    isAccepted: true,
  };

  const mockElderDetail = {
    ...mockElderSummary,
    checkInSettings: { deadlineTime: '09:00', reminderTime: '08:00', timezone: 'UTC' },
    pendingAlerts: 0,
    emergencyContacts: [],
  };

  const mockInvitationResponse = {
    id: 'invitation-1',
    token: 'test-token',
    relationshipType: 'caregiver' as const,
    targetEmail: 'target@example.com',
    targetPhone: null,
    expiresAt: new Date(),
    inviterName: 'Test User',
    qrUrl: 'http://localhost:5173/accept-invite?token=test-token',
  };

  const mockInvitationDetails = {
    id: 'invitation-1',
    relationshipType: 'caregiver' as const,
    inviter: { id: 'inviter-1', name: 'Inviter', email: 'inviter@example.com' },
    expiresAt: new Date(),
    isExpired: false,
    isAccepted: false,
  };

  beforeEach(async () => {
    const mockService = {
      getMyElders: jest.fn(),
      getMyCaregivers: jest.fn(),
      getElderDetail: jest.fn(),
      inviteElder: jest.fn(),
      acceptCaregiver: jest.fn(),
      removeCaregiver: jest.fn(),
      removeElder: jest.fn(),
      createInvitation: jest.fn(),
      getInvitationDetails: jest.fn(),
      acceptInvitation: jest.fn(),
      checkInOnBehalf: jest.fn(),
      addNote: jest.fn(),
      getNotes: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaregiverController],
      providers: [
        { provide: CaregiverService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<CaregiverController>(CaregiverController);
    service = module.get(CaregiverService);
  });

  describe('getMyElders', () => {
    it('should return list of elders', async () => {
      service.getMyElders.mockResolvedValue([mockElderSummary]);

      const result = await controller.getMyElders(mockUserId);

      expect(service.getMyElders).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockElderSummary]);
    });
  });

  describe('getMyCaregivers', () => {
    it('should return list of caregivers', async () => {
      service.getMyCaregivers.mockResolvedValue([mockCaregiverSummary]);

      const result = await controller.getMyCaregivers(mockUserId);

      expect(service.getMyCaregivers).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockCaregiverSummary]);
    });
  });

  describe('getElderDetail', () => {
    it('should return elder details', async () => {
      service.getElderDetail.mockResolvedValue(mockElderDetail);

      const result = await controller.getElderDetail(mockUserId, 'elder-1');

      expect(service.getElderDetail).toHaveBeenCalledWith('user-1', 'elder-1');
      expect(result).toEqual(mockElderDetail);
    });
  });

  describe('inviteElder', () => {
    it('should send invitation to elder', async () => {
      service.inviteElder.mockResolvedValue(undefined);

      const result = await controller.inviteElder(mockUserId, { email: 'elder@example.com' });

      expect(service.inviteElder).toHaveBeenCalledWith('user-1', { email: 'elder@example.com' });
      expect(result).toEqual({ message: 'Invitation sent' });
    });
  });

  describe('acceptCaregiver', () => {
    it('should accept caregiver invitation', async () => {
      service.acceptCaregiver.mockResolvedValue(undefined);

      const result = await controller.acceptCaregiver(mockUserId, { caregiverId: 'caregiver-1' });

      expect(service.acceptCaregiver).toHaveBeenCalledWith('user-1', 'caregiver-1');
      expect(result).toEqual({ message: 'Caregiver accepted' });
    });
  });

  describe('removeCaregiver', () => {
    it('should remove caregiver', async () => {
      service.removeCaregiver.mockResolvedValue(undefined);

      const result = await controller.removeCaregiver(mockUserId, 'caregiver-1');

      expect(service.removeCaregiver).toHaveBeenCalledWith('user-1', 'caregiver-1');
      expect(result).toEqual({ message: 'Caregiver removed' });
    });
  });

  describe('removeElder', () => {
    it('should remove elder', async () => {
      service.removeElder.mockResolvedValue(undefined);

      const result = await controller.removeElder(mockUserId, 'elder-1');

      expect(service.removeElder).toHaveBeenCalledWith('user-1', 'elder-1');
      expect(result).toEqual({ message: 'Elder removed' });
    });
  });

  describe('createInvitation', () => {
    it('should create invitation', async () => {
      service.createInvitation.mockResolvedValue(mockInvitationResponse);

      const result = await controller.createInvitation(mockUserId, {
        relationshipType: 'caregiver',
        targetEmail: 'target@example.com',
      });

      expect(service.createInvitation).toHaveBeenCalledWith('user-1', {
        relationshipType: 'caregiver',
        targetEmail: 'target@example.com',
      });
      expect(result).toEqual(mockInvitationResponse);
    });
  });

  describe('getInvitationDetails', () => {
    it('should return invitation details', async () => {
      service.getInvitationDetails.mockResolvedValue(mockInvitationDetails);

      const result = await controller.getInvitationDetails('test-token');

      expect(service.getInvitationDetails).toHaveBeenCalledWith('test-token');
      expect(result).toEqual(mockInvitationDetails);
    });
  });

  describe('acceptInvitation', () => {
    it('should accept invitation', async () => {
      service.acceptInvitation.mockResolvedValue(undefined);

      const result = await controller.acceptInvitation(mockUserId, 'test-token');

      expect(service.acceptInvitation).toHaveBeenCalledWith('test-token', 'user-1');
      expect(result).toEqual({ message: 'Invitation accepted' });
    });
  });

  describe('checkInOnBehalf', () => {
    it('should check in on behalf of elder', async () => {
      const checkInResult = { checkInDate: '2025-01-15', checkedInAt: new Date() };
      service.checkInOnBehalf.mockResolvedValue(checkInResult);

      const result = await controller.checkInOnBehalf(mockUserId, 'elder-1', { note: 'Test note' });

      expect(service.checkInOnBehalf).toHaveBeenCalledWith('user-1', 'elder-1', 'Test note');
      expect(result).toEqual(checkInResult);
    });
  });

  describe('addNote', () => {
    it('should add note for elder', async () => {
      const note = {
        id: 'note-1',
        content: 'Test note',
        noteDate: '2025-01-15',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.addNote.mockResolvedValue(note);

      const result = await controller.addNote(mockUserId, 'elder-1', {
        content: 'Test note',
        noteDate: '2025-01-15',
      });

      expect(service.addNote).toHaveBeenCalledWith('user-1', 'elder-1', {
        content: 'Test note',
        noteDate: '2025-01-15',
      });
      expect(result).toEqual(note);
    });
  });

  describe('getNotes', () => {
    it('should return notes for elder', async () => {
      const notesResult = {
        notes: [{ id: 'note-1', content: 'Test', noteDate: '2025-01-15', createdAt: new Date(), updatedAt: new Date() }],
        total: 1,
      };
      service.getNotes.mockResolvedValue(notesResult);

      const result = await controller.getNotes(mockUserId, 'elder-1');

      expect(service.getNotes).toHaveBeenCalledWith('user-1', 'elder-1');
      expect(result).toEqual(notesResult);
    });
  });
});
