/**
 * Receipt Data Types
 *
 * Type definitions for receipt data structure used in transaction completion
 * and receipt display (Story 1.8).
 *
 * @module types/receipt
 */

import type { PaymentMethod } from '@/services/transactions.service';

/**
 * Single line item on a receipt
 */
export interface ReceiptLineItem {
  /** Product name (e.g., "Blue Dream Flower") */
  productName: string;

  /** Product SKU for identification */
  sku: string;

  /** Quantity sold (decimal for flower, integer for others) */
  quantity: number;

  /** Price per unit (Thai Baht) */
  unitPrice: number;

  /** Line total (quantity × unitPrice) */
  lineTotal: number;

  /** Unit of measurement (e.g., "gram", "piece") */
  unit: string;
}

/**
 * Complete receipt data for a transaction
 *
 * Used to pass transaction details from POS to receipt page
 * after successful transaction completion.
 */
export interface ReceiptData {
  /** Transaction UUID */
  transactionId: string;

  /** Transaction timestamp (ISO 8601 format) */
  timestamp: string;

  /** Location name (e.g., "Pilot Location - Bangkok") */
  locationName: string;

  /** Cashier name (from user.display_name or user.email) */
  cashierName: string;

  /** Line items sold in this transaction */
  items: ReceiptLineItem[];

  /** Subtotal before taxes/discounts (Thai Baht) */
  subtotal: number;

  /** Total amount charged (Thai Baht) */
  totalAmount: number;

  /** Payment method used (Cash, Card, QR Code) */
  paymentMethod: PaymentMethod;
}
