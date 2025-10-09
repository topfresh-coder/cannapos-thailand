# Epic 1: Foundation & Core Infrastructure

**Goal**: Establish the complete project foundation including repository setup, database schema, authentication system, and deliver a working end-to-end POS transaction flow. This epic validates that the entire technology stack (React + Vite + shadcn/ui + Supabase) is operational and can support all future functionality.

## Story 1.1: Project Setup & Development Environment

As a **developer**,
I want **the project repository initialized with all build tools, linters, and dependencies configured**,
so that **the team can begin development with a consistent, production-ready environment**.

### Acceptance Criteria

1. Monorepo created with Vite 5+ build configuration for React 18+ TypeScript (strict mode)
2. Package manager set to pnpm with all core dependencies installed (React, TypeScript, Tailwind CSS, shadcn/ui)
3. ESLint and Prettier configured with project standards
4. Git repository initialized with .gitignore configured for Node.js/React projects
5. .env.example file created with placeholder keys for Supabase configuration
6. README.md includes setup instructions and environment variable documentation
7. Development server runs successfully on `pnpm dev`

## Story 1.2: Supabase Project Setup & Database Schema

As a **developer**,
I want **Supabase project configured with initial database schema for core entities**,
so that **the application has a functional backend from day one**.

### Acceptance Criteria

1. Supabase project created with project URL and anon key documented in .env.example
2. Database schema created for core tables: `users`, `locations`, `products`, `product_batches`, `transactions`, `transaction_items`, `shifts`
3. Row-Level Security (RLS) policies enabled on all tables
4. Basic RLS policies implemented for authenticated user access
5. Database migration scripts stored in `/supabase/migrations` directory
6. Supabase client initialized in React app with environment variables
7. Health check query executes successfully from React app to Supabase

## Story 1.3: Authentication System

As a **store employee**,
I want **to securely log in to the POS system using email and password**,
so that **only authorized personnel can access the system and transactions are attributed correctly**.

### Acceptance Criteria

1. Login screen created with email and password fields using shadcn/ui Form components
2. Supabase Auth integration implemented with email/password sign-in
3. Authentication state managed globally (React Context or Zustand)
4. Protected routes implemented - unauthenticated users redirected to login
5. User profile data (name, role, location_id) fetched after successful authentication
6. Logout functionality implemented with session cleanup
7. Login form validates email format and password presence before submission
8. Error messages displayed for invalid credentials or network errors
9. Successful login navigates to POS Main Screen

## Story 1.4: Basic Product Catalog Seeding

As a **developer**,
I want **sample product data seeded into the database**,
so that **POS functionality can be tested without manual data entry**.

### Acceptance Criteria

1. Seed script created with at least 10 sample products across categories (Flower, Pre-Roll, Edible, Concentrate, Other)
2. Each product includes: SKU, name, category, unit, base_price, requires_tare_weight flag
3. Products seeded with at least 2 initial batches each with quantity, cost_per_unit, received_date
4. Seed script is idempotent (can run multiple times safely)
5. Seed script executable via `pnpm seed` command
6. At least 3 flower products marked with `requires_tare_weight: true`
7. Sample location record created with name "Pilot Location - Bangkok"

## Story 1.5: POS Main Screen - Product Search & Selection

As a **cashier**,
I want **to search for products and add them to the transaction cart**,
so that **I can begin building customer orders**.

### Acceptance Criteria

1. POS Main Screen displays product search input (text search by name or SKU)
2. Product search executes real-time query against Supabase `products` table
3. Search results displayed in grid/list view showing: product name, SKU, category, available quantity, price
4. Clicking a product adds it to cart with default quantity of 1
5. Cart sidebar displays all items with: product name, quantity, unit price, line total
6. Cart shows running subtotal of all items
7. Empty state displayed when cart has no items
8. UI is responsive and touch-friendly for tablet use (minimum tap target 44px)

## Story 1.6: Cart Management & Quantity Adjustment

As a **cashier**,
I want **to adjust quantities and remove items from the cart**,
so that **I can accurately reflect customer purchase intent**.

### Acceptance Criteria

1. Each cart item displays increment (+) and decrement (−) buttons for quantity adjustment
2. Quantity can be manually edited via number input field
3. Quantity changes update line total and cart subtotal immediately
4. Remove button (X) deletes item from cart with confirmation
5. Quantity cannot be set below 1 or above available inventory
6. For flower products requiring tare weight, quantity field accepts decimal values (e.g., 3.5g)
7. Validation prevents negative or zero quantities
8. Cart persists during user session (does not clear on page refresh)

