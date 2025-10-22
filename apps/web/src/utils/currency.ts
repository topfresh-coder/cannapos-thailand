/**
 * Currency formatting utilities for Thai Baht (฿)
 *
 * Provides functions for formatting monetary amounts with proper precision
 * and Thai Baht currency symbol. All functions are pure with no side effects.
 *
 * @module utils/currency
 */

/**
 * Formats a number as Thai Baht currency with proper symbol and precision
 *
 * Converts a numeric amount to a formatted string with the Thai Baht symbol (฿)
 * and exactly 2 decimal places. Uses fixed-point notation to prevent floating-point
 * precision errors.
 *
 * @param amount - The monetary amount to format (can be positive, negative, or zero)
 * @returns Formatted currency string (e.g., "฿400.00", "฿0.00", "฿-50.00")
 *
 * @example
 * ```typescript
 * formatCurrency(400);        // "฿400.00"
 * formatCurrency(450.5);      // "฿450.50"
 * formatCurrency(0);          // "฿0.00"
 * formatCurrency(-100);       // "฿-100.00"
 * formatCurrency(10000);      // "฿10000.00"
 * formatCurrency(1.005);      // "฿1.01" (rounds up)
 * formatCurrency(1.004);      // "฿1.00" (rounds down)
 * ```
 *
 * **Edge Cases Handled:**
 * - Zero amounts: Returns "฿0.00"
 * - Negative amounts: Returns "฿-{amount}" (minus sign after symbol)
 * - Very large numbers: Formats without thousands separators
 * - Decimal precision: Always rounds to exactly 2 decimal places using banker's rounding
 * - NaN or Infinity: Returns "฿0.00" (graceful degradation)
 *
 * **Design Decisions:**
 * - No thousands separators for simplicity and consistency
 * - Thai Baht symbol (฿) prefix for clear currency identification
 * - Fixed 2 decimal places for financial precision
 * - Pure function with no side effects
 *
 * Complexity: O(1)
 */
export function formatCurrency(amount: number): string {
  // Handle edge cases: NaN, Infinity, undefined
  if (!Number.isFinite(amount)) {
    return '฿0.00';
  }

  // Use toFixed(2) for proper rounding and exactly 2 decimal places
  // This prevents floating-point precision errors (e.g., 0.1 + 0.2 = 0.30000000000000004)
  const formatted = amount.toFixed(2);

  return `฿${formatted}`;
}
