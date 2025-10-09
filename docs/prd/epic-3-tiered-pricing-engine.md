# Epic 3: Tiered Pricing Engine

**Goal**: Implement automated tiered pricing calculation that aggregates total flower weight in the cart and applies the appropriate price tier, eliminating manual pricing errors and reducing transaction time.

## Story 3.1: Tiered Pricing Configuration

As a **store manager**,
I want **to configure pricing tiers for flower products**,
so that **customers automatically receive volume discounts based on total flower weight**.

### Acceptance Criteria

1. Pricing tiers configuration screen created under Settings/Admin section
2. Tiers table displays existing tiers with columns: tier_name, min_weight_grams, max_weight_grams, price_per_gram
3. Default tiers pre-seeded:
   - Tier 1: 0-2.99g @ ฿400/g
   - Tier 2: 3-6.99g @ ฿350/g
   - Tier 3: 7-13.99g @ ฿300/g
   - Tier 4: 14-27.99g @ ฿250/g
   - Tier 5: 28g+ @ ฿200/g
4. "Add Tier" and "Edit Tier" functionality with validation: min_weight < max_weight, no overlapping ranges, price_per_gram > 0
5. Tiers stored in `pricing_tiers` table in Supabase
6. Delete tier functionality with confirmation (only if no active transactions using that tier)
7. Tiers apply globally across all locations for MVP

## Story 3.2: Real-Time Tiered Price Calculation in Cart

As a **cashier**,
I want **the cart to automatically calculate and apply tiered pricing based on total flower weight**,
so that **customers receive accurate pricing without manual calculation**.

### Acceptance Criteria

1. Cart calculates total flower weight by summing quantities of all flower products (category = "Flower")
2. Current tier determined based on total flower weight matching against pricing_tiers table
3. Tier indicator displayed in cart showing: "Current Tier: {tier_name} ({min_weight}g - {max_weight}g @ ฿{price_per_gram}/g)"
4. All flower items in cart re-priced using current tier's price_per_gram
5. Price updates happen in real-time as items added/removed or quantities changed
6. Non-flower products (Pre-Roll, Edible, etc.) use their base_price, unaffected by tier pricing
7. Cart displays: "Total Flower Weight: {total_weight}g" prominently
8. Line totals for flower items recalculated: line_total = quantity * tier_price_per_gram

## Story 3.3: Tier Progression Indicator

As a **cashier**,
I want **to see how much more flower weight is needed to reach the next tier**,
so that **I can inform customers of potential savings**.

### Acceptance Criteria

1. Cart displays "Next Tier" information when customer is not at highest tier
2. Message format: "Add {weight_needed}g more to reach {next_tier_name} and save ฿{savings_per_gram}/g"
3. Savings calculation shows difference between current and next tier prices
4. Estimated total savings displayed: "Estimated savings: ฿{total_savings_amount}"
5. When highest tier reached, display: "Maximum discount tier applied!"
6. Tier progression bar/visual indicator showing proximity to next tier
7. Updates in real-time as cart changes

## Story 3.4: Mixed Cart Pricing Logic

As a **cashier**,
I want **to handle carts containing both flower and non-flower products correctly**,
so that **pricing is accurate for all product types**.

### Acceptance Criteria

1. Tiered pricing ONLY applies to products with category = "Flower"
2. Non-flower products (Pre-Roll, Edible, Concentrate, Other) always use base_price from products table
3. Cart subtotal correctly sums: (flower items at tier price) + (non-flower items at base price)
4. Tier calculation ignores non-flower product quantities
5. Cart displays breakdown: "Flower Subtotal: ฿{flower_total}" and "Other Products Subtotal: ฿{other_total}"
6. Receipt shows tier applied for flower items: "{product_name} - {quantity}g @ ฿{tier_price}/g (Tier {tier_name})"
7. Transaction record stores tier_id used for each flower item in transaction_items

## Story 3.5: Tier Price Override (Manager Authorization)

As a **store manager**,
I want **the ability to override tier pricing for special cases**,
so that **I can handle promotions, loyalty discounts, or price matching**.

### Acceptance Criteria

