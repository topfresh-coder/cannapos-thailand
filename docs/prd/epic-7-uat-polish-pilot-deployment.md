# Epic 7: UAT, Polish & Pilot Deployment

**Goal**: Complete end-to-end testing, performance optimization, create training materials, and successfully deploy to first pilot location with post-deployment support to ensure production readiness.

## Story 7.1: End-to-End UAT Test Plan & Execution

As a **QA lead**,
I want **a comprehensive UAT test plan covering all critical user journeys**,
so that **production deployment risk is minimized**.

### Acceptance Criteria

1. UAT test plan document created covering:
   - Complete POS transaction flow (search → add to cart → tare weight → tiered pricing → checkout)
   - Shift reconciliation workflow (open → transactions → close → manager approval)
   - Inventory management (batch receiving → FIFO allocation → stock count)
   - All 10 MVP reports generation and accuracy
   - Multi-user concurrent access scenarios
2. Test cases include: happy paths, edge cases, error scenarios, boundary conditions
3. Test data set created with realistic product catalog, batches, and historical transactions
4. UAT execution checklist with pass/fail status tracking
5. Bug tracking process established (severity levels, resolution workflow)
6. Acceptance criteria: Zero critical bugs, <5 medium bugs, all core flows validated
7. UAT sign-off required from: Store Manager, Cashier Representative, Owner

## Story 7.2: Performance Optimization & Load Testing

As a **developer**,
I want **to optimize application performance and validate it meets NFRs**,
so that **the system performs well under real-world usage**.

### Acceptance Criteria

1. Performance testing executed for:
   - Page load times (target: <3s on 4G network per NFR1)
   - Transaction completion time (target: <90s per NFR2)
   - Report generation time (target: <5s for standard date ranges)
   - Concurrent user load (target: 5 simultaneous users without degradation)
2. Performance bottlenecks identified and resolved:
   - Database query optimization (indexes, query complexity)
   - Bundle size reduction (code splitting, lazy loading)
   - Image optimization (compression, lazy loading)
   - API response time optimization
3. Lighthouse performance audit score >85
4. Browser DevTools performance profiling completed
5. Supabase query performance analyzed via dashboard
6. Performance test results documented with before/after metrics
7. All NFR performance targets met and validated

## Story 7.3: Mobile & Tablet Responsiveness Polish

As a **UX designer**,
I want **to ensure optimal mobile/tablet experience across all screens**,
so that **cashiers can efficiently use the system on tablets**.

### Acceptance Criteria

1. All screens tested on target devices: iPad (10.2"), Android tablet (10"), iPhone (responsive fallback)
2. Touch targets minimum 44px × 44px per accessibility guidelines
3. Forms optimized for mobile: appropriate keyboard types (numeric for amounts, text for names)
4. POS cart drawer/sidebar optimized for split-screen tablet use
5. Stock count interface optimized for one-handed tablet operation
6. Navigation menu collapses appropriately on smaller screens
7. Product search results display in grid view on tablets (not table)
8. Reports include mobile-optimized views (cards instead of wide tables)
9. Orientation support: Portrait and landscape modes work correctly
10. Cross-browser testing: Safari (iOS), Chrome (Android/Desktop), Edge

## Story 7.4: Accessibility Compliance (WCAG AA)

As a **developer**,
I want **to ensure the application meets WCAG AA accessibility standards**,
so that **the system is usable by all staff members**.

### Acceptance Criteria

1. Keyboard navigation fully functional across all screens (tab order logical)
2. Focus indicators visible and clear for all interactive elements
3. Color contrast ratios meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
4. Form inputs have associated labels (visible or aria-label)
5. Error messages announced to screen readers (aria-live regions)
6. Images have alt text (or decorative images marked as such)
7. Semantic HTML used throughout (heading hierarchy, landmarks)
8. Automated accessibility audit (axe DevTools) shows zero violations
9. Manual screen reader testing (NVDA/VoiceOver) for critical flows
10. Skip to main content link for keyboard users

## Story 7.5: User Training Materials & Documentation

As a **store owner**,
I want **comprehensive training materials for staff**,
so that **adoption is smooth and users are confident using the system**.

### Acceptance Criteria

1. User guide created covering:
   - Getting started (login, navigation)
   - POS transaction workflow (step-by-step with screenshots)
   - Tare weight procedure
   - Shift reconciliation process
   - Product and batch management
   - Running reports
   - Troubleshooting common issues
2. Quick reference cards (1-page printable):
   - POS cheat sheet for cashiers
   - Shift close procedure
   - Weekly stock count checklist
3. Video tutorials (3-5 minutes each):
   - Complete POS transaction demo
   - Shift reconciliation walkthrough
   - Stock count procedure
4. In-app help tooltips for complex features (tier pricing, FIFO, tare weight)
5. FAQ document addressing common questions
6. Training materials available in English (Thai translation for future phase)
7. Materials hosted in accessible location (docs site or in-app help section)

