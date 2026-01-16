/**
 * @file emergency-contacts.module.ts
 * @description NestJS module for emergency contacts functionality
 * @task TASK-015, TASK-031, TASK-032, TASK-033, TASK-036
 * @design_state_version 3.4.0
 */
import { Module } from '@nestjs/common';
import {
  EmergencyContactsController,
  VerifyContactController,
} from './emergency-contacts.controller';
import { EmergencyContactsService } from './emergency-contacts.service';
import { ContactVerificationService } from './contact-verification.service';
import { PhoneVerificationService } from './phone-verification.service';
import { EmergencyContactsRepository } from './emergency-contacts.repository';
import { EmailModule } from '../email';
// DONE(B): Imported SmsModule - TASK-036
import { SmsModule } from '../sms';

@Module({
  imports: [
    EmailModule,
    // DONE(B): Added SmsModule - TASK-036
    SmsModule,
  ],
  controllers: [EmergencyContactsController, VerifyContactController],
  providers: [
    EmergencyContactsService,
    ContactVerificationService,
    PhoneVerificationService,
    EmergencyContactsRepository,
  ],
  exports: [EmergencyContactsService, ContactVerificationService, PhoneVerificationService],
})
export class EmergencyContactsModule {}
