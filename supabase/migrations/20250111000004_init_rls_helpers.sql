-- Migration: 20250111000004_init_rls_helpers.sql
-- Description: Creates helper functions for Row-Level Security policies
-- Strategy: Helper functions simplify RLS policy logic and ensure consistent security checks
-- Rollback: DROP FUNCTION current_user_role(); DROP FUNCTION current_user_location();
--
-- These functions are marked as STABLE SECURITY DEFINER to:
-- - STABLE: Results don't change within a single transaction (safe for RLS)
-- - SECURITY DEFINER: Execute with elevated privileges to access users table
--
-- Security Note: These functions are critical to the RLS security model.
-- They extract user.role and user.location_id from the users table based on
-- the authenticated user's JWT token (auth.uid()). All RLS policies depend on
-- these functions returning correct values.

BEGIN;

-- ============================================================================
-- HELPER FUNCTION: current_user_role()
-- ============================================================================
-- Purpose: Returns the role of the currently authenticated user
-- Returns: user_role enum ('cashier', 'manager', 'owner')
-- Security: STABLE SECURITY DEFINER allows execution in RLS context
-- Usage: Used in all RLS policies that need role-based authorization

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION current_user_role() IS
  'Returns the role of the current authenticated user from JWT token. Used by RLS policies for role-based access control.';

-- ============================================================================
-- HELPER FUNCTION: current_user_location()
-- ============================================================================
-- Purpose: Returns the location_id of the currently authenticated user
-- Returns: UUID of user's assigned location (or NULL if not assigned)
-- Security: STABLE SECURITY DEFINER allows execution in RLS context
-- Usage: Used in all RLS policies that need location-based isolation

CREATE OR REPLACE FUNCTION current_user_location()
RETURNS UUID AS $$
  SELECT location_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION current_user_location() IS
  'Returns the location_id of the current authenticated user from JWT token. Used by RLS policies for location-based data isolation.';

COMMIT;

-- ============================================================================
-- VALIDATION
-- ============================================================================
-- After deploying this migration, verify the functions work correctly:
--
-- Test as authenticated user:
-- SELECT current_user_role();     -- Should return your role
-- SELECT current_user_location(); -- Should return your location_id
--
-- Test function properties:
-- SELECT proname, provolatile, prosecdef
-- FROM pg_proc
-- WHERE proname IN ('current_user_role', 'current_user_location');
-- Expected: provolatile = 's' (stable), prosecdef = 't' (security definer)

-- ============================================================================
-- ROLLBACK PROCEDURE
-- ============================================================================
-- To rollback this migration:
--
-- BEGIN;
-- DROP FUNCTION IF EXISTS current_user_location();
-- DROP FUNCTION IF EXISTS current_user_role();
-- COMMIT;
--
-- WARNING: Do not rollback if RLS policies have been deployed (migrations 005 and 006)
-- as they depend on these functions. Rollback policies first.
