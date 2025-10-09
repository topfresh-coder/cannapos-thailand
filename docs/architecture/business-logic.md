# Business Logic

## Tier Pricing Calculation Algorithm

**Purpose**: Calculate current tier and apply tier pricing to all flower products in cart in real-time (<100ms).

**Implementation** (utils/tierPricing.ts):

```typescript
import type { CartItem, PricingTier, Product } from '@/types';

export interface TierCalculationResult {
  currentTier: PricingTier | null;
  nextTier: PricingTier | null;
  totalFlowerWeight: number;
  weightNeeded: number;
  estimatedSavings: number;
}

export function calculateTierPricing(
  items: CartItem[],
  tiers: PricingTier[]
): TierCalculationResult {
  // 1. Calculate total flower weight
  const totalFlowerWeight = items
    .filter(item => item.product.category === 'Flower')
    .reduce((sum, item) => sum + item.quantity, 0);

  // 2. Sort tiers by min_weight ascending
  const sortedTiers = [...tiers].sort((a, b) => a.min_weight_grams - b.min_weight_grams);

  // 3. Find current tier
  const currentTier = sortedTiers.find(tier => {
    return totalFlowerWeight >= tier.min_weight_grams &&
           (tier.max_weight_grams === null || totalFlowerWeight <= tier.max_weight_grams);
  }) || null;

  // 4. Find next tier (if not at highest)
  const currentIndex = sortedTiers.findIndex(t => t.id === currentTier?.id);
  const nextTier = currentIndex >= 0 && currentIndex < sortedTiers.length - 1
    ? sortedTiers[currentIndex + 1]
    : null;

  // 5. Calculate weight needed to reach next tier
  const weightNeeded = nextTier
    ? nextTier.min_weight_grams - totalFlowerWeight
    : 0;

  // 6. Calculate estimated savings
  const estimatedSavings = currentTier && nextTier
    ? (currentTier.price_per_gram - nextTier.price_per_gram) * totalFlowerWeight
    : 0;

  return {
    currentTier,
    nextTier,
    totalFlowerWeight,
    weightNeeded,
    estimatedSavings
  };
}

export function applyTierPricing(
  items: CartItem[],
  currentTier: PricingTier | null
): CartItem[] {
  return items.map(item => {
    if (item.product.category === 'Flower' && currentTier) {
      // Apply tier price to flower products
      return {
        ...item,
        unitPrice: currentTier.price_per_gram,
        lineTotal: item.quantity * currentTier.price_per_gram,
        tierId: currentTier.id
      };
    }
    // Non-flower products use base_price
    return {
      ...item,
      unitPrice: item.product.base_price,
      lineTotal: item.quantity * item.product.base_price,
      tierId: null
    };
  });
}
```

**Usage in Cart Store** (stores/cartStore.ts):

```typescript
import { create } from 'zustand';
import { calculateTierPricing, applyTierPricing } from '@/utils/tierPricing';
import type { CartItem, Product, PricingTier, TareData } from '@/types';

interface CartState {
  items: CartItem[];
  tiers: PricingTier[];
  addItem: (product: Product, quantity: number, tareData?: TareData) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setTiers: (tiers: PricingTier[]) => void;
  clear: () => void;
  // Computed getters
  getTierCalculation: () => ReturnType<typeof calculateTierPricing>;
  getItemsWithTierPricing: () => CartItem[];
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  tiers: [],

  addItem: (product, quantity, tareData) => {
    set(state => {
      const existingItem = state.items.find(i => i.product.id === product.id);

      if (existingItem) {
        // Update quantity if already in cart
        const updatedItems = state.items.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
        return { items: updatedItems };
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          unitPrice: product.base_price,
          lineTotal: quantity * product.base_price,
          tierId: null,
          tareData
        };
        return { items: [...state.items, newItem] };
      }
    });
  },

  removeItem: (productId) => {
    set(state => ({
      items: state.items.filter(i => i.product.id !== productId)
    }));
  },

  updateQuantity: (productId, quantity) => {
    set(state => ({
      items: state.items.map(i =>
        i.product.id === productId
          ? { ...i, quantity }
          : i
      )
    }));
  },

  setTiers: (tiers) => set({ tiers }),

  clear: () => set({ items: [] }),

  // Computed getters
  getTierCalculation: () => {
    const { items, tiers } = get();
    return calculateTierPricing(items, tiers);
  },

  getItemsWithTierPricing: () => {
    const { items, tiers } = get();
    const { currentTier } = calculateTierPricing(items, tiers);
    return applyTierPricing(items, currentTier);
  },

  getSubtotal: () => {
    const items = get().getItemsWithTierPricing();
    return items.reduce((sum, item) => sum + item.lineTotal, 0);
  }
}));
```

