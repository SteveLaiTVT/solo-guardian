// ============================================================
// Test Data - E2E test fixtures
// @task TASK-042
// @design_state_version 3.0.0
// ============================================================

/**
 * Test user credentials
 * DONE(B): Define testUser - TASK-042
 */
export const testUser = {
  email: 'e2e-test@example.com',
  password: 'TestPassword123!',
  name: 'E2E Test User',
};

/**
 * Invalid credentials for negative testing
 * DONE(B): Define invalidCredentials - TASK-042
 */
export const invalidCredentials = {
  email: 'wrong@example.com',
  password: 'wrongpassword',
};

/**
 * Test emergency contact data
 * DONE(B): Define testContact - TASK-042
 */
export const testContact = {
  name: 'Test Contact',
  email: 'testcontact@example.com',
  phone: '+14155551234',
  priority: 1,
};
