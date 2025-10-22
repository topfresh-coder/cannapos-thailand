/**
 * ProductCard Component
 *
 * Displays individual product information in a card format.
 * Implements:
 * - Product name, SKU, category, available quantity, price display
 * - Touch-friendly design (minimum 44px tap target)
 * - Out-of-stock badge and disabled state
 * - Hover and focus styles for accessibility
 * - Click to add to cart functionality
 */

import type React from 'react';
import type { ProductCardProps } from './types';
import { formatCurrency } from '@/utils/currency';

/**
 * Product card component for displaying product information
 *
 * @example
 * ```tsx
 * <ProductCard
 *   product={product}
 *   onAddToCart={handleAddToCart}
 * />
 * ```
 */
export function ProductCard({ product, onAddToCart }: ProductCardProps): React.ReactElement {
  const isOutOfStock = product.availableQuantity === 0;

  /**
   * Handle add to cart button click
   */
  const handleClick = (): void => {
    if (!isOutOfStock) {
      onAddToCart(product);
    }
  };

  /**
   * Handle keyboard interaction (Enter key)
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' && !isOutOfStock) {
      handleClick();
    }
  };

  /**
   * Get category badge color based on product category
   */
  const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      Flower: 'bg-green-100 text-green-800',
      'Pre-Roll': 'bg-blue-100 text-blue-800',
      Edible: 'bg-purple-100 text-purple-800',
      Concentrate: 'bg-orange-100 text-orange-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return colorMap[category] || colorMap.Other;
  };

  return (
    <div
      role="button"
      tabIndex={isOutOfStock ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Add ${product.name} to cart`}
      aria-disabled={isOutOfStock}
      className={`
        relative flex min-h-[176px] flex-col rounded-lg border bg-white p-4 shadow-sm
        transition-all duration-200
        ${
          isOutOfStock
            ? 'cursor-not-allowed opacity-60'
            : 'cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }
      `}
    >
      {/* Out of stock badge */}
      {isOutOfStock && (
        <div className="absolute right-2 top-2">
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
            Out of Stock
          </span>
        </div>
      )}

      {/* Product name */}
      <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>

      {/* SKU */}
      <p className="mb-2 text-sm text-gray-500">SKU: {product.sku}</p>

      {/* Category badge */}
      <div className="mb-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(product.category)}`}
        >
          {product.category}
        </span>
      </div>

      {/* Price and availability - pushed to bottom */}
      <div className="mt-auto">
        {/* Available quantity */}
        <p
          className="mb-2 text-sm text-gray-600"
          aria-describedby={`availability-${product.id}`}
        >
          Available:{' '}
          <span className="font-semibold" id={`availability-${product.id}`}>
            {product.availableQuantity} {product.unit}
            {product.availableQuantity !== 1 ? 's' : ''}
          </span>
        </p>

        {/* Price */}
        <p className="text-xl font-bold text-gray-900">{formatCurrency(product.base_price)}</p>
      </div>

      {/* Add to cart button (visually integrated into card) */}
      <div className="mt-3">
        <button
          type="button"
          disabled={isOutOfStock}
          className={`
            w-full rounded-md px-4 py-2.5 text-sm font-semibold
            transition-colors duration-200
            ${
              isOutOfStock
                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }
          `}
          aria-label={isOutOfStock ? 'Product out of stock' : `Add ${product.name} to cart`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
