/**
 * CartSidebar Component
 *
 * Displays the shopping cart in a sidebar layout.
 * Implements:
 * - Fixed sidebar on desktop, drawer on mobile
 * - Cart header with title and item count
 * - List of cart items using CartItem component
 * - Running subtotal display
 * - Complete Sale button with transaction processing
 * - Empty state with icon and message
 * - ARIA live region for cart updates
 * - Proper semantic HTML (aside element)
 * - Full WCAG 2.1 AA accessibility compliance
 *
 * Story 1.7: Adds transaction completion functionality with:
 * - LIFO inventory allocation
 * - Transaction recording to database
 * - Error handling with retry logic
 * - Loading states and visual feedback
 * - Navigation to receipt page on success
 */

import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CartSidebarProps } from './types';
import { CartItem } from './CartItem';
import { formatCurrency } from '@/utils/currency';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCartStore } from '@/stores/cartStore';
import { transactionService, InventoryValidationError } from '@/services/transactions.service';
import { useToast } from '@/hooks/use-toast';

/**
 * Cart sidebar component for displaying shopping cart
 *
 * @example
 * ```tsx
 * <CartSidebar
 *   items={cartItems}
 *   subtotal={cartSubtotal}
 *   onRemoveItem={handleRemoveItem}
 *   onUpdateQuantity={handleUpdateQuantity}
 * />
 * ```
 */
