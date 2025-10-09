# Error Handling Architecture - Enhancement Plan

**Status**: ❌ CRITICAL GAP (30% compliance)
**Priority**: Must-fix before Epic 2
**Estimated Effort**: 2 days
**Author**: Winston (Architect)
**Date**: 2025-01-10

---

## Gap Analysis

### Current State
- **PRD Requirements**: "User-friendly error messages" (NFR20)
- **Architecture Coverage**: 30% - mentions ErrorBoundary component (line 1481) but no implementation strategy
- **Risk**: Poor UX during outages, data inconsistencies, revenue loss

### What's Missing from Architecture

#### 1. Error Classification Taxonomy (0%)
**Gap**: No standardized error types

**Required Coverage**:
- **Validation Errors**: User input errors (invalid email, negative quantity)
- **Network Errors**: API failures, timeouts, connection loss
- **Business Logic Errors**: Insufficient inventory, shift already open
- **System Errors**: Database errors, unexpected exceptions

#### 2. Centralized Error Handling (0%)
**Gap**: No error boundary or global error handler

**Required Coverage**:
- React ErrorBoundary for component crashes
- Axios interceptors for API errors
- Global error handler for unhandled promises
- Error logging with correlation IDs

#### 3. Error Recovery Flows (0%)
**Gap**: No retry logic or fallback strategies

**Required Coverage**:
- Retry logic for transient network failures
- Exponential backoff for rate limits
- Offline mode for network loss
- Error recovery actions (retry, cancel, go back)

#### 4. User-Facing Error Messages (20%)
**Gap**: No error message templates

**Current Coverage**:
- ⚠️ Toast notifications mentioned (line 1481) but no patterns
- ❌ No error message copy guidelines
- ❌ No error code system

---

## Enhancement Plan

### Phase 1: Error Architecture Design (Day 1 Morning)

#### 1.1 Error Classification System

**File**: `packages/shared-types/src/errors.ts`
```typescript
// Error Classification
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  SYSTEM = 'SYSTEM',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
}

export enum ErrorSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

// Base Error Class
export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public severity: ErrorSeverity,
    public code: string,
    public userMessage: string,
    public action?: 'retry' | 'reload' | 'logout' | 'contact_support',
    public metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Specific Error Classes
export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(
      message,
      ErrorType.VALIDATION,
      ErrorSeverity.WARNING,
      'VALIDATION_ERROR',
      message,
      undefined,
      { field }
    );
  }
}

export class NetworkError extends AppError {
  constructor(message: string, statusCode?: number) {
    super(
      message,
      ErrorType.NETWORK,
      ErrorSeverity.ERROR,
      'NETWORK_ERROR',
      'Network connection error. Please check your internet connection.',
      'retry',
      { statusCode }
    );
  }
}

export class BusinessLogicError extends AppError {
  constructor(message: string, code: string, userMessage: string) {
    super(
      message,
      ErrorType.BUSINESS_LOGIC,
      ErrorSeverity.WARNING,
      code,
      userMessage
    );
  }
}

export class SystemError extends AppError {
  constructor(message: string) {
    super(
      message,
      ErrorType.SYSTEM,
      ErrorSeverity.CRITICAL,
      'SYSTEM_ERROR',
      'An unexpected error occurred. Please try again later.',
      'reload',
      { timestamp: new Date().toISOString() }
    );
  }
}

// Error Codes
export const ERROR_CODES = {
  // Validation
  INVALID_INPUT: 'INVALID_INPUT',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',

  // Business Logic
  INSUFFICIENT_INVENTORY: 'INSUFFICIENT_INVENTORY',
  SHIFT_ALREADY_OPEN: 'SHIFT_ALREADY_OPEN',
  UNAUTHORIZED_OPERATION: 'UNAUTHORIZED_OPERATION',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',

  // Network
  CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT',
  SERVER_UNAVAILABLE: 'SERVER_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // System
  DATABASE_ERROR: 'DATABASE_ERROR',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
} as const;
```

#### 1.2 Error Handler Service