1. "Override Price" button available on each cart line item (requires manager role)
2. Override modal prompts for: new_price_per_gram (for flower) or new_line_total (for non-flower), override_reason (required text field)
3. Overridden items display with indicator: "Price Overridden" badge
4. Original tier price and overridden price both stored in transaction_items for audit
5. Override reason saved to transaction_items.override_reason field
6. Cart recalculates subtotal with overridden prices
7. Receipt shows: "{product_name} - {quantity}g @ ฿{override_price}/g (Manager Override)"
8. Non-manager users see disabled override button with tooltip: "Manager authorization required"

## Story 3.6: Tier History & Analytics (Basic)

As a **store manager**,
I want **to see transaction distribution across pricing tiers**,
so that **I can understand customer purchasing patterns and optimize tier structure**.

### Acceptance Criteria

1. Simple tier analytics screen showing for selected date range:
   - Count of transactions per tier
   - Total revenue per tier
   - Average transaction value per tier
   - Total flower weight sold per tier
2. Date range picker (defaults to last 30 days)
3. Data queried from transaction_items joined with pricing_tiers
4. Table and basic bar chart visualization (using recharts or similar)
5. Export to CSV functionality
6. Filter by location (if multi-location data exists)

## Story 3.7: Tier Pricing Business Rules Engine

As a **system**,
I want **to enforce tiered pricing business rules consistently**,
so that **pricing integrity is maintained across all scenarios**.

### Acceptance Criteria

1. Business rule: Tier pricing ONLY applies during normal transaction flow, not retroactively
2. Business rule: Changing tier configuration does not affect historical transactions
3. Business rule: If no tier matches (edge case), system defaults to highest base_price from flower products with error logged
4. Business rule: Tier calculation executes on client-side for real-time UX, validated server-side during transaction commit
5. Business rule: Partial gram weights (e.g., 3.5g) supported and included in tier total
6. Database trigger prevents pricing_tiers deletion if referenced by transaction_items
7. Unit tests cover all tier calculation edge cases (boundary values, no tiers, overlapping tiers)

## Story 3.8: Tier Pricing for Tare Weight Transactions

As a **cashier**,
I want **tare weight transactions to correctly participate in tier pricing**,
so that **flower products weighed with containers receive tiered discounts**.

### Acceptance Criteria

1. When flower product added via tare weight modal, net_weight (gross - tare) becomes quantity for tier calculation
2. Net weight included in "Total Flower Weight" for tier determination
3. Tier price applied to net_weight for line total calculation
4. Cart displays: "{product_name} - {net_weight}g @ ฿{tier_price}/g (Tier {tier_name})"
5. Tare weight details (gross, tare, net) preserved in transaction_items for audit
6. Multiple tare weight items aggregate correctly for tier total
7. Tier progression indicator updates correctly when tare weight items added

## Story 3.9: Tier Pricing Validation & Error Handling

As a **developer**,
I want **robust error handling for tier pricing edge cases**,
so that **the system degrades gracefully and never blocks transactions**.

### Acceptance Criteria

1. If pricing_tiers table empty or unreachable, system falls back to base_price with warning logged
2. If multiple overlapping tiers found (data integrity issue), system uses lowest price tier and logs error
3. If tier calculation fails, error message displayed to cashier with option to proceed at base_price
4. Network errors during tier fetch display: "Pricing temporarily unavailable, using base prices"
5. Tier calculation timeout (>2 seconds) falls back to base_price
6. All tier-related errors logged to Supabase error_logs table with: timestamp, user_id, cart_state, error_message
7. Unit tests validate all error scenarios

## Story 3.10: Tier Pricing Documentation & Training Materials

As a **store owner**,
I want **documentation explaining how tier pricing works**,
so that **staff can explain the system to customers and answer questions**.

### Acceptance Criteria

1. In-app help section created under Settings → Help → Tier Pricing
2. Documentation includes:
   - Explanation of how tiers work (total flower weight aggregation)
   - Current tier structure table
   - Examples of tier calculations with sample carts
   - FAQ section (e.g., "Do pre-rolls count toward tiers?", "Can I mix flower strains?")
3. Printable PDF version of tier pricing guide
4. Quick reference card (1-page) for cashiers showing tier breakpoints
5. Screenshots/diagrams showing cart tier indicator and progression display
6. Documentation accessible via "?" icon next to tier indicator in cart

---
