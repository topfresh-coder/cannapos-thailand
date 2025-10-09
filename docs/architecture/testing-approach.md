# Testing Approach

## Unit Test Boundaries

**What to Unit Test**:
- Business logic (tierPricing.ts, fifoAllocation.ts, shiftCalculations.ts)
- Utility functions (currency.ts, date.ts, validation.ts)
- Zustand store reducers (cart actions, state updates)
- Custom hooks (without Supabase calls - mock Supabase client)

**Example Unit Test** (utils/tierPricing.test.ts):

```typescript
import { describe, it, expect } from 'vitest';
import { calculateTierPricing, applyTierPricing } from './tierPricing';
import type { CartItem, PricingTier, Product } from '@/types';

describe('Tier Pricing Calculation', () => {
  const tiers: PricingTier[] = [
    { id: '1', tier_name: 'Tier 1', min_weight_grams: 0, max_weight_grams: 2.99, price_per_gram: 400 },
    { id: '2', tier_name: 'Tier 2', min_weight_grams: 3, max_weight_grams: 6.99, price_per_gram: 350 },
    { id: '3', tier_name: 'Tier 3', min_weight_grams: 7, max_weight_grams: null, price_per_gram: 300 }
  ];

  it('calculates Tier 1 for 2.5g total flower weight', () => {
    const items: CartItem[] = [
      { id: '1', product: { ...mockProduct, category: 'Flower' }, quantity: 2.5, unitPrice: 400, lineTotal: 1000 }
    ];

    const result = calculateTierPricing(items, tiers);

    expect(result.currentTier?.tier_name).toBe('Tier 1');
    expect(result.totalFlowerWeight).toBe(2.5);
    expect(result.nextTier?.tier_name).toBe('Tier 2');
    expect(result.weightNeeded).toBe(0.5); // Need 0.5g more to reach 3g
  });

  it('calculates Tier 2 when crossing threshold', () => {
    const items: CartItem[] = [
      { id: '1', product: { ...mockProduct, category: 'Flower' }, quantity: 1.5, unitPrice: 400, lineTotal: 600 },
      { id: '2', product: { ...mockProduct, category: 'Flower' }, quantity: 2.0, unitPrice: 400, lineTotal: 800 }
    ];

    const result = calculateTierPricing(items, tiers);

    expect(result.currentTier?.tier_name).toBe('Tier 2');
    expect(result.totalFlowerWeight).toBe(3.5);
  });

  it('ignores non-flower products in tier calculation', () => {
    const items: CartItem[] = [
      { id: '1', product: { ...mockProduct, category: 'Flower' }, quantity: 2, unitPrice: 400, lineTotal: 800 },
      { id: '2', product: { ...mockProduct, category: 'Pre-Roll' }, quantity: 5, unitPrice: 150, lineTotal: 750 }
    ];

    const result = calculateTierPricing(items, tiers);

    expect(result.totalFlowerWeight).toBe(2); // Only counts flower
    expect(result.currentTier?.tier_name).toBe('Tier 1');
  });

  it('applies tier pricing to flower products, base price to others', () => {
    const items: CartItem[] = [
      { id: '1', product: { ...mockProduct, category: 'Flower', base_price: 400 }, quantity: 3.5, unitPrice: 400, lineTotal: 1400 },
      { id: '2', product: { ...mockProduct, category: 'Pre-Roll', base_price: 150 }, quantity: 2, unitPrice: 150, lineTotal: 300 }
    ];

    const { currentTier } = calculateTierPricing(items, tiers); // Tier 2 @ ฿350/g
    const priced = applyTierPricing(items, currentTier);

    expect(priced[0].unitPrice).toBe(350); // Flower gets tier price
    expect(priced[0].lineTotal).toBe(3.5 * 350);
    expect(priced[1].unitPrice).toBe(150); // Pre-roll keeps base price
  });
});
```

---

## Integration Test Scenarios

**What to Integration Test**:
- Supabase client queries (against test database)
- Service layer functions (productService, transactionService)
- RLS policies (verify correct data isolation)
- Database triggers (auto-deplete batches, variance calculation)

**Example Integration Test** (services/transactions.service.test.ts):

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { transactionService } from './transactions.service';
import type { Database } from '@/types/supabase';

