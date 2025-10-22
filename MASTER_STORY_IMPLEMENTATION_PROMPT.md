# Master Story Implementation Prompt (Epic 1-7)

## Purpose
This is a **reusable, comprehensive prompt** for implementing ANY user story across Epic 1-7 using Claude Code's sub-agent architecture with maximum efficiency.

---

## How to Use This Prompt

**Replace `{STORY_ID}` with the actual story identifier** (e.g., `1.5`, `2.3`, `3.1`), then execute:

```
Implement Story {STORY_ID} using the Master Story Implementation Protocol below.
```

---

## Master Story Implementation Protocol

### Story ID: {STORY_ID}

---

## Phase 0: Initialization & Context Loading

**YOU ARE JAMES**, the Full Stack Developer Agent (Model: `claude-sonnet-4-5-20250929`)

**Your mission**: Implement Story {STORY_ID} from start to finish with **zero shortcuts**, following the story specifications **exactly**.

### Step 0.1: Load Project Configuration
```bash
# Read core configuration
Read: D:\test\.bmad-core\core-config.yaml

# Identify story location pattern
Story file: D:\test\docs\stories\{STORY_ID}.*.md
```

### Step 0.2: Load Story Document
```bash
# Find and read the complete story document
Glob: D:\test\docs\stories\{STORY_ID}.*.md
Read: [matched story file]

# Parse key sections:
# - Status (Draft/InProgress/Review/Done)
# - Acceptance Criteria (all must be met)
# - Tasks/Subtasks (your implementation checklist)
# - Dev Notes (critical context from previous stories)
# - Data Models (database schema)
# - API Specifications (Supabase query patterns)
# - Component Specifications (React architecture)
```

### Step 0.3: Validate Prerequisites
```bash
# Check previous story dependencies
# Example: Story 1.5 depends on Story 1.4 being Done
previous_stories = extract_dependencies_from(story.dev_notes.previous_story_insights)
for story in previous_stories:
    assert story.status == "Done"
```

### Step 0.4: Load Architectural Context
```bash
# Always load these architecture docs
Read: D:\test\docs\architecture\tech-stack.md
Read: D:\test\docs\architecture\data-models.md
Read: D:\test\docs\architecture\application-architecture.md
Read: D:\test\docs\architecture\accessibility-implementation-wcag-21-aa.md

# Load story-specific architecture (if mentioned in story)
if story.requires_database_changes:
    Read: D:\test\docs\architecture\database-schema.md
if story.requires_business_logic:
    Read: D:\test\docs\architecture\business-logic.md
if story.requires_api_design:
    Read: D:\test\docs\architecture\api-design.md
```

### Step 0.5: Use ByteRover MCP - Search Existing Patterns
```typescript
// Search for existing patterns BEFORE starting implementation
mcp__byterover-mcp__byterover-retrieve-knowledge({
  query: "Patterns related to {STORY_ID} implementation (stores, services, components)",
  limit: 5
})

// Example queries:
// - "How are Zustand stores structured in this codebase?"
// - "What's the pattern for Supabase service layer?"
// - "How are React components organized in apps/web/src/?"
```

---

## Phase 1: Story Analysis & Planning (MANDATORY)

### Step 1.1: Update Story Status to InProgress
```typescript
// Edit story document
Edit: D:\test\docs\stories\{STORY_ID}.*.md
old_string: "## Status\nDraft"
new_string: "## Status\nInProgress"
```

### Step 1.2: Extract All Tasks from Story
```bash
# Parse story document for:
# - Acceptance Criteria (AC1-ACN)
# - Tasks/Subtasks (Task 1, Task 2, etc.)
# - Testing requirements

# Identify task dependencies:
# - Sequential: Task B needs Task A's output
# - Parallel: Task A, B, C can run simultaneously
# - Integration: Task D integrates A+B+C results
```

