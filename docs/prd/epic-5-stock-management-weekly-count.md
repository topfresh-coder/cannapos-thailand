# Epic 5: Stock Management & Weekly Count

**Goal**: Complete inventory management system with FIFO allocation enforcement, batch depletion tracking, and weekly stock count workflows to ensure inventory accuracy and prevent shrinkage.

## Story 5.1: Inventory Dashboard Overview

As a **store manager**,
I want **a centralized inventory dashboard showing current stock levels**,
so that **I can quickly assess inventory health across all products**.

### Acceptance Criteria

1. Inventory dashboard displays summary cards: Total SKUs, Total Units in Stock, Low Stock Items Count, Depleted Batches Count
2. Product inventory table showing: product_name, category, total_available_quantity, oldest_batch_age (days), low_stock_indicator
3. Filters: category, stock status (All, In Stock, Low Stock, Out of Stock)
4. Search by product name or SKU
5. Sortable by: product name, available quantity, oldest batch age
6. Click product row to navigate to product detail with batch history
7. Dashboard refreshes data every 30 seconds or via manual refresh button
8. Low stock items highlighted in amber, out of stock in red

## Story 5.2: Batch Movement History Tracking

As a **store manager**,
I want **to view complete movement history for each batch**,
so that **I can audit inventory changes and investigate discrepancies**.

### Acceptance Criteria

1. Batch detail view shows movement history table with columns: date_time, movement_type (Received, Sale, Adjustment, Count Correction), quantity_change, quantity_after, user, reference (transaction_id or adjustment_id)
2. Movement types color-coded: Green for positive changes, Red for negative
3. Each movement links to source record (transaction, adjustment, stock count)
4. Movement history sortable by date (newest first by default)
5. Filter by movement_type and date range
6. Export batch history to CSV
7. Movement records immutable (audit trail integrity)

## Story 5.3: Automated Batch Depletion Status

As a **system**,
I want **to automatically mark batches as depleted when quantity reaches zero**,
so that **FIFO allocation only considers active batches**.

### Acceptance Criteria

1. After each transaction, system checks if any allocated batches reached quantity_remaining = 0
2. Depleted batches automatically updated: status = "Depleted", depleted_at timestamp set
3. Depleted batches excluded from FIFO allocation queries
4. Product detail page shows depleted batches in separate section (collapsed by default)
5. Inventory dashboard excludes depleted batches from total quantity calculations
6. Batch can be "reactivated" if inventory adjustment adds quantity back (status → "Active")
7. Database index on status field for query performance

## Story 5.4: Weekly Stock Count Workflow - Initialization

As a **store manager**,
I want **to initiate a weekly stock count**,
so that **physical inventory can be compared against system records**.

### Acceptance Criteria

1. "Start Stock Count" button on Inventory dashboard
2. Stock count initialization creates record in `stock_counts` table with: count_date, initiated_by_user_id, status: "In Progress", location_id
3. System snapshots current inventory quantities for all products at count start (baseline for variance detection)
4. Stock count screen displays all products with: product_name, SKU, expected_quantity (from system), actual_quantity (input field - empty)
5. Filter by category to focus count by section
6. Progress indicator shows: "{counted} of {total} products counted"
7. Count can be saved and resumed later (partial counts supported)
8. Only one stock count can be in progress per location at a time

## Story 5.5: Stock Count Entry - Product Counting

As a **store employee**,
I want **to enter physical counts for each product**,
so that **inventory accuracy can be verified**.

### Acceptance Criteria

1. Stock count screen shows products in list/grid view optimized for mobile tablet use
2. Each product row displays: product image (if available), name, SKU, expected_quantity, actual_quantity input field
3. Actual quantity input validates: non-negative number, decimal support for weight-based items
4. Products with counts entered marked with checkmark icon
5. Variance calculated in real-time: variance = actual_quantity - expected_quantity
6. High variance items (>10% or >10 units) highlighted in amber/red for review
7. "Skip" button to mark product for later counting
8. Count entries auto-saved every 30 seconds to prevent data loss
9. Search/filter to quickly locate specific products during count

