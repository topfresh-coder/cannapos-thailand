/**
 * Debounce Utility
 *
 * Creates a debounced function that delays invoking func until after wait
 * milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay (default: 300ms)
 * @returns Debounced function
 *
 * @example
 * ```ts
 * const debouncedSave = debounce((value: string) => {
 *   console.log('Saving:', value);
 * }, 500);
 *
 * debouncedSave('hello'); // Will only execute after 500ms of no calls
 * ```
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debouncedFunction(...args: Parameters<T>): void {
    // Clear the existing timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
}
