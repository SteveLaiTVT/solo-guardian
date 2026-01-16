// ============================================================
// Alert Module - Alert management infrastructure
// @task TASK-027
// @design_state_version 1.8.0
// ============================================================

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationModule } from '../notifications';
// TODO(B): Import EmergencyContactsModule if needed
import { AlertRepository } from './alert.repository';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';

/**
 * Alert Module - Handles missed check-in alerts
 *
 * TODO(B): Complete module setup
 * Requirements:
 * - Import PrismaModule for database access
 * - Import NotificationModule for sending notifications
 * - Import EmergencyContactsModule for getting contacts
 * - Provide repository, service, and controller
 * - Export service for use by detector
 *
 * Acceptance:
 * - Module loads without errors
 * - Endpoints accessible with authentication
 * - Service can be injected in detector
 */
@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    // TODO(B): Import EmergencyContactsModule
  ],
  controllers: [AlertController],
  providers: [AlertRepository, AlertService],
  exports: [AlertService],
})
export class AlertModule {}
