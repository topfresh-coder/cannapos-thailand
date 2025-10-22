// apps/web/src/pages/ReportsPage.tsx
import { useEffect } from 'react';
import { BarChart } from 'lucide-react';

/**
 * Reports Page (Placeholder)
 *
 * Placeholder page for reporting and analytics feature.
 * Will be implemented in future stories for viewing sales reports and analytics.
 *
 * Accessibility:
 * - Semantic HTML with <main> and <h1>
 * - Sets document title for browser tab
 */
export function ReportsPage() {
  useEffect(() => {
    document.title = 'Reports | CannaPOS Thailand';
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
      <div className="flex flex-col items-center gap-4 max-w-md">
        <BarChart className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Reporting and analytics feature is coming soon. You'll be able to view sales reports, revenue analytics, and business insights here.
        </p>
        <div className="mt-4 px-4 py-2 bg-muted rounded-md">
          <p className="text-sm font-medium">Under Construction</p>
        </div>
      </div>
    </main>
  );
}