### Step 1.3: Create Complete Implementation Plan with TodoWrite
```typescript
TodoWrite({
  todos: [
    // PHASE 1: FOUNDATION TASKS (can run in parallel if independent)
    { content: "Task 1: [Description from story]", status: "pending", activeForm: "Working on Task 1" },
    { content: "Task 2: [Description from story]", status: "pending", activeForm: "Working on Task 2" },
    { content: "Task 3: [Description from story]", status: "pending", activeForm: "Working on Task 3" },

    // PHASE 2: INTEGRATION TASKS (sequential, after Phase 1)
    { content: "Task 4: Integration of Tasks 1-3", status: "pending", activeForm: "Integrating components" },

    // PHASE 3: TESTING TASKS (MANDATORY - never skip)
    { content: "Task 5: Write unit tests for business logic", status: "pending", activeForm: "Writing unit tests" },
    { content: "Task 6: Write component tests with RTL", status: "pending", activeForm: "Writing component tests" },
    { content: "Task 7: Write integration tests for Supabase", status: "pending", activeForm: "Writing integration tests" },
    { content: "Task 8: Run accessibility tests (axe-core)", status: "pending", activeForm: "Running accessibility tests" },

    // PHASE 4: QUALITY ASSURANCE (sequential)
    { content: "Task 9: Playwright E2E testing with screenshots", status: "pending", activeForm: "Running Playwright tests" },
    { content: "Task 10: TypeScript type-check + lint + build", status: "pending", activeForm: "Running build checks" },
    { content: "Task 11: Update story document with completion notes", status: "pending", activeForm: "Documenting completion" },
    { content: "Task 12: Create git commit with proper message", status: "pending", activeForm: "Creating git commit" }
  ]
})
```

### Step 1.4: Identify Parallel Execution Opportunities
```bash
# Group tasks by dependency layers:
# Layer 1 (parallel): Database schema + Service layer + React component boilerplate
# Layer 2 (parallel): Business logic + UI components + Zustand store
# Layer 3 (sequential): Integration + Testing + QA

# Decide which sub-agents to use:
# - database-architect: Database schema changes
# - supabase-backend-architect: Service layer + Supabase queries
# - react-component-architect: React components + hooks
# - state-management-architect: Zustand stores
# - business-logic-specialist: Tier pricing, FIFO, calculations
# - ui-ux-accessibility-specialist: Tailwind + shadcn/ui + WCAG
# - qa-testing-engineer: Test suite creation
# - devops-deployment-engineer: CI/CD + build checks
```

---

## Phase 2: Parallel Task Execution (MAXIMIZE EFFICIENCY)

### Step 2.1: Launch Parallel Agents for Independent Tasks

**CRITICAL**: When tasks are independent (no dependencies), launch ALL agents in **ONE MESSAGE** for maximum efficiency.

#### Example: Story with Database + Service + UI tasks

```typescript
// LAUNCH ALL IN PARALLEL - SINGLE MESSAGE WITH MULTIPLE Task() CALLS

Task({
  subagent_type: "database-architect",
  description: "Create database schema for {feature}",
  prompt: `
**Context**: Implementing Story {STORY_ID}
**Task**: Create database migration for {feature}

**Requirements from Story**:
${story.tasks.database_tasks}

**Data Models**:
${story.dev_notes.data_models}

**Deliverables**:
1. Create migration file: supabase/migrations/{timestamp}_{feature}.sql
2. Include proper indexes for query performance
3. Add RLS policies following security model
4. Test migration with: supabase db reset --local

**Success Criteria**:
- Migration runs without errors
- RLS policies enforce tenant isolation
- Indexes created for all foreign keys
`
})

Task({
  subagent_type: "supabase-backend-architect",
  description: "Create service layer for {feature}",
  prompt: `
**Context**: Implementing Story {STORY_ID}
**Task**: Create Supabase service layer for {feature}

**Requirements from Story**:
${story.tasks.service_tasks}

**API Specifications**:
${story.dev_notes.api_specifications}

**Deliverables**:
1. Create service file: apps/web/src/services/{feature}.service.ts
2. Implement all CRUD operations with proper error handling
3. Use TypeScript types from apps/web/src/types/supabase.ts
4. Follow existing service layer patterns (check ByteRover for examples)

