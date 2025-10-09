# Epic 4: Shift Reconciliation System

**Goal**: Deliver mandatory shift-to-shift reconciliation workflow with AM (12PM-6PM) and PM (6PM-12AM) shift enforcement, variance tracking, and manager approval to prevent revenue leakage and ensure cash accountability.

## Story 4.1: Shift Definition & Configuration

As a **store manager**,
I want **to define shift schedules and rules for my location**,
so that **shift reconciliation enforcement aligns with actual operating hours**.

### Acceptance Criteria

1. Shift configuration screen created under Settings → Shifts
2. Two default shifts pre-configured:
   - AM Shift: 12:00 PM - 6:00 PM
   - PM Shift: 6:00 PM - 12:00 AM (midnight)
3. Shift configuration stored in `shift_definitions` table with fields: shift_name, start_time, end_time, location_id
4. Shifts editable (time ranges only, names fixed for MVP)
5. Validation: end_time > start_time, no overlapping shifts, shifts must cover full operating hours
6. Configuration applies per location
7. Changes to shift times do not affect historical shift records

## Story 4.2: Shift Opening - Cash Float Entry

As a **cashier**,
I want **to open my shift by entering the starting cash float**,
so that **end-of-shift reconciliation has a baseline for comparison**.

### Acceptance Criteria

1. When cashier logs in during shift hours, system checks if current shift is already open
2. If shift not open, "Open Shift" modal blocks access to POS functionality
3. Modal displays: shift_name, current date, cashier name, "Starting Cash Float" input field
4. Validation: starting_cash_float > 0, must be numeric
5. "Open Shift" button creates record in `shifts` table with: shift_definition_id, location_id, opened_by_user_id, opened_at (timestamp), starting_cash_float, status: "Open"
6. After opening, cashier gains full POS access
7. Only one shift can be open per location at a time
8. If previous shift not closed, error displayed: "Previous {shift_name} shift must be closed before opening new shift"

## Story 4.3: Transaction Assignment to Active Shift

As a **system**,
I want **all transactions automatically assigned to the currently open shift**,
so that **shift revenue can be accurately tracked**.

### Acceptance Criteria

1. Transactions table includes shift_id foreign key
2. When transaction created, system queries for open shift at current location
3. Transaction.shift_id populated with active shift_id
4. If no shift open, transaction blocked with error: "No active shift. Please open shift before processing transactions."
5. Shift assignment happens server-side during transaction commit
6. Transaction timestamp and shift time range validated (transaction time within shift hours)
7. Edge case handled: Transactions near shift boundary (11:59 PM) assigned to correct shift based on timestamp

## Story 4.4: Shift Summary Dashboard (Real-Time)

As a **cashier**,
I want **to view real-time shift performance metrics**,
so that **I can monitor progress and prepare for shift close**.

### Acceptance Criteria

1. Shift summary widget displayed on POS main screen showing:
   - Current shift name and status (Open)
   - Time remaining in shift (countdown)
   - Starting cash float
   - Transaction count (current shift)
   - Total revenue (current shift)
   - Expected cash (starting_cash_float + total_revenue)
2. Metrics update in real-time as transactions completed
3. "Close Shift" button visible when shift is within 30 minutes of end time or past end time
4. Shift summary accessible from navigation menu
5. Shift summary uses Supabase real-time subscriptions for live updates

## Story 4.5: Shift Closing - Cash Count Entry

As a **cashier**,
I want **to close my shift by entering the actual cash count**,
so that **variance can be calculated and reconciled**.

### Acceptance Criteria

1. "Close Shift" button opens shift closing modal
2. Modal displays shift summary: starting_cash_float, transaction_count, total_revenue, expected_cash
3. "Actual Cash Count" input field for cashier to enter physical cash counted
4. Variance calculated automatically: variance = actual_cash_count - expected_cash
5. Variance displayed with color coding: Green if ±฿0-10, Amber if ±฿11-50, Red if >฿50
6. "Variance Reason" text field (required if |variance| > ฿50)
7. "Submit for Approval" button saves: actual_cash_count, variance, variance_reason, closed_by_user_id, closed_at (timestamp), status: "Pending Approval"
8. After submission, shift status updated to "Pending Approval" and POS access restricted until next shift opened
9. Cashier cannot close shift if current transaction in progress

## Story 4.6: Manager Shift Approval Workflow

As a **store manager**,
I want **to review and approve shift reconciliations**,
so that **discrepancies can be investigated before finalizing**.

### Acceptance Criteria

1. Manager dashboard shows list of shifts with status "Pending Approval"
2. Shift approval screen displays:
   - Shift details (name, date, cashier, times)
   - Starting cash float, expected cash, actual cash count
   - Variance amount and percentage
   - Variance reason (if provided)
   - Transaction list for the shift (drilldown)
3. "Approve" button updates shift status to "Approved" and records approved_by_user_id, approved_at
4. "Reject" button requires rejection_reason, updates status to "Rejected", notifies cashier
5. Rejected shifts require cashier to re-submit with corrections
6. Approved shifts are locked and cannot be edited
7. Manager can add notes to shift record

## Story 4.7: Shift Reconciliation History & Reporting

As a **store manager**,
I want **to view historical shift reconciliation data**,
so that **I can identify patterns in variances and employee performance**.

### Acceptance Criteria

1. Shift history screen shows all shifts with filters: date range, shift type (AM/PM), status, cashier
2. Table columns: date, shift_name, cashier_name, starting_cash, expected_cash, actual_cash, variance, variance_%, status, approved_by
3. Sortable by all columns
4. Variance column color-coded (green/amber/red)
5. Click row to view shift detail with full transaction list
6. Export to CSV functionality
7. Summary statistics displayed: Average variance, Total shifts, Approval rate, Top variance contributors (by cashier)

## Story 4.8: Shift Variance Alerts & Notifications

As a **store manager**,
I want **automatic alerts for high-variance shifts**,
so that **I can investigate discrepancies immediately**.

### Acceptance Criteria

1. When shift submitted with |variance| > ฿100, manager receives in-app notification
2. Notification displays: shift_name, date, cashier_name, variance_amount
3. Notification links directly to shift approval screen
4. High-variance shifts (>฿100) flagged with warning icon in shift list
5. Notification preferences configurable per manager (email, in-app, or both)
6. Notification log stored in database for audit trail

## Story 4.9: Forced Shift Close (Manager Override)

As a **store manager**,
I want **the ability to force-close a shift left open by a cashier**,
so that **operations can continue even if cashier forgets to close shift**.

### Acceptance Criteria

1. Manager dashboard shows "Open Shifts" list with age indicator
2. "Force Close" button available for shifts open >24 hours
3. Force close modal prompts manager to enter: actual_cash_count, variance_reason (required), override_notes
4. Force close creates shift record with: status "Force Closed", closed_by_user_id (manager), force_closed: true flag
5. Original cashier notified of force closure
6. Force-closed shifts highlighted in shift history
7. Manager can optionally reassign responsibility to another user

## Story 4.10: Shift Handoff Notes

As a **cashier**,
I want **to leave notes for the next shift**,
so that **important information is communicated across shift changes**.

### Acceptance Criteria

1. "Shift Notes" section available in shift closing modal
2. Cashier can enter free-text notes (max 500 characters)
3. Notes saved to shifts.handoff_notes field
4. When next shift opens, handoff notes from previous shift displayed in modal: "Notes from previous shift: {notes}"
5. Handoff notes visible in shift detail view
6. Notes optional (not required for shift close)
7. Notes support basic formatting (line breaks preserved)

---
