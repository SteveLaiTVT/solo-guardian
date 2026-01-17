/**
 * @file caregiver.service.ts
 * @description Caregiver service for business logic
 * @task TASK-046, TASK-058, TASK-060, TASK-061
 * @design_state_version 3.8.0
 */
import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { CaregiverRepository } from './caregiver.repository';
import {
  ElderSummary,
  ElderDetail,
  CaregiverSummary,
  InviteElderDto,
  CreateInvitationDto,
  InvitationResponseDto,
  InvitationDetailsDto,
  CreateNoteDto,
  NoteResponseDto,
  NotesListResponseDto,
} from './dto';

@Injectable()
export class CaregiverService {
  private readonly logger = new Logger(CaregiverService.name);

  constructor(private readonly caregiverRepository: CaregiverRepository) {}

  private getTodayStatus(
    lastCheckIn: string | null,
    settings: { deadlineTime: string } | null,
  ): 'checked_in' | 'pending' | 'overdue' {
    const today = new Date().toISOString().split('T')[0];

    if (lastCheckIn === today) {
      return 'checked_in';
    }

    if (!settings) {
      return 'pending';
    }

    const now = new Date();
    const [hours, minutes] = settings.deadlineTime.split(':').map(Number);
    const deadline = new Date();
    deadline.setHours(hours, minutes, 0, 0);

    return now > deadline ? 'overdue' : 'pending';
  }

  async getMyElders(caregiverId: string): Promise<ElderSummary[]> {
    const relations = await this.caregiverRepository.getEldersByCaregiver(caregiverId);

    return relations.map((r) => ({
      id: r.elder.id,
      name: r.elder.name,
      email: r.elder.email,
      lastCheckIn: r.elder.checkIns[0]?.checkInDate || null,
      todayStatus: this.getTodayStatus(
        r.elder.checkIns[0]?.checkInDate || null,
        r.elder.checkInSettings,
      ),
      isAccepted: r.isAccepted,
    }));
  }

  async getMyCaregivers(elderId: string): Promise<CaregiverSummary[]> {
    const relations = await this.caregiverRepository.getCaregivers(elderId);

    return relations.map((r) => ({
      id: r.caregiver.id,
      name: r.caregiver.name,
      email: r.caregiver.email,
      isAccepted: r.isAccepted,
    }));
  }

  async getElderDetail(caregiverId: string, elderId: string): Promise<ElderDetail> {
    const elder = await this.caregiverRepository.getElderDetail(caregiverId, elderId);

    if (!elder) {
      throw new NotFoundException('Elder not found or access not granted');
    }

    return {
      id: elder.id,
      name: elder.name,
      email: elder.email,
      lastCheckIn: elder.checkIns[0]?.checkInDate || null,
      todayStatus: this.getTodayStatus(
        elder.checkIns[0]?.checkInDate || null,
        elder.checkInSettings,
      ),
      isAccepted: true,
      checkInSettings: elder.checkInSettings,
      pendingAlerts: elder.alerts.length,
      emergencyContacts: elder.emergencyContacts,
    };
  }

  async inviteElder(caregiverId: string, dto: InviteElderDto): Promise<void> {
    const elder = await this.caregiverRepository.findUserByEmail(dto.email);

    if (!elder) {
      throw new NotFoundException('User not found with this email');
    }

    if (elder.id === caregiverId) {
      throw new ConflictException('You cannot add yourself as an elder');
    }

    const existingRelation = await this.caregiverRepository.findRelation(caregiverId, elder.id);

    if (existingRelation) {
      throw new ConflictException('Invitation already sent to this user');
    }

    await this.caregiverRepository.createRelation(caregiverId, elder.id);
    this.logger.log(`Caregiver ${caregiverId} invited elder ${elder.id}`);

    // TODO: Send email notification to elder
  }

  async acceptCaregiver(elderId: string, caregiverId: string): Promise<void> {
    const relation = await this.caregiverRepository.findRelation(caregiverId, elderId);

    if (!relation) {
      throw new NotFoundException('Caregiver invitation not found');
    }

    if (relation.isAccepted) {
      throw new ConflictException('Invitation already accepted');
    }

    await this.caregiverRepository.acceptRelation(caregiverId, elderId);
    this.logger.log(`Elder ${elderId} accepted caregiver ${caregiverId}`);
  }

  async removeCaregiver(elderId: string, caregiverId: string): Promise<void> {
    const relation = await this.caregiverRepository.findRelation(caregiverId, elderId);

    if (!relation) {
      throw new NotFoundException('Caregiver relation not found');
    }

    await this.caregiverRepository.deleteRelation(caregiverId, elderId);
    this.logger.log(`Elder ${elderId} removed caregiver ${caregiverId}`);
  }