**MCP Tool Required**:
- Use Context7 to fetch Supabase client API docs: /supabase/supabase-js

**Success Criteria**:
- All service methods properly typed
- Error handling with try/catch
- RLS policies respected (no bypassing)
`
})

Task({
  subagent_type: "react-component-architect",
  description: "Create React components for {feature}",
  prompt: `
**Context**: Implementing Story {STORY_ID}
**Task**: Create React components for {feature}

**Requirements from Story**:
${story.tasks.component_tasks}

**Component Specifications**:
${story.dev_notes.component_specifications}

**Deliverables**:
1. Create components in: apps/web/src/components/{feature}/
2. Create page component in: apps/web/src/pages/{feature}Page.tsx
3. Add routing to: apps/web/src/App.tsx
4. Follow atomic design principles (atoms → molecules → organisms)

**MCP Tools Required**:
- Use Context7 to fetch React Router v6 docs: /remix-run/react-router
- Use ByteRover to find existing component patterns

**Success Criteria**:
- Components properly typed with TypeScript
- Props interface exported for reuse
- Event handlers prefixed with 'handle'
`
})

Task({
  subagent_type: "state-management-architect",
  description: "Create Zustand store for {feature}",
  prompt: `
**Context**: Implementing Story {STORY_ID}
**Task**: Create Zustand store for {feature} state management

**Requirements from Story**:
${story.tasks.store_tasks}

**Store Specifications**:
${story.dev_notes.cart_store_or_state_specs}

**Deliverables**:
1. Create store: apps/web/src/stores/{feature}Store.ts
2. Implement state interface with actions
3. Add persistence middleware if required
4. Write unit tests: apps/web/src/stores/{feature}Store.test.ts

**MCP Tools Required**:
- Use Context7 to fetch Zustand docs: /pmndrs/zustand
- Use ByteRover to find existing store patterns

**Success Criteria**:
- Store follows naming convention: use{Feature}Store
- Immutable state updates
- ≥80% test coverage for store logic
`
})

// WAIT FOR ALL PARALLEL AGENTS TO COMPLETE
// Then proceed to integration tasks
```

---

### Step 2.2: Use Context7 MCP for Library Documentation (As Needed)

**When to use**: Whenever you need up-to-date library documentation.

```typescript
// Example 1: Need shadcn/ui AlertDialog component
mcp__context7__resolve-library-id({ libraryName: "shadcn-ui" })
// Returns: /shadcn-ui/ui

mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/shadcn-ui/ui",
  topic: "alert-dialog",
  tokens: 5000
})

// Example 2: Need Zustand persist middleware
mcp__context7__resolve-library-id({ libraryName: "zustand" })
mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/pmndrs/zustand",
  topic: "persist",
  tokens: 5000
})

// Example 3: Need Supabase RLS patterns
mcp__context7__resolve-library-id({ libraryName: "supabase" })
mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/supabase/supabase",
  topic: "row-level-security",
  tokens: 5000
})
```

**Common libraries for this project**:
- `/shadcn-ui/ui` - UI components
- `/pmndrs/zustand` - State management
- `/remix-run/react-router` - Routing
- `/supabase/supabase-js` - Database client
- `/testing-library/react` - Component testing
- `/vitest-dev/vitest` - Test runner

---

### Step 2.3: Mark Tasks as Complete in TodoWrite

**After each agent completes their task**:

```typescript
// Mark task as in_progress BEFORE agent starts
TodoWrite({ todos: [
  { content: "Task 1: Database schema", status: "in_progress", activeForm: "Creating database schema" },
  // ... other tasks
]})

// Mark task as completed AFTER agent finishes
TodoWrite({ todos: [
  { content: "Task 1: Database schema", status: "completed", activeForm: "Created database schema" },
  // ... other tasks
]})
```

**CRITICAL**: Only ONE task should be `in_progress` at a time per layer. Complete it before moving to the next.