## Story 1.7: Simple Checkout & Transaction Recording

As a **cashier**,
I want **to complete the transaction and record it in the database**,
so that **inventory is updated and a receipt is generated**.

### Acceptance Criteria

1. "Complete Sale" button displayed in cart when cart has at least one item
2. Clicking "Complete Sale" creates transaction record in `transactions` table with: user_id, location_id, total_amount, payment_method (default "Cash"), timestamp
3. All cart items saved to `transaction_items` table with: transaction_id, product_id, quantity, unit_price, line_total
4. Inventory deducted from product_batches using simple LIFO (latest batch first) for this story only
5. Transaction success message displayed to user
6. Cart cleared after successful transaction
7. Receipt data prepared (transaction ID, items, totals, timestamp) for display
8. If transaction fails, error message shown and cart preserved

## Story 1.8: Receipt Display & Print Preparation

As a **cashier**,
I want **to view a receipt summary after completing a transaction**,
so that **I can verify the sale and provide confirmation to the customer**.

### Acceptance Criteria

1. Receipt screen displays after successful checkout showing:
   - Transaction ID and timestamp
   - Location name
   - Cashier name
   - Itemized list (product name, quantity, unit price, line total)
   - Subtotal
   - Total amount in Thai Baht (฿)
2. "New Transaction" button returns to POS Main Screen and clears cart
3. Receipt formatted for 80mm thermal printer width (future print integration)
4. Receipt data stored in component state for potential print/email functionality
5. Receipt screen is accessible via URL (e.g., `/receipt/:transactionId`) for re-viewing
6. Currency displayed with ฿ symbol and 2 decimal places

## Story 1.9: Navigation & Basic Layout

As a **store employee**,
I want **a consistent navigation structure across all screens**,
so that **I can easily access different parts of the system**.

### Acceptance Criteria

1. Top navigation bar includes: Logo/App name, current user name, current location, logout button
2. Side navigation menu (collapsible on mobile) with links to: POS, Products, Inventory, Shifts, Reports, Dashboard
3. Active navigation item highlighted
4. Navigation is responsive - collapses to hamburger menu on mobile/tablet
5. All navigation items route correctly (placeholder screens acceptable for non-MVP features)
6. Layout uses shadcn/ui components (Sheet, NavigationMenu, or similar)
7. Navigation persists across all authenticated screens

## Story 1.10: Deployment Pipeline & Hosting

As a **developer**,
I want **CI/CD pipeline configured for automated testing and deployment**,
so that **code changes can be deployed to production safely and quickly**.

### Acceptance Criteria

1. GitHub Actions workflow created for CI pipeline running on pull requests
2. CI pipeline executes: linting (ESLint), type checking (TypeScript), unit tests (Vitest)
3. Vercel project connected to GitHub repository for automatic deployments
4. Environment variables configured in Vercel dashboard (Supabase URL, anon key)
5. Production deployment URL accessible and functional
6. Preview deployments created automatically for pull requests
7. Build failures prevent deployment
8. README.md updated with deployment instructions and production URL

## Story 1.11: Accessibility Foundation (WCAG 2.1 AA)

As a **developer**,
I want **accessibility patterns implemented across all UI components**,
so that **the POS system is usable by all staff members, including those using assistive technologies**.

### Acceptance Criteria

