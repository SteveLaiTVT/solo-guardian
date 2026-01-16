// ============================================================
// Test Utilities - Playwright helpers
// @task TASK-042
// @design_state_version 3.0.0
// ============================================================

import { Page } from '@playwright/test';

/**
 * Wait for page to fully load (network idle)
 * DONE(B): Implement waitForPageLoad - TASK-042
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

/**
 * Clear local storage to reset auth state
 * DONE(B): Implement clearLocalStorage - TASK-042
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Get current auth tokens from storage
 * DONE(B): Implement getAuthTokens - TASK-042
 */
export async function getAuthTokens(
  page: Page,
): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  return page.evaluate(() => {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  });
}

/**
 * Check if user is authenticated
 * DONE(B): Implement isAuthenticated - TASK-042
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const tokens = await getAuthTokens(page);
  return !!tokens.accessToken;
}