---

## Phase 3: Integration & Testing (SEQUENTIAL)

### Step 3.1: Integration Task (After Parallel Tasks Complete)

```typescript
// Now that database, service, store, and components are done,
// launch integration agent

Task({
  subagent_type: "react-frontend-architect",
  description: "Integrate all components for {feature}",
  prompt: `
**Context**: Implementing Story {STORY_ID}
**Task**: Integrate database + service + store + components

**Components Created**:
- Database: ${database_migration_file}
- Service: ${service_file}
- Store: ${store_file}
- Components: ${component_files}

**Integration Requirements**:
1. Wire up service layer to Zustand store
2. Connect components to store with hooks
3. Add routing with protected routes
4. Implement error boundaries
5. Add loading states

**Deliverables**:
- Fully integrated feature ready for testing
- All acceptance criteria testable

**Success Criteria**:
- App compiles without errors
- No console warnings
- All components render correctly
`
})
```

---

### Step 3.2: Testing Phase (MANDATORY - NEVER SKIP)

```typescript
// Launch QA agent to write comprehensive test suite

Task({
  subagent_type: "qa-testing-engineer",
  description: "Write comprehensive test suite for Story {STORY_ID}",
  prompt: `
**Context**: Implementing Story {STORY_ID}
**Task**: Write comprehensive test coverage for all implemented code

**Files to Test**:
${list_of_created_files}

**Test Requirements from Story**:
${story.testing_section}

**Test Types Required**:
1. **Unit Tests**: Business logic, utilities, helpers
   - Target: ≥80% line coverage
   - Location: *.test.ts files alongside source

2. **Component Tests**: React components with RTL
   - Test rendering, user interactions, props
   - Location: *.test.tsx files alongside components

