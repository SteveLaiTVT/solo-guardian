// ============================================================
// SMS Module - Twilio SMS infrastructure
// @task TASK-034
// @design_state_version 3.0.0
// ============================================================

import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';

/**
 * SMS Module - Provides SMS sending capabilities via Twilio
 * DONE(B): SMS module setup - TASK-034
 */
@Module({
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
