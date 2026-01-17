/**
 * @file caregiver.repository.ts
 * @description Caregiver repository for database operations
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { AlertStatus } from '@prisma/client';

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
}
