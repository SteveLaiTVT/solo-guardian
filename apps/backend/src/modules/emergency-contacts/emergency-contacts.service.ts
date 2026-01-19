/**
 * @file emergency-contacts.service.ts
 * @description Service for emergency contacts CRUD operations
 * @task TASK-015, TASK-066, TASK-067, TASK-068, TASK-069, TASK-070, TASK-100
 * @design_state_version 3.12.0
 */
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { EmergencyContact } from '@prisma/client';
import { EmergencyContactsRepository } from './emergency-contacts.repository';
import {
  CreateContactDto,
  UpdateContactDto,
  ContactResponseDto,
} from './dto';
import { AlertService } from '../alerts';

const MAX_CONTACTS = 5;

type EmergencyContactWithLinkedUser = EmergencyContact & {
  linkedUser: { id: string; name: string } | null;
};

export interface LinkedContactInfo {
  id: string;
  elderName: string;
  elderEmail: string | null;
  contactName: string;
  relationshipSince: Date;
  hasActiveAlerts: boolean;
}

export interface PendingInvitationInfo {
  id: string;
  elderName: string;
  elderEmail: string | null;
  contactName: string;
  invitedAt: Date;
}

@Injectable()
export class EmergencyContactsService {
  private readonly logger = new Logger(EmergencyContactsService.name);

  constructor(
    private readonly contactsRepository: EmergencyContactsRepository,
    @Inject(forwardRef(() => AlertService))
    private readonly alertService: AlertService,
  ) {}

  async findAll(userId: string): Promise<ContactResponseDto[]> {
    const contacts = await this.contactsRepository.findAllByUserId(userId);
    return contacts.map((c) => this.mapToResponse(c));
  }

