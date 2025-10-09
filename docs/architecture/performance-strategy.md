# Performance Strategy

## Query Optimization

1. **Indexes**: All foreign keys indexed, common query patterns (location_id, status, received_date) indexed (see Database Schema)

2. **Select Specific Columns**: Avoid `SELECT *`, specify needed columns
   ```typescript
   // Bad
   const { data } = await supabase.from('products').select('*');

   // Good
   const { data } = await supabase.from('products').select('id, name, sku, category, base_price');
   ```

3. **Limit Results**: Use `.limit()` for lists, pagination for reports
   ```typescript
   const { data } = await supabase
     .from('transactions')
     .select('*')
     .order('transaction_date', { ascending: false })
     .limit(50); // Only fetch 50 most recent
   ```

4. **Joins Instead of Multiple Queries**: Use Supabase's nested select
   ```typescript
   // One query instead of two
   const { data } = await supabase
     .from('products')
     .select(`
       *,
       product_batches!inner (
         id,
         quantity_remaining,
         status
       )
     `)
     .eq('product_batches.status', 'Active');
   ```

5. **Database Functions for Complex Logic**: Move FIFO allocation to PostgreSQL function (optional for Epic 1, implement in Epic 2 if performance issues)

---

## Caching Strategy

1. **Pricing Tiers**: Fetch once at app load, cache in Zustand store (rarely change)
   ```typescript
   const { tiers } = useTierStore();
   // Refresh on Settings page when tiers updated
   ```

2. **Product Catalog**: Cache for 5 minutes, background refresh
   ```typescript
   // Optional: Use React Query for auto-caching (Epic 6)
   const { data: products } = useQuery({
     queryKey: ['products'],
     queryFn: productService.getProducts,
     staleTime: 5 * 60 * 1000 // 5 minutes
   });
   ```

3. **Browser Cache**: Aggressive caching for static assets (Vite builds with content hashes, Vercel sets cache headers automatically)

4. **Service Worker** (future enhancement): Offline-first PWA with service worker caching

---

## Code Splitting

1. **Route-Based Splitting**: Lazy load route components
   ```typescript
   import { lazy, Suspense } from 'react';

   const ReportsPage = lazy(() => import('./pages/ReportsPage'));
   const DashboardPage = lazy(() => import('./pages/DashboardPage'));

   // In router:
   <Route path="reports" element={
     <Suspense fallback={<LoadingSpinner />}>
       <ReportsPage />
     </Suspense>
   } />
   ```

2. **Component-Based Splitting**: Lazy load large components (charts, modals)
   ```typescript
   const RechartsChart = lazy(() => import('recharts').then(m => ({ default: m.BarChart })));
   ```

3. **Vendor Splitting**: Vite automatically splits vendor code, configure manual chunks for large libraries
   ```typescript
   // vite.config.ts
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             'react-vendor': ['react', 'react-dom', 'react-router-dom'],
             'supabase': ['@supabase/supabase-js'],
             'charts': ['recharts'],
             'ui': ['@radix-ui/react-*'] // shadcn/ui primitives
           }
         }
       }
     }
   });
   ```

---

## Bundle Optimization

**Target**: <500KB gzipped initial bundle

1. **Tree Shaking**: Ensure all imports are ES modules (Vite auto tree-shakes)
2. **Minification**: Vite uses esbuild (faster than Terser)
3. **Image Optimization**: Use WebP format, lazy load images below fold
4. **Font Loading**: System fonts first, load Inter asynchronously with `font-display: swap`
5. **Remove Unused CSS**: Tailwind purges unused classes automatically
6. **Analyze Bundle**: Use `vite-plugin-bundle-analyzer` to identify bloat
   ```bash
   pnpm add -D rollup-plugin-visualizer
   pnpm run build --analyze
   ```

---
