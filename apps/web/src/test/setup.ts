/**
 * Vitest Setup File
 * Runs before each test file
 */

import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
