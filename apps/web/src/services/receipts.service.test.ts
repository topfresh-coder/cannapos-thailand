/**
 * Receipts Service Tests
 *
 * Integration tests for receipt data fetching from Supabase.
 * Tests query construction, data mapping, and error handling.
 *
 * @see Story 1.8 - Receipt Display & Print Preparation
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getReceipt, TransactionNotFoundError } from './receipts.service';
import { supabase } from '@/lib/supabase';

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn()
  }
}));

describe('Receipts Service - Story 1.8', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getReceipt', () => {
    it('returns ReceiptData with all required fields', async () => {
      const mockTransaction = {
        id: 'tx-123',
        transaction_date: '2025-10-15T14:30:00Z',
        total_amount: 1525,
        payment_method: 'Cash',
        users: { name: 'John Doe', email: 'john@test.com' },
        locations: { name: 'Pilot Location - Bangkok' },
        transaction_items: [
          {
            id: 'item-1',
            quantity: 3.5,
            unit_price: 350,
            line_total: 1225,
            products: { name: 'Blue Dream Flower', sku: 'FLW001', unit: 'gram' }
          },
          {
            id: 'item-2',
            quantity: 2,
            unit_price: 150,
            line_total: 300,
            products: { name: 'Pre-Roll', sku: 'PR001', unit: 'piece' }
          }
        ]
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockTransaction, error: null })
      } as any);

      const result = await getReceipt('tx-123');

      expect(result).toEqual({
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
      });
    });

    it('calls Supabase with correct query structure (JOIN transactions + items + products)', async () => {
      const mockTransaction = {
        id: 'tx-123',
        transaction_date: '2025-10-15T14:30:00Z',
        total_amount: 1000,
        payment_method: 'Cash',
        users: { name: 'Jane Doe', email: 'jane@test.com' },
        locations: { name: 'Test Location' },
        transaction_items: []
      };

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockTransaction, error: null })
      });

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      await getReceipt('tx-123');

      // Verify Supabase query chain
      expect(supabase.from).toHaveBeenCalledWith('transactions');
      expect(mockFrom().select).toHaveBeenCalledWith(expect.stringContaining('users!'));
      expect(mockFrom().select).toHaveBeenCalledWith(expect.stringContaining('locations!'));
      expect(mockFrom().select).toHaveBeenCalledWith(expect.stringContaining('transaction_items'));
      expect(mockFrom().select).toHaveBeenCalledWith(expect.stringContaining('products!'));
      expect(mockFrom().eq).toHaveBeenCalledWith('id', 'tx-123');
      expect(mockFrom().single).toHaveBeenCalled();
    });

    it('maps nested Supabase data correctly (flattens nested objects)', async () => {
      const mockTransaction = {
        id: 'tx-456',
        transaction_date: '2025-10-15T16:00:00Z',
        total_amount: 500,
        payment_method: 'Card',
        users: { name: null, email: 'test@example.com' }, // No name, fallback to email
        locations: { name: 'Test Location 2' },
        transaction_items: [
          {
            id: 'item-1',
            quantity: 1,
            unit_price: 500,
            line_total: 500,
            products: { name: 'Edible', sku: 'EDI001', unit: 'piece' }
          }
        ]
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockTransaction, error: null })
      } as any);

      const result = await getReceipt('tx-456');

      expect(result.cashierName).toBe('test@example.com'); // Fallback to email
      expect(result.locationName).toBe('Test Location 2');
      expect(result.items).toHaveLength(1);
      expect(result.items[0].productName).toBe('Edible');
      expect(result.items[0].sku).toBe('EDI001');
      expect(result.items[0].unit).toBe('piece');
    });

    it('handles fallback to "Unknown Location" when location name is null', async () => {
      const mockTransaction = {
        id: 'tx-789',
        transaction_date: '2025-10-15T17:00:00Z',
        total_amount: 100,
        payment_method: 'Cash',
        users: { name: 'Test User', email: 'user@test.com' },
        locations: null, // Missing location
        transaction_items: []
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockTransaction, error: null })
      } as any);

      const result = await getReceipt('tx-789');

      expect(result.locationName).toBe('Unknown Location');
    });

    it('handles fallback to "Unknown Cashier" when user data is missing', async () => {
      const mockTransaction = {
        id: 'tx-999',
        transaction_date: '2025-10-15T18:00:00Z',
        total_amount: 100,
        payment_method: 'Cash',
        users: null, // Missing user
        locations: { name: 'Test Location' },
        transaction_items: []
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockTransaction, error: null })
      } as any);

      const result = await getReceipt('tx-999');

      expect(result.cashierName).toBe('Unknown Cashier');
    });

    it('throws TransactionNotFoundError when transaction does not exist', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
      } as any);

      await expect(getReceipt('tx-nonexistent')).rejects.toThrow(TransactionNotFoundError);
      await expect(getReceipt('tx-nonexistent')).rejects.toThrow('Transaction not found: tx-nonexistent');
    });

    it('throws TransactionNotFoundError when Supabase returns error', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database connection error' }
        })
      } as any);

      await expect(getReceipt('tx-123')).rejects.toThrow(TransactionNotFoundError);
    });

    it('handles multiple line items correctly', async () => {
      const mockTransaction = {
        id: 'tx-multi',
        transaction_date: '2025-10-15T19:00:00Z',
        total_amount: 2000,
        payment_method: 'QR Code',
        users: { name: 'Multi Item User', email: 'multi@test.com' },
        locations: { name: 'Multi Location' },
        transaction_items: [
          {
            id: 'item-1',
            quantity: 5,
            unit_price: 200,
            line_total: 1000,
            products: { name: 'Product 1', sku: 'SKU1', unit: 'gram' }
          },
          {
            id: 'item-2',
            quantity: 3,
            unit_price: 250,
            line_total: 750,
            products: { name: 'Product 2', sku: 'SKU2', unit: 'piece' }
          },
          {
            id: 'item-3',
            quantity: 1,
            unit_price: 250,
            line_total: 250,
            products: { name: 'Product 3', sku: 'SKU3', unit: 'piece' }
          }
        ]
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockTransaction, error: null })
      } as any);

      const result = await getReceipt('tx-multi');

      expect(result.items).toHaveLength(3);
      expect(result.items[0].productName).toBe('Product 1');
      expect(result.items[1].productName).toBe('Product 2');
      expect(result.items[2].productName).toBe('Product 3');
      expect(result.totalAmount).toBe(2000);
    });

    it('preserves decimal precision in quantities and prices', async () => {
      const mockTransaction = {
        id: 'tx-decimal',
        transaction_date: '2025-10-15T20:00:00Z',
        total_amount: 437.5,
        payment_method: 'Cash',
        users: { name: 'Decimal User', email: 'decimal@test.com' },
        locations: { name: 'Decimal Location' },
        transaction_items: [
          {
            id: 'item-1',
            quantity: 1.25, // Decimal quantity (flower)
            unit_price: 350,
            line_total: 437.5,
            products: { name: 'Flower Product', sku: 'FLW-DEC', unit: 'gram' }
          }
        ]
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockTransaction, error: null })
      } as any);

      const result = await getReceipt('tx-decimal');

      expect(result.items[0].quantity).toBe(1.25);
      expect(result.items[0].unitPrice).toBe(350);
      expect(result.items[0].lineTotal).toBe(437.5);
      expect(result.totalAmount).toBe(437.5);
    });

    it('returns correct PaymentMethod type (Cash, Card, QR Code)', async () => {
      const paymentMethods = ['Cash', 'Card', 'QR Code'];

      for (const method of paymentMethods) {
        const mockTransaction = {
          id: `tx-${method}`,
          transaction_date: '2025-10-15T21:00:00Z',
          total_amount: 100,
          payment_method: method,
          users: { name: 'Test', email: 'test@test.com' },
          locations: { name: 'Test' },
          transaction_items: []
        };

        vi.mocked(supabase.from).mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockTransaction, error: null })
        } as any);

        const result = await getReceipt(`tx-${method}`);

        expect(result.paymentMethod).toBe(method);
      }
    });
  });

  describe('TransactionNotFoundError', () => {
    it('has correct error name and message', () => {
      const error = new TransactionNotFoundError('tx-test');

      expect(error.name).toBe('TransactionNotFoundError');
      expect(error.message).toBe('Transaction not found: tx-test');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TransactionNotFoundError);
    });
  });
});
