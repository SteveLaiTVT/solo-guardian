/**
 * @file auth.integration.spec.ts
 * @description Integration tests for auth flows against real database
 * @task TASK-101
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsModule } from '../analytics/analytics.module';

interface SeedUserInput {
  email: string;
  passwordHash: string;
  name: string;
}

async function seedUser(
  prisma: PrismaService,
  data: SeedUserInput,
): Promise<{ id: string }> {
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name,
    },
    select: { id: true },
  });

  return { id: user.id };
}

describe('Auth integration', () => {
  let moduleRef: TestingModule;
  let authService: AuthService;
  let prisma: PrismaService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        PrismaModule,
        AnalyticsModule,
        AuthModule,
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    prisma = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  afterEach(async () => {
    await prisma.refreshToken.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: { startsWith: 'integration-' } },
    });
  });

  it('registers, logs in, refreshes, and logs out', async () => {
    const email = `integration-${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    const name = 'Integration User';

    const registerResult = await authService.register({
      email,
      password,
      name,
    });

    expect(registerResult.user.email).toBe(email);
    expect(registerResult.tokens.accessToken).toBeTruthy();
    expect(registerResult.tokens.refreshToken).toBeTruthy();

    const loginResult = await authService.login({
      identifier: email,
      password,
    });

    expect(loginResult.user.email).toBe(email);
    expect(loginResult.tokens.refreshToken).toBeTruthy();

    const refreshResult = await authService.refreshTokens(
      loginResult.tokens.refreshToken,
    );

    expect(refreshResult.tokens.accessToken).toBeTruthy();
    expect(refreshResult.tokens.refreshToken).toBeTruthy();

    await authService.logout(refreshResult.tokens.refreshToken);

    // Verify the logged-out token can no longer be used
    await expect(
      authService.refreshTokens(refreshResult.tokens.refreshToken),
    ).rejects.toThrow();
  });

  it('rejects refresh after token is consumed', async () => {
    const email = `integration-${Date.now()}@example.com`;
    const password = 'TestPassword123!';

    const registerResult = await authService.register({
      email,
      password,
      name: 'Integration Refresh User',
    });

    const refreshToken = registerResult.tokens.refreshToken;
    await authService.refreshTokens(refreshToken);

    await expect(authService.refreshTokens(refreshToken)).rejects.toThrow(
      'Invalid or expired refresh token',
    );
  });

  it('logs in with a seeded user', async () => {
    const email = `integration-${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    const passwordHash = await bcrypt.hash(password, 12);

    await seedUser(prisma, {
      email,
      passwordHash,
      name: 'Seeded User',
    });

    const loginResult = await authService.login({
      identifier: email,
      password,
    });

    expect(loginResult.user.email).toBe(email);
  });
});
