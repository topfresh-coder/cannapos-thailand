# Quick Reference: Story Implementation Commands

## One-Line Command Template

```bash
Implement Story {STORY_ID} using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```

---

## Epic 1 Stories (Foundation & Core Infrastructure)

### Story 1.1 - Project Setup & Dev Environment
```bash
Implement Story 1.1 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ✅ Done

---

### Story 1.2 - Supabase Backend Setup
```bash
Implement Story 1.2 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ✅ Done

---

### Story 1.3 - Authentication System
```bash
Implement Story 1.3 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ✅ Done

---

### Story 1.4 - Basic Product Catalog Seeding
```bash
Implement Story 1.4 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ✅ Done

---

### Story 1.5 - POS Main Screen - Product Search & Selection
```bash
Implement Story 1.5 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ✅ Done

---

### Story 1.6 - Cart Management - Quantity Adjustment
```bash
Implement Story 1.6 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: 📝 InProgress

---

### Story 1.7 - Checkout Flow - Payment & Receipt
```bash
Implement Story 1.7 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

## Epic 2 Stories (Product Management & Inventory)

### Story 2.1 - Product Catalog Management
```bash
Implement Story 2.1 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

### Story 2.2 - Batch Receiving & FIFO Setup
```bash
Implement Story 2.2 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

### Story 2.3 - Tare Weight Handling for Flower
```bash
Implement Story 2.3 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

## Epic 3 Stories (Tiered Pricing Engine)

### Story 3.1 - Tier Price Configuration
```bash
Implement Story 3.1 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

### Story 3.2 - Auto Price Calculation in Cart
```bash
Implement Story 3.2 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

### Story 3.3 - Mixed Product Discount Rules
```bash
Implement Story 3.3 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

## Epic 4 Stories (Shift Reconciliation)

### Story 4.1 - Shift Opening Workflow
```bash
Implement Story 4.1 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

### Story 4.2 - Shift Closing & Variance Tracking
```bash
Implement Story 4.2 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

### Story 4.3 - Variance Investigation Workflow
```bash
Implement Story 4.3 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

## Epic 5 Stories (Stock Management)

### Story 5.1 - FIFO Allocation Engine
```bash
Implement Story 5.1 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

### Story 5.2 - Batch Depletion Tracking
```bash
Implement Story 5.2 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

### Story 5.3 - Weekly Stock Count Workflow
```bash
Implement Story 5.3 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

## Epic 6 Stories (Reporting Suite)

### Story 6.1 - Sales Reports (Daily/Weekly/Monthly)
```bash
Implement Story 6.1 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

### Story 6.2 - Inventory Reports (Stock Levels, Batch History)
```bash
Implement Story 6.2 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

### Story 6.3 - Shift Reconciliation Reports
```bash
Implement Story 6.3 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

### Story 6.4 - Multi-Location Dashboard
```bash
Implement Story 6.4 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

## Epic 7 Stories (UAT & Deployment)

### Story 7.1 - End-to-End UAT Testing
```bash
Implement Story 7.1 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

### Story 7.2 - Performance Optimization
```bash
Implement Story 7.2 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

### Story 7.3 - Training Materials & Documentation
```bash
Implement Story 7.3 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

### Story 7.4 - Pilot Deployment to Bangkok Location
```bash
Implement Story 7.4 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```
**Status**: ⏳ Pending

---

## Advanced Usage

### Run with Specific Agent Configuration
```bash
Implement Story {STORY_ID} using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md

Use the following sub-agents in parallel:
- database-architect for database schema
- supabase-backend-architect for service layer
- react-component-architect for UI components
- state-management-architect for Zustand store
- business-logic-specialist for calculations
- ui-ux-accessibility-specialist for styling + WCAG

Use MCP tools:
- Context7 for shadcn/ui, Zustand, React Router docs
- ByteRover for existing pattern search
- Playwright for E2E testing with screenshots at 375px, 1024px, 1920px
```

---

### Run with Debug Mode
```bash
Implement Story {STORY_ID} using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md

Enable debug mode:
- Log all agent decisions to .ai/debug-log.md
- Show detailed output for each MCP tool call
- Display TodoWrite updates in real-time
- Report estimated time for each phase
```

---

### Run with Skip Testing (NOT RECOMMENDED)
```bash
Implement Story {STORY_ID} using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md

SKIP Phase 3 testing (emergency mode only - will require manual testing later)
```

⚠️ **WARNING**: Skipping tests is NOT recommended. Only use in emergency situations where tests will be added later.

---

## Monitoring Progress

### Check Story Status
```bash
# View current story status
cat docs/stories/{STORY_ID}.*.md | grep "## Status"

# Example:
cat docs/stories/1.6.cart-management-quantity-adjustment.md | grep "## Status"
# Output: ## Status
#         InProgress
```

---

### Check Todo List (Real-time)
```bash
# Claude will display todo list in real-time during implementation
# Example output:

✅ Task 1: Database schema (completed)
✅ Task 2: Service layer (completed)
🔄 Task 3: React components (in_progress)
⏳ Task 4: Zustand store (pending)
⏳ Task 5: Integration (pending)
⏳ Task 6: Unit tests (pending)
⏳ Task 7: Component tests (pending)
⏳ Task 8: Integration tests (pending)
⏳ Task 9: Playwright E2E (pending)
⏳ Task 10: Build validation (pending)
⏳ Task 11: Documentation (pending)
⏳ Task 12: Git commit (pending)
```

