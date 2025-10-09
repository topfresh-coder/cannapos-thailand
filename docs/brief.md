# Project Brief: CannaPOS Thailand

**Cannabis Dispensary Point of Sale & Inventory Management System**

---

## Executive Summary

**CannaPOS Thailand** is a specialized point-of-sale system designed specifically for licensed cannabis dispensaries operating in Thailand. The system addresses the unique operational challenges of cannabis retail including complex tiered pricing based on total flower weight per order, mandatory shift-to-shift reconciliation for fraud prevention, FIFO inventory tracking with batch-level cost management, and tare weight handling for flower products.

The primary problem being solved is the lack of industry-specific POS solutions that can handle the specialized requirements of cannabis retail in the Thai market - where inventory shrinkage, pricing complexity, and regulatory compliance create significant operational overhead that generic retail systems cannot adequately address.

**Target Market:** Licensed cannabis dispensaries in Thailand (estimated 200-500 locations currently, with rapid growth expected as the market matures). Primary users include dispensary owners, store managers, and cashiers operating in shift-based retail environments.

**Key Value Proposition:** CannaPOS eliminates revenue leakage through mandatory shift reconciliation, prevents pricing errors through automated tiered pricing calculations, ensures accurate profitability tracking via FIFO inventory management, and provides multi-location oversight through centralized dashboards - all while maintaining mobile/tablet-friendly interfaces suitable for space-constrained retail environments.

---

## Problem Statement

### Current State & Pain Points

Licensed cannabis dispensaries in Thailand face operational challenges that generic retail POS systems cannot adequately address:

**1. Revenue Leakage & Theft**

Without mandatory shift-to-shift reconciliation, dispensaries experience significant inventory shrinkage and cash discrepancies. The high-value, low-volume nature of cannabis products (particularly premium flowers at 300+ baht/gram) makes them prime targets for employee theft. Current manual counting processes are time-consuming, error-prone, and lack systematic variance tracking.

**2. Complex Pricing Errors**

Cannabis flower pricing follows tiered models where total order weight determines the per-gram price for all flowers in the transaction. Manual calculation leads to frequent errors—either overcharging customers (damaging reputation) or undercharging (losing margin). Example: A customer buying 1g Superboof + 2g Tropicana Cherry should trigger 3g pricing tier across both strains, but cashiers often apply incorrect tiers.

**3. Profitability Blindness**

Cannabis wholesale costs fluctuate significantly based on harvest cycles and market conditions. Without FIFO inventory tracking at the batch level, dispensaries cannot accurately calculate true profit margins on sales, leading to poor purchasing decisions and inability to identify unprofitable products.

**4. Inventory Management Complexity**

Flower products require tare weight deduction (container/bag weight) to determine actual product weight. Manual tracking of tare weights across multiple batches creates accounting errors and compliance risks. Generic POS systems lack this specialized functionality.

**5. Multi-Location Oversight Gaps**

Dispensary chains cannot effectively monitor performance, identify fraud patterns, or compare metrics across locations without consolidated dashboards designed for cannabis retail operations.

### Impact (Quantified)

- Estimated 3-8% revenue loss due to theft and untracked shrinkage (industry standard for high-value retail without proper controls)
- 15-20% of transactions contain pricing errors based on manual tiered calculation
- 2-4 hours per day per location spent on manual reconciliation and inventory counting
- Inability to calculate accurate profit margins delays strategic decisions by weeks

### Why Existing Solutions Fall Short

- **Generic Retail POS** (Square, Lightspeed, etc.): Lack tiered pricing logic, tare weight tracking, cannabis-specific compliance features, and shift-based reconciliation workflows
- **International Cannabis POS** (BioTrack, METRC-integrated systems): Designed for North American markets with different regulatory frameworks, excessive compliance overhead for Thailand's current requirements, and English-only interfaces that don't optimize for Thai market UX expectations
- **Custom Excel/Manual Systems**: Error-prone, no fraud detection, cannot scale across locations, lack real-time reporting

### Urgency & Importance

Thailand's cannabis market is in rapid growth phase post-decriminalization. Early-stage dispensaries establishing operational foundations now will capture market share as the industry professionalizes. Dispensaries implementing proper controls early gain significant competitive advantages through better margins, reduced shrinkage, and ability to scale to multiple locations. The window to establish best practices before competitors is narrowing.

---

## Proposed Solution

**CannaPOS Thailand** is a specialized point-of-sale and inventory management system purpose-built for cannabis dispensary operations in Thailand, combining automated fraud prevention, intelligent pricing, and batch-level profitability tracking in a mobile-first interface.

### Core Concept & Approach

The solution centers on three foundational pillars:

**1. Automated Shift Reconciliation System**

Mandatory shift-to-shift accountability that compares physical counts (cash and flower inventory with tare weight adjustments) against system records at every shift transition (AM open/close at 12:00/18:00, PM open/close at 18:00/24:00). The system automatically calculates variances, flags discrepancies, and maintains historical reconciliation reports accessible for retrospective audit—creating a transparent chain of custody that prevents theft and identifies operational issues in real-time.

**2. Intelligent Tiered Pricing Engine**

Automated calculation that aggregates total flower weight across all cannabis products in an order, determines the appropriate price tier, then applies tier-specific per-gram rates to each individual strain. This eliminates manual calculation errors while supporting flexible pricing strategies that encourage larger purchases. The system handles mixed orders (flowers + accessories) correctly, applying tiered pricing only to flower products.

**3. FIFO Inventory with Batch-Level Costing**

Each incoming inventory batch is tracked with purchase cost, tare weight, and batch identifiers, enabling automatic FIFO allocation during sales. This provides real-time profit margin visibility on every transaction and aggregate profitability analysis across products, time periods, and locations—supporting data-driven purchasing and merchandising decisions.

### Key Differentiators

