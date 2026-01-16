/**
 * @file emergency-contacts.service.ts
 * @description Service for emergency contacts business logic
 * @task TASK-015, TASK-031, TASK-033
 * @design_state_version 2.0.0
 */
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EmergencyContact } from '@prisma/client';
import { EmergencyContactsRepository } from './emergency-contacts.repository';
import {
  CreateContactDto,
  UpdateContactDto,
  ContactResponseDto,
} from './dto';
// DONE(B): Import EmailService and PrismaService - TASK-031
import { EmailService } from '../email';
import { PrismaService } from '../../prisma/prisma.service';

const MAX_CONTACTS = 5;

@Injectable()
export class EmergencyContactsService {
  private readonly logger = new Logger(EmergencyContactsService.name);

  constructor(
    private readonly contactsRepository: EmergencyContactsRepository,
    // DONE(B): Inject EmailService and PrismaService - TASK-031
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  // DONE(B): Implemented findAll - TASK-015
  async findAll(userId: string): Promise<ContactResponseDto[]> {
    const contacts = await this.contactsRepository.findAllByUserId(userId);
    return contacts.map((c) => this.mapToResponse(c));
  }

  // DONE(B): Implemented findOne - TASK-015
  async findOne(id: string, userId: string): Promise<ContactResponseDto> {
    const contact = await this.contactsRepository.findById(id);

    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    return this.mapToResponse(contact);
  }

  // DONE(B): Implemented create - TASK-015
  async create(
    userId: string,
    dto: CreateContactDto,
  ): Promise<ContactResponseDto> {
    // Get existing contacts for count check and priority calculation
    const contacts = await this.contactsRepository.findAllByUserId(userId);
    if (contacts.length >= MAX_CONTACTS) {
      throw new BadRequestException(`Maximum ${MAX_CONTACTS} contacts allowed`);
    }

    // Check email uniqueness
    const existing = await this.contactsRepository.findByEmail(userId, dto.email);
    if (existing) {
      throw new BadRequestException('Email already exists in contacts');
    }

    // Auto-assign priority: find lowest available slot in 1-5
    let priority = dto.priority;
    if (priority === undefined) {
      const usedPriorities = new Set(contacts.map((c) => c.priority));
      for (let p = 1; p <= MAX_CONTACTS; p++) {
        if (!usedPriorities.has(p)) {
          priority = p;
          break;
        }
      }
      // Fallback: if somehow no slot found (shouldn't happen since count < MAX), use count + 1
      priority = priority ?? contacts.length + 1;
    }

    // Create contact via repository
    const contact = await this.contactsRepository.create({
      userId,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      priority,
    });

    this.logger.log(`User ${userId} added emergency contact: ${dto.email}`);

    return this.mapToResponse(contact);
  }

  // DONE(B): Implemented update - TASK-015
  async update(
    id: string,
    userId: string,
    dto: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    // Verify contact exists and belongs to user
    const contact = await this.contactsRepository.findById(id);
    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    // Check email uniqueness if changed
    if (dto.email && dto.email !== contact.email) {
      const existing = await this.contactsRepository.findByEmail(userId, dto.email);
      if (existing) {
        throw new BadRequestException('Email already exists in contacts');
      }
    }

    // Update via repository
    const updated = await this.contactsRepository.update(id, {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      priority: dto.priority,
      isActive: dto.isActive,
    });

    this.logger.log(`User ${userId} updated emergency contact: ${id}`);

    return this.mapToResponse(updated);
  }

  // DONE(B): Implemented remove (soft delete) - TASK-015
  async remove(id: string, userId: string): Promise<void> {
    // Verify contact exists and belongs to user
    const contact = await this.contactsRepository.findById(id);
    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    // Soft delete via repository
    await this.contactsRepository.softDelete(id);

    this.logger.log(`User ${userId} removed emergency contact: ${id}`);
  }

  // DONE(B): Implemented reorder - TASK-015
  async reorder(
    userId: string,
    contactIds: string[],
  ): Promise<ContactResponseDto[]> {
    // Validate all contacts belong to user
    const contacts = await this.contactsRepository.findAllByUserId(userId);
    const contactIdSet = new Set(contacts.map((c) => c.id));

    for (const id of contactIds) {
      if (!contactIdSet.has(id)) {
        throw new BadRequestException(`Contact ${id} not found`);
      }
    }

    // Update priorities
    const updated = await this.contactsRepository.updatePriorities(
      contactIds.map((id, index) => ({ id, priority: index + 1 })),
    );

    this.logger.log(`User ${userId} reordered emergency contacts`);

    return updated.map((c) => this.mapToResponse(c));
  }

  // DONE(B): Implemented mapToResponse helper - TASK-015
  private mapToResponse(contact: EmergencyContact): ContactResponseDto {
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
    };
  }

  // ============================================================
  // Contact Verification - TASK-031, TASK-033
  // ============================================================

  /**
   * Send verification email to a contact
   * DONE(B): Implemented sendVerification - TASK-031
   */
  async sendVerification(
    contactId: string,
    userId: string,
  ): Promise<ContactResponseDto> {
    // Verify contact exists and belongs to user
    const contact = await this.contactsRepository.findById(contactId);
    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    // Check if already verified
    if (contact.isVerified) {
      throw new BadRequestException('Contact is already verified');
    }

    // Get user's name for email personalization
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate verification token
    const updatedContact = await this.contactsRepository.setVerificationToken(contactId);

    // Send verification email
    const emailSent = await this.emailService.sendVerificationEmail(
      contact.email,
      contact.name,
      user.name,
      updatedContact.verificationToken!,
    );

    if (!emailSent) {
      this.logger.error(`Failed to send verification email to ${contact.email}`);
    }

    this.logger.log(`Verification email sent to contact ${contactId}`);

    return this.mapToResponse(updatedContact);
  }

  /**
   * Resend verification email to a contact
   * DONE(B): Implemented resendVerification - TASK-031
   */
  async resendVerification(
    contactId: string,
    userId: string,
  ): Promise<ContactResponseDto> {
    // Verify contact exists and belongs to user
    const contact = await this.contactsRepository.findById(contactId);
    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    // Check if already verified
    if (contact.isVerified) {
      throw new BadRequestException('Contact is already verified');
    }

    // Get user's name for email personalization
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Regenerate verification token (always generate new token for resend)
    const updatedContact = await this.contactsRepository.setVerificationToken(contactId);

    // Send verification email
    const emailSent = await this.emailService.sendVerificationEmail(
      contact.email,
      contact.name,
      user.name,
      updatedContact.verificationToken!,
    );

    if (!emailSent) {
      this.logger.error(`Failed to resend verification email to ${contact.email}`);
    }

    this.logger.log(`Verification email resent to contact ${contactId}`);

    return this.mapToResponse(updatedContact);
  }

  /**
   * Verify a contact via token (public endpoint, no auth)
   * DONE(B): Implemented verifyContact - TASK-033
   */
  async verifyContact(token: string): Promise<{
    success: boolean;
    contactName: string;
    userName: string;
  }> {
    // Find contact by verification token
    const contact = await this.contactsRepository.findByVerificationToken(token);

    if (!contact) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Check token is not expired
    if (!contact.verificationTokenExpiresAt || contact.verificationTokenExpiresAt < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    // Mark contact as verified
    await this.contactsRepository.markVerified(contact.id);

    this.logger.log(`Contact ${contact.id} verified successfully`);

    return {
      success: true,
      contactName: contact.name,
      userName: contact.user.name,
    };
  }
}
