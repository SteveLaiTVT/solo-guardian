// ============================================================
// Login Page Object
// @task TASK-042
// @design_state_version 3.0.0
// ============================================================

import { Page, Locator, expect } from '@playwright/test';

/**
 * Login Page Object Model
 * DONE(B): Implement LoginPage - TASK-042
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.submitButton = page.getByRole('button', { name: /sign in|login|登录/i });
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, [role="alert"]');
    this.registerLink = page.getByRole('link', { name: /register|sign up|注册/i });
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  /**
   * Fill login form
   */
  async fillForm(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Submit login form
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Perform complete login
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillForm(email, password);
    await this.submit();
  }

  /**
   * Assert error message is visible
   */
  async expectError(message?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }

  /**
   * Assert redirect to dashboard after successful login
   */
  async expectRedirectToDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard|home/i, { timeout: 10000 });
  }
}