---

### Check Git Commits
```bash
# View recent commits
git log --oneline -5

# Example output:
abc1234 Complete Story 1.6 - Cart Management Quantity Adjustment
def5678 Complete Story 1.5 - POS Main Screen
ghi9012 Complete Story 1.4 - Basic Product Catalog Seeding
```

---

### Check Test Coverage
```bash
# Run tests with coverage report
pnpm vitest run --coverage

# Example output:
Test Suites: 10 passed, 10 total
Tests:       85 passed, 85 total
Coverage:    87.3% (target: ≥80%)
```

---

### Check Build Status
```bash
# Run full build pipeline
pnpm run type-check && pnpm run lint && pnpm run build

# Example output:
✓ TypeScript: 0 errors
✓ ESLint: 0 errors
✓ Build: Success (bundle size: 412 KB)
```

---

### Check Playwright Screenshots
```bash
# View generated screenshots
ls docs/qa/{STORY_ID}-screenshots/

# Example output:
01-desktop-1920px-cart.png
02-tablet-1024px-cart.png
03-mobile-375px-cart.png
04-desktop-quantity-increase.png
05-desktop-quantity-decrease.png
```

---

## Troubleshooting

### If Implementation Gets Stuck

**Problem**: Agent stops responding or gets stuck on a task

**Solution**:
```bash
# Check current story status
cat docs/stories/{STORY_ID}.*.md | grep "## Status"

# If status is "InProgress", check .ai/debug-log.md
cat .ai/debug-log.md

# Resume implementation with explicit instruction
Continue implementing Story {STORY_ID} from where you left off. Current status: [describe current state]. Resume from Phase [X] Step [Y].
```

---

### If Tests Fail

**Problem**: Test suite fails during Phase 3

**Solution**:
```bash
# Run tests to see failures
pnpm vitest run

# Fix failing tests with specific instruction
Fix failing tests for Story {STORY_ID}. Current failures:
[paste test failure output]

Follow testing standards from docs/architecture/testing-approach.md
```

---

### If Build Fails

**Problem**: Production build fails during Phase 4

**Solution**:
```bash
# Check build errors
pnpm run build

# Fix build errors with specific instruction
Fix build errors for Story {STORY_ID}. Current errors:
[paste build error output]

Follow TypeScript strict mode requirements and resolve all type errors.
```

---

### If Accessibility Tests Fail

**Problem**: axe-core reports violations

**Solution**:
```bash
# Run accessibility tests
pnpm vitest run [test-file-with-axe]

# Fix violations with specific instruction
Fix accessibility violations for Story {STORY_ID}. Current violations:
[paste axe violation output]

Follow WCAG 2.1 AA standards from docs/architecture/accessibility-implementation-wcag-21-aa.md
```

---

## Best Practices

### 1. Always Start Fresh
```bash
# Before starting new story, ensure previous story is Done
git status                    # Check for uncommitted changes
pnpm vitest run              # Ensure tests pass
pnpm run build               # Ensure build succeeds
```

### 2. Monitor in Real-Time
```bash
# Watch Claude's progress in real-time
# Look for TodoWrite updates showing task transitions:
# pending → in_progress → completed
```

### 3. Validate After Completion
```bash
# After Claude finishes, validate everything:
pnpm run type-check          # TypeScript
pnpm run lint                # ESLint
pnpm vitest run              # Tests
pnpm run build               # Production build
git log -1                   # Check commit message
```

### 4. Review Before QA Handoff
```bash
# Check story document was updated
cat docs/stories/{STORY_ID}.*.md | grep "## Status"
# Should show: Review (not Done - that's QA's job)

# Check Dev Agent Record was filled
cat docs/stories/{STORY_ID}.*.md | grep -A 20 "## Dev Agent Record"

# Check screenshots were saved
ls docs/qa/{STORY_ID}-screenshots/
```

---

## Status Legend

- ✅ **Done** - QA approved, production ready
- 📝 **InProgress** - Currently being implemented by James
- 🔍 **Review** - Implementation complete, awaiting QA validation
- ⏳ **Pending** - Not started yet
- 🐛 **Blocked** - Blocked by dependencies or issues

---

## Summary

**To implement ANY story in Epic 1-7, just run**:

```bash
Implement Story {STORY_ID} using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```

**Claude will**:
1. ✅ Load context + story document
2. ✅ Create implementation plan with TodoWrite
3. ✅ Launch parallel agents (database, service, UI, store)
4. ✅ Write comprehensive tests (unit + component + integration + accessibility + E2E)
5. ✅ Run quality checks (type-check + lint + build)
6. ✅ Update story document + create git commit
7. ✅ Update story status to Review

**You just wait and validate!** 🚀

---

**Questions?** Check:
- Full prompt: [MASTER_STORY_IMPLEMENTATION_PROMPT.md](MASTER_STORY_IMPLEMENTATION_PROMPT.md)
- Thai guide: [MASTER_STORY_IMPLEMENTATION_PROMPT_USAGE_TH.md](MASTER_STORY_IMPLEMENTATION_PROMPT_USAGE_TH.md)
