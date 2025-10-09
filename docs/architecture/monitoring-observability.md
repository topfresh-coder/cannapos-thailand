# Monitoring & Observability

## Monitoring Philosophy

CannaPOS implements comprehensive monitoring to detect issues before users report them. All errors are tracked, performance is measured, and alerts trigger on threshold violations.

## Monitoring Stack

- **Error Tracking**: Sentry (mandatory, not optional)
- **Frontend Analytics**: Vercel Analytics + Web Vitals
- **Backend Metrics**: Supabase Dashboard (query logs, connection pool)
- **Logs**: Structured logging with correlation IDs

## Alert Thresholds

### System Health Alerts
- **Uptime**: <99% (24-hour window) → Page on-call
- **Error Rate**: >1% (5-minute window) → Slack alert
- **Latency**: p95 >3s → Slack alert
- **Critical Errors**: Any instance → Immediate page

### Infrastructure Alerts
- **Database CPU**: >80% → Warning
- **Connection Pool**: >90% utilized → Critical
- **Slow Queries**: >5s execution time → Warning

## Key Metrics

### Business Metrics
1. **Transactions per hour** (target: 5-20/hour/location)
2. **Average transaction value** (baseline ฿500-2000)
3. **Shift variance frequency** (target: <10% of shifts >฿50 variance)
4. **Inventory allocation errors** (target: 0)

### Technical Metrics
1. **Error rate** (%) - target <0.5%
2. **API latency** (p50, p95, p99) - target p95 <1s
3. **Page load time** (LCP) - target <2.5s
4. **Transaction completion rate** - target >99%

### System Health
1. **Database connections** (monitor pool utilization)
2. **Cache hit rate** (target >80% for products/tiers)
3. **Real-time connections** (WebSocket subscriptions)

## Structured Logging

**Log Format**:
```json
{
  "timestamp": "2025-01-10T10:30:00Z",
  "level": "error",
  "correlationId": "err_a3f9d2",
  "userId": "uuid",
  "locationId": "uuid",
  "message": "FIFO allocation failed",
  "error": { "code": "INSUFFICIENT_INVENTORY", "details": {} }
}
```

**Log Levels**:
- **DEBUG**: Development only (not in production)
- **INFO**: Normal operations (transaction created, shift opened)
- **WARN**: Potential issues (low inventory, high variance)
- **ERROR**: Operation failures (network timeout, allocation failed)
- **CRITICAL**: System failures (database error, auth service down)

## Operational Dashboard

**Real-Time Metrics** (refresh every 30s):
- Current shift status per location
- Transactions in last hour
- Error count (last 5 minutes)
- Active users

**Historical Trends** (configurable date range):
- Revenue by day/week/month
- Error rate trends
- Performance metrics (LCP, FID, CLS)
- Shift variance patterns

---
