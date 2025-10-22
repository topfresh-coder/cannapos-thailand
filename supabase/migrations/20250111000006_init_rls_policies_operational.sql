-- Migration: 20250111000006_init_rls_policies_operational.sql
-- Description: Enable RLS and create policies for operational tables (shifts, transactions, inventory, stock counts)
-- Strategy: Default deny with explicit allow policies. Location isolation + role-based + operation-specific rules.
-- Rollback: See rollback procedure at bottom of file
--
-- Security Model:
-- - Default Deny: All tables have RLS enabled, no access without explicit policy
-- - Location Isolation: Users see only data from their assigned location (except owners)
-- - Operation-Specific: Different policies for open/close shift, create/approve, etc.
-- - Audit Trail Protection: Transaction items and inventory adjustments are INSERT-only
--
-- Special Considerations:
-- - Shifts table has 4 distinct policies for different operations (open, close, approve, manage)
-- - Transaction items can only be inserted by transaction creator (prevents modification)
-- - Inventory adjustments are insert-only (immutable audit trail)
-- - Stock count items can be updated only while count status is 'In Progress'

BEGIN;

-- ============================================================================
-- ENABLE RLS ON OPERATIONAL TABLES
-- ============================================================================
-- Once RLS is enabled, default behavior is DENY ALL unless explicit policy grants access

ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_count_items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PRICING_TIERS TABLE RLS POLICIES
-- ============================================================================
-- Security Requirements:
-- - All users can read pricing tiers for their location (needed for POS pricing)
-- - Managers can create/update/delete pricing tiers at their location
-- - Global tiers (location_id IS NULL) visible to all locations

-- Policy 1: Users can read pricing tiers
-- Purpose: Allow users to access pricing tier data for weight-based pricing
-- Used by: POS pricing calculations, product pricing displays
CREATE POLICY "Users can read pricing tiers" ON pricing_tiers
  FOR SELECT USING (
    location_id = current_user_location() OR location_id IS NULL OR current_user_role() = 'owner'
  );

COMMENT ON POLICY "Users can read pricing tiers" ON pricing_tiers IS
  'Users can read pricing tiers at their location. Global tiers (location_id IS NULL) visible to all. Used for weight-based pricing.';

-- Policy 2: Managers can manage pricing tiers
-- Purpose: Allow managers to configure pricing tiers for their location
-- Used by: Pricing configuration screens in settings
CREATE POLICY "Managers can manage pricing tiers" ON pricing_tiers
  FOR ALL USING (
    current_user_role() IN ('manager', 'owner') AND
    (location_id = current_user_location() OR current_user_role() = 'owner')
  );

COMMENT ON POLICY "Managers can manage pricing tiers" ON pricing_tiers IS
  'Managers can manage pricing tiers at their location, owners have full access. Used for pricing configuration.';

-- ============================================================================
-- SHIFT_DEFINITIONS TABLE RLS POLICIES
-- ============================================================================
-- Security Requirements:
-- - All users can read shift definitions at their location (needed for shift opening)
-- - Managers can create/update/delete shift definitions at their location
-- - Shift definitions are location-specific schedules (AM/PM shift times)

-- Policy 1: Users can read shift definitions
-- Purpose: Allow users to see available shift schedules
-- Used by: Shift opening screen, shift schedule displays
CREATE POLICY "Users can read shift definitions" ON shift_definitions
  FOR SELECT USING (
    location_id = current_user_location() OR current_user_role() = 'owner'
  );

COMMENT ON POLICY "Users can read shift definitions" ON shift_definitions IS
  'Users can read shift definitions at their location. Used for displaying available shifts when opening a shift.';

-- Policy 2: Managers can manage shift definitions
-- Purpose: Allow managers to configure shift schedules for their location
-- Used by: Shift configuration screens in settings
CREATE POLICY "Managers can manage shift definitions" ON shift_definitions
  FOR ALL USING (
    current_user_role() IN ('manager', 'owner') AND
    (location_id = current_user_location() OR current_user_role() = 'owner')
  );

COMMENT ON POLICY "Managers can manage shift definitions" ON shift_definitions IS
  'Managers can manage shift definitions at their location. Used for configuring AM/PM shift times.';

-- ============================================================================
-- SHIFTS TABLE RLS POLICIES
-- ============================================================================
-- Security Requirements:
-- - All users can read shifts at their location (for shift history, current shift display)
-- - Cashiers can INSERT to open their own shift (shift opening)
-- - Cashiers can UPDATE their own shift to close it (shift closing)
-- - Managers can UPDATE any shift for approval/rejection/force-close
-- - Complex policy: 4 distinct policies for different operations

