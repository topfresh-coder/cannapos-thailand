/**
 * POS Components Barrel Export
 *
 * Central export file for all POS-related components.
 * Provides convenient imports for component consumers.
 */

export { ProductSearch } from './ProductSearch';
export { ProductGrid } from './ProductGrid';
export { ProductCard } from './ProductCard';
export { CartSidebar } from './CartSidebar';
export { CartItem } from './CartItem';
export { CartButton } from './CartButton';
export { CartDrawer } from './CartDrawer';

export type {
  Product,
  ProductBatch,
  ProductWithAvailability,
  CartItem as CartItemType,
  ProductSearchProps,
  ProductGridProps,
  ProductCardProps,
  CartSidebarProps,
  CartItemProps,
} from './types';
