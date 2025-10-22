// apps/web/src/pages/ProductsPage.tsx
import { useEffect } from 'react';
import { Package } from 'lucide-react';

/**
 * Products Page (Placeholder)
 *
 * Placeholder page for product management feature.
 * Will be implemented in future stories for managing product catalog.
 *
 * Accessibility:
 * - Semantic HTML with <main> and <h1>
 * - Sets document title for browser tab
 */
export function ProductsPage() {
  useEffect(() => {
    document.title = 'Products | CannaPOS Thailand';
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
      <div className="flex flex-col items-center gap-4 max-w-md">
        <Package className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">
          Product management feature is coming soon. You'll be able to browse, search, and manage your product catalog here.
        </p>
        <div className="mt-4 px-4 py-2 bg-muted rounded-md">
          <p className="text-sm font-medium">Under Construction</p>
        </div>
      </div>
    </main>
  );
}
