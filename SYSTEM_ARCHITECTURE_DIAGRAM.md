# Master Story Implementation System - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    USER (You)                                           │
│  "Implement Story 1.6 using Master Story Implementation Protocol"      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    JAMES (Full Stack Developer Agent)                   │
│                    Model: claude-sonnet-4-5-20250929                    │
│                                                                         │
│  Phase 0: Initialization                                               │
│  ├─ Read story document (1.6.cart-management-*.md)                    │
│  ├─ Load architecture docs (tech-stack, data-models, etc.)            │
│  ├─ ByteRover: Search existing patterns                               │
│  └─ Context7: Fetch library docs (as needed)                          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Phase 1: Planning                                                      │
│  ├─ Create TodoWrite list (12 tasks)                                   │
│  ├─ Update story status: Draft → InProgress                            │
│  └─ Identify parallel execution opportunities                          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Phase 2: Parallel Task Execution (SINGLE MESSAGE, MULTIPLE AGENTS)    │
│                                                                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│  │  database-       │  │  supabase-       │  │  react-          │    │
│  │  architect       │  │  backend-        │  │  component-      │    │
│  │                  │  │  architect       │  │  architect       │    │
│  │  Task: Migration │  │  Task: Service   │  │  Task: UI        │    │
│  │  - Schema        │  │  - API layer     │  │  - Components    │    │
│  │  - Indexes       │  │  - Error handle  │  │  - Routing       │    │
│  │  - RLS policies  │  │  - Type safety   │  │  - Props         │    │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘    │
│                                                                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│  │  state-          │  │  business-       │  │  ui-ux-          │    │
│  │  management-     │  │  logic-          │  │  accessibility-  │    │
│  │  architect       │  │  specialist      │  │  specialist      │    │
│  │                  │  │                  │  │                  │    │
│  │  Task: Store     │  │  Task: Logic     │  │  Task: Styling   │    │
│  │  - Zustand       │  │  - Calculations  │  │  - Tailwind      │    │
│  │  - Actions       │  │  - Validations   │  │  - shadcn/ui     │    │
│  │  - Persistence   │  │  - Algorithms    │  │  - WCAG 2.1 AA   │    │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘    │
│                                                                         │
│  All agents use MCP tools:                                             │
│  ├─ Context7: Fetch library docs (/shadcn-ui/ui, /pmndrs/zustand)    │
│  └─ ByteRover: Search existing patterns in codebase                   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                   ▼──────────────────────────▼
                   │                          │
                   │  Wait for ALL agents     │
                   │  to complete             │
                   │                          │
                   ▼──────────────────────────▼
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Phase 3: Integration & Testing (SEQUENTIAL)                           │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  react-frontend-architect                                       │  │
│  │  Task: Integrate all components                                 │  │
│  │  - Wire service → store                                         │  │
│  │  - Connect store → components                                   │  │
│  │  - Add routing + error boundaries                               │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  qa-testing-engineer                                            │  │
│  │  Task: Write comprehensive test suite                           │  │
│  │  - Unit tests (≥80% coverage)                                   │  │
│  │  - Component tests (RTL + Vitest)                               │  │
│  │  - Integration tests (Supabase)                                 │  │
│  │  - Accessibility tests (axe-core, zero violations)              │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  Playwright MCP - E2E Testing                                   │  │
│  │  Task: Test UI in real browser with screenshots                 │  │
│  │  - Desktop (1920x1080)                                          │  │
│  │  - Tablet (1024x768)                                            │  │
│  │  - Mobile (375x667)                                             │  │
│  │  - Keyboard navigation + accessibility                          │  │
│  │  - Save screenshots to docs/qa/{STORY_ID}-screenshots/          │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Phase 4: Quality Assurance                                             │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  devops-deployment-engineer                                     │  │
│  │  Task: Validate build & quality gates                           │  │
│  │  - pnpm run type-check (TypeScript: 0 errors)                   │  │
│  │  - pnpm run lint (ESLint: 0 errors)                             │  │
│  │  - pnpm vitest run (Tests: 100% pass rate)                      │  │
│  │  - pnpm run build (Build: Success, bundle < 500KB)              │  │
│  │  - Regression check (previous stories still work)               │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Phase 5: Story Completion                                              │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  technical-documentation-writer                                 │  │
│  │  Task: Update story document                                    │  │
│  │  - Fill Dev Agent Record section                                │  │
│  │  - List all files created/modified                              │  │
│  │  - Document key decisions                                       │  │
│  │  - Change status: InProgress → Review                           │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  ByteRover MCP - Store Knowledge                                │  │
│  │  Task: Save patterns for future stories                         │  │
│  │  - Zustand store pattern                                        │  │
│  │  - Supabase service pattern                                     │  │
│  │  - React component pattern                                      │  │
│  │  - Testing pattern                                              │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  Git Commit                                                     │  │
│  │  Task: Create commit with proper message                        │  │
│  │  - git add .                                                    │  │
│  │  - git commit -m "Complete Story {ID} - {Title}..."            │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    SUMMARY REPORT TO USER                               │
│                                                                         │
│  ✅ Story {STORY_ID} Implementation Complete                           │
│  ✅ All acceptance criteria validated                                  │
│  ✅ Test coverage: 87% (target ≥80%)                                   │
│  ✅ Accessibility: 0 violations (WCAG 2.1 AA)                          │
│  ✅ Build status: Success                                              │
│  ✅ Git commit: abc1234                                                │
│  ✅ Story status: Review (awaiting QA validation)                      │
│                                                                         │
│  📸 Screenshots saved: docs/qa/{STORY_ID}-screenshots/                 │
│  📝 Story document: docs/stories/{STORY_ID}.*.md                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## MCP Tools Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       MCP TOOLS ECOSYSTEM                               │
└─────────────────────────────────────────────────────────────────────────┘

