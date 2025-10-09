# Epic 2: Product Management & Inventory Foundation

**Goal**: Deliver complete product catalog management capabilities including product CRUD operations, batch receiving workflow with FIFO tracking, and tare weight handling for flower products. This epic establishes the foundation for accurate inventory tracking and cost accounting.

## Story 2.1: Product List & Search Interface

As a **store manager**,
I want **to view all products in the catalog with search and filter capabilities**,
so that **I can quickly find and manage product information**.

### Acceptance Criteria

1. Product List screen displays all products in table/card view showing: SKU, name, category, unit, base_price, total available quantity
2. Search bar filters products by name or SKU in real-time
3. Category filter dropdown (All, Flower, Pre-Roll, Edible, Concentrate, Other)
4. Table sortable by: name, SKU, category, available quantity
5. "Add New Product" button navigates to product creation form
6. Clicking a product row navigates to product detail/edit screen
7. Empty state displayed when no products match search/filter
8. Loading state displayed while fetching data from Supabase

## Story 2.2: Create New Product

As a **store manager**,
I want **to add new products to the catalog**,
so that **inventory can be tracked and products sold via POS**.

### Acceptance Criteria

1. Product creation form includes fields: SKU (auto-generated or manual), name, category (dropdown), unit (dropdown: gram/piece/bottle/package), base_price, requires_tare_weight (checkbox)
2. Form validation: SKU must be unique, name required, category required, base_price > 0
3. Form uses React Hook Form + Zod schema validation
4. Success message displayed after product created
5. User redirected to Product List after successful creation
6. Error messages displayed for validation failures or database errors
7. "Cancel" button returns to Product List without saving
8. For flower products, requires_tare_weight checkbox defaults to checked

## Story 2.3: Edit & Delete Product

As a **store manager**,
I want **to update product information or remove discontinued products**,
so that **the catalog remains accurate and up-to-date**.

### Acceptance Criteria

1. Product edit form pre-populated with existing product data
2. All fields editable except SKU (read-only after creation)
3. Save button updates product record in database
4. Success message displayed after update
5. Delete button displayed with confirmation modal ("Are you sure? This will not delete associated batches or transaction history.")
6. Delete soft-deletes product (sets is_active: false) rather than hard delete
7. Deleted products excluded from POS product search
8. Validation same as create form
9. Cancel button discards changes and returns to Product List

## Story 2.4: Product Detail View with Batch History

As a **store manager**,
I want **to view all batches associated with a product and their current status**,
so that **I can understand inventory levels and FIFO allocation**.

### Acceptance Criteria

1. Product detail screen displays product information at top (read-only summary)
2. Batch history table shows all batches for this product with columns: batch_number, received_date, quantity_received, quantity_remaining, cost_per_unit, status (Active/Depleted)
3. Batches sorted by received_date ascending (oldest first) to visualize FIFO order
4. "Receive New Batch" button opens batch receiving form
5. Total available quantity calculated and displayed (sum of quantity_remaining across all active batches)
6. Depleted batches (quantity_remaining = 0) displayed in muted/gray style
7. Edit product button navigates to product edit form

## Story 2.5: Receive New Product Batch

As a **store manager**,
I want **to record receipt of new product batches with quantity and cost**,
so that **inventory is accurately tracked for FIFO allocation and cost accounting**.

### Acceptance Criteria

1. Batch receiving form includes fields: product (dropdown or pre-selected if coming from product detail), quantity_received, cost_per_unit, received_date (defaults to today), batch_number (auto-generated)
2. Form validation: quantity_received > 0, cost_per_unit > 0, received_date cannot be future
3. Batch record created in `product_batches` table with quantity_remaining initially equal to quantity_received
4. Batch_number auto-generated in format: `{PRODUCT_SKU}-{YYYYMMDD}-{SEQUENCE}` (e.g., "FLW001-20250110-001")
5. Success message displayed with batch_number
6. Product's total available quantity recalculated after batch creation
7. User returned to product detail view showing new batch in history
8. Supabase timestamp fields (created_at, updated_at) auto-populated

## Story 2.6: Tare Weight Entry During POS Transaction