- **Cannabis-Specific Operations**: Unlike generic retail POS, CannaPOS understands cannabis retail workflows including tare weight deduction, flower-specific weight-based tiered pricing, and gram-level inventory precision
- **Fraud Prevention First**: Shift reconciliation is not optional—it's a core workflow that staff must complete before conducting transactions, embedding accountability into daily operations
- **Mobile-First Design**: Optimized for tablets and mobile devices common in Thai dispensary environments, with touch-friendly interfaces suitable for space-constrained retail counters
- **Multi-Location Intelligence**: Consolidated dashboards allow ownership groups to compare performance across locations, identify fraud patterns through variance analysis, and standardize best practices across their portfolio
- **Thai Market Optimization**: English interface, Baht currency, gram measurements, CE dating conventions, and optional compliance fields that don't create unnecessary overhead in Thailand's current regulatory environment

### Why This Solution Will Succeed

Existing solutions fail because they either lack cannabis-specific functionality (generic POS) or over-engineer for different regulatory contexts (North American cannabis POS). CannaPOS hits the "Goldilocks zone"—sophisticated enough to handle Thailand's cannabis retail complexity, but streamlined for the actual regulatory and operational reality of the Thai market. By making fraud prevention mandatory rather than optional, the system creates operational discipline that owners want but staff often resist implementing with flexible systems.

### High-Level Product Vision

CannaPOS becomes the operational backbone for professional cannabis dispensaries in Thailand, evolving from a transaction system to a comprehensive retail intelligence platform that predicts inventory needs, identifies optimal pricing strategies, and provides benchmarking data that helps dispensaries compete more effectively as the market matures.

---

## Target Users

### Primary User Segment: Store Staff (Budtenders/Cashiers & Managers)

**Demographic Profile:**
- Age: 22-45 years old
- Roles: Budtenders, Cashiers, and Store Managers (all working shifts)
- Education: High school diploma to bachelor's degree
- Tech comfort: Moderate to high (comfortable with smartphones and tablets)
- Language: English proficient for work contexts
- Employment: Shift-based work on AM (12:00-18:00) or PM (18:00-24:00) shifts

**Current Behaviors & Workflows:**

*All staff roles perform the same core operational tasks:*

- Process 30-80 customer transactions per shift
- Manually calculate tiered pricing by summing flower weights, referencing price charts, and applying per-gram rates
- Weigh flower products on scales and manually subtract tare weights
- Handle mixed payment types (cash, bank transfer, credit cards, digital wallets)
- Perform mandatory shift reconciliation at shift open/close (counting cash and flower inventory)
- Search for products and process sales through walk-in, delivery, and wholesale channels
- Record delivery fees and payment methods for each order

*Managers perform additional activities:*

- Review detailed sales reports, profit margins, and variance analysis
- Access historical reconciliation reports to identify patterns
- Compare performance across shifts and investigate discrepancies
- Monitor inventory levels and generate purchase recommendations
- Access staff activity logs and audit trails

**Specific Needs & Pain Points:**

*Shared across all staff:*

- Need fast transaction processing to avoid customer wait times during peak hours
- Struggle with mental math for tiered pricing calculations, especially with multiple flower strains
- Fear making pricing mistakes that result in accountability or customer complaints
- Want streamlined shift reconciliation that's thorough but doesn't delay shift transitions
- Need clear guidance on recording payment methods and delivery fee attribution
- Want quick product search (barcode scan or text search) to locate items efficiently

*Manager-specific needs:*

- Need visibility into historical trends to identify theft, pricing errors, or operational issues
- Want to compare shift-to-shift performance to ensure consistency
- Need evidence-based insights to coach staff on proper procedures
- Require access to detailed reports without leaving the floor to check back-office systems

**Goals They're Trying to Achieve:**

*Staff goals:*

- Complete shift without cash/inventory discrepancies
- Process transactions quickly and accurately
- Finish shift reconciliation efficiently to leave on time
- Maintain clean handoffs to incoming shift staff

*Manager goals:*

- Ensure operational discipline across all shifts
- Identify and address discrepancies before they become systemic problems
- Use data to improve staff performance and operational efficiency
- Maintain accountability while performing the same shift duties as staff

**Key Insight:** The system must support **role-based permissions** where the core POS interface is identical for all staff, but managers gain access to additional reporting, historical data, and audit capabilities. This ensures managers can work shifts alongside staff while having supervisory visibility when needed.

### Secondary User Segment: Dispensary Owners (Multi-Location Operators)

**Demographic Profile:**
- Age: 30-55 years old
- Role: Business owners with single or multiple dispensary locations
- Business sophistication: Varying from first-time entrepreneurs to experienced retail operators
- Tech comfort: Moderate to high, comfortable with dashboards and business intelligence tools
- Investment level: 2-10+ million baht invested per location

**Current Behaviors & Workflows:**

- Review consolidated sales and profitability reports across all locations
- Monitor inventory levels and purchasing patterns
- Track staff performance and investigate anomalies flagged by managers
- Make strategic decisions on pricing, product mix, and expansion
- Use multi-location dashboards to identify best practices and underperforming locations
- Analyze historical data to forecast demand and optimize inventory investment

**Specific Needs & Pain Points:**

- Cannot effectively oversee multiple locations without visiting each site physically
- Lack consolidated view of which locations, products, or staff are driving profitability
- Need to identify fraud patterns or operational issues early (shift-to-shift variance, unusual void patterns)
- Want standardized operations across locations without micromanaging store managers
- Require benchmarking data to assess relative performance of each location

**Goals They're Trying to Achieve:**

- Scale operations profitably without proportionally increasing management overhead
- Minimize revenue leakage across all locations through systematic controls
- Build data-driven playbooks for expansion and replication
- Identify and replicate success patterns from top-performing locations
- Maintain oversight without being physically present at each location daily

---

## Goals & Success Metrics

### Business Objectives