  async findOne(id: string, userId: string): Promise<ContactResponseDto> {
    const contact = await this.contactsRepository.findByIdWithLinkedUser(id);
    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }
    return this.mapToResponse(contact);
  }

  async create(
    userId: string,
    dto: CreateContactDto,
  ): Promise<{ contact: ContactResponseDto; linkedUser: { linkedUserId: string; invitationToken: string } | null }> {
    const contacts = await this.contactsRepository.findAllByUserId(userId);
    if (contacts.length >= MAX_CONTACTS) {
      throw new BadRequestException(`Maximum ${MAX_CONTACTS} contacts allowed`);
    }

    const existing = await this.contactsRepository.findByEmail(userId, dto.email);
    if (existing) {
      throw new BadRequestException('Email already exists in contacts');
    }

    let priority = dto.priority;
    if (priority === undefined) {
      const usedPriorities = new Set(contacts.map((c) => c.priority));
      for (let p = 1; p <= MAX_CONTACTS; p++) {
        if (!usedPriorities.has(p)) {
          priority = p;
          break;
        }
      }
      priority = priority ?? contacts.length + 1;
    }

    const contact = await this.contactsRepository.create({
      userId,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      priority,
    });

    this.logger.log(`User ${userId} added emergency contact: ${dto.email}`);

    const linkResult = await this.checkAndLinkUser(contact.id, dto.email, userId);

    const contactWithLinkedUser = await this.contactsRepository.findByIdWithLinkedUser(contact.id);

    return {
      contact: this.mapToResponse(contactWithLinkedUser!),
      linkedUser: linkResult,
    };
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateContactDto,
  ): Promise<{ contact: ContactResponseDto; linkedUser: { linkedUserId: string; invitationToken: string } | null }> {
    const contact = await this.contactsRepository.findById(id);
    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    const emailChanged = dto.email && dto.email !== contact.email;

    if (emailChanged) {
      const existing = await this.contactsRepository.findByEmail(userId, dto.email!);
      if (existing) {
        throw new BadRequestException('Email already exists in contacts');
      }

      await this.contactsRepository.clearInvitation(id);
    }

    const updated = await this.contactsRepository.update(id, {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      priority: dto.priority,
      isActive: dto.isActive,
    });

    this.logger.log(`User ${userId} updated emergency contact: ${id}`);

    let linkResult: { linkedUserId: string; invitationToken: string } | null = null;
    if (emailChanged && dto.email) {
      const result = await this.checkAndLinkUser(id, dto.email, userId);
      if (result) {
        linkResult = { linkedUserId: result.linkedUserId, invitationToken: result.invitationToken };
      }
    }

    const contactWithLinkedUser = await this.contactsRepository.findByIdWithLinkedUser(id);

    return {
      contact: this.mapToResponse(contactWithLinkedUser!),
      linkedUser: linkResult,
    };
  }

  async remove(id: string, userId: string): Promise<void> {
    const contact = await this.contactsRepository.findById(id);
    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    await this.contactsRepository.softDelete(id);
    this.logger.log(`User ${userId} removed emergency contact: ${id}`);
  }

  async reorder(
    userId: string,
    contactIds: string[],
  ): Promise<ContactResponseDto[]> {
    const contacts = await this.contactsRepository.findAllByUserId(userId);
    const contactIdSet = new Set(contacts.map((c) => c.id));

    for (const id of contactIds) {
      if (!contactIdSet.has(id)) {
        throw new BadRequestException(`Contact ${id} not found`);
      }
    }

    const updated = await this.contactsRepository.updatePriorities(
      contactIds.map((id, index) => ({ id, priority: index + 1 })),
    );

    this.logger.log(`User ${userId} reordered emergency contacts`);
    return updated.map((c) => this.mapToResponse(c));
  }

  // DONE(B): Updated mapToResponse to include phoneVerified, preferredChannel, and linked user fields - TASK-036, TASK-065
  // DONE(B): Combined mapToResponse and mapToResponseSimple to reduce duplication - TASK-100
  private mapToResponse(
    contact: EmergencyContact | EmergencyContactWithLinkedUser,
  ): ContactResponseDto {
    const invitationStatus = contact.invitationAcceptedAt
      ? 'accepted'
      : contact.invitationSentAt
        ? 'pending'
        : 'none';

    const linkedUserName =
      'linkedUser' in contact && contact.linkedUser
        ? contact.linkedUser.name
        : null;

    return {
      id: contact.id,
      userId: contact.userId,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      priority: contact.priority,
      isVerified: contact.isVerified,
      isActive: contact.isActive,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      phoneVerified: contact.phoneVerified,
      preferredChannel: contact.preferredChannel as 'email' | 'sms',
      linkedUserId: contact.linkedUserId,
      linkedUserName,
      invitationStatus,
    };
  }

  // ============================================================
  // Linked Contact Methods - TASK-065, TASK-066, TASK-068, TASK-069
  // ============================================================

  async checkAndLinkUser(
    contactId: string,
    email: string,
    ownerId: string,
  ): Promise<{ linkedUserId: string; invitationToken: string } | null> {
    const existingUser = await this.contactsRepository.findUserByEmail(email);

    if (!existingUser || existingUser.id === ownerId) {
      return null;
    }

    const updated = await this.contactsRepository.setInvitationToken(
      contactId,
      existingUser.id,
    );

    this.logger.log(
      `Contact ${contactId} linked to existing user ${existingUser.id}, invitation sent`,
    );

    return {
      linkedUserId: existingUser.id,
      invitationToken: updated.invitationToken!,
    };
  }

  async getInvitationDetails(
    token: string,
  ): Promise<{ contactId: string; elderName: string; elderEmail: string | null; contactName: string } | null> {
    const contact = await this.contactsRepository.findByInvitationToken(token);

    if (!contact) {
      return null;
    }

    return {
      contactId: contact.id,
      elderName: contact.user.name,
      elderEmail: contact.user.email,
      contactName: contact.name,
    };
  }

  async acceptInvitation(
    token: string,
    acceptingUserId: string,
  ): Promise<{ success: boolean; elderName: string }> {
    const contact = await this.contactsRepository.findByInvitationToken(token);

    if (!contact) {
      throw new NotFoundException('Invitation not found or already accepted');
    }

    if (contact.linkedUserId !== acceptingUserId) {
      throw new ForbiddenException('This invitation is not for you');
    }

    await this.contactsRepository.acceptInvitation(contact.id);

    this.logger.log(
      `User ${acceptingUserId} accepted contact link invitation from ${contact.user.name}`,
    );

    return {
      success: true,
      elderName: contact.user.name,
    };
  }

  async getLinkedContacts(userId: string): Promise<LinkedContactInfo[]> {
    const contacts = await this.contactsRepository.findContactsWhereUserIsLinked(userId);

    const linkedContacts = await Promise.all(
      contacts.map(async (contact) => {
        const hasActiveAlerts = await this.alertService.hasActiveAlerts(contact.userId);
        return {
          id: contact.id,
          elderName: contact.user.name,
          elderEmail: contact.user.email,
          contactName: contact.name,
          relationshipSince: contact.invitationAcceptedAt!,
          hasActiveAlerts,
        };
      }),
    );

    return linkedContacts;
  }

  async getPendingInvitations(userId: string): Promise<PendingInvitationInfo[]> {
    const contacts = await this.contactsRepository.findPendingInvitationsForUser(userId);

    return contacts.map((contact) => ({
      id: contact.id,
      elderName: contact.user.name,
      elderEmail: contact.user.email,
      contactName: contact.name,
      invitedAt: contact.invitationSentAt!,
    }));
  }
}
