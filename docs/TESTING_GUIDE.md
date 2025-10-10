# Testing Guide

Complete testing strategy and examples for the CannaPOS Thailand application.

## Table of Contents

- [Testing Strategy](#testing-strategy)
- [Running Tests](#running-tests)
- [Writing Unit Tests](#writing-unit-tests)
- [Writing Component Tests](#writing-component-tests)
- [Testing Supabase Integration](#testing-supabase-integration)
- [Testing Best Practices](#testing-best-practices)
- [Coverage Requirements](#coverage-requirements)

---

## Testing Strategy

The CannaPOS Thailand application uses a comprehensive testing strategy to ensure reliability and maintainability:

### Testing Pyramid

```
       /\
      /  \     E2E Tests (5%)
     /____\    - Critical user journeys
    /      \   - End-to-end flows
   /        \
  /__________\ Integration Tests (15%)
 /            \ - Component + Supabase
/              \ - Service layer tests
/________________\ Unit Tests (80%)
                   - Business logic
                   - Utilities
                   - Pure functions
```

### Testing Frameworks

- **Unit & Component Tests**: Vitest 2.1.8
- **React Component Testing**: React Testing Library 16.1.0
- **DOM Simulation**: jsdom 25.0.1
- **Test Utilities**: @testing-library/jest-dom 6.6.3

### Test File Organization

Tests are co-located with source files:

```
src/
├── utils/
│   ├── currency.ts
│   └── currency.test.ts          # Unit test
├── components/
│   ├── ProductCard.tsx
│   └── ProductCard.test.tsx      # Component test
├── services/
│   ├── productService.ts
│   └── productService.test.ts    # Integration test
└── test/
    ├── setup.ts                   # Global test setup
    └── helpers.ts                 # Test utilities
```

---

## Running Tests

### Basic Test Commands

```bash
cd apps/web

# Run tests in watch mode (recommended during development)
npm run test

# Run tests once (CI/CD)
npm run test -- --run

# Run tests with UI (interactive mode)
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run specific test file
npm run test -- src/utils/currency.test.ts

# Run tests matching pattern
npm run test -- --grep "ProductCard"

# Run tests in a specific directory
npm run test -- src/components
```

### Watching for Changes

Vitest watch mode automatically reruns tests when files change:

```bash
npm run test

# In watch mode, press:
# a - run all tests
# f - run only failed tests
# p - filter by test file name
# t - filter by test name pattern
# q - quit watch mode
```

### Coverage Reports

Generate and view coverage reports:

```bash
# Generate coverage
npm run test:coverage

# Coverage report is saved to:
# apps/web/coverage/
# - index.html (open in browser for detailed view)
# - coverage.json (machine-readable)
```

**Coverage Thresholds**:
- Business logic (utils, services): 80%+
- React components: 60%+
- Overall project: 70%+

---

## Writing Unit Tests

Unit tests validate individual functions and business logic in isolation.

### Example: Testing Utility Functions

```typescript
// src/utils/currency.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(amount);
}

export function parseCurrency(formatted: string): number {
  const cleaned = formatted.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned) || 0;
}
```

```typescript
// src/utils/currency.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, parseCurrency } from './currency';

describe('formatCurrency', () => {
  it('formats positive amounts correctly', () => {
    expect(formatCurrency(1000)).toBe('฿1,000.00');
    expect(formatCurrency(1234.56)).toBe('฿1,234.56');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('฿0.00');
  });

  it('formats negative amounts correctly', () => {
    expect(formatCurrency(-500)).toBe('-฿500.00');
  });

  it('rounds to two decimal places', () => {
    expect(formatCurrency(10.999)).toBe('฿11.00');
    expect(formatCurrency(10.123)).toBe('฿10.12');
  });
});

describe('parseCurrency', () => {
  it('parses formatted currency correctly', () => {
    expect(parseCurrency('฿1,234.56')).toBe(1234.56);
    expect(parseCurrency('฿1,000.00')).toBe(1000);
  });

  it('handles numbers without formatting', () => {
    expect(parseCurrency('1234.56')).toBe(1234.56);
  });

  it('returns 0 for invalid input', () => {
    expect(parseCurrency('invalid')).toBe(0);
    expect(parseCurrency('')).toBe(0);
  });
});
```

### Example: Testing Business Logic

```typescript
// src/utils/tierPricing.ts
interface PricingTier {
  minWeight: number;
  maxWeight: number;
  discountPercentage: number;
}

export function calculateTierDiscount(
  weight: number,
  tiers: PricingTier[]
): number {
  const tier = tiers.find(
    (t) => weight >= t.minWeight && weight <= t.maxWeight
  );

  return tier ? tier.discountPercentage : 0;
}

export function applyTierDiscount(
  price: number,
  discountPercentage: number
): number {
  return price * (1 - discountPercentage / 100);
}
```

```typescript
// src/utils/tierPricing.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTierDiscount, applyTierDiscount } from './tierPricing';

describe('calculateTierDiscount', () => {
  const tiers = [
    { minWeight: 0, maxWeight: 1, discountPercentage: 0 },
    { minWeight: 1.01, maxWeight: 3.5, discountPercentage: 5 },
    { minWeight: 3.51, maxWeight: 7, discountPercentage: 10 },
    { minWeight: 7.01, maxWeight: Infinity, discountPercentage: 15 },
  ];

  it('returns 0% for weight in first tier', () => {
    expect(calculateTierDiscount(0.5, tiers)).toBe(0);
    expect(calculateTierDiscount(1, tiers)).toBe(0);
  });

  it('returns 5% for weight in second tier', () => {
    expect(calculateTierDiscount(2, tiers)).toBe(5);
    expect(calculateTierDiscount(3.5, tiers)).toBe(5);
  });

  it('returns 10% for weight in third tier', () => {
    expect(calculateTierDiscount(5, tiers)).toBe(10);
    expect(calculateTierDiscount(7, tiers)).toBe(10);
  });

  it('returns 15% for weight in fourth tier', () => {
    expect(calculateTierDiscount(10, tiers)).toBe(15);
    expect(calculateTierDiscount(100, tiers)).toBe(15);
  });

  it('handles edge cases between tiers', () => {
    expect(calculateTierDiscount(1.01, tiers)).toBe(5);
    expect(calculateTierDiscount(3.51, tiers)).toBe(10);
    expect(calculateTierDiscount(7.01, tiers)).toBe(15);
  });
});

describe('applyTierDiscount', () => {
  it('applies discount correctly', () => {
    expect(applyTierDiscount(100, 10)).toBe(90);
    expect(applyTierDiscount(100, 5)).toBe(95);
    expect(applyTierDiscount(100, 0)).toBe(100);
  });

  it('handles decimal discounts', () => {
    expect(applyTierDiscount(100, 12.5)).toBe(87.5);
  });

  it('handles decimal prices', () => {
    expect(applyTierDiscount(99.99, 10)).toBeCloseTo(89.99, 2);
  });
});
```

---

## Writing Component Tests

Component tests validate React components in isolation, focusing on user interaction and rendering.

### Example: Testing UI Components

```typescript
// src/components/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click Me</Button>);

    const button = screen.getByText('Click Me');
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Click Me
      </Button>
    );

    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    expect(screen.getByText('Default')).toHaveClass('bg-primary');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByText('Outline')).toHaveClass('border');
  });
});
```

### Example: Testing Form Components

```typescript
// src/components/ProductForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductForm } from './ProductForm';

describe('ProductForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all form fields', () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('Product Name')).toBeInTheDocument();
    expect(screen.getByLabelText('SKU')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    // Submit empty form
    fireEvent.click(screen.getByText('Submit'));

    // Check for error messages
    await waitFor(() => {
      expect(screen.getByText('Product name is required')).toBeInTheDocument();
      expect(screen.getByText('SKU is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<ProductForm onSubmit={mockOnSubmit} />);

    // Fill in form
    await user.type(screen.getByLabelText('Product Name'), 'Test Product');
    await user.type(screen.getByLabelText('SKU'), 'TEST-001');
    await user.type(screen.getByLabelText('Price'), '100');
    await user.selectOptions(screen.getByLabelText('Category'), 'flower');

    // Submit form
    await user.click(screen.getByText('Submit'));

    // Verify onSubmit was called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Product',
        sku: 'TEST-001',
        price: 100,
        category: 'flower',
      });
    });
  });

  it('displays server errors', async () => {
    const mockOnSubmitWithError = vi
      .fn()
      .mockRejectedValue(new Error('SKU already exists'));

    render(<ProductForm onSubmit={mockOnSubmitWithError} />);

    // Fill and submit form
    await userEvent.type(screen.getByLabelText('SKU'), 'EXISTING-SKU');
    await userEvent.click(screen.getByText('Submit'));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('SKU already exists')).toBeInTheDocument();
    });
  });
});
```

### Example: Testing Components with Context

```typescript
// src/components/UserProfile.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProfile } from './UserProfile';

// Helper to render component with providers
function renderWithAuth(component: React.ReactElement, user = null) {
  return render(
    <AuthProvider value={{ user, login: vi.fn(), logout: vi.fn() }}>
      {component}
    </AuthProvider>
  );
}

describe('UserProfile', () => {
  it('displays user information when logged in', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      role: 'cashier',
      location: 'Bangkok Store',
    };

    renderWithAuth(<UserProfile />, mockUser);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('cashier')).toBeInTheDocument();
    expect(screen.getByText('Bangkok Store')).toBeInTheDocument();
  });

  it('displays login prompt when not logged in', () => {
    renderWithAuth(<UserProfile />, null);

    expect(screen.getByText('Please log in')).toBeInTheDocument();
  });
});
```

---

## Testing Supabase Integration

Testing code that interacts with Supabase requires mocking the Supabase client.

### Mocking Supabase Client

```typescript
// src/test/mocks/supabase.ts
import { vi } from 'vitest';

export const mockSupabaseClient = {
  from: vi.fn(() => mockSupabaseClient),
  select: vi.fn(() => mockSupabaseClient),
  insert: vi.fn(() => mockSupabaseClient),
  update: vi.fn(() => mockSupabaseClient),
  delete: vi.fn(() => mockSupabaseClient),
  eq: vi.fn(() => mockSupabaseClient),
  order: vi.fn(() => mockSupabaseClient),
  limit: vi.fn(() => mockSupabaseClient),
  single: vi.fn(() => Promise.resolve({ data: null, error: null })),
  then: vi.fn((resolve) =>
    Promise.resolve({ data: null, error: null }).then(resolve)
  ),
};

export function mockSupabase() {
  vi.mock('@/lib/supabase', () => ({
    supabase: mockSupabaseClient,
  }));
}
```

### Example: Testing Service Layer

```typescript
// src/services/productService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockSupabase, mockSupabaseClient } from '@/test/mocks/supabase';
import { getProducts, createProduct } from './productService';

// Mock Supabase before imports
mockSupabase();

describe('ProductService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('fetches products successfully', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 100 },
        { id: '2', name: 'Product 2', price: 200 },
      ];

      mockSupabaseClient.then.mockResolvedValueOnce({
        data: mockProducts,
        error: null,
      });

      const products = await getProducts();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('products');
      expect(mockSupabaseClient.select).toHaveBeenCalled();
      expect(products).toEqual(mockProducts);
    });

    it('handles errors correctly', async () => {
      const mockError = { message: 'Database error' };

      mockSupabaseClient.then.mockResolvedValueOnce({
        data: null,
        error: mockError,
      });

      await expect(getProducts()).rejects.toThrow('Database error');
    });

    it('filters products by location', async () => {
      const mockProducts = [{ id: '1', name: 'Product 1', location_id: '123' }];

      mockSupabaseClient.then.mockResolvedValueOnce({
        data: mockProducts,
        error: null,
      });

      await getProducts('123');

      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('location_id', '123');
    });
  });

  describe('createProduct', () => {
    it('creates product successfully', async () => {
      const newProduct = {
        name: 'New Product',
        sku: 'NEW-001',
        price: 150,
      };

      const createdProduct = { id: '123', ...newProduct };

      mockSupabaseClient.single.mockResolvedValueOnce({
        data: createdProduct,
        error: null,
      });

      const result = await createProduct(newProduct);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('products');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(newProduct);
      expect(result).toEqual(createdProduct);
    });

    it('handles unique constraint violation', async () => {
      const mockError = {
        code: '23505',
        message: 'duplicate key value violates unique constraint',
      };

      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: mockError,
      });

      await expect(
        createProduct({ name: 'Test', sku: 'EXISTING', price: 100 })
      ).rejects.toThrow('duplicate key');
    });
  });
});
```

---

## Testing Best Practices

### 1. Follow AAA Pattern

**Arrange, Act, Assert** structure:

```typescript
it('calculates total price correctly', () => {
  // Arrange: Set up test data
  const items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 },
  ];

  // Act: Execute the function
  const total = calculateTotal(items);

  // Assert: Verify the result
  expect(total).toBe(250);
});
```

### 2. Test Behavior, Not Implementation

```typescript
// Bad: Testing implementation details
it('calls setState with correct value', () => {
  const { result } = renderHook(() => useCounter());
  result.current.increment();
  expect(result.current.setState).toHaveBeenCalledWith(1);
});

// Good: Testing behavior
it('increments counter when increment is called', () => {
  const { result } = renderHook(() => useCounter());
  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
});
```

### 3. Use Descriptive Test Names

```typescript
// Bad: Vague test names
it('works correctly', () => {
  // ...
});

// Good: Descriptive test names
it('calculates tier discount for 3.5g flower order', () => {
  // ...
});

it('displays error message when SKU already exists', () => {
  // ...
});

it('disables submit button while form is submitting', () => {
  // ...
});
```

### 4. Test Edge Cases

```typescript
describe('calculateDiscount', () => {
  it('handles zero amount', () => {
    expect(calculateDiscount(0, 10)).toBe(0);
  });

  it('handles 100% discount', () => {
    expect(calculateDiscount(100, 100)).toBe(0);
  });

  it('handles negative discount (markup)', () => {
    expect(calculateDiscount(100, -10)).toBe(110);
  });

  it('handles decimal amounts', () => {
    expect(calculateDiscount(99.99, 10)).toBeCloseTo(89.99, 2);
  });
});
```

### 5. Keep Tests Independent

```typescript
// Bad: Tests depend on each other
describe('ShoppingCart', () => {
  const cart = new ShoppingCart();

  it('adds item to cart', () => {
    cart.addItem({ id: '1', name: 'Product', price: 100 });
    expect(cart.items).toHaveLength(1);
  });

  it('calculates total', () => {
    // This test depends on the previous test running first!
    expect(cart.total).toBe(100);
  });
});

// Good: Each test is independent
describe('ShoppingCart', () => {
  it('adds item to cart', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: '1', name: 'Product', price: 100 });
    expect(cart.items).toHaveLength(1);
  });

  it('calculates total', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: '1', name: 'Product', price: 100 });
    expect(cart.total).toBe(100);
  });
});
```

### 6. Use Test Fixtures

```typescript
// test/fixtures/products.ts
export const mockProducts = {
  flower: {
    id: '1',
    name: 'Premium Flower',
    sku: 'FLOWER-001',
    category: 'flower',
    price: 500,
    isTareWeightRequired: true,
  },
  edible: {
    id: '2',
    name: 'Cannabis Gummies',
    sku: 'EDIBLE-001',
    category: 'edible',
    price: 300,
    isTareWeightRequired: false,
  },
};

// Use in tests
import { mockProducts } from '@/test/fixtures/products';

it('applies tare weight for flower products', () => {
  const product = mockProducts.flower;
  expect(requiresTareWeight(product)).toBe(true);
});
```

---

## Coverage Requirements

### Coverage Targets

- **Business Logic** (utils/, services/): 80%+
- **React Components** (components/): 60%+
- **Overall Project**: 70%+

### Viewing Coverage

```bash
npm run test:coverage

# Open coverage report in browser
open apps/web/coverage/index.html
```

### Coverage Reports Include

- **Line Coverage**: Percentage of code lines executed
- **Branch Coverage**: Percentage of conditional branches tested
- **Function Coverage**: Percentage of functions called
- **Statement Coverage**: Percentage of statements executed

### Interpreting Coverage

```
File             | % Stmts | % Branch | % Funcs | % Lines
-----------------|---------|----------|---------|--------
All files        |   78.5  |   71.2   |   82.1  |   78.3
 utils/          |   92.1  |   88.5   |   95.2  |   91.8
  currency.ts    |   100   |   100    |   100   |   100
  tierPricing.ts |   88.2  |   80.0   |   90.0  |   87.5
 components/     |   68.3  |   62.1   |   72.5  |   68.1
  ProductCard.tsx|   75.0  |   66.7   |   80.0  |   75.0
```

**Focus on low coverage areas**:
- Red/uncovered lines indicate untested code
- Add tests for critical business logic first
- UI components may have lower coverage (acceptable for presentational components)

---

## Continuous Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm run test -- --run

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/web/coverage/coverage-final.json
```

---

## Summary

This testing guide provides a comprehensive approach to testing the CannaPOS Thailand application:

1. **Unit Tests**: Test pure functions and business logic
2. **Component Tests**: Test React components in isolation
3. **Integration Tests**: Test interactions with Supabase
4. **Coverage Goals**: Maintain 70%+ overall coverage
5. **Best Practices**: Follow AAA pattern, test behavior not implementation

For more information, see:
- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
