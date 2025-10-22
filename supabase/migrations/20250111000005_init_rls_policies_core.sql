-- Migration: 20250111000005_init_rls_policies_core.sql
-- Description: Enable RLS and create policies for core tables (users, locations, products, product_batches)
-- Strategy: Default deny with explicit allow policies. Location isolation for multi-tenant security.
-- Rollback: See rollback procedure at bottom of file
--
-- Security Model:
-- - Default Deny: All tables have RLS enabled, no access without explicit policy
-- - Location Isolation: Users see only data from their assigned location (except owners)
-- - Role-Based: Policies use current_user_role() and current_user_location() helpers
-- - JWT Authentication: All policies extract user identity from Supabase JWT via auth.uid()
--
-- Roles:
-- - cashier: Read-only access to location data
-- - manager: Cashier permissions + create/edit products and batches at their location
-- - owner: Manager permissions + access all locations + manage users

BEGIN;

-- ============================================================================
-- ENABLE RLS ON CORE TABLES
-- ============================================================================
-- Once RLS is enabled, default behavior is DENY ALL unless explicit policy grants access

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_batches ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE RLS POLICIES
-- ============================================================================
-- Security Requirements:
-- - All users can read their own user record
-- - Managers/owners can read users at their location (owners see all locations)
-- - Only owners can create, update, or delete user records
-- - Prevents privilege escalation and unauthorized user enumeration

-- Policy 1: Users can read their own record
-- Purpose: Allow users to access their own profile data (name, role, location_id)
-- Used by: All authenticated users for profile display, role checks
CREATE POLICY "Users can read own record" ON users
  FOR SELECT USING (id = auth.uid());

COMMENT ON POLICY "Users can read own record" ON users IS
  'Allows authenticated users to read their own user record. Essential for profile data and role-based UI rendering.';

-- Policy 2: Managers can read location users
-- Purpose: Allow managers to view staff at their location, owners see all staff
-- Used by: Staff management screens, shift assignment, user selection dropdowns
CREATE POLICY "Managers can read location users" ON users
  FOR SELECT USING (
    current_user_role() IN ('manager', 'owner') AND
    (location_id = current_user_location() OR current_user_role() = 'owner')
  );

COMMENT ON POLICY "Managers can read location users" ON users IS
  'Allows managers to read users at their location, owners can read all users. Enables staff management and shift assignment.';

-- Policy 3: Owners can manage users
-- Purpose: Only owners can create/update/delete user accounts (includes role changes)
-- Used by: User management admin panel (owner-only)
-- Security: Prevents managers from escalating privileges or modifying other users
CREATE POLICY "Owners can manage users" ON users
  FOR ALL USING (current_user_role() = 'owner');

COMMENT ON POLICY "Owners can manage users" ON users IS
  'Only owners can INSERT, UPDATE, or DELETE users. Prevents unauthorized privilege escalation and account manipulation.';

-- ============================================================================
-- LOCATIONS TABLE RLS POLICIES
-- ============================================================================
-- Security Requirements:
-- - All authenticated users can read locations (needed for location picker in UI)
-- - Only owners can create, update, or delete locations
-- - Location data is non-sensitive (just name and address)

-- Policy 1: Authenticated users can read locations
-- Purpose: Allow all users to see location list (for dropdowns, displays)
-- Used by: Login screen (location selection), location displays in UI
CREATE POLICY "Authenticated users can read locations" ON locations
  FOR SELECT TO authenticated USING (TRUE);

COMMENT ON POLICY "Authenticated users can read locations" ON locations IS
  'All authenticated users can read locations. Needed for location picker and display names throughout UI.';

-- Policy 2: Owners can manage locations
-- Purpose: Only owners can add/edit/delete locations
-- Used by: Location management admin panel (owner-only)
CREATE POLICY "Owners can manage locations" ON locations
  FOR ALL USING (current_user_role() = 'owner');

COMMENT ON POLICY "Owners can manage locations" ON locations IS
  'Only owners can INSERT, UPDATE, or DELETE locations. Manages multi-location configuration.';

-- ============================================================================
-- PRODUCTS TABLE RLS POLICIES
-- ============================================================================
-- Security Requirements:
-- - Users can read active products at their location (or global products with location_id = NULL)
-- - Managers can create products at their location
-- - Managers can update products at their location
-- - Owners have full access to all products
-- - Location isolation prevents cross-location data leakage

-- Policy 1: Users can read location products
-- Purpose: Allow users to see products available at their location
-- Used by: POS product selection, inventory displays, reports
-- Security: location_id = NULL products are "global" and visible to all locations
CREATE POLICY "Users can read location products" ON products
  FOR SELECT USING (
    is_active = TRUE AND
    (location_id = current_user_location() OR location_id IS NULL OR current_user_role() = 'owner')
  );

