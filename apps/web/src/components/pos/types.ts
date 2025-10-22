/**
 * Type definitions for POS components
 *
 * These types extend the generated Supabase types with additional
 * computed properties needed for the POS UI.
 */

import type { Tables } from '@/types/supabase';

/**
 * Product type from database
 */
export type Product = Tables<'products'>;

/**
 * Product Batch type from database
 */
export type ProductBatch = Tables<'product_batches'>;

/**
 * Extended product type with computed available quantity
 * This is used in the POS UI to display product availability
 */
export interface ProductWithAvailability extends Product {
  /**
   * Total available quantity calculated from all active product batches
   * Sum of quantity_remaining for all batches where status = 'Active'
   */
  availableQuantity: number;

  /**
   * Optional: All active product batches for this product
   * Used for FIFO allocation in cart operations
   */
  product_batches?: ProductBatch[];
}

/**
 * Cart item representing a product in the shopping cart
 */
export interface CartItem {
  /**
   * The product being purchased
   */
  product: Product;

  /**
   * Quantity of the product in cart
   */
  quantity: number;

  /**
   * Unit price at time of adding to cart (may differ from current base_price due to pricing tiers)
   */
  unitPrice: number;

  /**
   * Line total = quantity × unitPrice
   */
  lineTotal: number;
}

/**
 * Props for ProductSearch component
 */
export interface ProductSearchProps {
  /**
   * Callback fired when search query changes
   * @param query - The search query string
   */
  onSearch: (query: string) => void;

  /**
   * Whether the search is currently loading results
   */
  isLoading?: boolean;

  /**
   * Current search query value (for controlled component)
   */
  value?: string;
}

/**
 * Props for ProductGrid component
 */
export interface ProductGridProps {
  /**
   * Array of products to display in the grid
   */
  products: ProductWithAvailability[];

  /**
   * Callback fired when user wants to add a product to cart
   * @param product - The product to add
   */
  onAddToCart: (product: ProductWithAvailability) => void;

  /**
   * Whether the grid is currently loading
   */
  isLoading?: boolean;

  /**
   * Message to display when no products are found
   */
  emptyMessage?: string;
}

/**
 * Props for ProductCard component
 */
export interface ProductCardProps {
  /**
   * The product to display
   */
  product: ProductWithAvailability;

  /**
   * Callback fired when user clicks to add product to cart
   * @param product - The product being added
   */
  onAddToCart: (product: ProductWithAvailability) => void;
}

/**
 * Props for CartSidebar component
 */
export interface CartSidebarProps {
  /**
   * Array of items currently in the cart
   */
  items: CartItem[];

  /**
   * Cart subtotal (sum of all line totals)
   */
  subtotal: number;

  /**
   * Callback to remove an item from cart
   * @param productId - ID of the product to remove
   */
  onRemoveItem?: (productId: string) => void;

  /**
   * Callback to update item quantity
   * @param productId - ID of the product to update
   * @param quantity - New quantity value
   */
  onUpdateQuantity?: (productId: string, quantity: number) => void;
}

/**
 * Props for CartItem component
 */
export interface CartItemProps {
  /**
   * The cart item to display
   */
  item: CartItem;

  /**
   * Callback to remove this item from cart
   */
  onRemove?: () => void;

  /**
   * Callback to update this item's quantity
   * @param quantity - New quantity value
   */
  onUpdateQuantity?: (quantity: number) => void;
}
