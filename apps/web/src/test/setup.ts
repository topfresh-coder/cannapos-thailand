/**
 * Vitest Setup File
 * Runs before each test file
 */

import '@testing-library/jest-dom';

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
