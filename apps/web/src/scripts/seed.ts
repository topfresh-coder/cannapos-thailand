/**
 * Database Seed Script
 *
 * Seeds the database with initial sample data for testing and development.
 * Implements idempotency - safe to run multiple times.
 *
 * Usage: pnpm seed
 *
 * Requirements:
 * - VITE_SUPABASE_URL environment variable
 * - SUPABASE_SERVICE_ROLE_KEY environment variable (bypasses RLS)
 *
 * SECURITY WARNING: Service role key bypasses ALL RLS policies.
 * Only use in backend/seed scripts, NEVER in frontend code.
 *
 * TROUBLESHOOTING:
 *
 * Error: "Missing VITE_SUPABASE_URL environment variable"
 * Solution: Ensure VITE_SUPABASE_URL is set in apps/web/.env.local
 *
 * Error: "Missing SUPABASE_SERVICE_ROLE_KEY environment variable"
 * Solution: Add SUPABASE_SERVICE_ROLE_KEY to apps/web/.env.local
 *           Find it in: Supabase Dashboard > Project Settings > API > service_role key
 *
 * Error: "Duplicate key value violates unique constraint"
 * Solution: Data already exists. Script is idempotent - this means the data is already seeded.
 *           To re-seed, manually delete existing data or reset the database with:
 *           supabase db reset
 *
 * Error: "Connection refused" or "Network error"
 * Solution: Start Supabase with: supabase start
 *           Verify it's running with: supabase status
 *
 * Idempotency Approach:
 * - Script checks for existing "Pilot Location - Bangkok" before inserting
 * - If found, exits gracefully without making changes
 * - Safe to run multiple times without duplicating data
 * - Insert order maintained: location → products (with location_id FK) → batches (with product_id FK)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase.js';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Validate required environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('❌ Missing VITE_SUPABASE_URL environment variable');
  process.exit(1);
}

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.error('   Set this in your .env.local file (NOT committed to git)');
  process.exit(1);
}

// Create Supabase client with service role key to bypass RLS
const supabase = createClient<Database>(
  SUPABASE_URL,
  SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false, // No session needed for seed script
      autoRefreshToken: false
    }
  }
);

/**
 * Seeds the location record
 * @returns The created location's UUID
 */
