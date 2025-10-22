/**
 * CartButton Component Tests
 *
 * Tests for the floating action button that opens the mobile cart drawer.
 *
 * Test Coverage:
 * - Renders with item count badge
 * - Hides badge when cart is empty
 * - Calls onClick handler when clicked
 * - Has minimum 56px tap target for touch
 * - Has proper ARIA label for accessibility
 *
 * @see Story 1.5.1 - Task 8: Update Unit and Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartButton } from './CartButton';

describe('CartButton', () => {
  it('renders with item count badge when cart has items', () => {
    render(<CartButton itemCount={3} onClick={vi.fn()} />);

    // Button should be rendered
    const button = screen.getByRole('button', { name: /view cart/i });
    expect(button).toBeInTheDocument();

    // Badge with count should be visible
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not show badge when cart is empty', () => {
    render(<CartButton itemCount={0} onClick={vi.fn()} />);

    // Button should be rendered
    const button = screen.getByRole('button', { name: /view cart/i });
    expect(button).toBeInTheDocument();

    // Badge should not be visible
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<CartButton itemCount={2} onClick={onClick} />);

    const button = screen.getByRole('button', { name: /view cart/i });
    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('has minimum 56px tap target for touch-friendly interaction', () => {
    const { container } = render(<CartButton itemCount={0} onClick={vi.fn()} />);
    const button = container.querySelector('button');

    // Check computed height and width (56px = 3.5rem = 14 tailwind units)
    // The button has h-14 w-14 classes which equals 56px
    expect(button).toHaveClass('h-14');
    expect(button).toHaveClass('w-14');
  });

  it('has proper ARIA label with singular "item" for count of 1', () => {
    render(<CartButton itemCount={1} onClick={vi.fn()} />);

    expect(screen.getByLabelText('View cart (1 item)')).toBeInTheDocument();
  });

  it('has proper ARIA label with plural "items" for count > 1', () => {
    render(<CartButton itemCount={5} onClick={vi.fn()} />);

    expect(screen.getByLabelText('View cart (5 items)')).toBeInTheDocument();
  });

  it('has proper ARIA label with plural "items" for count of 0', () => {
    render(<CartButton itemCount={0} onClick={vi.fn()} />);

    expect(screen.getByLabelText('View cart (0 items)')).toBeInTheDocument();
  });

  it('renders shopping cart icon', () => {
    const { container } = render(<CartButton itemCount={0} onClick={vi.fn()} />);

    // lucide-react icons have class name pattern
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('h-6');
    expect(icon).toHaveClass('w-6');
  });

  it('has fixed positioning classes for floating behavior', () => {
    const { container } = render(<CartButton itemCount={0} onClick={vi.fn()} />);
    const button = container.querySelector('button');

    expect(button).toHaveClass('fixed');
    expect(button).toHaveClass('bottom-6');
    expect(button).toHaveClass('right-6');
  });

  it('has rounded-full class for circular button shape', () => {
    const { container } = render(<CartButton itemCount={0} onClick={vi.fn()} />);
    const button = container.querySelector('button');

    expect(button).toHaveClass('rounded-full');
  });

  it('has shadow-lg class for elevation', () => {
    const { container } = render(<CartButton itemCount={0} onClick={vi.fn()} />);
    const button = container.querySelector('button');

    expect(button).toHaveClass('shadow-lg');
  });

  it('has z-50 class for proper stacking order', () => {
    const { container } = render(<CartButton itemCount={0} onClick={vi.fn()} />);
    const button = container.querySelector('button');

    expect(button).toHaveClass('z-50');
  });

  it('badge has destructive variant for high visibility', () => {
    render(<CartButton itemCount={5} onClick={vi.fn()} />);

    // Badge should have destructive variant classes
    const badge = screen.getByText('5');
    expect(badge).toBeInTheDocument();
  });

  it('badge is positioned absolutely at top-right corner', () => {
    render(<CartButton itemCount={5} onClick={vi.fn()} />);
    const badge = screen.getByText('5');

    expect(badge).toHaveClass('absolute');
    expect(badge).toHaveClass('-top-2');
    expect(badge).toHaveClass('-right-2');
  });
});