-- Policy 1: Users can read location shifts
-- Purpose: Allow users to view shift records at their location
-- Used by: Shift history, current shift display, reports
CREATE POLICY "Users can read location shifts" ON shifts
  FOR SELECT USING (
    location_id = current_user_location() OR current_user_role() = 'owner'
  );

COMMENT ON POLICY "Users can read location shifts" ON shifts IS
  'Users can read shifts at their location. Used for shift history, current shift tracking, and reports.';

-- Policy 2: Cashiers can open shifts
-- Purpose: Allow cashiers to create new shift records (open shift)
-- Used by: Shift opening screen
-- Security: Must be at user's location, user must be the one opening (opened_by_user_id = auth.uid())
CREATE POLICY "Cashiers can open shifts" ON shifts
  FOR INSERT WITH CHECK (
    location_id = current_user_location() AND
    opened_by_user_id = auth.uid()
  );

COMMENT ON POLICY "Cashiers can open shifts" ON shifts IS
  'Cashiers can open new shifts at their location. Prevents opening shifts for other users or at other locations.';

-- Policy 3: Cashiers can close own shifts
-- Purpose: Allow cashiers to close their own shifts (set closed_at, actual_cash_count, etc.)
-- Used by: Shift closing screen
-- Security: Can only close shifts they opened at their location
CREATE POLICY "Cashiers can close own shifts" ON shifts
  FOR UPDATE USING (
    opened_by_user_id = auth.uid() AND
    location_id = current_user_location()
  );

COMMENT ON POLICY "Cashiers can close own shifts" ON shifts IS
  'Cashiers can close their own shifts. Prevents closing other users'' shifts or modifying approved shifts.';

-- Policy 4: Managers can manage all shifts
-- Purpose: Allow managers to approve, reject, or force-close any shift at their location
-- Used by: Shift approval screen, force-close for abandoned shifts
-- Security: Managers limited to their location, owners have full access
CREATE POLICY "Managers can manage all shifts" ON shifts
  FOR UPDATE USING (
    current_user_role() IN ('manager', 'owner') AND
    (location_id = current_user_location() OR current_user_role() = 'owner')
  );

COMMENT ON POLICY "Managers can manage all shifts" ON shifts IS
  'Managers can approve, reject, or force-close any shift at their location. Owners have full access across locations.';

-- ============================================================================
-- TRANSACTIONS TABLE RLS POLICIES
-- ============================================================================
-- Security Requirements:
-- - Users can read transactions at their location (for reports, transaction history)
-- - Cashiers can INSERT to create transactions (POS checkout)
-- - Transactions are immutable after creation (no UPDATE/DELETE policies)
-- - Location isolation prevents cross-location transaction visibility

-- Policy 1: Users can read location transactions
-- Purpose: Allow users to view transaction records at their location
-- Used by: Transaction history, reports, shift reconciliation
CREATE POLICY "Users can read location transactions" ON transactions
  FOR SELECT USING (
    location_id = current_user_location() OR current_user_role() = 'owner'
  );

COMMENT ON POLICY "Users can read location transactions" ON transactions IS
  'Users can read transactions at their location. Used for reports, transaction history, and shift reconciliation.';

-- Policy 2: Cashiers can create transactions
-- Purpose: Allow cashiers to create transaction records during POS checkout
-- Used by: POS checkout flow
-- Security: Must be at user's location, transaction must be created by authenticated user
CREATE POLICY "Cashiers can create transactions" ON transactions
  FOR INSERT WITH CHECK (
    location_id = current_user_location() AND
    user_id = auth.uid()
  );

COMMENT ON POLICY "Cashiers can create transactions" ON transactions IS
  'Cashiers can create transactions at their location. Prevents creating transactions for other users or locations.';

-- ============================================================================
-- TRANSACTION_ITEMS TABLE RLS POLICIES
-- ============================================================================
-- Security Requirements:
-- - Users can read transaction items for transactions they can access
-- - Cashiers can INSERT transaction items only for their own transactions
-- - Transaction items are immutable (audit trail protection)
-- - Uses EXISTS clause to inherit transaction access rules

-- Policy 1: Users can read transaction items
-- Purpose: Allow users to view line items for accessible transactions
-- Used by: Transaction detail view, receipt display, reports
-- Security: Inherits transaction access rules via EXISTS subquery
CREATE POLICY "Users can read transaction items" ON transaction_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM transactions t
      WHERE t.id = transaction_items.transaction_id
        AND (t.location_id = current_user_location() OR current_user_role() = 'owner')
    )
  );

COMMENT ON POLICY "Users can read transaction items" ON transaction_items IS
  'Users can read transaction items for transactions they have access to. Inherits transaction-level location isolation.';