┌───────────────────────┐
│   Context7 MCP        │
│   (Library Docs)      │
├───────────────────────┤
│                       │
│  Input:               │
│  - libraryName        │
│  - topic              │
│                       │
│  Output:              │
│  - Up-to-date docs    │
│  - Code examples      │
│  - Best practices     │
│                       │
│  Used by:             │
│  ✓ All sub-agents     │
│  ✓ When needed        │
└───────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Libraries Used in Project:        │
│  - /shadcn-ui/ui                   │
│  - /pmndrs/zustand                 │
│  - /remix-run/react-router         │
│  - /supabase/supabase-js           │
│  - /testing-library/react          │
│  - /vitest-dev/vitest              │
└─────────────────────────────────────┘

┌───────────────────────┐
│   ByteRover MCP       │
│   (Codebase Search)   │
├───────────────────────┤
│                       │
│  Actions:             │
│  1. retrieve-knowledge│
│     - Search patterns │
│     - Find examples   │
│                       │
│  2. store-knowledge   │
│     - Save patterns   │
│     - Document learnings│
│                       │
│  Used by:             │
│  ✓ Phase 0 (init)     │
│  ✓ All sub-agents     │
│  ✓ Phase 5 (store)    │
└───────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Knowledge Stored:                 │
│  - Cart store patterns             │
│  - Service layer patterns          │
│  - Component patterns              │
│  - Testing patterns                │
│  - Architectural decisions         │
└─────────────────────────────────────┘