- **Reduce revenue leakage by 60%** within 6 months of deployment across initial pilot locations (targeting reduction from estimated 3-8% shrinkage to <2%)
- **Eliminate pricing calculation errors** reducing pricing discrepancies from estimated 15-20% of transactions to <1% through automated tiered pricing
- **Reduce shift reconciliation time by 50%** from current 2-4 hours per day to 1-2 hours per day per location
- **Achieve positive ROI within 12 months** through combined savings from reduced shrinkage, improved margins, and labor efficiency
- **Enable multi-location expansion** by providing centralized oversight tools that allow single owner to effectively manage 3-5 locations

### User Success Metrics

- **Transaction Processing Speed**: Average transaction completion time <90 seconds from product selection to receipt printing (including payment processing)
- **Reconciliation Completion Rate**: 100% of shifts complete mandatory reconciliation before accessing POS for new transactions
- **Pricing Accuracy**: <1% of transactions require price adjustment or void due to tiered pricing errors
- **System Adoption**: 90% of staff report confidence in using system within 2 weeks of deployment
- **Shift Handoff Clarity**: <5% of shift transitions result in disputed discrepancies between outgoing and incoming staff

### Key Performance Indicators (KPIs)

*(Note: Comprehensive KPI list available in detailed appendix - over 80+ metrics covering operational efficiency, revenue & profitability, sales channels, inventory management, purchasing & suppliers, staff performance, multi-location operations, customer behavior, fraud detection, system performance, tax & compliance, and financial health)*

**Core Operational KPIs (Summary):**

- Inventory Accuracy Rate: ≤2% variance
- Cash Reconciliation Variance: ≤0.5% per shift
- Flower Inventory Variance: ≤3% per daily reconciliation
- Gross Profit Margin by Product (FIFO-based)
- Shrinkage Rate: <2% target
- Average Transaction Value (ATV) and Normalized ATV (staff performance)
- Inventory Turnover Rate: 8-12x/year target for flowers
- Stock-Out Rate and Low Stock Alerts
- Supplier Lead Time and Reliability
- Staff Void/Return Rate and Reconciliation Variance

**Advanced KPIs:**

- Tier Activation Rate (% transactions qualifying for volume discounts)
- FIFO Compliance Rate
- Batch Age and Dead Stock Value
- Peak Hours Analysis
- Channel-Specific Performance (Walk-In, Delivery, Wholesale)
- Fraud Detection Indicators (variance trends, void patterns, tare weight anomalies)

---

## Reporting & Analytics Requirements

The system must provide comprehensive reporting across four key domains to support operational decision-making, fraud prevention, inventory optimization, and regulatory compliance.

### 1. Sales & Profitability Reports

#### 1.1 Daily/Weekly/Monthly Sales Summary Report

**Data Elements:**
- Total Revenue, Total Transactions, Average Transaction Value (ATV), Total Items Sold
- Revenue by Sales Channel (Walk-in, Delivery, Wholesale)
- Revenue by Payment Method (Cash, Bank Transfer, Credit Card, Wallet)
- Period-over-period comparison

**Use Cases:**
- Identify sales trends and patterns
- Compare performance across time periods
- Set sales targets and track progress

#### 1.2 Product Performance Report

**Data Elements:**
- Best-Sellers ranking by quantity sold, total revenue, frequency of purchase
- Worst-Sellers (slow-moving inventory) by same metrics
- Sales velocity (units sold per day)

**Use Cases:**
- **Best-Sellers**: Ensure adequate stock levels, feature in promotions
- **Worst-Sellers (Dead Stock)**: Plan clearance strategies (discount promotions, bundle with best-sellers)
- Optimize product mix and merchandising

#### 1.3 Sales by Category Report

**Data Elements:**
- Revenue by product category (Flowers, Pre-Rolls, Edibles, Accessories)
- Percentage of total revenue per category
- Average margin per category

**Use Cases:**
- Identify highest-revenue categories for purchasing priority
- Optimize store layout and shelf space allocation

#### 1.4 Profit & Margin Report

**Data Elements:**
- Cost of Goods Sold (COGS) per product using FIFO
- Gross Profit and Gross Profit Margin % per product/category
- Profit breakdown showing: **High Revenue + High Margin** (Star performers), **High Revenue + Low Margin** (Volume movers - review pricing), **Low Revenue + High Margin** (Hidden gems - promote more), **Low Revenue + Low Margin** (Candidates for discontinuation)

**Use Cases:**
- Identify most profitable products to prioritize
- Detect products that need repricing
- Support supplier negotiations with data

#### 1.5 Sales by Budtender/Employee Report

**Data Elements:**
- Revenue per staff member
- Transaction count and Average Transaction Value per staff
- **Normalized ATV** per staff member (excluding peak/slow periods for fair comparison)
- Upsell rate, discount rate, void/return rate per staff

**Use Cases:**
- Evaluate employee performance objectively
- Identify top performers with strong upselling/cross-selling skills
- Determine incentive/bonus allocations

### 2. Inventory Management Reports

#### 2.1 Inventory on Hand Report

**Data Elements:**
- Complete product list with current quantities
- Product status (In Stock, Low Stock, Out of Stock)
- Total inventory value (at cost using FIFO, at retail price)
- Inventory by location

**Use Cases:**
- Real-time visibility into available inventory
- Calculate working capital tied up in stock

#### 2.2 Low Stock Report (Reorder Alert)

**Data Elements:**
- Products below defined Reorder Point
- Current quantity, recommended order quantity, supplier information
- Average lead time to restock
- Estimated stock-out date based on sales velocity

**Use Cases:**
- **Critical**: Prevent lost sales due to stock-outs
- Automate reordering workflow

#### 2.3 Inventory Turnover Rate Report

**Data Elements:**
- Turnover rate per product: (COGS / Average Inventory Value)
- Number of times inventory was sold and replenished in period
- Days of inventory on hand
- Comparison to target turnover rates (8-12x/year for flowers)

**Use Cases:**
- High turnover = Good sales and efficient inventory management
- Low turnover = Overstock situation, capital tied up unnecessarily

#### 2.4 Stock Aging Report

