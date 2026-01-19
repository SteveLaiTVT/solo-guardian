/**
 * @file main.ts
 * @description Application entry point
 * @task TASK-018
 * @design_state_version 1.6.1
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string>('CORS_ORIGINS');
  const origins = corsOrigins
    ? corsOrigins.split(',').map((o) => o.trim())
    : ['http://localhost:5173', 'http://localhost:5174'];

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
