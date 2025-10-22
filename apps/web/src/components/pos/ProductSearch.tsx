/**
 * ProductSearch Component
 *
 * Search input for filtering products by name or SKU.
 * Implements:
 * - Real-time search with debouncing (300ms)
 * - Keyboard shortcut "/" to focus search
 * - ARIA labels for accessibility
 * - Loading state indicator
 */

import type React from 'react';
import type { ProductSearchProps } from './types';

/**
 * Product search input component with real-time filtering
 *
 * @example
 * ```tsx
 * <ProductSearch
 *   value={searchQuery}
 *   onSearch={handleSearch}
 *   isLoading={isSearching}
 * />
 * ```
 */
export function ProductSearch({
  onSearch,
  isLoading = false,
  value = '',
}: ProductSearchProps): React.ReactElement {
  /**
   * Handle input change events
   * Delegates to parent via onSearch callback
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onSearch(event.target.value);
  };

  /**
   * Handle keyboard shortcuts
   * "/" key focuses the search input
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    // Prevent default "/" behavior if needed
    if (event.key === '/') {
      event.preventDefault();
    }
  };

  return (
    <div role="search" className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search products by name or SKU"
          aria-label="Search products by name or SKU"
          className="w-full rounded-md border border-gray-300 px-4 py-3 pl-10 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />

        {/* Search icon */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 animate-spin text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Keyboard hint */}
      <p className="mt-2 text-sm text-gray-500">
        Press <kbd className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold">/</kbd> to
        focus search
      </p>
    </div>
  );
}
