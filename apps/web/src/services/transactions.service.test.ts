/**
 * Unit Tests for Transaction Service
 *
 * Tests the transaction service layer with mocked Supabase client.
 * Covers:
 * - createTransaction() function
 * - allocateInventoryLIFO() function (LIFO batch allocation)
 * - validateInventoryAvailability() function
 *
 * Story 1.7 - Task 10: Unit Tests
 */

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import {
  createTransaction,
  InventoryValidationError,
  type CreateTransactionRequest,
} from './transactions.service';
import type { Tables } from '@/types/supabase';
import type { CartItem } from '@/stores/cartStore';

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Import mocked supabase after mock
import { supabase } from '@/lib/supabase';

// Mock types
type Product = Tables<'products'>;
type Transaction = Tables<'transactions'>;
type TransactionItem = Tables<'transaction_items'>;

// Mock test data
const mockProduct: Product = {
  id: 'prod-123',
  sku: 'FLW001',
  name: 'Test Flower',
  category: 'Flower',
  unit: 'gram',
  base_price: 400.0,
  requires_tare_weight: true,
  reorder_threshold: 10,
  is_active: true,
  location_id: 'loc-123',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

const mockCartItem: CartItem = {
  product: mockProduct,
  quantity: 5,
  unitPrice: 400,
  lineTotal: 2000,
};

const mockTransactionRequest: CreateTransactionRequest = {
  user_id: 'user-123',
  location_id: 'loc-123',
  shift_id: 'shift-123',
  total_amount: 2000,
  payment_method: 'Cash',
};

const mockTransaction: Transaction = {
  id: 'tx-123',
  user_id: 'user-123',
  location_id: 'loc-123',
  shift_id: 'shift-123',
  total_amount: 2000,
  payment_method: 'Cash',
  transaction_date: '2025-01-15T10:30:00Z',
  created_at: '2025-01-15T10:30:00Z',
  updated_at: '2025-01-15T10:30:00Z',
};

const mockTransactionItem: TransactionItem = {
  id: 'tx-item-123',
  transaction_id: 'tx-123',
  product_id: 'prod-123',
  quantity: 5,
  unit_price: 400,
  line_total: 2000,
  tier_id: null,
  gross_weight: null,
  tare_weight: null,
  override_price: null,
  override_reason: null,
  batch_allocations: [] as any,
  created_at: '2025-01-15T10:30:00Z',
};

describe('Transaction Service - Story 1.7', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('creates transaction record with correct fields', async () => {
      // Mock Supabase chain - need to handle multiple calls to product_batches table
      let productBatchesCallCount = 0;

      (supabase.from as Mock).mockImplementation((table: string) => {
        if (table === 'product_batches') {
          productBatchesCallCount++;

          // First call: inventory validation (select + eq + eq)
          if (productBatchesCallCount === 1) {
            const eqChain = {
              eq: vi.fn().mockResolvedValue({
                data: [{ quantity_remaining: 20 }],
                error: null,
              }),
            };

            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue(eqChain),
              }),
            };
          }

          // Second call: LIFO allocation (select + eq + eq + order)
          if (productBatchesCallCount === 2) {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockResolvedValue({
                data: [
                  {
                    id: 'batch-1',
                    quantity_remaining: 20,
                    cost_per_unit: 220,
                    received_date: '2025-01-10',
                  },
                ],
                error: null,
              }),
            };
          }

          // Third+ calls: batch updates (update + eq)
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          };
        } else if (table === 'transactions') {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockTransaction,
                  error: null,
                }),
              }),
            }),
          };
        } else if (table === 'transaction_items') {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockTransactionItem,
                  error: null,
                }),
              }),
            }),
          };
        }

        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        };
      });

      const result = await createTransaction(mockTransactionRequest, [mockCartItem]);

      expect(result.transaction.id).toBe('tx-123');
      expect(result.transaction.total_amount).toBe(2000);
      expect(result.transaction.payment_method).toBe('Cash');
      expect(supabase.from).toHaveBeenCalledWith('transactions');
    });

    it('throws error when transaction insert fails', async () => {
      // Mock Supabase chain for inventory validation (success)
      (supabase.from as Mock).mockImplementation((table: string) => {
        if (table === 'product_batches') {
          const eqChain = {
            eq: vi.fn().mockResolvedValue({
              data: [{ quantity_remaining: 20 }],
              error: null,
            }),
          };

          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue(eqChain),
            }),
          };
        } else if (table === 'transactions') {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Database error' },
                }),
              }),
            }),
          };
        }

        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        };
      });

      await expect(createTransaction(mockTransactionRequest, [mockCartItem])).rejects.toThrow(
        'Failed to create transaction: Database error'
      );
    });

    it('validates inventory availability before creating transaction', async () => {
      // Mock insufficient inventory
      (supabase.from as Mock).mockImplementation((table: string) => {
        if (table === 'product_batches') {
          const eqChain = {
            eq: vi.fn().mockResolvedValue({
              data: [{ quantity_remaining: 2 }], // Only 2g available, need 5g
              error: null,
            }),
          };

          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue(eqChain),
            }),
          };
        }

        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        };
      });

      await expect(createTransaction(mockTransactionRequest, [mockCartItem])).rejects.toThrow(
        InventoryValidationError
      );

      // Transaction table should NOT be called (validation failed first)
      const transactionCalls = (supabase.from as Mock).mock.calls.filter(
        (call) => call[0] === 'transactions'
      );
      expect(transactionCalls).toHaveLength(0);
    });

    it('creates transaction_items for each cart item', async () => {
      let transactionItemInsertCalled = false;
      let productBatchesCallCount = 0;

      (supabase.from as Mock).mockImplementation((table: string) => {
        if (table === 'product_batches') {
          productBatchesCallCount++;

          // First call: inventory validation
          if (productBatchesCallCount === 1) {
            const eqChain = {
              eq: vi.fn().mockResolvedValue({
                data: [{ quantity_remaining: 20 }],
                error: null,
              }),
            };

            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue(eqChain),
              }),
            };
          }

          // Second call: LIFO allocation
          if (productBatchesCallCount === 2) {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockResolvedValue({
                data: [
                  {
                    id: 'batch-1',
                    quantity_remaining: 20,
                    cost_per_unit: 220,
                    received_date: '2025-01-10',
                  },
                ],
                error: null,
              }),
            };
          }

          // Third+ calls: batch updates
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          };
        } else if (table === 'transactions') {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockTransaction,
                  error: null,
                }),
              }),
            }),
          };
        } else if (table === 'transaction_items') {
          transactionItemInsertCalled = true;
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockTransactionItem,
                  error: null,
                }),
              }),
            }),
          };
        }

        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        };
      });

      await createTransaction(mockTransactionRequest, [mockCartItem]);

      expect(transactionItemInsertCalled).toBe(true);
    });
  });

  describe('validateInventoryAvailability', () => {
    it('returns success when all products have sufficient inventory', async () => {
      (supabase.from as Mock).mockImplementation((table: string) => {
        if (table === 'product_batches') {
          const eqChain = {
            eq: vi.fn().mockResolvedValue({
              data: [{ quantity_remaining: 20 }],
              error: null,
            }),
          };

          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue(eqChain),
            }),
          };
        }

        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        };
      });

      // Import the actual transactionService to test validateInventoryAvailability
      const { transactionService } = await import('./transactions.service');

      await expect(
        transactionService.validateInventoryAvailability([mockCartItem])
      ).resolves.not.toThrow();
    });

    it('throws InventoryValidationError when inventory insufficient', async () => {
      (supabase.from as Mock).mockImplementation((table: string) => {
        if (table === 'product_batches') {
          const eqChain = {
            eq: vi.fn().mockResolvedValue({
              data: [{ quantity_remaining: 2 }], // Only 2g available
              error: null,
            }),
          };

          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue(eqChain),
            }),
          };
        }

        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        };
      });

      const { transactionService } = await import('./transactions.service');

      const cartItem: CartItem = {
        ...mockCartItem,
        product: { ...mockProduct, name: 'Test Flower' },
        quantity: 5, // Requesting 5g
      };

      await expect(transactionService.validateInventoryAvailability([cartItem])).rejects.toThrow(
        'Insufficient inventory for Test Flower. Only 2 gram available.'
      );
    });

    it('throws InventoryValidationError with correct properties', async () => {
      (supabase.from as Mock).mockImplementation((table: string) => {
        if (table === 'product_batches') {
          const eqChain = {
            eq: vi.fn().mockResolvedValue({
              data: [{ quantity_remaining: 2 }],
              error: null,
            }),
          };

          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue(eqChain),
            }),
          };
        }

        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        };
      });

      const { transactionService } = await import('./transactions.service');

      try {
        await transactionService.validateInventoryAvailability([mockCartItem]);
        expect.fail('Should have thrown InventoryValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(InventoryValidationError);
        if (error instanceof InventoryValidationError) {
          expect(error.productName).toBe('Test Flower');
          expect(error.availableQuantity).toBe(2);
          expect(error.requestedQuantity).toBe(5);
          expect(error.unit).toBe('gram');
        }
      }
    });

    it('validates multiple cart items correctly', async () => {
      const mockProduct2: Product = {
        ...mockProduct,
        id: 'prod-456',
        name: 'Test Pre-Roll',
        unit: 'piece',
      };

      const mockCartItem2: CartItem = {
        product: mockProduct2,
        quantity: 3,
        unitPrice: 150,
        lineTotal: 450,
      };

      (supabase.from as Mock).mockImplementation((table: string) => {
        if (table === 'product_batches') {
          const eqChain = {
            eq: vi.fn().mockResolvedValue({
              data: [{ quantity_remaining: 20 }], // Sufficient for both
              error: null,
            }),
          };

          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue(eqChain),
            }),
          };
        }

        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        };
      });

      const { transactionService } = await import('./transactions.service');

      await expect(
        transactionService.validateInventoryAvailability([mockCartItem, mockCartItem2])
      ).resolves.not.toThrow();
    });
  });

  describe('allocateInventoryLIFO', () => {
    it('allocates from newest batch first (LIFO)', async () => {
      const batches = [
        {
          id: 'batch-new',
          received_date: '2025-01-10',
          quantity_remaining: 20,
          cost_per_unit: 220,
        },
        {
          id: 'batch-old',
          received_date: '2025-01-05',
          quantity_remaining: 10,
          cost_per_unit: 200,
        },
      ];

      (supabase.from as Mock).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: batches, error: null }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      });

      const { transactionService } = await import('./transactions.service');
      const allocations = await transactionService.allocateInventoryLIFO('prod-1', 5);

      expect(allocations).toHaveLength(1);
      expect(allocations[0].batch_id).toBe('batch-new'); // Newest first (LIFO)
      expect(allocations[0].quantity_allocated).toBe(5);
      expect(allocations[0].cost_per_unit).toBe(220);
    });

    it('depletes newest batch and moves to next batch when needed', async () => {
      const batches = [
        {
          id: 'batch-new',
          received_date: '2025-01-10',
          quantity_remaining: 3,
          cost_per_unit: 220,
        },
        {
          id: 'batch-old',
          received_date: '2025-01-05',
          quantity_remaining: 10,
          cost_per_unit: 200,
        },
      ];

      (supabase.from as Mock).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: batches, error: null }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      });

      const { transactionService } = await import('./transactions.service');
      const allocations = await transactionService.allocateInventoryLIFO('prod-1', 8);

      expect(allocations).toHaveLength(2);
      expect(allocations[0].batch_id).toBe('batch-new');
      expect(allocations[0].quantity_allocated).toBe(3); // Fully depleted
      expect(allocations[1].batch_id).toBe('batch-old');
      expect(allocations[1].quantity_allocated).toBe(5); // Remaining from next batch
    });

    it('throws error when insufficient inventory', async () => {
      const batches = [
        {
          id: 'batch-1',
          received_date: '2025-01-10',
          quantity_remaining: 5,
          cost_per_unit: 220,
        },
      ];

      (supabase.from as Mock).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: batches, error: null }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      });

      const { transactionService } = await import('./transactions.service');

      await expect(transactionService.allocateInventoryLIFO('prod-1', 10)).rejects.toThrow(
        'Insufficient inventory'
      );
    });

    it('updates quantity_remaining for allocated batches', async () => {
      const batches = [
        {
          id: 'batch-1',
          received_date: '2025-01-10',
          quantity_remaining: 10,
          cost_per_unit: 220,
        },
      ];

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      (supabase.from as Mock).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: batches, error: null }),
        update: mockUpdate,
      });

      const { transactionService } = await import('./transactions.service');
      await transactionService.allocateInventoryLIFO('prod-1', 5);

      expect(mockUpdate).toHaveBeenCalledWith({ quantity_remaining: 5 }); // 10 - 5
    });

    it('throws error when no active batches found', async () => {
      (supabase.from as Mock).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      });

      const { transactionService } = await import('./transactions.service');

      await expect(transactionService.allocateInventoryLIFO('prod-1', 5)).rejects.toThrow(
        'No active batches found for product prod-1'
      );
    });

    it('throws error when query batches fails', async () => {
      (supabase.from as Mock).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Query error' } }),
      });

      const { transactionService } = await import('./transactions.service');

      await expect(transactionService.allocateInventoryLIFO('prod-1', 5)).rejects.toThrow(
        'Failed to query batches: Query error'
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles zero quantity cart items gracefully', async () => {
      const zeroQuantityItem: CartItem = {
        ...mockCartItem,
        quantity: 0,
        lineTotal: 0,
      };

      (supabase.from as Mock).mockImplementation((table: string) => {
        if (table === 'product_batches') {
          const eqChain = {
            eq: vi.fn().mockResolvedValue({
              data: [{ quantity_remaining: 20 }],
              error: null,
            }),
          };

          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue(eqChain),
            }),
          };
        }

        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        };
      });

      const { transactionService } = await import('./transactions.service');

      // Should not throw error for zero quantity
      await expect(
        transactionService.validateInventoryAvailability([zeroQuantityItem])
      ).resolves.not.toThrow();
    });

    it('handles empty cart items array', async () => {
      const { transactionService } = await import('./transactions.service');

      // Empty cart should not throw error
      await expect(transactionService.validateInventoryAvailability([])).resolves.not.toThrow();
    });

    it('handles batch update failure during allocation', async () => {
      const batches = [
        {
          id: 'batch-1',
          received_date: '2025-01-10',
          quantity_remaining: 10,
          cost_per_unit: 220,
        },
      ];

      (supabase.from as Mock).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: batches, error: null }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: { message: 'Update failed' } }),
        }),
      });

      const { transactionService } = await import('./transactions.service');

      await expect(transactionService.allocateInventoryLIFO('prod-1', 5)).rejects.toThrow(
        'Failed to update batch batch-1: Update failed'
      );
    });
  });
});
