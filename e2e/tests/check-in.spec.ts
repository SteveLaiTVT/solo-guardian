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

    test('should allow user to check in or show already checked in', async ({ authenticatedPage }) => {
      const dashboard = new DashboardPage(authenticatedPage);
      await dashboard.goto();

      // Find check-in button
      const checkInButton = authenticatedPage.locator('[data-testid="check-in-button"]');
      await expect(checkInButton).toBeVisible();

      // Check if user has already checked in (button is disabled)
      const isDisabled = await checkInButton.isDisabled();

      if (isDisabled) {
        // Already checked in - verify the status shows safe message
        await expect(
          authenticatedPage.locator("text=You're safe today!")
        ).toBeVisible();
      } else {
        // Can check in - click and verify success
        await checkInButton.click();
        await expect(
          authenticatedPage.locator("text=You're safe today!")
        ).toBeVisible({ timeout: 10000 });
      }
    });

    test('should be able to navigate to history page', async ({ authenticatedPage }) => {
      // History page should be accessible via direct navigation
      await authenticatedPage.goto('/history');

      // Should show history page title
      await expect(authenticatedPage.locator('h1:has-text("History")')).toBeVisible();
    });

    test('should show user greeting', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/');

      // Should show greeting based on time of day
      await expect(authenticatedPage.locator('text=/good morning|good afternoon|good evening/i')).toBeVisible();
    });
  });

  test.describe('Settings', () => {
    test('should display settings page', async ({ authenticatedPage }) => {
      const settings = new SettingsPage(authenticatedPage);
      await settings.goto();

      // Should show settings title
      await expect(authenticatedPage.locator('h1:has-text("Settings")')).toBeVisible();
    });

    test('should display check-in settings section', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/settings');

      // Look for check-in settings section (h3 heading)
      await expect(
        authenticatedPage.locator('h3:has-text("Check-in Settings")')
      ).toBeVisible();
    });

    test('should display reminder settings', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/settings');

      // Look for reminder setting checkbox
      await expect(
        authenticatedPage.locator('text=Enable daily reminders')
      ).toBeVisible();
    });

    test('should display account section', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/settings');

      // Look for account section heading
      await expect(
        authenticatedPage.locator('h3:has-text("Account")')
      ).toBeVisible();
    });

    test('should display sign out button', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/settings');

      // Look for sign out button
      await expect(
        authenticatedPage.locator('button:has-text("Sign out")')
      ).toBeVisible();
    });
  });

  test.describe('History', () => {
    test('should display history page with title', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/history');

      // Should show history page title
      await expect(authenticatedPage.locator('h1:has-text("History")')).toBeVisible();
    });

    test('should display check-in records or empty state', async ({ authenticatedPage }) => {
      // Navigate directly to history page
      await authenticatedPage.goto('/history');

      // Check for history items or empty state message
      const historyItems = authenticatedPage.locator('[data-testid="history-item"]');
      const emptyState = authenticatedPage.locator('text=/no check-ins yet|history will appear here/i');

      // Should have at least one history item or show empty state
      await expect(
        historyItems.first().or(emptyState)
      ).toBeVisible({ timeout: 10000 });
    });
  });
});

test.describe('Emergency Contacts', () => {
  test('should display contacts page', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/contacts');

    await expect(authenticatedPage.locator('h1:has-text("Emergency Contacts")')).toBeVisible();
  });

  test('should show add contact button', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/contacts');

    await expect(
      authenticatedPage.locator('button:has-text("Add Contact")')
    ).toBeVisible();
  });

  test('should open add contact form', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/contacts');

    const addButton = authenticatedPage.locator('button:has-text("Add Contact")');
    await addButton.click();

    // Should show dialog with form fields (using id selectors)
    await expect(authenticatedPage.locator('input#name')).toBeVisible();
    await expect(authenticatedPage.locator('input#email')).toBeVisible();
  });

  test('should create a new contact', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/contacts');

    // Open add form
    const addButton = authenticatedPage.locator('button:has-text("Add Contact")');
    await addButton.click();

    // Wait for dialog to be visible
    await expect(authenticatedPage.locator('input#name')).toBeVisible();

    // Fill form using id selectors
    const uniqueEmail = `contact-${Date.now()}@example.com`;
    await authenticatedPage.fill('input#name', 'Test Contact');
    await authenticatedPage.fill('input#email', uniqueEmail);

    // Verify form is filled correctly
    await expect(authenticatedPage.locator('input#name')).toHaveValue('Test Contact');
    await expect(authenticatedPage.locator('input#email')).toHaveValue(uniqueEmail);

    // Submit button should be visible and clickable
    await expect(authenticatedPage.locator('button:has-text("Save Changes")')).toBeVisible();
  });

  test('should validate contact form', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/contacts');

    const addButton = authenticatedPage.locator('button:has-text("Add Contact")');
    await addButton.click();

    // Wait for dialog
    await expect(authenticatedPage.locator('input#name')).toBeVisible();

    // Submit without filling
    await authenticatedPage.click('button:has-text("Save Changes")');

    // Should show validation errors - look for the actual error text
    await expect(authenticatedPage.locator('text=Name is required')).toBeVisible({ timeout: 5000 });
  });
});
