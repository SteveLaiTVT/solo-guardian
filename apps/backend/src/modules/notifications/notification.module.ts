/**
 * @file notification.module.ts
 * @description Notification Module - Notification delivery infrastructure
 * @task TASK-026
 * @design_state_version 1.8.0
 */

import { Module } from '@nestjs/common';
// DONE(B): Import BullModule from '@nestjs/bull' - TASK-026
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailModule } from '../email';
import { QUEUE_NAMES } from '../queue';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';
import { NotificationProcessor } from './notification.processor';

// DONE(B): Completed NotificationModule setup - TASK-026
@Module({
  imports: [
    PrismaModule,
    EmailModule,
    // DONE(B): Register notification queue with BullModule.registerQueue() - TASK-026
    BullModule.registerQueue({ name: QUEUE_NAMES.NOTIFICATION }),
  ],
  providers: [
    NotificationRepository,
    NotificationService,
    NotificationProcessor,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