-- Policy 2: Cashiers can create transaction items
-- Purpose: Allow cashiers to add line items to their own transactions during checkout
-- Used by: POS checkout flow (adding products to cart)
-- Security: Can only add items to own transactions at own location
CREATE POLICY "Cashiers can create transaction items" ON transaction_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM transactions t
      WHERE t.id = transaction_items.transaction_id
        AND t.location_id = current_user_location()
        AND t.user_id = auth.uid()
    )
  );

COMMENT ON POLICY "Cashiers can create transaction items" ON transaction_items IS
  'Cashiers can create transaction items only for their own transactions. Prevents modification of other users'' transactions.';

-- ============================================================================
-- INVENTORY_ADJUSTMENTS TABLE RLS POLICIES
-- ============================================================================
-- Security Requirements:
-- - Users can read adjustments for products they have access to
-- - Managers can INSERT adjustments (damage, theft, corrections)
-- - Adjustments are immutable (audit trail protection)
-- - Uses EXISTS clause to inherit product access rules

-- Policy 1: Users can read inventory adjustments
-- Purpose: Allow users to view adjustment history for accessible products
-- Used by: Inventory adjustment history, audit reports
-- Security: Inherits product access rules via EXISTS subquery
CREATE POLICY "Users can read inventory adjustments" ON inventory_adjustments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = inventory_adjustments.product_id
        AND (p.location_id = current_user_location() OR p.location_id IS NULL OR current_user_role() = 'owner')
    )
  );

COMMENT ON POLICY "Users can read inventory adjustments" ON inventory_adjustments IS
  'Users can read inventory adjustments for products they have access to. Used for audit trails and reports.';

-- Policy 2: Managers can create adjustments
-- Purpose: Allow managers to create inventory adjustment records
-- Used by: Manual adjustment forms, stock count finalization
-- Security: Requires manager role, user_id must be authenticated user
CREATE POLICY "Managers can create adjustments" ON inventory_adjustments
  FOR INSERT WITH CHECK (
    current_user_role() IN ('manager', 'owner') AND
    user_id = auth.uid()
  );

COMMENT ON POLICY "Managers can create adjustments" ON inventory_adjustments IS
  'Managers can create inventory adjustments. Immutable audit trail prevents modification or deletion.';

-- ============================================================================
-- STOCK_COUNTS TABLE RLS POLICIES
-- ============================================================================
-- Security Requirements:
-- - Users can read stock counts at their location
-- - Managers can create/update/delete stock counts at their location
-- - Stock count workflow: In Progress -> Finalized (or Cancelled)

-- Policy 1: Users can read location stock counts
-- Purpose: Allow users to view stock count records at their location
-- Used by: Stock count list, count history, reports
CREATE POLICY "Users can read location stock counts" ON stock_counts
  FOR SELECT USING (
    location_id = current_user_location() OR current_user_role() = 'owner'
  );

COMMENT ON POLICY "Users can read location stock counts" ON stock_counts IS
  'Users can read stock counts at their location. Used for count tracking and inventory reports.';

-- Policy 2: Managers can manage stock counts
-- Purpose: Allow managers to create, update, and finalize stock counts
-- Used by: Stock count initiation, finalization, cancellation
CREATE POLICY "Managers can manage stock counts" ON stock_counts
  FOR ALL USING (
    current_user_role() IN ('manager', 'owner') AND
    (location_id = current_user_location() OR current_user_role() = 'owner')
  );

COMMENT ON POLICY "Managers can manage stock counts" ON stock_counts IS
  'Managers can manage stock counts at their location. Used for initiating and finalizing inventory counts.';

-- ============================================================================
-- STOCK_COUNT_ITEMS TABLE RLS POLICIES
-- ============================================================================
-- Security Requirements:
-- - Users can read stock count items for counts they can access
-- - Users can UPDATE stock count items only while count is 'In Progress'
-- - Prevents modification of finalized counts (data integrity)
-- - Uses EXISTS clause to inherit stock count access rules

-- Policy 1: Users can read stock count items
-- Purpose: Allow users to view items in stock counts they have access to
-- Used by: Stock count detail view, counting interface
-- Security: Inherits stock count access rules via EXISTS subquery
CREATE POLICY "Users can read stock count items" ON stock_count_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stock_counts sc
      WHERE sc.id = stock_count_items.stock_count_id
        AND (sc.location_id = current_user_location() OR current_user_role() = 'owner')
    )
  );

COMMENT ON POLICY "Users can read stock count items" ON stock_count_items IS
  'Users can read stock count items for counts they have access to. Used for counting interface and reports.';

