# Troubleshooting Guide

This guide covers common issues encountered during development and deployment of the CannaPOS Thailand application.

## Table of Contents

- [Development Environment Issues](#development-environment-issues)
- [Build and TypeScript Issues](#build-and-typescript-issues)
- [Supabase Connection Issues](#supabase-connection-issues)
- [Testing Issues](#testing-issues)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)

---

## Development Environment Issues

### Issue: Development server won't start

**Symptoms**:
```
Error: Cannot find module '@vitejs/plugin-react'
ENOENT: no such file or directory
```

**Root Cause**: Missing or corrupted dependencies in `node_modules`

**Solution**:
```bash
# Delete all node_modules
rm -rf node_modules apps/web/node_modules packages/shared-types/node_modules

# Clear package manager cache
npm cache clean --force
# or
pnpm store prune

# Reinstall dependencies
npm install
# or
pnpm install
```

**Verification**:
```bash
npm run dev
# Should start successfully on port 5173
```

---

### Issue: Environment variables not loading

**Symptoms**:
- `import.meta.env.VITE_SUPABASE_URL` returns `undefined`
- Console error: "Supabase client configuration error"
- Network errors when trying to connect to Supabase

**Root Causes**:
1. `.env` file doesn't exist
2. Environment variable names don't have `VITE_` prefix
3. Dev server wasn't restarted after `.env` changes
4. Quotes around values in `.env` file

**Solutions**:

1. **Verify `.env` file exists**:
   ```bash
   ls -la apps/web/.env
   # If not found, copy from example:
   cp apps/web/.env.example apps/web/.env
   ```

2. **Check variable names have `VITE_` prefix**:
   ```env
   # Correct (exposed to client)
   VITE_SUPABASE_URL=https://xyz.supabase.co
   VITE_SUPABASE_ANON_KEY=your-key

   # Incorrect (not exposed to client)
   SUPABASE_URL=https://xyz.supabase.co
   ```

3. **Restart development server** (Vite only loads `.env` on startup):
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Remove quotes from values**:
   ```env
   # Correct
   VITE_SUPABASE_URL=https://xyz.supabase.co

   # Incorrect
   VITE_SUPABASE_URL="https://xyz.supabase.co"
   ```

**Verification**:
Open browser console and check:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
// Should print your Supabase URL, not undefined
```

---

### Issue: Hot Module Replacement (HMR) not working

**Symptoms**:
- File changes don't reflect in browser
- Must manually refresh browser to see changes
- Console shows "Full reload required"

**Root Causes**:
1. Path alias configuration mismatch
2. File watchers limit exceeded (Linux)
3. Vite cache corruption

**Solutions**:

1. **Clear Vite cache**:
   ```bash
   rm -rf apps/web/node_modules/.vite
   npm run dev
   ```

2. **Increase file watchers limit** (Linux/WSL only):
   ```bash
   # Check current limit
   cat /proc/sys/fs/inotify/max_user_watches

   # Increase limit temporarily
   sudo sysctl fs.inotify.max_user_watches=524288

   # Make permanent
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

3. **Verify path alias configuration**:
   Check that `vite.config.ts` and `tsconfig.json` have matching aliases:
   ```typescript
   // vite.config.ts
   resolve: {
     alias: {
       '@': path.resolve(__dirname, './src'),
     },
   }
   ```

   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

---

### Issue: Port 5173 already in use

**Symptoms**:
```
Error: Port 5173 is already in use
```

**Solutions**:

1. **Kill existing process** (find and stop):
   ```bash
   # Find process using port 5173
   lsof -i :5173
   # or on Windows
   netstat -ano | findstr :5173

   # Kill process by PID
   kill -9 <PID>
   # or on Windows
   taskkill /PID <PID> /F
   ```

2. **Use different port**:
   Edit `vite.config.ts`:
   ```typescript
   export default defineConfig({
     server: {
       port: 3000, // Change to different port
     },
   });
   ```

3. **Let Vite auto-assign port**:
   Remove `port` configuration entirely, Vite will find next available port.

---

## Build and TypeScript Issues

### Issue: Build fails with TypeScript errors

**Symptoms**:
```
npm run build
TS2345: Argument of type 'string' is not assignable to parameter of type 'number'
TS2322: Type 'undefined' is not assignable to type 'string'
```

**Root Cause**: TypeScript strict mode catches type errors

**Solutions**:

1. **Run type check to see all errors**:
   ```bash
   npm run type-check
   ```

2. **Fix type errors**:
   ```typescript
   // Bad: Implicit any
   function formatPrice(price) {
     return `฿${price}`;
   }

   // Good: Explicit types
   function formatPrice(price: number): string {
     return `฿${price.toFixed(2)}`;
   }

   // Bad: Potentially undefined
   const user = users.find(u => u.id === id);
   console.log(user.name); // Error if undefined

   // Good: Handle undefined
   const user = users.find(u => u.id === id);
   if (user) {
     console.log(user.name);
   }

   // Or use optional chaining
   console.log(user?.name);
   ```

3. **Common type fixes**:
   ```typescript
   // Fix: any type
   // Before
   const data: any = await fetchData();

   // After
   interface DataResponse {
     items: Product[];
     total: number;
   }
   const data: DataResponse = await fetchData();

   // Fix: null/undefined handling
   // Before
   function getUsername(user) {
     return user.name;
   }

   // After
   function getUsername(user: User | null): string {
     return user?.name ?? 'Guest';
   }

   // Fix: array methods
   // Before
   const ids = items.map(item => item.id);

   // After
   const ids: string[] = items.map((item: Item) => item.id);
   ```

**Verification**:
```bash
npm run type-check
# Should show 0 errors

npm run build
# Should complete successfully
```

---

### Issue: ESLint errors on fresh install

**Symptoms**:
```
Failed to load config "react-app"
Parsing error: Cannot find module '@typescript-eslint/parser'
```

**Root Cause**: Missing ESLint dependencies or configuration mismatch

**Solutions**:

1. **Run ESLint with auto-fix**:
   ```bash
   cd apps/web
   npm run lint -- --fix
   ```

2. **Reinstall ESLint dependencies**:
   ```bash
   npm install --save-dev eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh
   ```

3. **Verify `eslint.config.js` configuration**:
   ```javascript
   import js from '@eslint/js';
   import globals from 'globals';
   import reactHooks from 'eslint-plugin-react-hooks';
   import reactRefresh from 'eslint-plugin-react-refresh';
   import tseslint from 'typescript-eslint';

   export default tseslint.config(
     { ignores: ['dist'] },
     {
       extends: [js.configs.recommended, ...tseslint.configs.recommended],
       files: ['**/*.{ts,tsx}'],
       languageOptions: {
         ecmaVersion: 2020,
         globals: globals.browser,
       },
       plugins: {
         'react-hooks': reactHooks,
         'react-refresh': reactRefresh,
       },
       rules: {
         ...reactHooks.configs.recommended.rules,
         'react-refresh/only-export-components': [
           'warn',
           { allowConstantExport: true },
         ],
       },
     },
   );
   ```

---

### Issue: Prettier conflicts with ESLint

**Symptoms**:
- Code formatted by Prettier triggers ESLint errors
- `npm run lint` fails after `npm run format`

**Root Cause**: Conflicting rules between ESLint and Prettier

**Solutions**:

1. **Install `eslint-config-prettier`** (disables conflicting rules):
   ```bash
   npm install --save-dev eslint-config-prettier
   ```

2. **Run format and lint in correct order**:
   ```bash
   npm run format  # Prettier first
   npm run lint    # Then ESLint
   ```

3. **Configure VS Code** to run both on save:
   ```json
   // .vscode/settings.json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   ```

---

## Supabase Connection Issues

### Issue: Supabase connection fails with network error

**Symptoms**:
```
FetchError: request to https://xyz.supabase.co failed
Error: Failed to fetch
```

**Root Causes**:
1. Incorrect Supabase URL or anon key
2. Supabase project paused (free tier inactivity)
3. Network/firewall blocking connection
4. CORS misconfiguration

**Solutions**:

1. **Verify Supabase credentials**:
   - Open Supabase dashboard > Settings > API
   - Compare URL and anon key with `.env` file
   - Ensure no extra spaces or quotes

2. **Check Supabase project status**:
   - Open Supabase dashboard
   - Look for "Project paused" banner
   - If paused, click "Restore project" (free tier)

3. **Test connection manually**:
   ```typescript
   // Add to App.tsx temporarily
   import { supabase } from '@/lib/supabase';

   useEffect(() => {
     async function testConnection() {
       const { data, error } = await supabase.from('users').select('count');
       console.log('Supabase connection test:', { data, error });
     }
     testConnection();
   }, []);
   ```

4. **Check CORS configuration**:
   - Supabase dashboard > Authentication > URL Configuration
   - Add your local development URL: `http://localhost:5173`
   - Add Vercel production URL when deploying

5. **Verify API is enabled**:
   - Supabase dashboard > Settings > API
   - Ensure "API Settings" shows project is active
   - Check if IP restrictions are enabled (disable for development)

---

### Issue: RLS (Row Level Security) policy blocking queries

**Symptoms**:
```
Error: new row violates row-level security policy for table "products"
Error: permission denied for table "transactions"
```

**Root Cause**: RLS policies are correctly blocking unauthorized access

**Solutions**:

1. **Check authentication status**:
   ```typescript
   const { data: { session } } = await supabase.auth.getSession();
   console.log('Current session:', session);
   // Should show user object if logged in
   ```

2. **Review RLS policies** in Supabase dashboard:
   - Database > Tables > [table name] > Policies tab
   - Verify policies match your use case

3. **Test queries with service role** (temporary debugging only):
   ```typescript
   // ⚠️ NEVER use service role in production client code
   // Only for debugging RLS policies locally

   import { createClient } from '@supabase/supabase-js';

   const supabaseAdmin = createClient(
     process.env.VITE_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY! // Get from Supabase dashboard
   );

   const { data, error } = await supabaseAdmin
     .from('products')
     .select('*');

   console.log('Admin query result:', { data, error });
   ```

4. **Common RLS policy fixes**:
   ```sql
   -- Allow authenticated users to read all products
   CREATE POLICY "Users can view products"
   ON products FOR SELECT
   USING (auth.role() = 'authenticated');

   -- Allow users to read only their location's data
   CREATE POLICY "Users can view their location's transactions"
   ON transactions FOR SELECT
   USING (
     location_id IN (
       SELECT location_id FROM user_locations
       WHERE user_id = auth.uid()
     )
   );
   ```

---

## Testing Issues

### Issue: TypeScript errors in test files

**Symptoms**:
```
Cannot find name 'describe'
Cannot find name 'it'
Cannot find name 'expect'
Cannot find name 'vi'
```

**Root Cause**: Vitest globals not enabled

**Solution**:
Ensure `globals: true` in `vitest.config.ts`:
```typescript
export default defineConfig({
  test: {
    globals: true, // Enables describe, it, expect, vi globally
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

If still not working, add explicit import:
```typescript
import { describe, it, expect, vi } from 'vitest';
```

---

### Issue: Tests fail with "Cannot find module '@/lib/supabase'"

**Symptoms**:
```
Error: Cannot find module '@/lib/supabase'
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@'
```

**Root Cause**: Path alias not configured in Vitest

**Solution**:
Add path alias resolution to `vitest.config.ts`:
```typescript
import path from 'path';

export default defineConfig({
  test: {
    // ... other config
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Verification**:
```bash
npm run test
# Tests should now find @/ imports
```

---

### Issue: React Testing Library errors

**Symptoms**:
```
Error: could not find react-dom/test-utils
Error: The above error occurred in the <YourComponent> component
```

**Root Causes**:
1. Missing `@testing-library/react` or wrong version
2. Missing test setup file
3. Component errors not caught

**Solutions**:

1. **Verify testing library versions**:
   ```bash
   npm list @testing-library/react @testing-library/jest-dom jsdom
   # Should show:
   # @testing-library/react@16.1.0
   # @testing-library/jest-dom@6.6.3
   # jsdom@25.0.1
   ```

2. **Ensure test setup file exists** (`src/test/setup.ts`):
   ```typescript
   import '@testing-library/jest-dom';
   import { expect, afterEach, vi } from 'vitest';
   import { cleanup } from '@testing-library/react';
   import * as matchers from '@testing-library/jest-dom/matchers';

   expect.extend(matchers);

   afterEach(() => {
     cleanup();
   });

   // Mock window.matchMedia
   Object.defineProperty(window, 'matchMedia', {
     writable: true,
     value: vi.fn().mockImplementation(query => ({
       matches: false,
       media: query,
       onchange: null,
       addListener: vi.fn(),
       removeListener: vi.fn(),
       addEventListener: vi.fn(),
       removeEventListener: vi.fn(),
       dispatchEvent: vi.fn(),
     })),
   });
   ```

3. **Wrap component tests properly**:
   ```typescript
   import { render, screen } from '@testing-library/react';
   import { BrowserRouter } from 'react-router-dom';

   describe('MyComponent', () => {
     it('renders correctly', () => {
       render(
         <BrowserRouter>
           <MyComponent />
         </BrowserRouter>
       );

       expect(screen.getByText('Expected Text')).toBeInTheDocument();
     });
   });
   ```

---

## Deployment Issues

### Issue: Vercel build fails

**Symptoms**:
```
Error: Build exceeded maximum duration
Error: Command "npm run build" exited with 1
```

**Root Causes**:
1. Build command incorrect
2. Root directory not set
3. Environment variables missing
4. Build timeouts (large dependencies)

**Solutions**:

1. **Verify Vercel project settings**:
   - Framework Preset: Vite
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Add environment variables in Vercel**:
   - Vercel dashboard > Settings > Environment Variables
   - Add: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Apply to: Production, Preview, Development

3. **Check build locally first**:
   ```bash
   cd apps/web
   npm run build
   # Should succeed without errors
   ```

4. **Optimize build performance**:
   ```typescript
   // vite.config.ts
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom', 'react-router-dom'],
             supabase: ['@supabase/supabase-js'],
           },
         },
       },
       chunkSizeWarningLimit: 1000,
     },
   });
   ```

---

### Issue: Production app shows blank page

**Symptoms**:
- Vercel deployment succeeds
- Production URL loads but shows blank page
- Console shows errors

**Root Causes**:
1. Environment variables not set in Vercel
2. Build artifacts not generated correctly
3. Routing configuration issue

**Solutions**:

1. **Check browser console** for errors:
   - Open DevTools (F12)
   - Look for red errors
   - Common: "Failed to fetch", "404 Not Found"

2. **Verify environment variables in Vercel**:
   ```bash
   # In Vercel, check logs show:
   VITE_SUPABASE_URL=https://xyz.supabase.co (loaded)
   ```

3. **Check Vercel build logs**:
   - Vercel dashboard > Deployments > [latest] > Building
   - Look for warnings or errors
   - Verify `dist/` folder was created

4. **Test production build locally**:
   ```bash
   npm run build
   npm run preview
   # Open http://localhost:4173
   # Should work the same as production
   ```

5. **Add `vercel.json` for SPA routing**:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

---

## Performance Issues

### Issue: Slow page load times

**Symptoms**:
- Initial page load takes >3 seconds
- Lighthouse performance score <50

**Solutions**:

1. **Analyze bundle size**:
   ```bash
   npm run build
   # Check output for chunk sizes
   # Look for chunks >500KB
   ```

2. **Implement code splitting**:
   ```typescript
   // Use React.lazy for route-based code splitting
   import { lazy, Suspense } from 'react';

   const POSPage = lazy(() => import('@/pages/POSPage'));
   const ReportsPage = lazy(() => import('@/pages/ReportsPage'));

   function App() {
     return (
       <Suspense fallback={<Loading />}>
         <Routes>
           <Route path="/pos" element={<POSPage />} />
           <Route path="/reports" element={<ReportsPage />} />
         </Routes>
       </Suspense>
     );
   }
   ```

3. **Optimize images**:
   - Use WebP format
   - Compress images before uploading
   - Use lazy loading: `<img loading="lazy" />`

4. **Enable production optimizations** in `vite.config.ts`:
   ```typescript
   export default defineConfig({
     build: {
       minify: 'terser',
       terserOptions: {
         compress: {
           drop_console: true, // Remove console.logs
         },
       },
     },
   });
   ```

---

### Issue: Supabase queries are slow

**Symptoms**:
- Database queries take >1 second
- UI feels sluggish when loading data

**Solutions**:

1. **Add database indexes**:
   ```sql
   -- Index frequently queried columns
   CREATE INDEX idx_transactions_location_id
   ON transactions(location_id);

   CREATE INDEX idx_transactions_created_at
   ON transactions(created_at DESC);

   CREATE INDEX idx_products_sku
   ON products(sku);
   ```

2. **Use query optimization**:
   ```typescript
   // Bad: Fetching all columns and all rows
   const { data } = await supabase
     .from('products')
     .select('*');

   // Good: Select only needed columns and add filters
   const { data } = await supabase
     .from('products')
     .select('id, name, price, stock_quantity')
     .eq('location_id', locationId)
     .limit(50);
   ```

3. **Implement pagination**:
   ```typescript
   const PAGE_SIZE = 20;

   const { data, count } = await supabase
     .from('transactions')
     .select('*', { count: 'exact' })
     .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
     .order('created_at', { ascending: false });
   ```

4. **Use real-time subscriptions sparingly**:
   ```typescript
   // Only subscribe to critical data
   const subscription = supabase
     .channel('current-shift')
     .on(
       'postgres_changes',
       {
         event: '*',
         schema: 'public',
         table: 'shifts',
         filter: `status=eq.open`,
       },
       (payload) => {
         // Update UI with new data
       }
     )
     .subscribe();

   // Clean up when component unmounts
   return () => {
     subscription.unsubscribe();
   };
   ```

---

## Getting Additional Help

If you encounter an issue not covered in this guide:

1. **Check project documentation**:
   - [Technical Architecture](./architecture.md)
   - [PRD](./prd.md)
   - [Story Details](./stories/)

2. **Check Supabase documentation**:
   - [Supabase Docs](https://supabase.com/docs)
   - [Supabase Discord](https://discord.supabase.com)

3. **Check Vite documentation**:
   - [Vite Docs](https://vitejs.dev)
   - [Vite Troubleshooting](https://vitejs.dev/guide/troubleshooting.html)

4. **Enable verbose logging**:
   ```bash
   # Vite verbose mode
   npm run dev -- --debug

   # Supabase client verbose mode
   const supabase = createClient(url, key, {
     auth: {
       debug: true,
     },
   });
   ```

5. **Create a minimal reproduction**:
   - Isolate the issue in a small test case
   - Share code snippet with team
   - Include error messages and logs
