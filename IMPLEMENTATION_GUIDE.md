# Cannabis POS - Story Implementation Guide

## Quick Start: Implementing Stories

### Option 1: Single Story Implementation

```markdown
@james-fullstack-developer.md

Implement Story 1.6 - Cart Management & Quantity Adjustment

Use parallel execution where possible and leverage MCP tools:
- Context7 for library documentation (shadcn/ui, Zustand)
- ByteRover for existing codebase patterns
- Playwright for browser testing at 375px, 1024px, 1920px

Update story status when starting and finishing.
```

### Option 2: Multiple Stories in Parallel

```markdown
I need to implement Stories 1.6, 1.7, and 1.8 in parallel.

Launch 3 instances of @james-fullstack-developer.md:
- Instance 1: Story 1.6 (Cart Management)
- Instance 2: Story 1.7 (Checkout & Transaction)
- Instance 3: Story 1.8 (Receipt Display)

Each instance should:
1. Use MCP tools (Context7, ByteRover, Playwright)
2. Update story status independently
3. Report completion when done

Wait for all to complete before integration testing.
```

### Option 3: Epic-Level Implementation

```markdown
Implement all remaining stories in Epic 1 (Foundation & Core Infrastructure).

Stories to implement:
- 1.6: Cart Management & Quantity Adjustment
- 1.7: Simple Checkout & Transaction Recording
- 1.8: Receipt Display & Print Preparation
- 1.9: Navigation & Basic Layout
- 1.10: Deployment Pipeline & Hosting
- 1.11: Accessibility Foundation (WCAG 2.1 AA)
- 1.12: Error Handling System
- 1.13: Monitoring & Observability
- 1.14: Deployment & Performance Budgets

Strategy:
1. Identify dependencies between stories
2. Group independent stories for parallel execution
3. Launch multiple @james-fullstack-developer.md instances
4. Use MCP tools throughout
5. Update all story statuses
6. Create epic completion report

Use maximum parallelization where story dependencies allow.
```

---

## Story Implementation Workflow

### Phase 1: Story Selection

**Check story status**:
```bash
ls docs/stories/*.md
# Look for stories with Status: Draft or Approved
```

**Verify prerequisites**:
- Previous stories in epic are complete (Status: Done)
- Architecture documents are up to date
- Development environment is running (Supabase, Vite dev server)

### Phase 2: Agent Invocation

**Single story** (simple):
```markdown
@james-fullstack-developer.md

Implement Story {epic}.{story} - {Title}
```

**Multiple stories** (parallel):
```markdown
Launch 3 agents in parallel:
1. @james-fullstack-developer.md → Story 1.6
2. @james-fullstack-developer.md → Story 1.7
3. @james-fullstack-developer.md → Story 1.8

Coordinate completion and report when all done.
```

**With specific MCP tool focus**:
```markdown
@james-fullstack-developer.md

Implement Story 1.11 - Accessibility Foundation

Focus on using:
- Context7: Get WCAG 2.1 AA patterns and axe-core documentation
- Playwright: Test keyboard navigation and screen reader announcements
- ByteRover: Find existing accessibility patterns in codebase

Ensure zero axe-core violations before marking Review.
```

### Phase 3: Progress Tracking

The agent will use TodoWrite to track progress. You can ask:

```markdown
Show me current todo status for Story 1.6
```

Or check the story document directly:
```bash
cat docs/stories/1.6.cart-management-quantity-adjustment.md
# Check Status field and Dev Agent Record section
```

### Phase 4: QA Handoff

After agent completes (Status: Review), run QA validation:

```markdown
@quinn-qa-specialist.md

Review Story {epic}.{story} - {Title}

Perform comprehensive QA:
1. Code quality review
2. Test coverage validation
3. Accessibility compliance check
4. Performance testing
5. Security review

If all pass, update status to Done and create QA gate.
```

---

## Parallel Execution Strategy

### Identifying Parallelizable Stories

**Stories can run in parallel if**:
- They don't modify the same files
- They don't have dependencies on each other
- They work on different architectural layers

**Example analysis for Epic 1**:

**Group 1 (Parallel)**:
- Story 1.6: Cart Management (Frontend - CartItem, CartStore)
- Story 1.10: Deployment Pipeline (DevOps - GitHub Actions, Vercel)
- Story 1.13: Monitoring (DevOps - Sentry, Analytics)

