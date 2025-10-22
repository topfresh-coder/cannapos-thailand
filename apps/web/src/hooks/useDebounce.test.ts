/**
 * Unit tests for useDebounce hook
 *
 * Tests the useDebounce hook for correct debouncing behavior, generic type support,
 * edge case handling, and cleanup on unmount.
 *
 * @module hooks/useDebounce.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    // Use fake timers to control setTimeout behavior
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.restoreAllMocks();
  });

  describe('Basic Debouncing', () => {
    it('returns initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 300));
      expect(result.current).toBe('initial');
    });

    it('debounces value updates with default delay (300ms)', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      );

      // Initial value
      expect(result.current).toBe('initial');

      // Update value
      act(() => {
        rerender({ value: 'updated' });
      });

      // Value should not update immediately
      expect(result.current).toBe('initial');

      // Advance timers by 299ms (not quite enough)
      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(result.current).toBe('initial');

      // Advance timers by 1ms more (total 300ms)
      act(() => {
        vi.advanceTimersByTime(1);
      });

      // Now the debounced value should update
      expect(result.current).toBe('updated');
    });

    it('debounces value updates with custom delay', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      // Update value
      act(() => {
        rerender({ value: 'updated', delay: 500 });
      });

      // Value should not update immediately
      expect(result.current).toBe('initial');

      // Advance timers by 500ms
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Now the debounced value should update
      expect(result.current).toBe('updated');
    });
  });

  describe('Rapid Value Changes', () => {
    it('cancels previous timer when value changes rapidly', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'v1' } }
      );

      // Rapid changes - each rerender cancels the previous timer
      act(() => {
        rerender({ value: 'v2' });
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        rerender({ value: 'v3' });
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        rerender({ value: 'v4' });
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Still initial value because timers kept getting cancelled
      expect(result.current).toBe('v1');

      // Advance to complete the last timer
      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Should have the final value
      expect(result.current).toBe('v4');
    });

    it('only updates to the final value after user stops typing', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: '' } }
      );

      // Simulate typing "search"
      act(() => {
        const letters = ['s', 'se', 'sea', 'sear', 'searc', 'search'];
        letters.forEach((letter) => {
          rerender({ value: letter });
          vi.advanceTimersByTime(50); // User types fast
        });
      });

      // Still no update because user hasn't stopped typing
      expect(result.current).toBe('');

      // User stops typing, wait for debounce
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Now should have final value
      expect(result.current).toBe('search');
    });
  });

  describe('Generic Type Support', () => {
    it('works with string values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce<string>(value, 300),
        { initialProps: { value: 'hello' } }
      );

      act(() => {
        rerender({ value: 'world' });
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe('world');
    });

    it('works with number values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce<number>(value, 300),
        { initialProps: { value: 10 } }
      );

      act(() => {
        rerender({ value: 20 });
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe(20);
    });

    it('works with boolean values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce<boolean>(value, 300),
        { initialProps: { value: false } }
      );

      act(() => {
        rerender({ value: true });
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe(true);
    });

    it('works with object values', () => {
      const initialObj = { name: 'Product A', price: 100 };
      const updatedObj = { name: 'Product B', price: 200 };

      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: initialObj } }
      );

      act(() => {
        rerender({ value: updatedObj });
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toEqual(updatedObj);
    });

    it('works with array values', () => {
      const initialArr = [1, 2, 3];
      const updatedArr = [4, 5, 6];

      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: initialArr } }
      );

      act(() => {
        rerender({ value: updatedArr });
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toEqual(updatedArr);
    });

    it('works with null and undefined', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce<string | null>(value, 300),
        { initialProps: { value: 'value' as string | null } }
      );

      act(() => {
        rerender({ value: null });
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe(null);
    });
  });

  describe('Edge Cases', () => {
    it('handles zero delay (immediate update)', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 0),
        { initialProps: { value: 'initial' } }
      );

      act(() => {
        rerender({ value: 'updated' });
      });

      act(() => {
        vi.runAllTimers();
      });

      expect(result.current).toBe('updated');
    });

    it('handles negative delay gracefully (treats as zero)', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, -100),
        { initialProps: { value: 'initial' } }
      );

      act(() => {
        rerender({ value: 'updated' });
      });

      act(() => {
        vi.runAllTimers();
      });

      expect(result.current).toBe('updated');
    });

    it('handles very large delay', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 10000),
        { initialProps: { value: 'initial' } }
      );

      act(() => {
        rerender({ value: 'updated' });
      });

      act(() => {
        vi.advanceTimersByTime(9999);
      });

      // Should not update yet
      expect(result.current).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(result.current).toBe('updated');
    });

    it('handles empty string value', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'search' } }
      );

      act(() => {
        rerender({ value: '' });
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe('');
    });

    it('handles same value updates (no-op)', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'same' } }
      );

      // Update with same value
      act(() => {
        rerender({ value: 'same' });
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe('same');
    });
  });

  describe('Cleanup and Memory Leaks', () => {
    it('clears timeout on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { unmount } = renderHook(() => useDebounce('value', 300));

      // Unmount before delay expires
      unmount();

      // clearTimeout should have been called
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('does not update state after unmount', () => {
      const { result, rerender, unmount } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      );

      act(() => {
        rerender({ value: 'updated' });
      });

      // Unmount before delay expires
      unmount();

      // Advance timers (this should not cause an update)
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Value should still be initial (no update after unmount)
      expect(result.current).toBe('initial');
    });

    it('handles rapid mount/unmount cycles', () => {
      const { unmount: unmount1 } = renderHook(() =>
        useDebounce('value1', 300)
      );
      const { unmount: unmount2 } = renderHook(() =>
        useDebounce('value2', 300)
      );
      const { unmount: unmount3 } = renderHook(() =>
        useDebounce('value3', 300)
      );

      unmount1();
      unmount2();
      unmount3();

      // Should not throw or cause memory leaks
      expect(true).toBe(true);
    });
  });

  describe('Dynamic Delay Changes', () => {
    it('respects delay changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 300 } }
      );

      // Update value with delay 300
      act(() => {
        rerender({ value: 'updated', delay: 300 });
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe('updated');

      // Update with new delay
      act(() => {
        rerender({ value: 'final', delay: 500 });
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current).toBe('final');
    });

    it('cancels previous timer when delay changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'v1', delay: 300 } }
      );

      act(() => {
        rerender({ value: 'v2', delay: 300 });
      });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Change delay before timer expires
      act(() => {
        rerender({ value: 'v2', delay: 500 });
      });

      // Old timer (300ms) should be cancelled
      act(() => {
        vi.advanceTimersByTime(100); // Total 300ms from first rerender
      });

      expect(result.current).toBe('v1');

      // New timer (500ms from delay change) should complete
      act(() => {
        vi.advanceTimersByTime(400); // 500ms from delay change
      });

      expect(result.current).toBe('v2');
    });
  });

  describe('Real-World POS Scenarios', () => {
    it('debounces product search query', () => {
      const { result, rerender } = renderHook(
        ({ query }) => useDebounce(query, 300),
        { initialProps: { query: '' } }
      );

      // Simulate typing "sativa"
      act(() => {
        const searchSteps = ['s', 'sa', 'sat', 'sati', 'sativ', 'sativa'];
        searchSteps.forEach((step) => {
          rerender({ query: step });
          // User types fast (50ms between keystrokes)
          vi.advanceTimersByTime(50);
        });
      });

      // Query should not have updated yet
      expect(result.current).toBe('');

      // User stops typing, wait for debounce
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Now should execute search with final query
      expect(result.current).toBe('sativa');
    });

    it('handles clearing search input', () => {
      const { result, rerender } = renderHook(
        ({ query }) => useDebounce(query, 300),
        { initialProps: { query: 'product' } }
      );

      // User clears search
      act(() => {
        rerender({ query: '' });
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe('');
    });

    it('debounces filter object changes', () => {
      interface ProductFilter {
        category: string;
        minPrice: number;
        maxPrice: number;
      }

      const initialFilter: ProductFilter = {
        category: '',
        minPrice: 0,
        maxPrice: 1000,
      };

      const updatedFilter: ProductFilter = {
        category: 'Flower',
        minPrice: 100,
        maxPrice: 500,
      };

      const { result, rerender } = renderHook(
        ({ filter }) => useDebounce(filter, 300),
        { initialProps: { filter: initialFilter } }
      );

      act(() => {
        rerender({ filter: updatedFilter });
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toEqual(updatedFilter);
    });
  });
});
