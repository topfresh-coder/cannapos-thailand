/**
 * CartButton Component - Floating Action Button for Mobile Cart
 *
 * A circular floating action button (FAB) that displays on mobile/tablet viewports (<1024px)
 * to open the cart drawer. Shows item count badge when cart has items.
 *
 * Features:
 * - Fixed positioning at bottom-right corner
 * - Item count badge for visual feedback
 * - Touch-friendly 56px tap target (exceeds 44px WCAG minimum)
 * - ARIA label for accessibility
 * - Only visible on mobile/tablet (<1024px)
 *
 * @see Story 1.5.1 - Task 2: Create Floating Cart Button Component
 */

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Props for CartButton component
 */
export interface CartButtonProps {
  /** Number of items in cart */
  itemCount: number;
  /** Click handler to open cart drawer */
  onClick: () => void;
}

/**
 * CartButton Component
 *
 * Floating action button that opens the mobile cart drawer.
 * Displays item count badge when cart contains items.
 *
 * @param itemCount - Number of items in cart
 * @param onClick - Handler called when button is clicked
 */
export function CartButton({ itemCount, onClick }: CartButtonProps): React.ReactElement {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
      size="icon"
      aria-label={`View cart (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`}
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <Badge
          className="absolute -top-2 -right-2 h-6 min-w-[1.5rem] rounded-full px-1 flex items-center justify-center"
          variant="destructive"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );
}