describe('Transaction Service Integration Tests', () => {
  let supabase: SupabaseClient<Database>;

  beforeAll(async () => {
    // Initialize test Supabase client
    supabase = createClient(
      process.env.VITE_SUPABASE_TEST_URL!,
      process.env.VITE_SUPABASE_TEST_ANON_KEY!
    );

    // Seed test data (users, products, batches, shift)
    await seedTestData(supabase);
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData(supabase);
  });

  it('creates transaction with FIFO batch allocation', async () => {
    // Create transaction with 5g flower product
    const transaction = await transactionService.createTransaction(
      {
        user_id: testUserId,
        location_id: testLocationId,
        shift_id: testShiftId,
        total_amount: 1750, // 5g @ ฿350/g (Tier 2)
        payment_method: 'Cash'
      },
      [
        {
          product_id: testFlowerProductId,
          quantity: 5,
          unit_price: 350,
          line_total: 1750,
          tier_id: tier2Id,
          batch_allocations: [] // Will be populated by service
        }
      ]
    );

    // Verify transaction created
    expect(transaction.id).toBeDefined();
    expect(transaction.total_amount).toBe(1750);

    // Verify transaction_items created with batch_allocations
    const { data: items } = await supabase
      .from('transaction_items')
      .select('*')
      .eq('transaction_id', transaction.id);

    expect(items).toHaveLength(1);
    expect(items![0].batch_allocations).toHaveLength(2); // Allocated from 2 batches
    expect(items![0].batch_allocations[0].batch_id).toBe(oldestBatchId); // FIFO: oldest first

    // Verify batch quantities updated
    const { data: oldestBatch } = await supabase
      .from('product_batches')
      .select('quantity_remaining')
      .eq('id', oldestBatchId)
      .single();

    expect(oldestBatch!.quantity_remaining).toBe(0); // Fully allocated
  });

  it('throws error if insufficient inventory', async () => {
    await expect(
      transactionService.createTransaction(
        { /* ... */ },
        [
          {
            product_id: testFlowerProductId,
            quantity: 100, // More than available
            unit_price: 350,
            line_total: 35000
          }
        ]
      )
    ).rejects.toThrow('Insufficient inventory');
  });
});
```

---

## Test Data Strategy

**Test Database**: Separate Supabase project for testing (or local PostgreSQL with Supabase CLI)

**Seed Data** (tests/fixtures/seed.ts):
```typescript
export async function seedTestData(supabase: SupabaseClient) {
  // 1. Create test location
  const { data: location } = await supabase
    .from('locations')
    .insert({ name: 'Test Location' })
    .select()
    .single();

  // 2. Create test users (cashier, manager, owner)
  const { data: cashier } = await supabase.auth.admin.createUser({
    email: 'cashier@test.com',
    password: 'test123',
    email_confirm: true
  });

  await supabase.from('users').insert({
    id: cashier.user!.id,
    email: 'cashier@test.com',
    name: 'Test Cashier',
    role: 'cashier',
    location_id: location!.id
  });

  // 3. Create test products
  const { data: product } = await supabase
    .from('products')
    .insert({
      sku: 'FLW001',
      name: 'Test Flower',
      category: 'Flower',
      unit: 'gram',
      base_price: 400,
      requires_tare_weight: true,
      location_id: location!.id
    })
    .select()
    .single();

  // 4. Create test batches (FIFO testing)
  await supabase.from('product_batches').insert([
    {
      product_id: product!.id,
      batch_number: 'FLW001-20250101-001',
      quantity_received: 10,
      quantity_remaining: 3, // Oldest, partial stock
      cost_per_unit: 200,
      received_date: '2025-01-01',
      status: 'Active'
    },
    {
      product_id: product!.id,
      batch_number: 'FLW001-20250105-002',
      quantity_received: 20,
      quantity_remaining: 20, // Newer, full stock
      cost_per_unit: 220,
      received_date: '2025-01-05',
      status: 'Active'
    }
  ]);

  // 5. Create test pricing tiers
  await supabase.from('pricing_tiers').insert([
    { tier_name: 'Tier 1', min_weight_grams: 0, max_weight_grams: 2.99, price_per_gram: 400 },
    { tier_name: 'Tier 2', min_weight_grams: 3, max_weight_grams: 6.99, price_per_gram: 350 }
  ]);

  // 6. Create test shift
  const { data: shiftDef } = await supabase
    .from('shift_definitions')
    .insert({
      location_id: location!.id,
      shift_name: 'AM',
      start_time: '12:00:00',
      end_time: '18:00:00'
    })
    .select()
    .single();

  await supabase.from('shifts').insert({
    shift_definition_id: shiftDef!.id,
    location_id: location!.id,
    opened_by_user_id: cashier.user!.id,
    starting_cash_float: 2000,
    status: 'Open'
  });
}
```

---