┌───────────────────────┐
│   Playwright MCP      │
│   (Browser Testing)   │
├───────────────────────┤
│                       │
│  Actions:             │
│  - browser_navigate   │
│  - browser_resize     │
│  - browser_snapshot   │
│  - browser_click      │
│  - browser_type       │
│  - browser_screenshot │
│  - browser_close      │
│                       │
│  Used in:             │
│  ✓ Phase 3 (E2E tests)│
└───────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Test Viewports:                   │
│  - Desktop: 1920 × 1080            │
│  - Tablet:  1024 × 768             │
│  - Mobile:   375 × 667             │
│                                    │
│  Screenshots saved to:             │
│  docs/qa/{STORY_ID}-screenshots/   │
└─────────────────────────────────────┘
```

---

## Parallel Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PARALLEL EXECUTION STRATEGY                          │
└─────────────────────────────────────────────────────────────────────────┘

Phase 2: Launch ALL agents in SINGLE MESSAGE

Time: T0 (Start)
│
├─► database-architect          ┐
│   - Create migration          │
│   - Add indexes               │
│   - RLS policies              │
│                               │
├─► supabase-backend-architect  ├─► ALL RUN IN PARALLEL
│   - Create service layer      │   (Max efficiency)
│   - API methods               │
│   - Error handling            │
│                               │
├─► react-component-architect   │
│   - Create components         │
│   - Add routing               │
│   - Props interfaces          │
│                               │
├─► state-management-architect  │
│   - Create Zustand store      │
│   - Actions + state           │
│   - Unit tests                │
│                               │
├─► business-logic-specialist   │
│   - Calculations              │
│   - Validations               │
│   - Pure functions            │
│                               │
└─► ui-ux-accessibility-specialist│
    - Tailwind styling          │
    - shadcn/ui components      │
    - WCAG 2.1 AA compliance    ┘

Time: T1 (All agents complete)
│
▼ WAIT FOR ALL TO FINISH
│
▼ Then proceed to Phase 3: Integration

Benefits:
✓ Reduces implementation time by ~50%
✓ Maximizes Claude Code efficiency
✓ No dependencies between parallel tasks
✓ Each agent works independently
```

---

## Story Status Lifecycle

```
┌──────────┐      User starts     ┌────────────┐
│  Draft   │ ──────implementation──▶│ InProgress │
└──────────┘                        └────────────┘
     │                                    │
     │ Created by Bob                     │ James working
     │ (Scrum Master)                     │ (Dev Agent)
     ▼                                    ▼
                               ┌────────────────┐
                               │  Phase 0-5     │
                               │  Implementation│
                               └────────────────┘
                                        │
                                        │ All tasks done
                                        │ Tests pass
                                        │ Build succeeds
                                        ▼
                               ┌────────────────┐
                               │    Review      │
                               └────────────────┘
                                        │
                                        │ QA validates
                                        │ All AC pass
                                        ▼
                               ┌────────────────┐
                               │     Done       │
                               └────────────────┘
                                        │
                                        │ Production ready
                                        ▼
```

---

## File System Changes After Implementation

```
Before Implementation:                After Implementation:
════════════════════                  ═══════════════════════

docs/stories/                         docs/stories/
├─ 1.6.*.md                           ├─ 1.6.*.md (UPDATED)
   Status: Draft                         Status: Review ✓
   Dev Agent Record: Empty               Dev Agent Record: FILLED ✓

apps/web/src/                         apps/web/src/
├─ stores/                            ├─ stores/
│  └─ [empty]                         │  ├─ cartStore.ts (NEW) ✓
                                      │  └─ cartStore.test.ts (NEW) ✓
├─ services/                          ├─ services/
│  └─ [existing]                      │  ├─ [existing]
                                      │  └─ inventory.service.ts (NEW) ✓
├─ components/                        ├─ components/
│  └─ pos/                            │  └─ pos/
│     └─ [existing]                   │     ├─ [existing]
                                      │     ├─ CartItem.tsx (UPDATED) ✓
                                      │     └─ CartItem.test.tsx (NEW) ✓

supabase/migrations/                  supabase/migrations/
└─ [existing]                         ├─ [existing]
                                      └─ 20250114_cart_inventory.sql (NEW) ✓

docs/qa/                              docs/qa/
└─ [existing screenshots]             ├─ [existing screenshots]
                                      └─ 1.6-screenshots/ (NEW) ✓
                                         ├─ 01-desktop-1920px.png
                                         ├─ 02-tablet-1024px.png
                                         └─ 03-mobile-375px.png

.ai/                                  .ai/
└─ debug-log.md                       └─ debug-log.md (UPDATED) ✓

Git commits:                          Git commits:
abc1234 (previous)                    def5678 Complete Story 1.6 - ... (NEW) ✓
```

