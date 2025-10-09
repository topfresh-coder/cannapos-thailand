# Performance Budget

## Bundle Size Budget

- **Total JavaScript**: <500KB gzipped (enforced in CI/CD)
- **CSS**: <50KB gzipped
- **Fonts**: <100KB
- **Images**: Lazy loaded, WebP format preferred

**Enforcement**: CI/CD fails if bundle exceeds budget

**GitHub Actions Check**:
```yaml
- name: Check bundle size
  run: |
    BUNDLE_SIZE=$(du -sb apps/web/dist/*.js | awk '{sum+=$1} END {print sum}')
    MAX_SIZE=524288  # 500KB
    if [ $BUNDLE_SIZE -gt $MAX_SIZE ]; then
      echo "Bundle exceeds limit"
      exit 1
    fi
```

## Page Load Budget

**Core Web Vitals Targets**:
- **First Contentful Paint (FCP)**: <1.8s
- **Largest Contentful Paint (LCP)**: <2.5s (CRITICAL)
- **First Input Delay (FID)**: <100ms
- **Cumulative Layout Shift (CLS)**: <0.1
- **Time to Interactive (TTI)**: <3.0s

**Lighthouse CI Configuration** (`lighthouserc.json`):
```json
{
  "ci": {
    "collect": { "numberOfRuns": 3, "url": ["http://localhost:5173"] },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

## Monitoring

**Production Web Vitals**:
- Tracked via Vercel Analytics
- Real User Monitoring (RUM)
- Alerts on p75 degradation >10%

**Performance Dashboard**:
- LCP, FID, CLS trends (7-day, 30-day)
- Bundle size over time
- Lighthouse scores per deployment

---

**Architecture Document Version 1.1 - Enhanced**

**Created by**: Winston (Architect)
**Date**: January 10, 2025
**Updated**: January 10, 2025 (Added: Accessibility, Error Handling, Monitoring, Deployment, Performance Budget)
**Status**: Ready for Enhanced Development - Epic 1 Extended

---