## Story 5.6: Stock Count Review & Variance Analysis

As a **store manager**,
I want **to review all variances before finalizing the stock count**,
so that **I can investigate significant discrepancies**.

### Acceptance Criteria

1. "Review Count" button appears when all products counted (or all non-skipped products)
2. Review screen shows variance summary: Total Products Counted, Products with Variance, Total Positive Variance, Total Negative Variance
3. Variance detail table showing only products with variance ≠ 0: product_name, expected_qty, actual_qty, variance, variance_%
4. High variance items (>10% or >10 units) flagged for attention
5. "Recount" button next to each variance item to re-enter actual_quantity
6. "Add Note" button to document variance reasons (e.g., "damaged units removed")
7. "Finalize Count" button (requires manager role)
8. Export variance report to CSV

## Story 5.7: Stock Count Finalization & Inventory Adjustment

As a **store manager**,
I want **to finalize the stock count and apply corrections to inventory**,
so that **system records match physical reality**.

### Acceptance Criteria

1. "Finalize Count" creates inventory adjustments for all variances
2. For each variance, system creates record in `inventory_adjustments` table with: product_id, batch_id (most recent batch), adjustment_quantity (= variance), reason: "Stock Count Correction", stock_count_id, user_id
3. Batch quantities updated: quantity_remaining += variance
4. Stock count record updated: status = "Finalized", finalized_by_user_id, finalized_at timestamp
5. Finalized stock counts locked and cannot be edited
6. Summary report generated showing: total adjustments, net inventory change, high variance items
7. Manager receives confirmation: "Stock count finalized. {positive_count} items increased, {negative_count} items decreased."
8. All adjustments logged with stock_count reference for audit trail

## Story 5.8: Stock Count History & Reporting

As a **store manager**,
I want **to view historical stock counts and trends**,
so that **I can identify patterns in inventory accuracy**.

### Acceptance Criteria

1. Stock count history screen lists all completed counts: count_date, initiated_by, finalized_by, total_variances, net_variance_value, status
2. Click count to view detailed variance report
3. Filter by date range and status (In Progress, Finalized, Cancelled)
4. Trend chart showing variance % over time (last 12 weeks)
5. Top variance products report (products with most frequent or largest variances)
6. Export historical counts to CSV
7. Summary statistics: Average variance %, Total counts performed, Accuracy improvement trend

## Story 5.9: Scheduled Stock Count Reminders

As a **store manager**,
I want **automatic reminders to perform weekly stock counts**,
so that **inventory counts happen consistently**.

### Acceptance Criteria

1. System tracks last stock count date per location
2. If >7 days since last count, dashboard displays reminder banner: "Weekly stock count overdue. Last count: {date}"
3. Reminder notification sent to manager role every Monday if no count in past 7 days
4. Reminder dismissible but reappears daily until count initiated
5. Stock count schedule configurable per location (weekly by default, can change to bi-weekly)
6. Compliance metric tracked: "On-time Stock Count Rate" (% of weeks with count completed)

## Story 5.10: Cycle Count (Partial Stock Count)

As a **store manager**,
I want **to perform counts on specific product categories**,
so that **I can verify high-risk inventory without full count**.

### Acceptance Criteria

1. "Start Cycle Count" button allows selecting specific categories or products
2. Cycle count workflow identical to full stock count but limited to selected items
3. Cycle count record includes: count_type: "Cycle", category_filter or product_ids
4. Dashboard differentiates cycle counts from full counts in history
5. Cycle counts can run independently of weekly full count schedule
6. Multiple cycle counts can be in progress simultaneously (different categories)
7. Recommended cycle count frequency displayed per category based on shrinkage risk (e.g., "Count flower weekly, edibles monthly")

---
