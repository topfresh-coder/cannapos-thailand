-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE user_role AS ENUM ('cashier', 'manager', 'owner');
CREATE TYPE product_category AS ENUM ('Flower', 'Pre-Roll', 'Edible', 'Concentrate', 'Other');
CREATE TYPE product_unit AS ENUM ('gram', 'piece', 'ml');
CREATE TYPE batch_status AS ENUM ('Active', 'Depleted', 'Expired');
CREATE TYPE shift_status AS ENUM ('Open', 'Pending Approval', 'Approved', 'Rejected', 'Force Closed');
CREATE TYPE payment_method AS ENUM ('Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'PromptPay');
CREATE TYPE stock_count_status AS ENUM ('In Progress', 'Completed', 'Approved');
CREATE TYPE shift_type AS ENUM ('Morning', 'Evening');

-- Create locations table
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'cashier',
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create product_batches table
CREATE TABLE product_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_quantity_consistency CHECK (quantity_remaining <= quantity_received)
);

-- Create pricing_tiers table
CREATE TABLE pricing_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  min_weight_grams DECIMAL(10, 2) NOT NULL CHECK (min_weight_grams >= 0),
  max_weight_grams DECIMAL(10, 2) CHECK (max_weight_grams IS NULL OR max_weight_grams > min_weight_grams),
  price_per_gram DECIMAL(10, 2) NOT NULL CHECK (price_per_gram > 0),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_tier_range UNIQUE (location_id, min_weight_grams, max_weight_grams)
);

-- Create shifts table
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shift_type shift_type NOT NULL,
  shift_date DATE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  starting_float DECIMAL(10, 2) NOT NULL CHECK (starting_float >= 0),
  expected_cash DECIMAL(10, 2),
  actual_cash DECIMAL(10, 2),
  variance DECIMAL(10, 2),
  variance_reason TEXT,
  total_transactions INTEGER NOT NULL DEFAULT 0,
  total_revenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status shift_status NOT NULL DEFAULT 'Open',
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_location_shift UNIQUE (location_id, shift_date, shift_type)
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_number TEXT UNIQUE NOT NULL,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  payment_method payment_method NOT NULL,
  total_flower_weight DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tier_id UUID REFERENCES pricing_tiers(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transaction_items table
CREATE TABLE transaction_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  line_total DECIMAL(10, 2) NOT NULL CHECK (line_total >= 0),
  tier_id UUID REFERENCES pricing_tiers(id) ON DELETE SET NULL,
  gross_weight DECIMAL(10, 2),
  tare_weight DECIMAL(10, 2),
  override_price DECIMAL(10, 2),
  override_reason TEXT,
  batch_allocations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stock_counts table
CREATE TABLE stock_counts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  count_date DATE NOT NULL,
  status stock_count_status NOT NULL DEFAULT 'In Progress',
  total_items_counted INTEGER NOT NULL DEFAULT 0,
  total_variance_value DECIMAL(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stock_count_items table
CREATE TABLE stock_count_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stock_count_id UUID NOT NULL REFERENCES stock_counts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  expected_quantity DECIMAL(10, 2) NOT NULL,
  counted_quantity DECIMAL(10, 2) NOT NULL,
  variance DECIMAL(10, 2) NOT NULL,
  variance_value DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_product_per_count UNIQUE (stock_count_id, product_id)
);

-- Create indexes for performance
CREATE INDEX idx_users_location ON users(location_id);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_products_location ON products(location_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(is_active);

CREATE INDEX idx_batches_product ON product_batches(product_id);
CREATE INDEX idx_batches_status ON product_batches(status);
CREATE INDEX idx_batches_received_date ON product_batches(received_date);
CREATE INDEX idx_batches_expiration ON product_batches(expiration_date) WHERE expiration_date IS NOT NULL;

CREATE INDEX idx_tiers_location ON pricing_tiers(location_id);
CREATE INDEX idx_tiers_active ON pricing_tiers(is_active);

CREATE INDEX idx_shifts_location ON shifts(location_id);
CREATE INDEX idx_shifts_user ON shifts(user_id);
CREATE INDEX idx_shifts_date ON shifts(shift_date);
CREATE INDEX idx_shifts_status ON shifts(status);

CREATE INDEX idx_transactions_location ON transactions(location_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_shift ON transactions(shift_id);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX idx_transactions_number ON transactions(transaction_number);

CREATE INDEX idx_transaction_items_transaction ON transaction_items(transaction_id);
CREATE INDEX idx_transaction_items_product ON transaction_items(product_id);

CREATE INDEX idx_stock_counts_location ON stock_counts(location_id);
CREATE INDEX idx_stock_counts_date ON stock_counts(count_date);
CREATE INDEX idx_stock_counts_status ON stock_counts(status);

CREATE INDEX idx_stock_count_items_count ON stock_count_items(stock_count_id);
CREATE INDEX idx_stock_count_items_product ON stock_count_items(product_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_batches_updated_at BEFORE UPDATE ON product_batches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_tiers_updated_at BEFORE UPDATE ON pricing_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_counts_updated_at BEFORE UPDATE ON stock_counts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-deplete batches when quantity_remaining reaches 0
CREATE OR REPLACE FUNCTION auto_deplete_batch()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quantity_remaining <= 0 AND OLD.status = 'Active' THEN
    NEW.status = 'Depleted';
    NEW.depleted_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_deplete_batch_trigger BEFORE UPDATE ON product_batches
  FOR EACH ROW EXECUTE FUNCTION auto_deplete_batch();

-- Auto-update shift totals on transaction changes
CREATE OR REPLACE FUNCTION update_shift_totals()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE shifts
    SET
      total_transactions = total_transactions + 1,
      total_revenue = total_revenue + NEW.total,
      expected_cash = starting_float + total_revenue + NEW.total
    WHERE id = NEW.shift_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE shifts
    SET
      total_transactions = total_transactions - 1,
      total_revenue = total_revenue - OLD.total,
      expected_cash = starting_float + total_revenue - OLD.total
    WHERE id = OLD.shift_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_shift_totals_trigger
AFTER INSERT OR DELETE ON transactions
  FOR EACH ROW
  WHEN (NEW.shift_id IS NOT NULL OR OLD.shift_id IS NOT NULL)
  EXECUTE FUNCTION update_shift_totals();
