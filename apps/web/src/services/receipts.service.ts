/**
 * Receipts Service
 *
 * Service layer for fetching transaction receipt data from Supabase.
 * Handles data fetching, mapping from database structure to Receipt types,
 * and error handling for missing or invalid transactions.
 *
 * @module services/receipts
 */

import { supabase } from '@/lib/supabase';
import type { ReceiptData, ReceiptLineItem } from '@/types/receipt';

/**
 * Custom error for transaction not found scenarios
 *
 * Thrown when a transaction ID does not exist in the database.
 * Allows UI to differentiate between not found vs network errors.
 */
export class TransactionNotFoundError extends Error {
  constructor(transactionId: string) {
    super(`Transaction not found: ${transactionId}`);
    this.name = 'TransactionNotFoundError';
  }
}

/**
 * Fetches complete receipt data for a transaction
 *
 * Queries the Supabase database for transaction details including:
 * - Transaction metadata (ID, date, amount, payment method)
 * - Related user (cashier) information
 * - Related location information
 * - Line items with product details
 *
 * The query performs JOINs across multiple tables to fetch nested data,
 * then maps the nested Supabase response to a flat ReceiptData structure.
 *
 * @param transactionId - UUID of the transaction to fetch
 * @returns Promise resolving to ReceiptData with all receipt information
 * @throws {TransactionNotFoundError} When transaction ID does not exist
 *
 * @example
 * ```typescript
 * try {
 *   const receipt = await getReceipt('550e8400-e29b-41d4-a716-446655440000');
 *   console.log(receipt.totalAmount); // 1525.00
 * } catch (error) {
 *   if (error instanceof TransactionNotFoundError) {
 *     // Handle missing transaction
 *   }
 * }
 * ```
 *
 * **Query Details:**
 * - Joins: `users`, `locations`, `transaction_items`, `products`
 * - Returns single transaction with `.single()` (throws if multiple or none found)
 * - Supabase RLS policies automatically filter by user permissions
 *
 * **Data Mapping:**
 * - Nested objects flattened to ReceiptData interface
 * - Cashier name: Falls back to email if name is null
 * - Location name: Falls back to "Unknown Location" if missing
 * - Line items: Maps array of transaction_items to ReceiptLineItem[]
 */
export async function getReceipt(transactionId: string): Promise<ReceiptData> {
  const { data: transaction, error } = await supabase
    .from('transactions')
    .select(`
      id,
      transaction_date,
      total_amount,
      payment_method,
      users!transactions_user_id_fkey (name, email),
      locations!transactions_location_id_fkey (name),
      transaction_items (
        id,
        quantity,
        unit_price,
        line_total,
        products!transaction_items_product_id_fkey (name, sku, unit)
      )
    `)
    .eq('id', transactionId)
    .single();

  // Handle errors or missing transaction
  if (error || !transaction) {
    throw new TransactionNotFoundError(transactionId);
  }

  // Map nested Supabase response to flat ReceiptData structure
  // TypeScript note: Supabase nested data requires runtime null checks and type narrowing
  const locationData = transaction.locations as { name: string } | null;
  const userData = transaction.users as { name: string | null; email: string } | null;
  const transactionItems = transaction.transaction_items as Array<{
    id: string;
    quantity: number;
    unit_price: number;
    line_total: number;
    products: { name: string; sku: string; unit: string };
  }>;

  const receiptData: ReceiptData = {
    transactionId: transaction.id,
    timestamp: transaction.transaction_date,
    locationName: locationData?.name || 'Unknown Location',
    cashierName: userData?.name || userData?.email || 'Unknown Cashier',
    items: transactionItems.map((item): ReceiptLineItem => ({
      productName: item.products.name,
      sku: item.products.sku,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      lineTotal: item.line_total,
      unit: item.products.unit
    })),
    subtotal: transaction.total_amount, // MVP: no separate subtotal vs total
    totalAmount: transaction.total_amount,
    paymentMethod: transaction.payment_method
  };

  return receiptData;
}