**Data Elements:**
- Inventory age buckets: 0-30 days (Fresh), 31-60 days (Aging), 61-90 days (Old), 90+ days (Dead Stock)
- Quantity and value in each age bucket
- Batch numbers and receiving dates

**Use Cases:**
- **Critical for cannabis**: Flowers degrade over time - identify aging inventory before quality suffers
- Plan clearance strategies for old stock (discounts, bundles, promotions)

#### 2.5 Inventory Variance/Shrinkage Report

**Data Elements:**
- Expected inventory (system quantity) vs. Actual inventory (physical count)
- Variance percentage and value
- Variance by Product/Category, Location, Shift/Staff member, Time period
- Cumulative shrinkage over time

**Use Cases:**
- Detect theft, operational errors, or system issues
- Identify patterns indicating systematic problems
- Hold staff accountable through shift-to-shift reconciliation

### 3. Operations & Customer Reports

#### 3.1 Peak Hours/Days Report

**Data Elements:**
- Revenue by hour of day (12:00-24:00) and day of week
- Transaction count by hour/day
- Heatmap visualization showing busiest periods

**Use Cases:**
- Optimize staff scheduling - deploy more staff during peak hours
- Plan promotions during slow periods to drive traffic

#### 3.2 New vs. Returning Customer Report

**Data Elements:**
- Number and percentage of new vs. returning customers
- Repeat purchase rate
- Customer lifetime value (CLV) estimates

**Use Cases:**
- Measure effectiveness of customer retention programs
- Assess loyalty program performance

### 4. Financial & Compliance Reports

#### 4.1 Profit & Loss Statement (P&L)

**Data Elements:**
- Revenue: Gross Sales, Less Returns & Discounts, Net Sales
- Cost of Goods Sold (COGS)
- Gross Profit and Gross Margin %
- Operating Expenses (Salaries, Rent, Utilities, Marketing, etc.)
- Net Profit/Loss and Net Margin %

**Use Cases:**
- Determine if business is profitable or operating at a loss
- Identify expense categories that need cost control
- Provide financial statements to investors/lenders

#### 4.2 Batch Tracking Report (Seed-to-Sale Traceability)

**Data Elements:**
- Batch/Lot number, Product name and strain, Supplier information
- Receiving date, Purchase cost per batch, Tare weight recorded
- Initial quantity received, Current quantity remaining
- Sales history (Transaction IDs, Sale dates, Quantities sold, Customers if tracked)
- Batch status (Active, Depleted, Expired, Recalled)

**Use Cases:**
- **Regulatory Compliance**: Required for cannabis traceability regulations
- **Product Recalls**: Quickly identify all sales from defective batch and notify customers
- **FIFO Verification**: Ensure oldest batches are being sold first
- **Supplier Quality Assessment**: Track performance and quality by supplier batch history

### Report Access Control by Role

| Report Category | Staff (Budtender) | Manager | Owner |
|----------------|-------------------|---------|-------|
| Sales Summary | Current shift only | All periods | All locations, all periods |
| Product Performance | Current shift only | Location-specific | All locations |
| Profit & Margin | ❌ No access | Location-specific | All locations |
| Employee Performance | Own performance only | All staff at location | All staff, all locations |
| Inventory On Hand | ✅ View only | ✅ View + Edit | ✅ Full access |
| Stock Aging | ❌ No access | ✅ Full access | ✅ Full access |
| Shrinkage Reports | Own shift only | All shifts at location | All locations |
| P&L Statement | ❌ No access | ❌ No access | ✅ Full access |
| Batch Tracking | Basic view | Full access | Full access |

### Report Delivery & Scheduling

**Automated Report Distribution:**
- **Daily**: Sales Summary, Shift Reconciliation Report (sent to managers at shift close)
- **Weekly**: Inventory Aging Report, Low Stock Alert, Shrinkage Summary (sent Monday morning)
- **Monthly**: P&L Statement, Product Performance Report, Staff Performance Report (sent first day of new month)
- **On-Demand**: All reports available for manual generation with date range selection

**Export Formats:**
- PDF (for presentation and printing)
- Excel/CSV (for further analysis)
- Email delivery option
- Dashboard views (real-time access within system)

---

## Report Layout & Visualization Specifications

*(Conceptual descriptions for designers and developers)*

### Design Principles for All Reports

1. **Mobile-First Approach**: All reports must be fully functional on tablets (primary device) and mobile phones
2. **Touch-Friendly**: Minimum touch targets of 44x44px
3. **Progressive Disclosure**: Show summary first, allow drill-down for details
4. **Consistent Visual Language**: Standardized chart colors, typography, spacing
5. **Export & Share**: Every report must have PDF export and share capabilities
6. **Date Range Flexibility**: All reports support custom date range selection
7. **Real-Time Updates**: Dashboard views refresh automatically

### Example: Sales Summary Report Layout

```
┌─────────────────────────────────────────────────┐
│ [Date Range Picker]  [Filter: All Channels ▾]  │
│ [Export PDF] [Export CSV] [Share]              │
├─────────────────────────────────────────────────┤
│  📊 KEY METRICS CARDS (2x2 Grid on Mobile)     │
│  ┌──────────────┐ ┌──────────────┐            │
│  │  Total Revenue│ │  Total Trans │            │
│  │  ฿45,230     │ │  127         │            │
│  │  +12.5% ↑    │ │  +8 from prev│            │
│  └──────────────┘ └──────────────┘            │
├─────────────────────────────────────────────────┤
│  📈 REVENUE TREND (Line Chart)                 │
│  - Shows revenue over selected period          │
│  - Comparison line: Previous period (dotted)   │
│  - Touch to see exact values                   │
├─────────────────────────────────────────────────┤
│  🥧 REVENUE BY CHANNEL (Donut Chart)           │
│  - Walk-In: 65%, Delivery: 25%, Wholesale: 10%│
└─────────────────────────────────────────────────┘
```

### Example: Product Performance Report Layout

