# 🚀 MASTER IMPLEMENTATION PROMPT
## Cannabis POS - Complete Story Implementation System

---

## 📋 QUICK START - Copy & Paste Commands

### Command 1: Implement Single Story
```markdown
Implement Story 1.6 - Cart Management & Quantity Adjustment

Follow the complete implementation workflow:

**PHASE 1: SETUP & PLANNING**
1. Read story document: docs/stories/1.6.cart-management-quantity-adjustment.md
2. Update story status: Draft → InProgress
3. Create todo list with ALL tasks from story using TodoWrite
4. Validate prerequisites (Story 1.5 complete, architecture docs accessible)

**PHASE 2: IMPLEMENTATION**
For each task:
- Mark task as in_progress (TodoWrite)
- Use Context7 MCP for library docs (shadcn/ui, Zustand, React Router)
- Use ByteRover MCP to find existing patterns in codebase
- Implement following story specs EXACTLY
- Write tests IMMEDIATELY (unit + component + integration)
- Mark task as completed only when tests pass

**PHASE 3: TESTING & VALIDATION**
- Run test suite: `pnpm vitest run && pnpm run type-check && pnpm run lint && pnpm run build`
- Accessibility: Zero axe-core violations
- Playwright testing at 375px, 1024px, 1920px viewports
- Save screenshots to docs/qa/1.6-screenshots/

**PHASE 4: COMPLETION**
- Update story status: InProgress → Review
- Fill Dev Agent Record section with implementation notes
- Create git commit with story template
- DO NOT set status to Done (QA's job)

**MCP TOOLS TO USE**:
- Context7: shadcn/ui AlertDialog, Zustand persist middleware
- ByteRover: Search cart store patterns, inventory validation patterns
- Playwright: Test CartItem controls, quantity validation, responsive layout

**SUCCESS CRITERIA**:
✅ All 8 acceptance criteria met
✅ All tests passing (≥80% coverage)
✅ Zero TypeScript errors
✅ Zero accessibility violations
✅ Story status = Review
✅ Dev Agent Record filled

Execute now.
```

---

### Command 2: Implement Multiple Stories in Parallel
```markdown
Implement Stories 1.6, 1.7, and 1.8 in parallel using specialized agents.

**STORY ASSIGNMENTS**:

**Agent 1 - React Frontend Architect**: Story 1.6 (Cart Management)
- Focus: CartItem component, cart store updates, quantity controls
- MCP Tools: Context7 (shadcn AlertDialog), Playwright (UI testing)
- Files: CartItem.tsx, cartStore.ts, useInventoryValidation.ts

**Agent 2 - Full Stack Developer**: Story 1.7 (Checkout & Transaction)
- Focus: Transaction creation, FIFO allocation, inventory deduction
- MCP Tools: Context7 (Supabase docs), ByteRover (FIFO patterns)
- Files: transactions.service.ts, checkout workflow

**Agent 3 - React Frontend Architect**: Story 1.8 (Receipt Display)
- Focus: Receipt component, transaction display, print preparation
- MCP Tools: Context7 (React Router), Playwright (receipt layout)
- Files: ReceiptPage.tsx, receipt formatting utilities

**COORDINATION RULES**:
1. Each agent updates their story status independently (Draft → InProgress → Review)
2. Agent 2 must complete before Agent 3 starts (Story 1.8 depends on 1.7 transaction data)
3. Agent 1 runs independently in parallel
4. All agents use TodoWrite for progress tracking
5. All agents use MCP tools proactively

**EXECUTION SEQUENCE**:
- Start Agent 1 + Agent 2 in parallel
- Wait for Agent 2 completion
- Start Agent 3
- Wait for all agents to reach Review status
- Report completion summary

**SUCCESS CRITERIA**:
✅ All 3 stories status = Review
✅ All tests passing across all stories
✅ Integration between stories validated
✅ All Dev Agent Records filled

Execute parallel implementation now.
```

---

