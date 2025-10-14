/**
 * useInventoryValidation Hook
 *
 * Custom hook for validating cart quantities against available inventory.
 * Implements:
 * - Query Supabase product_batches table for available quantity
 * - Calculate total available quantity from active batches
 * - Return validation result with error message
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/supabase';

type Product = Tables<'products'>;

interface ValidationResult {
  valid: boolean;
  availableQuantity: number;
  error?: string;
}

/**
 * Hook for validating product quantities against available inventory
 *
 * @returns {validateQuantity} Function to validate quantity for a product
 *
 * @example
 * ```tsx
 * const { validateQuantity } = useInventoryValidation();
 * const result = await validateQuantity(productId, requestedQty);
 * if (!result.valid) {
 *   showError(result.error);
 * }
 * ```
 */
export function useInventoryValidation() {
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Validate if requested quantity is available for a product
   *
   * @param productId - UUID of the product
   * @param requestedQuantity - Quantity being requested
   * @param product - Product data (optional, for unit info)
   * @returns Validation result with availability info
   */
  const validateQuantity = useCallback(
    async (
      productId: string,
      requestedQuantity: number,
      product?: Product
    ): Promise<ValidationResult> => {
      setIsValidating(true);

      try {
        // Query active batches for this product
        const { data: batches, error } = await supabase
          .from('product_batches')
          .select('quantity_remaining')
          .eq('product_id', productId)
          .eq('status', 'Active');

        if (error) {
          console.error('Error querying inventory:', error);
          return {
            valid: false,
            availableQuantity: 0,
            error: 'Unable to check inventory availability',
          };
        }

        // Calculate total available quantity from all active batches
        const availableQuantity = batches.reduce(
          (sum, batch) => sum + (batch.quantity_remaining || 0),
          0
        );

        // Validate requested quantity against available
        if (requestedQuantity > availableQuantity) {
          const unit = product?.unit || 'units';
          return {
            valid: false,
            availableQuantity,
            error: `Only ${availableQuantity} ${unit} available`,
          };
        }

        return {
          valid: true,
          availableQuantity,
        };
      } catch (err) {
        console.error('Unexpected error validating inventory:', err);
        return {
          valid: false,
          availableQuantity: 0,
          error: 'Unexpected error checking inventory',
        };
      } finally {
        setIsValidating(false);
      }
    },
    []
  );

  return {
    validateQuantity,
    isValidating,
  };
}
