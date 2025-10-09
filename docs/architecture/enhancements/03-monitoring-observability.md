# Monitoring & Observability - Enhancement Plan

**Status**: ⚠️ PARTIAL (50% compliance)
**Priority**: Must-fix before Epic 2
**Estimated Effort**: 2 days
**Author**: Winston (Architect)
**Date**: 2025-01-10

---

## Gap Analysis

### Current State
- Frontend: Vercel Analytics (basic)
- Backend: Supabase Dashboard (query logs only)
- Error Tracking: Sentry "optional" (Epic 7)
- **Critical Gap**: No alert thresholds, no operational dashboards, no structured logging

---

## Enhancement Plan

### Make Sentry Mandatory (Day 1)

**File**: `apps/web/src/lib/sentry.ts`
```typescript
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD,
  tracesSampleRate: 0.1, // 10% of transactions
  integrations: [
    new BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Alert Thresholds (Day 1)

**Sentry Alerts**:
- Error rate >1% (5-minute window)
- p95 latency >3s
- Uptime <99% (24-hour window)
- Critical errors (any instance)

**Supabase Alerts**:
- Database CPU >80%
- Connection pool >90% utilized
- Slow queries >5s

### Operational Dashboard (Day 2)

**Metrics to Track**:
1. **Business Metrics**
   - Transactions per hour
   - Average transaction value
   - Shift variance

2. **Technical Metrics**
   - Error rate (%)
   - API latency (p50, p95, p99)
   - Page load time

3. **System Health**
   - Database connections
   - Cache hit rate
   - Real-time connections

**Implementation**: Vercel Analytics + custom metrics via Supabase function

---

## Architecture Section Addition

```markdown
## Monitoring & Observability

### Monitoring Stack
- **Error Tracking**: Sentry (mandatory)
- **Frontend Analytics**: Vercel Analytics + Web Vitals
- **Backend Metrics**: Supabase Dashboard
- **Logs**: Structured logging with correlation IDs

### Alert Thresholds
- **Uptime**: <99% (24-hour)
- **Error Rate**: >1% (5-minute window)
- **Latency**: p95 >3s
- **Critical Errors**: Any instance

### Key Metrics
1. Transaction completion rate
2. Shift variance frequency
3. Inventory allocation errors
4. Page load time (LCP, FID, CLS)
```

---

## Validation Criteria
- [ ] Sentry integrated and mandatory
- [ ] Alert thresholds configured
- [ ] Operational dashboard defined
- [ ] Structured logging implemented
