/**
 * @file emergency-contacts.service.ts
 * @description Service for emergency contacts business logic
 * @task TASK-015
 * @design_state_version 1.4.1
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

const MAX_CONTACTS = 5;

@Injectable()
export class EmergencyContactsService {
  private readonly logger = new Logger(EmergencyContactsService.name);

  constructor(private readonly contactsRepository: EmergencyContactsRepository) {}

  /**
   * TODO(B): Implement findAll
   * Requirements:
   * - Call repository to get all active contacts
   * - Map to response DTOs
   * Acceptance:
   * - Returns array of ContactResponseDto
   * Constraints:
   * - Exclude soft-deleted contacts (deletedAt != null)
   */
  async findAll(userId: string): Promise<ContactResponseDto[]> {
    const contacts = await this.contactsRepository.findAllByUserId(userId);
    return contacts.map((c) => this.mapToResponse(c));
  }

  /**
   * TODO(B): Implement findOne
   * Requirements:
   * - Call repository to get contact by ID
   * - Verify contact belongs to user
   * - Throw NotFoundException if not found
   * Acceptance:
   * - Returns ContactResponseDto or throws 404
   * Constraints:
   * - Must verify userId matches
   */
  async findOne(id: string, userId: string): Promise<ContactResponseDto> {
    const contact = await this.contactsRepository.findById(id);

    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    return this.mapToResponse(contact);
  }

  /**
   * TODO(B): Implement create
   * Requirements:
   * - Check contact count limit (max 5)
   * - Check email uniqueness
   * - Auto-assign priority if not provided
   * - Log creation event
   * Acceptance:
   * - Returns new ContactResponseDto
   * - Throws BadRequestException if limit/duplicate
   * Constraints:
   * - Max 5 contacts per user
   */
  async create(
    userId: string,
    dto: CreateContactDto,
  ): Promise<ContactResponseDto> {
    // TODO(B): Check contact count
    const count = await this.contactsRepository.countByUserId(userId);
    if (count >= MAX_CONTACTS) {
      throw new BadRequestException(`Maximum ${MAX_CONTACTS} contacts allowed`);
    }

    // TODO(B): Check email uniqueness
    const existing = await this.contactsRepository.findByEmail(userId, dto.email);
    if (existing) {
      throw new BadRequestException('Email already exists in contacts');
    }

    // TODO(B): Auto-assign priority
    const priority = dto.priority ?? (count + 1);

    // TODO(B): Create contact via repository
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

  /**
   * TODO(B): Implement update
   * Requirements:
   * - Verify contact exists and belongs to user
   * - If email changed, check uniqueness
   * - Update via repository
   * - Log update event
   * Acceptance:
   * - Returns updated ContactResponseDto
   * Constraints:
   * - Cannot update to duplicate email
   */
  async update(
    id: string,
    userId: string,
    dto: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    // TODO(B): Verify contact exists and belongs to user
    const contact = await this.contactsRepository.findById(id);
    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    // TODO(B): Check email uniqueness if changed
    if (dto.email && dto.email !== contact.email) {
      const existing = await this.contactsRepository.findByEmail(userId, dto.email);
      if (existing) {
        throw new BadRequestException('Email already exists in contacts');
      }
    }

    // TODO(B): Update via repository
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

  /**
   * TODO(B): Implement remove (soft delete)
   * Requirements:
   * - Verify contact exists and belongs to user
   * - Set deletedAt timestamp (soft delete)
   * - Do NOT reorder remaining contacts
   * - Log deletion event
   * Acceptance:
   * - Contact is soft-deleted (deletedAt set)
   * Constraints:
   * - Must be soft delete, not hard delete
   */
  async remove(id: string, userId: string): Promise<void> {
    // TODO(B): Verify contact exists and belongs to user
    const contact = await this.contactsRepository.findById(id);
    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    // TODO(B): Soft delete via repository
    await this.contactsRepository.softDelete(id);

    this.logger.log(`User ${userId} removed emergency contact: ${id}`);
  }

  /**
   * TODO(B): Implement reorder
   * Requirements:
   * - Validate all contact IDs belong to user
   * - Update priorities based on array position (1, 2, 3...)
   * - Return updated contacts in new order
   * Acceptance:
   * - All contacts have new priorities matching array order
   * Constraints:
   * - All IDs must be valid and belong to user
   */
  async reorder(
    userId: string,
    contactIds: string[],
  ): Promise<ContactResponseDto[]> {
    // TODO(B): Validate all contacts belong to user
    const contacts = await this.contactsRepository.findAllByUserId(userId);
    const contactIdSet = new Set(contacts.map((c) => c.id));

    for (const id of contactIds) {
      if (!contactIdSet.has(id)) {
        throw new BadRequestException(`Contact ${id} not found`);
      }
    }

    // TODO(B): Update priorities
    const updated = await this.contactsRepository.updatePriorities(
      contactIds.map((id, index) => ({ id, priority: index + 1 })),
    );

    this.logger.log(`User ${userId} reordered emergency contacts`);

    return updated.map((c) => this.mapToResponse(c));
  }

  /**
   * TODO(B): Implement mapToResponse helper
   * Requirements:
   * - Map EmergencyContact entity to ContactResponseDto
   * Constraints:
   * - Do not expose deletedAt in response
   */
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
}
