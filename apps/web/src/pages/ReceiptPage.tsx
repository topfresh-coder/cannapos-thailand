/**
 * Receipt Page - Transaction Receipt Display
 *
 * Displays transaction receipt after successful checkout.
 * This is a placeholder implementation for Story 1.7.
 * Full receipt display will be implemented in Story 1.8.
 *
 * @see Story 1.7 - Simple Checkout & Transaction Recording (placeholder)
 * @see Story 1.8 - Receipt Display (full implementation)
 */

import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/**
 * ReceiptPage Component
 *
 * Temporary placeholder that confirms transaction completion
 * and allows navigation back to POS.
 *
 * Story 1.8 will implement full receipt with:
 * - Transaction details (ID, timestamp, cashier)
 * - Line items with quantities and prices
 * - Subtotal and payment method
 * - Print functionality
 */
export default function ReceiptPage(): React.ReactElement {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();

  const handleBackToPOS = (): void => {
    navigate('/pos');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Transaction Complete
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Your transaction has been recorded successfully
        </p>

        {/* Transaction ID */}
        <div className="mb-8 rounded-md bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">Transaction ID</p>
          <p className="mt-1 font-mono text-sm text-gray-900">{transactionId}</p>
        </div>

        {/* Placeholder Notice */}
        <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Full receipt display will be available in Story 1.8. This is a
            temporary placeholder confirming your transaction was recorded.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleBackToPOS}
          >
            Back to POS
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            disabled
          >
            Print Receipt (Coming in Story 1.8)
          </Button>
        </div>
      </div>
    </div>
  );
}