```
┌─────────────────────────────────────────────────┐
│  🏆 TOP 10 BEST SELLERS                        │
│  ┌───────────────────────────────────────────┐ │
│  │ #1 Superboof                              │ │
│  │    ████████████████░░░░  250g sold        │ │
│  │    ฿75,000 revenue  |  ฿300/g avg price   │ │
│  │    [View Details →]                       │ │
├─────────────────────────────────────────────────┤
│  ⚠️ SLOW MOVERS / DEAD STOCK                   │
│  │ Grinder - Wooden (Black)                  │ │
│  │ 45 days in stock  |  ฿400 value tied up   │ │
│  │ [Create Promotion] [Bundle Deal]          │ │
└─────────────────────────────────────────────────┘
```

**Visualization Details:**
- **Horizontal Bar Charts**: Length represents relative sales volume
- **Color Coding**: Green (best sellers), Yellow (medium), Red (slow movers)
- **Action Buttons**: Context-specific actions (create promotion, bundle, discontinue)

### Example: Stock Aging Report Layout

```
┌─────────────────────────────────────────────────┐
│  ⏰ AGING DISTRIBUTION (Stacked Bar Chart)     │
│  ██████ 0-30d ████ 31-60d ██ 61-90d █ 90d+│
│  65%           25%         8%        2%    │
├─────────────────────────────────────────────────┤
│  🚨 ACTION REQUIRED: OLD STOCK (61+ days)      │
│  │ Purple Haze - Batch #PH-2024-11           │ │
│  │ Age: 78 days | Qty: 15.5g | Val: ฿4,185  │ │
│  │ [Flash Sale 20%] [Bundle Deal] [Transfer]│ │
└─────────────────────────────────────────────────┘
```

**Color Coding:**
- Green (0-30 days): Fresh inventory, optimal age
- Yellow (31-60 days): Aging inventory, monitor closely
- Orange (61-90 days): Old inventory, action recommended
- Red (90+ days): Dead stock, urgent action required

### Cross-Report Features

**Universal Features Across All Reports:**

1. **Date Range Selector**: Quick presets (Today, Yesterday, Last 7 Days, etc.) + Calendar picker
2. **Export & Share**: PDF export, Excel/CSV export, Email report, Share via Line/WhatsApp
3. **Filters**: Location, Category, Staff member, Sales channel, Payment method
4. **Responsive Design**: Desktop (multi-column), Tablet (landscape optimized), Mobile (single column, stacked cards)
5. **Real-Time Updates**: Live refresh toggle (30s, 1min, 5min intervals)

---

## MVP Scope

The MVP (Minimum Viable Product) focuses on delivering the **core fraud prevention, inventory management, and sales functionality** needed to operate a single-location cannabis dispensary with confidence. The goal is to get a working system into users' hands quickly using dummy data, validate the workflows, then connect to real Supabase backend.

### Core Features (Must Have for MVP)

#### 1. Point of Sale (POS) - Transaction Processing

**Features:**
- ✅ Product Search & Selection (barcode scanning, text search, visual product grid)
- ✅ Shopping Cart Management (add/remove items, adjust quantities)
- ✅ Automated Tiered Pricing Engine (aggregate flower weight, determine tier, apply rates)
- ✅ Multi-Payment Method Support (Cash, Bank Transfer, Credit Card, Digital Wallet, Split payment)
- ✅ Discount System (percentage or fixed amount)
- ✅ Change Calculation (input amount tendered, auto-calculate change)
- ✅ Order Notes (free-text per transaction)
- ✅ Sales Channel Selection (Walk-In, Delivery, Wholesale)
- ✅ Receipt Generation (print-ready, PDF export)

**Out of Scope for MVP:**
- ❌ Customer loyalty program
- ❌ Online ordering / e-commerce
- ❌ Gift card / store credit

#### 2. Shift Management & Reconciliation

**Features:**
- ✅ Mandatory Shift Workflow (system locks POS until reconciliation completed)
- ✅ AM Shift: Open 12:00 PM, Close 6:00 PM | PM Shift: Open 6:00 PM, Close 12:00 AM
- ✅ Shift Open Reconciliation (count starting cash, starting flower inventory with tare weight deduction)
- ✅ Shift Close Reconciliation (count ending amounts, calculate variance, flag discrepancies)
- ✅ Daily Reconciliation Report (shift-to-shift comparison, historical access)

**Out of Scope for MVP:**
- ❌ Advanced anomaly detection algorithms
- ❌ Automated SMS/email alerts for variance

#### 3. Inventory Management

**Features:**
- ✅ Product Catalog Management (CRUD operations, categories, price tiers)
- ✅ Batch/Lot Receiving (record incoming inventory with supplier, date, quantity, cost, tare weight)
- ✅ FIFO Inventory Allocation (auto-allocate from oldest batch first)
- ✅ Tare Weight Management (record per batch, auto-deduct during counts)
- ✅ Stock Level Tracking (real-time updates, low stock indicators)
- ✅ Weekly Stock Count (record start/end time, physical count, calculate variance)

**Out of Scope for MVP:**
- ❌ Automated purchase order generation
- ❌ Supplier portal integration
- ❌ Barcode label printing

#### 4. User Management & Access Control

**Features:**
- ✅ User Roles (Staff/Budtender, Manager, Owner)
- ✅ Login/Logout (username/password authentication)
- ✅ Role-Based Permissions (POS access, reporting access, inventory adjustment rights)

**Out of Scope for MVP:**
- ❌ Two-factor authentication (2FA)
- ❌ Biometric login
- ❌ Single sign-on (SSO)

#### 5. Essential Reporting (MVP Reports Only)

**MVP Reports Included:**

✅ **Sales & Profitability:**
1. Daily/Weekly/Monthly Sales Summary Report
2. Product Performance Report (Best/Worst Sellers)
3. Sales by Category Report
4. Profit & Margin Report

✅ **Inventory:**
5. Inventory on Hand Report
6. Low Stock Report
7. Stock Aging Report (basic)
8. Inventory Variance/Shrinkage Report

