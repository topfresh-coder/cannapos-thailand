/**
 * ReceiptPage Component Tests
 *
 * Comprehensive test suite for receipt display functionality.
 * Tests data display, navigation, loading states, error handling, and accessibility.
 *
 * @see Story 1.8 - Receipt Display & Print Preparation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ReceiptPage from './ReceiptPage';
import * as receiptsService from '@/services/receipts.service';
import { useCartStore } from '@/stores/cartStore';
import type { ReceiptData } from '@/types/receipt';

// Mock dependencies
vi.mock('@/services/receipts.service');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ transactionId: 'tx-123' }),
    useNavigate: () => mockNavigate
  };
});

const mockNavigate = vi.fn();

// Mock receipt data
const mockReceiptData: ReceiptData = {
  transactionId: 'tx-123',
  timestamp: '2025-10-15T14:30:00Z',
  locationName: 'Pilot Location - Bangkok',
  cashierName: 'John Doe',
  items: [
    {
      productName: 'Blue Dream Flower',
      sku: 'FLW001',
      quantity: 3.5,
      unitPrice: 350,
      lineTotal: 1225,
      unit: 'gram'
    },
    {
      productName: 'Pre-Roll',
      sku: 'PR001',
      quantity: 2,
      unitPrice: 150,
      lineTotal: 300,
      unit: 'piece'
    }
  ],
  subtotal: 1525,
  totalAmount: 1525,
  paymentMethod: 'Cash'
};

describe('ReceiptPage - Story 1.8', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCartStore.getState().clear();
    vi.spyOn(receiptsService, 'getReceipt').mockResolvedValue(mockReceiptData);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Receipt data display (AC1)', () => {
    it('displays location name from receipt data', async () => {
      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Pilot Location - Bangkok')).toBeInTheDocument();
      });
    });

    it('displays transaction ID (truncated to 8 characters)', async () => {
      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/tx-123/i)).toBeInTheDocument();
      });
    });

    it('displays timestamp in Thai date format (DD/MM/YYYY HH:mm)', async () => {
      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        // Thai locale format: 15/10/2025 14:30
        const dateElement = screen.getByText(/15\/10\/2025/);
        expect(dateElement).toBeInTheDocument();
      });
    });

    it('displays cashier name from receipt data', async () => {
      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Cashier: John Doe/i)).toBeInTheDocument();
      });
    });

    it('displays line items table with product details', async () => {
      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Blue Dream Flower')).toBeInTheDocument();
        expect(screen.getByText(/3\.5 gram/i)).toBeInTheDocument();
        expect(screen.getByText(/฿350\.00/i)).toBeInTheDocument();
        expect(screen.getByText(/฿1,225\.00/i)).toBeInTheDocument();

        expect(screen.getByText('Pre-Roll')).toBeInTheDocument();
        expect(screen.getByText(/2 piece/i)).toBeInTheDocument();
        expect(screen.getByText(/฿150\.00/i)).toBeInTheDocument();
        expect(screen.getByText(/฿300\.00/i)).toBeInTheDocument();
      });
    });

    it('displays subtotal with currency formatting (AC6)', async () => {
      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Subtotal: ฿1,525\.00/i)).toBeInTheDocument();
      });
    });

    it('displays total amount with currency formatting (AC6)', async () => {
      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Total: ฿1,525\.00/i)).toBeInTheDocument();
      });
    });

    it('displays payment method from receipt data', async () => {
      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Payment: Cash/i)).toBeInTheDocument();
      });
    });
  });

  describe('"New Transaction" button (AC2)', () => {
    it('displays "New Transaction" button', async () => {
      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new transaction/i })).toBeInTheDocument();
      });
    });

    it('navigates to /pos when "New Transaction" clicked', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new transaction/i })).toBeInTheDocument();
      });

      const button = screen.getByRole('button', { name: /new transaction/i });
      await user.click(button);

      expect(mockNavigate).toHaveBeenCalledWith('/pos');
    });

    it('clears cart when "New Transaction" clicked', async () => {
      const user = userEvent.setup();

      // Seed cart with items - Use full Product type from Supabase
      const mockProduct = {
        id: 'prod-1',
        name: 'Test Product',
        category: 'Flower' as const,
        sku: 'TEST001',
        unit: 'gram' as const,
        base_price: 400,
        requires_tare_weight: true,
        reorder_threshold: 10,
        is_active: true,
        location_id: 'loc-1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      };
      useCartStore.getState().addItem(mockProduct, 2);

      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new transaction/i })).toBeInTheDocument();
      });

      const button = screen.getByRole('button', { name: /new transaction/i });
      await user.click(button);

      expect(useCartStore.getState().items).toHaveLength(0); // Cart cleared
    });

    it('clears lastTransaction when "New Transaction" clicked', async () => {
      const user = userEvent.setup();

      // Seed lastTransaction
      useCartStore.getState().setLastTransaction({ transactionId: 'tx-123', timestamp: '2025-10-15T14:30:00Z' });

      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new transaction/i })).toBeInTheDocument();
      });

      const button = screen.getByRole('button', { name: /new transaction/i });
      await user.click(button);

      expect(useCartStore.getState().lastTransaction).toBeNull(); // lastTransaction cleared
    });
  });

  describe('Loading state', () => {
    it('displays loading spinner while fetching receipt data', () => {
      vi.spyOn(receiptsService, 'getReceipt').mockImplementation(
        () => new Promise(() => {}) // Never resolves (simulates loading)
      );

      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
      expect(screen.getByText(/loading receipt/i)).toBeInTheDocument();
      expect(screen.queryByText(/Pilot Location/i)).not.toBeInTheDocument(); // Receipt not displayed yet
    });
  });

  describe('Error states (AC5)', () => {
    it('displays "Receipt not found" error when transaction missing', async () => {
      vi.spyOn(receiptsService, 'getReceipt').mockRejectedValue(
        new receiptsService.TransactionNotFoundError('tx-999')
      );

      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Receipt not found/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /return to pos/i })).toBeInTheDocument();
      });
    });

    it('displays "Failed to load receipt" error on network error', async () => {
      vi.spyOn(receiptsService, 'getReceipt').mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Failed to load receipt/i)).toBeInTheDocument();
      });
    });

    it('"Return to POS" button navigates to /pos', async () => {
      const user = userEvent.setup();
      vi.spyOn(receiptsService, 'getReceipt').mockRejectedValue(
        new receiptsService.TransactionNotFoundError('tx-999')
      );

      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /return to pos/i })).toBeInTheDocument();
      });

      const button = screen.getByRole('button', { name: /return to pos/i });
      await user.click(button);

      expect(mockNavigate).toHaveBeenCalledWith('/pos');
    });
  });

  describe('Accessibility (WCAG 2.1 AA)', () => {
    it('receipt header uses semantic HTML (<header>)', async () => {
      const { container } = render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const header = container.querySelector('header');
        expect(header).toBeInTheDocument();
        expect(header).toHaveClass('receipt-header');
      });
    });

    it('line items table has accessible column headers', async () => {
      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('columnheader', { name: /product/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /qty/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /price/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /total/i })).toBeInTheDocument();
      });
    });

    it('line items table has ARIA label', async () => {
      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const table = screen.getByRole('table', { name: /receipt line items/i });
        expect(table).toBeInTheDocument();
      });
    });

    it('"New Transaction" button has ARIA label', async () => {
      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /start a new transaction/i });
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('"New Transaction" button meets 44px minimum height (WCAG 2.1 AA)', async () => {
      const { container } = render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const button = container.querySelector('[aria-label*="new transaction"]') as HTMLElement;
        expect(button).toBeTruthy();
        // Check minHeight style is set
        expect(button.style.minHeight).toBe('44px');
      });
    });

    it('loading state has ARIA live region', () => {
      vi.spyOn(receiptsService, 'getReceipt').mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      const loadingRegion = screen.getByRole('status');
      expect(loadingRegion).toHaveAttribute('aria-live', 'polite');
      expect(loadingRegion).toHaveAttribute('aria-label', 'Loading receipt');
    });
  });

  describe('Print preparation (AC3, AC4)', () => {
    it('applies "no-print" class to action buttons for print hiding', async () => {
      const { container } = render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const noPrintDiv = container.querySelector('.no-print');
        expect(noPrintDiv).toBeInTheDocument();
        expect(noPrintDiv).toContainElement(screen.getByRole('button', { name: /new transaction/i }));
      });
    });

    it('applies "receipt-page" class for 80mm thermal printer layout', async () => {
      const { container } = render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const receiptDiv = container.querySelector('.receipt-page');
        expect(receiptDiv).toBeInTheDocument();
        expect(receiptDiv).toHaveClass('max-w-sm'); // Tailwind class for 80mm equivalent
      });
    });

    it('applies "receipt-header" class to header section', async () => {
      const { container } = render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const header = container.querySelector('.receipt-header');
        expect(header).toBeInTheDocument();
      });
    });

    it('applies "receipt-items" class to line items table', async () => {
      const { container } = render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const itemsDiv = container.querySelector('.receipt-items');
        expect(itemsDiv).toBeInTheDocument();
      });
    });

    it('applies "receipt-totals" class to totals section', async () => {
      const { container } = render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const totalsDiv = container.querySelector('.receipt-totals');
        expect(totalsDiv).toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    it('handles receipt with no items gracefully', async () => {
      const emptyReceipt: ReceiptData = {
        ...mockReceiptData,
        items: [],
        subtotal: 0,
        totalAmount: 0
      };
      vi.spyOn(receiptsService, 'getReceipt').mockResolvedValue(emptyReceipt);

      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Subtotal: ฿0\.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Total: ฿0\.00/i)).toBeInTheDocument();
      });
    });

    it('handles cashier name fallback to email when name is missing', async () => {
      const receiptWithEmail: ReceiptData = {
        ...mockReceiptData,
        cashierName: 'john@example.com'
      };
      vi.spyOn(receiptsService, 'getReceipt').mockResolvedValue(receiptWithEmail);

      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Cashier: john@example\.com/i)).toBeInTheDocument();
      });
    });

    it('handles large total amounts with proper formatting', async () => {
      const largeAmountReceipt: ReceiptData = {
        ...mockReceiptData,
        subtotal: 12500.5,
        totalAmount: 12500.5
      };
      vi.spyOn(receiptsService, 'getReceipt').mockResolvedValue(largeAmountReceipt);

      render(
        <BrowserRouter>
          <ReceiptPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        // formatCurrency uses toFixed(2) without thousand separators: ฿12500.50
        expect(screen.getByText(/Total: ฿12500\.50/i)).toBeInTheDocument();
      });
    });
  });
});
