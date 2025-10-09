# Cannabis Dispensary POS System - Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Eliminate pricing calculation errors through automated tiered pricing engine
- Prevent revenue leakage by implementing mandatory shift-to-shift reconciliation
- Enable accurate profitability tracking through FIFO inventory management
- Provide operational visibility through comprehensive reporting suite (10 MVP reports)
- Support mobile-first operations with tablet-optimized interface
- Deliver production-ready system in 12 weeks using single-phase integrated development

### Background Context

Thailand's cannabis dispensaries face unique operational challenges due to specialized product handling requirements and regulatory compliance needs. Current manual processes result in significant operational inefficiencies and revenue loss.

As documented in the Project Brief, these manual processes result in:
- **3-8% inventory shrinkage** due to lack of shift-to-shift reconciliation and accountability gaps
- **15-20% pricing calculation errors** from manual tiered pricing based on total flower weight
- **Inability to track profitability** due to lack of FIFO cost basis for inventory valuation
- **Limited operational visibility** without standardized reporting on sales, inventory, and employee performance

This PRD delivers an integrated POS solution that addresses these critical pain points through automated tiered pricing, mandatory shift reconciliation, FIFO inventory allocation, tare weight handling for accurate flower product measurement, and comprehensive reporting capabilities. The system will be built using modern web technologies (React, shadcn/ui, Supabase) with a mobile-first approach to support tablet-based operations in retail environments.

### Future Enhancements (Post-MVP)

The following features are intentionally out of scope for MVP but planned for future iterations:

- **Loyalty Programs**: Customer points, rewards, discount codes
- **Promotions & Bundle Pricing**: BOGO offers, time-based discounts, seasonal pricing
- **Thai Language Support**: Full UI translation to Thai for local staff
- **Customer-Facing Display**: Secondary screen showing cart and totals to customers
- **Advanced Analytics**: Predictive inventory, demand forecasting, ABC analysis
- **Employee Scheduling**: Shift planning, time tracking, labor cost management
- **Multi-Currency Support**: USD, EUR for tourist-heavy locations
- **E-Commerce Integration**: Online ordering, delivery coordination, pickup notifications
- **Supplier Management**: Purchase orders, supplier performance tracking
- **Customer Accounts**: Member profiles, purchase history, personalized recommendations

### Change Log

| Date       | Version | Description                          | Author |
| ---------- | ------- | ------------------------------------ | ------ |
| 2025-01-10 | 1.0     | Initial PRD created from Brief v1.1  | John   |

---

## Requirements

### Functional Requirements

**FR1**: The POS system allows cashiers to search for products by name or SKU with real-time filtering.

**FR2**: Products can be added to a shopping cart with quantity selection (supports decimals for weight-based items like flower).

**FR3**: The cart displays all items with: product name, quantity, unit price, line total, and running subtotal.

**FR4**: For flower products, the system calculates tiered pricing based on total flower weight in cart, automatically applying the appropriate price per gram from the pricing tiers table.

**FR5**: The tier pricing indicator displays current tier, price per gram, and weight range in the cart.

**FR6**: The system shows how much more weight is needed to reach the next tier with estimated savings.

**FR7**: Cashiers can adjust quantities and remove items from the cart with real-time price recalculation.

**FR8**: For flower products requiring tare weight, a modal prompts for gross weight and tare weight, calculating net weight automatically (net = gross - tare).

**FR9**: Checkout creates a transaction record with all items, totals, payment method, timestamp, and assigns to currently active shift.

**FR10**: Receipts display transaction details including: items, quantities, prices (with tier information for flower), totals, cashier name, location, timestamp.

**FR11**: Store managers can configure pricing tiers with: tier name, min/max weight ranges, price per gram.

**FR12**: The system validates tier ranges to prevent overlaps and ensure no gaps in coverage.

**FR13**: Managers can override prices on individual cart items with authorization and mandatory reason documentation.

**FR14**: Users authenticate via email and password using Supabase Auth with session management.

**FR15**: Cashiers must open their shift by entering starting cash float before POS access is granted.

**FR16**: Only one shift can be open per location at a time; previous shift must be closed before opening new shift.

**FR17**: All transactions are automatically assigned to the currently active shift.

**FR18**: Cashiers close shifts by entering actual cash count; system calculates variance (actual - expected).

**FR19**: Shifts with variance >฿50 require mandatory variance reason entry.

**FR20**: Shift closures require manager approval before shift is finalized.

**FR21**: Managers can review pending shift reconciliations with full transaction history drilldown.

**FR22**: Managers can force-close shifts left open >24 hours with override documentation.

**FR23**: Cashiers can leave handoff notes for the next shift during shift close.

**FR24**: Store managers can create new products with: SKU, name, category, unit, base price, tare weight requirement flag.

**FR25**: Products can be edited (except SKU) and soft-deleted (marked inactive rather than hard delete).

**FR26**: Product detail view displays all associated batches with: batch number, received date, quantity received, quantity remaining, cost per unit, status.

**FR27**: Store managers can receive new product batches with: quantity, cost per unit, received date; batch numbers auto-generated.

**FR28**: The product catalog displays total available quantity across all active batches.

**FR29**: Products with available quantity below reorder threshold display low stock warnings.

**FR30**: Out-of-stock products (quantity = 0) are visually flagged and cannot be added to cart.

**FR31**: When transactions are completed, inventory is allocated from batches using FIFO (First-In-First-Out) based on received_date ascending.

**FR32**: If a single batch has sufficient quantity, full allocation comes from that batch; otherwise quantity is split across multiple batches in FIFO order.

**FR33**: Transaction items store batch allocation details in JSONB field: batch_id, quantity_allocated, cost_per_unit.

**FR34**: Tare weight values (gross, tare, net) are stored in transaction items for audit trail.

**FR35**: Batches are automatically marked as "Depleted" when quantity_remaining reaches zero.

**FR36**: Store managers can manually adjust batch quantities for corrections (damage, theft, count errors) with reason documentation.

**FR37**: Inventory adjustments create audit records with: batch_id, adjustment_quantity, reason, notes, user_id, timestamp.

**FR38**: Store managers can initiate weekly stock counts that snapshot current inventory quantities as baseline.

**FR39**: During stock counts, staff enter actual physical counts for each product with variance calculation (actual - expected).

**FR40**: Stock count review screen shows all variances with high-variance items (>10% or >10 units) flagged for attention.

**FR41**: Managers can add notes to variance items before finalizing stock count.

**FR42**: Finalizing stock count creates inventory adjustments for all variances and updates batch quantities.

**FR43**: Stock count history tracks all completed counts with variance trends over time.

**FR44**: System displays reminders when >7 days have passed since last stock count.

**FR45**: Managers can perform cycle counts on specific categories or products independently of weekly full counts.

**FR46**: **Sales by Product Category Report** displays revenue, units sold, and average transaction value by category with pie chart and bar chart visualizations.

**FR47**: **Daily Sales Summary Report** shows daily revenue totals, transaction counts, and trends over selected date range with line charts.

**FR48**: **Sales by Shift Report** compares AM vs PM shift performance including variance tracking.

**FR49**: **Top Products Report** ranks products by revenue, units sold, or transaction frequency with configurable top N display.

**FR50**: **Inventory Valuation Report** calculates total inventory value using FIFO cost basis across all active batches.

**FR51**: **Low Stock Alert Report** consolidates all products below reorder threshold with suggested reorder quantities.

**FR52**: **Inventory Movement Report** tracks all receipts, sales, and adjustments with shrinkage analysis by reason.

**FR53**: **Cashier Performance Report** evaluates individual cashier metrics including revenue, transaction count, average transaction value, and shift variances.

**FR54**: **Multi-Location Dashboard** compares performance across all locations with revenue rankings and health indicators.

**FR55**: All reports support date range filtering, location filtering, CSV export, and drill-down to transaction details.

**FR56**: Report hub displays all available reports with search/filter, recently viewed, and favorites functionality.

**FR57**: The system tracks batch expiration dates (optional field) and excludes expired batches from FIFO allocation.

**FR58**: Tier pricing applies only to products with category = "Flower"; other products use base_price.

**FR59**: Mixed carts correctly calculate totals: (flower items at tier price) + (non-flower items at base price).

**FR60**: Real-time shift summary dashboard displays: current shift status, transaction count, total revenue, expected cash, time remaining.

**FR61**: Navigation menu includes: POS, Products, Inventory, Shifts, Reports, Dashboard with responsive collapse on mobile.

**FR62**: All forms use React Hook Form + Zod schema validation with clear error messages.

**FR63**: The system supports multiple locations with data isolation enforced via Supabase Row-Level Security policies.

### Non-Functional Requirements

**NFR1**: Page load times must be <3 seconds on 4G mobile network connections.

**NFR2**: Complete POS transaction flow (search → add to cart → checkout → receipt) must complete in <90 seconds.

**NFR3**: Report generation must complete in <5 seconds for standard date ranges (up to 90 days).

**NFR4**: The system must support 5 concurrent users per location without performance degradation.

**NFR5**: All screens must be fully responsive and optimized for tablet devices (minimum 10.2" iPad).

**NFR6**: Touch targets must be minimum 44px × 44px per accessibility guidelines.

**NFR7**: The application must meet WCAG 2.1 Level AA accessibility standards.

**NFR8**: Color contrast ratios must meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).

**NFR9**: All interactive elements must be keyboard navigable with visible focus indicators.

**NFR10**: Form inputs must use appropriate keyboard types for mobile devices (numeric for amounts, text for names).

**NFR11**: User passwords must be securely hashed using Supabase Auth (bcrypt).

**NFR12**: All API communication must use HTTPS with SSL certificates.

**NFR13**: Sensitive configuration (Supabase keys) must be stored in .env files and never committed to version control.

**NFR14**: User sessions must expire after 24 hours of inactivity.

**NFR15**: Authentication tokens must be stored securely (httpOnly cookies or secure storage).

**NFR16**: Row-Level Security (RLS) policies must be enabled on all Supabase tables to enforce data isolation.

**NFR17**: Users can only access data for their assigned location(s) except dashboard users with multi-location access.

**NFR18**: All database mutations must be validated server-side regardless of client-side validation.

**NFR19**: FIFO inventory allocation must execute within a database transaction to prevent race conditions.

**NFR20**: Error messages must be user-friendly and not expose system internals or stack traces.

**NFR21**: The database schema must support multi-location data with location_id foreign keys on relevant tables.

**NFR22**: Automated daily database backups must be configured with tested restoration procedures.

**NFR23**: The application must use TypeScript in strict mode for type safety.

