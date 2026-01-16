/**
 * @file global-setup.ts
 * @description Global setup for E2E tests - runs once before all tests
 * @task TASK-042
 * @design_state_version 3.6.0
 */
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig): Promise<void> {
  const { baseURL } = config.projects[0].use;

  console.log('🚀 Global setup starting...');
  console.log(`📍 Base URL: ${baseURL}`);

  // Wait for backend to be ready
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Health check - wait for backend
    const backendUrl = process.env.E2E_BACKEND_URL || 'http://localhost:3000';
    console.log(`⏳ Waiting for backend at ${backendUrl}...`);

    let retries = 30;
    while (retries > 0) {
      try {
        const response = await page.request.get(`${backendUrl}/api/health`);
        if (response.ok()) {
          console.log('✅ Backend is ready');
          break;
        }
      } catch {
        // Backend not ready yet
      }
      retries--;
      await page.waitForTimeout(1000);
    }

    if (retries === 0) {
      throw new Error('Backend did not become ready in time');
    }

    // Health check - wait for frontend
    console.log(`⏳ Waiting for frontend at ${baseURL}...`);

    retries = 30;
    while (retries > 0) {
      try {
        const response = await page.request.get(baseURL as string);
        if (response.ok()) {
          console.log('✅ Frontend is ready');
          break;
        }
      } catch {
        // Frontend not ready yet
      }
      retries--;
      await page.waitForTimeout(1000);
    }

    if (retries === 0) {
      throw new Error('Frontend did not become ready in time');
    }

    console.log('✅ Global setup complete');
  } finally {
    await browser.close();
  }
}

export default globalSetup;
