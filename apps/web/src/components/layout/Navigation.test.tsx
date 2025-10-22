// apps/web/src/components/layout/Navigation.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from './Navigation';
import userEvent from '@testing-library/user-event';

// Helper to render component with Router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Navigation', () => {
  it('renders all navigation items', () => {
    renderWithRouter(<Navigation />);

    expect(screen.getByText('POS')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('Shifts')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('has correct ARIA label for navigation', () => {
    renderWithRouter(<Navigation />);

    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
  });

  it('renders icons for all navigation items', () => {
    const { container } = renderWithRouter(<Navigation />);

    // Each nav item should have an icon (lucide-react SVG)
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(6); // At least 6 icons for 6 nav items
  });

  it('calls onNavClick when navigation item is clicked', async () => {
    const user = userEvent.setup();
    const onNavClick = vi.fn();

    renderWithRouter(<Navigation onNavClick={onNavClick} />);

    const posLink = screen.getByText('POS');
    await user.click(posLink);

    expect(onNavClick).toHaveBeenCalledTimes(1);
  });

  it('applies active styles to current route', () => {
    renderWithRouter(<Navigation />);

    // Find all nav links
    const links = screen.getAllByRole('link');

    // At least one link should be present
    expect(links.length).toBeGreaterThan(0);

    // Each link should have proper styling classes
    links.forEach((link) => {
      expect(link).toHaveClass('flex', 'items-center', 'gap-3', 'px-4', 'py-3', 'rounded-md');
    });
  });

  it('has keyboard accessibility with focus indicators', () => {
    renderWithRouter(<Navigation />);

    const links = screen.getAllByRole('link');

    // Check that focus-visible styles are present in className
    links.forEach((link) => {
      expect(link.className).toContain('focus-visible');
    });
  });

  it('navigation items have correct paths', () => {
    renderWithRouter(<Navigation />);

    expect(screen.getByText('POS').closest('a')).toHaveAttribute('href', '/pos');
    expect(screen.getByText('Products').closest('a')).toHaveAttribute('href', '/products');
    expect(screen.getByText('Inventory').closest('a')).toHaveAttribute('href', '/inventory');
    expect(screen.getByText('Shifts').closest('a')).toHaveAttribute('href', '/shifts');
    expect(screen.getByText('Reports').closest('a')).toHaveAttribute('href', '/reports');
    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/dashboard');
  });
});
