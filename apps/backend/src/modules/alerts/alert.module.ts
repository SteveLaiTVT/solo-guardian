/**
 * @file alert.module.ts
 * @description Alert Module - Alert management infrastructure
 * @task TASK-027
 * @design_state_version 1.8.0
 */

import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationModule } from '../notifications';
// DONE(B): Import EmergencyContactsModule - TASK-027
import { EmergencyContactsModule } from '../emergency-contacts';
import { AlertRepository } from './alert.repository';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';

// DONE(B): Completed AlertModule setup - TASK-027
@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    // DONE(B): Import EmergencyContactsModule with forwardRef - TASK-027, TASK-070
    forwardRef(() => EmergencyContactsModule),
  ],
  controllers: [AlertController],
  providers: [AlertRepository, AlertService],
  exports: [AlertService],
})
export class AlertModule {}