### Command 3: Implement Entire Epic with Optimal Parallelization
```markdown
Implement ALL remaining stories in Epic 1 (Foundation & Core Infrastructure) using maximum parallelization.

**CURRENT STATUS**:
- Stories 1.1-1.5.1: ✅ Done
- Stories 1.6-1.14: 📝 Draft (need implementation)

**DEPENDENCY ANALYSIS & EXECUTION PLAN**:

**GROUP 1 - PARALLEL (3 agents, no dependencies)**
Launch simultaneously:

1. **React Frontend Architect** → Story 1.6 (Cart Management)
   - CartItem controls, quantity validation, remove functionality
   - MCP: Context7 (AlertDialog), Playwright (responsive testing)
   - Time estimate: 2 hours

2. **DevOps Deployment Engineer** → Story 1.10 (Deployment Pipeline)
   - GitHub Actions CI/CD, Vercel deployment, preview environments
   - MCP: Context7 (GitHub Actions docs), ByteRover (CI patterns)
   - Time estimate: 2 hours

3. **DevOps Deployment Engineer** → Story 1.13 (Monitoring & Observability)
   - Sentry integration, error tracking, alert thresholds
   - MCP: Context7 (Sentry docs), ByteRover (logging patterns)
   - Time estimate: 1.5 hours

**WAIT FOR GROUP 1 COMPLETION** ⏸️

---

**GROUP 2 - SEQUENTIAL (2 agents, Story 1.8 depends on 1.7)**

4. **Full Stack Developer** → Story 1.7 (Checkout & Transaction)
   - Transaction creation, FIFO batch allocation, inventory deduction
   - MCP: Context7 (Supabase), ByteRover (FIFO algorithms)
   - Time estimate: 3 hours
   - **BLOCKER**: Must complete before Story 1.8

5. **React Frontend Architect** → Story 1.8 (Receipt Display)
   - Receipt component, transaction display, print format
   - MCP: Context7 (React Router), Playwright (receipt testing)
   - Time estimate: 1.5 hours
   - **DEPENDENCY**: Requires Story 1.7 transaction data

**WAIT FOR GROUP 2 COMPLETION** ⏸️

---

**GROUP 3 - PARALLEL (3 agents, no dependencies)**
Launch simultaneously:

6. **React Frontend Architect** → Story 1.9 (Navigation & Layout)
   - Top nav, side nav, responsive menu, protected routes
   - MCP: Context7 (React Router), Playwright (navigation testing)
   - Time estimate: 2 hours

7. **UI/UX Accessibility Specialist** → Story 1.11 (Accessibility Foundation)
   - ARIA patterns, keyboard nav, color contrast, axe-core integration
   - MCP: Context7 (WCAG docs), Playwright (a11y testing)
   - Time estimate: 3 hours

8. **Full Stack Developer** → Story 1.12 (Error Handling System)
   - Error classification, AppError class, ErrorBoundary, retry logic
   - MCP: Context7 (Sentry), ByteRover (error handling patterns)
   - Time estimate: 2.5 hours

**WAIT FOR GROUP 3 COMPLETION** ⏸️

---

**GROUP 4 - FINAL (1 agent, validates everything)**

9. **DevOps Deployment Engineer** → Story 1.14 (Performance Budgets)
   - Bundle size checks, Lighthouse CI, Web Vitals monitoring
   - MCP: Context7 (Lighthouse CI), Playwright (performance testing)
   - Time estimate: 1.5 hours
   - **DEPENDENCY**: Requires all previous stories complete

---

**EXECUTION INSTRUCTIONS**:

1. **For each group**:
   - Launch all agents in the group simultaneously (single message with multiple Task tool invocations)
   - Each agent follows complete implementation workflow (setup → implement → test → complete)
   - Each agent uses TodoWrite for progress tracking
   - Each agent updates story status (Draft → InProgress → Review)

2. **After each group completion**:
   - Verify all stories in group have status = Review
   - Run integration tests between stories in the group
   - Report group completion summary

3. **MCP Tools Strategy**:
   - **Context7**: Use for ALL library documentation (shadcn/ui, Supabase, React Router, etc.)
   - **ByteRover**: Search codebase for existing patterns before creating new code
   - **Playwright**: Test ALL UI components at 3 viewports (375px, 1024px, 1920px)

4. **Quality Gates** (per story):
   - ✅ All acceptance criteria met
   - ✅ All tests passing (≥80% coverage)
   - ✅ Zero TypeScript errors
   - ✅ Zero accessibility violations
   - ✅ Playwright screenshots saved
   - ✅ Dev Agent Record filled

5. **Epic Completion Report**:
   After all groups complete, create summary:
   - Total stories completed: 9
   - Total test coverage: [percentage]
   - Total files modified: [count]
   - Integration test results: [pass/fail]
   - Production build status: [success/failure]
   - Ready for QA: [yes/no]

**SUCCESS CRITERIA FOR EPIC 1**:
✅ All 9 stories (1.6-1.14) status = Review
✅ All tests passing across entire epic
✅ TypeScript compiles with zero errors
✅ Production build succeeds
✅ All performance budgets met
✅ Zero accessibility violations
✅ CI/CD pipeline operational
✅ Monitoring and error tracking active

**TOTAL ESTIMATED TIME**: 18 hours (with parallelization) vs. 36 hours (sequential)

Execute epic implementation now with maximum parallelization.
```

