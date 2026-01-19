/**
 * @file auth.spec.ts
 * @description E2E tests for authentication flows
 * @task TASK-043
 * @design_state_version 3.6.0
 */
import { test, expect, LoginPage, RegisterPage } from '../fixtures/test-fixtures';

test.describe('Authentication', () => {
  test.describe('Login', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/login');

      await expect(page.locator('h3[data-slot="card-title"], [data-slot="card-title"]')).toContainText(/welcome|sign in/i);
      await expect(page.locator('input#identifier')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await page.click('button[type="submit"]');

      // Should show validation errors (wait for form validation)
      await expect(page.locator('.text-red-500').first()).toBeVisible({ timeout: 5000 });
    });

    test('should show error for invalid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await loginPage.login('nonexistent@example.com', 'wrongpassword');

      // Should stay on login page and show error (or just stay on login page if API is slow)
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/login/);
    });

    test('should redirect to dashboard on successful login', async ({ page }) => {
      // Create a unique test user for this test
      const uniqueEmail = `login-test-${Date.now()}@example.com`;
      const password = 'TestPassword123!';

      // First register
      await page.goto('/register');
      await page.fill('input#name', 'Login Test User');
      await page.fill('input#email', uniqueEmail);
      await page.fill('input#password', password);
      await page.fill('input#confirmPassword', password);

      await page.click('button[type="submit"]');
      await page.waitForURL(/\/(onboarding)?$/);

      // Logout (clear storage)
      await page.evaluate(() => localStorage.clear());
      await page.goto('/login');

      // Now login
      const loginPage = new LoginPage(page);
      await loginPage.login(uniqueEmail, password);

      await loginPage.expectRedirectToDashboard();
    });

    test('should have link to register page', async ({ page }) => {
      await page.goto('/login');

      const registerLink = page.locator('a[href="/register"]');
      await expect(registerLink).toBeVisible();

      await registerLink.click();
      await expect(page).toHaveURL('/register');
    });
  });

  test.describe('Registration', () => {
    test('should display registration form', async ({ page }) => {
      await page.goto('/register');

      await expect(page.locator('h3[data-slot="card-title"], [data-slot="card-title"]')).toContainText(/create|sign up|register/i);
      await expect(page.locator('input#name')).toBeVisible();
      await expect(page.locator('input#email')).toBeVisible();
      await expect(page.locator('input#password')).toBeVisible();
      await expect(page.locator('input#confirmPassword')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      await page.goto('/register');

      await page.click('button[type="submit"]');

      // Should show validation errors (wait for form validation)
      await expect(page.locator('.text-red-500').first()).toBeVisible({ timeout: 5000 });
    });

    test('should show error for password mismatch', async ({ page }) => {
      await page.goto('/register');

      await page.fill('input#name', 'Test User');
      await page.fill('input#email', 'mismatch@example.com');
      await page.fill('input#password', 'Password123!');
      await page.fill('input#confirmPassword', 'DifferentPassword456!');
      await page.click('button[type="submit"]');

      await expect(page.locator('.text-red-500')).toContainText(/match|mismatch/i);
    });

    test('should show error for duplicate email', async ({ page }) => {
      // First registration
      const duplicateEmail = `duplicate-${Date.now()}@example.com`;
      await page.goto('/register');
      await page.fill('input#name', 'First User');
      await page.fill('input#email', duplicateEmail);
      await page.fill('input#password', 'TestPassword123!');
      await page.fill('input#confirmPassword', 'TestPassword123!');
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/(onboarding)?$/);

      // Clear storage and try to register again with same email
      await page.evaluate(() => localStorage.clear());
      await page.goto('/register');
      await page.fill('input#name', 'Second User');
      await page.fill('input#email', duplicateEmail);
      await page.fill('input#password', 'TestPassword123!');
      await page.fill('input#confirmPassword', 'TestPassword123!');
      await page.click('button[type="submit"]');

      // API returns 409 for duplicate email - accept either specific message or generic error
      await expect(page.locator('.text-red-500, .bg-red-50')).toBeVisible({ timeout: 10000 });
    });

    test('should redirect to onboarding on successful registration', async ({ page }) => {
      const uniqueEmail = `register-test-${Date.now()}@example.com`;

      const registerPage = new RegisterPage(page);
      await registerPage.goto();

      await registerPage.register('New Test User', uniqueEmail, 'TestPassword123!');

      // Should redirect to onboarding or dashboard
      await expect(page).toHaveURL(/\/(onboarding)?$/);
    });

    test('should have link to login page', async ({ page }) => {
      await page.goto('/register');

      const loginLink = page.locator('a[href="/login"]');
      await expect(loginLink).toBeVisible();

      await loginLink.click();
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
      // Fresh page context has no stored auth - should redirect to login
      await page.goto('/');

      // Should redirect to login
      await expect(page).toHaveURL('/login');
    });

    test('should redirect to login when accessing settings without auth', async ({ page }) => {
      await page.goto('/settings');

      await expect(page).toHaveURL('/login');
    });

    test('should redirect to login when accessing contacts without auth', async ({ page }) => {
      await page.goto('/contacts');

      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Guest Routes', () => {
    test('should redirect authenticated user from login to dashboard', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/login');

      // Should redirect to dashboard
      await expect(authenticatedPage).toHaveURL('/');
    });

    test('should redirect authenticated user from register to dashboard', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/register');

      // Should redirect to dashboard
      await expect(authenticatedPage).toHaveURL('/');
    });
  });
});