**NFR24**: Code must pass ESLint and Prettier checks before deployment.

**NFR25**: Unit tests must be written for business logic (pricing calculations, FIFO allocation, validation) using Vitest.

**NFR26**: Component tests must be written for critical UI components using React Testing Library.

**NFR27**: Code coverage target is >70% for unit and component tests.

**NFR28**: Manual UAT must be performed for end-to-end user journeys before production deployment.

**NFR29**: Production deployment must use CI/CD pipeline with automated testing (GitHub Actions + Vercel).

**NFR30**: Application must be deployed to Vercel with environment-specific configurations (dev, staging, production).

**NFR31**: Error monitoring must be configured (e.g., Sentry) for production environment.

**NFR32**: Uptime monitoring must be configured with alerts for downtime or performance degradation.

**NFR33**: Application bundle size must be optimized using code splitting and lazy loading to achieve Lighthouse performance score >85.

---

## User Interface Design Goals

### Overall UX Vision

The Cannabis Dispensary POS system prioritizes **speed, simplicity, and reliability** for high-volume retail operations. The interface should feel familiar to cashiers with retail experience while accommodating the unique workflows of cannabis dispensaries (tare weights, tiered pricing, shift reconciliation).

Key UX principles:
- **Transaction speed**: Minimize clicks and cognitive load during checkout
- **Error prevention**: Clear visual feedback and validation before irreversible actions
- **Discoverability**: Critical features (tier progression, shift status) surfaced prominently
- **Touch-optimized**: Large tap targets, swipe gestures, tablet-first layout
- **Graceful degradation**: Clear error states with recovery paths

### Key Interaction Paradigms

- **Single-screen POS flow**: Cart sidebar + product search main area (no navigation away during transaction)
- **Modal dialogs for critical inputs**: Tare weight entry, price overrides, shift open/close
- **Real-time feedback**: Immediate visual updates for tier changes, inventory warnings, pricing calculations
- **Progressive disclosure**: Advanced features (manager overrides, detailed reports) hidden until needed
- **Confirmation for destructive actions**: Delete, force close shift, finalize stock count

### Core Screens and Views

From a product perspective, the most critical screens necessary to deliver the PRD values and goals:

1. **Login Screen** - Email/password authentication, minimal branding
2. **POS Main Screen** - Split layout: product search/grid (left), cart sidebar (right), tier indicator, shift status bar
3. **Product Search/Selection** - Grid view with product images, SKU, price, stock level
4. **Cart Review** - Itemized list, tier progression indicator, quantity adjustment, remove item
5. **Tare Weight Entry Modal** - Gross weight, tare weight, calculated net weight display
6. **Payment Processing** - Payment method selection (cash default for MVP), total confirmation
7. **Receipt Confirmation** - Transaction summary, "New Transaction" and "Print" options
8. **Shift Open Reconciliation** - Starting cash float entry, shift time display
9. **Shift Close Reconciliation** - Expected vs actual cash, variance calculation, reason entry
10. **Reconciliation History** - List of past shifts with variance tracking, manager approval status
11. **Product Catalog** - Table/grid view with search, filter by category, add/edit product
12. **Batch Receiving** - Product selection, quantity, cost, received date entry
13. **Stock Count (Weekly)** - Product list with expected vs actual quantity entry, variance highlights
14. **Dashboard Home** - Multi-location summary cards, quick links to reports and critical alerts
15. **Report Viewer** - Report selection hub, parameter inputs (date range, location), export controls
16. **Report Detail Drill-Down** - Detailed tables, charts, transaction-level drilldown links
17. **User Profile** - Name, role, assigned location, password change
18. **Settings/Admin** - Tier configuration, shift definitions, user management (manager only)

### Accessibility

**Target Standard**: WCAG 2.1 Level AA

Accessibility Requirements:
- Keyboard navigation for all interactive elements
- Screen reader support with ARIA labels and live regions
- Sufficient color contrast (4.5:1 minimum for normal text)
- Focus indicators visible on all interactive elements
- Form labels associated with inputs (visible or aria-label)
- Error announcements for screen readers (aria-live)
- Semantic HTML (proper heading hierarchy, landmarks)
- No reliance on color alone to convey information

### Branding

**Style**: Modern, clean, professional retail aesthetic

- **Color Palette**: Neutral base (grays, whites) with green accent (cannabis association) for primary actions, amber for warnings, red for errors/critical alerts
- **Typography**: Sans-serif system font stack for readability and performance (Inter, SF Pro, Roboto)
- **Iconography**: Consistent icon set from Lucide React (included with shadcn/ui)
- **Spacing**: Generous padding and margins for touch-friendly interface (minimum 44px tap targets)
- **Visual Hierarchy**: Clear distinction between primary actions (high contrast, large buttons) and secondary actions (subtle, smaller)

### Target Device and Platforms

**Primary Platform**: Web Responsive (tablet-optimized)

- **Primary Device**: iPad 10.2" or similar Android tablets (1620×2160 resolution)
- **Secondary Support**: Desktop browsers (Chrome, Safari, Edge) for manager/owner access to reports and configuration
- **Mobile Fallback**: Responsive down to iPhone size (390px width minimum) for emergency access
- **Browser Support**: Modern evergreen browsers (last 2 versions of Chrome, Safari, Firefox, Edge)
- **Orientation**: Both portrait and landscape supported, optimized for landscape on tablets
- **Network**: Designed for 4G/LTE connectivity with graceful offline handling (error states, retry mechanisms)

---

## Technical Assumptions

### Repository Structure: Monorepo

The project will use a monorepo structure with all frontend code, configuration, and documentation in a single repository. This simplifies dependency management, enables atomic commits across the stack, and reduces context switching for AI agent development.

**Repository structure**:
```
/
├── src/                    # React application source
├── supabase/               # Database migrations and config
│   └── migrations/         # SQL migration files
├── public/                 # Static assets
├── docs/                   # Project documentation (PRD, architecture)
├── tests/                  # Test files (unit, integration)
├── .env.example            # Environment variable template
└── package.json            # Dependencies and scripts
```

### Service Architecture: Client-side SPA + Managed Backend (Supabase)

**Architecture Pattern**: Single Page Application (SPA) with managed backend services

- **Frontend**: React 18+ SPA served as static files from Vercel CDN
- **Backend**: Supabase managed services (PostgreSQL database, Auth, Storage, Real-time)
- **API Layer**: Supabase auto-generated REST and GraphQL APIs with client SDK
- **Authentication**: Supabase Auth with Row-Level Security (RLS) for authorization
- **Real-time**: Supabase real-time subscriptions for inventory updates and shift dashboards
- **Storage**: Supabase Storage for product images (if needed post-MVP)

**Rationale**: Managed backend eliminates server infrastructure complexity, auto-scales, provides built-in security (RLS), and fits 12-week timeline. SPA architecture supports offline-first capabilities (future enhancement) and fast client-side routing.

### Testing Strategy: Unit + Integration Testing

**Testing Framework**: Vitest for unit tests, React Testing Library for component tests, manual UAT for end-to-end validation

**Testing Scope**:
- **Unit Tests**: Business logic functions (tier pricing calculation, FIFO allocation algorithm, validation rules, currency/weight formatting)
- **Component Tests**: React components in isolation (Cart, Product Search, Shift Reconciliation forms) with mocked Supabase client
- **Integration Tests**: Supabase client integration, API calls, database queries (using test database)
- **Manual UAT**: End-to-end user journeys (POS transaction, shift reconciliation, stock count) performed by pilot users and QA

**Test Coverage Target**: >70% for critical business logic, lower priority for UI-only components

**CI/CD Integration**: Tests run automatically on pull requests via GitHub Actions, blocking merge on failure

### Frontend Stack

**Build Tool**: Vite 5+
- Fast dev server with HMR (Hot Module Replacement)
- Optimized production builds with code splitting
- Native TypeScript support

**Language**: TypeScript (strict mode enabled)
- Type safety for props, state, API responses
- Catch errors at compile time
- Improved IDE autocomplete and refactoring

**Framework**: React 18+
- Functional components with hooks (useState, useEffect, useContext, custom hooks)
- No class components
- Concurrent features for better UX (useTransition for non-blocking updates)

**UI Components**: shadcn/ui
- Accessible components built on Radix UI primitives
- Customizable with Tailwind CSS
- Copy-paste component code (not npm dependency) for full control
- Includes: Form, Dialog, Sheet (drawer), Table, Card, Button, Input, Select, etc.

**Styling**: Tailwind CSS
- Utility-first CSS framework
- Responsive design with mobile-first breakpoints
- Custom theme configuration for brand colors
- Consistent spacing and sizing scale

**State Management**: React Context API + Zustand (lightweight)
- **React Context**: Global state for auth, current location, active shift
- **Zustand**: Client-side cart state, UI state (modals, drawers)
- **Supabase Real-time**: Server state automatically synced (products, inventory, transactions)

**Form Handling**: React Hook Form + Zod
- React Hook Form for performant form state management
- Zod schema validation (type-safe, reusable schemas)
- Integration with shadcn/ui Form components

**Routing**: React Router v6
- Client-side routing with nested routes
- Protected routes (redirect unauthenticated users)
- URL-based state for reports (date range, filters)

**Data Fetching**: Supabase JS Client
- Auto-generated client from database schema
- Real-time subscriptions for live updates
- Optimistic UI updates for better perceived performance

**Charting/Visualization**: Recharts or similar React chart library
- Bar charts, line charts, pie charts for reports
- Responsive charts for mobile/tablet

**Date Handling**: date-fns
- Lightweight, modular date utility library
- Timezone-aware formatting for Thai locale

### Backend Stack

**Database**: Supabase (Managed PostgreSQL)
- PostgreSQL 15+ with full SQL support
- Row-Level Security (RLS) policies for authorization
- Database triggers and functions for business logic (e.g., auto-update timestamps)
- Full-text search capabilities (if needed for product search)

**Authentication**: Supabase Auth
- Email/password authentication for MVP
- Session management with JWT tokens
- Password reset flow (email-based)
- User metadata for role and location assignment

**File Storage**: Supabase Storage (future enhancement)
- Product images, receipts (if PDF generation implemented)
- Public bucket for product images, private buckets for receipts

**Real-time**: Supabase Real-time
- WebSocket-based subscriptions to database changes
- Use cases: inventory updates after sales, shift summary dashboard live updates

### Deployment & Infrastructure

**Frontend Hosting**: Vercel
- Automatic deployments from GitHub (main branch → production, PRs → preview)
- Global CDN for fast static file delivery
- Environment variable management per deployment environment
- Zero-config HTTPS with automatic SSL certificates

