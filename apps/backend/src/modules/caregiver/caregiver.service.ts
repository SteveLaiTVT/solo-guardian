/**
 * @file caregiver.service.ts
 * @description Caregiver service for business logic
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { CaregiverRepository } from './caregiver.repository';
import {
  ElderSummary,
  ElderDetail,
  CaregiverSummary,
  InviteElderDto,
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
}