-- Policy 2: Users can update stock count items
-- Purpose: Allow users to update count quantities while count is in progress
-- Used by: Stock counting interface (entering actual quantities)
-- Security: Can only update items for counts at their location AND status = 'In Progress'
CREATE POLICY "Users can update stock count items" ON stock_count_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM stock_counts sc
      WHERE sc.id = stock_count_items.stock_count_id
        AND (sc.location_id = current_user_location() OR current_user_role() = 'owner')
        AND sc.status = 'In Progress'
    )
  );

COMMENT ON POLICY "Users can update stock count items" ON stock_count_items IS
  'Users can update stock count items only while count is In Progress. Prevents modification of finalized counts.';

COMMIT;

-- ============================================================================
-- VALIDATION QUERIES
-- ============================================================================
-- After deploying this migration, verify policies are active:
--
-- Check RLS is enabled on all operational tables:
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
--   AND tablename IN (
--     'pricing_tiers', 'shift_definitions', 'shifts', 'transactions',
--     'transaction_items', 'inventory_adjustments', 'stock_counts', 'stock_count_items'
--   );
-- Expected: All should have rowsecurity = TRUE
--
-- Count policies per table:
-- SELECT tablename, COUNT(*) as policy_count
-- FROM pg_policies
-- WHERE tablename IN (
--   'pricing_tiers', 'shift_definitions', 'shifts', 'transactions',
--   'transaction_items', 'inventory_adjustments', 'stock_counts', 'stock_count_items'
-- )
-- GROUP BY tablename
-- ORDER BY tablename;
--
-- Expected policy counts:
-- pricing_tiers: 2
-- shift_definitions: 2
-- shifts: 4
-- transactions: 2
-- transaction_items: 2
-- inventory_adjustments: 2
-- stock_counts: 2
-- stock_count_items: 2
--
-- Test as different roles:
-- 1. As cashier: INSERT INTO shifts (...); -- Should succeed for own shift
-- 2. As cashier: INSERT INTO transactions (...); -- Should succeed at own location
-- 3. As manager: UPDATE shifts SET status = 'Approved' WHERE id = '...'; -- Should succeed
-- 4. As cashier: UPDATE stock_count_items SET actual_quantity = 100 WHERE ...; -- Should succeed if In Progress

-- ============================================================================
-- ROLLBACK PROCEDURE
-- ============================================================================
-- To rollback this migration (removes all policies and disables RLS):
--
-- BEGIN;
--
-- -- Drop all pricing_tiers policies
-- DROP POLICY IF EXISTS "Users can read pricing tiers" ON pricing_tiers;
-- DROP POLICY IF EXISTS "Managers can manage pricing tiers" ON pricing_tiers;
--
-- -- Drop all shift_definitions policies
-- DROP POLICY IF EXISTS "Users can read shift definitions" ON shift_definitions;
-- DROP POLICY IF EXISTS "Managers can manage shift definitions" ON shift_definitions;
--
-- -- Drop all shifts policies
-- DROP POLICY IF EXISTS "Users can read location shifts" ON shifts;
-- DROP POLICY IF EXISTS "Cashiers can open shifts" ON shifts;
-- DROP POLICY IF EXISTS "Cashiers can close own shifts" ON shifts;
-- DROP POLICY IF EXISTS "Managers can manage all shifts" ON shifts;
--
-- -- Drop all transactions policies
-- DROP POLICY IF EXISTS "Users can read location transactions" ON transactions;
-- DROP POLICY IF EXISTS "Cashiers can create transactions" ON transactions;
--
-- -- Drop all transaction_items policies
-- DROP POLICY IF EXISTS "Users can read transaction items" ON transaction_items;
-- DROP POLICY IF EXISTS "Cashiers can create transaction items" ON transaction_items;
--
-- -- Drop all inventory_adjustments policies
-- DROP POLICY IF EXISTS "Users can read inventory adjustments" ON inventory_adjustments;
-- DROP POLICY IF EXISTS "Managers can create adjustments" ON inventory_adjustments;
--
-- -- Drop all stock_counts policies
-- DROP POLICY IF EXISTS "Users can read location stock counts" ON stock_counts;
-- DROP POLICY IF EXISTS "Managers can manage stock counts" ON stock_counts;
--
-- -- Drop all stock_count_items policies
-- DROP POLICY IF EXISTS "Users can read stock count items" ON stock_count_items;
-- DROP POLICY IF EXISTS "Users can update stock count items" ON stock_count_items;
--
-- -- Disable RLS (WARNING: This removes all security restrictions!)
-- ALTER TABLE pricing_tiers DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE shift_definitions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE shifts DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE transaction_items DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE inventory_adjustments DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE stock_counts DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE stock_count_items DISABLE ROW LEVEL SECURITY;
--
-- COMMIT;
--
-- WARNING: Rolling back RLS policies removes multi-tenant security and audit trail protection.
-- Only perform rollback in development environments.
