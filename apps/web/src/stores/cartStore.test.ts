// apps/web/src/stores/cartStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './cartStore';
import type { Tables } from '@/types/supabase';

// Mock Product type
type Product = Tables<'products'>;

// Mock product data for testing
const mockProduct: Product = {
  id: 'prod-123',
  sku: 'FLW001',
  name: 'Test Product',
  category: 'Flower',
  unit: 'gram',
  base_price: 400.0,
  requires_tare_weight: false,
  reorder_threshold: 10,
  is_active: true,
  location_id: 'loc-123',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

const mockProduct2: Product = {
  id: 'prod-456',
  sku: 'PRE001',
  name: 'Test Pre-Roll',
  category: 'Pre-Roll',
  unit: 'piece',
  base_price: 150.0,
  requires_tare_weight: false,
  reorder_threshold: 20,
  is_active: true,
  location_id: 'loc-123',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

describe('Cart Store', () => {
  beforeEach(() => {
    // Clear cart before each test
    useCartStore.getState().clear();
  });

  describe('addItem', () => {
    it('adds item to cart with default quantity 1', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct);

      const currentItems = useCartStore.getState().items;

      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].quantity).toBe(1);
      expect(currentItems[0].product.id).toBe(mockProduct.id);
      expect(currentItems[0].unitPrice).toBe(mockProduct.base_price);
      expect(currentItems[0].lineTotal).toBe(mockProduct.base_price);
    });

    it('adds item to cart with specified quantity', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 3);

      const currentItems = useCartStore.getState().items;

      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].quantity).toBe(3);
      expect(currentItems[0].lineTotal).toBe(mockProduct.base_price * 3);
    });

    it('increases quantity if product already in cart', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct);

      const currentItems = useCartStore.getState().items;

      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].quantity).toBe(2);
      expect(currentItems[0].lineTotal).toBe(mockProduct.base_price * 2);
    });

    it('adds multiple units when product already exists', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 2);
      addItem(mockProduct, 3);

      const currentItems = useCartStore.getState().items;

      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].quantity).toBe(5);
      expect(currentItems[0].lineTotal).toBe(mockProduct.base_price * 5);
    });

    it('adds different products as separate cart items', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct2);

      const currentItems = useCartStore.getState().items;

      expect(currentItems).toHaveLength(2);
      expect(currentItems[0].product.id).toBe(mockProduct.id);
      expect(currentItems[1].product.id).toBe(mockProduct2.id);
    });

    it('calculates line total correctly', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 2);

      const currentItems = useCartStore.getState().items;

      expect(currentItems[0].lineTotal).toBe(mockProduct.base_price * 2);
      expect(currentItems[0].lineTotal).toBe(800.0);
    });

    it('preserves product data in cart item', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct);

      const currentItems = useCartStore.getState().items;

      expect(currentItems[0].product).toEqual(mockProduct);
      expect(currentItems[0].product.name).toBe('Test Product');
      expect(currentItems[0].product.sku).toBe('FLW001');
      expect(currentItems[0].product.category).toBe('Flower');
    });
  });

  describe('removeItem', () => {
    it('removes item from cart by product ID', () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockProduct);
      removeItem(mockProduct.id);

      const currentItems = useCartStore.getState().items;

      expect(currentItems).toHaveLength(0);
    });

    it('removes only specified item when multiple items exist', () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct2);
      removeItem(mockProduct.id);

      const currentItems = useCartStore.getState().items;

      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].product.id).toBe(mockProduct2.id);
    });

    it('does nothing when removing non-existent product', () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockProduct);
      removeItem('non-existent-id');

      const currentItems = useCartStore.getState().items;

      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].product.id).toBe(mockProduct.id);
    });

    it('handles removing from empty cart gracefully', () => {
      const { removeItem } = useCartStore.getState();
      removeItem(mockProduct.id);

      const currentItems = useCartStore.getState().items;

      expect(currentItems).toHaveLength(0);
    });
  });

  describe('updateQuantity', () => {
    it('updates quantity correctly', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct);
      updateQuantity(mockProduct.id, 5);

      const currentItems = useCartStore.getState().items;

      expect(currentItems[0].quantity).toBe(5);
      expect(currentItems[0].lineTotal).toBe(mockProduct.base_price * 5);
    });

    it('recalculates line total when quantity updated', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 2);
      updateQuantity(mockProduct.id, 10);

      const currentItems = useCartStore.getState().items;

      expect(currentItems[0].lineTotal).toBe(4000.0); // 400 * 10
    });

    it('updates only specified item when multiple items exist', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 2);
      addItem(mockProduct2, 3);
      updateQuantity(mockProduct.id, 7);

      const currentItems = useCartStore.getState().items;

      expect(currentItems[0].quantity).toBe(7);
      expect(currentItems[1].quantity).toBe(3); // Unchanged
    });

    it('does nothing when updating non-existent product', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 2);
      updateQuantity('non-existent-id', 5);

      const currentItems = useCartStore.getState().items;

      expect(currentItems[0].quantity).toBe(2); // Unchanged
    });

    it('enforces minimum quantity of 1 (Story 1.6 AC7)', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 5);
      updateQuantity(mockProduct.id, 0);

      const currentItems = useCartStore.getState().items;
      const validationErrors = useCartStore.getState().validationErrors;

      // Story 1.6 AC7: Reject zero/negative, keep current quantity, set validation error
      expect(currentItems[0].quantity).toBe(5); // Quantity unchanged
      expect(validationErrors[mockProduct.id]).toContain('at least 1');
    });

    it('rejects negative quantities (Story 1.6 AC7)', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 5);
      updateQuantity(mockProduct.id, -1);

      const currentItems = useCartStore.getState().items;
      const validationErrors = useCartStore.getState().validationErrors;

      // Quantity should remain unchanged
      expect(currentItems[0].quantity).toBe(5);
      // Should set validation error
      expect(validationErrors[mockProduct.id]).toBeTruthy();
    });

    it('rounds flower product quantities to 1 decimal place (Story 1.6 AC6)', () => {
      const flowerProduct: Product = {
        ...mockProduct,
        id: 'prod-flower',
        requires_tare_weight: true, // Flower product
        category: 'Flower',
        unit: 'gram',
      };

      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(flowerProduct, 1);
      updateQuantity(flowerProduct.id, 3.567); // More than 1 decimal place

      const currentItems = useCartStore.getState().items;

      // Should round to 1 decimal place: 3.567 → 3.6
      expect(currentItems[0].quantity).toBe(3.6);
      expect(currentItems[0].lineTotal).toBe(flowerProduct.base_price * 3.6);
    });

    it('enforces integer quantities for non-flower products (Story 1.6 AC6)', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct2, 1); // Non-flower product (Pre-Roll)
      updateQuantity(mockProduct2.id, 3.5); // Decimal quantity

      const currentItems = useCartStore.getState().items;

      // Should round to integer: 3.5 → 4
      expect(currentItems[0].quantity).toBe(4);
      expect(currentItems[0].lineTotal).toBe(mockProduct2.base_price * 4);
    });
  });

  describe('Story 1.6 - Validation Error State', () => {
    it('sets validation error when quantity is below minimum', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 2);
      updateQuantity(mockProduct.id, 0);

      const validationErrors = useCartStore.getState().validationErrors;
      expect(validationErrors[mockProduct.id]).toContain('at least 1');
    });

    it('clears validation error when quantity is valid', () => {
      const { addItem, updateQuantity, setValidationError } = useCartStore.getState();
      addItem(mockProduct, 2);

      // Set error
      setValidationError(mockProduct.id, 'Test error');
      expect(useCartStore.getState().validationErrors[mockProduct.id]).toBe('Test error');

      // Update with valid quantity should clear error
      updateQuantity(mockProduct.id, 5);
      expect(useCartStore.getState().validationErrors[mockProduct.id]).toBeNull();
    });

    it('removes validation error when item is removed', () => {
      const { addItem, setValidationError, removeItem } = useCartStore.getState();
      addItem(mockProduct, 2);

      // Set error
      setValidationError(mockProduct.id, 'Test error');
      expect(useCartStore.getState().validationErrors[mockProduct.id]).toBe('Test error');

      // Remove item
      removeItem(mockProduct.id);

      // Error should be removed
      const validationErrors = useCartStore.getState().validationErrors;
      expect(validationErrors[mockProduct.id]).toBeUndefined();
    });
  });

  describe('Story 1.6 - Cart Persistence (AC8)', () => {
    it('persists cart to localStorage when items added', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 2);

      const saved = JSON.parse(localStorage.getItem('cannapos-cart') || '{}');
      expect(saved.state.items).toHaveLength(1);
      expect(saved.state.items[0].product.id).toBe(mockProduct.id);
      expect(saved.state.items[0].quantity).toBe(2);
    });

    it('persists cart to localStorage when quantity updated', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 2);
      updateQuantity(mockProduct.id, 5);

      const saved = JSON.parse(localStorage.getItem('cannapos-cart') || '{}');
      expect(saved.state.items[0].quantity).toBe(5);
    });

    it('persists cart to localStorage when item removed', () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockProduct, 2);
      addItem(mockProduct2, 3);
      removeItem(mockProduct.id);

      const saved = JSON.parse(localStorage.getItem('cannapos-cart') || '{}');
      expect(saved.state.items).toHaveLength(1);
      expect(saved.state.items[0].product.id).toBe(mockProduct2.id);
    });

    it('persists cart state across store mutations', () => {
      const { clear, addItem, updateQuantity } = useCartStore.getState();
      clear();

      // Add item and verify it persists
      addItem(mockProduct, 3);
      let saved = JSON.parse(localStorage.getItem('cannapos-cart') || '{}');
      expect(saved.state.items).toHaveLength(1);
      expect(saved.state.items[0].quantity).toBe(3);

      // Update quantity and verify it persists
      updateQuantity(mockProduct.id, 5);
      saved = JSON.parse(localStorage.getItem('cannapos-cart') || '{}');
      expect(saved.state.items[0].quantity).toBe(5);

      // Clear and verify empty state persists
      clear();
      saved = JSON.parse(localStorage.getItem('cannapos-cart') || '{}');
      expect(saved.state.items).toHaveLength(0);
    });
  });

  describe('getSubtotal', () => {
    it('returns 0 for empty cart', () => {
      const { getSubtotal } = useCartStore.getState();

      expect(getSubtotal()).toBe(0);
    });

    it('calculates subtotal for single item', () => {
      const { addItem, getSubtotal } = useCartStore.getState();
      addItem(mockProduct, 2);

      expect(getSubtotal()).toBe(800.0); // 400 * 2
    });

    it('calculates subtotal across all items', () => {
      const { addItem, getSubtotal } = useCartStore.getState();
      addItem(mockProduct, 2); // 400 * 2 = 800
      addItem(mockProduct2, 3); // 150 * 3 = 450

      expect(getSubtotal()).toBe(1250.0); // 800 + 450
    });

    it('updates subtotal when quantity changed', () => {
      const { addItem, updateQuantity, getSubtotal } = useCartStore.getState();
      addItem(mockProduct, 2); // 800

      expect(getSubtotal()).toBe(800.0);

      updateQuantity(mockProduct.id, 5); // 2000

      expect(getSubtotal()).toBe(2000.0);
    });

    it('updates subtotal when item removed', () => {
      const { addItem, removeItem, getSubtotal } = useCartStore.getState();
      addItem(mockProduct, 2); // 800
      addItem(mockProduct2, 3); // 450

      expect(getSubtotal()).toBe(1250.0);

      removeItem(mockProduct.id);

      expect(getSubtotal()).toBe(450.0);
    });

    it('handles decimal prices correctly', () => {
      const decimalProduct: Product = {
        ...mockProduct,
        id: 'prod-decimal',
        base_price: 99.99,
      };

      const { addItem, getSubtotal } = useCartStore.getState();
      addItem(decimalProduct, 3);

      // Use toBeCloseTo for floating point comparison
      expect(getSubtotal()).toBeCloseTo(299.97, 2); // 99.99 * 3, rounded to 2 decimals
    });
  });

  describe('clear', () => {
    it('clears all items from cart', () => {
      const { addItem, clear } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct2);
      clear();

      const currentItems = useCartStore.getState().items;

      expect(currentItems).toHaveLength(0);
    });

    it('resets subtotal to 0 after clearing', () => {
      const { addItem, clear, getSubtotal } = useCartStore.getState();
      addItem(mockProduct, 5);

      expect(getSubtotal()).toBe(2000.0);

      clear();

      expect(getSubtotal()).toBe(0);
    });

    it('handles clearing empty cart gracefully', () => {
      const { clear } = useCartStore.getState();
      clear();

      const currentItems = useCartStore.getState().items;

      expect(currentItems).toHaveLength(0);
    });

    it('allows adding items after clearing', () => {
      const { addItem, clear } = useCartStore.getState();
      addItem(mockProduct);
      clear();
      addItem(mockProduct2, 3);

      const currentItems = useCartStore.getState().items;

      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].product.id).toBe(mockProduct2.id);
      expect(currentItems[0].quantity).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    it('handles adding same product multiple times in sequence', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct);
      addItem(mockProduct);

      const currentItems = useCartStore.getState().items;

      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].quantity).toBe(3);
    });

    it('maintains correct state after complex operations', () => {
      const { addItem, removeItem, updateQuantity, getSubtotal } =
        useCartStore.getState();

      // Add products
      addItem(mockProduct, 2); // 800
      addItem(mockProduct2, 3); // 450

      expect(getSubtotal()).toBe(1250.0);

      // Update quantity
      updateQuantity(mockProduct.id, 5); // 2000

      expect(getSubtotal()).toBe(2450.0);

      // Add more of existing product
      addItem(mockProduct, 1); // 2400

      expect(getSubtotal()).toBe(2850.0);

      // Remove one product
      removeItem(mockProduct2.id);

      expect(getSubtotal()).toBe(2400.0);

      const currentItems = useCartStore.getState().items;
      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].quantity).toBe(6);
    });

    it('handles products with zero price', () => {
      const freeProduct: Product = {
        ...mockProduct,
        id: 'prod-free',
        base_price: 0,
      };

      const { addItem, getSubtotal } = useCartStore.getState();
      addItem(freeProduct, 5);

      const currentItems = useCartStore.getState().items;

      expect(currentItems[0].unitPrice).toBe(0);
      expect(currentItems[0].lineTotal).toBe(0);
      expect(getSubtotal()).toBe(0);
    });

    it('maintains type safety for product properties', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct);

      const currentItems = useCartStore.getState().items;
      const item = currentItems[0];

      // TypeScript should recognize these properties
      expect(item.product.category).toBe('Flower');
      expect(item.product.unit).toBe('gram');
      expect(item.product.requires_tare_weight).toBe(false);
      expect(item.product.is_active).toBe(true);
    });
  });
});
