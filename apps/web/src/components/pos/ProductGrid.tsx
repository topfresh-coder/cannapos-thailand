/**
 * ProductGrid Component
 *
 * Displays a responsive grid of product cards.
 * Implements:
 * - Responsive grid layout (2 cols mobile, 3 tablet, 4 desktop)
 * - Loading skeleton state
 * - Empty state message
 * - Proper ARIA region labeling
 */

import type React from 'react';
import type { ProductGridProps } from './types';
import { ProductCard } from './ProductCard';

/**
 * Product grid component for displaying search results
 *
 * @example
 * ```tsx
 * <ProductGrid
 *   products={filteredProducts}
 *   onAddToCart={handleAddToCart}
 *   isLoading={isLoading}
 *   emptyMessage="No products found"
 * />
 * ```
 */
export function ProductGrid({
  products,
  onAddToCart,
  isLoading = false,
  emptyMessage = 'No products found',
}: ProductGridProps): React.ReactElement {
  // Loading skeleton
  if (isLoading) {
    return (
      <div
        role="region"
        aria-label="Product search results"
        aria-busy="true"
        className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
      >
        {/* Render 8 skeleton cards */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="animate-pulse rounded-lg border bg-white p-4 shadow-sm"
          >
            {/* Title skeleton */}
            <div className="mb-2 h-6 rounded bg-gray-200" />
            {/* SKU skeleton */}
            <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
            {/* Category badge skeleton */}
            <div className="mb-3 h-6 w-20 rounded-full bg-gray-200" />
            {/* Availability skeleton */}
            <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
            {/* Price skeleton */}
            <div className="mb-3 h-8 w-24 rounded bg-gray-200" />
            {/* Button skeleton */}
            <div className="h-10 rounded-md bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div
        role="region"
        aria-label="Product search results"
        className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
      >
        <div className="text-center">
          {/* Empty state icon */}
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">{emptyMessage}</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your search terms or browse all products
          </p>
        </div>
      </div>
    );
  }

  // Product grid with results
  return (
    <div
      role="region"
      aria-label="Product search results"
      className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