---

## 🛠️ IMPLEMENTATION WORKFLOW TEMPLATE

Use this template for ANY story implementation:

```markdown
Implement Story {EPIC}.{STORY} - {TITLE}

**PHASE 1: SETUP & PLANNING**
□ Read story: docs/stories/{epic}.{story}.*.md
□ Update status: Draft → InProgress
□ Create todos: TodoWrite with all tasks/subtasks
□ Validate prereqs: Previous stories Done, architecture docs accessible

**PHASE 2: ARCHITECTURE RESEARCH**
□ Use ByteRover: Search for existing patterns related to this story
□ Use Context7: Get docs for libraries needed (shadcn/ui, Zustand, etc.)
□ Review architecture: Read relevant docs from docs/architecture/
□ Identify reusable components/utilities from previous stories

**PHASE 3: IMPLEMENTATION (Task-by-Task)**
For each task in story:
□ Mark in_progress (TodoWrite)
□ Implement following story specs EXACTLY
□ Use TypeScript strict mode (no `any`)
□ Add code comments for complex logic
□ Write tests IMMEDIATELY (unit + component)
□ Run tests: `pnpm vitest run`
□ Mark completed (TodoWrite)

**PHASE 4: INTEGRATION & TESTING**
□ Run full test suite: vitest + type-check + lint + build
□ Accessibility: Zero axe-core violations
□ Playwright: Test at 375px, 1024px, 1920px
□ Screenshots: Save to docs/qa/{story}-screenshots/
□ Performance: Bundle size < 500KB, LCP < 2.5s

**PHASE 5: COMPLETION**
□ Update status: InProgress → Review
□ Fill Dev Agent Record:
  - Agent model used
  - Debug log references
  - Completion notes (AC status, tools used)
  - File list (created + modified)
□ Git commit with story template
□ DO NOT set status to Done (QA's job)

**MCP TOOLS**:
□ Context7: [List libraries needed]
□ ByteRover: [List patterns to search]
□ Playwright: [List UI components to test]

**SUCCESS CRITERIA**:
□ All acceptance criteria met
□ All tests passing (≥80% coverage)
□ Zero TypeScript errors
□ Zero accessibility violations
□ Story status = Review
□ Dev Agent Record filled

Execute now.
```

---

## 📚 MCP TOOLS QUICK REFERENCE

### Context7 - Library Documentation

**Common Libraries**:
```markdown
- shadcn/ui components: /shadcn-ui/ui
- Zustand state management: /zustand/zustand
- React Router navigation: /react-router/react-router
- Supabase backend: /supabase/supabase
- Vitest testing: /vitest/vitest
- React Testing Library: /testing-library/react
```

