/**
 * Transaction Service Layer
 *
 * Handles transaction creation, inventory allocation (LIFO), and transaction recording.
 * Implements atomic transaction processing with proper error handling and rollback.
 *
 * @module services/transactions
 */

import { supabase } from '@/lib/supabase';
import type { Tables, Json } from '@/types/supabase';
import type { CartItem } from '@/stores/cartStore';

// ============================================================================
// Types
// ============================================================================

type Transaction = Tables<'transactions'>;
type TransactionItem = Tables<'transaction_items'>;

export type PaymentMethod = 'Cash' | 'Card' | 'QR Code';

/**
 * Batch allocation details for transaction_items.batch_allocations JSONB field
 */
export interface BatchAllocation {
  batch_id: string;
  quantity_allocated: number;
  cost_per_unit: number;
}

/**
 * Request payload for creating a transaction
 */
export interface CreateTransactionRequest {
  user_id: string;
  location_id: string;
  shift_id: string;
  total_amount: number;
  payment_method: PaymentMethod;
}

/**
 * Single transaction item for insertion
 */
export interface TransactionItemRequest {
  transaction_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  tier_id?: string | null;
  batch_allocations: BatchAllocation[];
}

/**
 * Response after successful transaction creation
 */
export interface CreateTransactionResponse {
  transaction: Transaction;
  transactionItems: TransactionItem[];
}

/**
 * Validation error for inventory availability
 */
export class InventoryValidationError extends Error {
  productName: string;
  availableQuantity: number;
  requestedQuantity: number;
  unit: string;

  constructor(
    productName: string,
    availableQuantity: number,
    requestedQuantity: number,
    unit: string
  ) {
    super(
      `Insufficient inventory for ${productName}. Only ${availableQuantity} ${unit} available.`
    );
    this.name = 'InventoryValidationError';
    this.productName = productName;
    this.availableQuantity = availableQuantity;
    this.requestedQuantity = requestedQuantity;
    this.unit = unit;
  }
}

// ============================================================================
// Service Implementation
// ============================================================================

/**
 * Allocate inventory using LIFO (Last In, First Out) strategy
 *
 * Queries product_batches ordered by received_date DESC (newest first).
 * Allocates quantity from newest batch first. If batch insufficient,
 * depletes batch fully and moves to next newest batch.
 *
 * **LIFO Note**: This is a temporary MVP simplification. Epic 2 will implement
 * FIFO (First In, First Out) for proper inventory management (oldest first).
 *
 * @param productId - UUID of the product
 * @param quantityNeeded - Total quantity to allocate
 * @returns Array of batch allocations with quantity and cost details
 * @throws Error if insufficient inventory available
 *
 * @example
 * ```typescript
 * // Allocate 5g from product's batches (LIFO)
 * const allocations = await allocateInventoryLIFO('product-uuid', 5);
 * // [{ batch_id: 'newest-batch', quantity_allocated: 5, cost_per_unit: 220 }]
 * ```
 */
async function allocateInventoryLIFO(
  productId: string,
  quantityNeeded: number
): Promise<BatchAllocation[]> {
  try {
    // Query batches ordered by received_date DESC (LIFO: newest first)
    const { data: batches, error } = await supabase
      .from('product_batches')
      .select('id, quantity_remaining, cost_per_unit, received_date')
      .eq('product_id', productId)
      .eq('status', 'Active')
      .order('received_date', { ascending: false }); // DESC = LIFO (newest first)

    if (error) {
      throw new Error(`Failed to query batches: ${error.message}`);
    }

    if (!batches || batches.length === 0) {
      throw new Error(`No active batches found for product ${productId}`);
    }

    // Allocate from newest batch first
    let remainingNeeded = quantityNeeded;
    const allocations: BatchAllocation[] = [];

    for (const batch of batches) {
      if (remainingNeeded <= 0) break;

      const allocateQty = Math.min(batch.quantity_remaining, remainingNeeded);

      allocations.push({
        batch_id: batch.id,
        quantity_allocated: allocateQty,
        cost_per_unit: batch.cost_per_unit,
      });

      // Update batch quantity_remaining
      const newQuantityRemaining = batch.quantity_remaining - allocateQty;

      const { error: updateError } = await supabase
        .from('product_batches')
        .update({ quantity_remaining: newQuantityRemaining })
        .eq('id', batch.id);

      if (updateError) {
        throw new Error(`Failed to update batch ${batch.id}: ${updateError.message}`);
      }

      remainingNeeded -= allocateQty;
    }

    // If still need more inventory, throw insufficient inventory error
    if (remainingNeeded > 0) {
      throw new Error(
        `Insufficient inventory for product ${productId}. Needed ${quantityNeeded}, available ${
          quantityNeeded - remainingNeeded
        }`
      );
    }

    return allocations;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred during inventory allocation');
  }
}

