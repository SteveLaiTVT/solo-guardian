/**
 * @file main.ts
 * @description Application entry point
 * @task TASK-018, TASK-097
 * @design_state_version 3.12.0
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string>('CORS_ORIGINS');
  const origins = corsOrigins
    ? corsOrigins.split(',').map((o) => o.trim())
    : ['http://localhost:5173', 'http://localhost:5174'];

  // DONE(B): Add helmet for security headers - TASK-097
  // Must be configured before CORS
  app.use(
    helmet({
      // X-Frame-Options: DENY - prevents clickjacking
      frameguard: { action: 'deny' },
      // X-Content-Type-Options: nosniff - prevents MIME sniffing
      noSniff: true,
      // Strict-Transport-Security for HTTPS
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
      },
      // Content-Security-Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", ...origins],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },
      // X-XSS-Protection header (legacy, but still useful for older browsers)
      xssFilter: true,
    }),
  );

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  // DONE(B): Register GlobalExceptionFilter
  // This ensures all exceptions are caught and formatted consistently
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
