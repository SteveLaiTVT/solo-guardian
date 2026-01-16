// ============================================================
// Notification Module - Notification delivery infrastructure
// @task TASK-026
// @design_state_version 1.8.0
// ============================================================

import { Module } from '@nestjs/common';
// TODO(B): Import BullModule from '@nestjs/bull'
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailModule } from '../email';
import { QUEUE_NAMES } from '../queue';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';
import { NotificationProcessor } from './notification.processor';

/**
 * Notification Module - Handles notification delivery
 *
 * TODO(B): Complete module setup
 * Requirements:
 * - Import PrismaModule for database access
 * - Import EmailModule for sending emails
 * - Register Bull queue for notifications
 * - Provide repository, service, and processor
 * - Export service for use by other modules
 *
 * Queue Configuration:
 * - Register NOTIFICATION queue with BullModule.registerQueue()
 *
 * Acceptance:
 * - Module loads without errors
 * - Queue registered and accessible
 * - Service can be injected in other modules
 */
@Module({
  imports: [
    PrismaModule,
    EmailModule,
    // TODO(B): Register notification queue with BullModule.registerQueue()
    // BullModule.registerQueue({ name: QUEUE_NAMES.NOTIFICATION }),
  ],
  providers: [
    NotificationRepository,
    NotificationService,
    NotificationProcessor,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
