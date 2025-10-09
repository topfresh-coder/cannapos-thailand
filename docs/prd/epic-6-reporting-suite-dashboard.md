# Epic 6: Reporting Suite & Dashboard

**Goal**: Provide comprehensive reporting capabilities covering all 10 MVP reports with drill-down functionality, multi-location dashboard, and export capabilities to deliver operational visibility and data-driven decision making.

## Story 6.1: Report Navigation & Central Hub

As a **store manager**,
I want **a centralized reports hub showing all available reports**,
so that **I can quickly access the insights I need**.

### Acceptance Criteria

1. Reports screen displays all 10 MVP reports as cards/tiles with: report name, description, icon, "View Report" button
2. Reports organized by category: Sales (4), Inventory (3), Operations (3)
3. Search/filter reports by name or category
4. Recently viewed reports section at top
5. Favorite reports functionality (star icon to bookmark frequently used reports)
6. Each report card shows last generated timestamp
7. Quick filters displayed: date range picker, location selector (for multi-location view)
8. Navigation breadcrumb: Dashboard → Reports → {Report Name}

## Story 6.2: Sales by Product Category Report

As a **store manager**,
I want **to view sales breakdown by product category**,
so that **I can understand which product types drive revenue**.

### Acceptance Criteria

1. Report displays for selected date range:
   - Table: category, total_revenue, total_units_sold, avg_transaction_value, revenue_%
   - Pie chart: revenue distribution by category
   - Bar chart: units sold by category
2. Default date range: last 30 days
3. Sortable by all numeric columns
4. Click category row to drill down to products within that category
5. Export to CSV functionality
6. Summary row showing totals across all categories
7. Data queried from transaction_items joined with products
8. Report refreshes on date range or location change

## Story 6.3: Daily Sales Summary Report

As a **store manager**,
I want **to view daily sales totals and transaction counts**,
so that **I can track daily performance trends**.

### Acceptance Criteria

1. Report displays for selected date range (default: last 30 days):
   - Table: date, total_revenue, transaction_count, avg_transaction_value, total_units_sold
   - Line chart: revenue over time
   - Line chart: transaction count over time
2. Table sortable by date (newest first by default)
3. Click date row to drill down to transactions for that day
4. Summary statistics: Total Revenue, Average Daily Revenue, Total Transactions, Best Day, Worst Day
5. Export to CSV
6. Day-of-week analysis: Average revenue by weekday (bar chart)
7. Comparison to previous period (e.g., last 30 days vs prior 30 days) showing % change

## Story 6.4: Sales by Shift Report

As a **store manager**,
I want **to compare AM vs PM shift performance**,
so that **I can optimize staffing and identify high-performing shifts**.

### Acceptance Criteria

1. Report displays for selected date range:
   - Table: date, shift_name (AM/PM), total_revenue, transaction_count, avg_transaction_value, variance_amount, cashier_name
   - Bar chart: revenue by shift type (AM vs PM aggregate)
   - Stacked bar chart: daily revenue split by shift
2. Variance column shows shift reconciliation variance (if applicable)
3. Click shift row to drill down to transactions for that shift
4. Summary: Total AM Revenue, Total PM Revenue, AM/PM Revenue Ratio
5. Average variance by shift type
6. Filter by shift type, cashier
7. Export to CSV
8. High variance shifts highlighted for review

## Story 6.5: Top Products Report

As a **store manager**,
I want **to identify best-selling products**,
so that **I can optimize inventory and marketing focus**.

### Acceptance Criteria

1. Report displays for selected date range (default: last 30 days):
   - Table: rank, product_name, SKU, category, total_units_sold, total_revenue, avg_price, times_sold (transaction count)
   - Top 20 products by revenue (configurable: top 10/20/50)
   - Bar chart: top 10 products by revenue
2. Toggle between ranking by: revenue, units sold, transaction frequency
3. Click product to drill down to transaction details for that product
4. Filter by category
5. Export to CSV
6. "Rising Stars" section: Products with highest growth vs previous period
7. Low performers section: Products with <5 sales in period (potential discontinuation candidates)

## Story 6.6: Inventory Valuation Report

As a **store manager**,
I want **to view total inventory value and cost basis**,
so that **I can understand capital tied up in inventory**.

