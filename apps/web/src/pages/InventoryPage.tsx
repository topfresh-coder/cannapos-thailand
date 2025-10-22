// apps/web/src/pages/InventoryPage.tsx
import { useEffect } from 'react';
import { Warehouse } from 'lucide-react';

/**
 * Inventory Page (Placeholder)
 *
 * Placeholder page for inventory management feature.
 * Will be implemented in future stories for tracking stock levels and batches.
 *
 * Accessibility:
 * - Semantic HTML with <main> and <h1>
 * - Sets document title for browser tab
 */
export function InventoryPage() {
  useEffect(() => {
    document.title = 'Inventory | CannaPOS Thailand';
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
      <div className="flex flex-col items-center gap-4 max-w-md">
        <Warehouse className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-3xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">
          Inventory management feature is coming soon. You'll be able to track stock levels, manage batches, and view inventory reports here.
        </p>
        <div className="mt-4 px-4 py-2 bg-muted rounded-md">
          <p className="text-sm font-medium">Under Construction</p>
        </div>
      </div>
    </main>
  );
}
