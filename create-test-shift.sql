-- Create Test Shift for Story 1.7 MVP Testing
-- This resolves the shift_id FK constraint issue
-- Run this with: psql -h 127.0.0.1 -p 54322 -U postgres -d postgres < create-test-shift.sql

-- First, ensure we have a test location
INSERT INTO locations (id, name, address, phone, email, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test Location - MVP',
  '123 Test Street, Bangkok, Thailand',
  '+66-12-345-6789',
  'test@cannapos.local',
  true
)
ON CONFLICT (id) DO UPDATE
SET name = 'Test Location - MVP',
    updated_at = NOW();

-- Create a test shift definition
INSERT INTO shift_definitions (id, location_id, shift_name, start_time, end_time)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'AM',
  '08:00:00',
  '16:00:00'
)
ON CONFLICT (id) DO UPDATE
SET shift_name = 'AM',
    updated_at = NOW();

-- Ensure we have a test user
INSERT INTO users (id, email, name, role, location_id, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'test@cannapos.local',
  'Test Cashier',
  'cashier',
  '00000000-0000-0000-0000-000000000001',
  true
)
ON CONFLICT (id) DO UPDATE
SET email = 'test@cannapos.local',
    updated_at = NOW();

-- Create the test shift (open shift)
INSERT INTO shifts (
  id,
  shift_definition_id,
  location_id,
  opened_by_user_id,
  starting_cash_float,
  status,
  opened_at,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  2000.00,
  'Open',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET status = 'Open',
    updated_at = NOW();

-- Verify the shift was created
SELECT
  s.id,
  s.status,
  sd.shift_name,
  l.name as location_name,
  u.name as opened_by
FROM shifts s
JOIN shift_definitions sd ON s.shift_definition_id = sd.id
JOIN locations l ON s.location_id = l.id
JOIN users u ON s.opened_by_user_id = u.id
WHERE s.id = '00000000-0000-0000-0000-000000000001';
