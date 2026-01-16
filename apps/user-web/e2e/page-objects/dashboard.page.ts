// ============================================================
// Dashboard Page Object
// @task TASK-042
// @design_state_version 3.0.0
// ============================================================

import { Page, Locator, expect } from '@playwright/test';

/**
 * Dashboard Page Object Model
 * DONE(B): Implement DashboardPage - TASK-042
 */
export class DashboardPage {
  readonly page: Page;
  readonly checkInButton: Locator;
  readonly checkInStatus: Locator;
  readonly userGreeting: Locator;
  readonly logoutButton: Locator;
  readonly settingsLink: Locator;
  readonly contactsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkInButton = page.getByRole('button', { name: /check in|打卡|签到/i });
    this.checkInStatus = page.locator('[data-testid="check-in-status"], .check-in-status');
    this.userGreeting = page.locator('[data-testid="user-greeting"], .user-greeting, header');
    this.logoutButton = page.getByRole('button', { name: /logout|sign out|退出/i });
    this.settingsLink = page.getByRole('link', { name: /settings|设置/i });
    this.contactsLink = page.getByRole('link', { name: /contacts|联系人/i });
  }

  /**
   * Navigate to dashboard
   */
  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  /**
   * Perform daily check-in
   */
  async checkIn(): Promise<void> {
    await this.checkInButton.click();
  }

  /**
   * Assert check-in button is visible
   */
  async expectCheckInAvailable(): Promise<void> {
    await expect(this.checkInButton).toBeVisible();
  }

  /**
   * Assert check-in is completed for today
   */
  async expectCheckedIn(): Promise<void> {
    await expect(this.checkInStatus).toContainText(/completed|已完成|checked/i);
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.logoutButton.click();
    await expect(this.page).toHaveURL(/login/i, { timeout: 10000 });
  }

  /**
   * Navigate to settings page
   */
  async goToSettings(): Promise<void> {
    await this.settingsLink.click();
  }

  /**
   * Navigate to contacts page
   */
  async goToContacts(): Promise<void> {
    await this.contactsLink.click();
  }
}
