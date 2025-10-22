-- Supabase Seed File
-- Creates test data for local development and testing
-- Resolves Story 1.7 shift_id FK constraint issue

-- ============================================================
-- TEST DATA FOR STORY 1.7 MVP
-- ============================================================

-- 1. Create Test Location
INSERT INTO locations (id, name, address)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Test Location - MVP',
  '123 Test Street, Bangkok, Thailand'
);

-- 2. Create Test Shift Definition
INSERT INTO shift_definitions (id, location_id, shift_name, start_time, end_time)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'AM',
  '08:00:00',
  '16:00:00'
);

-- 3. Create Test User in auth.users (Supabase Auth)
-- This is required before creating user in public.users due to FK constraint
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'test@cannapos.local',
  crypt('testpass123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  false,
  '',
  ''
);

-- 4. Create Test User in public.users (Application Data)
INSERT INTO users (id, email, name, role, location_id)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'test@cannapos.local',
  'Test Cashier',
  'cashier',
  '00000000-0000-0000-0000-000000000001'::uuid
);

-- 5. Create Test Shift (Open Status)
-- This is the critical record needed to fix Story 1.7 FK constraint
INSERT INTO shifts (
  id,
  shift_definition_id,
  location_id,
  opened_by_user_id,
  starting_cash_float,
  status,
  opened_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  2000.00,
  'Open',
  NOW()
);

-- 6. Create Test Product for E2E Testing
INSERT INTO products (
  id,
  sku,
  name,
  category,
  unit,
  base_price,
  requires_tare_weight,
  reorder_threshold,
  location_id
)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'TEST-001',
  'Test Flower Product',
  'Flower',
  'gram',
  400.00,
  false,
  100.00,
  '00000000-0000-0000-0000-000000000001'::uuid
);

-- 7. Create Test Product Batch for LIFO Testing
INSERT INTO product_batches (
  id,
  product_id,
  batch_number,
  quantity_received,
  quantity_remaining,
  cost_per_unit,
  received_date,
  status
)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'BATCH-TEST-001',
  1000.00,
  1000.00,
  200.00,
  '2025-01-15'::date,
  'Active'
);

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Verify shift was created correctly
SELECT
  s.id,
  s.status,
  sd.shift_name,
  l.name as location_name,
  u.name as opened_by,
  s.starting_cash_float
FROM shifts s
JOIN shift_definitions sd ON s.shift_definition_id = sd.id
JOIN locations l ON s.location_id = l.id
JOIN users u ON s.opened_by_user_id = u.id
WHERE s.id = '00000000-0000-0000-0000-000000000001'::uuid;

-- Verify product and batch
SELECT
  p.name as product_name,
  pb.batch_number,
  pb.quantity_remaining,
  pb.status
FROM products p
JOIN product_batches pb ON p.id = pb.product_id
WHERE p.id = '00000000-0000-0000-0000-000000000001'::uuid;
