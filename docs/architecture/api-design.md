# API Design

**API Style**: Supabase Auto-Generated REST + PostgreSQL Functions

**Rationale**: Supabase auto-generates RESTful endpoints from database schema, eliminating need for custom API layer. For complex operations (FIFO allocation, tier calculation), use PostgreSQL functions or client-side logic.

**Supabase Client Patterns**:

```typescript
// Initialize Supabase client (services/supabase.ts)
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Example: Product service (services/products.service.ts)
export const productService = {
  // Get all active products for current location
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  },

  // Get product with batches
  async getProductWithBatches(productId: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_batches (
          id,
          batch_number,
          quantity_remaining,
          received_date,
          cost_per_unit,
          status
        )
      `)
      .eq('id', productId)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new product
  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Example: Transaction service (services/transactions.service.ts)
export const transactionService = {
  // Create transaction with items and FIFO allocation
  async createTransaction(
    transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>,
    items: Omit<TransactionItem, 'id' | 'transaction_id' | 'created_at'>[]
  ) {
    // 1. Create transaction
    const { data: txn, error: txnError } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (txnError) throw txnError;

    // 2. For each item, allocate FIFO batches and create transaction_item
    for (const item of items) {
      // Get active batches for product, oldest first (FIFO)
      const { data: batches, error: batchError } = await supabase
        .from('product_batches')
        .select('*')
        .eq('product_id', item.product_id)
        .eq('status', 'Active')
        .order('received_date', { ascending: true });

      if (batchError) throw batchError;

      // Allocate quantity across batches
      const allocations: BatchAllocation[] = [];
      let remainingQty = item.quantity;

      for (const batch of batches) {
        if (remainingQty <= 0) break;

        const allocatedQty = Math.min(remainingQty, batch.quantity_remaining);
        allocations.push({
          batch_id: batch.id,
          quantity_allocated: allocatedQty,
          cost_per_unit: batch.cost_per_unit
        });

        // Update batch quantity
        const newQty = batch.quantity_remaining - allocatedQty;
        await supabase
          .from('product_batches')
          .update({ quantity_remaining: newQty })
          .eq('id', batch.id);

        remainingQty -= allocatedQty;
      }

      if (remainingQty > 0) {
        throw new Error(`Insufficient inventory for ${item.product_id}. Needed ${item.quantity}, allocated ${item.quantity - remainingQty}`);
      }

      // 3. Insert transaction_item with batch_allocations
      const { error: itemError } = await supabase
        .from('transaction_items')
        .insert({
          ...item,
          transaction_id: txn.id,
          batch_allocations: allocations
        });

      if (itemError) throw itemError;
    }

    return txn;
  }
};
```

**Real-Time Subscriptions**:

```typescript
// Hook for real-time cart updates (hooks/useRealtime.ts)
export function useRealtimeShiftSummary(shiftId: string) {
  const [summary, setSummary] = useState<ShiftSummary | null>(null);

  useEffect(() => {
    // Subscribe to transaction inserts for this shift
    const subscription = supabase
      .channel(`shift-${shiftId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `shift_id=eq.${shiftId}`
        },
        () => {
          // Refresh shift summary when new transaction created
          refreshSummary();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [shiftId]);

  async function refreshSummary() {
    // Fetch updated shift data + transaction totals
    const { data, error } = await supabase
      .from('shifts')
      .select(`
        *,
        transactions (
          total_amount
        )
      `)
      .eq('id', shiftId)
      .single();

    if (!error && data) {
      const totalRevenue = data.transactions.reduce((sum, t) => sum + t.total_amount, 0);
      setSummary({
        ...data,
        totalRevenue,
        expectedCash: data.starting_cash_float + totalRevenue
      });
    }
  }

  return { summary, refreshSummary };
}
```

**Server-Side Validation** (PostgreSQL Functions):

For complex business logic that must be server-validated (e.g., FIFO allocation), use PostgreSQL functions:

```sql
-- Example: Server-side FIFO allocation function
CREATE OR REPLACE FUNCTION allocate_fifo(
  p_product_id UUID,
  p_quantity DECIMAL
)
RETURNS JSONB AS $$
DECLARE
  v_batch RECORD;
  v_allocations JSONB := '[]'::jsonb;
  v_remaining DECIMAL := p_quantity;
  v_allocated DECIMAL;
BEGIN
  -- Get active batches ordered by FIFO (oldest first)
  FOR v_batch IN
    SELECT id, quantity_remaining, cost_per_unit
    FROM product_batches
    WHERE product_id = p_product_id
      AND status = 'Active'
      AND (expiration_date IS NULL OR expiration_date >= CURRENT_DATE)
    ORDER BY received_date ASC
  LOOP
    IF v_remaining <= 0 THEN
      EXIT;
    END IF;

    v_allocated := LEAST(v_remaining, v_batch.quantity_remaining);

    -- Update batch quantity
    UPDATE product_batches
    SET quantity_remaining = quantity_remaining - v_allocated
    WHERE id = v_batch.id;

    -- Add to allocations
    v_allocations := v_allocations || jsonb_build_object(
      'batch_id', v_batch.id,
      'quantity_allocated', v_allocated,
      'cost_per_unit', v_batch.cost_per_unit
    );

    v_remaining := v_remaining - v_allocated;
  END LOOP;

  IF v_remaining > 0 THEN
    RAISE EXCEPTION 'Insufficient inventory. Needed %, allocated %', p_quantity, p_quantity - v_remaining;
  END IF;

  RETURN v_allocations;
END;
$$ LANGUAGE plpgsql;

-- Call from client:
-- const { data, error } = await supabase.rpc('allocate_fifo', {
--   p_product_id: productId,
--   p_quantity: quantity
-- });
```

---
