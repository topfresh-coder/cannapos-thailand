/**
 * Unit tests for useInventoryValidation hook
 *
 * Tests the useInventoryValidation hook for validating cart quantities
 * against available inventory from active product batches.
 *
 * @module hooks/useInventoryValidation.test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useInventoryValidation } from './useInventoryValidation';
import { supabase } from '@/lib/supabase';

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('useInventoryValidation Hook', () => {
  const mockProductId = 'test-product-123';
  const mockProduct = {
    id: mockProductId,
    sku: 'FLW001',
    name: 'Test Flower',
    category: 'Flower' as const,
    unit: 'gram' as const,
    base_price: 400,
    requires_tare_weight: true,
    reorder_threshold: 10,
    is_active: true,
    location_id: 'loc-123',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validates quantity within available inventory', () => {
    it('returns valid=true when requested quantity is within available inventory', async () => {
      // Mock Supabase response with 2 active batches (total: 23g)
      const mockBatches = [
        { quantity_remaining: 10 },
        { quantity_remaining: 13 },
      ];

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockBatches,
              error: null,
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useInventoryValidation());

      // Validate requesting 5g (within available 23g)
      const validation = await result.current.validateQuantity(mockProductId, 5, mockProduct);

      expect(validation.valid).toBe(true);
      expect(validation.availableQuantity).toBe(23);
      expect(validation.error).toBeUndefined();

      // Verify Supabase query was called correctly
      expect(supabase.from).toHaveBeenCalledWith('product_batches');
    });

    it('returns valid=true when requested quantity equals available inventory', async () => {
      // Mock Supabase response with 2 active batches (total: 23g)
      const mockBatches = [
        { quantity_remaining: 10 },
        { quantity_remaining: 13 },
      ];

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockBatches,
              error: null,
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useInventoryValidation());

      // Validate requesting exactly 23g (max available)
      const validation = await result.current.validateQuantity(mockProductId, 23, mockProduct);

      expect(validation.valid).toBe(true);
      expect(validation.availableQuantity).toBe(23);
      expect(validation.error).toBeUndefined();
    });
  });

  describe('rejects quantity exceeding available inventory', () => {
    it('returns valid=false with error message when requested quantity exceeds inventory', async () => {
      // Mock Supabase response with 2 active batches (total: 23g)
      const mockBatches = [
        { quantity_remaining: 10 },
        { quantity_remaining: 13 },
      ];

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockBatches,
              error: null,
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useInventoryValidation());

      // Validate requesting 100g (exceeds available 23g)
      const validation = await result.current.validateQuantity(mockProductId, 100, mockProduct);

      expect(validation.valid).toBe(false);
      expect(validation.availableQuantity).toBe(23);
      expect(validation.error).toBe('Only 23 gram available');
    });

    it('returns valid=false when requesting more than available (no product data)', async () => {
      // Mock Supabase response
      const mockBatches = [{ quantity_remaining: 5 }];

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockBatches,
              error: null,
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useInventoryValidation());

      // Validate without product data (should default to "units")
      const validation = await result.current.validateQuantity(mockProductId, 10);

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe('Only 5 units available');
    });
  });

  describe('calculates available quantity from active batches only', () => {
    it('sums quantity_remaining from all active batches', async () => {
      // Mock Supabase response with 3 active batches
      const mockBatches = [
        { quantity_remaining: 10 },
        { quantity_remaining: 5 },
        { quantity_remaining: 8 },
      ];

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockBatches,
              error: null,
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useInventoryValidation());

      const validation = await result.current.validateQuantity(mockProductId, 20);

      // Total: 10 + 5 + 8 = 23g
      expect(validation.valid).toBe(true);
      expect(validation.availableQuantity).toBe(23);
    });

    it('filters by status="Active" only', async () => {
      // The hook should only query batches where status = 'Active'
      // Depleted batches should NOT be included in the query
      const mockBatches = [
        { quantity_remaining: 10 }, // Active batch
      ];

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockBatches,
              error: null,
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useInventoryValidation());

      await result.current.validateQuantity(mockProductId, 5);

      // Verify the query filters by status = 'Active'
      const selectChain = (supabase.from as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(selectChain.select).toHaveBeenCalledWith('quantity_remaining');

      // Verify eq was called twice: once for product_id, once for status
      const eqChain1 = selectChain.select.mock.results[0].value;
      expect(eqChain1.eq).toHaveBeenCalledWith('product_id', mockProductId);

      const eqChain2 = eqChain1.eq.mock.results[0].value;
      expect(eqChain2.eq).toHaveBeenCalledWith('status', 'Active');
    });

    it('handles zero available quantity (no active batches)', async () => {
      // Mock Supabase response with no active batches
      const mockBatches: Array<{ quantity_remaining: number }> = [];

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockBatches,
              error: null,
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useInventoryValidation());

      const validation = await result.current.validateQuantity(mockProductId, 1);

      expect(validation.valid).toBe(false);
      expect(validation.availableQuantity).toBe(0);
      expect(validation.error).toContain('Only 0');
    });
  });

  describe('error handling', () => {
    it('handles Supabase query errors gracefully', async () => {
      // Mock Supabase error
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database connection error' },
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useInventoryValidation());

      const validation = await result.current.validateQuantity(mockProductId, 5);

      expect(validation.valid).toBe(false);
      expect(validation.availableQuantity).toBe(0);
      expect(validation.error).toBe('Unable to check inventory availability');
    });

    it('handles unexpected errors during validation', async () => {
      // Mock Supabase to throw an exception
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockRejectedValue(new Error('Network error')),
          }),
        }),
      });

      const { result } = renderHook(() => useInventoryValidation());

      const validation = await result.current.validateQuantity(mockProductId, 5);

      expect(validation.valid).toBe(false);
      expect(validation.availableQuantity).toBe(0);
      expect(validation.error).toBe('Unexpected error checking inventory');
    });
  });

  describe('isValidating state', () => {
    it('sets isValidating to true during validation and false after', async () => {
      const mockBatches = [{ quantity_remaining: 10 }];

      // Create a promise we can control
      let resolveQuery: (value: { data: Array<{ quantity_remaining: number }>; error: null }) => void;
      const queryPromise = new Promise<{ data: Array<{ quantity_remaining: number }>; error: null }>((resolve) => {
        resolveQuery = resolve;
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue(queryPromise),
          }),
        }),
      });

      const { result } = renderHook(() => useInventoryValidation());

      // Initially not validating
      expect(result.current.isValidating).toBe(false);

      // Start validation (don't await yet)
      const validationPromise = result.current.validateQuantity(mockProductId, 5);

      // Should be validating during the query
      await waitFor(() => {
        expect(result.current.isValidating).toBe(true);
      });

      // Resolve the query
      resolveQuery!({
        data: mockBatches,
        error: null,
      });

      // Wait for validation to complete
      await validationPromise;

      // Should not be validating after completion
      await waitFor(() => {
        expect(result.current.isValidating).toBe(false);
      });
    });
  });
});