**Database Hosting**: Supabase Cloud
- Managed PostgreSQL with automatic backups
- Connection pooling (PgBouncer)
- Free tier sufficient for MVP, easy upgrade path

**CI/CD**: GitHub Actions
- Automated workflows: lint → type-check → test → build
- Runs on pull requests and main branch pushes
- Deployment to Vercel triggered automatically on successful CI

**Monitoring & Logging**:
- **Error Tracking**: Sentry (or similar) for client-side and API errors
- **Uptime Monitoring**: UptimeRobot or similar for alerting on downtime
- **Database Monitoring**: Supabase dashboard for query performance, connection usage
- **Analytics**: (Optional post-MVP) Plausible or similar privacy-focused analytics

### Development Tools

**Package Manager**: pnpm
- Faster installs than npm/yarn
- Efficient disk space usage (content-addressable storage)
- Strict dependency resolution

**Code Quality**:
- **ESLint**: Linting for code quality and consistency
- **Prettier**: Code formatting (auto-format on save)
- **TypeScript Strict Mode**: Maximum type safety
- **Husky**: Git hooks for pre-commit linting (optional)

**Version Control**: Git + GitHub
- Feature branch workflow (PRs for all changes)
- Protected main branch (requires PR approval)
- Conventional commit messages for clear history

### Additional Technical Assumptions and Requests

Throughout the development process, the following technical assumptions and requests apply:

1. **All sensitive keys and credentials** (Supabase URL, anon key, service role key) must be stored in `.env` files and documented in `.env.example`. Never commit actual keys to version control.

2. **Database migrations** must be written as SQL files in `/supabase/migrations` directory and versioned sequentially (e.g., `20250110120000_create_products_table.sql`). All schema changes go through migrations, never manual DB edits.

