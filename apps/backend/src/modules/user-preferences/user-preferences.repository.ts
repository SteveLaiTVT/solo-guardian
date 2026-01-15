/**
 * @file user-preferences.repository.ts
 * @description Repository for user preferences database operations
 * @task TASK-021
 * @design_state_version 1.6.0
 */
import { Injectable } from '@nestjs/common';
import { UserPreferences, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserPreferencesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<UserPreferences | null> {
    return this.prisma.userPreferences.findUnique({
      where: { userId },
    });
  }

  async create(userId: string): Promise<UserPreferences> {
    return this.prisma.userPreferences.create({
      data: { userId },
    });
  }

  async update(
    userId: string,
    data: Prisma.UserPreferencesUpdateInput,
  ): Promise<UserPreferences> {
    return this.prisma.userPreferences.update({
      where: { userId },
      data,
    });
  }

  async upsert(
    userId: string,
    data: Prisma.UserPreferencesUpdateInput,
  ): Promise<UserPreferences> {
    return this.prisma.userPreferences.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data } as Prisma.UserPreferencesCreateInput,
    });
  }
}