COMMENT ON POLICY "Users can read location products" ON products IS
  'Users can read active products at their location. Global products (location_id IS NULL) visible to all. Owners see all products.';

-- Policy 2: Managers can insert products
-- Purpose: Allow managers to create new products
-- Used by: Product creation form in inventory management
-- Security: Requires manager role, enforced at insert time
CREATE POLICY "Managers can manage products" ON products
  FOR INSERT WITH CHECK (current_user_role() IN ('manager', 'owner'));

COMMENT ON POLICY "Managers can manage products" ON products IS
  'Managers and owners can create new products. Location assignment handled by application logic.';

-- Policy 3: Managers can update products
-- Purpose: Allow managers to edit products at their location
-- Used by: Product edit form, price changes, activation/deactivation
-- Security: Managers limited to their location, owners have full access
CREATE POLICY "Managers can update products" ON products
  FOR UPDATE USING (
    current_user_role() IN ('manager', 'owner') AND
    (location_id = current_user_location() OR current_user_role() = 'owner')
  );

COMMENT ON POLICY "Managers can update products" ON products IS
  'Managers can update products at their location, owners can update all products. Enables price changes and product management.';

-- ============================================================================
-- PRODUCT_BATCHES TABLE RLS POLICIES
-- ============================================================================
-- Security Requirements:
-- - Users can read batches for products they have access to
-- - Managers can create/update/delete batches for products at their location
-- - Uses EXISTS clause to check product access (inherits product security model)
-- - FIFO batch allocation happens in application logic

-- Policy 1: Users can read product batches
-- Purpose: Allow users to see batch information for accessible products
-- Used by: Batch selection in POS, batch history, expiration tracking
-- Security: Inherits product access rules via EXISTS subquery
CREATE POLICY "Users can read product batches" ON product_batches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_batches.product_id
        AND (p.location_id = current_user_location() OR p.location_id IS NULL OR current_user_role() = 'owner')
    )
  );

COMMENT ON POLICY "Users can read product batches" ON product_batches IS
  'Users can read batches for products they have access to. Inherits product-level location isolation.';

-- Policy 2: Managers can manage batches
-- Purpose: Allow managers to create/update batches for products at their location
-- Used by: Batch receiving, quantity adjustments, status changes
-- Security: Inherits product access rules, prevents cross-location batch manipulation
CREATE POLICY "Managers can manage batches" ON product_batches
  FOR ALL USING (
    current_user_role() IN ('manager', 'owner') AND
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_batches.product_id
        AND (p.location_id = current_user_location() OR current_user_role() = 'owner')
    )
  );

COMMENT ON POLICY "Managers can manage batches" ON product_batches IS
  'Managers can manage batches for products at their location. Owners have full access. Used for batch receiving and adjustments.';

COMMIT;

-- ============================================================================
-- VALIDATION QUERIES
-- ============================================================================
-- After deploying this migration, verify policies are active:
--
-- Check RLS is enabled:
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
--   AND tablename IN ('users', 'locations', 'products', 'product_batches');
-- Expected: All should have rowsecurity = TRUE
--
-- List all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN ('users', 'locations', 'products', 'product_batches')
-- ORDER BY tablename, policyname;
--
-- Test as different roles:
-- 1. As cashier: SELECT * FROM products; -- Should see only location products
-- 2. As manager: INSERT INTO products (...); -- Should succeed
-- 3. As owner: SELECT * FROM users; -- Should see all users

-- ============================================================================
-- ROLLBACK PROCEDURE
-- ============================================================================
-- To rollback this migration (removes all policies and disables RLS):
--
-- BEGIN;
--
-- -- Drop all policies
-- DROP POLICY IF EXISTS "Users can read own record" ON users;
-- DROP POLICY IF EXISTS "Managers can read location users" ON users;
-- DROP POLICY IF EXISTS "Owners can manage users" ON users;
-- DROP POLICY IF EXISTS "Authenticated users can read locations" ON locations;
-- DROP POLICY IF EXISTS "Owners can manage locations" ON locations;
-- DROP POLICY IF EXISTS "Users can read location products" ON products;
-- DROP POLICY IF EXISTS "Managers can manage products" ON products;
-- DROP POLICY IF EXISTS "Managers can update products" ON products;
-- DROP POLICY IF EXISTS "Users can read product batches" ON product_batches;
-- DROP POLICY IF EXISTS "Managers can manage batches" ON product_batches;
--
-- -- Disable RLS (WARNING: This removes all security restrictions!)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE locations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE product_batches DISABLE ROW LEVEL SECURITY;
--
-- COMMIT;
--
-- WARNING: Rolling back RLS policies removes multi-tenant security.
-- Only perform rollback in development environments.
