/**
 * @file emergency-contacts.module.ts
 * @description NestJS module for emergency contacts functionality
 * @task TASK-015, TASK-031, TASK-032, TASK-033
 * @design_state_version 2.0.0
 */
import { Module } from '@nestjs/common';
import { EmergencyContactsController } from './emergency-contacts.controller';
import { EmergencyContactsService } from './emergency-contacts.service';
import { EmergencyContactsRepository } from './emergency-contacts.repository';
// TODO(B): Import EmailModule for verification emails - TASK-032
// import { EmailModule } from '../email';

@Module({
  imports: [
    // TODO(B): Import EmailModule - TASK-032
    // EmailModule,
  ],
  controllers: [
    EmergencyContactsController,
    // TODO(B): Add VerifyContactController - TASK-033
    // VerifyContactController,
  ],
  providers: [EmergencyContactsService, EmergencyContactsRepository],
  exports: [EmergencyContactsService],
})
export class EmergencyContactsModule {}
