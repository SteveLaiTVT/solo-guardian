/**
 * @file health.controller.ts
 * @description Health check endpoint for monitoring and E2E tests
 */
import { Controller, Get } from '@nestjs/common';

interface HealthResponse {
  status: string;
  timestamp: string;
}

@Controller('api/health')
export class HealthController {
  @Get()
  check(): HealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
