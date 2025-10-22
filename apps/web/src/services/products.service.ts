/**
 * Product Service Layer
 *
 * Handles all product-related data fetching from Supabase.
 * Implements real-time search with nested query pattern for inventory aggregation.
 *
 * @module services/products
 */

import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/supabase';

// ============================================================================
// Types
// ============================================================================

type Product = Tables<'products'>;
type ProductBatch = Tables<'product_batches'>;

/**
 * Product with nested batches data from Supabase query
 */
interface ProductWithBatches extends Product {
  product_batches: Pick<ProductBatch, 'quantity_remaining'>[];
}

/**
 * Product with calculated available quantity
 */
export interface ProductWithAvailability extends Product {
  availableQuantity: number;
}

// ============================================================================
// Service Implementation
// ============================================================================

export const productService = {
  /**
   * Search active products with available inventory
   *
   * Performs case-insensitive search on product name or SKU.
   * Fetches products with nested product_batches and calculates available quantity.
   * Only returns products with active status and active batches.
   *
   * **Performance Notes**:
   * - Uses nested query with client-side aggregation (acceptable for MVP)
   * - Returns one row per product-batch combination (aggregated client-side)
   * - Recommended: Add database indexes for optimal search performance:
   *   - `CREATE INDEX idx_products_name_lower ON products(LOWER(name)) WHERE is_active = TRUE;`
   *   - `CREATE INDEX idx_products_sku_lower ON products(LOWER(sku)) WHERE is_active = TRUE;`
   *
   * **RLS Policies**:
   * - Automatically enforced by Supabase
   * - Users only see products from their location (or global products)
   * - Owner role sees all products
   *
   * @param query - Search term for product name or SKU (case-insensitive). Empty string returns all active products.
   * @returns Promise resolving to array of products with availableQuantity
   * @throws Error if database query fails
   *
   * @example
   * ```typescript
   * // Search for "sativa" in product names
   * const products = await productService.searchProducts('sativa');
   *
   * // Get all active products (empty query)
   * const allProducts = await productService.searchProducts('');
   * ```
   */
  async searchProducts(query: string = ''): Promise<ProductWithAvailability[]> {
    try {
      // Build query with nested product_batches join
      const queryBuilder = supabase
        .from('products')
        .select(`
          id,
          sku,
          name,
          category,
          unit,
          base_price,
          requires_tare_weight,
          reorder_threshold,
          is_active,
          location_id,
          created_at,
          updated_at,
          product_batches!inner (
            quantity_remaining
          )
        `)
        .eq('is_active', true)
        .eq('product_batches.status', 'Active')
        .order('name');

      // Add search filter if query provided (OR search on name and SKU)
      if (query.trim()) {
        queryBuilder.or(`name.ilike.%${query}%,sku.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        throw new Error(`Failed to search products: ${error.message}`);
      }

      if (!data) {
        return [];
      }

      // Calculate available quantity from batches (client-side aggregation)
      // Note: Each product may appear multiple times (one row per batch)
      // We aggregate by product ID to get total available quantity
      const productsWithAvailability = data.map((product) => {
        const typedProduct = product as unknown as ProductWithBatches;

        return {
          ...typedProduct,
          availableQuantity: typedProduct.product_batches.reduce(
            (sum, batch) => sum + batch.quantity_remaining,
            0
          ),
        };
      });

      return productsWithAvailability;
    } catch (error) {
      // Re-throw with enhanced error message
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while searching products');
    }
  },

  /**
   * Get all active products with available inventory
   *
   * Convenience method that calls searchProducts with empty query.
   *
   * @returns Promise resolving to array of all active products with availableQuantity
   * @throws Error if database query fails
   *
   * @example
   * ```typescript
   * const allProducts = await productService.getActiveProducts();
   * ```
   */
  async getActiveProducts(): Promise<ProductWithAvailability[]> {
    return this.searchProducts('');
  },

  /**
   * Get a single product with batch details
   *
   * Fetches a specific product by ID with nested product_batches.
   * Useful for viewing detailed product information.
   *
   * @param productId - UUID of the product
   * @returns Promise resolving to product with availableQuantity, or null if not found
   * @throws Error if database query fails
   *
   * @example
   * ```typescript
   * const product = await productService.getProductWithBatches('uuid-here');
   * if (product) {
   *   console.log(`Available: ${product.availableQuantity} ${product.unit}`);
   * }
   * ```
   */
  async getProductWithBatches(productId: string): Promise<ProductWithAvailability | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          sku,
          name,
          category,
          unit,
          base_price,
          requires_tare_weight,
          reorder_threshold,
          is_active,
          location_id,
          created_at,
          updated_at,
          product_batches!inner (
            quantity_remaining
          )
        `)
        .eq('id', productId)
        .eq('is_active', true)
        .eq('product_batches.status', 'Active')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw new Error(`Failed to fetch product: ${error.message}`);
      }

      if (!data) {
        return null;
      }

      const typedProduct = data as unknown as ProductWithBatches;

      return {
        ...typedProduct,
        availableQuantity: typedProduct.product_batches.reduce(
          (sum, batch) => sum + batch.quantity_remaining,
          0
        ),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while fetching product');
    }
  },
};
