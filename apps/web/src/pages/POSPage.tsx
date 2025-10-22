/**
 * POS Main Screen Page
 *
 * Primary point-of-sale interface for cashiers to search products,
 * add items to cart, and process transactions.
 *
 * Layout:
 * - Two-column responsive design
 * - Main content area (left): Product search and grid
 * - Cart sidebar (right): Shopping cart with items and subtotal
 *
 * State Management:
 * - Zustand cart store for shopping cart state
 * - Local state for product search and loading
 *
 * Data Fetching:
 * - Real-time product search via Supabase
 * - Debounced search input (300ms)
 *
 * @see Story 1.5 - POS Main Screen Product Search & Selection
 */

import { useState, useEffect } from 'react';
import type React from 'react';
import { ProductSearch, ProductGrid, CartSidebar } from '@/components/pos';
import { CartButton } from '@/components/pos/CartButton';
import { CartDrawer } from '@/components/pos/CartDrawer';
import type { ProductWithAvailability } from '@/components/pos';
import { useCartStore } from '@/stores/cartStore';
import { productService } from '@/services/products.service';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * POS Page Component
 *
 * Main route component for the point-of-sale interface.
 * Implements responsive two-column layout with product search/grid and cart sidebar.
 */
export default function POSPage(): React.ReactElement {
  // Local state for search and products
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<ProductWithAvailability[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mobile cart drawer state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Debounced search query (300ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Cart store
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  /**
   * Fetch products based on debounced search query
   *
   * Triggers on component mount and whenever debouncedSearchQuery changes.
   * Implements error handling and loading states.
   */
  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await productService.searchProducts(debouncedSearchQuery);
        setProducts(results);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch products. Please try again.';
        setError(errorMessage);
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProducts();
  }, [debouncedSearchQuery]);

  /**
   * Handle search query changes
   * Updates local state, debouncing happens automatically via useDebounce
   */
  const handleSearch = (query: string): void => {
    setSearchQuery(query);
  };

  /**
   * Handle add product to cart
   * Prevents adding out-of-stock products
   */
  const handleAddToCart = (product: ProductWithAvailability): void => {
    // Prevent adding out-of-stock products
    if (product.availableQuantity <= 0) {
      console.warn('Cannot add out-of-stock product to cart:', product.name);
      // TODO: Show toast notification when toast system is implemented
      return;
    }

    // Add to cart with default quantity of 1
    addItem(product, 1);

    // TODO: Show success toast notification when toast system is implemented
    console.log('Product added to cart:', product.name);
  };

  /**
   * Handle remove item from cart
   */
  const handleRemoveItem = (productId: string): void => {
    removeItem(productId);
    // TODO: Show toast notification when toast system is implemented
  };

  /**
   * Handle update item quantity
   */
  const handleUpdateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    updateQuantity(productId, quantity);
  };

  /**
   * Calculate cart subtotal from store
   */
  const cartSubtotal = getSubtotal();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Main content area - Product search and grid */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6">
          {/* Page header */}
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">POS - Point of Sale</h1>
            <p className="mt-1 text-sm text-gray-600">
              Search products and add them to cart to begin transaction
            </p>
          </header>

          {/* Product search */}
          <ProductSearch value={searchQuery} onSearch={handleSearch} isLoading={isLoading} />

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Product grid */}
          <ProductGrid
            products={products}
            onAddToCart={handleAddToCart}
            isLoading={isLoading}
            emptyMessage={
              searchQuery
                ? `No products found for "${searchQuery}"`
                : 'Type to search products by name or SKU'
            }
          />
        </div>
      </main>

      {/* Desktop: Fixed cart sidebar (≥1024px) */}
      <aside
        className="hidden lg:block w-96 border-l border-gray-200 bg-gray-50"
        aria-label="Shopping cart"
      >
        <CartSidebar
          items={cartItems}
          subtotal={cartSubtotal}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </aside>

      {/* Mobile: Floating cart button (<1024px) */}
      <div className="lg:hidden">
        <CartButton
          itemCount={cartItems.length}
          onClick={() => setIsCartOpen(true)}
        />
      </div>

      {/* Mobile: Cart drawer (<1024px) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        subtotal={cartSubtotal}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}