---

## FIFO Allocation Implementation

**Purpose**: Allocate inventory from oldest batches first when transaction is completed.

**Implementation** (utils/fifoAllocation.ts):

```typescript
import type { ProductBatch, BatchAllocation } from '@/types';

export interface AllocationResult {
  allocations: BatchAllocation[];
  totalAllocated: number;
  totalCost: number;
}

export async function allocateFIFO(
  productId: string,
  quantityNeeded: number,
  batches: ProductBatch[]
): Promise<AllocationResult> {
  // 1. Filter active batches, exclude expired
  const today = new Date().toISOString().split('T')[0];
  const activeBatches = batches.filter(b =>
    b.status === 'Active' &&
    b.quantity_remaining > 0 &&
    (!b.expiration_date || b.expiration_date >= today)
  );

  // 2. Sort by received_date ASC (oldest first)
  const sortedBatches = activeBatches.sort((a, b) =>
    new Date(a.received_date).getTime() - new Date(b.received_date).getTime()
  );

  // 3. Allocate quantity across batches
  const allocations: BatchAllocation[] = [];
  let remaining = quantityNeeded;
  let totalCost = 0;

  for (const batch of sortedBatches) {
    if (remaining <= 0) break;

    const allocatedQty = Math.min(remaining, batch.quantity_remaining);

    allocations.push({
      batch_id: batch.id,
      quantity_allocated: allocatedQty,
      cost_per_unit: batch.cost_per_unit
    });

    totalCost += allocatedQty * batch.cost_per_unit;
    remaining -= allocatedQty;
  }

  // 4. Check if fully allocated
  if (remaining > 0) {
    throw new Error(
      `Insufficient inventory for product ${productId}. ` +
      `Needed ${quantityNeeded}, available ${quantityNeeded - remaining}`
    );
  }

  return {
    allocations,
    totalAllocated: quantityNeeded,
    totalCost
  };
}

export async function updateBatchQuantities(
  supabase: SupabaseClient,
  allocations: BatchAllocation[]
): Promise<void> {
  for (const allocation of allocations) {
    // Fetch current batch to get quantity_remaining
    const { data: batch, error: fetchError } = await supabase
      .from('product_batches')
      .select('quantity_remaining')
      .eq('id', allocation.batch_id)
      .single();

    if (fetchError) throw fetchError;

    // Update quantity_remaining
    const newQty = batch.quantity_remaining - allocation.quantity_allocated;

    const { error: updateError } = await supabase
      .from('product_batches')
      .update({ quantity_remaining: newQty })
      .eq('id', allocation.batch_id);

    if (updateError) throw updateError;
  }
}
```

---

## Shift Variance Calculation

**Purpose**: Calculate variance between expected and actual cash at shift close.

**Implementation** (utils/shiftCalculations.ts):

```typescript
import type { Shift, Transaction } from '@/types';

export interface ShiftVarianceResult {
  expectedCash: number;
  actualCash: number;
  variance: number;
  variancePercent: number;
  severity: 'low' | 'medium' | 'high';
}

export function calculateShiftVariance(
  shift: Shift,
  transactions: Transaction[]
): ShiftVarianceResult {
  // 1. Calculate total revenue for shift
  const totalRevenue = transactions
    .filter(t => t.shift_id === shift.id)
    .reduce((sum, t) => sum + t.total_amount, 0);

  // 2. Calculate expected cash
  const expectedCash = shift.starting_cash_float + totalRevenue;

  // 3. Get actual cash count
  const actualCash = shift.actual_cash_count || 0;

  // 4. Calculate variance
  const variance = actualCash - expectedCash;

  // 5. Calculate variance percentage
  const variancePercent = expectedCash > 0
    ? Math.abs((variance / expectedCash) * 100)
    : 0;

  // 6. Determine severity
  let severity: 'low' | 'medium' | 'high';
  const absVariance = Math.abs(variance);
  if (absVariance <= 10) {
    severity = 'low'; // Green: ±฿0-10
  } else if (absVariance <= 50) {
    severity = 'medium'; // Amber: ±฿11-50
  } else {
    severity = 'high'; // Red: >฿50
  }

  return {
    expectedCash,
    actualCash,
    variance,
    variancePercent,
    severity
  };
}

export function getVarianceColor(severity: 'low' | 'medium' | 'high'): string {
  switch (severity) {
    case 'low':
      return 'text-green-600 bg-green-100'; // Green
    case 'medium':
      return 'text-amber-600 bg-amber-100'; // Amber
    case 'high':
      return 'text-red-600 bg-red-100'; // Red
  }
}

export function requiresVarianceReason(variance: number): boolean {
  return Math.abs(variance) > 50; // >฿50 requires mandatory reason
}
```

---
