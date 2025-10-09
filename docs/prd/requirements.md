# Requirements

## Functional Requirements

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

## Non-Functional Requirements

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
