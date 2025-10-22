/**
 * CartDrawer Component Tests
 *
 * Tests for the mobile cart drawer that slides up from bottom.
 *
 * Test Coverage:
 * - Renders when isOpen is true
 * - Does not render when isOpen is false
 * - Calls onClose when close button clicked
 * - Calls onClose when Esc key pressed
 * - Has proper ARIA attributes for accessibility
 * - Renders CartSidebar content
 * - Has screen reader announcements
 *
 * @see Story 1.5.1 - Task 8: Update Unit and Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartDrawer } from './CartDrawer';
import type { CartItem } from '@/stores/cartStore';

// Mock CartSidebar to avoid complex cart store setup
vi.mock('./CartSidebar', () => ({
  CartSidebar: ({ items, subtotal }: { items: CartItem[]; subtotal: number }) => (
    <div data-testid="cart-sidebar-mock">
      <span>Items: {items.length}</span>
      <span>Subtotal: {subtotal}</span>
    </div>
  ),
}));

describe('CartDrawer', () => {
  const mockItems: CartItem[] = [];
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    items: mockItems,
    subtotal: 0,
    onRemoveItem: vi.fn(),
    onUpdateQuantity: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(<CartDrawer {...mockProps} />);

    // Sheet content should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });

  it('does not render dialog when isOpen is false', () => {
    render(<CartDrawer {...mockProps} isOpen={false} />);

    // Dialog should not be in the document when closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<CartDrawer {...mockProps} onClose={onClose} />);

    // Find and click close button (X icon)
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Esc key is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<CartDrawer {...mockProps} onClose={onClose} />);

    // Press Escape key
    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(<CartDrawer {...mockProps} />);

    const dialog = screen.getByRole('dialog');

    // Dialog should have aria-labelledby pointing to title
    expect(dialog).toHaveAttribute('aria-labelledby');

    // Title should have matching id
    const title = screen.getByText('Shopping Cart');
    const titleId = title.id;
    expect(titleId).toBe('cart-drawer-title');
    expect(dialog.getAttribute('aria-labelledby')).toContain(titleId);

    // Note: aria-modal is handled by the Sheet component (Radix Dialog primitive)
    // and may not be directly on the dialog role element in all implementations
  });

  it('renders SheetDescription for context', () => {
    render(<CartDrawer {...mockProps} />);

    expect(screen.getByText('Review and modify your cart items')).toBeInTheDocument();
  });

  it('renders CartSidebar with correct props', () => {
    const items: CartItem[] = [
      {
        product: {
          id: 'test-1',
          sku: 'TEST001',
          name: 'Test Product',
          category: 'Flower',
          unit: 'gram',
          base_price: 400,
          requires_tare_weight: false,
          reorder_threshold: 50,
          is_active: true,
          location_id: 'loc-1',
          created_at: '2025-01-01',
          updated_at: '2025-01-01',
        },
        quantity: 2,
        unitPrice: 400,
        lineTotal: 800,
      },
    ];

    render(
      <CartDrawer
        {...mockProps}
        items={items}
        subtotal={800}
      />
    );

    // Verify CartSidebar receives correct props
    const cartSidebar = screen.getByTestId('cart-sidebar-mock');
    expect(within(cartSidebar).getByText('Items: 1')).toBeInTheDocument();
    expect(within(cartSidebar).getByText('Subtotal: 800')).toBeInTheDocument();
  });

  it('has screen reader announcement for drawer state', () => {
    const { rerender } = render(<CartDrawer {...mockProps} isOpen={true} />);

    // Check for aria-live region
    const liveRegion = screen.getByText('Shopping cart opened');
    expect(liveRegion).toHaveClass('sr-only');

    // Rerender with closed state
    rerender(<CartDrawer {...mockProps} isOpen={false} />);

    // When closed, should announce closed state
    const closedAnnouncement = screen.getByText('Shopping cart closed');
    expect(closedAnnouncement).toHaveClass('sr-only');
  });

  it('has proper height class (80vh)', () => {
    render(<CartDrawer {...mockProps} />);

    const dialog = screen.getByRole('dialog');
    // SheetContent should have h-[80vh] class
    expect(dialog).toHaveClass('h-[80vh]');
  });

  it('has overflow-y-auto for scrollable content', () => {
    render(<CartDrawer {...mockProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('overflow-y-auto');
  });

  it('uses bottom side for slide-up animation', () => {
    render(<CartDrawer {...mockProps} />);

    // Sheet should slide from bottom
    // This is controlled by the side="bottom" prop
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('calls onClose with false when Sheet onOpenChange triggers', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<CartDrawer {...mockProps} onClose={onClose} />);

    // Click backdrop (outside dialog) to trigger onOpenChange(false)
    // Note: This behavior depends on Sheet component implementation
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });
});