---

## Quality Gates

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         QUALITY GATES                                   │
│                  (All must PASS before Review status)                   │
└─────────────────────────────────────────────────────────────────────────┘

Gate 1: TypeScript Compilation
├─ Command: pnpm run type-check
├─ Target: 0 errors
└─ Status: ✅ PASS / ❌ FAIL

Gate 2: Code Linting
├─ Command: pnpm run lint
├─ Target: 0 errors, 0 warnings
└─ Status: ✅ PASS / ❌ FAIL

Gate 3: Test Suite
├─ Command: pnpm vitest run
├─ Target: 100% pass rate, ≥80% coverage
└─ Status: ✅ PASS / ❌ FAIL

Gate 4: Accessibility
├─ Tool: axe-core (vitest-axe)
├─ Target: 0 violations (WCAG 2.1 AA)
└─ Status: ✅ PASS / ❌ FAIL

Gate 5: Production Build
├─ Command: pnpm run build
├─ Target: Success, bundle < 500KB
└─ Status: ✅ PASS / ❌ FAIL

Gate 6: E2E Testing
├─ Tool: Playwright MCP
├─ Target: All user flows work, screenshots captured
└─ Status: ✅ PASS / ❌ FAIL

Gate 7: Regression Testing
├─ Check: Previous stories still work
├─ Target: No regressions detected
└─ Status: ✅ PASS / ❌ FAIL

All gates PASS ✅ → Story status can be updated to Review
Any gate FAIL ❌ → Fix issues before updating status
```

---

## Time Estimation (per story complexity)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    IMPLEMENTATION TIME ESTIMATES                        │
└─────────────────────────────────────────────────────────────────────────┘

Simple Story (e.g., UI-only changes)
├─ Phase 0: 2 minutes  (context loading)
├─ Phase 1: 2 minutes  (planning)
├─ Phase 2: 5 minutes  (parallel execution, 2-3 agents)
├─ Phase 3: 8 minutes  (integration + testing)
├─ Phase 4: 3 minutes  (QA + build)
└─ Phase 5: 3 minutes  (documentation + commit)
   Total: ~23 minutes

Medium Story (e.g., Story 1.6 - Cart Management)
├─ Phase 0: 3 minutes  (context loading)
├─ Phase 1: 3 minutes  (planning)
├─ Phase 2: 10 minutes (parallel execution, 4-5 agents)
├─ Phase 3: 15 minutes (integration + testing)
├─ Phase 4: 5 minutes  (QA + build)
└─ Phase 5: 4 minutes  (documentation + commit)
   Total: ~40 minutes

Complex Story (e.g., FIFO allocation engine)
├─ Phase 0: 5 minutes  (context loading)
├─ Phase 1: 5 minutes  (planning)
├─ Phase 2: 20 minutes (parallel execution, 6+ agents)
├─ Phase 3: 30 minutes (integration + testing)
├─ Phase 4: 8 minutes  (QA + build)
└─ Phase 5: 5 minutes  (documentation + commit)
   Total: ~73 minutes

Time savings with parallel execution: ~50%
(vs sequential agent execution)
```

---

## Success Metrics Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       SUCCESS METRICS                                   │
└─────────────────────────────────────────────────────────────────────────┘

Story Implementation Quality
├─ First-time QA pass rate: Target 100%
├─ Test coverage: Target ≥80%
├─ Accessibility violations: Target 0
├─ Build failures: Target 0
└─ Regression issues: Target 0