**Usage Pattern**:
```typescript
// Step 1: Resolve library ID
mcp__context7__resolve-library-id({ libraryName: "shadcn-ui" })
→ Returns: /shadcn-ui/ui

// Step 2: Get specific documentation
mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/shadcn-ui/ui",
  topic: "alert-dialog",
  tokens: 5000
})
→ Returns: AlertDialog component docs with examples
```

**When to Use**:
- ✅ Installing new shadcn/ui components
- ✅ Learning Zustand middleware patterns
- ✅ Understanding React Router v6 features
- ✅ Checking Supabase client API methods
- ✅ Finding Vitest assertion patterns

---

### ByteRover - Codebase Knowledge Search

**Usage Pattern**:
```typescript
// Retrieve existing knowledge
mcp__byterover-mcp__byterover-retrieve-knowledge({
  query: "How are Zustand stores structured in this project?",
  limit: 3
})
→ Returns: Existing patterns from codebase

// Store new knowledge
mcp__byterover-mcp__byterover-store-knowledge({
  messages: "Cart store uses persist middleware with localStorage key 'cannapos-cart'"
})
→ Stores pattern for future reference
```

**When to Use**:
- ✅ Before creating new components (find similar ones)
- ✅ Before writing services (find existing patterns)
- ✅ Before setting up tests (find test fixtures)
- ✅ When stuck (search for how others solved similar problems)

---

### Playwright - Browser Testing

**Usage Pattern**:
```typescript
// 1. Start browser and navigate
mcp__playwright__browser_navigate({ url: "http://localhost:5173/pos" })

// 2. Resize for responsive testing
mcp__playwright__browser_resize({ width: 375, height: 667 }) // Mobile

// 3. Get accessibility tree
mcp__playwright__browser_snapshot()
→ Returns: Accessibility structure

// 4. Interact with elements
mcp__playwright__browser_click({
  element: "Add to Cart button",
  ref: "button[aria-label='Add to cart']"
})

// 5. Take screenshot
mcp__playwright__browser_take_screenshot({
  filename: "docs/qa/1.6-screenshots/cart-mobile-375px.png",
  fullPage: true
})

// 6. Close browser
mcp__playwright__browser_close()
```

**When to Use**:
- ✅ Testing UI components in real browser
- ✅ Verifying responsive layouts (375px, 1024px, 1920px)
- ✅ Validating accessibility (keyboard nav, ARIA)
- ✅ Taking screenshots for QA evidence
- ✅ Testing user interactions (click, type, submit)

---

## ✅ QUALITY GATES CHECKLIST

Before marking story as Review:

### Code Quality
- [ ] TypeScript strict mode (no `any` types)
- [ ] All functions have explicit return types
- [ ] Props destructured in function signature
- [ ] Event handlers prefixed with `handle`
- [ ] Custom hooks prefixed with `use`

### Testing
- [ ] Unit tests for business logic (≥80% coverage)
- [ ] Component tests with React Testing Library
- [ ] Integration tests for Supabase queries
- [ ] Accessibility tests with axe-core (zero violations)
- [ ] All tests passing: `pnpm vitest run`

### TypeScript
- [ ] Compiles with zero errors: `pnpm run type-check`
- [ ] No unused variables or imports
- [ ] Interfaces defined for all object shapes
- [ ] Types imported from generated Supabase types

### Accessibility (WCAG 2.1 AA)
- [ ] All interactive elements have ARIA labels
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Focus indicators visible (2px outline, 3:1 contrast)
- [ ] Color contrast meets standards (4.5:1 text, 3:1 UI)
- [ ] Touch targets ≥44px × 44px

### Playwright Testing
- [ ] Tested at 375px viewport (mobile)
- [ ] Tested at 1024px viewport (tablet/desktop threshold)
- [ ] Tested at 1920px viewport (desktop)
- [ ] Screenshots saved to docs/qa/{story}-screenshots/
- [ ] User flows validated end-to-end