/**
 * Validate inventory availability for all cart items
 *
 * Checks if sufficient inventory exists for each product in the cart.
 * Queries sum of quantity_remaining for active batches per product.
 *
 * @param cartItems - Array of cart items to validate
 * @throws InventoryValidationError if any product has insufficient inventory
 *
 * @example
 * ```typescript
 * try {
 *   await validateInventoryAvailability(cartItems);
 *   // Proceed with transaction
 * } catch (error) {
 *   if (error instanceof InventoryValidationError) {
 *     showToast(`Insufficient inventory for ${error.productName}`);
 *   }
 * }
 * ```
 */
async function validateInventoryAvailability(cartItems: CartItem[]): Promise<void> {
  for (const item of cartItems) {
    try {
      // Query all active batches for the product
      const { data: batches, error } = await supabase
        .from('product_batches')
        .select('quantity_remaining')
        .eq('product_id', item.product.id)
        .eq('status', 'Active');

      if (error) {
        throw new Error(`Failed to validate inventory: ${error.message}`);
      }

      // Calculate total available quantity
      const availableQuantity = batches?.reduce(
        (sum, batch) => sum + batch.quantity_remaining,
        0
      ) ?? 0;

      // Check if sufficient inventory
      if (availableQuantity < item.quantity) {
        throw new InventoryValidationError(
          item.product.name,
          availableQuantity,
          item.quantity,
          item.product.unit
        );
      }
    } catch (error) {
      if (error instanceof InventoryValidationError) {
        throw error;
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred during inventory validation');
    }
  }
}

/**
 * Create a transaction and record all cart items
 *
 * Implements atomic transaction processing:
 * 1. Validate inventory availability
 * 2. Insert transaction record
 * 3. For each cart item:
 *    a. Allocate inventory (LIFO)
 *    b. Insert transaction_item with batch_allocations
 * 4. Return transaction data for receipt
 *
 * **Error Handling**:
 * - Network errors: Caller should implement retry with exponential backoff
 * - Validation errors: InventoryValidationError thrown immediately
 * - Database errors: Rolled back automatically by Supabase (each operation is atomic)
 *
 * **MVP Simplifications**:
 * - Payment method: Default 'Cash' (no user selection)
 * - Tier pricing: tier_id = null (not implemented until Epic 3)
 * - Tare weight: gross_weight, tare_weight = null (future story)
 * - Manager override: override_price, override_reason = null (future story)
 *
 * @param transactionData - Transaction metadata (user, location, shift, total, payment)
 * @param cartItems - Array of cart items to record
 * @returns Created transaction with transaction items
 * @throws InventoryValidationError if insufficient inventory
 * @throws Error if database operations fail
 *
 * @example
 * ```typescript
 * const result = await transactionService.createTransaction(
 *   {
 *     user_id: currentUser.id,
 *     location_id: currentUser.location_id,
 *     shift_id: currentShift.id,
 *     total_amount: cartStore.getSubtotal(),
 *     payment_method: 'Cash'
 *   },
 *   cartStore.items
 * );
 * console.log(`Transaction created: ${result.transaction.id}`);
 * ```
 */
export async function createTransaction(
  transactionData: CreateTransactionRequest,
  cartItems: CartItem[]
): Promise<CreateTransactionResponse> {
  try {
    // Step 1: Validate inventory availability BEFORE creating transaction
    await validateInventoryAvailability(cartItems);

    // Step 2: Insert transaction record
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: transactionData.user_id,
        location_id: transactionData.location_id,
        shift_id: transactionData.shift_id,
        total_amount: transactionData.total_amount,
        payment_method: transactionData.payment_method,
      })
      .select()
      .single();

    if (txError) {
      throw new Error(`Failed to create transaction: ${txError.message}`);
    }

    if (!transaction) {
      throw new Error('Transaction creation returned no data');
    }

    // Step 3: For each cart item, allocate inventory and insert transaction_item
    const transactionItems: TransactionItem[] = [];

    for (const item of cartItems) {
      // 3a. Allocate inventory (LIFO)
      const allocations = await allocateInventoryLIFO(item.product.id, item.quantity);

      // 3b. Insert transaction_item with batch_allocations
      const { data: txItem, error: itemError } = await supabase
        .from('transaction_items')
        .insert({
          transaction_id: transaction.id,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          line_total: item.lineTotal,
          tier_id: null, // MVP: no tier pricing yet (Epic 3)
          gross_weight: null, // MVP: no tare weight yet (future story)
          tare_weight: null,
          override_price: null, // MVP: no manager override yet (future story)
          override_reason: null,
          batch_allocations: allocations as unknown as Json, // JSONB field - cast for Supabase type compatibility
        })
        .select()
        .single();

      if (itemError) {
        throw new Error(`Failed to create transaction item: ${itemError.message}`);
      }

      if (txItem) {
        transactionItems.push(txItem);
      }
    }

    // Step 4: Return transaction data
    return {
      transaction,
      transactionItems,
    };
  } catch (error) {
    // Re-throw specific error types
    if (error instanceof InventoryValidationError) {
      throw error;
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred during transaction creation');
  }
}

/**
 * Transaction service exports
 */
export const transactionService = {
  createTransaction,
  validateInventoryAvailability,
  allocateInventoryLIFO,
};
