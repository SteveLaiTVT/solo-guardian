/**
 * @file emergency-contacts.module.ts
 * @description NestJS module for emergency contacts functionality
 * @task TASK-015
 * @design_state_version 1.4.1
 */
import { Module } from '@nestjs/common';
import { EmergencyContactsController } from './emergency-contacts.controller';
import { EmergencyContactsService } from './emergency-contacts.service';
import { EmergencyContactsRepository } from './emergency-contacts.repository';

@Module({
  controllers: [EmergencyContactsController],
  providers: [EmergencyContactsService, EmergencyContactsRepository],
  exports: [EmergencyContactsService],
})
export class EmergencyContactsModule {}
