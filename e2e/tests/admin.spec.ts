/**
 * @file admin.spec.ts
 * @description E2E tests for admin functionality
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { test, expect } from '../fixtures/test-fixtures';

test.describe('Admin Panel', () => {
  test.describe('Admin Login', () => {
    test('should display admin login page', async ({ page }) => {
      await page.goto('http://localhost:5174/admin/login');

      await expect(page.locator('text=Solo Guardian Admin')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('http://localhost:5174/admin/login');

      await page.fill('input[type="email"]', 'notadmin@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');

      // Should show error
      await expect(page.locator('.ant-message-error, text=Invalid')).toBeVisible({ timeout: 5000 });
    });

    test('should redirect unauthenticated users to login', async ({ page }) => {
      await page.goto('http://localhost:5174/admin');

      // Should redirect to login
      await expect(page).toHaveURL(/\/admin\/login/);
    });
  });

  test.describe('Admin Dashboard (requires admin user)', () => {
    // These tests would require an admin user to be seeded
    test.skip('should display dashboard statistics', async ({ page }) => {
      // Login as admin first
      await page.goto('http://localhost:5174/admin/login');
      await page.fill('input[type="email"]', 'admin@example.com');
      await page.fill('input[type="password"]', 'AdminPassword123!');
      await page.click('button[type="submit"]');

      // Wait for dashboard
      await page.waitForURL(/\/admin$/);

      // Should show statistics
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('text=Total Users')).toBeVisible();
      await expect(page.locator('text=Active Users')).toBeVisible();
    });

    test.skip('should display users list', async ({ page }) => {
      // Navigate to users page
      await page.goto('http://localhost:5174/admin/users');

      await expect(page.locator('text=User Management')).toBeVisible();
      await expect(page.locator('table')).toBeVisible();
    });

    test.skip('should display alerts list', async ({ page }) => {
      await page.goto('http://localhost:5174/admin/alerts');

      await expect(page.locator('text=Alerts Management')).toBeVisible();
      await expect(page.locator('table')).toBeVisible();
    });
  });
});