**Group 2 (Sequential after Group 1)**:
- Story 1.7: Checkout (Depends on 1.6 - needs cart functionality)
- Story 1.8: Receipt (Depends on 1.7 - needs transaction data)

**Group 3 (Parallel after Group 2)**:
- Story 1.9: Navigation (Frontend - Layout components)
- Story 1.11: Accessibility (Cross-cutting - all components)
- Story 1.12: Error Handling (Cross-cutting - all layers)

**Group 4 (Final)**:
- Story 1.14: Performance Budgets (Depends on all - final validation)

### Execution Command

```markdown
## Epic 1 Parallel Implementation

Implement Epic 1 stories in 4 groups:

**GROUP 1 (Parallel - 3 agents)**:
Launch simultaneously:
1. @james-fullstack-developer.md → Story 1.6 (Cart Management)
2. @devops-deployment-engineer.md → Story 1.10 (Deployment Pipeline)
3. @devops-deployment-engineer.md → Story 1.13 (Monitoring)

Wait for Group 1 completion before Group 2.

**GROUP 2 (Sequential - 2 stories)**:
1. @james-fullstack-developer.md → Story 1.7 (Checkout) - depends on 1.6
2. @james-fullstack-developer.md → Story 1.8 (Receipt) - depends on 1.7

**GROUP 3 (Parallel - 3 agents)**:
Launch simultaneously after Group 2:
1. @react-frontend-architect.md → Story 1.9 (Navigation)
2. @ui-ux-accessibility-specialist.md → Story 1.11 (Accessibility)
3. @james-fullstack-developer.md → Story 1.12 (Error Handling)

**GROUP 4 (Final - 1 agent)**:
1. @devops-deployment-engineer.md → Story 1.14 (Performance Budgets)

Use MCP tools throughout. Report progress after each group completion.
```

---

## MCP Tools Reference

### Context7 - Library Documentation

**Common libraries in this project**:

| Library | ID | Use Case |
|---------|----|-----------|
| shadcn/ui | `/shadcn-ui/ui` | UI components (Dialog, Form, Toast) |
| Zustand | `/zustand/zustand` | State management patterns |
| React Router | `/react-router/react-router` | Routing and navigation |
| Supabase | `/supabase/supabase` | Database client, Auth, RLS |
| Vitest | `/vitest/vitest` | Testing framework |
| React Testing Library | `/testing-library/react` | Component testing |

**Example usage**:
```markdown
Before implementing CartItem with AlertDialog:

Use Context7:
1. Resolve: shadcn-ui → /shadcn-ui/ui
2. Get docs: /shadcn-ui/ui → topic: "alert-dialog"
3. Review: Installation steps, API, examples
4. Implement: Following official patterns
```

### ByteRover - Codebase Knowledge

**What to search for**:
- Existing patterns: "How are Zustand stores structured?"
- Service patterns: "How is Supabase client used in services?"
- Test setups: "Vitest test configuration"
- Component patterns: "shadcn/ui component usage"

**Example workflow**:
```markdown
Before creating inventory validation hook:

Use ByteRover:
1. Retrieve: "Supabase service layer patterns"
2. Review: Existing services (products.service.ts, auth.service.ts)
3. Store: "Services use try/catch with typed errors and RLS compliance"
4. Implement: Following discovered pattern
```

### Playwright - Browser Testing

**Test scenarios for UI stories**:

1. **Responsive Testing**:
   - Mobile: 375px × 667px (iPhone SE)
   - Tablet: 1024px × 768px (Desktop threshold)
   - Desktop: 1920px × 1080px (Full desktop)

2. **Accessibility Testing**:
   - Keyboard navigation (Tab, Shift+Tab, Enter, Esc)
   - Focus indicators visible
   - ARIA attributes present
   - Screen reader announcements

3. **Functional Testing**:
   - User interactions (click, type, submit)
   - Form validation
   - Error states
   - Loading states