## Story 7.6: Data Migration & Seeding for Pilot

As a **developer**,
I want **to prepare production database with pilot location data**,
so that **the pilot location can start using the system immediately**.

### Acceptance Criteria

1. Production Supabase project created with environment variables configured
2. Database migrations executed on production database
3. Pilot location data seeded:
   - Location record (name, address, configuration)
   - User accounts (manager, 2-3 cashiers) with passwords securely distributed
   - Product catalog (20-30 real products with SKUs, names, categories, pricing)
   - Initial product batches (realistic quantities and costs)
   - Pricing tiers configured per pilot location's structure
4. RLS policies enabled and tested on production
5. Data validation: All required fields populated, relationships intact
6. Backup of production database taken before pilot launch
7. Rollback plan documented in case of critical issues

## Story 7.7: Production Deployment & Monitoring Setup

As a **DevOps engineer**,
I want **to deploy the application to production with monitoring in place**,
so that **issues can be detected and resolved quickly**.

### Acceptance Criteria

1. Production deployment to Vercel completed with custom domain (if applicable)
2. Environment variables configured in Vercel (Supabase production keys)
3. SSL certificate active and HTTPS enforced
4. Error monitoring configured (Sentry or similar) for client-side and API errors
5. Uptime monitoring configured (UptimeRobot or similar) with alerts to team
6. Supabase logging and monitoring reviewed (query performance, error logs)
7. Production health check endpoint created and monitored
8. Deployment runbook documented (steps, rollback procedure)
9. On-call rotation established for pilot period (weeks 1-2)
10. Smoke tests executed post-deployment: login, POS transaction, report generation

## Story 7.8: Pilot Launch & On-Site Support

As a **product manager**,
I want **to be present for pilot launch and provide on-site support**,
so that **initial issues are resolved immediately and users feel supported**.

### Acceptance Criteria

1. Pilot launch plan created:
   - Go-live date and time
   - On-site support team (PM, developer, trainer)
   - Communication plan (pilot users, stakeholders)
   - Success criteria for pilot period
2. On-site training session conducted day before go-live (2-3 hours):
   - Hands-on POS training for cashiers
   - Manager training on reports and reconciliation
   - Q&A session
3. Go-live day support:
   - On-site presence for first full shift
   - Shadow cashiers during initial transactions
   - Real-time issue resolution
   - Positive reinforcement and encouragement
4. Feedback collection mechanism established (daily check-ins, issue log)
5. Pilot period defined: 2 weeks of intensive monitoring
6. Daily stand-ups with pilot users during week 1

## Story 7.9: Post-Pilot Feedback Collection & Iteration

As a **product manager**,
I want **to systematically collect and act on pilot feedback**,
so that **the product evolves based on real user needs**.

### Acceptance Criteria

1. Feedback collection methods:
   - Daily check-in calls with manager (week 1)
   - End-of-shift surveys for cashiers (Google Form or in-app)
   - Weekly retrospective meeting with all pilot users
   - Issue log for bugs and feature requests
2. Feedback categorized by: bugs, usability issues, feature requests, training gaps
3. Priority ranking: P0 (blocker), P1 (high impact), P2 (nice-to-have)
4. P0 and P1 issues addressed within 48 hours
5. Iteration plan created for post-pilot improvements (weeks 13-14)
6. Success metrics reviewed vs targets from Project Brief:
   - Shrinkage reduction (target: 3-8% → <2%)
   - Pricing error reduction (target: 15-20% → <5%)
   - Transaction time (target: <90 seconds)
   - Shift reconciliation variance (target: <1%)
7. Case study draft documenting pilot results and testimonials

## Story 7.10: Production Hardening & Scale Preparation

As a **technical lead**,
I want **to harden the production system for broader rollout**,
so that **expansion to additional locations is smooth**.

### Acceptance Criteria

1. Production environment reviewed for scalability:
   - Database connection pooling optimized
   - API rate limiting configured
   - Supabase plan sufficient for additional locations
   - Vercel deployment plan supports traffic growth
2. Security hardening:
   - RLS policies audit completed
   - API endpoints secured (no unauthorized access)
   - Sensitive data encrypted (passwords hashed, PII protected)
   - OWASP Top 10 vulnerabilities reviewed
3. Backup and disaster recovery:
   - Automated daily database backups configured
   - Backup restoration tested successfully
   - Disaster recovery runbook documented
4. Multi-location readiness:
   - Data isolation verified (locations cannot see each other's data except dashboard)
   - Location-specific configuration working correctly
   - User role permissions validated across locations
5. Documentation finalized:
   - Technical architecture document
   - Deployment procedures
   - Maintenance and support guide
6. Production runbook created covering: common issues, escalation paths, emergency contacts
7. Knowledge transfer session conducted with support team

---
