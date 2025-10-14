/**
 * Seed Verification Script
 *
 * Verifies that the seed data was correctly inserted into the database.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase.js';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifySeedData() {
  console.log('🔍 Verifying seed data...\n');

  // Check locations
  const { data: locations, error: locError } = await supabase
    .from('locations')
    .select('*');

  if (locError) throw locError;
  console.log(`✅ Locations: ${locations.length} record(s)`);
  locations.forEach(loc => console.log(`   - ${loc.name}`));

  // Check products
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .order('sku');

  if (prodError) throw prodError;
  console.log(`\n✅ Products: ${products.length} record(s)`);

  const flowerProducts = products.filter(p => p.category === 'Flower' && p.requires_tare_weight);
  console.log(`   - Flower products with tare weight: ${flowerProducts.length}`);

  const categories = [...new Set(products.map(p => p.category))];
  console.log(`   - Categories: ${categories.join(', ')}`);

  // List products by category
  categories.forEach(cat => {
    const catProducts = products.filter(p => p.category === cat);
    console.log(`\n   ${cat} (${catProducts.length}):`);
    catProducts.forEach(p => {
      console.log(`      - ${p.sku}: ${p.name} (${p.base_price} ฿/${p.unit}${p.requires_tare_weight ? ', requires tare weight' : ''})`);
    });
  });

  // Check batches
  const { data: batches, error: batchError } = await supabase
    .from('product_batches')
    .select('batch_number, quantity_remaining, received_date, status')
    .order('received_date');

  if (batchError) throw batchError;
  console.log(`\n✅ Product Batches: ${batches.length} record(s)`);

  const activeBatches = batches.filter(b => b.status === 'Active');
  console.log(`   - Active batches: ${activeBatches.length}`);

  const uniqueDates = [...new Set(batches.map(b => b.received_date))];
  console.log(`   - Unique received dates (for FIFO): ${uniqueDates.join(', ')}`);

  // Calculate total inventory
  const totalInventory = batches.reduce((sum, b) => sum + Number(b.quantity_remaining), 0);
  console.log(`   - Total inventory: ${totalInventory} units`);

  console.log('\n✅ Seed data verification complete!');
}

verifySeedData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  });