Time Efficiency
├─ Average story implementation time: ~40 minutes (medium)
├─ Parallel execution time savings: ~50%
├─ Rework time: Target 0 minutes (no QA failures)
└─ Total time to Done status: Implementation + QA validation

Code Quality
├─ TypeScript errors: Target 0
├─ ESLint errors: Target 0
├─ Code duplication: Target <5%
├─ Bundle size: Target <500KB
└─ Performance (LCP): Target <2.5s

Documentation Quality
├─ Story documents updated: Target 100%
├─ Dev Agent Record completeness: Target 100%
├─ Git commit quality: Following template 100%
└─ Knowledge stored in ByteRover: Yes
```

---

## End-to-End Example: Story 1.6

```
USER INPUT:
═══════════
"Implement Story 1.6 using the Master Story Implementation Protocol"

JAMES EXECUTION:
════════════════

[Phase 0] Loading context...
  ✓ Read story 1.6 document
  ✓ Load tech-stack.md, data-models.md, application-architecture.md
  ✓ ByteRover: Search "cart store patterns" → Found 2 patterns

[Phase 1] Planning...
  ✓ Create todo list: 12 tasks
  ✓ Update story status: Draft → InProgress
  ✓ Identify parallel tasks: Tasks 1-4 can run parallel

[Phase 2] Parallel execution...
  ✓ Launch 4 agents simultaneously:
    - business-logic-specialist → Cart store logic
    - react-component-architect → CartItem component
    - supabase-backend-architect → Inventory validation
    - ui-ux-accessibility-specialist → Tailwind styling
  ✓ Context7: Fetch Zustand docs (/pmndrs/zustand)
  ✓ All agents complete in 10 minutes

[Phase 3] Integration & testing...
  ✓ react-frontend-architect: Integrate components
  ✓ qa-testing-engineer: Write test suite (21 tests)
  ✓ Playwright: E2E testing + 3 screenshots
  ✓ All tests pass, 0 axe violations

[Phase 4] Quality assurance...
  ✓ pnpm run type-check → 0 errors
  ✓ pnpm run lint → 0 errors
  ✓ pnpm vitest run → 21/21 pass, coverage 87%
  ✓ pnpm run build → Success, bundle 415KB

[Phase 5] Completion...
  ✓ Update story document (Dev Agent Record filled)
  ✓ ByteRover: Store cart patterns
  ✓ Git commit: "Complete Story 1.6 - Cart Management..."
  ✓ Update story status: InProgress → Review

SUMMARY REPORT:
═══════════════
✅ Story 1.6 Implementation Complete
✅ All 8 acceptance criteria validated
✅ Test coverage: 87% (target ≥80%)
✅ Accessibility: 0 violations (WCAG 2.1 AA)
✅ Build status: Success (415KB < 500KB)
✅ Implementation time: 38 minutes
✅ Git commit: def5678
✅ Story status: Review (awaiting QA validation)

FILES CREATED:
- apps/web/src/stores/cartStore.ts
- apps/web/src/stores/cartStore.test.ts
- apps/web/src/services/inventory.service.ts
- apps/web/src/components/pos/CartItem.test.tsx
- supabase/migrations/20250114_cart_inventory.sql
- docs/qa/1.6-screenshots/ (3 images)

FILES MODIFIED:
- apps/web/src/components/pos/CartItem.tsx
- apps/web/src/App.tsx
- docs/stories/1.6.cart-management-quantity-adjustment.md

Next step: QA validation by Quinn (Test Architect)
```

---

## Summary

This architecture enables:

✅ **Efficiency**: Parallel execution saves ~50% time
✅ **Quality**: Comprehensive testing (unit + component + integration + E2E)
✅ **Consistency**: Same prompt works for ALL stories in Epic 1-7
✅ **Traceability**: Full documentation in Dev Agent Record
✅ **Automation**: Status updates, git commits, knowledge storage
✅ **Scalability**: Can handle simple to complex stories

**One prompt to rule them all!** 🚀
