/**
 * @file prisma.module.ts
 * @description Global Prisma module for database access
 * @task TASK-001-A
 * @design_state_version 0.2.0
 */
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
