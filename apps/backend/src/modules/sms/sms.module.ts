/**
 * @file sms.module.ts
 * @description SMS Module - Provides SMS sending capability
 * @task TASK-034
 * @design_state_version 3.1.0
 */

// DONE(B): Import Module from '@nestjs/common' - TASK-034
import { Module } from '@nestjs/common';

// DONE(B): Import SmsService - TASK-034
import { SmsService } from './sms.service';

/**
 * SMS Module - Provides SMS sending capabilities via Twilio
 * DONE(B): Define SmsModule class with @Module decorator - TASK-034
 */
@Module({
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