async function seedLocation(): Promise<string> {
  console.log('📍 Seeding location...');

  const { data: location, error } = await supabase
    .from('locations')
    .insert({
      name: 'Pilot Location - Bangkok',
      address: '123 Sukhumvit Road, Bangkok, Thailand'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to seed location: ${error.message}`);
  }

  console.log(`✅ Location created: ${location.name}`);
  return location.id;
}

/**
 * Seeds product records
 * @param locationId - The location UUID to associate products with
 * @returns Array of created products with their IDs and SKUs
 */
async function seedProducts(locationId: string): Promise<Array<{ id: string; sku: string }>> {
  console.log('🛍️  Seeding products...');

  type ProductInsert = Database['public']['Tables']['products']['Insert'];

  const products: ProductInsert[] = [
    // Flower products (requires_tare_weight = true) - AC: At least 3 flower products with tare weight
    {
      sku: 'FLW001',
      name: 'Thai Sativa',
      category: 'Flower',
      unit: 'gram',
      base_price: 400,
      requires_tare_weight: true,
      reorder_threshold: 50,
      is_active: true,
      location_id: locationId
    },
    {
      sku: 'FLW002',
      name: 'Northern Lights',
      category: 'Flower',
      unit: 'gram',
      base_price: 450,
      requires_tare_weight: true,
      reorder_threshold: 50,
      is_active: true,
      location_id: locationId
    },
    {
      sku: 'FLW003',
      name: 'OG Kush',
      category: 'Flower',
      unit: 'gram',
      base_price: 500,
      requires_tare_weight: true,
      reorder_threshold: 50,
      is_active: true,
      location_id: locationId
    },
    // Pre-Roll products
    {
      sku: 'PRE001',
      name: 'Sativa Pre-Roll',
      category: 'Pre-Roll',
      unit: 'piece',
      base_price: 150,
      requires_tare_weight: false,
      reorder_threshold: 50,
      is_active: true,
      location_id: locationId
    },
    {
      sku: 'PRE002',
      name: 'Indica Pre-Roll',
      category: 'Pre-Roll',
      unit: 'piece',
      base_price: 150,
      requires_tare_weight: false,
      reorder_threshold: 50,
      is_active: true,
      location_id: locationId
    },
    // Edible products
    {
      sku: 'EDI001',
      name: 'Chocolate Bar 100mg',
      category: 'Edible',
      unit: 'package',
      base_price: 300,
      requires_tare_weight: false,
      reorder_threshold: 50,
      is_active: true,
      location_id: locationId
    },
    {
      sku: 'EDI002',
      name: 'Gummy Bears 50mg',
      category: 'Edible',
      unit: 'package',
      base_price: 200,
      requires_tare_weight: false,
      reorder_threshold: 50,
      is_active: true,
      location_id: locationId
    },
    // Concentrate products
    {
      sku: 'CON001',
      name: 'Shatter',
      category: 'Concentrate',
      unit: 'gram',
      base_price: 800,
      requires_tare_weight: false,
      reorder_threshold: 50,
      is_active: true,
      location_id: locationId
    },
    // Other category products (to meet AC: at least 10 products)
    {
      sku: 'OTH001',
      name: 'Vape Pen',
      category: 'Other',
      unit: 'piece',
      base_price: 500,
      requires_tare_weight: false,
      reorder_threshold: 50,
      is_active: true,
      location_id: locationId
    },
    {
      sku: 'OTH002',
      name: 'Grinder',
      category: 'Other',
      unit: 'piece',
      base_price: 150,
      requires_tare_weight: false,
      reorder_threshold: 50,
      is_active: true,
      location_id: locationId
    }
  ];

  const { data: insertedProducts, error } = await supabase
    .from('products')
    .insert(products)
    .select('id, sku');

  if (error) {
    throw new Error(`Failed to seed products: ${error.message}`);
  }

  console.log(`✅ ${insertedProducts.length} products created`);
  return insertedProducts;
}

/**
 * Seeds product batch records
 * @param products - Array of products with their IDs and SKUs
 */
async function seedBatches(products: Array<{ id: string; sku: string }>): Promise<void> {
  console.log('📦 Seeding product batches...');

  type BatchInsert = Database['public']['Tables']['product_batches']['Insert'];

  // Create 2 batches per product with different received dates for FIFO testing
  const batches: BatchInsert[] = products.flatMap((product) => [
    {
      product_id: product.id,
      batch_number: `${product.sku}-20250101-001`,
      quantity_received: 100,
      quantity_remaining: 100,
      cost_per_unit: 200, // Placeholder cost (50% of typical base price)
      received_date: '2025-01-01',
      status: 'Active'
    },
    {
      product_id: product.id,
      batch_number: `${product.sku}-20250105-002`,
      quantity_received: 100,
      quantity_remaining: 100,
      cost_per_unit: 200,
      received_date: '2025-01-05',
      status: 'Active'
    }
  ]);

  const { data: insertedBatches, error } = await supabase
    .from('product_batches')
    .insert(batches)
    .select('id');

  if (error) {
    throw new Error(`Failed to seed batches: ${error.message}`);
  }

  console.log(`✅ ${insertedBatches.length} batches created`);
}

/**
 * Main seed function
 * Implements idempotency by checking for existing data before seeding
 */
async function main(): Promise<void> {
  try {
    console.log('🌱 Starting seed process...');
    console.log(`   Using Supabase URL: ${SUPABASE_URL}`);

    // Idempotency check: Query for existing location
    const { data: existingLocation, error: checkError } = await supabase
      .from('locations')
      .select('id, name')
      .eq('name', 'Pilot Location - Bangkok')
      .maybeSingle();

    if (checkError) {
      throw new Error(`Failed to check for existing data: ${checkError.message}`);
    }

    if (existingLocation) {
      console.log('⚠️  Seed data already exists. Database is already seeded.');
      console.log(`   Found existing location: "${existingLocation.name}" (ID: ${existingLocation.id})`);
      console.log('   Skipping seed process to maintain idempotency.');
      console.log('   To re-seed, manually delete existing data or reset the database.');
      return;
    }

    // Seed data in order: location → products → batches
    const locationId = await seedLocation();
    const products = await seedProducts(locationId);
    await seedBatches(products);

    console.log('');
    console.log('🎉 Seed process complete!');
    console.log('');
    console.log('Summary:');
    console.log(`   - 1 location created`);
    console.log(`   - ${products.length} products created (3+ flower products with tare weight)`);
    console.log(`   - ${products.length * 2} batches created (2 per product for FIFO testing)`);
    console.log('');
    console.log('Next steps:');
    console.log('   - Verify data in Supabase Dashboard → Table Editor');
    console.log('   - Run: pnpm dev (to start the application)');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Seed process failed:');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      if (error.stack) {
        console.error('');
        console.error('Stack trace:');
        console.error(error.stack);
      }
    } else {
      console.error('   Unknown error occurred');
      console.error(error);
    }
    console.error('');
    throw error;
  }
}

// Execute main function and handle exit
main()
  .then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
