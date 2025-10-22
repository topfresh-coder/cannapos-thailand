// apps/web/src/components/layout/Navigation.tsx
import { NavLink } from 'react-router-dom';
import {
  ShoppingCart,
  Package,
  Warehouse,
  Clock,
  BarChart,
  LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  /** Optional className for custom styling */
  className?: string;
  /** Callback when a nav link is clicked (useful for closing mobile drawer) */
  onNavClick?: () => void;
}

const navigationItems = [
  { path: '/pos', label: 'POS', icon: ShoppingCart },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/inventory', label: 'Inventory', icon: Warehouse },
  { path: '/shifts', label: 'Shifts', icon: Clock },
  { path: '/reports', label: 'Reports', icon: BarChart },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
] as const;

/**
 * Navigation Component
 *
 * Renders main application navigation menu with icons and labels.
 * Supports active state highlighting using React Router NavLink.
 *
 * Accessibility:
 * - Semantic <nav> element with aria-label
 * - NavLink provides aria-current="page" for active route
 * - Keyboard accessible (Tab navigation, Enter to activate)
 * - Focus indicators via Tailwind focus-visible styles
 *
 * @example
 * ```tsx
 * <Navigation onNavClick={() => closeMobileDrawer()} />
 * ```
 */
export function Navigation({ className, onNavClick }: NavigationProps) {
  return (
    <nav
      className={cn('flex flex-col gap-2', className)}
      aria-label="Main navigation"
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavClick}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isActive && 'bg-primary/10 text-primary border-l-4 border-primary'
              )
            }
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <Icon
                  className={cn('h-5 w-5', isActive && 'text-primary')}
                  aria-hidden="true"
                />
                <span className="font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
