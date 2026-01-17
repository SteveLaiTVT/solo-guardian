/**
 * @file elder-mode.spec.ts
 * @description E2E tests for elder mode visual settings
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { test, expect } from '../fixtures/test-fixtures';

test.describe('Elder Mode', () => {
  test('should display elder mode section in settings', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/settings');

    // Should show the Quick Mode Presets section
    await expect(authenticatedPage.locator('text=Quick Mode Presets')).toBeVisible();
    await expect(authenticatedPage.locator('text=Elder-Friendly Mode')).toBeVisible();
    await expect(authenticatedPage.locator('text=Standard Mode')).toBeVisible();
  });

  test('should apply elder mode settings', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/settings');

    // Click on Elder-Friendly Mode button
    const elderModeButton = authenticatedPage.locator('button:has-text("Elder-Friendly Mode")');
    await elderModeButton.click();

    // Wait for the preference update
    await authenticatedPage.waitForTimeout(1000);

    // Verify visual changes (font size should be larger)
    const rootElement = authenticatedPage.locator('html');
    const fontSize = await rootElement.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });

    // Should have larger font size (22px or similar)
    expect(parseInt(fontSize)).toBeGreaterThanOrEqual(20);
  });

  test('should apply standard mode settings', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/settings');

    // First apply elder mode, then switch back
    const elderModeButton = authenticatedPage.locator('button:has-text("Elder-Friendly Mode")');
    await elderModeButton.click();
    await authenticatedPage.waitForTimeout(500);

    const standardModeButton = authenticatedPage.locator('button:has-text("Standard Mode")');
    await standardModeButton.click();
    await authenticatedPage.waitForTimeout(1000);

    // Verify font size is back to normal
    const rootElement = authenticatedPage.locator('html');
    const fontSize = await rootElement.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });

    // Should have standard font size (16px)
    expect(parseInt(fontSize)).toBeLessThanOrEqual(18);
  });

  test('should show visual settings section', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/settings');

    // Visual section should be visible - use more specific selectors to avoid strict mode violations
    await expect(authenticatedPage.locator('h3:has-text("Font Size")')).toBeVisible();
    await expect(authenticatedPage.locator('h3:has-text("High Contrast")')).toBeVisible();
    await expect(authenticatedPage.locator('h3:has-text("Reduce Motion")')).toBeVisible();
  });
});
