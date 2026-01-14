/**
 * @file jwt-auth.guard.ts
 * @description Guard that validates JWT access tokens
 * @task TASK-007
 * @design_state_version 0.9.0
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
