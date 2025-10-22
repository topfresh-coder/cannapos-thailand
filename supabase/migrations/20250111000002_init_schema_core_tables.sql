-- Migration: 20250111000002_init_schema_core_tables.sql
-- Description: Create all 12 core database tables with constraints and indexes
-- Tables are created in dependency order to satisfy foreign key constraints

-- ============================================================================
-- CORE TABLES (in dependency order)
-- ============================================================================

-- 1. Locations - Physical dispensary locations
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users - Extends Supabase auth.users with application-specific fields
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'cashier',
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products - Product catalog with pricing and inventory settings
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category product_category NOT NULL,
  unit product_unit NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
  requires_tare_weight BOOLEAN NOT NULL DEFAULT FALSE,
  reorder_threshold DECIMAL(10, 2) NOT NULL DEFAULT 50,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Product Batches - FIFO inventory batch tracking
CREATE TABLE IF NOT EXISTS product_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  batch_number TEXT UNIQUE NOT NULL,
  quantity_received DECIMAL(10, 2) NOT NULL CHECK (quantity_received > 0),
  quantity_remaining DECIMAL(10, 2) NOT NULL CHECK (quantity_remaining >= 0),
  cost_per_unit DECIMAL(10, 2) NOT NULL CHECK (cost_per_unit > 0),
  received_date DATE NOT NULL,
  expiration_date DATE,
  status batch_status NOT NULL DEFAULT 'Active',
  depleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Pricing Tiers - Tiered pricing for flowers based on weight ranges
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name TEXT NOT NULL,
  min_weight_grams DECIMAL(10, 2) NOT NULL CHECK (min_weight_grams >= 0),
  max_weight_grams DECIMAL(10, 2) CHECK (max_weight_grams IS NULL OR max_weight_grams > min_weight_grams),
  price_per_gram DECIMAL(10, 2) NOT NULL CHECK (price_per_gram > 0),
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT no_overlapping_tiers EXCLUDE USING gist (
    numrange(min_weight_grams::numeric, COALESCE(max_weight_grams::numeric, 'infinity'::numeric), '[]') WITH &&
  )
);

-- 6. Shift Definitions - AM/PM shift schedule templates
CREATE TABLE IF NOT EXISTS shift_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  shift_name shift_name NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(location_id, shift_name)
);

-- 7. Shifts - Individual shift instances with cash reconciliation
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_definition_id UUID NOT NULL REFERENCES shift_definitions(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  opened_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  closed_by_user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  approved_by_user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  starting_cash_float DECIMAL(10, 2) NOT NULL CHECK (starting_cash_float >= 0),
  actual_cash_count DECIMAL(10, 2) CHECK (actual_cash_count >= 0),
  variance DECIMAL(10, 2),
  variance_reason TEXT,
  handoff_notes TEXT,
  status shift_status NOT NULL DEFAULT 'Open',
  force_closed BOOLEAN NOT NULL DEFAULT FALSE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Transactions - Completed sales with totals and payment method
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE RESTRICT,
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  payment_method payment_method NOT NULL DEFAULT 'Cash',
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Transaction Items - Line items with batch allocations and pricing
CREATE TABLE IF NOT EXISTS transaction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  line_total DECIMAL(10, 2) NOT NULL CHECK (line_total >= 0),
  tier_id UUID REFERENCES pricing_tiers(id) ON DELETE SET NULL,
  gross_weight DECIMAL(10, 2) CHECK (gross_weight >= 0),
  tare_weight DECIMAL(10, 2) CHECK (tare_weight >= 0),
  override_price DECIMAL(10, 2) CHECK (override_price >= 0),
  override_reason TEXT,
  batch_allocations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Stock Counts - Weekly stock count sessions
CREATE TABLE IF NOT EXISTS stock_counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  initiated_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  finalized_by_user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  count_date DATE NOT NULL,
  status stock_count_status NOT NULL DEFAULT 'In Progress',
  count_type stock_count_type NOT NULL DEFAULT 'Full',
  category_filter product_category,
  initiated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  finalized_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Inventory Adjustments - Manual inventory corrections with audit trail
CREATE TABLE IF NOT EXISTS inventory_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES product_batches(id) ON DELETE CASCADE,
  adjustment_quantity DECIMAL(10, 2) NOT NULL,
  reason adjustment_reason NOT NULL,
  notes TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  stock_count_id UUID REFERENCES stock_counts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Stock Count Items - Individual product counts with variance tracking
CREATE TABLE IF NOT EXISTS stock_count_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_count_id UUID NOT NULL REFERENCES stock_counts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  expected_quantity DECIMAL(10, 2) NOT NULL,
  actual_quantity DECIMAL(10, 2),
  variance DECIMAL(10, 2),
  variance_notes TEXT,
  counted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(stock_count_id, product_id)
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Index products by category for active products only
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category) WHERE is_active = TRUE;

-- Index products by location for active products only
CREATE INDEX IF NOT EXISTS idx_products_location ON products(location_id) WHERE is_active = TRUE;

-- Index product batches by product and received date for FIFO ordering (active batches only)
CREATE INDEX IF NOT EXISTS idx_product_batches_product_received ON product_batches(product_id, received_date) WHERE status = 'Active';

-- Index product batches by status for batch lifecycle queries
CREATE INDEX IF NOT EXISTS idx_product_batches_status ON product_batches(status);

-- Index pricing tiers by weight range for tier lookup queries
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_weight_range ON pricing_tiers(min_weight_grams, max_weight_grams);

-- Index shifts by location and status for shift management queries
CREATE INDEX IF NOT EXISTS idx_shifts_location_status ON shifts(location_id, status);

-- Index shifts by user who opened them for shift history queries
CREATE INDEX IF NOT EXISTS idx_shifts_opened_by ON shifts(opened_by_user_id);

-- Index transactions by shift for shift reconciliation queries
CREATE INDEX IF NOT EXISTS idx_transactions_shift ON transactions(shift_id);

-- Index transactions by date for reporting queries
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);

-- Index transaction items by product for product sales history
CREATE INDEX IF NOT EXISTS idx_transaction_items_product ON transaction_items(product_id);

-- Index inventory adjustments by product for adjustment history
CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_product ON inventory_adjustments(product_id);

-- Index stock count items by stock count for count detail queries
CREATE INDEX IF NOT EXISTS idx_stock_count_items_stock_count ON stock_count_items(stock_count_id);

-- JSONB GIN index for batch allocations array queries
CREATE INDEX IF NOT EXISTS idx_transaction_items_batch_alloc ON transaction_items USING gin(batch_allocations);

-- ============================================================================
-- ROLLBACK INSTRUCTIONS
-- ============================================================================
-- To rollback this migration, run in reverse order:
-- DROP TABLE IF EXISTS stock_count_items CASCADE;
-- DROP TABLE IF EXISTS stock_counts CASCADE;
-- DROP TABLE IF EXISTS inventory_adjustments CASCADE;
-- DROP TABLE IF EXISTS transaction_items CASCADE;
-- DROP TABLE IF EXISTS transactions CASCADE;
-- DROP TABLE IF EXISTS shifts CASCADE;
-- DROP TABLE IF EXISTS shift_definitions CASCADE;
-- DROP TABLE IF EXISTS pricing_tiers CASCADE;
-- DROP TABLE IF EXISTS product_batches CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS locations CASCADE;
