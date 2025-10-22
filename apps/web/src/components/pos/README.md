# POS Components

React components for the Point-of-Sale interface (Story 1.5).

## Component Architecture

This module follows atomic design principles with a clear component hierarchy:

```
POSPage (Page/Template)
├── ProductSearch (Organism)
├── ProductGrid (Organism)
│   └── ProductCard (Molecule)
└── CartSidebar (Organism)
    └── CartItem (Molecule)
```

## Components

### POSPage (`/pages/POSPage.tsx`)
Main route component implementing responsive two-column layout:
- **Main content area**: Product search and grid
- **Cart sidebar**: Shopping cart with items and subtotal
- **Responsive**: Full-width on mobile, two-column on tablet/desktop

### ProductSearch (`ProductSearch.tsx`)
Search input component with real-time filtering:
- Text input for searching by product name or SKU
- Loading state indicator
- Keyboard shortcut "/" to focus search
- ARIA labels for accessibility

### ProductGrid (`ProductGrid.tsx`)
Responsive grid layout for displaying products:
- Responsive grid: 2 cols (mobile), 3 cols (tablet), 4 cols (desktop)
- Loading skeleton state
- Empty state with helpful message
- ARIA region labeling

### ProductCard (`ProductCard.tsx`)
Individual product display card:
- Product name, SKU, category badge, available quantity, price
- Touch-friendly design (minimum 44px tap target)
- Out-of-stock badge and disabled state
- Hover and focus styles for keyboard navigation
- Click to add to cart

### CartSidebar (`CartSidebar.tsx`)
Shopping cart sidebar display:
- Cart header with item count badge
- Scrollable list of cart items
- Running subtotal display
- Empty state with icon and message
- ARIA live region for screen reader updates
- Semantic `<aside>` element

### CartItem (`CartItem.tsx`)
Individual cart item row:
- Product name, SKU, quantity, unit price, line total
- Quantity increase/decrease controls
- Remove item button
- Proper ARIA labels

## Type Definitions

All component props and data types are defined in `types.ts`:

### Core Types
- `Product` - Product database table type
- `ProductBatch` - Product batch database table type
- `ProductWithAvailability` - Extended product with calculated available quantity
- `CartItem` - Shopping cart item with product, quantity, pricing

### Component Props
- `ProductSearchProps`
- `ProductGridProps`
- `ProductCardProps`
- `CartSidebarProps`
- `CartItemProps`

## Usage Example

```tsx
import { ProductSearch, ProductGrid, CartSidebar } from '@/components/pos';
import type { ProductWithAvailability, CartItem } from '@/components/pos';

function POSPage() {
  const [products, setProducts] = useState<ProductWithAvailability[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  return (
    <div className="flex h-screen">
      <main className="flex-1">
        <ProductSearch onSearch={handleSearch} />
        <ProductGrid products={products} onAddToCart={handleAddToCart} />
      </main>
      <aside className="w-96">
        <CartSidebar items={cartItems} subtotal={calculateSubtotal()} />
      </aside>
    </div>
  );
}
```

## Implementation Status

### ✅ Completed (Story 1.5 - Scaffold)
- Component structure and layout
- TypeScript interfaces and types
- Semantic HTML with proper ARIA attributes
- Responsive Tailwind CSS layout
- Placeholder state management

### 🚧 To Be Implemented (Future Stories)
- Real-time product search with Supabase queries
- Debounced search (300ms) using `useDebounce` hook
- Zustand cart store integration
- Toast notifications for cart actions
- Error boundaries for resilient UI
- Loading skeletons with actual data
- Keyboard navigation (Tab, Enter, "/" shortcut)
- Product service layer (`services/products.service.ts`)
- Currency formatting utility (`utils/currency.ts`)

## Accessibility Features

All components implement WCAG 2.1 AA standards:

- **Semantic HTML**: `<main>`, `<aside>`, `<header>`, proper heading hierarchy
- **ARIA Labels**: All interactive elements have descriptive labels
- **ARIA Live Regions**: Cart updates announced to screen readers
- **Keyboard Navigation**: Tab, Shift+Tab, Enter, "/" shortcut (to be implemented)
- **Focus Management**: Visible focus indicators (2px outline, 3:1 contrast)
- **Touch-Friendly**: Minimum 44px tap targets on all interactive elements
- **Color Contrast**: Meets WCAG AA standards (4.5:1 text, 3:1 UI components)

## Responsive Design

### Breakpoints (Tailwind CSS)
- **Mobile** (<768px): Stacked layout, 2-column product grid
- **Tablet** (768px-1024px): Two-column layout, 3-column product grid
- **Desktop** (>1024px): Two-column layout, 4-column product grid, 384px cart sidebar

### Layout Behavior
- Product grid uses responsive columns with gap spacing
- Cart sidebar: Full-width drawer on mobile, fixed sidebar on desktop
- All tap targets minimum 44px for touch interaction
- Scrollable areas for long product lists and cart items

## TypeScript Standards

All components follow strict TypeScript practices:
- Zero `any` types (use `unknown` with type guards)
- All props typed with interfaces
- All event handlers use proper React event types
- All functions have return type annotations
- Strict null checks enabled

## File Structure

```
apps/web/src/
├── components/
│   └── pos/
│       ├── types.ts              # Type definitions
│       ├── ProductSearch.tsx     # Search input component
│       ├── ProductGrid.tsx       # Product grid layout
│       ├── ProductCard.tsx       # Individual product card
│       ├── CartSidebar.tsx       # Cart sidebar container
│       ├── CartItem.tsx          # Individual cart item
│       ├── index.ts              # Barrel exports
│       └── README.md             # This file
└── pages/
    └── POSPage.tsx               # Main POS route component
```

## Dependencies

- React 18.2+
- TypeScript 5.3+
- Tailwind CSS 3.4+
- Supabase client (for future data fetching)
- Zustand (for future cart state management)

## Testing Strategy

Components are designed to be testable:
- Props-based rendering (no tight coupling)
- Clear interfaces for all data contracts
- Event callbacks for parent component integration
- Accessible DOM structure for testing library queries

## Next Steps

1. Implement `useDebounce` hook for search
2. Create `products.service.ts` with Supabase queries
3. Implement Zustand cart store (`stores/cartStore.ts`)
4. Add toast notifications with shadcn/ui Toast
5. Implement error boundaries around POSPage
6. Add keyboard navigation handlers
7. Create currency formatting utility
8. Write component tests and accessibility tests

## Related Documentation

- Story: `docs/stories/1.5.pos-main-screen-product-search-selection.md`
- Architecture: `docs/architecture/application-architecture.md`
- Coding Standards: `docs/architecture/coding-standards.md`
- Accessibility: `docs/architecture/accessibility-implementation-wcag-21-aa.md`
