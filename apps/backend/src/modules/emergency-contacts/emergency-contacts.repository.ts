/**
 * @file emergency-contacts.repository.ts
 * @description Repository for emergency contacts database operations
 * @task TASK-015
 * @design_state_version 1.4.1
 */
import { Injectable } from '@nestjs/common';
import { EmergencyContact, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EmergencyContactsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // DONE(B): Implemented findAllByUserId - TASK-015
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

  // DONE(B): Implemented findById - TASK-015
  async findById(id: string): Promise<EmergencyContact | null> {
    return this.prisma.emergencyContact.findUnique({
      where: { id },
    });
  }

  // DONE(B): Implemented findByEmail - TASK-015
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

  // DONE(B): Implemented countByUserId - TASK-015
  async countByUserId(userId: string): Promise<number> {
    return this.prisma.emergencyContact.count({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  // Get the maximum priority value for a user's active contacts
  async getMaxPriority(userId: string): Promise<number> {
    const result = await this.prisma.emergencyContact.aggregate({
      where: {
        userId,
        deletedAt: null,
      },
      _max: {
        priority: true,
      },
    });
    return result._max.priority ?? 0;
  }

  // DONE(B): Implemented create - TASK-015
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

  // DONE(B): Implemented update - TASK-015
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

  // DONE(B): Implemented softDelete - TASK-015
  async softDelete(id: string): Promise<EmergencyContact> {
    return this.prisma.emergencyContact.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // DONE(B): Implemented updatePriorities - TASK-015
  // Uses single UPDATE with CASE to avoid unique constraint violations during swap
  async updatePriorities(
    updates: Array<{ id: string; priority: number }>,
  ): Promise<EmergencyContact[]> {
    if (updates.length === 0) {
      return [];
    }

    const ids = updates.map((u) => u.id);

    // Build parameterized CASE expression for atomic priority update
    const caseFragments = updates.map(
      (u) => Prisma.sql`WHEN id = ${u.id}::uuid THEN ${u.priority}`,
    );
    const caseExpression = Prisma.sql`CASE ${Prisma.join(caseFragments, ' ')} END`;
    const idList = Prisma.join(
      ids.map((id) => Prisma.sql`${id}::uuid`),
      ', ',
    );

    // Single UPDATE avoids transient unique constraint violations
    await this.prisma.$executeRaw`
      UPDATE emergency_contacts
      SET priority = ${caseExpression},
          updated_at = NOW()
      WHERE id IN (${idList})
    `;

    // Return updated contacts in priority order
    return this.prisma.emergencyContact.findMany({
      where: { id: { in: ids } },
      orderBy: { priority: 'asc' },
    });
  }
}
