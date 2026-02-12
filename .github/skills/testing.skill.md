# Testing Skill

This skill provides expertise in testing for Solo Guardian.

## When to Use This Skill

Use this skill when working on:
- Backend unit tests (Jest)
- Frontend component tests (React Testing Library)
- E2E tests (Playwright)
- Mobile tests (Flutter Test)
- Integration tests
- Test fixtures and mocks

## Testing Philosophy

1. **Test Pyramid**
   ```
        /\      E2E Tests (few)
       /  \     
      /----\    Integration Tests (some)
     /------\   
    /--------\  Unit Tests (many)
   ```

2. **What to Test**
   - Business logic (must test)
   - API endpoints (must test)
   - Critical user flows (must test)
   - Edge cases and error handling (should test)
   - UI components (optional)

3. **What NOT to Test**
   - Implementation details
   - Third-party libraries
   - Trivial code (getters/setters)

## Backend Unit Tests (Jest)

### Test Structure

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let repository: AuthRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<AuthRepository>(AuthRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = {
        id: '1',
        email,
        password: await hashPassword(password),
      };

      jest.spyOn(repository, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await service.login(email, password);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(repository.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);

      await expect(service.login('test@example.com', 'wrong'))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
```

### Testing Controllers

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return success response with tokens', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const tokens = {
        accessToken: 'access',
        refreshToken: 'refresh',
      };

      jest.spyOn(service, 'login').mockResolvedValue(tokens);

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        success: true,
        data: tokens,
      });
      expect(service.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });
  });
});
```

### Testing with Database

```typescript
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from './user.repository';

describe('UserRepository (Integration)', () => {
  let prisma: PrismaService;
  let repository: UserRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [PrismaService, UserRepository],
    }).compile();

    prisma = module.get(PrismaService);
    repository = module.get(UserRepository);

    // Clean database before tests
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
    };

    const user = await repository.create(userData);

    expect(user).toHaveProperty('id');
    expect(user.email).toBe(userData.email);

    // Verify in database
    const found = await prisma.user.findUnique({
      where: { id: user.id },
    });
    expect(found).toBeTruthy();
  });
});
```

## E2E Tests (Playwright)

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should login with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Log In');

    // Fill login form
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // Verify user is logged in
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.click('text=Log In');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Verify error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
```

### API Testing with Playwright

```typescript
import { test, expect } from '@playwright/test';

test.describe('Check-in API', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    // Login to get token
    const response = await request.post('http://localhost:3000/api/v1/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    const body = await response.json();
    authToken = body.data.accessToken;
  });

  test('should create a check-in', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/v1/check-in', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('id');
  });
});
```

### Page Object Model

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('http://localhost:5173/auth/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async getErrorMessage(): Promise<string | null> {
    const error = this.page.locator('[role="alert"]');
    return error.isVisible() ? error.textContent() : null;
  }
}

// Usage in test
test('login flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('test@example.com', 'password123');
  await expect(page).toHaveURL(/.*dashboard/);
});
```

## Mobile Tests (Flutter)

### Unit Tests

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';

@GenerateMocks([AuthRepository])
void main() {
  group('AuthNotifier', () {
    late AuthNotifier notifier;
    late MockAuthRepository mockRepo;

    setUp(() {
      mockRepo = MockAuthRepository();
      notifier = AuthNotifier(mockRepo);
    });

    test('login success updates state with user', () async {
      final user = User(id: '1', email: 'test@example.com');
      when(mockRepo.login(any, any)).thenAnswer((_) async => user);

      await notifier.login('test@example.com', 'password');

      expect(notifier.state.user, equals(user));
      expect(notifier.state.isLoading, false);
      expect(notifier.state.error, null);
    });

    test('login failure updates state with error', () async {
      when(mockRepo.login(any, any))
          .thenThrow(AppException(message: 'Invalid credentials'));

      await notifier.login('test@example.com', 'wrong');

      expect(notifier.state.user, null);
      expect(notifier.state.isLoading, false);
      expect(notifier.state.error, isNotNull);
    });
  });
}
```

### Widget Tests

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('CheckInButton', () {
    testWidgets('displays check-in text', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CheckInButton(onPressed: () {}),
          ),
        ),
      );

      expect(find.text('Check In'), findsOneWidget);
    });

    testWidgets('calls onPressed when tapped', (tester) async {
      bool pressed = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CheckInButton(onPressed: () => pressed = true),
          ),
        ),
      );

      await tester.tap(find.byType(CheckInButton));
      await tester.pump();

      expect(pressed, true);
    });

    testWidgets('shows loading indicator when loading', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CheckInButton(
              onPressed: () {},
              isLoading: true,
            ),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });
  });
}
```

## Common Commands

### Backend Tests

```bash
cd apps/backend

# Run all tests
pnpm run test

# Watch mode
pnpm run test:watch

# Coverage
pnpm run test:cov

# Single file
pnpm run test -- auth.service.spec.ts

# Pattern match
pnpm run test -- --testNamePattern "login"

# Debug
pnpm run test:debug
```

### E2E Tests

```bash
cd e2e

# Run all tests
pnpm run test

# UI mode
pnpm run test:ui

# Headed mode
pnpm run test:headed

# Specific browser
pnpm run test -- --project=chromium

# Single file
pnpm run test -- auth.spec.ts

# Debug mode
pnpm run test:debug

# Generate report
pnpm run test:report
```

### Mobile Tests

```bash
cd apps/mobile/solo_guardian

# Run all tests
flutter test

# With coverage
flutter test --coverage

# Single file
flutter test test/auth_test.dart

# Update goldens
flutter test --update-goldens
```

## Best Practices

1. **Follow AAA Pattern**
   - Arrange: Set up test data
   - Act: Execute the code under test
   - Assert: Verify the results

2. **Use Descriptive Names**
   ```typescript
   // Bad
   it('test 1', () => {});

   // Good
   it('should return 401 when token is expired', () => {});
   ```

3. **Test One Thing**
   - Each test should verify one behavior
   - Avoid testing multiple scenarios in one test

4. **Clean Up After Tests**
   ```typescript
   afterEach(async () => {
     await cleanupDatabase();
   });
   ```

5. **Use Test Fixtures**
   ```typescript
   const mockUser = {
     id: '1',
     email: 'test@example.com',
     name: 'Test User',
   };
   ```

6. **Mock External Dependencies**
   - Mock HTTP requests
   - Mock database calls
   - Mock third-party services

## Code Coverage

Target coverage: **80%+** for backend services

```bash
# Generate coverage report
cd apps/backend && pnpm run test:cov

# View HTML report
open coverage/lcov-report/index.html
```

## CI/CD Integration

Tests run automatically on:
- Push to main
- Pull request creation
- Before deployment

See `.github/workflows/e2e.yml` for E2E test configuration.

## Related Files

- `apps/backend/src/**/*.spec.ts` - Backend tests
- `e2e/tests/` - E2E tests
- `apps/mobile/solo_guardian/test/` - Mobile tests
- `AGENTS.md` - Full architecture guide