**File**: `apps/web/src/services/errorHandler.service.ts`
```typescript
import { AppError, ErrorSeverity, ErrorType } from '@cannapos/shared-types';
import { toast } from '@/components/ui/use-toast';

export class ErrorHandlerService {
  private static correlationId = () => Math.random().toString(36).substring(7);

  static handle(error: unknown, context?: string): void {
    const correlationId = this.correlationId();

    console.error(`[${correlationId}]`, context, error);

    // Convert unknown error to AppError
    const appError = this.normalizeError(error);

    // Log to external service (Sentry)
    this.logToExternal(appError, correlationId, context);

    // Show user-facing message
    this.showUserMessage(appError);
  }

  private static normalizeError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new SystemError(error.message);
    }

    if (typeof error === 'string') {
      return new SystemError(error);
    }

    return new SystemError('An unexpected error occurred');
  }

  private static logToExternal(
    error: AppError,
    correlationId: string,
    context?: string
  ): void {
    // Send to Sentry (Epic 1 Story 1.8)
    if (import.meta.env.PROD) {
      Sentry?.captureException(error, {
        tags: {
          type: error.type,
          severity: error.severity,
          code: error.code,
        },
        extra: {
          correlationId,
          context,
          metadata: error.metadata,
        },
      });
    }
  }

  private static showUserMessage(error: AppError): void {
    const variant = this.getToastVariant(error.severity);

    toast({
      variant,
      title: this.getErrorTitle(error.type),
      description: error.userMessage,
      action: error.action ? this.getErrorAction(error.action) : undefined,
    });
  }

  private static getToastVariant(
    severity: ErrorSeverity
  ): 'default' | 'destructive' {
    return severity === ErrorSeverity.CRITICAL || severity === ErrorSeverity.ERROR
      ? 'destructive'
      : 'default';
  }

  private static getErrorTitle(type: ErrorType): string {
    const titles: Record<ErrorType, string> = {
      [ErrorType.VALIDATION]: 'Invalid Input',
      [ErrorType.NETWORK]: 'Connection Error',
      [ErrorType.BUSINESS_LOGIC]: 'Operation Failed',
      [ErrorType.SYSTEM]: 'System Error',
      [ErrorType.AUTHENTICATION]: 'Authentication Error',
      [ErrorType.AUTHORIZATION]: 'Access Denied',
    };
    return titles[type];
  }

  private static getErrorAction(action: string) {
    switch (action) {
      case 'retry':
        return {
          altText: 'Retry',
          onClick: () => window.location.reload(),
        };
      case 'reload':
        return {
          altText: 'Reload Page',
          onClick: () => window.location.reload(),
        };
      case 'logout':
        return {
          altText: 'Logout',
          onClick: () => (window.location.href = '/login'),
        };
      case 'contact_support':
        return {
          altText: 'Contact Support',
          onClick: () => alert('Support: support@cannapos.com'),
        };
      default:
        return undefined;
    }
  }
}
```

---

### Phase 1: React Error Boundary (Day 1 Afternoon)

#### 1.3 Global Error Boundary Component

**File**: `apps/web/src/components/ErrorBoundary.tsx`
```typescript
import { Component, ReactNode } from 'react';
import { ErrorHandlerService } from '@/services/errorHandler.service';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    ErrorHandlerService.handle(error, `ErrorBoundary: ${errorInfo.componentStack}`);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try reloading the page.
            </p>
            <div className="space-x-4">
              <Button onClick={this.reset}>Try Again</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

### Phase 2: API Error Handling (Day 2 Morning)

#### 2.1 Supabase Client Interceptor

**File**: `apps/web/src/lib/supabase-client.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import { ErrorHandlerService } from '@/services/errorHandler.service';
import { NetworkError, BusinessLogicError } from '@cannapos/shared-types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Wrapper for Supabase queries with error handling
export async function supabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  const { data, error } = await queryFn();

  if (error) {
    // Map Supabase errors to AppError
    if (error.code === '23505') {
      // Unique constraint violation
      throw new BusinessLogicError(
        error.message,
        'DUPLICATE_ENTRY',
        'This entry already exists'
      );
    }

    if (error.code === 'PGRST116') {
      // Row-level security violation
      throw new BusinessLogicError(
        error.message,
        'UNAUTHORIZED_OPERATION',
        'You do not have permission to perform this action'
      );
    }

    // Network/connection errors
    if (error.message.includes('timeout') || error.message.includes('network')) {
      throw new NetworkError(error.message);
    }

    // Generic error
    throw new SystemError(error.message);
  }

  if (data === null) {
    throw new BusinessLogicError(
      'No data returned',
      'NO_DATA',
      'No data found'
    );
  }

  return data;
}
```

#### 2.2 Retry Logic with Exponential Backoff

**File**: `apps/web/src/utils/retry.ts`
```typescript
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
  } = options;

  let lastError: unknown;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * backoffMultiplier, maxDelay);
      }
    }
  }

  throw lastError;
}
```

---

### Phase 2: Form Validation Errors (Day 2 Afternoon)

#### 2.3 Form Error Display Component

**File**: `apps/web/src/components/FormErrorMessage.tsx`
```typescript
import { AlertCircle } from 'lucide-react';

interface FormErrorMessageProps {
  error?: string;
  id?: string;
}

export function FormErrorMessage({ error, id }: FormErrorMessageProps) {
  if (!error) return null;

  return (
    <div
      id={id}
      role="alert"
      className="flex items-center gap-2 text-sm text-red-600 mt-1"
    >
      <AlertCircle className="h-4 w-4" />
      <span>{error}</span>
    </div>
  );
}
```

#### 2.4 Zod Error Mapper

**File**: `apps/web/src/utils/zodErrorMapper.ts`
```typescript
import { ZodError } from 'zod';