**Example workflow**:
```markdown
After implementing Story 1.6 CartItem:

Use Playwright:
1. Navigate: http://localhost:5173/pos
2. Resize: 375px × 667px (mobile)
3. Snapshot: Get accessibility tree
4. Click: Increment button
5. Verify: Quantity updated
6. Screenshot: Save to docs/qa/1.6-screenshots/
7. Resize: 1920px × 1080px (desktop)
8. Screenshot: Save desktop view
9. Close: Browser
```

---

## Agent Coordination

### Master Control Prompt

Use this when you want to implement multiple stories with optimal coordination:

```markdown
# Epic 1 Complete Implementation

I need to implement all remaining stories in Epic 1 with maximum efficiency.

## Current Status
- Stories 1.1-1.5.1: Done ✅
- Stories 1.6-1.14: Draft (need implementation)

## Request
Analyze dependencies and create optimal parallel execution plan:

1. **Dependency Analysis**:
   - Which stories can run in parallel?
   - Which stories must run sequentially?
   - What are the blocking dependencies?

2. **Agent Assignment**:
   - Assign specialized agents to stories (james, devops, qa, etc.)
   - Group parallelizable stories
   - Define handoff points between groups

3. **Execution Plan**:
   - Create numbered groups (Group 1, 2, 3...)
   - Launch parallel agents within each group
   - Wait for group completion before next group
   - Use MCP tools throughout

4. **Progress Tracking**:
   - Update story statuses as you go
   - Report completion after each group
   - Create epic completion summary at the end

5. **Quality Gates**:
   - All tests passing per story
   - Accessibility compliance (zero axe violations)
   - TypeScript compiles (zero errors)
   - Production build succeeds

Execute the plan and report progress.
```

---

## Troubleshooting

### Common Issues

**Issue**: Agent stuck on a task
**Solution**: Check `.ai/debug-log.md` for entries, use ByteRover to find similar patterns

**Issue**: Tests failing
**Solution**: Check test output, use Context7 to get testing library docs, verify test setup

**Issue**: TypeScript errors
**Solution**: Run `pnpm run type-check`, fix type errors, regenerate Supabase types if needed

**Issue**: Accessibility violations
**Solution**: Use Playwright to inspect accessibility tree, add missing ARIA attributes, fix color contrast

**Issue**: Story status not updating
**Solution**: Agent should update status in story markdown file when starting (InProgress) and finishing (Review)

### Getting Help

1. **Check debug log**: `.ai/debug-log.md`
2. **Review architecture docs**: `docs/architecture/`
3. **Search codebase**: Use ByteRover MCP
4. **Get library docs**: Use Context7 MCP
5. **Test in browser**: Use Playwright MCP

---

## Success Metrics

### Per Story
- ✅ All acceptance criteria met
- ✅ Tests passing (≥80% coverage)
- ✅ Zero TypeScript errors
- ✅ Zero accessibility violations
- ✅ Status updated (InProgress → Review)
- ✅ Dev Agent Record filled

### Per Epic
- ✅ All stories in epic complete
- ✅ Integration tests passing
- ✅ Production build succeeds
- ✅ Performance budgets met
- ✅ Epic summary created

### Overall Project
- ✅ All epics complete
- ✅ End-to-end user flows working
- ✅ Deployment pipeline operational
- ✅ Monitoring and observability active
- ✅ Ready for UAT (Epic 7)

---

## Next Steps

**Current Epic**: Epic 1 - Foundation & Core Infrastructure

**Remaining Stories**:
1. Story 1.6: Cart Management & Quantity Adjustment (Ready)
2. Story 1.7: Simple Checkout & Transaction Recording
3. Story 1.8: Receipt Display & Print Preparation
4. Story 1.9: Navigation & Basic Layout
5. Story 1.10: Deployment Pipeline & Hosting
6. Story 1.11: Accessibility Foundation (WCAG 2.1 AA)
7. Story 1.12: Error Handling System
8. Story 1.13: Monitoring & Observability
9. Story 1.14: Deployment & Performance Budgets

**Recommended Approach**:
Start with Story 1.6 (single story) to validate the agent workflow, then move to parallel execution for Stories 1.7-1.9.

**Start Command**:
```markdown
@james-fullstack-developer.md

Implement Story 1.6 - Cart Management & Quantity Adjustment

Use MCP tools (Context7, ByteRover, Playwright) and update story status.
```

---

Good luck! 🚀
