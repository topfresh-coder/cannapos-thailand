// Enums
export type UserRole = 'cashier' | 'manager' | 'owner';
export type ProductCategory = 'Flower' | 'Pre-Roll' | 'Edible' | 'Concentrate' | 'Other';
export type ProductUnit = 'gram' | 'piece' | 'ml';
export type BatchStatus = 'Active' | 'Depleted' | 'Expired';
export type ShiftStatus = 'Open' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Force Closed';
export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'PromptPay';

// Core Entities
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  location_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  unit: ProductUnit;
  base_price: number;
  requires_tare_weight: boolean;
  reorder_threshold: number;
  is_active: boolean;
  location_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductBatch {
  id: string;
  product_id: string;
  batch_number: string;
  quantity_received: number;
  quantity_remaining: number;
  cost_per_unit: number;
  received_date: string;
  expiration_date: string | null;
  status: BatchStatus;
  depleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PricingTier {
  id: string;
  location_id: string;
  name: string;
  min_weight_grams: number;
  max_weight_grams: number | null;
  price_per_gram: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  transaction_number: string;
  location_id: string;
  user_id: string;
  shift_id: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  payment_method: PaymentMethod;
  total_flower_weight: number;
  tier_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  tier_id: string | null;
  gross_weight: number | null;
  tare_weight: number | null;
  override_price: number | null;
  override_reason: string | null;
  batch_allocations: BatchAllocation[];
  created_at: string;
}

export interface BatchAllocation {
  batch_id: string;
  quantity_allocated: number;
  cost_per_unit: number;
}

export interface Shift {
  id: string;
  location_id: string;
  user_id: string;
  shift_type: 'Morning' | 'Evening';
  shift_date: string;
  started_at: string;
  ended_at: string | null;
  starting_float: number;
  expected_cash: number | null;
  actual_cash: number | null;
  variance: number | null;
  variance_reason: string | null;
  total_transactions: number;
  total_revenue: number;
  status: ShiftStatus;
  approved_by: string | null;
  approved_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface StockCount {
  id: string;
  location_id: string;
  user_id: string;
  count_date: string;
  status: 'In Progress' | 'Completed' | 'Approved';
  total_items_counted: number;
  total_variance_value: number;
  notes: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StockCountItem {
  id: string;
  stock_count_id: string;
  product_id: string;
  expected_quantity: number;
  counted_quantity: number;
  variance: number;
  variance_value: number;
  notes: string | null;
  created_at: string;
}

// Helper Types for Cart
export interface TareData {
  gross_weight: number;
  tare_weight: number;
  net_weight: number;
}

export interface CartItem {
  id: string; // Temporary client-side ID
  product: Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  tierId: string | null;
  tareData: TareData | null;
  overridePrice: number | null;
  overrideReason: string | null;
}

export interface TierCalculationResult {
  currentTier: PricingTier | null;
  nextTier: PricingTier | null;
  totalFlowerWeight: number;
  weightToNextTier: number | null;
  potentialSavings: number | null;
}

// Shift Calculations
export interface ShiftVarianceResult {
  expected_cash: number;
  actual_cash: number;
  variance: number;
  severity: 'acceptable' | 'warning' | 'critical';
  percentageVariance: number;
}

// FIFO Allocation
export interface AllocationResult {
  allocations: BatchAllocation[];
  totalAllocated: number;
  totalCost: number;
  batchesUsed: number;
}