  async removeElder(caregiverId: string, elderId: string): Promise<void> {
    const relation = await this.caregiverRepository.findRelation(caregiverId, elderId);

    if (!relation) {
      throw new NotFoundException('Elder relation not found');
    }

    await this.caregiverRepository.deleteRelation(caregiverId, elderId);
    this.logger.log(`Caregiver ${caregiverId} removed elder ${elderId}`);
  }

  // DONE(B): Invitation system - TASK-058
  async createInvitation(userId: string, dto: CreateInvitationDto): Promise<InvitationResponseDto> {
    const invitation = await this.caregiverRepository.createInvitation({
      inviterId: userId,
      relationshipType: dto.relationshipType,
      targetEmail: dto.targetEmail,
      targetPhone: dto.targetPhone,
    });

    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    const qrUrl = `${appUrl}/accept-invite?token=${invitation.token}`;

    this.logger.log(`Created ${dto.relationshipType} invitation by user ${userId}`);

    return {
      id: invitation.id,
      token: invitation.token,
      relationshipType: dto.relationshipType,
      targetEmail: dto.targetEmail || null,
      targetPhone: dto.targetPhone || null,
      expiresAt: invitation.expiresAt,
      inviterName: invitation.inviterName,
      qrUrl,
    };
  }

  async getInvitationDetails(token: string): Promise<InvitationDetailsDto> {
    const invitation = await this.caregiverRepository.findInvitationByToken(token);

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    const now = new Date();

    return {
      id: invitation.id,
      relationshipType: invitation.relationshipType,
      inviter: invitation.inviter,
      expiresAt: invitation.expiresAt,
      isExpired: now > invitation.expiresAt,
      isAccepted: !!invitation.acceptedAt,
    };
  }

  async acceptInvitation(token: string, userId: string): Promise<void> {
    const invitation = await this.caregiverRepository.findInvitationByToken(token);

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.acceptedAt) {
      throw new ConflictException('Invitation already accepted');
    }

    if (new Date() > invitation.expiresAt) {
      throw new BadRequestException('Invitation has expired');
    }

    if (invitation.inviter.id === userId) {
      throw new BadRequestException('Cannot accept your own invitation');
    }

    await this.caregiverRepository.acceptInvitation(
      invitation.id,
      userId,
      invitation.inviter.id,
      invitation.relationshipType,
    );

    this.logger.log(`User ${userId} accepted invitation from ${invitation.inviter.id}`);
  }

  // DONE(B): Caretaker check-in on behalf - TASK-060
  async checkInOnBehalf(
    caretakerId: string,
    elderId: string,
    note?: string,
  ): Promise<{ checkInDate: string; checkedInAt: Date }> {
    const relation = await this.caregiverRepository.getRelationByUsers(caretakerId, elderId);

    if (!relation) {
      throw new NotFoundException('Elder not found or access not granted');
    }

    if (relation.relationshipType !== 'caretaker') {
      throw new BadRequestException('Only caretakers can check in on behalf of elders');
    }

    const today = new Date().toISOString().split('T')[0];

    const checkIn = await this.caregiverRepository.createCaretakerCheckIn({
      userId: elderId,
      checkInDate: today,
      note,
      caretakerId,
    });

    this.logger.log(`Caretaker ${caretakerId} checked in for elder ${elderId}`);

    return {
      checkInDate: checkIn.checkInDate,
      checkedInAt: checkIn.checkedInAt,
    };
  }

  // DONE(B): Caregiver notes - TASK-061
  async addNote(
    caregiverId: string,
    elderId: string,
    dto: CreateNoteDto,
  ): Promise<NoteResponseDto> {
    const relation = await this.caregiverRepository.getRelationByUsers(caregiverId, elderId);

    if (!relation) {
      throw new NotFoundException('Elder not found or access not granted');
    }

    const noteDate = dto.noteDate || new Date().toISOString().split('T')[0];

    const note = await this.caregiverRepository.createNote({
      relationId: relation.id,
      content: dto.content,
      noteDate,
    });

    this.logger.log(`Caregiver ${caregiverId} added note for elder ${elderId}`);

    return note;
  }

  async getNotes(caregiverId: string, elderId: string): Promise<NotesListResponseDto> {
    const relation = await this.caregiverRepository.getRelationByUsers(caregiverId, elderId);

    if (!relation) {
      throw new NotFoundException('Elder not found or access not granted');
    }

    const notes = await this.caregiverRepository.getNotes(relation.id);

    return {
      notes,
      total: notes.length,
    };
  }
}
