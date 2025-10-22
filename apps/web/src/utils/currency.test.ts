/**
 * Unit tests for currency formatting utilities
 *
 * Tests the formatCurrency function for correct Thai Baht formatting,
 * edge case handling, and financial precision.
 *
 * @module utils/currency.test
 */

import { describe, it, expect } from 'vitest';
import { formatCurrency } from './currency';

describe('Currency Formatting', () => {
  describe('Basic Formatting', () => {
    it('formats whole numbers with 2 decimal places', () => {
      expect(formatCurrency(400)).toBe('฿400.00');
      expect(formatCurrency(100)).toBe('฿100.00');
      expect(formatCurrency(1)).toBe('฿1.00');
    });

    it('formats decimal numbers with 2 decimal places', () => {
      expect(formatCurrency(450.5)).toBe('฿450.50');
      expect(formatCurrency(99.99)).toBe('฿99.99');
      expect(formatCurrency(1.23)).toBe('฿1.23');
    });

    it('includes Thai Baht symbol (฿) prefix', () => {
      expect(formatCurrency(100)).toMatch(/^฿/);
      expect(formatCurrency(0)).toMatch(/^฿/);
      expect(formatCurrency(1000)).toMatch(/^฿/);
    });
  });

  describe('Zero and Negative Amounts', () => {
    it('handles zero correctly', () => {
      expect(formatCurrency(0)).toBe('฿0.00');
      expect(formatCurrency(-0)).toBe('฿0.00'); // -0 should be treated as 0
    });

    it('handles negative amounts correctly', () => {
      expect(formatCurrency(-100)).toBe('฿-100.00');
      expect(formatCurrency(-50.5)).toBe('฿-50.50');
      expect(formatCurrency(-1)).toBe('฿-1.00');
    });
  });

  describe('Large Numbers', () => {
    it('handles large amounts without thousands separators', () => {
      expect(formatCurrency(10000)).toBe('฿10000.00');
      expect(formatCurrency(999999.99)).toBe('฿999999.99');
      expect(formatCurrency(1000000)).toBe('฿1000000.00');
    });

    it('handles very large numbers correctly', () => {
      expect(formatCurrency(9999999999)).toBe('฿9999999999.00');
      expect(formatCurrency(123456789.12)).toBe('฿123456789.12');
    });
  });

  describe('Decimal Precision and Rounding', () => {
    it('rounds to 2 decimal places correctly', () => {
      // Round down
      expect(formatCurrency(1.004)).toBe('฿1.00');
      expect(formatCurrency(99.994)).toBe('฿99.99');

      // Round up (note: toFixed uses banker's rounding)
      // 1.006 rounds to 1.01 (clear round up)
      expect(formatCurrency(1.006)).toBe('฿1.01');
      // 1.016 rounds to 1.02 (clear round up)
      expect(formatCurrency(1.016)).toBe('฿1.02');
      // 99.996 rounds to 100.00
      expect(formatCurrency(99.996)).toBe('฿100.00');
    });

    it('handles many decimal places with proper rounding', () => {
      expect(formatCurrency(1.123456789)).toBe('฿1.12');
      expect(formatCurrency(99.999999)).toBe('฿100.00');
      expect(formatCurrency(50.555555)).toBe('฿50.56');
    });

    it('prevents floating-point precision errors', () => {
      // JavaScript: 0.1 + 0.2 = 0.30000000000000004
      expect(formatCurrency(0.1 + 0.2)).toBe('฿0.30');

      // JavaScript: 0.3 - 0.1 = 0.19999999999999998
      expect(formatCurrency(0.3 - 0.1)).toBe('฿0.20');
    });
  });

  describe('Edge Cases', () => {
    it('handles very small positive numbers', () => {
      expect(formatCurrency(0.01)).toBe('฿0.01');
      expect(formatCurrency(0.001)).toBe('฿0.00'); // Rounds down
      expect(formatCurrency(0.006)).toBe('฿0.01'); // Rounds up
    });

    it('handles very small negative numbers', () => {
      expect(formatCurrency(-0.01)).toBe('฿-0.01');
      expect(formatCurrency(-0.001)).toBe('฿-0.00');
      expect(formatCurrency(-0.006)).toBe('฿-0.01');
    });

    it('handles NaN gracefully', () => {
      expect(formatCurrency(NaN)).toBe('฿0.00');
      expect(formatCurrency(Number.NaN)).toBe('฿0.00');
    });

    it('handles Infinity gracefully', () => {
      expect(formatCurrency(Infinity)).toBe('฿0.00');
      expect(formatCurrency(-Infinity)).toBe('฿0.00');
    });

    it('handles numbers close to MAX_SAFE_INTEGER', () => {
      const maxSafe = Number.MAX_SAFE_INTEGER; // 9007199254740991
      expect(formatCurrency(maxSafe)).toBe('฿9007199254740991.00');
    });

    it('handles numbers close to MIN_SAFE_INTEGER', () => {
      const minSafe = Number.MIN_SAFE_INTEGER; // -9007199254740991
      expect(formatCurrency(minSafe)).toBe('฿-9007199254740991.00');
    });
  });

  describe('Real-World POS Scenarios', () => {
    it('formats typical product prices', () => {
      expect(formatCurrency(400)).toBe('฿400.00'); // Flower base price
      expect(formatCurrency(150)).toBe('฿150.00'); // Pre-roll price
      expect(formatCurrency(250)).toBe('฿250.00'); // Edible price
    });

    it('formats cart subtotals', () => {
      // 2 products at ฿400 each
      expect(formatCurrency(2 * 400)).toBe('฿800.00');

      // Mixed cart: ฿400 + ฿150 + ฿250
      expect(formatCurrency(400 + 150 + 250)).toBe('฿800.00');
    });

    it('formats line totals with fractional quantities', () => {
      // 0.5 gram at ฿400 per gram
      expect(formatCurrency(0.5 * 400)).toBe('฿200.00');

      // 0.125 gram (eighth) at ฿400 per gram
      expect(formatCurrency(0.125 * 400)).toBe('฿50.00');
    });

    it('formats discounted prices', () => {
      // 10% discount on ฿400
      expect(formatCurrency(400 * 0.9)).toBe('฿360.00');

      // 15% discount on ฿250
      expect(formatCurrency(250 * 0.85)).toBe('฿212.50');
    });
  });

  describe('Type Safety', () => {
    it('returns a string type', () => {
      const result = formatCurrency(100);
      expect(typeof result).toBe('string');
    });

    it('always returns a string starting with ฿', () => {
      const testCases = [0, 100, -50, 999.99, 0.01, 10000];
      testCases.forEach((amount) => {
        const result = formatCurrency(amount);
        expect(result).toMatch(/^฿-?\d+\.\d{2}$/);
      });
    });
  });
});