3. **RLS policies** must be defined for every table, even if the policy is permissive during development. Policies should follow least-privilege principle (users only access their location's data).

4. **Offline handling**: While offline-first is not an MVP requirement, error states must gracefully handle network failures with clear user messaging and retry mechanisms.

5. **Performance budget**: Initial bundle size should be <500KB gzipped. Use code splitting for routes and large dependencies (charts, PDF generation).

6. **Accessibility testing**: Run automated axe DevTools audits on all major screens. Manual screen reader testing (NVDA or VoiceOver) on critical flows (POS transaction, shift reconciliation).

7. **Browser compatibility**: Target last 2 versions of Chrome, Safari, Edge. No IE11 support required.

8. **Mobile performance**: Test on real devices (iPad, Android tablet) not just browser DevTools responsive mode.

9. **Security headers**: Configure Vercel to send appropriate security headers (CSP, X-Frame-Options, HSTS).

10. **Logging strategy**: Use structured logging (JSON format) for easier parsing. Log levels: error (production), warn (production), info (dev), debug (dev only).

---

## Epic List

The following epics represent the major deliverable increments for the Cannabis Dispensary POS system. Each epic delivers complete, deployable, end-to-end functionality following the 12-week integrated development timeline.

**Epic 1: Foundation & Core Infrastructure**
*Establish project setup, database schema, authentication, and initial POS transaction capability to validate the full stack is operational.*

**Epic 2: Product Management & Inventory Foundation**
*Enable product catalog management, batch receiving with FIFO tracking, and tare weight handling for flower products.*

**Epic 3: Tiered Pricing Engine**
*Implement automated tiered pricing calculation based on total flower weight in cart, eliminating manual pricing errors.*

**Epic 4: Shift Reconciliation System**
*Deliver mandatory shift-to-shift reconciliation workflow (AM/PM) with variance tracking and enforcement to prevent revenue leakage.*

**Epic 5: Stock Management & Weekly Count**
*Complete inventory management with FIFO allocation, batch depletion tracking, and weekly stock count workflows.*

**Epic 6: Reporting Suite & Dashboard**
*Provide comprehensive reporting capabilities covering all 10 MVP reports with drill-down functionality and multi-location dashboard.*

**Epic 7: UAT, Polish & Pilot Deployment**
*Complete end-to-end testing, performance optimization, training materials, and production deployment to first pilot location.*

---

## Epic 1: Foundation & Core Infrastructure

**Goal**: Establish the complete project foundation including repository setup, database schema, authentication system, and deliver a working end-to-end POS transaction flow. This epic validates that the entire technology stack (React + Vite + shadcn/ui + Supabase) is operational and can support all future functionality.

### Story 1.1: Project Setup & Development Environment

As a **developer**,
I want **the project repository initialized with all build tools, linters, and dependencies configured**,
so that **the team can begin development with a consistent, production-ready environment**.

#### Acceptance Criteria

1. Monorepo created with Vite 5+ build configuration for React 18+ TypeScript (strict mode)
2. Package manager set to pnpm with all core dependencies installed (React, TypeScript, Tailwind CSS, shadcn/ui)
3. ESLint and Prettier configured with project standards
4. Git repository initialized with .gitignore configured for Node.js/React projects
5. .env.example file created with placeholder keys for Supabase configuration
6. README.md includes setup instructions and environment variable documentation
7. Development server runs successfully on `pnpm dev`

### Story 1.2: Supabase Project Setup & Database Schema

As a **developer**,
I want **Supabase project configured with initial database schema for core entities**,
so that **the application has a functional backend from day one**.

#### Acceptance Criteria

1. Supabase project created with project URL and anon key documented in .env.example
2. Database schema created for core tables: `users`, `locations`, `products`, `product_batches`, `transactions`, `transaction_items`, `shifts`
3. Row-Level Security (RLS) policies enabled on all tables
4. Basic RLS policies implemented for authenticated user access
5. Database migration scripts stored in `/supabase/migrations` directory
6. Supabase client initialized in React app with environment variables
7. Health check query executes successfully from React app to Supabase

### Story 1.3: Authentication System

As a **store employee**,
I want **to securely log in to the POS system using email and password**,
so that **only authorized personnel can access the system and transactions are attributed correctly**.

#### Acceptance Criteria

1. Login screen created with email and password fields using shadcn/ui Form components
2. Supabase Auth integration implemented with email/password sign-in
3. Authentication state managed globally (React Context or Zustand)
4. Protected routes implemented - unauthenticated users redirected to login
5. User profile data (name, role, location_id) fetched after successful authentication
6. Logout functionality implemented with session cleanup
7. Login form validates email format and password presence before submission
8. Error messages displayed for invalid credentials or network errors
9. Successful login navigates to POS Main Screen

### Story 1.4: Basic Product Catalog Seeding

As a **developer**,
I want **sample product data seeded into the database**,
so that **POS functionality can be tested without manual data entry**.

#### Acceptance Criteria

1. Seed script created with at least 10 sample products across categories (Flower, Pre-Roll, Edible, Concentrate, Other)
2. Each product includes: SKU, name, category, unit, base_price, requires_tare_weight flag
3. Products seeded with at least 2 initial batches each with quantity, cost_per_unit, received_date
4. Seed script is idempotent (can run multiple times safely)
5. Seed script executable via `pnpm seed` command
6. At least 3 flower products marked with `requires_tare_weight: true`
7. Sample location record created with name "Pilot Location - Bangkok"

### Story 1.5: POS Main Screen - Product Search & Selection

As a **cashier**,
I want **to search for products and add them to the transaction cart**,
so that **I can begin building customer orders**.

#### Acceptance Criteria

1. POS Main Screen displays product search input (text search by name or SKU)
2. Product search executes real-time query against Supabase `products` table
3. Search results displayed in grid/list view showing: product name, SKU, category, available quantity, price
4. Clicking a product adds it to cart with default quantity of 1
5. Cart sidebar displays all items with: product name, quantity, unit price, line total
6. Cart shows running subtotal of all items
7. Empty state displayed when cart has no items
8. UI is responsive and touch-friendly for tablet use (minimum tap target 44px)

### Story 1.6: Cart Management & Quantity Adjustment

As a **cashier**,
I want **to adjust quantities and remove items from the cart**,
so that **I can accurately reflect customer purchase intent**.

#### Acceptance Criteria

1. Each cart item displays increment (+) and decrement (−) buttons for quantity adjustment
2. Quantity can be manually edited via number input field
3. Quantity changes update line total and cart subtotal immediately
4. Remove button (X) deletes item from cart with confirmation
5. Quantity cannot be set below 1 or above available inventory
6. For flower products requiring tare weight, quantity field accepts decimal values (e.g., 3.5g)
7. Validation prevents negative or zero quantities
8. Cart persists during user session (does not clear on page refresh)

### Story 1.7: Simple Checkout & Transaction Recording

As a **cashier**,
I want **to complete the transaction and record it in the database**,
so that **inventory is updated and a receipt is generated**.

#### Acceptance Criteria

1. "Complete Sale" button displayed in cart when cart has at least one item
2. Clicking "Complete Sale" creates transaction record in `transactions` table with: user_id, location_id, total_amount, payment_method (default "Cash"), timestamp
3. All cart items saved to `transaction_items` table with: transaction_id, product_id, quantity, unit_price, line_total
4. Inventory deducted from product_batches using simple LIFO (latest batch first) for this story only
5. Transaction success message displayed to user
6. Cart cleared after successful transaction
7. Receipt data prepared (transaction ID, items, totals, timestamp) for display
8. If transaction fails, error message shown and cart preserved

### Story 1.8: Receipt Display & Print Preparation

As a **cashier**,
I want **to view a receipt summary after completing a transaction**,
so that **I can verify the sale and provide confirmation to the customer**.

#### Acceptance Criteria

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

### Story 1.9: Navigation & Basic Layout

As a **store employee**,
I want **a consistent navigation structure across all screens**,
so that **I can easily access different parts of the system**.

#### Acceptance Criteria

1. Top navigation bar includes: Logo/App name, current user name, current location, logout button
2. Side navigation menu (collapsible on mobile) with links to: POS, Products, Inventory, Shifts, Reports, Dashboard
3. Active navigation item highlighted
4. Navigation is responsive - collapses to hamburger menu on mobile/tablet
5. All navigation items route correctly (placeholder screens acceptable for non-MVP features)
6. Layout uses shadcn/ui components (Sheet, NavigationMenu, or similar)
7. Navigation persists across all authenticated screens

### Story 1.10: Deployment Pipeline & Hosting

As a **developer**,
I want **CI/CD pipeline configured for automated testing and deployment**,
so that **code changes can be deployed to production safely and quickly**.

#### Acceptance Criteria

1. GitHub Actions workflow created for CI pipeline running on pull requests
2. CI pipeline executes: linting (ESLint), type checking (TypeScript), unit tests (Vitest)
3. Vercel project connected to GitHub repository for automatic deployments
4. Environment variables configured in Vercel dashboard (Supabase URL, anon key)
5. Production deployment URL accessible and functional
6. Preview deployments created automatically for pull requests
7. Build failures prevent deployment
8. README.md updated with deployment instructions and production URL

---

## Epic 2: Product Management & Inventory Foundation

**Goal**: Deliver complete product catalog management capabilities including product CRUD operations, batch receiving workflow with FIFO tracking, and tare weight handling for flower products. This epic establishes the foundation for accurate inventory tracking and cost accounting.

### Story 2.1: Product List & Search Interface

As a **store manager**,
I want **to view all products in the catalog with search and filter capabilities**,
so that **I can quickly find and manage product information**.

#### Acceptance Criteria

1. Product List screen displays all products in table/card view showing: SKU, name, category, unit, base_price, total available quantity
2. Search bar filters products by name or SKU in real-time
3. Category filter dropdown (All, Flower, Pre-Roll, Edible, Concentrate, Other)
4. Table sortable by: name, SKU, category, available quantity
5. "Add New Product" button navigates to product creation form
6. Clicking a product row navigates to product detail/edit screen
7. Empty state displayed when no products match search/filter
8. Loading state displayed while fetching data from Supabase

### Story 2.2: Create New Product

As a **store manager**,
I want **to add new products to the catalog**,
so that **inventory can be tracked and products sold via POS**.

#### Acceptance Criteria

1. Product creation form includes fields: SKU (auto-generated or manual), name, category (dropdown), unit (dropdown: gram/piece/bottle/package), base_price, requires_tare_weight (checkbox)
2. Form validation: SKU must be unique, name required, category required, base_price > 0
3. Form uses React Hook Form + Zod schema validation
4. Success message displayed after product created
5. User redirected to Product List after successful creation
6. Error messages displayed for validation failures or database errors
7. "Cancel" button returns to Product List without saving
8. For flower products, requires_tare_weight checkbox defaults to checked

### Story 2.3: Edit & Delete Product

As a **store manager**,
I want **to update product information or remove discontinued products**,
so that **the catalog remains accurate and up-to-date**.

#### Acceptance Criteria

1. Product edit form pre-populated with existing product data
2. All fields editable except SKU (read-only after creation)
3. Save button updates product record in database
4. Success message displayed after update
5. Delete button displayed with confirmation modal ("Are you sure? This will not delete associated batches or transaction history.")
6. Delete soft-deletes product (sets is_active: false) rather than hard delete
7. Deleted products excluded from POS product search
8. Validation same as create form
9. Cancel button discards changes and returns to Product List

### Story 2.4: Product Detail View with Batch History

As a **store manager**,
I want **to view all batches associated with a product and their current status**,
so that **I can understand inventory levels and FIFO allocation**.

#### Acceptance Criteria

1. Product detail screen displays product information at top (read-only summary)
2. Batch history table shows all batches for this product with columns: batch_number, received_date, quantity_received, quantity_remaining, cost_per_unit, status (Active/Depleted)
3. Batches sorted by received_date ascending (oldest first) to visualize FIFO order
4. "Receive New Batch" button opens batch receiving form
5. Total available quantity calculated and displayed (sum of quantity_remaining across all active batches)
6. Depleted batches (quantity_remaining = 0) displayed in muted/gray style
7. Edit product button navigates to product edit form

### Story 2.5: Receive New Product Batch

As a **store manager**,
I want **to record receipt of new product batches with quantity and cost**,
so that **inventory is accurately tracked for FIFO allocation and cost accounting**.

#### Acceptance Criteria

1. Batch receiving form includes fields: product (dropdown or pre-selected if coming from product detail), quantity_received, cost_per_unit, received_date (defaults to today), batch_number (auto-generated)
2. Form validation: quantity_received > 0, cost_per_unit > 0, received_date cannot be future
3. Batch record created in `product_batches` table with quantity_remaining initially equal to quantity_received
4. Batch_number auto-generated in format: `{PRODUCT_SKU}-{YYYYMMDD}-{SEQUENCE}` (e.g., "FLW001-20250110-001")
5. Success message displayed with batch_number
6. Product's total available quantity recalculated after batch creation
7. User returned to product detail view showing new batch in history
8. Supabase timestamp fields (created_at, updated_at) auto-populated

### Story 2.6: Tare Weight Entry During POS Transaction

As a **cashier**,
I want **to enter tare weight when adding flower products to the cart**,
so that **customers are only charged for actual product weight**.

#### Acceptance Criteria

1. When adding a product with requires_tare_weight: true to cart, modal/dialog prompts for: gross_weight (total weight with container), tare_weight (container weight)
2. Net weight calculated automatically: net_weight = gross_weight - tare_weight
3. Net weight becomes the quantity for cart item (displayed in grams)
4. Modal validation: gross_weight > tare_weight, both values > 0
5. Tare weight values stored in transaction_items record for audit trail
6. Cart item displays: "{product_name} - {net_weight}g (Gross: {gross_weight}g, Tare: {tare_weight}g)"
7. Unit price applied to net_weight for line total calculation
8. "Cancel" button closes modal without adding item to cart

### Story 2.7: FIFO Inventory Allocation Engine

As a **system**,
I want **to automatically allocate inventory from oldest batches first**,
so that **product freshness is maintained and cost accounting is accurate (FIFO)**.

#### Acceptance Criteria

1. When transaction is completed, allocation algorithm runs for each transaction item
2. Algorithm queries product_batches for the product ordered by received_date ASC (oldest first)
3. Quantity deducted from batches in FIFO order until transaction quantity fulfilled
4. If single batch sufficient, deduct full quantity from that batch only
5. If multiple batches needed, split allocation across batches (update quantity_remaining for each)
6. Transaction_items table updated with batch_allocations JSONB field storing: [{batch_id, quantity_allocated, cost_per_unit}]
7. Batch status updated to "Depleted" when quantity_remaining reaches 0
8. If insufficient inventory across all batches, transaction fails with error message: "Insufficient inventory for {product_name}. Available: {total_available}g, Requested: {requested_quantity}g"
9. FIFO allocation executes within database transaction to prevent race conditions

### Story 2.8: Inventory Adjustment (Manual Correction)

As a **store manager**,
I want **to manually adjust batch quantities for corrections (damage, theft, counting errors)**,
so that **inventory records remain accurate**.

#### Acceptance Criteria

1. Inventory adjustment form accessible from product detail page per batch
2. Form fields: batch_id (pre-selected), adjustment_quantity (positive or negative), reason (dropdown: Damage, Theft, Count Correction, Other), notes (optional text)
3. Validation: adjustment cannot reduce quantity_remaining below 0
4. Adjustment creates record in `inventory_adjustments` audit table with: batch_id, adjustment_quantity, reason, notes, user_id, timestamp
5. Batch quantity_remaining updated: quantity_remaining += adjustment_quantity
6. Success message displayed with new quantity_remaining
7. Adjustment history visible on product detail page (expandable section)
8. Negative adjustments highlighted in red, positive in green

### Story 2.9: Low Stock Alert Indicator

As a **store manager**,
I want **visual indicators for products with low inventory**,
so that **I can proactively reorder before stock-outs occur**.

#### Acceptance Criteria

1. Product List displays warning icon/badge for products where total available quantity < reorder_threshold
2. Reorder_threshold configurable per product (new field in products table, defaults to 50g for flower, 10 units for others)
3. Low stock products sortable to top of Product List
4. Product detail page shows warning banner when below threshold: "Low Stock: {available} {unit} remaining (Threshold: {reorder_threshold})"
5. Out-of-stock products (quantity = 0) display "Out of Stock" badge in red
6. POS product search shows low stock warning next to product name
7. Dashboard widget shows count of low stock products (to be implemented in Epic 6)

### Story 2.10: Batch Expiration Tracking (Optional for MVP)

As a **store manager**,
I want **to track expiration dates for product batches**,
so that **expired products are not sold**.

#### Acceptance Criteria

1. Product_batches table includes expiration_date field (nullable)
2. Batch receiving form includes optional expiration_date field
3. Expired batches (expiration_date < today) excluded from FIFO allocation
4. Product List shows warning icon for products with batches expiring within 30 days
5. Product detail page highlights expiring/expired batches in amber/red
6. POS prevents adding products to cart if only expired batches available
7. Inventory report includes expiration date column for batches

---

## Epic 3: Tiered Pricing Engine

**Goal**: Implement automated tiered pricing calculation that aggregates total flower weight in the cart and applies the appropriate price tier, eliminating manual pricing errors and reducing transaction time.

### Story 3.1: Tiered Pricing Configuration

As a **store manager**,
I want **to configure pricing tiers for flower products**,
so that **customers automatically receive volume discounts based on total flower weight**.

#### Acceptance Criteria

1. Pricing tiers configuration screen created under Settings/Admin section
2. Tiers table displays existing tiers with columns: tier_name, min_weight_grams, max_weight_grams, price_per_gram
3. Default tiers pre-seeded:
   - Tier 1: 0-2.99g @ ฿400/g
   - Tier 2: 3-6.99g @ ฿350/g
   - Tier 3: 7-13.99g @ ฿300/g
   - Tier 4: 14-27.99g @ ฿250/g
   - Tier 5: 28g+ @ ฿200/g
4. "Add Tier" and "Edit Tier" functionality with validation: min_weight < max_weight, no overlapping ranges, price_per_gram > 0
5. Tiers stored in `pricing_tiers` table in Supabase
6. Delete tier functionality with confirmation (only if no active transactions using that tier)
7. Tiers apply globally across all locations for MVP

### Story 3.2: Real-Time Tiered Price Calculation in Cart

As a **cashier**,
I want **the cart to automatically calculate and apply tiered pricing based on total flower weight**,
so that **customers receive accurate pricing without manual calculation**.

#### Acceptance Criteria

1. Cart calculates total flower weight by summing quantities of all flower products (category = "Flower")
2. Current tier determined based on total flower weight matching against pricing_tiers table
3. Tier indicator displayed in cart showing: "Current Tier: {tier_name} ({min_weight}g - {max_weight}g @ ฿{price_per_gram}/g)"
4. All flower items in cart re-priced using current tier's price_per_gram
5. Price updates happen in real-time as items added/removed or quantities changed
6. Non-flower products (Pre-Roll, Edible, etc.) use their base_price, unaffected by tier pricing
7. Cart displays: "Total Flower Weight: {total_weight}g" prominently
8. Line totals for flower items recalculated: line_total = quantity * tier_price_per_gram

### Story 3.3: Tier Progression Indicator

As a **cashier**,
I want **to see how much more flower weight is needed to reach the next tier**,
so that **I can inform customers of potential savings**.

#### Acceptance Criteria

1. Cart displays "Next Tier" information when customer is not at highest tier
2. Message format: "Add {weight_needed}g more to reach {next_tier_name} and save ฿{savings_per_gram}/g"
3. Savings calculation shows difference between current and next tier prices
4. Estimated total savings displayed: "Estimated savings: ฿{total_savings_amount}"
5. When highest tier reached, display: "Maximum discount tier applied!"
6. Tier progression bar/visual indicator showing proximity to next tier
7. Updates in real-time as cart changes

### Story 3.4: Mixed Cart Pricing Logic

As a **cashier**,
I want **to handle carts containing both flower and non-flower products correctly**,
so that **pricing is accurate for all product types**.

#### Acceptance Criteria

1. Tiered pricing ONLY applies to products with category = "Flower"
2. Non-flower products (Pre-Roll, Edible, Concentrate, Other) always use base_price from products table
3. Cart subtotal correctly sums: (flower items at tier price) + (non-flower items at base price)
4. Tier calculation ignores non-flower product quantities
5. Cart displays breakdown: "Flower Subtotal: ฿{flower_total}" and "Other Products Subtotal: ฿{other_total}"
6. Receipt shows tier applied for flower items: "{product_name} - {quantity}g @ ฿{tier_price}/g (Tier {tier_name})"
7. Transaction record stores tier_id used for each flower item in transaction_items

### Story 3.5: Tier Price Override (Manager Authorization)

As a **store manager**,
I want **the ability to override tier pricing for special cases**,
so that **I can handle promotions, loyalty discounts, or price matching**.

#### Acceptance Criteria

1. "Override Price" button available on each cart line item (requires manager role)
2. Override modal prompts for: new_price_per_gram (for flower) or new_line_total (for non-flower), override_reason (required text field)
3. Overridden items display with indicator: "Price Overridden" badge
4. Original tier price and overridden price both stored in transaction_items for audit
5. Override reason saved to transaction_items.override_reason field
6. Cart recalculates subtotal with overridden prices
7. Receipt shows: "{product_name} - {quantity}g @ ฿{override_price}/g (Manager Override)"
8. Non-manager users see disabled override button with tooltip: "Manager authorization required"

### Story 3.6: Tier History & Analytics (Basic)

As a **store manager**,
I want **to see transaction distribution across pricing tiers**,
so that **I can understand customer purchasing patterns and optimize tier structure**.

#### Acceptance Criteria

1. Simple tier analytics screen showing for selected date range:
   - Count of transactions per tier
   - Total revenue per tier
   - Average transaction value per tier
   - Total flower weight sold per tier
2. Date range picker (defaults to last 30 days)
3. Data queried from transaction_items joined with pricing_tiers
4. Table and basic bar chart visualization (using recharts or similar)
5. Export to CSV functionality
6. Filter by location (if multi-location data exists)

### Story 3.7: Tier Pricing Business Rules Engine

As a **system**,
I want **to enforce tiered pricing business rules consistently**,
so that **pricing integrity is maintained across all scenarios**.

#### Acceptance Criteria

1. Business rule: Tier pricing ONLY applies during normal transaction flow, not retroactively
2. Business rule: Changing tier configuration does not affect historical transactions
3. Business rule: If no tier matches (edge case), system defaults to highest base_price from flower products with error logged
4. Business rule: Tier calculation executes on client-side for real-time UX, validated server-side during transaction commit
5. Business rule: Partial gram weights (e.g., 3.5g) supported and included in tier total
6. Database trigger prevents pricing_tiers deletion if referenced by transaction_items
7. Unit tests cover all tier calculation edge cases (boundary values, no tiers, overlapping tiers)

### Story 3.8: Tier Pricing for Tare Weight Transactions

As a **cashier**,
I want **tare weight transactions to correctly participate in tier pricing**,
so that **flower products weighed with containers receive tiered discounts**.

#### Acceptance Criteria

1. When flower product added via tare weight modal, net_weight (gross - tare) becomes quantity for tier calculation
2. Net weight included in "Total Flower Weight" for tier determination
3. Tier price applied to net_weight for line total calculation
4. Cart displays: "{product_name} - {net_weight}g @ ฿{tier_price}/g (Tier {tier_name})"
5. Tare weight details (gross, tare, net) preserved in transaction_items for audit
6. Multiple tare weight items aggregate correctly for tier total
7. Tier progression indicator updates correctly when tare weight items added

### Story 3.9: Tier Pricing Validation & Error Handling

As a **developer**,
I want **robust error handling for tier pricing edge cases**,
so that **the system degrades gracefully and never blocks transactions**.

#### Acceptance Criteria

1. If pricing_tiers table empty or unreachable, system falls back to base_price with warning logged
2. If multiple overlapping tiers found (data integrity issue), system uses lowest price tier and logs error
3. If tier calculation fails, error message displayed to cashier with option to proceed at base_price
4. Network errors during tier fetch display: "Pricing temporarily unavailable, using base prices"
5. Tier calculation timeout (>2 seconds) falls back to base_price
6. All tier-related errors logged to Supabase error_logs table with: timestamp, user_id, cart_state, error_message
7. Unit tests validate all error scenarios

### Story 3.10: Tier Pricing Documentation & Training Materials

As a **store owner**,
I want **documentation explaining how tier pricing works**,
so that **staff can explain the system to customers and answer questions**.

#### Acceptance Criteria

1. In-app help section created under Settings → Help → Tier Pricing
2. Documentation includes:
   - Explanation of how tiers work (total flower weight aggregation)
   - Current tier structure table
   - Examples of tier calculations with sample carts
   - FAQ section (e.g., "Do pre-rolls count toward tiers?", "Can I mix flower strains?")
3. Printable PDF version of tier pricing guide
4. Quick reference card (1-page) for cashiers showing tier breakpoints
5. Screenshots/diagrams showing cart tier indicator and progression display
6. Documentation accessible via "?" icon next to tier indicator in cart

---

## Epic 4: Shift Reconciliation System

**Goal**: Deliver mandatory shift-to-shift reconciliation workflow with AM (12PM-6PM) and PM (6PM-12AM) shift enforcement, variance tracking, and manager approval to prevent revenue leakage and ensure cash accountability.

### Story 4.1: Shift Definition & Configuration

As a **store manager**,
I want **to define shift schedules and rules for my location**,
so that **shift reconciliation enforcement aligns with actual operating hours**.

#### Acceptance Criteria

1. Shift configuration screen created under Settings → Shifts
2. Two default shifts pre-configured:
   - AM Shift: 12:00 PM - 6:00 PM
   - PM Shift: 6:00 PM - 12:00 AM (midnight)
3. Shift configuration stored in `shift_definitions` table with fields: shift_name, start_time, end_time, location_id
4. Shifts editable (time ranges only, names fixed for MVP)
5. Validation: end_time > start_time, no overlapping shifts, shifts must cover full operating hours
6. Configuration applies per location
7. Changes to shift times do not affect historical shift records

### Story 4.2: Shift Opening - Cash Float Entry

As a **cashier**,
I want **to open my shift by entering the starting cash float**,
so that **end-of-shift reconciliation has a baseline for comparison**.

#### Acceptance Criteria

1. When cashier logs in during shift hours, system checks if current shift is already open
2. If shift not open, "Open Shift" modal blocks access to POS functionality
3. Modal displays: shift_name, current date, cashier name, "Starting Cash Float" input field
4. Validation: starting_cash_float > 0, must be numeric
5. "Open Shift" button creates record in `shifts` table with: shift_definition_id, location_id, opened_by_user_id, opened_at (timestamp), starting_cash_float, status: "Open"
6. After opening, cashier gains full POS access
7. Only one shift can be open per location at a time
8. If previous shift not closed, error displayed: "Previous {shift_name} shift must be closed before opening new shift"

### Story 4.3: Transaction Assignment to Active Shift

As a **system**,
I want **all transactions automatically assigned to the currently open shift**,
so that **shift revenue can be accurately tracked**.

#### Acceptance Criteria

1. Transactions table includes shift_id foreign key
2. When transaction created, system queries for open shift at current location
3. Transaction.shift_id populated with active shift_id
4. If no shift open, transaction blocked with error: "No active shift. Please open shift before processing transactions."
5. Shift assignment happens server-side during transaction commit
6. Transaction timestamp and shift time range validated (transaction time within shift hours)
7. Edge case handled: Transactions near shift boundary (11:59 PM) assigned to correct shift based on timestamp

### Story 4.4: Shift Summary Dashboard (Real-Time)

As a **cashier**,
I want **to view real-time shift performance metrics**,
so that **I can monitor progress and prepare for shift close**.

#### Acceptance Criteria

1. Shift summary widget displayed on POS main screen showing:
   - Current shift name and status (Open)
   - Time remaining in shift (countdown)
   - Starting cash float
   - Transaction count (current shift)
   - Total revenue (current shift)
   - Expected cash (starting_cash_float + total_revenue)
2. Metrics update in real-time as transactions completed
3. "Close Shift" button visible when shift is within 30 minutes of end time or past end time
4. Shift summary accessible from navigation menu
5. Shift summary uses Supabase real-time subscriptions for live updates

### Story 4.5: Shift Closing - Cash Count Entry

As a **cashier**,
I want **to close my shift by entering the actual cash count**,
so that **variance can be calculated and reconciled**.

#### Acceptance Criteria

1. "Close Shift" button opens shift closing modal
2. Modal displays shift summary: starting_cash_float, transaction_count, total_revenue, expected_cash
3. "Actual Cash Count" input field for cashier to enter physical cash counted
4. Variance calculated automatically: variance = actual_cash_count - expected_cash
5. Variance displayed with color coding: Green if ±฿0-10, Amber if ±฿11-50, Red if >฿50
6. "Variance Reason" text field (required if |variance| > ฿50)
7. "Submit for Approval" button saves: actual_cash_count, variance, variance_reason, closed_by_user_id, closed_at (timestamp), status: "Pending Approval"
8. After submission, shift status updated to "Pending Approval" and POS access restricted until next shift opened
9. Cashier cannot close shift if current transaction in progress

### Story 4.6: Manager Shift Approval Workflow

As a **store manager**,
I want **to review and approve shift reconciliations**,
so that **discrepancies can be investigated before finalizing**.

#### Acceptance Criteria

1. Manager dashboard shows list of shifts with status "Pending Approval"
2. Shift approval screen displays:
   - Shift details (name, date, cashier, times)
   - Starting cash float, expected cash, actual cash count
   - Variance amount and percentage
   - Variance reason (if provided)
   - Transaction list for the shift (drilldown)
3. "Approve" button updates shift status to "Approved" and records approved_by_user_id, approved_at
4. "Reject" button requires rejection_reason, updates status to "Rejected", notifies cashier
5. Rejected shifts require cashier to re-submit with corrections
6. Approved shifts are locked and cannot be edited
7. Manager can add notes to shift record

### Story 4.7: Shift Reconciliation History & Reporting

As a **store manager**,
I want **to view historical shift reconciliation data**,
so that **I can identify patterns in variances and employee performance**.

#### Acceptance Criteria

1. Shift history screen shows all shifts with filters: date range, shift type (AM/PM), status, cashier
2. Table columns: date, shift_name, cashier_name, starting_cash, expected_cash, actual_cash, variance, variance_%, status, approved_by
3. Sortable by all columns
4. Variance column color-coded (green/amber/red)
5. Click row to view shift detail with full transaction list
6. Export to CSV functionality
7. Summary statistics displayed: Average variance, Total shifts, Approval rate, Top variance contributors (by cashier)

### Story 4.8: Shift Variance Alerts & Notifications

As a **store manager**,
I want **automatic alerts for high-variance shifts**,
so that **I can investigate discrepancies immediately**.

#### Acceptance Criteria

1. When shift submitted with |variance| > ฿100, manager receives in-app notification
2. Notification displays: shift_name, date, cashier_name, variance_amount
3. Notification links directly to shift approval screen
4. High-variance shifts (>฿100) flagged with warning icon in shift list
5. Notification preferences configurable per manager (email, in-app, or both)
6. Notification log stored in database for audit trail

### Story 4.9: Forced Shift Close (Manager Override)

As a **store manager**,
I want **the ability to force-close a shift left open by a cashier**,
so that **operations can continue even if cashier forgets to close shift**.

#### Acceptance Criteria

1. Manager dashboard shows "Open Shifts" list with age indicator
2. "Force Close" button available for shifts open >24 hours
3. Force close modal prompts manager to enter: actual_cash_count, variance_reason (required), override_notes
4. Force close creates shift record with: status "Force Closed", closed_by_user_id (manager), force_closed: true flag
5. Original cashier notified of force closure
6. Force-closed shifts highlighted in shift history
7. Manager can optionally reassign responsibility to another user

### Story 4.10: Shift Handoff Notes

As a **cashier**,
I want **to leave notes for the next shift**,
so that **important information is communicated across shift changes**.

#### Acceptance Criteria

1. "Shift Notes" section available in shift closing modal
2. Cashier can enter free-text notes (max 500 characters)
3. Notes saved to shifts.handoff_notes field
4. When next shift opens, handoff notes from previous shift displayed in modal: "Notes from previous shift: {notes}"
5. Handoff notes visible in shift detail view
6. Notes optional (not required for shift close)
7. Notes support basic formatting (line breaks preserved)

---

## Epic 5: Stock Management & Weekly Count

**Goal**: Complete inventory management system with FIFO allocation enforcement, batch depletion tracking, and weekly stock count workflows to ensure inventory accuracy and prevent shrinkage.

### Story 5.1: Inventory Dashboard Overview

As a **store manager**,
I want **a centralized inventory dashboard showing current stock levels**,
so that **I can quickly assess inventory health across all products**.

#### Acceptance Criteria

1. Inventory dashboard displays summary cards: Total SKUs, Total Units in Stock, Low Stock Items Count, Depleted Batches Count
2. Product inventory table showing: product_name, category, total_available_quantity, oldest_batch_age (days), low_stock_indicator
3. Filters: category, stock status (All, In Stock, Low Stock, Out of Stock)
4. Search by product name or SKU
5. Sortable by: product name, available quantity, oldest batch age
6. Click product row to navigate to product detail with batch history
7. Dashboard refreshes data every 30 seconds or via manual refresh button
8. Low stock items highlighted in amber, out of stock in red

### Story 5.2: Batch Movement History Tracking

As a **store manager**,
I want **to view complete movement history for each batch**,
so that **I can audit inventory changes and investigate discrepancies**.

#### Acceptance Criteria

1. Batch detail view shows movement history table with columns: date_time, movement_type (Received, Sale, Adjustment, Count Correction), quantity_change, quantity_after, user, reference (transaction_id or adjustment_id)
2. Movement types color-coded: Green for positive changes, Red for negative
3. Each movement links to source record (transaction, adjustment, stock count)
4. Movement history sortable by date (newest first by default)
5. Filter by movement_type and date range
6. Export batch history to CSV
7. Movement records immutable (audit trail integrity)

### Story 5.3: Automated Batch Depletion Status

As a **system**,
I want **to automatically mark batches as depleted when quantity reaches zero**,
so that **FIFO allocation only considers active batches**.

#### Acceptance Criteria

1. After each transaction, system checks if any allocated batches reached quantity_remaining = 0
2. Depleted batches automatically updated: status = "Depleted", depleted_at timestamp set
3. Depleted batches excluded from FIFO allocation queries
4. Product detail page shows depleted batches in separate section (collapsed by default)
5. Inventory dashboard excludes depleted batches from total quantity calculations
6. Batch can be "reactivated" if inventory adjustment adds quantity back (status → "Active")
7. Database index on status field for query performance

### Story 5.4: Weekly Stock Count Workflow - Initialization

As a **store manager**,
I want **to initiate a weekly stock count**,
so that **physical inventory can be compared against system records**.

#### Acceptance Criteria

1. "Start Stock Count" button on Inventory dashboard
2. Stock count initialization creates record in `stock_counts` table with: count_date, initiated_by_user_id, status: "In Progress", location_id
3. System snapshots current inventory quantities for all products at count start (baseline for variance detection)
4. Stock count screen displays all products with: product_name, SKU, expected_quantity (from system), actual_quantity (input field - empty)
5. Filter by category to focus count by section
6. Progress indicator shows: "{counted} of {total} products counted"
7. Count can be saved and resumed later (partial counts supported)
8. Only one stock count can be in progress per location at a time

### Story 5.5: Stock Count Entry - Product Counting

As a **store employee**,
I want **to enter physical counts for each product**,
so that **inventory accuracy can be verified**.

#### Acceptance Criteria

1. Stock count screen shows products in list/grid view optimized for mobile tablet use
2. Each product row displays: product image (if available), name, SKU, expected_quantity, actual_quantity input field
3. Actual quantity input validates: non-negative number, decimal support for weight-based items
4. Products with counts entered marked with checkmark icon
5. Variance calculated in real-time: variance = actual_quantity - expected_quantity
6. High variance items (>10% or >10 units) highlighted in amber/red for review
7. "Skip" button to mark product for later counting
8. Count entries auto-saved every 30 seconds to prevent data loss
9. Search/filter to quickly locate specific products during count

### Story 5.6: Stock Count Review & Variance Analysis

As a **store manager**,
I want **to review all variances before finalizing the stock count**,
so that **I can investigate significant discrepancies**.

#### Acceptance Criteria

1. "Review Count" button appears when all products counted (or all non-skipped products)
2. Review screen shows variance summary: Total Products Counted, Products with Variance, Total Positive Variance, Total Negative Variance
3. Variance detail table showing only products with variance ≠ 0: product_name, expected_qty, actual_qty, variance, variance_%
4. High variance items (>10% or >10 units) flagged for attention
5. "Recount" button next to each variance item to re-enter actual_quantity
6. "Add Note" button to document variance reasons (e.g., "damaged units removed")
7. "Finalize Count" button (requires manager role)
8. Export variance report to CSV

### Story 5.7: Stock Count Finalization & Inventory Adjustment

As a **store manager**,
I want **to finalize the stock count and apply corrections to inventory**,
so that **system records match physical reality**.

#### Acceptance Criteria

1. "Finalize Count" creates inventory adjustments for all variances
2. For each variance, system creates record in `inventory_adjustments` table with: product_id, batch_id (most recent batch), adjustment_quantity (= variance), reason: "Stock Count Correction", stock_count_id, user_id
3. Batch quantities updated: quantity_remaining += variance
4. Stock count record updated: status = "Finalized", finalized_by_user_id, finalized_at timestamp
5. Finalized stock counts locked and cannot be edited
6. Summary report generated showing: total adjustments, net inventory change, high variance items
7. Manager receives confirmation: "Stock count finalized. {positive_count} items increased, {negative_count} items decreased."
8. All adjustments logged with stock_count reference for audit trail

### Story 5.8: Stock Count History & Reporting

As a **store manager**,
I want **to view historical stock counts and trends**,
so that **I can identify patterns in inventory accuracy**.

#### Acceptance Criteria

1. Stock count history screen lists all completed counts: count_date, initiated_by, finalized_by, total_variances, net_variance_value, status
2. Click count to view detailed variance report
3. Filter by date range and status (In Progress, Finalized, Cancelled)
4. Trend chart showing variance % over time (last 12 weeks)
5. Top variance products report (products with most frequent or largest variances)
6. Export historical counts to CSV
7. Summary statistics: Average variance %, Total counts performed, Accuracy improvement trend

### Story 5.9: Scheduled Stock Count Reminders

As a **store manager**,
I want **automatic reminders to perform weekly stock counts**,
so that **inventory counts happen consistently**.

#### Acceptance Criteria

1. System tracks last stock count date per location
2. If >7 days since last count, dashboard displays reminder banner: "Weekly stock count overdue. Last count: {date}"
3. Reminder notification sent to manager role every Monday if no count in past 7 days
4. Reminder dismissible but reappears daily until count initiated
5. Stock count schedule configurable per location (weekly by default, can change to bi-weekly)
6. Compliance metric tracked: "On-time Stock Count Rate" (% of weeks with count completed)

### Story 5.10: Cycle Count (Partial Stock Count)

As a **store manager**,
I want **to perform counts on specific product categories**,
so that **I can verify high-risk inventory without full count**.

#### Acceptance Criteria

1. "Start Cycle Count" button allows selecting specific categories or products
2. Cycle count workflow identical to full stock count but limited to selected items
3. Cycle count record includes: count_type: "Cycle", category_filter or product_ids
4. Dashboard differentiates cycle counts from full counts in history
5. Cycle counts can run independently of weekly full count schedule
6. Multiple cycle counts can be in progress simultaneously (different categories)
7. Recommended cycle count frequency displayed per category based on shrinkage risk (e.g., "Count flower weekly, edibles monthly")

---

## Epic 6: Reporting Suite & Dashboard

**Goal**: Provide comprehensive reporting capabilities covering all 10 MVP reports with drill-down functionality, multi-location dashboard, and export capabilities to deliver operational visibility and data-driven decision making.

### Story 6.1: Report Navigation & Central Hub

As a **store manager**,
I want **a centralized reports hub showing all available reports**,
so that **I can quickly access the insights I need**.

#### Acceptance Criteria

1. Reports screen displays all 10 MVP reports as cards/tiles with: report name, description, icon, "View Report" button
2. Reports organized by category: Sales (4), Inventory (3), Operations (3)
3. Search/filter reports by name or category
4. Recently viewed reports section at top
5. Favorite reports functionality (star icon to bookmark frequently used reports)
6. Each report card shows last generated timestamp
7. Quick filters displayed: date range picker, location selector (for multi-location view)
8. Navigation breadcrumb: Dashboard → Reports → {Report Name}

### Story 6.2: Sales by Product Category Report

As a **store manager**,
I want **to view sales breakdown by product category**,
so that **I can understand which product types drive revenue**.

#### Acceptance Criteria

1. Report displays for selected date range:
   - Table: category, total_revenue, total_units_sold, avg_transaction_value, revenue_%
   - Pie chart: revenue distribution by category
   - Bar chart: units sold by category
2. Default date range: last 30 days
3. Sortable by all numeric columns
4. Click category row to drill down to products within that category
5. Export to CSV functionality
6. Summary row showing totals across all categories
7. Data queried from transaction_items joined with products
8. Report refreshes on date range or location change

### Story 6.3: Daily Sales Summary Report

As a **store manager**,
I want **to view daily sales totals and transaction counts**,
so that **I can track daily performance trends**.

#### Acceptance Criteria

1. Report displays for selected date range (default: last 30 days):
   - Table: date, total_revenue, transaction_count, avg_transaction_value, total_units_sold
   - Line chart: revenue over time
   - Line chart: transaction count over time
2. Table sortable by date (newest first by default)
3. Click date row to drill down to transactions for that day
4. Summary statistics: Total Revenue, Average Daily Revenue, Total Transactions, Best Day, Worst Day
5. Export to CSV
6. Day-of-week analysis: Average revenue by weekday (bar chart)
7. Comparison to previous period (e.g., last 30 days vs prior 30 days) showing % change

### Story 6.4: Sales by Shift Report

As a **store manager**,
I want **to compare AM vs PM shift performance**,
so that **I can optimize staffing and identify high-performing shifts**.

#### Acceptance Criteria

1. Report displays for selected date range:
   - Table: date, shift_name (AM/PM), total_revenue, transaction_count, avg_transaction_value, variance_amount, cashier_name
   - Bar chart: revenue by shift type (AM vs PM aggregate)
   - Stacked bar chart: daily revenue split by shift
2. Variance column shows shift reconciliation variance (if applicable)
3. Click shift row to drill down to transactions for that shift
4. Summary: Total AM Revenue, Total PM Revenue, AM/PM Revenue Ratio
5. Average variance by shift type
6. Filter by shift type, cashier
7. Export to CSV
8. High variance shifts highlighted for review

### Story 6.5: Top Products Report

As a **store manager**,
I want **to identify best-selling products**,
so that **I can optimize inventory and marketing focus**.

#### Acceptance Criteria

1. Report displays for selected date range (default: last 30 days):
   - Table: rank, product_name, SKU, category, total_units_sold, total_revenue, avg_price, times_sold (transaction count)
   - Top 20 products by revenue (configurable: top 10/20/50)
   - Bar chart: top 10 products by revenue
2. Toggle between ranking by: revenue, units sold, transaction frequency
3. Click product to drill down to transaction details for that product
4. Filter by category
5. Export to CSV
6. "Rising Stars" section: Products with highest growth vs previous period
7. Low performers section: Products with <5 sales in period (potential discontinuation candidates)

### Story 6.6: Inventory Valuation Report

As a **store manager**,
I want **to view total inventory value and cost basis**,
so that **I can understand capital tied up in inventory**.

#### Acceptance Criteria

1. Report displays current inventory snapshot:
   - Table: product_name, category, total_qty_on_hand, avg_cost_per_unit, total_value (qty × cost)
   - Summary: Total Inventory Value, Total Units, Avg Cost per Product
   - Pie chart: inventory value distribution by category
2. Batch-level detail drilldown: Click product to see all batches with quantities and costs
3. FIFO cost basis used for valuation (weighted average of active batches)
4. Filter by category, stock status (All, In Stock, Low Stock)
5. Export to CSV
6. Historical trend: Inventory value over time (last 12 weeks, line chart)
7. Turnover indicator: Products with oldest batches (>90 days) highlighted

### Story 6.7: Low Stock Alert Report

As a **store manager**,
I want **a consolidated view of all low-stock and out-of-stock products**,
so that **I can prioritize reordering**.

#### Acceptance Criteria

1. Report displays:
   - Table: product_name, category, current_qty, reorder_threshold, qty_below_threshold, oldest_batch_age, last_sale_date
   - Out-of-stock products section (qty = 0)
   - Low stock products section (qty < reorder_threshold but > 0)
2. Sortable by: qty_below_threshold (most urgent first), category, last_sale_date
3. Color coding: Red for out-of-stock, Amber for low stock
4. "Reorder Suggested Quantity" column based on average daily sales rate
5. Click product to navigate to product detail/batch receiving
6. Export to CSV (formatted as reorder worksheet)
7. Filter by category
8. Email report functionality (send to manager/buyer)

### Story 6.8: Inventory Movement Report

As a **store manager**,
I want **to track all inventory movements (receipts, sales, adjustments)**,
so that **I can audit inventory changes and identify shrinkage sources**.

#### Acceptance Criteria

1. Report displays for selected date range:
   - Table: date, product_name, movement_type (Received, Sale, Adjustment, Count Correction), quantity_change, batch_number, user, reference
   - Filter by: movement_type, product, user
   - Sortable by date (newest first by default)
2. Summary: Total Received, Total Sold, Total Adjustments (net), Net Change
3. Adjustments breakdown: Positive adjustments, Negative adjustments (shrinkage)
4. Drill down: Click movement to view source record (transaction, adjustment, stock count)
5. Export to CSV
6. Chart: Daily movements over time (stacked bar: received vs sold vs adjustments)
7. Shrinkage analysis: Total negative adjustments by reason (Damage, Theft, Count Correction)

### Story 6.9: Cashier Performance Report

As a **store manager**,
I want **to evaluate individual cashier performance metrics**,
so that **I can provide feedback and recognize top performers**.

#### Acceptance Criteria

1. Report displays for selected date range:
   - Table: cashier_name, shifts_worked, total_revenue, transaction_count, avg_transaction_value, total_variance, avg_variance_per_shift
   - Sortable by all metrics
   - Bar chart: revenue by cashier
   - Bar chart: average transaction value by cashier (ATV metric from KPIs)
2. Variance tracking: Total shift variances per cashier (positive and negative)
3. Click cashier to drill down to shift history and transaction details
4. Filter by shift type (AM/PM)
5. Export to CSV
6. Top performer highlights (highest ATV, lowest variance %, most transactions)
7. Performance trends: Cashier improvement/decline over time

### Story 6.10: Multi-Location Dashboard

As a **store owner**,
I want **a consolidated dashboard comparing performance across all locations**,
so that **I can identify best practices and underperforming stores**.

#### Acceptance Criteria

1. Dashboard displays for selected date range (default: last 30 days):
   - Table: location_name, total_revenue, transaction_count, avg_transaction_value, shift_variance_total, low_stock_items_count
   - Map view (if geo-coordinates available) with location markers sized by revenue
   - Bar chart: revenue by location
   - Comparison metrics: Location rank by revenue, Location rank by ATV
2. Click location to drill down to location-specific reports
3. Summary: Total Network Revenue, Total Locations, Best Performing Location, Average Location Revenue
4. Location health indicators: Green (on target), Amber (low performance), Red (critical issues)
5. Filter by date range
6. Export to CSV
7. YoY comparison (if historical data available): Revenue growth % by location
8. Cross-location insights: Shared top products, category trends

---

## Epic 7: UAT, Polish & Pilot Deployment

**Goal**: Complete end-to-end testing, performance optimization, create training materials, and successfully deploy to first pilot location with post-deployment support to ensure production readiness.

### Story 7.1: End-to-End UAT Test Plan & Execution

As a **QA lead**,
I want **a comprehensive UAT test plan covering all critical user journeys**,
so that **production deployment risk is minimized**.

#### Acceptance Criteria

1. UAT test plan document created covering:
   - Complete POS transaction flow (search → add to cart → tare weight → tiered pricing → checkout)
   - Shift reconciliation workflow (open → transactions → close → manager approval)
   - Inventory management (batch receiving → FIFO allocation → stock count)
   - All 10 MVP reports generation and accuracy
   - Multi-user concurrent access scenarios
2. Test cases include: happy paths, edge cases, error scenarios, boundary conditions
3. Test data set created with realistic product catalog, batches, and historical transactions
4. UAT execution checklist with pass/fail status tracking
5. Bug tracking process established (severity levels, resolution workflow)
6. Acceptance criteria: Zero critical bugs, <5 medium bugs, all core flows validated
7. UAT sign-off required from: Store Manager, Cashier Representative, Owner

### Story 7.2: Performance Optimization & Load Testing

As a **developer**,
I want **to optimize application performance and validate it meets NFRs**,
so that **the system performs well under real-world usage**.

#### Acceptance Criteria

1. Performance testing executed for:
   - Page load times (target: <3s on 4G network per NFR1)
   - Transaction completion time (target: <90s per NFR2)
   - Report generation time (target: <5s for standard date ranges)
   - Concurrent user load (target: 5 simultaneous users without degradation)
2. Performance bottlenecks identified and resolved:
   - Database query optimization (indexes, query complexity)
   - Bundle size reduction (code splitting, lazy loading)
   - Image optimization (compression, lazy loading)
   - API response time optimization
3. Lighthouse performance audit score >85
4. Browser DevTools performance profiling completed
5. Supabase query performance analyzed via dashboard
6. Performance test results documented with before/after metrics
7. All NFR performance targets met and validated

### Story 7.3: Mobile & Tablet Responsiveness Polish

As a **UX designer**,
I want **to ensure optimal mobile/tablet experience across all screens**,
so that **cashiers can efficiently use the system on tablets**.

#### Acceptance Criteria

1. All screens tested on target devices: iPad (10.2"), Android tablet (10"), iPhone (responsive fallback)
2. Touch targets minimum 44px × 44px per accessibility guidelines
3. Forms optimized for mobile: appropriate keyboard types (numeric for amounts, text for names)
4. POS cart drawer/sidebar optimized for split-screen tablet use
5. Stock count interface optimized for one-handed tablet operation
6. Navigation menu collapses appropriately on smaller screens
7. Product search results display in grid view on tablets (not table)
8. Reports include mobile-optimized views (cards instead of wide tables)
9. Orientation support: Portrait and landscape modes work correctly
10. Cross-browser testing: Safari (iOS), Chrome (Android/Desktop), Edge

### Story 7.4: Accessibility Compliance (WCAG AA)

As a **developer**,
I want **to ensure the application meets WCAG AA accessibility standards**,
so that **the system is usable by all staff members**.

#### Acceptance Criteria

1. Keyboard navigation fully functional across all screens (tab order logical)
2. Focus indicators visible and clear for all interactive elements
3. Color contrast ratios meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
4. Form inputs have associated labels (visible or aria-label)
5. Error messages announced to screen readers (aria-live regions)
6. Images have alt text (or decorative images marked as such)
7. Semantic HTML used throughout (heading hierarchy, landmarks)
8. Automated accessibility audit (axe DevTools) shows zero violations
9. Manual screen reader testing (NVDA/VoiceOver) for critical flows
10. Skip to main content link for keyboard users

### Story 7.5: User Training Materials & Documentation

As a **store owner**,
I want **comprehensive training materials for staff**,
so that **adoption is smooth and users are confident using the system**.

#### Acceptance Criteria

1. User guide created covering:
   - Getting started (login, navigation)
   - POS transaction workflow (step-by-step with screenshots)
   - Tare weight procedure
   - Shift reconciliation process
   - Product and batch management
   - Running reports
   - Troubleshooting common issues
2. Quick reference cards (1-page printable):
   - POS cheat sheet for cashiers
   - Shift close procedure
   - Weekly stock count checklist
3. Video tutorials (3-5 minutes each):
   - Complete POS transaction demo
   - Shift reconciliation walkthrough
   - Stock count procedure
4. In-app help tooltips for complex features (tier pricing, FIFO, tare weight)
5. FAQ document addressing common questions
6. Training materials available in English (Thai translation for future phase)
7. Materials hosted in accessible location (docs site or in-app help section)

### Story 7.6: Data Migration & Seeding for Pilot

As a **developer**,
I want **to prepare production database with pilot location data**,
so that **the pilot location can start using the system immediately**.

#### Acceptance Criteria

1. Production Supabase project created with environment variables configured
2. Database migrations executed on production database
3. Pilot location data seeded:
   - Location record (name, address, configuration)
   - User accounts (manager, 2-3 cashiers) with passwords securely distributed
   - Product catalog (20-30 real products with SKUs, names, categories, pricing)
   - Initial product batches (realistic quantities and costs)
   - Pricing tiers configured per pilot location's structure
4. RLS policies enabled and tested on production
5. Data validation: All required fields populated, relationships intact
6. Backup of production database taken before pilot launch
7. Rollback plan documented in case of critical issues

### Story 7.7: Production Deployment & Monitoring Setup

As a **DevOps engineer**,
I want **to deploy the application to production with monitoring in place**,
so that **issues can be detected and resolved quickly**.

#### Acceptance Criteria

1. Production deployment to Vercel completed with custom domain (if applicable)
2. Environment variables configured in Vercel (Supabase production keys)
3. SSL certificate active and HTTPS enforced
4. Error monitoring configured (Sentry or similar) for client-side and API errors
5. Uptime monitoring configured (UptimeRobot or similar) with alerts to team
6. Supabase logging and monitoring reviewed (query performance, error logs)
7. Production health check endpoint created and monitored
8. Deployment runbook documented (steps, rollback procedure)
9. On-call rotation established for pilot period (weeks 1-2)
10. Smoke tests executed post-deployment: login, POS transaction, report generation

### Story 7.8: Pilot Launch & On-Site Support

As a **product manager**,
I want **to be present for pilot launch and provide on-site support**,
so that **initial issues are resolved immediately and users feel supported**.

#### Acceptance Criteria

1. Pilot launch plan created:
   - Go-live date and time
   - On-site support team (PM, developer, trainer)
   - Communication plan (pilot users, stakeholders)
   - Success criteria for pilot period
2. On-site training session conducted day before go-live (2-3 hours):
   - Hands-on POS training for cashiers
   - Manager training on reports and reconciliation
   - Q&A session
3. Go-live day support:
   - On-site presence for first full shift
   - Shadow cashiers during initial transactions
   - Real-time issue resolution
   - Positive reinforcement and encouragement
4. Feedback collection mechanism established (daily check-ins, issue log)
5. Pilot period defined: 2 weeks of intensive monitoring
6. Daily stand-ups with pilot users during week 1

### Story 7.9: Post-Pilot Feedback Collection & Iteration

As a **product manager**,
I want **to systematically collect and act on pilot feedback**,
so that **the product evolves based on real user needs**.

#### Acceptance Criteria

1. Feedback collection methods:
   - Daily check-in calls with manager (week 1)
   - End-of-shift surveys for cashiers (Google Form or in-app)
   - Weekly retrospective meeting with all pilot users
   - Issue log for bugs and feature requests
2. Feedback categorized by: bugs, usability issues, feature requests, training gaps
3. Priority ranking: P0 (blocker), P1 (high impact), P2 (nice-to-have)
4. P0 and P1 issues addressed within 48 hours
5. Iteration plan created for post-pilot improvements (weeks 13-14)
6. Success metrics reviewed vs targets from Project Brief:
   - Shrinkage reduction (target: 3-8% → <2%)
   - Pricing error reduction (target: 15-20% → <5%)
   - Transaction time (target: <90 seconds)
   - Shift reconciliation variance (target: <1%)
7. Case study draft documenting pilot results and testimonials

### Story 7.10: Production Hardening & Scale Preparation

As a **technical lead**,
I want **to harden the production system for broader rollout**,
so that **expansion to additional locations is smooth**.

#### Acceptance Criteria

1. Production environment reviewed for scalability:
   - Database connection pooling optimized
   - API rate limiting configured
   - Supabase plan sufficient for additional locations
   - Vercel deployment plan supports traffic growth
2. Security hardening:
   - RLS policies audit completed
   - API endpoints secured (no unauthorized access)
   - Sensitive data encrypted (passwords hashed, PII protected)
   - OWASP Top 10 vulnerabilities reviewed
3. Backup and disaster recovery:
   - Automated daily database backups configured
   - Backup restoration tested successfully
   - Disaster recovery runbook documented
4. Multi-location readiness:
   - Data isolation verified (locations cannot see each other's data except dashboard)
   - Location-specific configuration working correctly
   - User role permissions validated across locations
5. Documentation finalized:
   - Technical architecture document
   - Deployment procedures
   - Maintenance and support guide
6. Production runbook created covering: common issues, escalation paths, emergency contacts
7. Knowledge transfer session conducted with support team

---

## Checklist Results Report

### Executive Summary

**Overall PRD Completeness**: 92%
**MVP Scope Appropriateness**: Just Right
**Readiness for Architecture Phase**: Ready
**Most Critical Gaps**: Minor - Missing explicit out-of-scope documentation, needs project brief cross-reference validation

### Category Analysis

| Category                         | Status  | Critical Issues                                                |
| -------------------------------- | ------- | -------------------------------------------------------------- |
| 1. Problem Definition & Context  | PASS    | None - Goals and Background section comprehensive             |
| 2. MVP Scope Definition          | PASS    | None - 7 epics well-scoped for 12-week timeline                |
| 3. User Experience Requirements  | PASS    | None - UI Design Goals section complete with all subsections   |
| 4. Functional Requirements       | PASS    | None - 63 FR + 33 NFR comprehensive and testable               |
| 5. Non-Functional Requirements   | PASS    | None - Performance, security, reliability all addressed        |
| 6. Epic & Story Structure        | PASS    | None - 7 epics, 67 stories, all properly structured           |
| 7. Technical Guidance            | PASS    | None - Technical Assumptions section provides clear direction  |
| 8. Cross-Functional Requirements | PARTIAL | Minor - Data schema details deferred to architect (acceptable) |
| 9. Clarity & Communication       | PASS    | None - Document well-structured, consistent terminology        |

### Final Decision

✅ **READY FOR ARCHITECT**

The PRD and epics are comprehensive, properly structured, and ready for architectural design. No blocking issues identified.

---

## Next Steps

### UX Expert Prompt

Review the Cannabis Dispensary POS PRD (docs/prd.md) and Project Brief (docs/brief.md), then create a detailed UX/UI architecture document covering:

1. **Information Architecture**: Complete sitemap with screen hierarchy and navigation flows
2. **Wireframes**: Key screens (POS main screen, cart, shift reconciliation, stock count) with component layouts
3. **Component Library**: Inventory of shadcn/ui components needed with customization requirements
4. **Interaction Patterns**: Detailed interaction specifications for tier pricing indicator, tare weight modal, shift workflows
5. **Responsive Layouts**: Mobile, tablet, and desktop breakpoint specifications
6. **Accessibility Implementation**: WCAG AA compliance checklist with specific ARIA patterns for complex widgets

Focus on tablet-optimized touch interfaces and ensure the design supports sub-90-second transaction times.

### Architect Prompt

Review the Cannabis Dispensary POS PRD (docs/prd.md), Project Brief (docs/brief.md), and UX architecture (once available), then create a comprehensive technical architecture document covering:

1. **Database Schema**: Complete ERD with tables, columns, types, indexes, constraints, and RLS policies for all entities (users, locations, products, batches, transactions, shifts, pricing_tiers)
2. **Data Model**: Relationships, FIFO allocation strategy, batch depletion logic, shift state machine
3. **Application Architecture**: Component structure, state management patterns (Context vs Zustand), routing strategy
4. **API Design**: Supabase client patterns, real-time subscription usage, server-side validation approach
5. **Business Logic**: Tier pricing calculation algorithm, FIFO allocation implementation, shift variance calculation
6. **Security Model**: RLS policy definitions, authentication flows, role-based access control
7. **Performance Strategy**: Query optimization, caching, code splitting, bundle optimization
8. **Testing Approach**: Unit test boundaries, integration test scenarios, test data strategy

Prioritize solutions that fit the 12-week timeline and minimize technical complexity while ensuring production-grade quality.

---

**PRD Version 1.0 - Ready for Architecture Phase**