1. ARIA patterns implemented for dialogs/modals (`role="dialog"`, `aria-labelledby`, `aria-describedby`, `aria-modal="true"`)
2. Live regions added for dynamic content updates (`aria-live="polite"` for cart updates, `aria-live="assertive"` for errors)
3. Form validation uses ARIA (`aria-invalid`, `aria-errormessage`, `aria-required`)
4. Keyboard navigation working for all interactive elements (Tab, Shift+Tab, Enter, Esc, Space)
5. Focus management implemented (focus trap in modals, focus restoration on close, focus on h1 on route change)
6. Global keyboard shortcuts implemented (/ for search, Esc to close modals)
7. Color contrast meets WCAG AA standards (4.5:1 for normal text, 3:1 for UI components)
8. Accessible Tailwind color tokens defined in config (primary, error, warning, success with sufficient contrast)
9. Semantic HTML structure with proper heading hierarchy (h1 → h2 → h3) and landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`)
10. axe-core integrated in CI/CD pipeline - build fails on accessibility violations
11. Manual accessibility testing checklist completed (keyboard-only navigation, screen reader testing with NVDA/VoiceOver)
12. All components pass axe-core automated tests with zero violations

**Dependencies**: `react-focus-lock`, `@axe-core/react`, `vitest-axe`

## Story 1.12: Error Handling System

As a **developer**,
I want **comprehensive error handling across all application layers**,
so that **failures are gracefully handled, logged, and presented to users with actionable recovery options**.

### Acceptance Criteria

1. Error classification types defined (Validation, Network, Business Logic, System errors)
2. AppError base class created with error codes, severity levels, user-facing messages
3. ErrorHandlerService implemented with correlation IDs for tracing
4. React ErrorBoundary component created with fallback UI and reload option
5. Supabase query wrapper (`supabaseQuery`) maps PostgreSQL errors to AppError types
6. Retry logic with exponential backoff implemented for network errors (max 3 attempts, initial 1s delay, 2x multiplier, max 10s delay)
7. Form validation errors display with ARIA attributes and user-friendly messages
8. Global error handler catches unhandled promise rejections
9. Toast notifications show for user-facing errors with recovery actions (retry, reload, logout)
10. Error messages follow user-friendly principles (clear, actionable, avoid jargon)
11. All errors logged to console (dev) and Sentry (prod) with correlation IDs
12. Non-retryable errors identified (validation, authorization, duplicate entry)

**Dependencies**: `@sentry/react`, `@sentry/tracing`

## Story 1.13: Monitoring & Observability

As a **developer**,
I want **comprehensive monitoring and alerting configured**,
so that **production issues are detected proactively before users report them**.

### Acceptance Criteria

1. Sentry integration mandatory (not optional) with DSN configured in environment variables
2. Sentry configured with Browser Tracing and Session Replay integrations
3. Error tracking captures: error type, severity, correlation ID, user ID, location ID, stack trace
4. Alert thresholds configured in Sentry:
   - Uptime <99% (24-hour window) → Page on-call
   - Error rate >1% (5-minute window) → Slack alert
   - p95 latency >3s → Slack alert
   - Critical errors (any instance) → Immediate page
5. Structured logging implemented with log format (timestamp, level, correlationId, userId, locationId, message, error)
6. Log levels defined (DEBUG dev-only, INFO operations, WARN potential issues, ERROR failures, CRITICAL system failures)
7. Operational dashboard specification documented with real-time metrics (shift status, transactions/hour, error count, active users)
8. Key metrics defined:
   - Business: Transactions/hour, average transaction value, shift variance frequency
   - Technical: Error rate %, API latency (p50, p95, p99), page load time (LCP)
   - System: Database connections, cache hit rate, WebSocket connections
9. Vercel Analytics enabled with Web Vitals tracking
10. Supabase Dashboard alerts configured (Database CPU >80%, Connection pool >90%, Slow queries >5s)

**Dependencies**: `@sentry/react@latest`, `@sentry/tracing@latest`, `web-vitals`

## Story 1.14: Deployment & Performance Budgets

As a **developer**,
I want **deployment rollback procedures and automated performance budgets enforced**,
so that **failed deployments can be quickly reverted and performance regressions are prevented**.

### Acceptance Criteria

1. Deployment rollback procedures documented:
   - Frontend: Vercel dashboard rollback (instant) OR Git revert + push (1-2 min)
   - Database: Down migration scripts for every up migration
2. Disaster recovery runbook created with backup strategy, restoration procedures, RPO 24h, RTO 1h
3. Down migration template created and tested in staging
4. Bundle size check added to CI/CD (fails if >500KB gzipped JavaScript)
5. Lighthouse CI configured with performance thresholds:
   - Performance score >90
   - Accessibility score >90
   - LCP <2.5s
   - CLS <0.1
6. Core Web Vitals targets defined: FCP <1.8s, LCP <2.5s, FID <100ms, CLS <0.1, TTI <3.0s
7. GitHub Actions workflow includes bundle size check and Lighthouse CI
8. Web Vitals monitoring implemented in production (tracked via Vercel Analytics)
9. Performance dashboard tracking: LCP/FID/CLS trends, bundle size over time, Lighthouse scores per deployment
10. lighthouserc.json configuration file created with assertions
11. Backup restoration tested successfully in staging environment
12. Performance budget violations fail CI/CD builds

**Dependencies**: `@lhci/cli` (Lighthouse CI), bundle size analysis scripts

---