### Build & Performance
- [ ] Production build succeeds: `pnpm run build`
- [ ] Bundle size < 500KB (if applicable)
- [ ] No console warnings or errors
- [ ] Lint passes: `pnpm run lint`

### Story Documentation
- [ ] Status updated: InProgress → Review
- [ ] Dev Agent Record filled:
  - [ ] Agent model used
  - [ ] Debug log references (if any)
  - [ ] Completion notes (AC status, tools used)
  - [ ] File list (created + modified)
- [ ] Git commit created with story template

---

## 🎯 STORY STATUS LIFECYCLE

```
Draft
  ↓ (Scrum Master creates story)
Approved (optional)
  ↓ (Product Owner approves)
InProgress ← YOU START HERE
  ↓ (Implement + test)
Review ← YOU STOP HERE
  ↓ (QA validates)
Done ← QA SETS THIS
```

**Your Responsibilities**:
1. Change `Draft` → `InProgress` when you START
2. Change `InProgress` → `Review` when you FINISH
3. Fill **Dev Agent Record** section
4. DO NOT change to `Done` (that's QA's job)

---

## 🚨 COMMON PITFALLS TO AVOID

❌ **DON'T DO THIS**:
- Skip tests ("I'll add them later")
- Use `any` types in TypeScript
- Forget to update story status
- Not use MCP tools (Context7, ByteRover, Playwright)
- Mark task as completed before tests pass
- Change status to Done (only QA can do this)
- Implement stories out of order (check dependencies)

✅ **DO THIS**:
- Write tests immediately after implementation
- Use TypeScript strict mode (no `any`)
- Update story status when starting AND finishing
- Use MCP tools proactively for docs and patterns
- Mark task completed only when tests pass
- Change status to Review, let QA set Done
- Validate story dependencies before starting

---

## 📖 EXAMPLE: Complete Story Implementation

