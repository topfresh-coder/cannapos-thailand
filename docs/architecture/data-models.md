# Data Models

## User

**Purpose**: Represents authenticated users (cashiers, managers, owners) with role-based access.

**Key Attributes**:
- `id`: UUID (primary key, from Supabase Auth)
- `email`: string (unique, from Supabase Auth)
- `name`: string (display name)
- `role`: enum ('cashier', 'manager', 'owner')
- `location_id`: UUID (FK to locations, nullable for owners with multi-location access)
- `created_at`: timestamp
- `updated_at`: timestamp

**TypeScript Interface**:
```typescript
export interface User {
  id: string; // UUID
  email: string;
  name: string;
  role: 'cashier' | 'manager' | 'owner';
  location_id: string | null;
  created_at: string; // ISO 8601
  updated_at: string;
}
```

**Relationships**:
- `users.location_id` → `locations.id` (many-to-one, nullable)
- `users.id` ← `transactions.user_id` (one-to-many)
- `users.id` ← `shifts.opened_by_user_id` (one-to-many)

---

## Location

**Purpose**: Represents physical dispensary locations for multi-location support.

**Key Attributes**:
- `id`: UUID (primary key)
- `name`: string (e.g., "Pilot Location - Bangkok")
- `address`: string (optional for MVP)
- `created_at`: timestamp
- `updated_at`: timestamp

**TypeScript Interface**:
```typescript
export interface Location {
  id: string;
  name: string;
  address: string | null;
  created_at: string;
  updated_at: string;
}
```

**Relationships**:
- `locations.id` ← `users.location_id` (one-to-many)
- `locations.id` ← `products.location_id` (one-to-many, if multi-location inventory)
- `locations.id` ← `shifts.location_id` (one-to-many)

---

## Product

**Purpose**: Core product catalog (flower, pre-rolls, edibles, etc.)

**Key Attributes**:
- `id`: UUID (primary key)
- `sku`: string (unique, auto-generated or manual)
- `name`: string (product name)
- `category`: enum ('Flower', 'Pre-Roll', 'Edible', 'Concentrate', 'Other')
- `unit`: enum ('gram', 'piece', 'bottle', 'package')
- `base_price`: decimal (default price, overridden by tier pricing for flowers)
- `requires_tare_weight`: boolean (true for flower products)
- `reorder_threshold`: decimal (low stock alert level, defaults 50g for flower, 10 for others)
- `is_active`: boolean (soft delete flag)
- `location_id`: UUID (FK to locations, nullable for global products)
- `created_at`: timestamp
- `updated_at`: timestamp

**TypeScript Interface**:
```typescript
export type ProductCategory = 'Flower' | 'Pre-Roll' | 'Edible' | 'Concentrate' | 'Other';
export type ProductUnit = 'gram' | 'piece' | 'bottle' | 'package';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  unit: ProductUnit;
  base_price: number; // Decimal as number (in satangs/cents if needed)
  requires_tare_weight: boolean;
  reorder_threshold: number;
  is_active: boolean;
  location_id: string | null;
  created_at: string;
  updated_at: string;
}
```

**Relationships**:
- `products.location_id` → `locations.id` (many-to-one, nullable)
- `products.id` ← `product_batches.product_id` (one-to-many)
- `products.id` ← `transaction_items.product_id` (one-to-many)

---

## ProductBatch

**Purpose**: Tracks individual inventory batches with FIFO allocation, cost basis, and expiration.

**Key Attributes**:
- `id`: UUID (primary key)
- `product_id`: UUID (FK to products)
- `batch_number`: string (auto-generated: `{SKU}-{YYYYMMDD}-{SEQ}`)
- `quantity_received`: decimal (original quantity)
- `quantity_remaining`: decimal (current quantity, decremented via FIFO)
- `cost_per_unit`: decimal (purchase cost for COGS calculation)
- `received_date`: date (for FIFO ordering)
- `expiration_date`: date (nullable, for batch expiration tracking)
- `status`: enum ('Active', 'Depleted')
- `depleted_at`: timestamp (nullable, set when quantity_remaining = 0)
- `created_at`: timestamp
- `updated_at`: timestamp

