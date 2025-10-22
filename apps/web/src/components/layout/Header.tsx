// apps/web/src/components/layout/Header.tsx
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUiStore } from '@/stores/uiStore';

/**
 * Header Component
 *
 * Top navigation bar displaying:
 * - Logo/App name
 * - Current user name (from AuthContext)
 * - Current location name (from AuthContext)
 * - Logout button
 * - Hamburger menu button (mobile only)
 *
 * Accessibility:
 * - Semantic <header> element with role="banner"
 * - Logout button with descriptive aria-label
 * - Hamburger button with aria-label and aria-expanded state
 * - Keyboard accessible (Tab, Enter)
 * - Focus indicators via Tailwind focus-visible styles
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 */
export function Header() {
  const { user, signOut } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUiStore();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('[Header] Logout failed:', error);
    }
  };

  // Display user name or fallback to email
  const displayName = user?.name || user?.email || 'User';

  // Display location name if available, otherwise show location ID
  const displayLocation = user?.location_name || `Location ${user?.location_id || 'Unknown'}`;

  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50 flex items-center justify-between px-4 md:px-6"
    >
      {/* Left section: Hamburger menu (mobile/tablet) + Logo */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
          aria-expanded={sidebarOpen}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">CannaPOS</span>
          <span className="hidden sm:inline text-muted-foreground">Thailand</span>
        </div>
      </div>

      {/* Right section: User info + Logout button */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium">{displayName}</span>
          <span className="text-xs text-muted-foreground">{displayLocation}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          aria-label="Logout from CannaPOS"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
