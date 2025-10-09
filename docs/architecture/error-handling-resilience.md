# Error Handling & Resilience

## Error Handling Philosophy

CannaPOS implements defense-in-depth error handling with graceful degradation. All errors are classified, logged, and presented with actionable recovery options. Network errors retry automatically with exponential backoff.

## Error Classification

### Error Types
1. **Validation Errors**: User input errors (handled at form level)
2. **Network Errors**: API failures, timeouts (retry with backoff)
3. **Business Logic Errors**: Inventory insufficient, shift already open
4. **System Errors**: Unexpected exceptions (error boundary, reload)

### Error Severity
- **INFO**: Informational (e.g., "Saved successfully")
- **WARNING**: Action required (e.g., "Low inventory")
- **ERROR**: Operation failed but recoverable (e.g., "Network timeout")
- **CRITICAL**: System failure, requires reload (e.g., "Database error")

## Error Handling Layers

### Layer 1: React ErrorBoundary
- Catches component render errors
- Displays fallback UI with reload option
- Logs to Sentry with component stack

**Example**:
```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

### Layer 2: API Error Interceptor
- Wraps all Supabase queries
- Maps PostgreSQL errors to AppError types
- Implements retry logic for transient failures

**Example**:
```typescript
export async function supabaseQuery<T>(queryFn) {
  const { data, error } = await queryFn();
  if (error) {
    if (error.code === '23505') {
      throw new BusinessLogicError('DUPLICATE_ENTRY', 'Entry already exists');
    }
    if (error.message.includes('timeout')) {
      throw new NetworkError(error.message);
    }
    throw new SystemError(error.message);
  }
  return data;
}
```

### Layer 3: Form Validation
- Zod schemas validate input client-side
- Display field-specific errors with ARIA
- Prevent invalid submissions

### Layer 4: Global Error Handler
- Catches unhandled promise rejections
- Logs to console (dev) and Sentry (prod)
- Shows toast notification

## Retry Strategy

### Network Errors (Exponential Backoff)
- **Max Attempts**: 3
- **Initial Delay**: 1 second
- **Backoff Multiplier**: 2x
- **Max Delay**: 10 seconds

**Retry Sequence**:
- Attempt 1: Immediate
- Attempt 2: Wait 1s
- Attempt 3: Wait 2s
- Attempt 4: Wait 4s (capped at 10s max)

### Non-Retryable Errors
- Validation errors (user input required)
- Authorization errors (permission denied)
- Duplicate entry errors (business logic violation)

## Error Messages

### User-Facing Principles
- **Clear**: Explain what happened in simple terms
- **Actionable**: Tell users what to do next
- **Friendly**: Avoid technical jargon

**Examples**:
- ✅ "Network connection error. Please check your internet."
- ❌ "Error: ECONNREFUSED at TCPConnectWrap.afterConnect"

- ✅ "Insufficient inventory. Only 10g available."
- ❌ "BusinessLogicError: Inventory allocation failed"

### Error Tracking
- Internal error codes (e.g., `INSUFFICIENT_INVENTORY`)
- Correlation IDs for tracing (e.g., `err_a3f9d2`)
- Logged to Sentry with full context

## Recovery Actions

### Automatic Recovery
- **Retry**: Network errors retry 3x automatically
- **Refresh Auth**: Token refresh on 401 errors
- **Reconnect**: WebSocket reconnects on disconnect

### Manual Recovery
- **Reload Page**: For system errors
- **Retry Operation**: For transient failures
- **Logout**: For authentication errors
- **Contact Support**: For critical errors with correlation ID

---
