// apps/web/src/pages/DashboardPage.tsx
import { useEffect } from 'react';
import { LayoutDashboard } from 'lucide-react';

/**
 * Dashboard Page (Placeholder)
 *
 * Placeholder page for main dashboard feature.
 * Will be implemented in future stories for displaying key metrics and quick actions.
 *
 * Accessibility:
 * - Semantic HTML with <main> and <h1>
 * - Sets document title for browser tab
 */
export function DashboardPage() {
  useEffect(() => {
    document.title = 'Dashboard | CannaPOS Thailand';
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
      <div className="flex flex-col items-center gap-4 max-w-md">
        <LayoutDashboard className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Dashboard feature is coming soon. You'll be able to view key metrics, recent transactions, and quick actions here.
        </p>
        <div className="mt-4 px-4 py-2 bg-muted rounded-md">
          <p className="text-sm font-medium">Under Construction</p>
        </div>
      </div>
    </main>
  );
}
