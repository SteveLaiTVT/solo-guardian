/**
 * @file emergency-contacts.module.ts
 * @description NestJS module for emergency contacts functionality
 * @task TASK-015, TASK-031, TASK-032, TASK-033
 * @design_state_version 2.0.0
 */
import { Module } from '@nestjs/common';
import {
  EmergencyContactsController,
  VerifyContactController,
} from './emergency-contacts.controller';
import { EmergencyContactsService } from './emergency-contacts.service';
import { ContactVerificationService } from './contact-verification.service';
import { EmergencyContactsRepository } from './emergency-contacts.repository';
import { EmailModule } from '../email';

@Module({
  imports: [EmailModule],
  controllers: [EmergencyContactsController, VerifyContactController],
  providers: [
    EmergencyContactsService,
    ContactVerificationService,
    EmergencyContactsRepository,
  ],
  exports: [EmergencyContactsService, ContactVerificationService],
})
export class EmergencyContactsModule {}
