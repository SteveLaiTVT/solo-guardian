/**
 * @file caregiver.repository.ts
 * @description Caregiver repository for database operations
 * @task TASK-046, TASK-058, TASK-060, TASK-061
 * @design_state_version 3.8.0
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { AlertStatus } from '@prisma/client';
import * as crypto from 'crypto';

type RelationshipType = 'caregiver' | 'family' | 'caretaker';

interface ElderWithRelations {
  id: string;
  name: string;
  email: string;
  checkIns: Array<{ checkInDate: string }>;
  checkInSettings: {
    deadlineTime: string;
    reminderTime: string;
    timezone: string;
  } | null;
  alerts: Array<{ id: string }>;
  emergencyContacts: Array<{
    id: string;
    name: string;
    isVerified: boolean;
  }>;
}

@Injectable()
export class CaregiverRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRelation(caregiverId: string, elderId: string): Promise<{
    id: string;
    caregiverId: string;
    elderId: string;
    isAccepted: boolean;
  } | null> {
    return this.prisma.caregiverRelation.findUnique({
      where: {
        caregiverId_elderId: {
          caregiverId,
          elderId,
        },
      },
    });
  }

  async createRelation(caregiverId: string, elderId: string): Promise<{
    id: string;
    caregiverId: string;
    elderId: string;
    isAccepted: boolean;
  }> {
    return this.prisma.caregiverRelation.create({
      data: {
        caregiverId,
        elderId,
        isAccepted: false,
      },
    });
  }

  async acceptRelation(caregiverId: string, elderId: string): Promise<void> {
    await this.prisma.caregiverRelation.update({
      where: {
        caregiverId_elderId: {
          caregiverId,
          elderId,
        },
      },
      data: { isAccepted: true },
    });
  }

  async deleteRelation(caregiverId: string, elderId: string): Promise<void> {
    await this.prisma.caregiverRelation.delete({
      where: {
        caregiverId_elderId: {
          caregiverId,
          elderId,
        },
      },
    });
  }

  async getEldersByCaregiver(caregiverId: string): Promise<Array<{
    elder: ElderWithRelations;
    isAccepted: boolean;
  }>> {
    const today = new Date().toISOString().split('T')[0];

    const relations = await this.prisma.caregiverRelation.findMany({
      where: { caregiverId },
      include: {
        elder: {
          include: {
            checkIns: {
              orderBy: { checkInDate: 'desc' },
              take: 1,
            },
            checkInSettings: true,
            alerts: {
              where: {
                status: AlertStatus.triggered,
                alertDate: today,
              },
            },
            emergencyContacts: {
              where: { deletedAt: null },
              select: {
                id: true,
                name: true,
                isVerified: true,
              },
            },
          },
        },
      },
    });

    return relations.map((r) => ({
      elder: r.elder,
      isAccepted: r.isAccepted,
    }));
  }

  async getCaregivers(elderId: string): Promise<Array<{
    caregiver: { id: string; name: string; email: string };
    isAccepted: boolean;
  }>> {
    const relations = await this.prisma.caregiverRelation.findMany({
      where: { elderId },
      include: {
        caregiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return relations.map((r) => ({
      caregiver: r.caregiver,
      isAccepted: r.isAccepted,
    }));
  }

  async getElderDetail(caregiverId: string, elderId: string): Promise<ElderWithRelations | null> {
    const today = new Date().toISOString().split('T')[0];

    const relation = await this.prisma.caregiverRelation.findUnique({
      where: {
        caregiverId_elderId: {
          caregiverId,
          elderId,
        },
        isAccepted: true,
      },
      include: {
        elder: {
          include: {
            checkIns: {
              orderBy: { checkInDate: 'desc' },
              take: 1,
            },
            checkInSettings: true,
            alerts: {
              where: {
                status: AlertStatus.triggered,
                alertDate: today,
              },
            },
            emergencyContacts: {
              where: { deletedAt: null },
              select: {
                id: true,
                name: true,
                isVerified: true,
              },
            },
          },
        },
      },
    });

    return relation?.elder || null;
  }

  async findUserByEmail(email: string): Promise<{
    id: string;
    name: string;
    email: string;
  } | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  // DONE(B): Invitation management methods - TASK-058
  async createInvitation(data: {
    inviterId: string;
    relationshipType: RelationshipType;
    targetEmail?: string;
    targetPhone?: string;
  }): Promise<{
    id: string;
    token: string;
    expiresAt: Date;
    inviterName: string;
  }> {
    const token = crypto.randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invitation = await this.prisma.caregiverInvitation.create({
      data: {
        inviterId: data.inviterId,
        relationshipType: data.relationshipType,
        targetEmail: data.targetEmail,
        targetPhone: data.targetPhone,
        token,
        expiresAt,
      },
      include: {
        inviter: { select: { name: true } },
      },
    });

    return {
      id: invitation.id,
      token: invitation.token,
      expiresAt: invitation.expiresAt,
      inviterName: invitation.inviter.name,
    };
  }

  async findInvitationByToken(token: string): Promise<{
    id: string;
    relationshipType: RelationshipType;
    expiresAt: Date;
    acceptedAt: Date | null;
    inviter: { id: string; name: string; email: string };
  } | null> {
    const invitation = await this.prisma.caregiverInvitation.findUnique({
      where: { token },
      include: {
        inviter: { select: { id: true, name: true, email: true } },
      },
    });

    if (!invitation) return null;

    return {
      id: invitation.id,
      relationshipType: invitation.relationshipType as RelationshipType,
      expiresAt: invitation.expiresAt,
      acceptedAt: invitation.acceptedAt,
      inviter: invitation.inviter,
    };
  }

  async acceptInvitation(
    invitationId: string,
    acceptorId: string,
    inviterId: string,
    relationshipType: RelationshipType,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.caregiverInvitation.update({
        where: { id: invitationId },
        data: { acceptedAt: new Date() },
      });

      const existingRelation = await tx.caregiverRelation.findUnique({
        where: { caregiverId_elderId: { caregiverId: inviterId, elderId: acceptorId } },
      });

      if (!existingRelation) {
        await tx.caregiverRelation.create({
          data: {
            caregiverId: inviterId,
            elderId: acceptorId,
            relationshipType,
            isAccepted: true,
          },
        });
      } else {
        await tx.caregiverRelation.update({
          where: { id: existingRelation.id },
          data: { isAccepted: true, relationshipType },
        });
      }

      if (relationshipType === 'family') {
        const reverseRelation = await tx.caregiverRelation.findUnique({
          where: { caregiverId_elderId: { caregiverId: acceptorId, elderId: inviterId } },
        });

        if (!reverseRelation) {
          await tx.caregiverRelation.create({
            data: {
              caregiverId: acceptorId,
              elderId: inviterId,
              relationshipType: 'family',
              isAccepted: true,
            },
          });
        }
      }
    });
  }

  // DONE(B): Caregiver notes methods - TASK-061
  async createNote(data: {
    relationId: string;
    content: string;
    noteDate: string;
  }): Promise<{
    id: string;
    content: string;
    noteDate: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    return this.prisma.caregiverNote.create({
      data: {
        relationId: data.relationId,
        content: data.content,
        noteDate: data.noteDate,
      },
    });
  }

  async getNotes(relationId: string, limit: number = 30): Promise<Array<{
    id: string;
    content: string;
    noteDate: string;
    createdAt: Date;
    updatedAt: Date;
  }>> {
    return this.prisma.caregiverNote.findMany({
      where: { relationId },
      orderBy: { noteDate: 'desc' },
      take: limit,
    });
  }

  async getRelationByUsers(caregiverId: string, elderId: string): Promise<{
    id: string;
    relationshipType: RelationshipType;
    isAccepted: boolean;
  } | null> {
    const relation = await this.prisma.caregiverRelation.findUnique({
      where: { caregiverId_elderId: { caregiverId, elderId } },
      select: { id: true, relationshipType: true, isAccepted: true },
    });

    if (!relation) return null;

    return {
      id: relation.id,
      relationshipType: relation.relationshipType as RelationshipType,
      isAccepted: relation.isAccepted,
    };
  }

  // DONE(B): Caretaker check-in on behalf - TASK-060
  async createCaretakerCheckIn(data: {
    userId: string;
    checkInDate: string;
    note?: string;
    caretakerId: string;
  }): Promise<{
    id: string;
    checkInDate: string;
    checkedInAt: Date;
    note: string | null;
  }> {
    return this.prisma.checkIn.upsert({
      where: {
        userId_checkInDate: {
          userId: data.userId,
          checkInDate: data.checkInDate,
        },
      },
      update: {
        note: data.note,
        checkedInByCaretakerId: data.caretakerId,
      },
      create: {
        userId: data.userId,
        checkInDate: data.checkInDate,
        note: data.note,
        checkedInByCaretakerId: data.caretakerId,
      },
    });
  }
}