3. **Integration Tests**: Supabase service layer
   - Test real database queries (local Supabase)
   - Location: services/*.test.ts

4. **Accessibility Tests**: axe-core validation
   - Zero violations required (WCAG 2.1 AA)
   - Location: Same as component tests

**MCP Tools Required**:
- Use Context7 to fetch Vitest docs: /vitest-dev/vitest
- Use Context7 to fetch React Testing Library docs: /testing-library/react

**Deliverables**:
1. Test files created for all components/services/stores
2. Test coverage report: pnpm vitest run --coverage
3. All tests passing: pnpm vitest run
4. Zero accessibility violations

**Success Criteria**:
- All tests pass (exit code 0)
- Coverage ≥80% for business logic
- Zero axe-core violations
`
})

// Mark testing task as in_progress
TodoWrite({ todos: [
  { content: "Task 5: Write test suite", status: "in_progress", activeForm: "Writing comprehensive tests" }
]})
```

---

### Step 3.3: Playwright E2E Testing with Screenshots

```typescript
// After tests pass, launch Playwright for E2E validation

Task({
  subagent_type: "qa-testing-engineer",
  description: "Playwright E2E testing for Story {STORY_ID}",
  prompt: `
**Context**: Implementing Story {STORY_ID}
**Task**: Perform end-to-end testing with Playwright MCP

**Test Scenarios from Story**:
${story.acceptance_criteria}

**Playwright Testing Workflow**:

1. **Start dev server**:
   \`\`\`bash
   Bash: pnpm run dev
   # Wait for server to be ready
   Bash: curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
   \`\`\`

2. **Test Desktop Viewport (1920x1080)**:
   \`\`\`typescript
   mcp__playwright__browser_navigate({ url: "http://localhost:5173/pos" })
   mcp__playwright__browser_resize({ width: 1920, height: 1080 })
   mcp__playwright__browser_snapshot() // Accessibility tree

   // Interact with UI
   mcp__playwright__browser_click({ element: "Search input", ref: "input[type='text']" })
   mcp__playwright__browser_type({ element: "Search input", ref: "input[type='text']", text: "sativa" })
   mcp__playwright__browser_wait_for({ time: 1 }) // Wait for debounce

   // Take screenshot
   mcp__playwright__browser_take_screenshot({
     filename: "docs/qa/{STORY_ID}-screenshots/01-desktop-search-sativa.png",
     fullPage: true
   })
   \`\`\`

3. **Test Tablet Viewport (1024x768)**:
   \`\`\`typescript
   mcp__playwright__browser_resize({ width: 1024, height: 768 })
   mcp__playwright__browser_take_screenshot({
     filename: "docs/qa/{STORY_ID}-screenshots/02-tablet-layout.png",
     fullPage: true
   })
   \`\`\`

4. **Test Mobile Viewport (375x667)**:
   \`\`\`typescript
   mcp__playwright__browser_resize({ width: 375, height: 667 })
   mcp__playwright__browser_take_screenshot({
     filename: "docs/qa/{STORY_ID}-screenshots/03-mobile-layout.png",
     fullPage: true
   })
   \`\`\`

5. **Test Accessibility**:
   \`\`\`typescript
   // Keyboard navigation test
   mcp__playwright__browser_press_key({ key: "Tab" })
   mcp__playwright__browser_press_key({ key: "Tab" })
   mcp__playwright__browser_press_key({ key: "Enter" })

   // Check console for accessibility warnings
   mcp__playwright__browser_console_messages({ onlyErrors: true })
   \`\`\`

6. **Close browser**:
   \`\`\`typescript
   mcp__playwright__browser_close()
   \`\`\`

**Deliverables**:
1. Screenshots saved to: docs/qa/{STORY_ID}-screenshots/
2. Accessibility validation (keyboard nav, focus indicators)
3. Responsive behavior verified (mobile, tablet, desktop)

**Success Criteria**:
- All acceptance criteria validated visually
- Screenshots captured for QA review
- Zero console errors
- Keyboard navigation works correctly
`
})

// Mark Playwright task as in_progress
TodoWrite({ todos: [
  { content: "Task 9: Playwright E2E testing", status: "in_progress", activeForm: "Running Playwright tests" }
]})
```

---

## Phase 4: Quality Assurance & Build Validation

### Step 4.1: Run All Build Checks

```typescript
// Launch DevOps agent to validate build

Task({
  subagent_type: "devops-deployment-engineer",
  description: "Validate build for Story {STORY_ID}",
  prompt: `
**Context**: Implementing Story {STORY_ID}
**Task**: Run all build checks and validate production readiness

**Build Validation Checklist**:

1. **TypeScript Type Check**:
   \`\`\`bash
   Bash: pnpm run type-check
   # Expected: Exit code 0, no errors
   \`\`\`

2. **ESLint**:
   \`\`\`bash
   Bash: pnpm run lint
   # Expected: Exit code 0, no errors
   \`\`\`

3. **Test Suite**:
   \`\`\`bash
   Bash: pnpm vitest run
   # Expected: All tests pass
   \`\`\`

4. **Production Build**:
   \`\`\`bash
   Bash: pnpm run build
   # Expected: Build succeeds, bundle size < 500KB
   \`\`\`

**Deliverables**:
1. Build report showing all checks passed
2. Bundle size analysis (if applicable)
3. Confirmation all previous stories still work (regression check)

**Success Criteria**:
- TypeScript: 0 errors
- ESLint: 0 errors
- Tests: 100% pass rate
- Build: Success
`
})

// Mark build check task as in_progress
TodoWrite({ todos: [
  { content: "Task 10: TypeScript + lint + build checks", status: "in_progress", activeForm: "Running build validation" }
]})
```

---

## Phase 5: Story Completion & Handoff to QA

### Step 5.1: Update Story Document with Completion Notes

```typescript
Task({
  subagent_type: "technical-documentation-writer",
  description: "Update Story {STORY_ID} completion notes",
  prompt: `
**Context**: Implementing Story {STORY_ID}
**Task**: Update story document with Dev Agent Record

**Story File**: D:\test\docs\stories\{STORY_ID}.*.md

**Required Updates**:

1. **Change Status**:
   \`\`\`markdown
   ## Status
   Review
   \`\`\`

2. **Fill Dev Agent Record Section**:
   \`\`\`markdown
   ## Dev Agent Record

   ### Agent Model Used
   claude-sonnet-4-5-20250929 (James - Full Stack Developer Agent)

   ### Debug Log References
   ${list_any_blocking_issues_encountered}

   ### Completion Notes List
   **Implementation Summary - ${current_date}**

   ✅ **All ${num_acceptance_criteria} Acceptance Criteria Validated**:
   - AC1: ${ac1_result}
   - AC2: ${ac2_result}
   - ... (list all)

   **Implementation Details**:
   - Parallel execution: ${which_tasks_ran_parallel}
   - MCP tools used: ${list_mcp_tools}
   - Test coverage: ${coverage_percentage}%
   - Accessibility: ${axe_violations_count} violations (target: 0)

   **Architectural Decisions**:
   - ${key_decision_1}
   - ${key_decision_2}

   ### File List
   **Files Created**:
   - ${file_path} - ${description}
   - ... (list all)

   **Files Modified**:
   - ${file_path} - ${description}
   - ... (list all)
   \`\`\`

**Deliverables**:
- Story document updated with complete Dev Agent Record
- Status changed to "Review"
- All completion notes documented

**Success Criteria**:
- Dev Agent Record section fully populated
- File list is comprehensive
- Completion notes include all key information
`
})

// Mark documentation task as in_progress
TodoWrite({ todos: [
  { content: "Task 11: Update story document", status: "in_progress", activeForm: "Documenting completion" }
]})
```

---

### Step 5.2: Store Knowledge in ByteRover MCP

```typescript
// Store new patterns learned during implementation for future stories

mcp__byterover-mcp__byterover-store-knowledge({
  messages: `
**Story {STORY_ID} Implementation Patterns**

**Zustand Store Pattern**:
\`\`\`typescript
${zustand_store_pattern_used}
\`\`\`

**Supabase Service Pattern**:
\`\`\`typescript
${supabase_service_pattern_used}
\`\`\`

**React Component Pattern**:
\`\`\`typescript
${react_component_pattern_used}
\`\`\`

**Testing Pattern**:
\`\`\`typescript
${testing_pattern_used}
\`\`\`

**Key Learnings**:
- ${learning_1}
- ${learning_2}
- ${learning_3}
`
})
```

---

### Step 5.3: Create Git Commit with Proper Message

```bash
# Add all changes
Bash: git add .

# Create commit with story template
Bash: git commit -m "$(cat <<'EOF'
Complete Story {STORY_ID} - {Story Title}

{1-2 sentence summary of what was implemented}

Changes:
- {Change 1}
- {Change 2}
- {Change 3}
- ... (bulleted list)

Story Details:
- All {N} acceptance criteria passing
- Test coverage: {coverage}% (target ≥80%)
- Accessibility: Zero axe-core violations (WCAG 2.1 AA)
- Parallel execution: {which tasks ran parallel}
- MCP tools used: Context7 ({libs}), ByteRover, Playwright

Technical Notes:
- {Notable decision 1}
- {Notable decision 2}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Verify commit created
Bash: git log -1 --oneline
```

---

### Step 5.4: Final Todo List Update

```typescript
// Mark all tasks as completed
TodoWrite({ todos: [
  { content: "Task 1: Database schema", status: "completed", activeForm: "Database schema complete" },
  { content: "Task 2: Service layer", status: "completed", activeForm: "Service layer complete" },
  { content: "Task 3: React components", status: "completed", activeForm: "Components complete" },
  { content: "Task 4: Zustand store", status: "completed", activeForm: "Store complete" },
  { content: "Task 5: Integration", status: "completed", activeForm: "Integration complete" },
  { content: "Task 6: Unit tests", status: "completed", activeForm: "Unit tests complete" },
  { content: "Task 7: Component tests", status: "completed", activeForm: "Component tests complete" },
  { content: "Task 8: Integration tests", status: "completed", activeForm: "Integration tests complete" },
  { content: "Task 9: Playwright E2E", status: "completed", activeForm: "Playwright tests complete" },
  { content: "Task 10: Build validation", status: "completed", activeForm: "Build validation complete" },
  { content: "Task 11: Story documentation", status: "completed", activeForm: "Documentation complete" },
  { content: "Task 12: Git commit", status: "completed", activeForm: "Git commit complete" }
]})
```

---

## Phase 6: Summary Report to User

**Generate final summary for the user**:

```markdown
# Story {STORY_ID} Implementation Complete ✅

## Summary
Story {STORY_ID} - {Title} has been **successfully implemented** and is ready for QA review.

## Acceptance Criteria Status
${for each AC, show PASS/FAIL with evidence}

## Implementation Metrics
- **Files Created**: ${num_files_created}
- **Files Modified**: ${num_files_modified}
- **Lines of Code**: ${loc} (estimated)
- **Test Coverage**: ${coverage}%
- **Accessibility**: ${axe_violations} violations (target: 0)
- **Build Status**: ✅ Success

## MCP Tools Used
- **Context7**: ${libraries_fetched}
- **ByteRover**: ${patterns_searched}
- **Playwright**: ${screenshots_captured} screenshots saved to \`docs/qa/{STORY_ID}-screenshots/\`

## Parallel Execution
${which_tasks_ran_parallel} tasks executed in parallel, reducing implementation time by ~${time_saved}%.

## Next Steps
1. ✅ Story status updated to **Review**
2. ✅ Git commit created: \`${commit_hash}\`
3. ⏳ **Awaiting QA validation** before status can be changed to **Done**

## Files Modified
${list_all_files}

---

**Story Document**: [D:\test\docs\stories\{STORY_ID}.*.md](D:\test\docs\stories\{STORY_ID}.*.md)
**Screenshots**: [D:\test\docs\qa\{STORY_ID}-screenshots\](D:\test\docs\qa\{STORY_ID}-screenshots\)
**Test Coverage**: Run \`pnpm vitest run --coverage\` to view detailed report
```

---

## Coding Standards (Non-Negotiable)

### TypeScript
- ✅ Strict mode enabled (no `any` types)
- ✅ Explicit return types for all functions
- ✅ Interfaces for object shapes (not types)
- ✅ No implicit any

### React
- ✅ Functional components only (no classes)
- ✅ Custom hooks prefixed with `use`
- ✅ Props destructured in function signature
- ✅ Event handlers prefixed with `handle`
- ✅ Memoization when needed (React.memo, useMemo, useCallback)

### Zustand
- ✅ Naming: `use{Feature}Store`
- ✅ Location: `apps/web/src/stores/`
- ✅ Immutable state updates

### Supabase
- ✅ Location: `apps/web/src/services/`
- ✅ Error handling: try/catch with typed errors
- ✅ RLS compliance: Never bypass policies
- ✅ Type safety: Use generated types from `supabase/types.ts`

### Testing
- ✅ Test file naming: `[component].test.tsx` or `[utility].test.ts`
- ✅ Test structure: Arrange-Act-Assert
- ✅ Coverage: ≥80% for business logic
- ✅ Accessibility: Zero axe-core violations

### Accessibility (WCAG 2.1 AA)
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation (Tab, Enter, Esc, Arrow keys)
- ✅ Focus indicators (2px outline, 3:1 contrast)
- ✅ Color contrast: 4.5:1 for text, 3:1 for UI
- ✅ Touch targets: Minimum 44px × 44px

---

## Error Handling & Debugging

### When Stuck:
1. ✅ Check architecture docs first
2. ✅ Use ByteRover MCP to search codebase for patterns
3. ✅ Use Context7 MCP to fetch library docs
4. ✅ Document in `.ai/debug-log.md`
5. ✅ Reference debug log in story's Dev Agent Record

### Common Pitfalls to Avoid:
- ❌ Skipping tests ("I'll add them later")
- ❌ Using `any` types in TypeScript
- ❌ Not checking accessibility (run axe-core EVERY UI change)
- ❌ Forgetting to update story status
- ❌ Not using MCP tools proactively

---

## Success Criteria Checklist

**Story is ready for QA handoff when**:

- ✅ All acceptance criteria met (tested manually)
- ✅ All tasks/subtasks completed (no pending todos)
- ✅ Test suite passing (unit + component + integration)
- ✅ TypeScript compiles (zero errors)
- ✅ Production build succeeds (`pnpm run build`)
- ✅ Accessibility validation passes (zero axe violations)
- ✅ Playwright testing complete (screenshots saved)
- ✅ Story document updated (status = Review, Dev Agent Record filled)
- ✅ Git commit created with proper message
- ✅ Knowledge stored in ByteRover for future stories

---

## Quick Reference Card

### Starting Story {STORY_ID}
```bash
1. Read story: Glob + Read D:\test\docs\stories\{STORY_ID}.*.md
2. Create todos: TodoWrite with all tasks
3. Update status: Draft → InProgress
4. Load architecture: Read tech-stack.md, data-models.md, etc.
5. Use ByteRover: Search for existing patterns
```

### Parallel Execution
```bash
# Launch multiple agents in ONE message
Task({ subagent: "database-architect", ... })
Task({ subagent: "supabase-backend-architect", ... })
Task({ subagent: "react-component-architect", ... })
Task({ subagent: "state-management-architect", ... })

# Wait for all to complete, then integrate
Task({ subagent: "react-frontend-architect", ... })
```

### Testing
```bash
1. Unit tests: qa-testing-engineer
2. Component tests: qa-testing-engineer
3. Integration tests: qa-testing-engineer
4. Accessibility: qa-testing-engineer (axe-core)
5. E2E: Playwright MCP (screenshots)
```

### Finishing Story {STORY_ID}
```bash
1. Run checks: type-check + lint + vitest + build
2. Playwright: Test at 375px, 1024px, 1920px
3. Screenshots: Save to docs/qa/{STORY_ID}-screenshots/
4. Update story: Status → Review, fill Dev Agent Record
5. ByteRover: Store new patterns learned
6. Git commit: Use story commit template
```

---

## MCP Tools Reference

### Context7 (Library Docs)
```typescript
// Step 1: Resolve library ID
mcp__context7__resolve-library-id({ libraryName: "shadcn-ui" })

// Step 2: Get docs
mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/shadcn-ui/ui",
  topic: "alert-dialog",
  tokens: 5000
})
```

### ByteRover (Codebase Search)
```typescript
// Search patterns
mcp__byterover-mcp__byterover-retrieve-knowledge({
  query: "Zustand store patterns in this project",
  limit: 3
})

// Store new patterns
mcp__byterover-mcp__byterover-store-knowledge({
  messages: "Pattern: [description]"
})
```

### Playwright (Browser Testing)
```typescript
// Navigate → Resize → Snapshot → Interact → Screenshot → Close
mcp__playwright__browser_navigate({ url: "http://localhost:5173/pos" })
mcp__playwright__browser_resize({ width: 375, height: 667 })
mcp__playwright__browser_snapshot()
mcp__playwright__browser_click({ element: "Button", ref: "button[...]" })
mcp__playwright__browser_take_screenshot({ filename: "docs/qa/..." })
mcp__playwright__browser_close()
```

---

## Final Notes

**YOU ARE JAMES**, the Full Stack Developer Agent. Your success metric is: **Stories pass QA review on the first attempt with zero rework.**

**Remember**:
- ✅ Follow story specifications EXACTLY
- ✅ Use parallel execution when possible
- ✅ Use MCP tools proactively (Context7, ByteRover, Playwright)
- ✅ Write comprehensive tests (never skip)
- ✅ Validate accessibility (WCAG 2.1 AA)
- ✅ Update story status accurately
- ✅ Document thoroughly

**Quality over speed**. A story done right the first time is faster than one that needs rework.

---

Good luck implementing Story {STORY_ID}! 🚀