✅ **Operations:**
9. Shift Reconciliation Report (historical view)

✅ **Staff:**
10. Sales by Employee Report (basic)

**Post-MVP Reports (Phase 2):**
- ❌ Peak Hours/Days Report (heatmap)
- ❌ New vs. Returning Customer Report
- ❌ P&L Statement (full accounting)
- ❌ Batch Tracking Report (seed-to-sale compliance)

**Report Features in MVP:**
- Date range selection, PDF export, Basic filtering, Mobile-responsive design

**Post-MVP:**
- CSV/Excel export, Email scheduling, Advanced visualizations, Real-time auto-refresh

#### 6. Core System Features

**Features:**
- ✅ Responsive Design (mobile-first, tablet-optimized, desktop support)
- ✅ English Interface (all UI text in English, currency in Baht ฿, weight in grams, dates in CE format)
- ✅ Data Persistence (local storage for dummy data in MVP Phase 1, ready for Supabase in Phase 2)
- ✅ Environment Configuration (.env file for all sensitive keys, Supabase URL/API keys)
- ✅ Optional Tax System (toggle tax on/off, VAT calculation when enabled)
- ✅ Optional Compliance Fields (age verification, quantity limits - all optional)

**Out of Scope for MVP:**
- ❌ Offline mode with sync
- ❌ Multi-language support
- ❌ Dark mode

### MVP Success Criteria

The MVP is considered successful when:

1. ✅ Staff can process a complete transaction in <90 seconds
2. ✅ Tiered pricing automatically calculates correctly for mixed flower orders
3. ✅ Shift reconciliation workflow prevents POS access until completed
4. ✅ FIFO allocation works correctly (oldest batch sold first)
5. ✅ All MVP reports generate accurate data from real Supabase database
6. ✅ System works smoothly on tablets (primary device)
7. ✅ Role-based access control properly restricts features based on user role
8. ✅ 90% of test users complete training within 2 hours
9. ✅ System maintains <3 second page load times on 4G connection

### Development Approach: Single Integrated Phase

**All-In-One Development (Weeks 1-12)**

Rather than separating dummy data prototyping from backend integration, we will build the complete system with Supabase integration from day one. This approach:

- **Week 1-2: Project Setup & Database Design**
  - Set up React + Vite + shadcn/ui project
  - Design complete Supabase database schema
  - Configure authentication and row-level security policies
  - Set up .env configuration
  - Create seed data scripts for testing

- **Week 3-5: Core POS Functionality**
  - Product catalog management (connected to Supabase)
  - Shopping cart with tiered pricing engine
  - Multi-payment processing
  - Receipt generation
  - Sales channel selection

- **Week 6-7: Shift Reconciliation & Inventory**
  - Mandatory shift workflow with database persistence
  - Shift open/close reconciliation
  - FIFO inventory allocation
  - Batch tracking with tare weights
  - Weekly stock count functionality

- **Week 8-10: Reporting Suite**
  - All 10 MVP reports connected to real data
  - Role-based access control
  - PDF export functionality
  - Date range filtering and comparison views

- **Week 11-12: UAT & Pilot Deployment**
  - Deploy to staging environment
  - User acceptance testing
  - Bug fixes and refinements
  - Deploy to 1-2 pilot locations
  - Staff training

**Rationale for Single-Phase Approach:**
- Eliminates "throw-away" dummy data code
- Faster time to production-ready system
- Real data from day one enables better testing
- No migration complexity from dummy data to real database
- Allows parallel development of frontend and backend
- Earlier validation of database performance and architecture

### Out of Scope for MVP (Future Enhancements)

**Post-MVP Features (Phase 2):**
- Multi-location support with centralized dashboards
- Advanced reporting (Peak Hours heatmap, New vs. Returning Customer, full P&L with operating expenses)
- Customer management with loyalty programs
- Automated purchase order generation
- Supplier portal with performance tracking
- Advanced fraud detection (statistical anomaly detection, ML-based pattern recognition)
- Offline mode with data sync
- Multi-language support (Thai, Chinese)
- Dark mode theme
- Advanced accessibility features

**Long-Term Vision (Phase 3+):**
- Native mobile apps (iOS/Android)
- Integration with accounting software (QuickBooks, Xero)
- API for third-party integrations (delivery platforms, payment gateways)
- White-label / multi-tenant architecture for SaaS offering
- Cryptocurrency payment support
- Advanced analytics and predictive inventory recommendations
- Integration with cannabis testing labs
- Regulatory reporting automation for multiple jurisdictions

---

## Technical Considerations

### Platform Requirements

**Target Platforms:**
- Primary: Tablet devices (iPad, Android tablets) running modern browsers
- Secondary: Desktop browsers (Chrome, Edge, Firefox, Safari)
- Tertiary: Mobile phones (progressive enhancement)

**Browser/OS Support:**
- Modern browsers with ES6+ support
- Minimum screen size: 7" tablets
- Touch-optimized UI with fallback to mouse/keyboard

**Performance Requirements:**
- Page load time: <3 seconds on 4G connection
- Transaction processing: <90 seconds end-to-end
- Report generation: <5 seconds for standard reports
- Real-time inventory updates: <1 second latency

### Technology Stack

