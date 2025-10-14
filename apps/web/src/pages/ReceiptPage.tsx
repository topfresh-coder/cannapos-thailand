/**
 * Receipt Page - Transaction Receipt Display
 *
 * Displays detailed transaction receipt after successful checkout.
 * Fetches transaction data from Supabase and displays it in a print-friendly format
 * suitable for 80mm thermal printers.
 *
 * **Features:**
 * - Fetches transaction data via URL parameter (/receipt/:transactionId)
 * - Displays header (location, timestamp, cashier, transaction ID)
 * - Shows itemized line items table with quantities and prices
 * - Displays subtotal, total amount, and payment method
 * - "New Transaction" button to return to POS and clear cart
 * - Loading state while fetching data
 * - Error states for missing transactions or network errors
 * - Print-friendly CSS for 80mm thermal printers
 * - Full WCAG 2.1 AA accessibility compliance
 *
 * @see Story 1.8 - Receipt Display & Print Preparation
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReceipt, TransactionNotFoundError } from '@/services/receipts.service';
import { useCartStore } from '@/stores/cartStore';
import { formatCurrency } from '@/utils/currency';
import type { ReceiptData } from '@/types/receipt';
import { Button } from '@/components/ui/button';

/**
 * ReceiptPage Component
 *
 * Full-featured receipt display component with data fetching,
 * error handling, and print preparation.
 *
 * **State Management:**
 * - `receipt`: Fetched transaction data
 * - `loading`: Loading state during data fetch
 * - `error`: Error message if fetch fails
 *
 * **User Actions:**
 * - "New Transaction": Clears cart and returns to POS
 * - "Return to POS": Returns to POS (error state only)
 *
 * **Accessibility:**
 * - ARIA labels on all interactive elements
 * - Semantic HTML with proper heading hierarchy
 * - Keyboard navigation support (Tab, Enter)
 * - Screen reader-friendly table structure
 * - 44px minimum touch targets (WCAG 2.1 AA)
 */
export default function ReceiptPage(): React.ReactElement {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clear);
  const setLastTransaction = useCartStore((state) => state.setLastTransaction);

  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches receipt data on component mount
   *
   * Runs when transactionId changes. Handles loading, success, and error states.
   */
  useEffect(() => {
    async function fetchReceipt(): Promise<void> {
      if (!transactionId) {
        setError('No transaction ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getReceipt(transactionId);
        setReceipt(data);
        setError(null);
      } catch (err) {
        if (err instanceof TransactionNotFoundError) {
          setError('Receipt not found. This transaction may not exist.');
        } else {
          setError('Failed to load receipt. Please try again.');
        }
        console.error('Receipt fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReceipt();
  }, [transactionId]);

  /**
   * Handles "New Transaction" button click
   *
   * Clears cart state and lastTransaction metadata,
   * then navigates back to POS main screen.
   */
  const handleNewTransaction = (): void => {
    clearCart();
    setLastTransaction(null);
    navigate('/pos');
  };

  /**
   * Loading State
   *
   * Displays loading spinner while fetching transaction data
   */
  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-gray-100"
        role="status"
        aria-live="polite"
        aria-label="Loading receipt"
      >
        <div className="flex flex-col items-center gap-4">
          {/* Loading Spinner */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-gray-600">Loading receipt...</p>
        </div>
      </div>
    );
  }

  /**
   * Error State
   *
   * Displays error message and "Return to POS" button
   * when transaction not found or network error occurs
   */
  if (error || !receipt) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-10 w-10 text-red-600"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
            Error Loading Receipt
          </h1>
          <p className="mb-6 text-center text-gray-600">{error || 'An unexpected error occurred'}</p>

          {/* Action Button */}
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => navigate('/pos')}
            aria-label="Return to POS main screen"
          >
            Return to POS
          </Button>
        </div>
      </div>
    );
  }

  /**
   * Receipt Display
   *
   * Main receipt content with header, line items, totals, and actions
   */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="receipt-page mx-auto max-w-sm rounded-lg bg-white p-6 shadow-lg">
        {/* Receipt Header */}
        <header className="receipt-header mb-6 border-b pb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{receipt.locationName}</h1>
          <p className="mt-1 text-sm text-gray-600">
            Transaction ID: <span className="font-mono">{receipt.transactionId.slice(0, 8)}</span>
          </p>
          <p className="text-sm text-gray-600">
            {new Date(receipt.timestamp).toLocaleString('th-TH', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className="text-sm text-gray-600">Cashier: {receipt.cashierName}</p>
        </header>

        {/* Line Items Table */}
        <div className="receipt-items mb-6">
          <table className="w-full text-sm" role="table" aria-label="Receipt line items">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left font-medium text-gray-700" scope="col">
                  Product
                </th>
                <th className="pb-2 text-right font-medium text-gray-700" scope="col">
                  Qty
                </th>
                <th className="pb-2 text-right font-medium text-gray-700" scope="col">
                  Price
                </th>
                <th className="pb-2 text-right font-medium text-gray-700" scope="col">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 text-left text-gray-900">{item.productName}</td>
                  <td className="py-2 text-right text-gray-900">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-2 text-right text-gray-900">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-2 text-right text-gray-900">{formatCurrency(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="receipt-totals mb-6 border-t pt-4 text-right">
          <p className="text-sm text-gray-700">
            Subtotal: <span className="font-medium">{formatCurrency(receipt.subtotal)}</span>
          </p>
          <p className="mt-2 text-lg font-bold text-gray-900">
            Total: <span>{formatCurrency(receipt.totalAmount)}</span>
          </p>
          <p className="mt-1 text-sm text-gray-600">Payment: {receipt.paymentMethod}</p>
        </div>

        {/* Action Buttons */}
        <div className="no-print">
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleNewTransaction}
            aria-label="Start a new transaction and return to POS"
            style={{ minHeight: '44px' }} // WCAG 2.1 AA touch target
          >
            New Transaction
          </Button>
        </div>
      </div>
    </div>
  );
}
