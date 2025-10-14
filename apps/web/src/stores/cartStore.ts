// apps/web/src/stores/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Tables } from '@/types/supabase';

// Product type from Supabase
type Product = Tables<'products'>;

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface CartState {
  items: CartItem[];
  validationErrors: Record<string, string | null>;
  lastTransaction: { transactionId: string; timestamp: string } | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getSubtotal: () => number;
  clear: () => void;
  setValidationError: (productId: string, error: string | null) => void;
  setLastTransaction: (tx: { transactionId: string; timestamp: string } | null) => void;
}

/**
 * Validate and round quantity based on product type
 * - Flower products (requires_tare_weight: true): Allow decimals rounded to 1 decimal place (e.g., 3.5g)
 * - Non-flower products: Integer quantities only
 * - Minimum quantity: 1
 *
 * @param quantity - The quantity to validate
 * @param product - The product being validated
 * @returns Validated and rounded quantity
 */
function validateAndRoundQuantity(quantity: number, product: Product): number {
  // Reject negative or zero quantities
  if (quantity <= 0) {
    return 1; // Minimum quantity is 1
  }

  // For flower products (requires_tare_weight: true), allow decimals rounded to 1 place
  if (product.requires_tare_weight) {
    return Math.round(quantity * 10) / 10; // Round to 1 decimal place (e.g., 3.567 → 3.6)
  }

  // For non-flower products, enforce integer quantities
  return Math.round(quantity); // Round to nearest integer (e.g., 3.5 → 4)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      validationErrors: {},
      lastTransaction: null,

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const validatedQuantity = validateAndRoundQuantity(quantity, product);
        const existingItem = items.find((item) => item.product.id === product.id);

        if (existingItem) {
          // Update quantity if product already in cart
          const newQuantity = existingItem.quantity + validatedQuantity;
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? {
                    ...item,
                    quantity: newQuantity,
                    lineTotal: newQuantity * item.unitPrice,
                  }
                : item
            ),
          });
        } else {
          // Add new item to cart
          set({
            items: [
              ...items,
              {
                product,
                quantity: validatedQuantity,
                unitPrice: product.base_price,
                lineTotal: validatedQuantity * product.base_price,
              },
            ],
          });
        }
      },

      removeItem: (productId) => {
        const { validationErrors } = get();
        // Remove item and its validation error
        const newErrors = { ...validationErrors };
        delete newErrors[productId];

        set({
          items: get().items.filter((item) => item.product.id !== productId),
          validationErrors: newErrors,
        });
      },

      updateQuantity: (productId, quantity) => {
        const { items } = get();
        const item = items.find((i) => i.product.id === productId);

        if (!item) return;

        // Check if quantity is below minimum BEFORE validation/rounding
        // Story 1.6 AC7: Reject negative or zero quantities, keep current quantity
        if (quantity <= 0) {
          get().setValidationError(productId, 'Quantity must be at least 1');
          return; // Do NOT update quantity - keep current value
        }

        // Validate and round quantity based on product type
        const validatedQuantity = validateAndRoundQuantity(quantity, item.product);

        // Clear validation error if quantity is valid
        get().setValidationError(productId, null);

        set({
          items: items.map((i) =>
            i.product.id === productId
              ? {
                  ...i,
                  quantity: validatedQuantity,
                  lineTotal: validatedQuantity * i.unitPrice,
                }
              : i
          ),
        });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.lineTotal, 0);
      },

      clear: () => {
        set({ items: [], validationErrors: {} });
      },

      setValidationError: (productId, error) => {
        set((state) => ({
          validationErrors: {
            ...state.validationErrors,
            [productId]: error,
          },
        }));
      },

      setLastTransaction: (tx) => {
        set({ lastTransaction: tx });
      },
    }),
    {
      name: 'cannapos-cart', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