**TypeScript Interface**:
```typescript
export type BatchStatus = 'Active' | 'Depleted';

export interface ProductBatch {
  id: string;
  product_id: string;
  batch_number: string;
  quantity_received: number;
  quantity_remaining: number;
  cost_per_unit: number;
  received_date: string; // ISO 8601 date
  expiration_date: string | null;
  status: BatchStatus;
  depleted_at: string | null;
  created_at: string;
  updated_at: string;
}
```

**Relationships**:
- `product_batches.product_id` → `products.id` (many-to-one)
- `product_batches.id` ← `batch_allocations` in `transaction_items.batch_allocations` JSONB (one-to-many, embedded)

---

## PricingTier

**Purpose**: Defines tiered pricing rules for flower products based on total weight.

**Key Attributes**:
- `id`: UUID (primary key)
- `tier_name`: string (e.g., "Tier 2: 3-6.99g")
- `min_weight_grams`: decimal (inclusive minimum)
- `max_weight_grams`: decimal (inclusive maximum, NULL for highest tier)
- `price_per_gram`: decimal (฿ per gram for this tier)
- `location_id`: UUID (FK to locations, nullable for global tiers)
- `created_at`: timestamp
- `updated_at`: timestamp

**TypeScript Interface**:
```typescript
export interface PricingTier {
  id: string;
  tier_name: string;
  min_weight_grams: number;
  max_weight_grams: number | null; // NULL for highest tier (e.g., "28g+")
  price_per_gram: number;
  location_id: string | null;
  created_at: string;
  updated_at: string;
}
```

**Relationships**:
- `pricing_tiers.location_id` → `locations.id` (many-to-one, nullable)
- `pricing_tiers.id` ← `transaction_items.tier_id` (one-to-many, for audit trail)

---

## Shift

**Purpose**: Tracks shift-to-shift reconciliation with mandatory cash counting.

**Key Attributes**:
- `id`: UUID (primary key)
- `shift_definition_id`: UUID (FK to shift_definitions for AM/PM schedule)
- `location_id`: UUID (FK to locations)
- `opened_by_user_id`: UUID (FK to users, cashier who opened)
- `closed_by_user_id`: UUID (FK to users, nullable until closed)
- `approved_by_user_id`: UUID (FK to users, nullable until approved)
- `opened_at`: timestamp
- `closed_at`: timestamp (nullable until closed)
- `approved_at`: timestamp (nullable until approved)
- `starting_cash_float`: decimal (cash at shift open)
- `actual_cash_count`: decimal (nullable, entered at close)
- `variance`: decimal (nullable, calculated: actual - expected)
- `variance_reason`: text (nullable, required if |variance| > ฿50)
- `handoff_notes`: text (nullable, notes for next shift)
- `status`: enum ('Open', 'Pending Approval', 'Approved', 'Rejected', 'Force Closed')
- `force_closed`: boolean (default false, true if manager force-closed)
- `rejection_reason`: text (nullable, if status = Rejected)
- `created_at`: timestamp
- `updated_at`: timestamp

**TypeScript Interface**:
```typescript
export type ShiftStatus = 'Open' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Force Closed';

export interface Shift {
  id: string;
  shift_definition_id: string;
  location_id: string;
  opened_by_user_id: string;
  closed_by_user_id: string | null;
  approved_by_user_id: string | null;
  opened_at: string;
  closed_at: string | null;
  approved_at: string | null;
  starting_cash_float: number;
  actual_cash_count: number | null;
  variance: number | null;
  variance_reason: string | null;
  handoff_notes: string | null;
  status: ShiftStatus;
  force_closed: boolean;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}
```

**Relationships**:
- `shifts.shift_definition_id` → `shift_definitions.id` (many-to-one)
- `shifts.location_id` → `locations.id` (many-to-one)
- `shifts.opened_by_user_id` → `users.id` (many-to-one)
- `shifts.id` ← `transactions.shift_id` (one-to-many)