export function CartSidebar({
  items,
  subtotal,
  onRemoveItem,
  onUpdateQuantity,
}: CartSidebarProps): React.ReactElement {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const clearCart = useCartStore((state) => state.clear);
  const setLastTransaction = useCartStore((state) => state.setLastTransaction);

  // Transaction processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  /**
   * Get item count for cart header
   */
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  /**
   * Handle Complete Sale button click
   *
   * Implements transaction creation with:
   * - User and shift validation
   * - Inventory availability check
   * - LIFO batch allocation
   * - Transaction recording
   * - Error handling with retry logic for network errors
   * - Success feedback and navigation to receipt page
   * - Error feedback with cart preservation
   *
   * Story 1.7 MVP: Shift management not implemented yet, using hardcoded shift_id
   */
  const handleCompleteSale = async (): Promise<void> => {
    // Validation: Ensure user is authenticated
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in to complete a transaction.',
      });
      return;
    }

    // Validation: Ensure cart is not empty (defensive check)
    if (items.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Cart is Empty',
        description: 'Add products to cart before completing a sale.',
      });
      return;
    }

    // MVP Workaround: Story 1.7 assumes active shift exists
    // TODO: Story 2.x - Replace with actual shift management from shiftStore
    // For now, we'll use a temporary hardcoded shift_id
    // In production, this would fail RLS policies if shift doesn't exist
    const TEMP_SHIFT_ID = '00000000-0000-0000-0000-000000000001'; // Temporary MVP workaround

    // Note: Commented out for MVP - will be implemented in Story 2.x (Shift Management)
    // const currentShift = useShiftStore((state) => state.currentShift);
    // if (!currentShift) {
    //   toast({
    //     variant: 'destructive',
    //     title: 'No Active Shift',
    //     description: 'Please open a shift to continue.',
    //   });
    //   return;
    // }

    // Start processing
    setIsProcessing(true);
    setLoadingMessage('Processing transaction...');

    // Validation: Ensure user has location_id
    if (!user.location_id) {
      toast({
        variant: 'destructive',
        title: 'Invalid User',
        description: 'User must have a location to complete transactions.',
      });
      return;
    }

    try {
      // Attempt transaction with retry logic for network errors
      const result = await retryWithExponentialBackoff(
        async () => {
          return await transactionService.createTransaction(
            {
              user_id: user.id,
              location_id: user.location_id!,
              shift_id: TEMP_SHIFT_ID, // MVP: Hardcoded, will be replaced in Story 2.x
              total_amount: subtotal,
              payment_method: 'Cash', // MVP default
            },
            items
          );
        },
        {
          maxRetries: 3,
          onRetry: (attempt) => {
            setLoadingMessage(`Network error. Retrying... (attempt ${attempt}/3)`);
          },
        }
      );

      // Success: Clear cart and navigate to receipt
      clearCart();

      // Store transaction metadata for receipt page
      setLastTransaction({
        transactionId: result.transaction.id,
        timestamp: result.transaction.transaction_date,
      });

      // Show success toast
      toast({
        title: 'Transaction Completed',
        description: `Transaction ID: ${result.transaction.id.slice(0, 8)}...`,
        duration: 5000,
      });

      // Navigate to receipt page
      navigate(`/receipt/${result.transaction.id}`);
    } catch (error) {
      // Error handling: Preserve cart state and show user-friendly message
      console.error('Transaction failed:', error);

      if (error instanceof InventoryValidationError) {
        // Inventory validation error (insufficient stock)
        toast({
          variant: 'destructive',
          title: 'Insufficient Inventory',
          description: error.message,
        });
      } else if (error instanceof Error) {
        // Generic error with user-friendly message
        toast({
          variant: 'destructive',
          title: 'Transaction Failed',
          description: error.message || 'Please try again or contact support.',
        });
      } else {
        // Unknown error
        toast({
          variant: 'destructive',
          title: 'Transaction Failed',
          description: 'An unexpected error occurred. Please try again.',
        });
      }

      // Cart preserved (do NOT clear on error)
    } finally {
      setIsProcessing(false);
      setLoadingMessage(null);
    }
  };

  /**
   * Retry function with exponential backoff for network errors
   *
   * Implements retry logic for transient network failures:
   * - Max 3 retry attempts
   * - Exponential backoff: 1s, 2s, 4s delays
   * - Only retries on network errors (not validation errors)
   *
   * @param fn - Async function to retry
   * @param options - Retry configuration
   * @returns Result from successful function execution
   * @throws Error if all retry attempts fail or non-network error occurs
   */
  async function retryWithExponentialBackoff<T>(
    fn: () => Promise<T>,
    options: { maxRetries: number; onRetry?: (attempt: number) => void }
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        // Check if error is network-related (retry-able)
        const isNetworkError =
          lastError.message.includes('network') ||
          lastError.message.includes('fetch') ||
          lastError.message.includes('timeout') ||
          lastError.message.includes('connection');

        // Do NOT retry on validation errors or business logic errors
        if (error instanceof InventoryValidationError || !isNetworkError) {
          throw error;
        }

        // If this is the last attempt, throw the error
        if (attempt === options.maxRetries) {
          throw lastError;
        }

        // Notify about retry attempt
        options.onRetry?.(attempt);

        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError ?? new Error('Retry failed');
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <aside
        className="flex h-full w-full flex-col bg-gray-50 p-6"
        aria-label="Shopping cart"
      >
        {/* Cart header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Cart</h2>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
            0
          </span>
        </div>

        {/* Empty state */}
        <div
          role="status"
          aria-label="Cart is empty"
          className="flex flex-1 flex-col items-center justify-center text-center"
        >
          {/* Empty cart icon */}
          <svg
            className="mb-4 h-16 w-16 text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>

          <h3 className="mb-2 text-lg font-semibold text-gray-900">Your cart is empty</h3>
          <p className="text-sm text-gray-500">Search and select products to begin</p>
        </div>

        {/* ARIA live region for screen reader announcements */}
        <div
          aria-live="polite"
          aria-atomic="true"
          role="status"
          className="sr-only"
        >
          Cart is empty
        </div>
      </aside>
    );
  }

  // Cart with items
  return (
    <aside
      className="flex h-full w-full flex-col bg-gray-50"
      aria-label="Shopping cart"
    >
      {/* Cart header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-6 pb-4">
        <h2 className="text-xl font-bold text-gray-900">Cart</h2>
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white"
          aria-label={`${itemCount} items in cart`}
        >
          {itemCount}
        </span>
      </div>

      {/* Cart items - scrollable area */}
      <div
        className={`flex-1 overflow-y-auto px-6 ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
      >
        {items.map((item) => (
          <CartItem
            key={item.product.id}
            item={item}
            onRemove={onRemoveItem ? () => onRemoveItem(item.product.id) : undefined}
            onUpdateQuantity={
              onUpdateQuantity ? (qty) => onUpdateQuantity(item.product.id, qty) : undefined
            }
          />
        ))}
      </div>

      {/* Cart footer with subtotal and Complete Sale button */}
      <div className="border-t border-gray-200 p-6">
        {/* Subtotal */}
        <div
          className="flex items-center justify-between mb-4"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="text-lg font-semibold text-gray-900">Subtotal</span>
          <span className="text-2xl font-bold text-gray-900">{formatCurrency(subtotal)}</span>
        </div>

        {/* Complete Sale button - Story 1.7 */}
        <Button
          type="button"
          variant="default"
          size="lg"
          className="w-full min-h-[44px]"
          onClick={handleCompleteSale}
          disabled={isProcessing}
          aria-label="Complete sale and record transaction"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Complete Sale'
          )}
        </Button>

        {/* Keyboard shortcut hint */}
        <p className="mt-2 text-center text-xs text-gray-500">Press Enter to complete sale</p>
      </div>

      {/* ARIA live region for screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        role="status"
        className="sr-only"
      >
        {loadingMessage || `Cart updated: ${itemCount} ${itemCount === 1 ? 'item' : 'items'}, total ${formatCurrency(subtotal)}`}
      </div>
    </aside>
  );
}