```markdown
Implement Story 1.6 - Cart Management & Quantity Adjustment

**PHASE 1: SETUP**
Reading story document... ✅
Story has 8 acceptance criteria, 12 tasks, 66 subtasks
Updating status: Draft → InProgress ✅
Creating todo list with TodoWrite... ✅
  □ Task 1: Add Quantity Controls (7 subtasks)
  □ Task 2: Implement Quantity Update Logic (5 subtasks)
  □ Task 3: Increment/Decrement Handlers (3 subtasks)
  ... (12 tasks total)
Previous story 1.5 status: Done ✅
Prerequisites validated ✅

**PHASE 2: ARCHITECTURE RESEARCH**
Using ByteRover to search existing cart patterns...
Found: cartStore.ts uses Zustand, has addItem/removeItem/updateQuantity actions
Found: CartItem.tsx exists but needs quantity controls added
Using Context7 to get shadcn/ui AlertDialog docs...
Retrieved: AlertDialog component with confirmation pattern
Using Context7 to get Zustand persist middleware docs...
Retrieved: persist middleware usage with localStorage

**PHASE 3: IMPLEMENTATION**

Task 1/12: Add Quantity Controls to CartItem Component
  Marking as in_progress... ✅
  Implementing increment/decrement buttons... ✅
  Adding number input with decimal support for flower... ✅
  Touch targets set to 44px (WCAG AA)... ✅
  ARIA labels added to all controls... ✅
  Writing component tests... ✅
    ✓ Increment increases quantity
    ✓ Decrement decreases quantity
    ✓ Input accepts decimal for flower
    ✓ Buttons have 44px tap targets
    ✓ ARIA labels present
  Tests passing (14/14) ✅
  Marking as completed ✅

Task 2/12: Implement Quantity Update Logic in Cart Store
  Marking as in_progress... ✅
  Adding validation to updateQuantity action... ✅
  Minimum quantity = 1, reject negative/zero... ✅
  Round flower to 1 decimal, non-flower to integer... ✅
  Query inventory from product_batches... ✅
  Reject if quantity > available inventory... ✅
  Writing unit tests... ✅
    ✓ Updates quantity for valid value
    ✓ Rejects quantity < 1
    ✓ Rejects negative quantities
    ✓ Rounds flower to 1 decimal
    ✓ Enforces integer for non-flower
    ✓ Updates line total correctly
  Tests passing (12/12) ✅
  Marking as completed ✅

... [Tasks 3-12 continue similarly] ...

**PHASE 4: INTEGRATION & TESTING**

Running full test suite...
  ✓ Unit tests: 26/26 passing
  ✓ Component tests: 14/14 passing
  ✓ Integration tests: 3/3 passing
  ✓ TypeScript: Zero errors
  ✓ ESLint: No warnings
  ✓ Production build: Success (bundle 487KB)

Accessibility validation...
  ✓ axe-core: Zero violations
  ✓ Keyboard navigation: Tab, Enter, Esc working
  ✓ Focus indicators: 2px outline visible
  ✓ Color contrast: 4.5:1 for text, 3:1 for UI

Playwright testing...
  Starting dev server... ✅
  Navigating to http://localhost:5173/pos... ✅

  Testing at 375px (mobile):
    Resizing browser to 375px × 667px... ✅
    Taking snapshot... ✅
    CartButton visible: ✓
    Increment button clickable: ✓
    Decrement button clickable: ✓
    Remove button shows dialog: ✓
    Screenshot saved: docs/qa/1.6-screenshots/cart-mobile-375px.png ✅

  Testing at 1024px (tablet):
    Resizing browser to 1024px × 768px... ✅
    Sidebar visible: ✓
    Quantity controls working: ✓
    Screenshot saved: docs/qa/1.6-screenshots/cart-tablet-1024px.png ✅

  Testing at 1920px (desktop):
    Resizing browser to 1920px × 1080px... ✅
    Full layout correct: ✓
    Screenshot saved: docs/qa/1.6-screenshots/cart-desktop-1920px.png ✅

  Closing browser... ✅

**PHASE 5: COMPLETION**

Updating story status: InProgress → Review ✅

Filling Dev Agent Record...
  Agent Model Used: claude-sonnet-4-5-20250929 (James) ✅
  Debug Log References: None (no blocking issues) ✅
  Completion Notes:
    ✓ All 8 acceptance criteria PASSING
    ✓ Implementation: CartItem controls, cart store validation, inventory hook
    ✓ Testing: 43 tests (26 unit + 14 component + 3 integration)
    ✓ Tools: Context7 (AlertDialog, Zustand persist), Playwright (3 viewports)
    ✓ Performance: Bundle 487KB, all tests pass in 2.3s ✅
  File List:
    Created:
      - apps/web/src/hooks/useInventoryValidation.ts
      - apps/web/src/components/ui/alert-dialog.tsx (shadcn)
    Modified:
      - apps/web/src/stores/cartStore.ts (added validation, persist)
      - apps/web/src/components/pos/CartItem.tsx (added controls) ✅

Creating git commit...
  Commit message: "Complete Story 1.6 - Cart Management & Quantity Adjustment" ✅
  Files staged: 5 files ✅
  Commit created: abc123def ✅

**STORY 1.6 IMPLEMENTATION COMPLETE**
Status: Review (ready for QA)
Time: 2.5 hours
Next: Await QA validation
```

---

## 🎓 FINAL INSTRUCTIONS

When you receive ANY of the commands above:

1. **Follow the workflow EXACTLY**
2. **Use TodoWrite** to track all tasks
3. **Use MCP tools** (Context7, ByteRover, Playwright) proactively
4. **Write tests** immediately after each implementation
5. **Update story status** when starting (InProgress) and finishing (Review)
6. **Fill Dev Agent Record** with complete implementation notes
7. **DO NOT skip quality gates** (tests, accessibility, TypeScript, build)
8. **DO NOT set status to Done** (only QA can do this)

**Success = Story passes QA review on first attempt with zero rework.**

Good luck! 🚀
