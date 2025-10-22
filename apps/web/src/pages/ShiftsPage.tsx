// apps/web/src/pages/ShiftsPage.tsx
import { useEffect } from 'react';
import { Clock } from 'lucide-react';

/**
 * Shifts Page (Placeholder)
 *
 * Placeholder page for shift management feature.
 * Will be implemented in future stories for managing employee shifts and shift reconciliation.
 *
 * Accessibility:
 * - Semantic HTML with <main> and <h1>
 * - Sets document title for browser tab
 */
export function ShiftsPage() {
  useEffect(() => {
    document.title = 'Shifts | CannaPOS Thailand';
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
      <div className="flex flex-col items-center gap-4 max-w-md">
        <Clock className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-3xl font-bold">Shifts</h1>
        <p className="text-muted-foreground">
          Shift management feature is coming soon. You'll be able to start/end shifts, view shift history, and reconcile cash drawers here.
        </p>
        <div className="mt-4 px-4 py-2 bg-muted rounded-md">
          <p className="text-sm font-medium">Under Construction</p>
        </div>
      </div>
    </main>
  );
}