### Acceptance Criteria

1. Report displays current inventory snapshot:
   - Table: product_name, category, total_qty_on_hand, avg_cost_per_unit, total_value (qty × cost)
   - Summary: Total Inventory Value, Total Units, Avg Cost per Product
   - Pie chart: inventory value distribution by category
2. Batch-level detail drilldown: Click product to see all batches with quantities and costs
3. FIFO cost basis used for valuation (weighted average of active batches)
4. Filter by category, stock status (All, In Stock, Low Stock)
5. Export to CSV
6. Historical trend: Inventory value over time (last 12 weeks, line chart)
7. Turnover indicator: Products with oldest batches (>90 days) highlighted

## Story 6.7: Low Stock Alert Report

As a **store manager**,
I want **a consolidated view of all low-stock and out-of-stock products**,
so that **I can prioritize reordering**.

### Acceptance Criteria

1. Report displays:
   - Table: product_name, category, current_qty, reorder_threshold, qty_below_threshold, oldest_batch_age, last_sale_date
   - Out-of-stock products section (qty = 0)
   - Low stock products section (qty < reorder_threshold but > 0)
2. Sortable by: qty_below_threshold (most urgent first), category, last_sale_date
3. Color coding: Red for out-of-stock, Amber for low stock
4. "Reorder Suggested Quantity" column based on average daily sales rate
5. Click product to navigate to product detail/batch receiving
6. Export to CSV (formatted as reorder worksheet)
7. Filter by category
8. Email report functionality (send to manager/buyer)

## Story 6.8: Inventory Movement Report

As a **store manager**,
I want **to track all inventory movements (receipts, sales, adjustments)**,
so that **I can audit inventory changes and identify shrinkage sources**.

### Acceptance Criteria

1. Report displays for selected date range:
   - Table: date, product_name, movement_type (Received, Sale, Adjustment, Count Correction), quantity_change, batch_number, user, reference
   - Filter by: movement_type, product, user
   - Sortable by date (newest first by default)
2. Summary: Total Received, Total Sold, Total Adjustments (net), Net Change
3. Adjustments breakdown: Positive adjustments, Negative adjustments (shrinkage)
4. Drill down: Click movement to view source record (transaction, adjustment, stock count)
5. Export to CSV
6. Chart: Daily movements over time (stacked bar: received vs sold vs adjustments)
7. Shrinkage analysis: Total negative adjustments by reason (Damage, Theft, Count Correction)

## Story 6.9: Cashier Performance Report

As a **store manager**,
I want **to evaluate individual cashier performance metrics**,
so that **I can provide feedback and recognize top performers**.

### Acceptance Criteria

1. Report displays for selected date range:
   - Table: cashier_name, shifts_worked, total_revenue, transaction_count, avg_transaction_value, total_variance, avg_variance_per_shift
   - Sortable by all metrics
   - Bar chart: revenue by cashier
   - Bar chart: average transaction value by cashier (ATV metric from KPIs)
2. Variance tracking: Total shift variances per cashier (positive and negative)
3. Click cashier to drill down to shift history and transaction details
4. Filter by shift type (AM/PM)
5. Export to CSV
6. Top performer highlights (highest ATV, lowest variance %, most transactions)
7. Performance trends: Cashier improvement/decline over time

## Story 6.10: Multi-Location Dashboard

As a **store owner**,
I want **a consolidated dashboard comparing performance across all locations**,
so that **I can identify best practices and underperforming stores**.

### Acceptance Criteria

1. Dashboard displays for selected date range (default: last 30 days):
   - Table: location_name, total_revenue, transaction_count, avg_transaction_value, shift_variance_total, low_stock_items_count
   - Map view (if geo-coordinates available) with location markers sized by revenue
   - Bar chart: revenue by location
   - Comparison metrics: Location rank by revenue, Location rank by ATV
2. Click location to drill down to location-specific reports
3. Summary: Total Network Revenue, Total Locations, Best Performing Location, Average Location Revenue
4. Location health indicators: Green (on target), Amber (low performance), Red (critical issues)
5. Filter by date range
6. Export to CSV
7. YoY comparison (if historical data available): Revenue growth % by location
8. Cross-location insights: Shared top products, category trends

---
