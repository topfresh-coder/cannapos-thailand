// apps/web/src/components/layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { Sheet, SheetContent, SheetOverlay } from '@/components/ui/sheet';
import { useUiStore } from '@/stores/uiStore';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * Layout Component
 *
 * Root layout wrapper for authenticated routes.
 * Provides consistent navigation structure with:
 * - Fixed top Header (logo, user info, logout)
 * - Responsive sidebar Navigation (desktop: fixed left, mobile: drawer overlay)
 * - Main content area with <Outlet /> for nested routes
 *
 * Responsive behavior:
 * - Desktop (>1024px): Sidebar always visible, fixed left
 * - Tablet (768px-1024px): Sidebar collapsible via header button
 * - Mobile (<768px): Sidebar hidden by default, opens as Sheet drawer
 *
 * Accessibility:
 * - Semantic HTML structure (<header>, <nav>, <main>)
 * - Keyboard navigation support
 * - Focus management in mobile drawer (Sheet handles this)
 * - Escape key closes mobile drawer
 *
 * @example
 * ```tsx
 * <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
 *   <Route path="pos" element={<POSPage />} />
 *   <Route path="products" element={<ProductsPage />} />
 * </Route>
 * ```
 */
export function Layout() {
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  // Initialize sidebar state based on viewport width on mount
  useEffect(() => {
    const handleResize = () => {
      // Desktop (lg breakpoint: 1024px): sidebar open by default
      // Mobile/Tablet: sidebar closed by default
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      setSidebarOpen(isDesktop);
    };

    // Set initial state
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  // Close mobile drawer when nav link is clicked
  const handleNavClick = () => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar - Fixed left, always visible on large screens */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-muted p-4 transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Navigation onNavClick={handleNavClick} />
      </aside>

      {/* Mobile/Tablet Drawer - Sheet overlay */}
      <Sheet open={sidebarOpen && window.matchMedia('(max-width: 1023px)').matches} onOpenChange={setSidebarOpen}>
        <SheetOverlay />
        <SheetContent side="left" className="w-64 p-4">
          <Navigation onNavClick={handleNavClick} />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          sidebarOpen && 'lg:ml-64'
        )}
      >
        <Header />

        <main className="flex-1 overflow-auto p-6 mt-16 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
