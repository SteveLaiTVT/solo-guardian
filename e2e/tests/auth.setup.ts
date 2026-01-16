/**
 * @file auth.setup.ts
 * @description Authentication setup - creates authenticated state for other tests
 * @task TASK-042, TASK-043
 * @design_state_version 3.6.0
 */
import { test as setup, expect } from '@playwright/test';
import { TEST_USER, STORAGE_STATE_PATH } from '../fixtures/test-fixtures';

/**
 * Setup: Authenticate test user and save state
 * This runs before other test files and saves the authenticated session
 */
setup('authenticate', async ({ page }) => {
  // First, try to register the test user (will fail if already exists)
  await page.goto('/register');

  // Check if we need to register or just login
  try {
    await page.fill('input[name="name"]', TEST_USER.name);
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.fill('input[name="confirmPassword"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Wait for either redirect to dashboard/onboarding or error
    await Promise.race([
      page.waitForURL(/\/(onboarding)?$/),
      page.waitForSelector('.text-red-500', { timeout: 5000 }),
    ]);
  } catch {
    // Registration might have failed, try to login instead
  }

  // If we see an error (user exists), login instead
  if (await page.locator('.text-red-500').isVisible().catch(() => false)) {
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  }

  // Verify we're authenticated
  await expect(page).not.toHaveURL('/login');
  await expect(page).not.toHaveURL('/register');

  // Save authentication state
  await page.context().storageState({ path: STORAGE_STATE_PATH });
});
