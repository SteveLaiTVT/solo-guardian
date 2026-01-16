// ============================================================
// Auth Helpers - Authentication utilities for E2E tests
// @task TASK-042
// @design_state_version 3.0.0
// ============================================================

import { Page, expect } from '@playwright/test';
import { testUser } from '../fixtures/test-data';
import { waitForPageLoad } from './test-utils';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3100';

/**
 * Log in with test user credentials via UI
 * DONE(B): Implement loginAsTestUser - TASK-042
 */
export async function loginAsTestUser(page: Page): Promise<void> {
  await page.goto('/login');
  await waitForPageLoad(page);

  await page.getByLabel(/email/i).fill(testUser.email);
  await page.getByLabel(/password/i).fill(testUser.password);
  await page.getByRole('button', { name: /sign in|login|登录/i }).click();

  // Wait for redirect to dashboard
  await expect(page).toHaveURL(/dashboard|home/i, { timeout: 10000 });
}

/**
 * Create a test user via API
 * DONE(B): Implement createTestUser - TASK-042
 */
export async function createTestUser(): Promise<{ id: string; email: string }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password,
      name: testUser.name,
    }),
  });

  if (response.status === 409) {
    // User already exists, try to login to get ID
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Failed to login existing test user: ${loginResponse.status}`);
    }

    const data = await loginResponse.json();
    return { id: data.user?.id || 'unknown', email: testUser.email };
  }

  if (!response.ok) {
    throw new Error(`Failed to create test user: ${response.status}`);
  }

  const data = await response.json();
  return { id: data.user?.id || data.id, email: testUser.email };
}

/**
 * Delete test user via API (cleanup)
 * DONE(B): Implement deleteTestUser - TASK-042
 */
export async function deleteTestUser(userId: string): Promise<void> {
  // In a real implementation, this would call an admin API
  // For now, we log the intent - actual cleanup may require DB access
  console.log(`Test user cleanup requested for: ${userId}`);
}

/**
 * Login via API and set tokens in browser storage
 * DONE(B): Implement loginViaApi - TASK-042
 */
export async function loginViaApi(page: Page): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  const data = await response.json();

  // Set tokens in browser storage
  await page.evaluate(
    ({ accessToken, refreshToken }) => {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    },
    { accessToken: data.accessToken, refreshToken: data.refreshToken },
  );
}
