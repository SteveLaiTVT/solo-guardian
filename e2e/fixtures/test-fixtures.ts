/**
 * @file test-fixtures.ts
 * @description Shared test fixtures and utilities for E2E tests
 * @task TASK-042
 * @design_state_version 3.6.0
 */
import { test as base, expect, Page, BrowserContext } from '@playwright/test';

// Test user credentials
export const TEST_USER = {
  email: 'e2e-test@example.com',
  password: 'TestPassword123!',
  name: 'E2E Test User',
};

// Alternative test user for multi-user scenarios
export const TEST_USER_2 = {
  email: 'e2e-test-2@example.com',
  password: 'TestPassword456!',
  name: 'E2E Test User 2',
};

// Storage state file path for authenticated sessions
export const STORAGE_STATE_PATH = '.auth/user.json';

/**
 * Extended test fixtures with authentication helpers
 */
export interface TestFixtures {
  /** Authenticated page - user is already logged in */
  authenticatedPage: Page;
  /** Login helper function */
  loginAs: (email: string, password: string) => Promise<void>;
  /** Register helper function */
  registerUser: (email: string, password: string, name: string) => Promise<void>;
  /** Logout helper function */
  logout: () => Promise<void>;
}

/**
 * Base test with custom fixtures
 */
export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    // Create context with stored authentication state
    const context = await browser.newContext({
      storageState: STORAGE_STATE_PATH,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  loginAs: async ({ page }, use) => {
    const login = async (email: string, password: string): Promise<void> => {
      await page.goto('/login');
      await page.fill('input#identifier', email);
      await page.fill('input#password', password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/');
    };
    await use(login);
  },

  registerUser: async ({ page }, use) => {
    const register = async (email: string, password: string, name: string): Promise<void> => {
      await page.goto('/register');
      await page.fill('input#name', name);
      await page.fill('input#email', email);
      await page.fill('input#password', password);
      await page.fill('input#confirmPassword', password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/(onboarding)?$/);
    };
    await use(register);
  },

  logout: async ({ page }, use) => {
    const logout = async (): Promise<void> => {
      // Click user menu and logout
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');
      await page.waitForURL('/login');
    };
    await use(logout);
  },
});

/**
 * Page Object Model - Login Page
 */
export class LoginPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.fill('input#identifier', email);
    await this.page.fill('input#password', password);
    await this.page.click('button[type="submit"]');
  }

  async expectError(message: string | RegExp): Promise<void> {
    await expect(this.page.locator('.text-red-500')).toContainText(message);
  }

  async expectRedirectToDashboard(): Promise<void> {
    await this.page.waitForURL('/');
  }
}

/**
 * Page Object Model - Register Page
 */
export class RegisterPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/register');
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await this.page.fill('input#name', name);
    await this.page.fill('input#email', email);
    await this.page.fill('input#password', password);
    await this.page.fill('input#confirmPassword', password);
    await this.page.click('button[type="submit"]');
  }

  async expectError(message: string | RegExp): Promise<void> {
    await expect(this.page.locator('.text-red-500')).toContainText(message);
  }
}

/**
 * Page Object Model - Dashboard Page
 */
export class DashboardPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async checkIn(note?: string): Promise<void> {
    if (note) {
      await this.page.fill('textarea[name="note"]', note);
    }
    await this.page.click('[data-testid="check-in-button"]');
  }

  async expectCheckedIn(): Promise<void> {
    await expect(this.page.locator('[data-testid="check-in-status"]')).toContainText('Checked in');
  }

  async expectNotCheckedIn(): Promise<void> {
    await expect(this.page.locator('[data-testid="check-in-status"]')).not.toContainText('Checked in');
  }
}

/**
 * Page Object Model - Settings Page
 */
export class SettingsPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/settings');
  }

  async setDeadlineTime(time: string): Promise<void> {
    await this.page.fill('input[name="deadlineTime"]', time);
    await this.page.click('[data-testid="save-settings"]');
  }

  async setReminderTime(time: string): Promise<void> {
    await this.page.fill('input[name="reminderTime"]', time);
    await this.page.click('[data-testid="save-settings"]');
  }

  async toggleReminder(enabled: boolean): Promise<void> {
    const checkbox = this.page.locator('input[name="reminderEnabled"]');
    const isChecked = await checkbox.isChecked();
    if (isChecked !== enabled) {
      await checkbox.click();
    }
    await this.page.click('[data-testid="save-settings"]');
  }
}

/**
 * API helper for direct backend interaction in tests
 */
export class ApiHelper {
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async createTestUser(
    email: string,
    password: string,
    name: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ?? data?.message ?? 'Registration failed';
      throw new Error(`Failed to create test user: ${errorMessage}`);
    }

    return data?.data?.tokens ?? data.tokens;
  }

  async deleteTestUser(accessToken: string): Promise<void> {
    // TODO(B): Implement user deletion endpoint for test cleanup
  }

  async resetTestDatabase(): Promise<void> {
    // TODO(B): Implement database reset for test isolation
  }
}

// Re-export expect for convenience
export { expect };
