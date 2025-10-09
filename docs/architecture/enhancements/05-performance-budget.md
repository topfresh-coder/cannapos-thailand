# Performance Budget Enforcement - Enhancement Plan

**Status**: ⚠️ PARTIAL (75% compliance)
**Priority**: Must-fix before Epic 2
**Estimated Effort**: 1 day
**Author**: Winston (Architect)
**Date**: 2025-01-10

---

## Gap Analysis

### Current State
- Bundle target: <500KB gzipped (documented but not enforced)
- Page load target: <3s (documented but not enforced)
- **Critical Gap**: No CI/CD enforcement, no automated monitoring

---

## Enhancement Plan

### Bundle Size Check (Day 1 Morning)

**File**: `.github/workflows/ci.yml`
```yaml
performance-check:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: pnpm/action-setup@v2
    - uses: actions/setup-node@v3
    - run: pnpm install
    - run: pnpm build

    # Check bundle size
    - name: Check bundle size
      run: |
        BUNDLE_SIZE=$(du -sb apps/web/dist/*.js | awk '{sum+=$1} END {print sum}')
        MAX_SIZE=524288  # 500KB
        if [ $BUNDLE_SIZE -gt $MAX_SIZE ]; then
          echo "Bundle size $BUNDLE_SIZE exceeds $MAX_SIZE"
          exit 1
        fi
```

### Lighthouse CI (Day 1 Afternoon)

**File**: `lighthouserc.json`
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": ["http://localhost:5173"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

### Web Vitals Monitoring

**File**: `apps/web/src/lib/webVitals.ts`
```typescript
import { onCLS, onFID, onLCP } from 'web-vitals';

export function reportWebVitals() {
  onCLS(console.log);
  onFID(console.log);
  onLCP(console.log);

  // Send to analytics in production
  if (import.meta.env.PROD) {
    onLCP((metric) => {
      // Send to Vercel Analytics or Google Analytics
    });
  }
}
```

---

## Architecture Section Addition

```markdown
## Performance Budget

### Bundle Size Budget
- **Total JavaScript**: <500KB gzipped
- **CSS**: <50KB gzipped
- **Fonts**: <100KB
- **Enforcement**: CI/CD fails if exceeded

### Page Load Budget
- **First Contentful Paint (FCP)**: <1.8s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Time to Interactive (TTI)**: <3.0s
- **Cumulative Layout Shift (CLS)**: <0.1

### Monitoring
- Lighthouse CI on every PR
- Web Vitals tracked in production
- Performance dashboard in Vercel Analytics
```

---

## Validation Criteria
- [ ] Bundle size check added to CI/CD
- [ ] Lighthouse CI configured
- [ ] Web Vitals monitoring implemented
- [ ] Performance thresholds documented
