/**
 * @file emergency-contacts.repository.ts
 * @description Repository for emergency contacts database operations
 * @task TASK-015
 * @design_state_version 1.4.1
 */
import { Injectable } from '@nestjs/common';
import { EmergencyContact } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EmergencyContactsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * TODO(B): Implement findAllByUserId
   * Requirements:
   * - Find all contacts for user where deletedAt is null
   * - Order by priority ascending
   * Acceptance:
   * - Returns array of EmergencyContact
   * Constraints:
   * - Exclude soft-deleted contacts
   */
  async findAllByUserId(userId: string): Promise<EmergencyContact[]> {
    return this.prisma.emergencyContact.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        priority: 'asc',
      },
    });
  }

  /**
   * TODO(B): Implement findById
   * Requirements:
   * - Find contact by ID
   * Acceptance:
   * - Returns EmergencyContact or null
   */
  async findById(id: string): Promise<EmergencyContact | null> {
    return this.prisma.emergencyContact.findUnique({
      where: { id },
    });
  }

  /**
   * TODO(B): Implement findByEmail
   * Requirements:
   * - Find contact by userId and email
   * - Exclude soft-deleted contacts
   * Acceptance:
   * - Returns EmergencyContact or null
   */
  async findByEmail(
    userId: string,
    email: string,
  ): Promise<EmergencyContact | null> {
    return this.prisma.emergencyContact.findFirst({
      where: {
        userId,
        email,
        deletedAt: null,
      },
    });
  }

  /**
   * TODO(B): Implement countByUserId
   * Requirements:
   * - Count active contacts for user
   * Acceptance:
   * - Returns number of contacts
   * Constraints:
   * - Exclude soft-deleted contacts
   */
  async countByUserId(userId: string): Promise<number> {
    return this.prisma.emergencyContact.count({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  /**
   * TODO(B): Implement create
   * Requirements:
   * - Create new emergency contact
   * Acceptance:
   * - Returns created EmergencyContact
   */
  async create(data: {
    userId: string;
    name: string;
    email: string;
    phone?: string;
    priority: number;
  }): Promise<EmergencyContact> {
    return this.prisma.emergencyContact.create({
      data: {
        userId: data.userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        priority: data.priority,
      },
    });
  }

  /**
   * TODO(B): Implement update
   * Requirements:
   * - Update contact fields
   * Acceptance:
   * - Returns updated EmergencyContact
   */
  async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      priority?: number;
      isActive?: boolean;
    },
  ): Promise<EmergencyContact> {
    return this.prisma.emergencyContact.update({
      where: { id },
      data,
    });
  }

  /**
   * TODO(B): Implement softDelete
   * Requirements:
   * - Set deletedAt to current timestamp
   * Acceptance:
   * - Contact has deletedAt set
   * Constraints:
   * - Do NOT hard delete
   */
  async softDelete(id: string): Promise<EmergencyContact> {
    return this.prisma.emergencyContact.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * TODO(B): Implement updatePriorities
   * Requirements:
   * - Update priorities for multiple contacts in transaction
   * Acceptance:
   * - All contacts updated with new priorities
   * Constraints:
   * - Use transaction for atomicity
   */
  async updatePriorities(
    updates: Array<{ id: string; priority: number }>,
  ): Promise<EmergencyContact[]> {
    return this.prisma.$transaction(
      updates.map((u) =>
        this.prisma.emergencyContact.update({
          where: { id: u.id },
          data: { priority: u.priority },
        }),
      ),
    );
  }
}