As a **cashier**,
I want **to enter tare weight when adding flower products to the cart**,
so that **customers are only charged for actual product weight**.

### Acceptance Criteria

1. When adding a product with requires_tare_weight: true to cart, modal/dialog prompts for: gross_weight (total weight with container), tare_weight (container weight)
2. Net weight calculated automatically: net_weight = gross_weight - tare_weight
3. Net weight becomes the quantity for cart item (displayed in grams)
4. Modal validation: gross_weight > tare_weight, both values > 0
5. Tare weight values stored in transaction_items record for audit trail
6. Cart item displays: "{product_name} - {net_weight}g (Gross: {gross_weight}g, Tare: {tare_weight}g)"
7. Unit price applied to net_weight for line total calculation
8. "Cancel" button closes modal without adding item to cart

## Story 2.7: FIFO Inventory Allocation Engine

As a **system**,
I want **to automatically allocate inventory from oldest batches first**,
so that **product freshness is maintained and cost accounting is accurate (FIFO)**.

### Acceptance Criteria

1. When transaction is completed, allocation algorithm runs for each transaction item
2. Algorithm queries product_batches for the product ordered by received_date ASC (oldest first)
3. Quantity deducted from batches in FIFO order until transaction quantity fulfilled
4. If single batch sufficient, deduct full quantity from that batch only
5. If multiple batches needed, split allocation across batches (update quantity_remaining for each)
6. Transaction_items table updated with batch_allocations JSONB field storing: [{batch_id, quantity_allocated, cost_per_unit}]
7. Batch status updated to "Depleted" when quantity_remaining reaches 0
8. If insufficient inventory across all batches, transaction fails with error message: "Insufficient inventory for {product_name}. Available: {total_available}g, Requested: {requested_quantity}g"
9. FIFO allocation executes within database transaction to prevent race conditions

## Story 2.8: Inventory Adjustment (Manual Correction)

As a **store manager**,
I want **to manually adjust batch quantities for corrections (damage, theft, counting errors)**,
so that **inventory records remain accurate**.

### Acceptance Criteria

1. Inventory adjustment form accessible from product detail page per batch
2. Form fields: batch_id (pre-selected), adjustment_quantity (positive or negative), reason (dropdown: Damage, Theft, Count Correction, Other), notes (optional text)
3. Validation: adjustment cannot reduce quantity_remaining below 0
4. Adjustment creates record in `inventory_adjustments` audit table with: batch_id, adjustment_quantity, reason, notes, user_id, timestamp
5. Batch quantity_remaining updated: quantity_remaining += adjustment_quantity
6. Success message displayed with new quantity_remaining
7. Adjustment history visible on product detail page (expandable section)
8. Negative adjustments highlighted in red, positive in green

## Story 2.9: Low Stock Alert Indicator

As a **store manager**,
I want **visual indicators for products with low inventory**,
so that **I can proactively reorder before stock-outs occur**.

### Acceptance Criteria

1. Product List displays warning icon/badge for products where total available quantity < reorder_threshold
2. Reorder_threshold configurable per product (new field in products table, defaults to 50g for flower, 10 units for others)
3. Low stock products sortable to top of Product List
4. Product detail page shows warning banner when below threshold: "Low Stock: {available} {unit} remaining (Threshold: {reorder_threshold})"
5. Out-of-stock products (quantity = 0) display "Out of Stock" badge in red
6. POS product search shows low stock warning next to product name
7. Dashboard widget shows count of low stock products (to be implemented in Epic 6)

## Story 2.10: Batch Expiration Tracking (Optional for MVP)

As a **store manager**,
I want **to track expiration dates for product batches**,
so that **expired products are not sold**.

### Acceptance Criteria

1. Product_batches table includes expiration_date field (nullable)
2. Batch receiving form includes optional expiration_date field
3. Expired batches (expiration_date < today) excluded from FIFO allocation
4. Product List shows warning icon for products with batches expiring within 30 days
5. Product detail page highlights expiring/expired batches in amber/red
6. POS prevents adding products to cart if only expired batches available
7. Inventory report includes expiration date column for batches

---
