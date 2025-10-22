-- Migration: 20250111000001_init_schema_enums_extensions.sql
-- Description: Initialize database extensions and create all enum types for type safety
-- This migration must run first before any tables are created

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Note: PostgreSQL 13+ includes gen_random_uuid() natively
-- No extensions required for UUID generation

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- User role enumeration for role-based access control
CREATE TYPE user_role AS ENUM ('cashier', 'manager', 'owner');

-- Product category enumeration for inventory classification
CREATE TYPE product_category AS ENUM ('Flower', 'Pre-Roll', 'Edible', 'Concentrate', 'Other');

-- Product unit enumeration for quantity measurements
CREATE TYPE product_unit AS ENUM ('gram', 'piece', 'bottle', 'package');

-- Batch status enumeration for inventory batch lifecycle
CREATE TYPE batch_status AS ENUM ('Active', 'Depleted');

-- Shift name enumeration for shift scheduling
CREATE TYPE shift_name AS ENUM ('AM', 'PM');

-- Shift status enumeration for shift workflow states
CREATE TYPE shift_status AS ENUM ('Open', 'Pending Approval', 'Approved', 'Rejected', 'Force Closed');

-- Payment method enumeration for transaction payment types
CREATE TYPE payment_method AS ENUM ('Cash', 'Card', 'QR Code');

-- Adjustment reason enumeration for inventory adjustment tracking
CREATE TYPE adjustment_reason AS ENUM ('Damage', 'Theft', 'Count Correction', 'Other');

-- Stock count status enumeration for stock count workflow
CREATE TYPE stock_count_status AS ENUM ('In Progress', 'Finalized', 'Cancelled');

-- Stock count type enumeration for stock count categorization
CREATE TYPE stock_count_type AS ENUM ('Full', 'Cycle');

-- ============================================================================
-- ROLLBACK INSTRUCTIONS
-- ============================================================================
-- To rollback this migration, run:
-- DROP TYPE IF EXISTS stock_count_type;
-- DROP TYPE IF EXISTS stock_count_status;
-- DROP TYPE IF EXISTS adjustment_reason;
-- DROP TYPE IF EXISTS payment_method;
-- DROP TYPE IF EXISTS shift_status;
-- DROP TYPE IF EXISTS shift_name;
-- DROP TYPE IF EXISTS batch_status;
-- DROP TYPE IF EXISTS product_unit;
-- DROP TYPE IF EXISTS product_category;
-- DROP TYPE IF EXISTS user_role;
