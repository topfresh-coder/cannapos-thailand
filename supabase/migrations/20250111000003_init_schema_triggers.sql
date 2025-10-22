-- Migration: 20250111000003_init_schema_triggers.sql
-- Description: Create trigger functions and triggers for automated database operations
-- Includes updated_at triggers, shift variance calculation, batch depletion, and stock count variance

-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- Function: Auto-update updated_at timestamp on row updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Auto-calculate shift variance based on cash count
CREATE OR REPLACE FUNCTION calculate_shift_variance()
RETURNS TRIGGER AS $$
DECLARE
  expected_cash DECIMAL(10, 2);
  total_revenue DECIMAL(10, 2);
BEGIN
  IF NEW.actual_cash_count IS NOT NULL THEN
    -- Calculate total revenue for this shift from all transactions
    SELECT COALESCE(SUM(total_amount), 0) INTO total_revenue
    FROM transactions
    WHERE shift_id = NEW.id;

    -- Expected cash = starting float + total revenue from shift
    expected_cash := NEW.starting_cash_float + total_revenue;

    -- Variance = actual count - expected cash (positive = overage, negative = shortage)
    NEW.variance := NEW.actual_cash_count - expected_cash;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Auto-deplete batches when quantity reaches zero
CREATE OR REPLACE FUNCTION auto_deplete_batch()
RETURNS TRIGGER AS $$
BEGIN
  -- If quantity_remaining reaches 0, mark batch as depleted
  IF NEW.quantity_remaining = 0 AND OLD.quantity_remaining > 0 THEN
    NEW.status := 'Depleted';
    NEW.depleted_at := NOW();
  -- If quantity_remaining increases from 0, reactivate batch
  ELSIF NEW.quantity_remaining > 0 AND OLD.status = 'Depleted' THEN
    NEW.status := 'Active';
    NEW.depleted_at := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Auto-calculate stock count variance
CREATE OR REPLACE FUNCTION calculate_stock_count_variance()
RETURNS TRIGGER AS $$
BEGIN
  -- When actual quantity is entered, calculate variance and mark as counted
  IF NEW.actual_quantity IS NOT NULL THEN
    NEW.variance := NEW.actual_quantity - NEW.expected_quantity;
    NEW.counted := TRUE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================

-- Trigger: Auto-update locations.updated_at
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update users.updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update products.updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update product_batches.updated_at
CREATE TRIGGER update_product_batches_updated_at
  BEFORE UPDATE ON product_batches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update pricing_tiers.updated_at
CREATE TRIGGER update_pricing_tiers_updated_at
  BEFORE UPDATE ON pricing_tiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update shift_definitions.updated_at
CREATE TRIGGER update_shift_definitions_updated_at
  BEFORE UPDATE ON shift_definitions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update shifts.updated_at
CREATE TRIGGER update_shifts_updated_at
  BEFORE UPDATE ON shifts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update transactions.updated_at
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update stock_counts.updated_at
CREATE TRIGGER update_stock_counts_updated_at
  BEFORE UPDATE ON stock_counts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update stock_count_items.updated_at
CREATE TRIGGER update_stock_count_items_updated_at
  BEFORE UPDATE ON stock_count_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- BUSINESS LOGIC TRIGGERS
-- ============================================================================

-- Trigger: Auto-calculate shift variance when actual_cash_count is updated
CREATE TRIGGER trigger_calculate_shift_variance
  BEFORE INSERT OR UPDATE OF actual_cash_count ON shifts
  FOR EACH ROW
  EXECUTE FUNCTION calculate_shift_variance();

-- Trigger: Auto-deplete batches when quantity_remaining reaches 0
CREATE TRIGGER trigger_auto_deplete_batch
  BEFORE UPDATE OF quantity_remaining ON product_batches
  FOR EACH ROW
  EXECUTE FUNCTION auto_deplete_batch();

-- Trigger: Auto-calculate stock count variance when actual_quantity is entered
CREATE TRIGGER trigger_calculate_stock_count_variance
  BEFORE INSERT OR UPDATE OF actual_quantity ON stock_count_items
  FOR EACH ROW
  EXECUTE FUNCTION calculate_stock_count_variance();

-- ============================================================================
-- ROLLBACK INSTRUCTIONS
-- ============================================================================
-- To rollback this migration, run:
-- DROP TRIGGER IF EXISTS trigger_calculate_stock_count_variance ON stock_count_items;
-- DROP TRIGGER IF EXISTS trigger_auto_deplete_batch ON product_batches;
-- DROP TRIGGER IF EXISTS trigger_calculate_shift_variance ON shifts;
-- DROP TRIGGER IF EXISTS update_stock_count_items_updated_at ON stock_count_items;
-- DROP TRIGGER IF EXISTS update_stock_counts_updated_at ON stock_counts;
-- DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
-- DROP TRIGGER IF EXISTS update_shifts_updated_at ON shifts;
-- DROP TRIGGER IF EXISTS update_shift_definitions_updated_at ON shift_definitions;
-- DROP TRIGGER IF EXISTS update_pricing_tiers_updated_at ON pricing_tiers;
-- DROP TRIGGER IF EXISTS update_product_batches_updated_at ON product_batches;
-- DROP TRIGGER IF EXISTS update_products_updated_at ON products;
-- DROP TRIGGER IF EXISTS update_users_updated_at ON users;
-- DROP TRIGGER IF EXISTS update_locations_updated_at ON locations;
-- DROP FUNCTION IF EXISTS calculate_stock_count_variance();
-- DROP FUNCTION IF EXISTS auto_deplete_batch();
-- DROP FUNCTION IF EXISTS calculate_shift_variance();
-- DROP FUNCTION IF EXISTS update_updated_at_column();
