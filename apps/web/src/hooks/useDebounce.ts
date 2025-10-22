/**
 * React hook for debouncing values
 *
 * Provides a debounced version of a value that only updates after a specified
 * delay has passed without the value changing. Commonly used for search inputs
 * to reduce API calls and improve performance.
 *
 * @module hooks/useDebounce
 */

import { useEffect, useState } from 'react';

/**
 * Debounces a value with a configurable delay
 *
 * Returns a debounced version of the provided value that only updates after
 * the specified delay has passed without the value changing. This is useful
 * for performance optimization, especially for search inputs where you want
 * to wait for the user to stop typing before executing a query.
 *
 * @template T - The type of the value to debounce (automatically inferred)
 * @param value - The value to debounce (can be any type: string, number, object, etc.)
 * @param delay - The delay in milliseconds to wait before updating (default: 300ms)
 * @returns The debounced value (same type as input)
 *
 * @example
 * ```typescript
 * // Debounce search query for product search
 * function ProductSearch() {
 *   const [searchQuery, setSearchQuery] = useState('');
 *   const debouncedQuery = useDebounce(searchQuery, 300);
 *
 *   useEffect(() => {
 *     // This only runs 300ms after user stops typing
 *     if (debouncedQuery) {
 *       fetchProducts(debouncedQuery);
 *     }
 *   }, [debouncedQuery]);
 *
 *   return (
 *     <input
 *       value={searchQuery}
 *       onChange={(e) => setSearchQuery(e.target.value)}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Debounce with custom delay (500ms)
 * const debouncedValue = useDebounce(searchTerm, 500);
 * ```
 *
 * @example
 * ```typescript
 * // Debounce complex objects
 * const [filter, setFilter] = useState({ category: '', minPrice: 0 });
 * const debouncedFilter = useDebounce(filter, 300);
 * ```
 *
 * **How It Works:**
 * 1. When `value` changes, a timer is started
 * 2. If `value` changes again before the timer expires, the timer is reset
 * 3. When the timer expires without interruption, `debouncedValue` is updated
 * 4. The timer is automatically cleaned up when the component unmounts
 *
 * **Performance Benefits:**
 * - Reduces API calls: Waits for user to finish typing before querying
 * - Improves UI responsiveness: Prevents excessive re-renders
 * - Reduces server load: Fewer unnecessary requests
 *
 * **Edge Cases Handled:**
 * - Component unmount: Timer is cleared to prevent memory leaks
 * - Rapid value changes: Previous timers are cancelled before starting new ones
 * - Initial render: Returns initial value immediately
 * - Zero delay: Returns value immediately on every change
 * - Negative delay: Treated as zero (no delay)
 *
 * **Design Decisions:**
 * - Generic type parameter for maximum flexibility
 * - Default delay of 300ms (common UX best practice)
 * - Proper cleanup to prevent memory leaks
 * - No dependencies on external libraries
 *
 * Complexity: O(1) - Constant time and space
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Handle negative delays gracefully (treat as zero)
    const safeDelay = Math.max(0, delay);

    // Set up a timer to update the debounced value after the delay
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, safeDelay);

    // Cleanup function: Cancel the timer if value changes or component unmounts
    // This prevents memory leaks and ensures only the latest value is used
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]); // Re-run effect when value or delay changes

  return debouncedValue;
}
