/**
 * @file emergency-contacts.module.ts
 * @description NestJS module for emergency contacts functionality
 * @task TASK-015, TASK-031, TASK-032, TASK-033, TASK-036, TASK-068, TASK-070
 * @design_state_version 3.9.0
 */
import { Module, forwardRef } from '@nestjs/common';
import {
  EmergencyContactsController,
  VerifyContactController,
  ContactLinkController,
} from './emergency-contacts.controller';
import { EmergencyContactsService } from './emergency-contacts.service';
import { ContactVerificationService } from './contact-verification.service';
import { PhoneVerificationService } from './phone-verification.service';
import { EmergencyContactsRepository } from './emergency-contacts.repository';
import { EmailModule } from '../email';
// DONE(B): Imported SmsModule - TASK-036
import { SmsModule } from '../sms';
import { AlertModule } from '../alerts';

@Module({
  imports: [
    forwardRef(() => EmailModule),
    // DONE(B): Added SmsModule - TASK-036
    SmsModule,
    forwardRef(() => AlertModule),
  ],
  controllers: [EmergencyContactsController, VerifyContactController, ContactLinkController],
  providers: [
    EmergencyContactsService,
    ContactVerificationService,
    PhoneVerificationService,
    EmergencyContactsRepository,
  ],
  exports: [EmergencyContactsService, ContactVerificationService, PhoneVerificationService, EmergencyContactsRepository],
})
export class EmergencyContactsModule {}