---

## ShiftDefinition

**Purpose**: Defines shift schedules (AM/PM) per location.

**Key Attributes**:
- `id`: UUID (primary key)
- `location_id`: UUID (FK to locations)
- `shift_name`: enum ('AM', 'PM')
- `start_time`: time (e.g., "12:00:00")
- `end_time`: time (e.g., "18:00:00")
- `created_at`: timestamp
- `updated_at`: timestamp

**TypeScript Interface**:
```typescript
export type ShiftName = 'AM' | 'PM';

export interface ShiftDefinition {
  id: string;
  location_id: string;
  shift_name: ShiftName;
  start_time: string; // HH:mm:ss
  end_time: string;
  created_at: string;
  updated_at: string;
}
```

**Relationships**:
- `shift_definitions.location_id` → `locations.id` (many-to-one)
- `shift_definitions.id` ← `shifts.shift_definition_id` (one-to-many)

---

## Transaction

**Purpose**: Records completed sales transactions.

**Key Attributes**:
- `id`: UUID (primary key)
- `user_id`: UUID (FK to users, cashier)
- `location_id`: UUID (FK to locations)
- `shift_id`: UUID (FK to shifts)
- `total_amount`: decimal (final total in ฿)
- `payment_method`: enum ('Cash', 'Card', 'QR Code') - default 'Cash' for MVP
- `transaction_date`: timestamp (when transaction completed)
- `created_at`: timestamp
- `updated_at`: timestamp

**TypeScript Interface**:
```typescript
export type PaymentMethod = 'Cash' | 'Card' | 'QR Code';

export interface Transaction {
  id: string;
  user_id: string;
  location_id: string;
  shift_id: string;
  total_amount: number;
  payment_method: PaymentMethod;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}
```

**Relationships**:
- `transactions.user_id` → `users.id` (many-to-one)
- `transactions.location_id` → `locations.id` (many-to-one)
- `transactions.shift_id` → `shifts.id` (many-to-one)
- `transactions.id` ← `transaction_items.transaction_id` (one-to-many)

---

## TransactionItem

**Purpose**: Line items for each transaction with FIFO batch allocation, tier pricing, and tare weights.

**Key Attributes**:
- `id`: UUID (primary key)
- `transaction_id`: UUID (FK to transactions)
- `product_id`: UUID (FK to products)
- `quantity`: decimal (net quantity after tare deduction)
- `unit_price`: decimal (price per unit, tier price for flowers)
- `line_total`: decimal (quantity × unit_price)
- `tier_id`: UUID (FK to pricing_tiers, nullable, only for flower products)
- `gross_weight`: decimal (nullable, for tare weight tracking)
- `tare_weight`: decimal (nullable, for tare weight tracking)
- `override_price`: decimal (nullable, if manager overrode price)
- `override_reason`: text (nullable, if override_price is set)
- `batch_allocations`: JSONB (array of {batch_id, quantity_allocated, cost_per_unit} for FIFO)
- `created_at`: timestamp

**TypeScript Interface**:
```typescript
export interface BatchAllocation {
  batch_id: string;
  quantity_allocated: number;
  cost_per_unit: number;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  tier_id: string | null;
  gross_weight: number | null;
  tare_weight: number | null;
  override_price: number | null;
  override_reason: string | null;
  batch_allocations: BatchAllocation[]; // JSONB field
  created_at: string;
}
```

**Relationships**:
- `transaction_items.transaction_id` → `transactions.id` (many-to-one)
- `transaction_items.product_id` → `products.id` (many-to-one)
- `transaction_items.tier_id` → `pricing_tiers.id` (many-to-one, nullable)
- `transaction_items.batch_allocations` (JSONB) → `product_batches.id` (logical many-to-many via JSONB)

---

## InventoryAdjustment

**Purpose**: Audit trail for manual inventory corrections (damage, theft, count corrections).

