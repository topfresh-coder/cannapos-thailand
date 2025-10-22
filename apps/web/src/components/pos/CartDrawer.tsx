/**
 * CartDrawer Component - Mobile Cart Drawer
 *
 * A bottom drawer (sheet) that displays the shopping cart on mobile/tablet viewports (<1024px).
 * Reuses CartSidebar content for DRY principle.
 *
 * Features:
 * - Slide-up animation from bottom
 * - Backdrop overlay with blur effect
 * - Close button (X icon) in header
 * - Esc key to close
 * - Backdrop click to close
 * - Focus trap for accessibility
 * - 80vh height for optimal content visibility
 *
 * Built with shadcn/ui Sheet component (Radix UI Dialog primitive)
 *
 * @see Story 1.5.1 - Task 3: Create Cart Drawer Component
 */

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CartSidebar } from './CartSidebar';
import type { CartItem } from '@/stores/cartStore';

/**
 * Props for CartDrawer component
 */
export interface CartDrawerProps {
  /** Whether drawer is open */
  isOpen: boolean;
  /** Callback when drawer should close */
  onClose: () => void;
  /** Cart items to display */
  items: CartItem[];
  /** Cart subtotal */
  subtotal: number;
  /** Handler to remove item from cart */
  onRemoveItem: (productId: string) => void;
  /** Handler to update item quantity */
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

/**
 * CartDrawer Component
 *
 * Mobile-friendly drawer that slides up from bottom to display cart contents.
 * Automatically handles:
 * - Close button click
 * - Esc key press
 * - Backdrop click
 * - Focus trap
 * - ARIA attributes for accessibility
 *
 * @param isOpen - Controls drawer visibility
 * @param onClose - Called when drawer should close
 * @param items - Cart items to display
 * @param subtotal - Cart subtotal
 * @param onRemoveItem - Remove item handler
 * @param onUpdateQuantity - Update quantity handler
 */
export function CartDrawer({
  isOpen,
  onClose,
  items,
  subtotal,
  onRemoveItem,
  onUpdateQuantity,
}: CartDrawerProps): React.ReactElement {
  /**
   * Handle Sheet open/close state changes
   * Sheet component uses boolean parameter for onOpenChange
   */
  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[80vh] overflow-y-auto"
        aria-labelledby="cart-drawer-title"
      >
        <SheetHeader>
          <SheetTitle id="cart-drawer-title">Shopping Cart</SheetTitle>
          <SheetDescription>Review and modify your cart items</SheetDescription>
        </SheetHeader>

        {/* Reuse CartSidebar content for DRY principle */}
        <div className="mt-4">
          <CartSidebar
            items={items}
            subtotal={subtotal}
            onRemoveItem={onRemoveItem}
            onUpdateQuantity={onUpdateQuantity}
          />
        </div>
      </SheetContent>

      {/* Screen reader announcement for drawer state */}
      <div aria-live="polite" className="sr-only">
        {isOpen ? 'Shopping cart opened' : 'Shopping cart closed'}
      </div>
    </Sheet>
  );
}
