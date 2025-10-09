# Application Architecture

## Component Structure

```
apps/web/src/
├── components/
│   ├── ui/                      # shadcn/ui components (Button, Input, Dialog, etc.)
│   ├── pos/                     # POS-specific components
│   │   ├── CartSidebar.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── TierIndicator.tsx
│   │   ├── TareWeightModal.tsx
│   │   └── ShiftStatusBar.tsx
│   ├── shift/                   # Shift reconciliation components
│   │   ├── ShiftOpenModal.tsx
│   │   ├── ShiftCloseModal.tsx
│   │   ├── ShiftSummaryCard.tsx
│   │   └── VarianceBadge.tsx
│   ├── inventory/               # Inventory management components
│   │   ├── ProductList.tsx
│   │   ├── ProductForm.tsx
│   │   ├── BatchReceiveForm.tsx
│   │   ├── StockCountScreen.tsx
│   │   └── BatchHistoryTable.tsx
│   ├── reports/                 # Reporting components
│   │   ├── ReportHub.tsx
│   │   ├── ReportViewer.tsx
│   │   ├── SalesByCategoryReport.tsx
│   │   └── [other reports...]
│   ├── layout/                  # Layout components
│   │   ├── Navigation.tsx
│   │   ├── Header.tsx
│   │   └── ProtectedRoute.tsx
│   └── shared/                  # Shared utility components
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── Toast.tsx
├── pages/                       # Route components
│   ├── LoginPage.tsx
│   ├── POSPage.tsx              # Main POS screen
│   ├── ProductsPage.tsx
│   ├── InventoryPage.tsx
│   ├── ShiftsPage.tsx
│   ├── ReportsPage.tsx
│   ├── DashboardPage.tsx
│   └── SettingsPage.tsx
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts               # Authentication hook
│   ├── useCart.ts               # Cart state hook (Zustand)
│   ├── useSupabase.ts           # Supabase client hook
│   ├── useTierPricing.ts        # Tier pricing calculation hook
│   ├── useFIFO.ts               # FIFO allocation hook
│   └── useRealtime.ts           # Supabase realtime subscription hook
├── services/                    # API service layer (Supabase queries)
│   ├── supabase.ts              # Supabase client initialization
│   ├── auth.service.ts          # Authentication services
│   ├── products.service.ts      # Product CRUD
│   ├── batches.service.ts       # Batch management
│   ├── transactions.service.ts  # Transaction creation
│   ├── shifts.service.ts        # Shift operations
│   ├── tiers.service.ts         # Tier pricing queries
│   ├── inventory.service.ts     # Inventory adjustments
│   ├── stockCounts.service.ts   # Stock count operations
│   └── reports.service.ts       # Report data queries
├── stores/                      # Zustand stores
│   ├── cartStore.ts             # Cart state (items, tier, totals)
│   ├── shiftStore.ts            # Current shift state
│   └── uiStore.ts               # UI state (modals, drawers)
├── contexts/                    # React contexts
│   ├── AuthContext.tsx          # Auth state (user, role, location)
│   └── SupabaseContext.tsx      # Supabase client provider
├── utils/                       # Utility functions
│   ├── tierPricing.ts           # Tier calculation algorithm
│   ├── fifoAllocation.ts        # FIFO allocation algorithm
│   ├── currency.ts              # Currency formatting (฿)
│   ├── date.ts                  # Date formatting (CE dates)
│   └── validation.ts            # Zod schemas
├── types/                       # Local TypeScript types (supplement shared-types)
│   ├── supabase.ts              # Auto-generated from Supabase CLI
│   └── ui.ts                    # UI-specific types
├── styles/                      # Global styles
│   ├── globals.css              # Tailwind imports, global styles
│   └── themes.css               # shadcn/ui theme variables
├── App.tsx                      # Root component, router setup
└── main.tsx                     # Entry point, React render
```

## State Management Patterns

**Global State (React Context)**:
- **AuthContext**: User authentication, role, location - shared across entire app
  ```typescript
  interface AuthContextValue {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
  }
  ```

**Client State (Zustand)**:
- **Cart Store**: POS cart items, tier calculation, totals - high-frequency updates, isolated from other state
  ```typescript
  interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity: number, tareData?: TareData) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    calculateTier: () => PricingTier | null;
    getTotalFlowerWeight: () => number;
    getSubtotal: () => number;
    clear: () => void;
  }
  ```

- **Shift Store**: Current shift data for shift status bar
  ```typescript
  interface ShiftState {
    currentShift: Shift | null;
    setShift: (shift: Shift | null) => void;
    refreshShift: () => Promise<void>;
  }
  ```

**Server State (Supabase + React Query - optional for Epic 1, consider for Epic 6)**:
- Products, batches, transactions fetched via Supabase client
- Real-time subscriptions for live updates (cart sync, shift dashboard)
- For MVP: Direct Supabase queries in service layer
- Future: React Query for caching and background updates

**Routing Strategy**:
- React Router v6 with nested routes
- Protected routes wrapped in `<ProtectedRoute>` component (checks auth, shift status)
- Route structure:
  ```typescript
  <Route path="/" element={<Layout />}>
    <Route index element={<Navigate to="/pos" />} />
    <Route path="login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="pos" element={<POSPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="products/:id" element={<ProductDetailPage />} />
      <Route path="inventory" element={<InventoryPage />} />
      <Route path="shifts" element={<ShiftsPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
  </Route>
  ```

---