**Key Attributes**:
- `id`: UUID (primary key)
- `product_id`: UUID (FK to products)
- `batch_id`: UUID (FK to product_batches)
- `adjustment_quantity`: decimal (positive or negative)
- `reason`: enum ('Damage', 'Theft', 'Count Correction', 'Other')
- `notes`: text (optional explanation)
- `user_id`: UUID (FK to users, who made adjustment)
- `stock_count_id`: UUID (FK to stock_counts, nullable if manual adjustment)
- `created_at`: timestamp

**TypeScript Interface**:
```typescript
export type AdjustmentReason = 'Damage' | 'Theft' | 'Count Correction' | 'Other';

export interface InventoryAdjustment {
  id: string;
  product_id: string;
  batch_id: string;
  adjustment_quantity: number;
  reason: AdjustmentReason;
  notes: string | null;
  user_id: string;
  stock_count_id: string | null;
  created_at: string;
}
```

**Relationships**:
- `inventory_adjustments.product_id` → `products.id` (many-to-one)
- `inventory_adjustments.batch_id` → `product_batches.id` (many-to-one)
- `inventory_adjustments.user_id` → `users.id` (many-to-one)
- `inventory_adjustments.stock_count_id` → `stock_counts.id` (many-to-one, nullable)

---

## StockCount

**Purpose**: Tracks weekly stock count sessions with variance analysis.

**Key Attributes**:
- `id`: UUID (primary key)
- `location_id`: UUID (FK to locations)
- `initiated_by_user_id`: UUID (FK to users)
- `finalized_by_user_id`: UUID (FK to users, nullable until finalized)
- `count_date`: date
- `status`: enum ('In Progress', 'Finalized', 'Cancelled')
- `count_type`: enum ('Full', 'Cycle') - Full = all products, Cycle = specific category
- `category_filter`: ProductCategory (nullable, only if count_type = Cycle)
- `initiated_at`: timestamp
- `finalized_at`: timestamp (nullable until finalized)
- `created_at`: timestamp
- `updated_at`: timestamp

**TypeScript Interface**:
```typescript
export type StockCountStatus = 'In Progress' | 'Finalized' | 'Cancelled';
export type StockCountType = 'Full' | 'Cycle';

export interface StockCount {
  id: string;
  location_id: string;
  initiated_by_user_id: string;
  finalized_by_user_id: string | null;
  count_date: string; // ISO date
  status: StockCountStatus;
  count_type: StockCountType;
  category_filter: ProductCategory | null;
  initiated_at: string;
  finalized_at: string | null;
  created_at: string;
  updated_at: string;
}
```

**Relationships**:
- `stock_counts.location_id` → `locations.id` (many-to-one)
- `stock_counts.initiated_by_user_id` → `users.id` (many-to-one)
- `stock_counts.id` ← `stock_count_items.stock_count_id` (one-to-many)
- `stock_counts.id` ← `inventory_adjustments.stock_count_id` (one-to-many)

---

## StockCountItem

**Purpose**: Individual product counts within a stock count session.

**Key Attributes**:
- `id`: UUID (primary key)
- `stock_count_id`: UUID (FK to stock_counts)
- `product_id`: UUID (FK to products)
- `expected_quantity`: decimal (system quantity at count start)
- `actual_quantity`: decimal (nullable until counted)
- `variance`: decimal (nullable, calculated: actual - expected)
- `variance_notes`: text (nullable, explanation for variance)
- `counted`: boolean (default false, true when actual_quantity entered)
- `created_at`: timestamp
- `updated_at`: timestamp

**TypeScript Interface**:
```typescript
export interface StockCountItem {
  id: string;
  stock_count_id: string;
  product_id: string;
  expected_quantity: number;
  actual_quantity: number | null;
  variance: number | null;
  variance_notes: string | null;
  counted: boolean;
  created_at: string;
  updated_at: string;
}
```

**Relationships**:
- `stock_count_items.stock_count_id` → `stock_counts.id` (many-to-one)
- `stock_count_items.product_id` → `products.id` (many-to-one)

---
