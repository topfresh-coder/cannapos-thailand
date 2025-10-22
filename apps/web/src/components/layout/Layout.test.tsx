// apps/web/src/components/layout/Layout.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';

// Mock window.matchMedia
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: query === '(min-width: 1024px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock child components
vi.mock('./Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

vi.mock('./Navigation', () => ({
  Navigation: () => <div data-testid="navigation">Navigation</div>,
}));

// Mock uiStore
vi.mock('@/stores/uiStore', () => ({
  useUiStore: () => ({
    sidebarOpen: true,
    toggleSidebar: vi.fn(),
    setSidebarOpen: vi.fn(),
  }),
}));

// Mock Sheet component
vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet">{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet-content">{children}</div>,
  SheetOverlay: () => <div data-testid="sheet-overlay" />,
}));

// Helper to render Layout with Router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ui}>
          <Route index element={<div>Test Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

describe('Layout', () => {
  it('renders Header component', () => {
    renderWithRouter(<Layout />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders Navigation component', () => {
    renderWithRouter(<Layout />);

    // Navigation appears twice (desktop sidebar + mobile drawer)
    const navElements = screen.getAllByTestId('navigation');
    expect(navElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders Outlet for nested routes', () => {
    renderWithRouter(<Layout />);

    // Check that child route content is rendered
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  it('has proper layout structure with main element', () => {
    const { container } = renderWithRouter(<Layout />);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });

  it('renders Sheet component for mobile drawer', () => {
    renderWithRouter(<Layout />);

    expect(screen.getByTestId('sheet')).toBeInTheDocument();
  });

  it('renders desktop sidebar with proper classes', () => {
    const { container } = renderWithRouter(<Layout />);

    const aside = container.querySelector('aside');
    expect(aside).toBeInTheDocument();
    expect(aside).toHaveClass('hidden', 'lg:flex');
  });

  it('persists layout across route changes', () => {
    // Render layout with initial route
    const { rerender } = renderWithRouter(<Layout />);

    // Verify initial elements are present
    expect(screen.getByTestId('header')).toBeInTheDocument();
    const navElementsBefore = screen.getAllByTestId('navigation');
    expect(navElementsBefore.length).toBeGreaterThanOrEqual(1);

    // Re-render (simulating route change)
    rerender(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div>Different Page</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );

    // Header and Nav should still be present (not unmounted)
    expect(screen.getByTestId('header')).toBeInTheDocument();
    const navElementsAfter = screen.getAllByTestId('navigation');
    expect(navElementsAfter.length).toBeGreaterThanOrEqual(1);

    // Verify the Outlet content changed
    expect(screen.getByText('Different Page')).toBeInTheDocument();
  });

  it('applies responsive classes based on sidebar state', () => {
    const { container } = renderWithRouter(<Layout />);

    const mainContainer = container.querySelector('.flex-1.flex.flex-col');
    expect(mainContainer).toBeInTheDocument();

    // When sidebarOpen is true, should have lg:ml-64 class
    expect(mainContainer?.className).toContain('lg:ml-64');
  });

  it('has overflow handling for main content area', () => {
    const { container } = renderWithRouter(<Layout />);

    const main = container.querySelector('main');
    expect(main).toHaveClass('overflow-auto');
  });
});
