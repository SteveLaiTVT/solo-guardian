import 'reflect-metadata';

jest.setTimeout(10000);

// Mock uuid module to avoid ESM issues - TASK-099
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-mock-value',
}));

beforeEach(() => {
  jest.clearAllMocks();
});