**Frontend:**
- **Framework**: React 18+ (with TypeScript)
- **UI Component Library**: shadcn/ui (built on Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: React Context API / Zustand (for complex state)
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod validation
- **Charts/Visualizations**: Recharts or Chart.js
- **Date Handling**: date-fns
- **HTTP Client**: Axios or native Fetch API

**Backend:**
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime (for live inventory updates)
- **Storage**: Supabase Storage (for product images, receipts)
- **API**: Supabase auto-generated REST API + PostgREST

**Hosting/Infrastructure:**
- **Frontend Hosting**: Vercel or Netlify
- **Database**: Supabase managed infrastructure
- **CDN**: Cloudflare or Vercel Edge Network
- **SSL**: Automatic via hosting provider

**Development Tools:**
- **Package Manager**: npm or pnpm
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions

### Architecture Considerations

**Repository Structure:**
- Monorepo approach (frontend + documentation)
- Clear separation of concerns (components, hooks, utils, services)
- Feature-based folder structure

**Service Architecture:**
- Single-page application (SPA)
- Client-side rendering with React
- API calls to Supabase backend
- Real-time subscriptions for inventory updates

**Integration Requirements:**
- Print API for receipt printing (browser print API or thermal printer integration)
- Barcode scanner support (USB HID or Bluetooth)
- Optional: Scale integration (USB serial or Bluetooth)
- Payment gateway integration (Phase 2)

**Security/Compliance:**
- All sensitive keys stored in .env file (never committed to version control)
- Row-level security (RLS) policies in Supabase
- Role-based access control enforced at database level
- HTTPS-only communication
- Input validation and sanitization
- SQL injection prevention (via Supabase)
- XSS protection
- CSRF token validation for state-changing operations

**Data Privacy:**
- Minimal customer data collection (optional fields only)
- Secure storage of employee credentials
- Audit logs for sensitive operations
- Data retention policies (configurable)

---

## Constraints & Assumptions

### Constraints

**Budget:**
- Development budget not specified; assuming lean startup approach
- Priority on speed-to-market over feature richness
- Open-source tools preferred to minimize licensing costs

**Timeline:**
- Target: 12-week MVP delivery (4 weeks prototype, 4 weeks integration, 4 weeks pilot)
- Constraint: Must deliver working prototype with dummy data within 4 weeks to validate workflows

**Resources:**
- Development team size not specified; assuming small team (1-3 developers)
- Limited design resources; leveraging shadcn/ui for rapid UI development
- No dedicated QA team; testing responsibility shared with development

**Technical:**
- Must run on Windows-based systems (based on user environment)
- Limited to modern browser capabilities (no legacy IE support)
- Dependent on Supabase availability (third-party service risk)
- Internet connectivity required (no offline mode in MVP)

### Key Assumptions

**Market Assumptions:**
- Thailand's cannabis dispensary market will continue growing post-decriminalization
- 200-500 existing dispensaries represent addressable market
- Dispensaries are willing to invest in specialized POS systems
- Price sensitivity: Expect competitive pricing pressure vs. generic POS systems

**User Assumptions:**
- Staff have basic computer/tablet literacy
- Staff are comfortable with English interface for work contexts
- Managers/owners understand importance of data-driven decision-making
- Users have access to tablets or computers at point of sale

**Technical Assumptions:**
- Reliable internet connection available at dispensary locations
- Modern tablets/devices available (purchased within last 3-4 years)
- Barcode scanners and receipt printers are standard USB/Bluetooth devices
- Supabase free tier sufficient for pilot; paid tier affordable for production

**Operational Assumptions:**
- Dispensaries operate two shifts per day (AM and PM as specified)
- Shift reconciliation is culturally acceptable practice (not seen as distrust)
- Staff turnover is moderate; training burden is manageable
- Pilot locations willing to provide honest feedback and tolerate MVP limitations

**Regulatory Assumptions:**
- Thai cannabis regulations remain stable during development
- Compliance requirements stay minimal (no extensive seed-to-sale tracking required immediately)
- Tax system remains optional for now
- Age verification and quantity limits remain business policy, not strict legal requirement

**Financial Assumptions:**
- 3-8% revenue leakage estimate is accurate for uncontrolled dispensaries
- 15-20% pricing error rate is realistic for manual tiered pricing
- ROI achievable within 12 months through shrinkage reduction and efficiency gains
- Willingness to pay: ฿5,000-15,000/month per location (estimated)

---

## Risks & Open Questions

### Key Risks

**1. User Adoption Risk**
- **Risk**: Staff resist mandatory shift reconciliation, perceiving it as micromanagement or distrust
- **Impact**: High - Core value proposition undermined if staff find workarounds
- **Mitigation**: Frame as "protecting everyone" (staff protected from false accusations, owners protected from loss); involve staff in pilot design; emphasize time savings vs. manual methods

**2. Technical Dependency Risk**
- **Risk**: Supabase service outages or performance issues prevent POS operations
- **Impact**: Critical - Cannot process sales during outage
- **Mitigation**: Implement offline fallback mode in Phase 2; SLA monitoring; backup plan to migrate to self-hosted PostgreSQL if needed

**3. Pricing Complexity Risk**
- **Risk**: Tiered pricing algorithm has edge cases not captured in requirements
- **Impact**: Medium - Incorrect pricing damages credibility and causes customer disputes
- **Mitigation**: Extensive testing with real-world scenarios; pilot deployment at friendly location; easy override mechanism with audit trail

**4. Performance Risk**
- **Risk**: System is slow on older tablets or with large product catalogs
- **Impact**: High - Transaction speed is key success metric (<90 seconds)
- **Mitigation**: Performance testing on target devices; optimize bundle size; lazy loading; pagination for large lists

**5. Market Timing Risk**
- **Risk**: Competitors release similar solutions during development, or regulatory changes make system obsolete
- **Impact**: High - Market opportunity closes
- **Mitigation**: Rapid MVP approach (12 weeks); focus on unique differentiators (tiered pricing, shift reconciliation); modular compliance system

**6. Regulatory Change Risk**
- **Risk**: Thai government introduces strict seed-to-sale tracking requirements like North American METRC
- **Impact**: Medium - Requires significant feature additions
- **Mitigation**: Architecture supports batch tracking (foundation for compliance); optional compliance fields allow gradual feature addition

**7. Data Security Risk**
- **Risk**: Security breach exposes customer or business data
- **Impact**: Critical - Reputational damage, legal liability
- **Mitigation**: Supabase handles infrastructure security; implement RLS policies; regular security audits; minimize sensitive data collection

**8. Scale Risk**
- **Risk**: Single-location architecture doesn't scale to multi-location needs
- **Impact**: Medium - Limits addressable market
- **Mitigation**: Design database schema with multi-location in mind; plan Phase 2 architecture early

### Open Questions

**Product Questions:**
1. What is acceptable price point per location per month for dispensary owners?
2. Should customer data collection be built into MVP even if optional, or truly Phase 2?
3. What level of customization is needed for price tiers? (Some dispensaries may want 4 tiers, others 6)
4. Do dispensaries need multi-language support for customer-facing displays, even if back-office is English?
5. Should system support cryptocurrency payments? (Growing trend in cannabis retail)

**Technical Questions:**
1. What thermal printer models are most common in Thai dispensaries? (Affects integration approach)
2. Are dispensaries using Windows PCs, Android tablets, or iPads predominantly?
3. What is typical internet bandwidth at dispensary locations? (Affects feasibility of image-heavy UI)
4. Should we support barcode printing for inventory labels in MVP or Phase 2?
5. What backup/disaster recovery requirements exist? (How much downtime is acceptable?)

**Operational Questions:**
1. How many products does a typical dispensary carry? (10? 50? 100? Affects UI pagination needs)
2. What is typical transaction volume per day? (50? 100? 200? Affects performance requirements)
3. Do managers work dedicated shifts or rotate between AM/PM?
4. How frequently do dispensaries receive new inventory batches? (Daily? Weekly?)
5. What is typical staff turnover rate? (Affects training burden and onboarding UX importance)

**Market Questions:**
1. Who are the decision-makers for POS system purchases? (Owners only, or managers have input?)
2. What is typical sales cycle length for B2B software in this market?
3. Are dispensaries currently using any POS system, or purely manual/cash register?
4. What is willingness to pay for pilot/beta access vs. mature product?
5. Do multi-location operators exist yet in Thailand, or is market still single-location dominated?

**Compliance Questions:**
1. Are there specific reporting requirements to Thai authorities we're not aware of?
2. What product testing/quality assurance documentation is required to be retained?
3. Are there restrictions on data storage location (must data stay in Thailand)?
4. What are current age verification enforcement standards?
5. Are there any upcoming regulatory changes we should design for?

### Areas Needing Further Research

**User Research:**
- Conduct interviews with 5-10 dispensary owners/managers to validate pain points
- Shadow staff during shifts to observe actual workflows and pain points
- Test paper prototypes of shift reconciliation workflow with real staff

**Competitive Research:**
- Deep dive into existing Thai POS systems (even if generic) to understand local expectations
- Research international cannabis POS systems for feature inspiration (but avoid over-engineering)
- Analyze pricing models of comparable B2B SaaS products in Thai market

**Technical Research:**
- Survey hardware landscape: what tablets, printers, scanners are already deployed?
- Test Supabase performance with realistic data volumes
- Prototype tiered pricing algorithm with edge cases
- Evaluate offline-first architecture options for Phase 2

**Regulatory Research:**
- Consult with Thai cannabis legal experts on compliance trajectory
- Review other SEA markets (Malaysia, Singapore) for regulatory patterns
- Understand export control implications if expanding beyond Thailand

---

## Next Steps

### Immediate Actions

1. **Validate Project Brief with Stakeholders**
   - Review this document with project sponsor/owner
   - Confirm budget, timeline, and scope alignment
   - Get sign-off on MVP feature prioritization

2. **Recruit Pilot Partners**
   - Identify 1-2 dispensaries willing to pilot system
   - Establish pilot partnership terms (free/discounted access for feedback)
   - Schedule site visits to understand current workflows

3. **Finalize Technical Architecture & Database Design**
   - Set up development environment (React + Vite + shadcn/ui + Supabase)
   - Create initial project scaffold
   - Design complete Supabase database schema (tables, relationships, indexes)
   - Define row-level security (RLS) policies for role-based access
   - Set up .env configuration templates
   - Create seed data scripts for development/testing

4. **Design Core Workflows**
   - Create detailed user flow diagrams for: POS transaction, Shift reconciliation, Inventory receiving
   - Design wireframes for key screens (POS interface, reconciliation workflow, primary reports)
   - Validate designs with pilot partners
   - Document API endpoints and data structures

5. **Begin Development (Week 1-12 All-In-One)**
   - Week 1-2: Project setup, Supabase configuration, authentication
   - Week 3-5: POS functionality with real database integration
   - Week 6-7: Shift reconciliation and inventory management
   - Week 8-10: Complete reporting suite
   - Week 11-12: UAT and pilot deployment

### PM Handoff

This Project Brief provides the full context for **CannaPOS Thailand - Cannabis Dispensary POS & Inventory Management System**.

**For Product Manager / Development Team:**

Please start by:
1. Reviewing this brief thoroughly and asking clarifying questions
2. Working with designer to create detailed wireframes/mockups based on report layout specifications
3. Designing complete Supabase database schema with tables, relationships, and RLS policies
4. Breaking down MVP scope into user stories and technical tasks (organized by weekly sprints)
5. Setting up project tracking (Jira, Linear, or GitHub Projects)
6. Creating development environment setup guide and .env template

**Key Priorities (Single-Phase Integrated Approach):**
- **Week 1-2**: Project setup, Supabase database schema, authentication, wireframes
- **Week 3-5**: Core POS functionality with real Supabase integration
- **Week 6-7**: Shift reconciliation + Inventory management with database persistence
- **Week 8-10**: Complete reporting suite (10 MVP reports) with real data
- **Week 11-12**: User acceptance testing (UAT) and pilot deployment

**Development Philosophy:**
Build with real database integration from day one—no dummy data, no migration complexity. This ensures production-ready code throughout development and enables continuous testing with realistic data scenarios.

---

**Document Version**: 1.1
**Last Updated**: 2025-01-15
**Change Log**: Updated to single-phase integrated development approach (removed dummy data prototype phase)
**Next Review**: Upon PM feedback

---

*🤖 Generated with Claude Code*

*Co-Authored-By: Claude <noreply@anthropic.com>*
