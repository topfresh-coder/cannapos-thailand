/**
 * CartItem Component
 *
 * Displays a single item in the shopping cart with quantity controls.
 * Implements:
 * - Product name, quantity, unit price, line total display
 * - Increment/decrement buttons with inventory validation
 * - Manual quantity input field (decimal for flower, integer for others)
 * - Remove item button with confirmation dialog
 * - Visual feedback for quantity changes (CSS transitions)
 * - Proper semantic HTML and ARIA labels for accessibility
 * - Touch-friendly 44px minimum tap targets (WCAG 2.1 AA)
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { CartItemProps } from './types';
import { formatCurrency } from '@/utils/currency';
import { useInventoryValidation } from '@/hooks/useInventoryValidation';
import { useCartStore } from '@/stores/cartStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { debounce } from '@/utils/debounce';

/**
 * Cart item component with quantity controls and validation
 *
 * @example
 * ```tsx
 * <CartItem
 *   item={cartItem}
 *   onRemove={() => handleRemove(cartItem.product.id)}
 *   onUpdateQuantity={(qty) => handleUpdateQuantity(cartItem.product.id, qty)}
 * />
 * ```
 */
export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps): React.ReactElement {
  const [inputValue, setInputValue] = useState(item.quantity.toString());
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const { validateQuantity, isValidating } = useInventoryValidation();
  const { validationErrors, setValidationError } = useCartStore();
  const validationError = validationErrors[item.product.id];

  // Sync input value with cart item quantity changes
  useEffect(() => {
    setInputValue(item.quantity.toString());
  }, [item.quantity]);

  /**
   * Validate quantity against inventory and update cart
   */
  const validateAndUpdateQuantity = useCallback(
    async (newQuantity: number) => {
      if (!onUpdateQuantity) return;

      setIsUpdatingQuantity(true);

      // Validate quantity is not below minimum (1)
      if (newQuantity < 1) {
        setValidationError(item.product.id, 'Quantity must be at least 1');
        setIsUpdatingQuantity(false);
        return;
      }

      // Validate against inventory
      const validation = await validateQuantity(
        item.product.id,
        newQuantity,
        item.product
      );

      if (!validation.valid) {
        setValidationError(item.product.id, validation.error || 'Invalid quantity');
        setIsUpdatingQuantity(false);
        return;
      }

      // Clear error and update quantity
      setValidationError(item.product.id, null);
      onUpdateQuantity(newQuantity);
      setIsUpdatingQuantity(false);
    },
    [item.product, onUpdateQuantity, validateQuantity, setValidationError]
  );

  /**
   * Debounced version of validateAndUpdateQuantity for manual input
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedValidateAndUpdate = useCallback(
    debounce((qty: number) => validateAndUpdateQuantity(qty), 300),
    [validateAndUpdateQuantity]
  );

  /**
   * Handle quantity decrease (decrement button)
   */
  const handleDecreaseQuantity = (): void => {
    if (!onUpdateQuantity || item.quantity <= 1) return;

    const decrement = item.product.requires_tare_weight ? 0.5 : 1;
    const newQuantity = Math.max(1, item.quantity - decrement);

    validateAndUpdateQuantity(newQuantity);
  };

  /**
   * Handle quantity increase (increment button)
   */
  const handleIncreaseQuantity = async (): Promise<void> => {
    if (!onUpdateQuantity) return;

    const increment = item.product.requires_tare_weight ? 0.5 : 1;
    const newQuantity = item.quantity + increment;

    await validateAndUpdateQuantity(newQuantity);
  };

  /**
   * Handle manual quantity input change
   */
  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setInputValue(value);

    // Parse and validate input
    const parsedQty = parseFloat(value);

    // Reject invalid input
    if (value === '' || isNaN(parsedQty)) {
      setValidationError(item.product.id, 'Please enter a valid quantity');
      return;
    }

    // Reject negative or zero
    if (parsedQty <= 0) {
      setValidationError(item.product.id, 'Quantity must be at least 1');
      return;
    }

    // For non-flower products, reject decimals
    if (!item.product.requires_tare_weight && !Number.isInteger(parsedQty)) {
      setValidationError(item.product.id, 'This product requires whole number quantities');
      return;
    }

    // Debounced validation and update
    debouncedValidateAndUpdate(parsedQty);
  };

  /**
   * Handle keyboard navigation (Arrow keys for increment/decrement)
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncreaseQuantity();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecreaseQuantity();
    }
  };

  /**
   * Handle remove button click (with confirmation dialog)
   */
  const handleRemove = (): void => {
    if (onRemove) {
      onRemove();
    }
  };

  const isFlowerProduct = item.product.requires_tare_weight;
  const step = isFlowerProduct ? 0.1 : 1;
  const isLoading = isValidating || isUpdatingQuantity;

  return (
    <div className="flex items-start gap-3 border-b border-gray-200 py-4 last:border-b-0">
      {/* Product info */}
      <div className="flex-1 min-w-0">
        {/* Product name */}
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.product.name}</h4>

        {/* SKU */}
        <p className="mt-1 text-xs text-gray-500">{item.product.sku}</p>

        {/* Quantity controls */}
        <div className="mt-3 flex items-center gap-2">
          {/* Decrement button */}
          <button
            type="button"
            onClick={handleDecreaseQuantity}
            disabled={!onUpdateQuantity || item.quantity <= 1 || isLoading}
            aria-label="Decrease quantity"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent transition-colors duration-150"
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Manual quantity input */}
          <input
            type="number"
            role="spinbutton"
            value={inputValue}
            onChange={handleQuantityInputChange}
            onKeyDown={handleKeyDown}
            disabled={!onUpdateQuantity || isLoading}
            step={step}
            min="1"
            aria-valuenow={item.quantity}
            aria-valuemin={1}
            aria-label={`Quantity for ${item.product.name}`}
            aria-invalid={!!validationError}
            aria-errormessage={validationError ? `error-${item.product.id}` : undefined}
            className="h-11 w-16 min-h-[44px] rounded border border-gray-300 text-center text-sm font-medium text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50 transition-all duration-150"
          />

          {/* Increment button */}
          <button
            type="button"
            onClick={handleIncreaseQuantity}
            disabled={!onUpdateQuantity || isLoading}
            aria-label="Increase quantity"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent transition-colors duration-150"
          >
            {isLoading ? (
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
            ) : (
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
            )}
          </button>

          {/* Unit price */}
          <span className="text-xs text-gray-600">× {formatCurrency(item.unitPrice)}</span>
        </div>

        {/* Validation error message */}
        {validationError && (
          <p
            id={`error-${item.product.id}`}
            role="alert"
            className="mt-2 text-xs text-red-600"
          >
            {validationError}
          </p>
        )}
      </div>

      {/* Line total and remove button */}
      <div className="flex flex-col items-end gap-2">
        {/* Line total with animation */}
        <p
          className="text-sm font-bold text-gray-900 transition-all duration-200"
          aria-live="polite"
          aria-atomic="true"
        >
          {formatCurrency(item.lineTotal)}
        </p>

        {/* Remove button with confirmation dialog */}
        {onRemove && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                aria-label={`Remove ${item.product.name} from cart`}
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-150"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent role="dialog" aria-modal="true">
              <AlertDialogHeader>
                <AlertDialogTitle>Remove item?</AlertDialogTitle>
                <AlertDialogDescription>
                  Remove {item.product.name} from cart?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemove}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
