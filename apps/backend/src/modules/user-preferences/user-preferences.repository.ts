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

  async findUserById(userId: string): Promise<{
    id: string;
    name: string;
    email: string | null;
    username: string | null;
    phone: string | null;
    avatar: string | null;
    birthYear: number | null;
    createdAt: Date;
  } | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        phone: true,
        avatar: true,
        birthYear: true,
        createdAt: true,
      },
    });
  }

  async updateUser(
    userId: string,
    data: { name?: string; birthYear?: number | null; avatar?: string },
  ): Promise<{
    id: string;
    name: string;
    email: string | null;
    username: string | null;
    phone: string | null;
    avatar: string | null;
    birthYear: number | null;
    createdAt: Date;
  }> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        phone: true,
        avatar: true,
        birthYear: true,
        createdAt: true,
      },
    });
  }
}
