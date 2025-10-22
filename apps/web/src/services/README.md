# Services Layer

This directory contains domain-organized service modules that encapsulate all backend integration logic for the cannabis dispensary POS system.

## Architecture

Each service module follows these principles:

1. **Domain-Driven Organization**: Services are organized by business domain (auth, products, inventory, etc.)
2. **Consistent API**: All service functions return typed responses: `{ success: boolean, data?: T, error?: ErrorDetails }`
3. **Type Safety**: Full TypeScript type inference using generated Supabase types
4. **Error Handling**: Comprehensive error handling with user-friendly messages
5. **Documentation**: JSDoc comments on all exported functions

## Available Services

### Health Service (`health.service.ts`)

Provides health check operations for verifying system connectivity and status.

**Functions:**
- `testDatabaseConnection()` - Tests database connectivity
- `performHealthCheck()` - Comprehensive system health check
- `testAuthService()` - Tests authentication service

**Usage Example:**

```typescript
import { testDatabaseConnection } from '@/services/health.service';

// Test on app startup
const health = await testDatabaseConnection();

if (!health.success) {
  console.error('Database connection failed:', health.message);
  // Show error UI to user
} else {
  console.log('Database connected successfully');
}
```

## Service Development Guidelines

When creating new service modules:

### 1. File Naming Convention

Use descriptive names ending with `.service.ts`:
- `auth.service.ts` - Authentication operations
- `products.service.ts` - Product CRUD and queries
- `inventory.service.ts` - Inventory tracking
- `transactions.service.ts` - Sales transactions

### 2. Response Type Pattern

All service functions should return a consistent response type:

```typescript
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

### 3. Error Handling

Always handle errors and map them to user-friendly messages:

```typescript
try {
  const { data, error } = await supabase
    .from('table')
    .select('*');

  if (error) {
    return {
      success: false,
      error: {
        code: error.code,
        message: getUserFriendlyMessage(error),
      },
    };
  }

  return {
    success: true,
    data,
  };
} catch (error) {
  console.error('[ServiceName]', error);
  return {
    success: false,
    error: {
      code: 'UNEXPECTED_ERROR',
      message: 'An unexpected error occurred',
    },
  };
}
```

### 4. JSDoc Documentation

Add comprehensive JSDoc comments:

```typescript
/**
 * Retrieves a product by ID
 *
 * @param {string} productId - The unique product identifier
 * @param {string} franchiseId - The franchise ID for RLS filtering
 * @returns {Promise<ServiceResponse<Product>>} The product or error
 *
 * @example
 * ```typescript
 * const result = await getProductById('123', 'franchise-1');
 * if (result.success) {
 *   console.log('Product:', result.data);
 * }
 * ```
 */
export async function getProductById(
  productId: string,
  franchiseId: string
): Promise<ServiceResponse<Product>> {
  // Implementation
}
```

### 5. Type Safety

Always use generated Supabase types:

```typescript
import type { Database } from '@/types/supabase';
import { supabase } from '@/lib/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
```

### 6. Multi-Tenant Filtering

Always filter by `franchise_id` to respect RLS policies:

```typescript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('franchise_id', franchiseId); // Required for multi-tenant isolation
```

### 7. Query Optimization

- Select only required columns (avoid `select('*')` when possible)
- Use proper joins for relationships
- Implement pagination for large datasets
- Use database functions (RPC) for complex operations

```typescript
// Good: Select only needed columns
const { data } = await supabase
  .from('products')
  .select('id, name, price')
  .eq('franchise_id', franchiseId);

// Good: Pagination for large datasets
const { data } = await supabase
  .from('products')
  .select('*')
  .range(0, 99) // First 100 rows
  .eq('franchise_id', franchiseId);
```

## Testing Services

Each service should have corresponding test files:

```typescript
// products.service.test.ts
import { describe, it, expect } from 'vitest';
import { getProductById } from './products.service';

describe('ProductService', () => {
  it('should fetch product by id', async () => {
    const result = await getProductById('test-id', 'test-franchise');
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });
});
```

## Real-Time Subscriptions

For services with real-time features, always return cleanup functions:

```typescript
export function subscribeToInventoryChanges(
  franchiseId: string,
  callback: (change: InventoryChange) => void
): () => void {
  const subscription = supabase
    .channel('inventory-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'inventory',
        filter: `franchise_id=eq.${franchiseId}`,
      },
      callback
    )
    .subscribe();

  // Return cleanup function
  return () => {
    subscription.unsubscribe();
  };
}
```

## Error Codes

Common error codes used across services:

- `NETWORK_ERROR` - Network connectivity issues
- `AUTH_ERROR` - Authentication/authorization failures
- `VALIDATION_ERROR` - Input validation failures
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Unique constraint violations
- `PERMISSION_DENIED` - RLS policy violations
- `UNEXPECTED_ERROR` - Unhandled errors

## Performance Considerations

- Use database indexes for frequently queried columns
- Implement caching for rarely-changing data
- Batch operations when possible
- Monitor query performance with EXPLAIN ANALYZE
- Use connection pooling for high-traffic operations

## Security

- Never expose sensitive data in error messages
- Always respect RLS policies (filter by franchise_id)
- Validate all inputs before queries
- Use parameterized queries (Supabase handles this)
- Log security-relevant events

## Future Services

Services to be implemented:

- [ ] `auth.service.ts` - Authentication operations
- [ ] `products.service.ts` - Product management
- [ ] `inventory.service.ts` - Inventory tracking and FIFO
- [ ] `transactions.service.ts` - Sales transactions
- [ ] `shifts.service.ts` - Shift management
- [ ] `reports.service.ts` - Analytics and reporting
- [ ] `customers.service.ts` - Customer management
- [ ] `loyalty.service.ts` - Loyalty program operations