export function mapZodErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });

  return errors;
}

// User-friendly error messages
export const errorMessages = {
  required: (field: string) => `${field} is required`,
  invalid: (field: string) => `${field} is invalid`,
  min: (field: string, min: number) => `${field} must be at least ${min}`,
  max: (field: string, max: number) => `${field} must be at most ${max}`,
  email: 'Please enter a valid email address',
  password: 'Password must be at least 8 characters',
  positive: (field: string) => `${field} must be greater than 0`,
};
```

---

## Architecture Section Addition

**Add to architecture.md after "API Design" section:**

```markdown
## Error Handling & Resilience

### Error Handling Philosophy
CannaPOS implements defense-in-depth error handling with graceful degradation. All errors are classified, logged, and presented to users with actionable recovery options. Network errors retry automatically with exponential backoff.

### Error Classification

#### Error Types
1. **Validation Errors**: User input errors (handled at form level)
2. **Network Errors**: API failures, timeouts (retry with backoff)
3. **Business Logic Errors**: Inventory insufficient, shift already open (user message)
4. **System Errors**: Unexpected exceptions (error boundary, reload)

#### Error Severity Levels
- **INFO**: Informational messages (e.g., "Saved successfully")
- **WARNING**: User action required (e.g., "Low inventory")
- **ERROR**: Operation failed but recoverable (e.g., "Network timeout")
- **CRITICAL**: System failure, requires reload (e.g., "Database error")

### Error Handling Layers

#### Layer 1: React Error Boundary
- Catches component render errors
- Displays fallback UI with reload option
- Logs to Sentry with component stack

#### Layer 2: API Error Interceptor
- Wraps all Supabase queries
- Maps PostgreSQL errors to AppError types
- Implements retry logic for transient failures

#### Layer 3: Form Validation
- Zod schemas validate input client-side
- Display field-specific errors with ARIA
- Prevent invalid submissions

#### Layer 4: Global Error Handler
- Catches unhandled promise rejections
- Logs to console (dev) and Sentry (prod)
- Shows toast notification

### Retry Strategy

#### Network Errors (Exponential Backoff)
- **Max Attempts**: 3
- **Initial Delay**: 1 second
- **Backoff Multiplier**: 2x
- **Max Delay**: 10 seconds

Example:
- Attempt 1: Immediate
- Attempt 2: Wait 1s
- Attempt 3: Wait 2s
- Attempt 4: Wait 4s (up to max 10s)

#### Non-Retryable Errors
- Validation errors (user input required)
- Authorization errors (permission denied)
- Duplicate entry errors (business logic violation)

### Error Messages

#### User-Facing Messages
- **Clear**: Explain what happened in simple terms
- **Actionable**: Tell users what to do next
- **Friendly**: Avoid technical jargon

Examples:
- ✅ "Network connection error. Please check your internet connection."
- ❌ "Error: ECONNREFUSED at TCPConnectWrap.afterConnect"

- ✅ "Insufficient inventory. Only 10g available."
- ❌ "BusinessLogicError: Inventory allocation failed"

#### Error Codes
- Internal error codes for debugging (e.g., `INSUFFICIENT_INVENTORY`)
- Correlation IDs for tracing (e.g., `err_a3f9d2`)
- Logged to Sentry with full context

### Recovery Actions

#### Automatic Recovery
- **Retry**: Network errors retry 3x automatically
- **Refresh Auth**: Token refresh on 401 errors
- **Reconnect**: WebSocket reconnects on disconnect

#### Manual Recovery
- **Reload Page**: For system errors
- **Retry Operation**: For transient failures
- **Logout**: For authentication errors
- **Contact Support**: For critical errors with correlation ID
```

---

## Validation Criteria

### Before Marking Complete
- [ ] Error classification taxonomy defined
- [ ] AppError base class and specific error classes created
- [ ] ErrorHandlerService with correlation IDs implemented
- [ ] React ErrorBoundary with fallback UI created
- [ ] Supabase query wrapper with error mapping
- [ ] Retry logic with exponential backoff
- [ ] Form error display components
- [ ] Architecture section "Error Handling & Resilience" added

### Success Metrics
- ✅ All errors logged with correlation IDs
- ✅ Network errors retry automatically
- ✅ User-facing error messages are clear and actionable
- ✅ System errors caught by ErrorBoundary
- ✅ Error tracking integrated with Sentry

---

## Timeline Impact
- **If addressed now**: 2 days, no timeline impact
- **If deferred**: 3-5 days post-pilot + production incidents

---

## References
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Exponential Backoff Algorithm](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- [Sentry Error Tracking](https://docs.sentry.io/platforms/javascript/guides/react/)
