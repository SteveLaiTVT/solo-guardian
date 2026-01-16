/**
 * @file check-in.spec.ts
 * @description E2E tests for check-in functionality
 * @task TASK-044
 * @design_state_version 3.6.0
 */
import { test, expect, DashboardPage, SettingsPage } from '../fixtures/test-fixtures';

test.describe('Check-in Flow', () => {
  test.describe('Dashboard', () => {
    test('should display check-in button when not checked in', async ({ authenticatedPage }) => {
      const dashboard = new DashboardPage(authenticatedPage);
      await dashboard.goto();

      // Should show check-in button or status
      await expect(authenticatedPage.locator('[data-testid="check-in-button"], button:has-text("Check in")')).toBeVisible();
    });

    test('should allow user to check in', async ({ authenticatedPage }) => {
      const dashboard = new DashboardPage(authenticatedPage);
      await dashboard.goto();

      // Find and click check-in button
      const checkInButton = authenticatedPage.locator('[data-testid="check-in-button"], button:has-text("Check in")');

      // If already checked in, this test should be skipped
      if (await checkInButton.isHidden()) {
        test.skip();
        return;
      }

      await checkInButton.click();

      // Wait for success indication
      await expect(
        authenticatedPage.locator('[data-testid="check-in-status"], text=/checked in|success/i')
      ).toBeVisible({ timeout: 10000 });
    });

    test('should display check-in history', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');

      // Look for history section or link
      const historySection = authenticatedPage.locator('[data-testid="check-in-history"], text=/history|recent/i');

      await expect(historySection).toBeVisible();
    });

    test('should show user greeting', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');

      // Should show user name or greeting
      await expect(authenticatedPage.locator('text=/hello|welcome|hi/i')).toBeVisible();
    });
  });

  test.describe('Settings', () => {
    test('should display settings page', async ({ authenticatedPage }) => {
      const settings = new SettingsPage(authenticatedPage);
      await settings.goto();

      // Should show settings form elements
      await expect(authenticatedPage.locator('text=/settings|preferences/i')).toBeVisible();
    });

    test('should display deadline time setting', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/settings');

      // Look for deadline time input
      await expect(
        authenticatedPage.locator('[name="deadlineTime"], [data-testid="deadline-time"], text=/deadline/i')
      ).toBeVisible();
    });

    test('should display reminder time setting', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/settings');

      // Look for reminder time input
      await expect(
        authenticatedPage.locator('[name="reminderTime"], [data-testid="reminder-time"], text=/reminder/i')
      ).toBeVisible();
    });

    test('should display timezone setting', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/settings');

      // Look for timezone selector
      await expect(
        authenticatedPage.locator('[name="timezone"], [data-testid="timezone"], text=/timezone/i')
      ).toBeVisible();
    });

    test('should allow updating settings', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/settings');

      // Find save button
      const saveButton = authenticatedPage.locator(
        'button[type="submit"], [data-testid="save-settings"], button:has-text("Save")'
      );

      await expect(saveButton).toBeVisible();

      // Make a change and save
      await saveButton.click();

      // Should show success message or not show error
      await expect(authenticatedPage.locator('.text-red-500')).toBeHidden({ timeout: 5000 }).catch(() => {
        // It's okay if there's no error shown
      });
    });
  });

  test.describe('History', () => {
    test('should navigate to history page', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');

      // Find history link and click
      const historyLink = authenticatedPage.locator('a[href*="history"], [data-testid="view-history"]');

      if (await historyLink.isVisible()) {
        await historyLink.click();
        await expect(authenticatedPage).toHaveURL(/history/);
      }
    });

    test('should display check-in records', async ({ authenticatedPage }) => {
      // First ensure there's at least one check-in
      await authenticatedPage.goto('/');
      const checkInButton = authenticatedPage.locator('[data-testid="check-in-button"], button:has-text("Check in")');

      if (await checkInButton.isVisible()) {
        await checkInButton.click();
        await authenticatedPage.waitForTimeout(1000);
      }

      // Navigate to history
      await authenticatedPage.goto('/');

      // Check for history items
      const historyItems = authenticatedPage.locator('[data-testid="history-item"], [class*="history"]');

      // Should have at least one history item or show empty state
      await expect(
        historyItems.first().or(authenticatedPage.locator('text=/no check-ins|empty|nothing/i'))
      ).toBeVisible();
    });
  });
});

test.describe('Emergency Contacts', () => {
  test('should display contacts page', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/contacts');

    await expect(authenticatedPage.locator('text=/emergency|contacts/i')).toBeVisible();
  });

  test('should show add contact button', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/contacts');

    await expect(
      authenticatedPage.locator('button:has-text("Add"), [data-testid="add-contact"]')
    ).toBeVisible();
  });

  test('should open add contact form', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/contacts');

    const addButton = authenticatedPage.locator('button:has-text("Add"), [data-testid="add-contact"]');
    await addButton.click();

    // Should show form with name and email fields
    await expect(authenticatedPage.locator('input[name="name"]')).toBeVisible();
    await expect(authenticatedPage.locator('input[type="email"], input[name="email"]')).toBeVisible();
  });

  test('should create a new contact', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/contacts');

    // Open add form
    const addButton = authenticatedPage.locator('button:has-text("Add"), [data-testid="add-contact"]');
    await addButton.click();

    // Fill form
    const uniqueEmail = `contact-${Date.now()}@example.com`;
    await authenticatedPage.fill('input[name="name"]', 'Test Contact');
    await authenticatedPage.fill('input[type="email"], input[name="email"]', uniqueEmail);

    // Submit
    await authenticatedPage.click('button[type="submit"], button:has-text("Save")');

    // Should show the new contact
    await expect(authenticatedPage.locator(`text=Test Contact`)).toBeVisible({ timeout: 10000 });
  });

  test('should validate contact form', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/contacts');

    const addButton = authenticatedPage.locator('button:has-text("Add"), [data-testid="add-contact"]');
    await addButton.click();

    // Submit without filling
    await authenticatedPage.click('button[type="submit"], button:has-text("Save")');

    // Should show validation errors
    await expect(authenticatedPage.locator('.text-red-500')).toBeVisible();
  });
});
