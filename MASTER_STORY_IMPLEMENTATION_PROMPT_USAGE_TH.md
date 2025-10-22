# วิธีใช้งาน Master Story Implementation Prompt

## คำอธิบายสั้น ๆ

นี่คือ **prompt แม่แบบแบบครบวงจร** ที่ใช้สำหรับการ implement user story ใด ๆ ใน Epic 1-7 โดยใช้ sub-agent architecture ของ Claude Code พร้อมกับ:

- ✅ **Parallel execution** - รัน agent หลายตัวพร้อมกันเมื่อเป็นไปได้
- ✅ **MCP tools integration** - ใช้ Context7, ByteRover, Playwright อัตโนมัติ
- ✅ **Auto status update** - อัปเดตสถานะ story เมื่อเสร็จ
- ✅ **Complete testing** - รวม unit, component, integration, accessibility, E2E tests
- ✅ **Quality assurance** - ตรวจสอบ TypeScript, lint, build ก่อนส่ง QA

---

## วิธีใช้งาน (3 ขั้นตอน)

### ขั้นที่ 1: เลือก Story ที่ต้องการ Implement

ดูรายการ story ที่มีทั้งหมด:
```bash
# ดู story ทั้งหมดใน docs/stories/
ls docs/stories/

# Example output:
# 1.1.project-setup-dev-environment.md
# 1.2.supabase-backend-setup.md
# 1.3.authentication-system.md
# 1.4.basic-product-catalog-seeding.md
# 1.5.pos-main-screen-product-search-selection.md
# 1.6.cart-management-quantity-adjustment.md
# ... (และอื่น ๆ)
```

### ขั้นที่ 2: แทนที่ {STORY_ID} ใน Prompt

เปิดไฟล์ `MASTER_STORY_IMPLEMENTATION_PROMPT.md` และแทนที่ `{STORY_ID}` ด้วย story ID ที่ต้องการ

**ตัวอย่าง**:

Story ที่ต้องการ implement: **1.6** (Cart Management - Quantity Adjustment)

แทนที่:
```
{STORY_ID} → 1.6
```

### ขั้นที่ 3: Run คำสั่งใน Claude Code

```
Implement Story 1.6 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```

**หรือแบบเต็ม**:
```
Read D:\test\MASTER_STORY_IMPLEMENTATION_PROMPT.md and implement Story 1.6 following ALL phases exactly:
- Phase 0: Load context + story document
- Phase 1: Create implementation plan with TodoWrite
- Phase 2: Launch parallel agents (database, service, components, store)
- Phase 3: Integration + testing (unit, component, integration, accessibility, Playwright E2E)
- Phase 4: Quality assurance (type-check, lint, build)
- Phase 5: Update story document + git commit

Use Context7 for library docs, ByteRover for codebase search, Playwright for E2E testing. Update story status to Review when complete.
```

---

## ตัวอย่างการใช้งานจริง

### Example 1: Implement Story 1.6

**คำสั่ง**:
```
Implement Story 1.6 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```

**ผลลัพธ์ที่คาดหวัง**:
1. ✅ Claude จะอ่าน story 1.6 จาก `docs/stories/1.6.cart-management-quantity-adjustment.md`
2. ✅ สร้าง todo list ด้วย TodoWrite แบ่งเป็น tasks ย่อย ๆ
3. ✅ รัน agent หลายตัวพร้อมกัน:
   - `business-logic-specialist` → อัปเดต cart store logic
   - `react-component-architect` → แก้ไข CartItem component
   - `supabase-backend-architect` → เพิ่ม inventory validation
4. ✅ รวม integration ทั้งหมด
5. ✅ เขียน tests (unit + component + integration + accessibility)
6. ✅ รัน Playwright ถ่าย screenshots ที่ 375px, 1024px, 1920px
7. ✅ รัน type-check + lint + build
8. ✅ อัปเดต story status จาก Draft → InProgress → Review
9. ✅ สร้าง git commit ตาม template

---

### Example 2: Implement Story 2.3 (Epic 2)

**คำสั่ง**:
```
Implement Story 2.3 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```

**ผลลัพธ์**:
- Claude จะทำทุกอย่างเหมือน Example 1 แต่กับ story 2.3 แทน
- ใช้ prompt เดียวกัน แต่เปลี่ยนแค่ story ID

---

## โครงสร้าง Prompt (6 Phases)

### Phase 0: Initialization & Context Loading
- โหลด project config, story document, architecture docs
- ใช้ ByteRover search existing patterns
- ใช้ Context7 fetch library docs

### Phase 1: Story Analysis & Planning
- สร้าง todo list ด้วย TodoWrite
- อัปเดต story status → InProgress
- วิเคราะห์ task dependencies (parallel vs sequential)

### Phase 2: Parallel Task Execution
- รัน agent หลายตัวพร้อมกันใน **1 message**
- database-architect, supabase-backend-architect, react-component-architect, state-management-architect, business-logic-specialist, ui-ux-accessibility-specialist
- ใช้ Context7 fetch docs ตามที่ต้องการ

### Phase 3: Integration & Testing
- รวม components ทั้งหมด
- เขียน tests: unit + component + integration + accessibility
- รัน Playwright E2E testing ถ่าย screenshots

### Phase 4: Quality Assurance
- รัน type-check + lint + vitest + build
- ตรวจสอบ bundle size < 500KB
- regression testing (stories ก่อนหน้ายังทำงานปกติ)

### Phase 5: Story Completion & Handoff
- อัปเดต story document พร้อม Dev Agent Record
- สร้าง git commit ตาม template
- เก็บ knowledge ใน ByteRover สำหรับ stories ต่อไป
- อัปเดต story status → Review
- สรุปผลให้ user

---

## MCP Tools ที่ใช้

### 1. Context7 - Library Documentation
**ใช้เมื่อ**: ต้องการ docs ของ library (shadcn/ui, Zustand, React Router, Supabase)

**Example**:
```typescript
// ขั้นตอนที่ 1: Resolve library ID
mcp__context7__resolve-library-id({ libraryName: "shadcn-ui" })
// Returns: /shadcn-ui/ui

// ขั้นตอนที่ 2: Get docs
mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/shadcn-ui/ui",
  topic: "alert-dialog",
  tokens: 5000
})
```

**Libraries ที่ใช้บ่อย**:
- `/shadcn-ui/ui` - UI components
- `/pmndrs/zustand` - State management
- `/remix-run/react-router` - Routing
- `/supabase/supabase-js` - Database client
- `/testing-library/react` - Component testing
- `/vitest-dev/vitest` - Test runner

---

### 2. ByteRover - Codebase Search
**ใช้เมื่อ**: ต้องการหา patterns ที่มีอยู่แล้วใน codebase

**Example**:
```typescript
// Search patterns
mcp__byterover-mcp__byterover-retrieve-knowledge({
  query: "How are Zustand stores structured in this project?",
  limit: 3
})

// Store new patterns
mcp__byterover-mcp__byterover-store-knowledge({
  messages: "Cart store uses persist middleware with localStorage key 'cannapos-cart'"
})
```

---

### 3. Playwright - Browser Testing
**ใช้เมื่อ**: ต้องการทดสอบ UI จริงใน browser และถ่าย screenshots

**Example**:
```typescript
// 1. Navigate
mcp__playwright__browser_navigate({ url: "http://localhost:5173/pos" })

// 2. Resize (mobile)
mcp__playwright__browser_resize({ width: 375, height: 667 })

// 3. Take snapshot
mcp__playwright__browser_snapshot()

// 4. Interact
mcp__playwright__browser_click({ element: "Add to Cart", ref: "button[...]" })

// 5. Screenshot
mcp__playwright__browser_take_screenshot({
  filename: "docs/qa/1.6-screenshots/mobile.png",
  fullPage: true
})

// 6. Close
mcp__playwright__browser_close()
```

---

## Coding Standards (ห้ามละเมิด)

### TypeScript
- ✅ Strict mode (ห้าม `any`)
- ✅ Explicit return types ทุก function
- ✅ ใช้ `interface` สำหรับ object shapes
- ✅ No implicit any

### React
- ✅ Functional components เท่านั้น (ไม่มี class)
- ✅ Custom hooks ขึ้นต้นด้วย `use`
- ✅ Props destructure ใน function signature
- ✅ Event handlers ขึ้นต้นด้วย `handle`

### Zustand
- ✅ ชื่อ: `use{Feature}Store` (เช่น `useCartStore`)
- ✅ ตำแหน่ง: `apps/web/src/stores/`
- ✅ Immutable state updates

### Testing
- ✅ ชื่อ: `[component].test.tsx` หรือ `[utility].test.ts`
- ✅ Coverage: ≥80% สำหรับ business logic
- ✅ Accessibility: Zero axe-core violations (WCAG 2.1 AA)

---

## Success Criteria (เช็คก่อนส่ง QA)

Story พร้อมส่ง QA เมื่อ:

- ✅ All acceptance criteria ผ่าน (ทดสอบด้วยมือทุก AC)
- ✅ All tasks/subtasks เสร็จ (ไม่มี pending todos)
- ✅ Test suite pass หมด (unit + component + integration)
- ✅ TypeScript compile ผ่าน (zero errors)
- ✅ Production build สำเร็จ (`pnpm run build`)
- ✅ Accessibility validation ผ่าน (zero axe violations)
- ✅ Playwright testing เสร็จ (screenshots saved)
- ✅ Story document อัปเดตแล้ว (status = Review, Dev Agent Record filled)
- ✅ Git commit สร้างแล้วตาม template
- ✅ Knowledge เก็บใน ByteRover แล้ว

---

## Troubleshooting

### ถ้า Agent ติดหรือเกิด Error:

1. ✅ เช็ค architecture docs ก่อน (`docs/architecture/`)
2. ✅ ใช้ ByteRover search codebase หา patterns ที่มีอยู่
3. ✅ ใช้ Context7 fetch library docs
4. ✅ บันทึกใน `.ai/debug-log.md`
5. ✅ อ้างอิง debug log ใน story's Dev Agent Record

### ข้อผิดพลาดที่พบบ่อย:

- ❌ ข้าม tests ("จะเพิ่มทีหลัง") → Tests เป็น MANDATORY
- ❌ ใช้ `any` types ใน TypeScript → ใช้ proper types เสมอ
- ❌ ไม่เช็ค accessibility → รัน axe-core ทุกครั้งที่แก้ UI
- ❌ ลืมอัปเดต story status → อัปเดตตอน start และ finish
- ❌ ไม่ใช้ MCP tools → พวกมันช่วยประหยัดเวลาและป้องกัน errors

---

## Tips & Best Practices

### 1. Parallel Execution
- รัน agent หลายตัวใน **1 message** เพื่อลดเวลา
- Group tasks by layers: database → service → UI → integration
- รอ layer 1 เสร็จก่อนเริ่ม layer 2

### 2. MCP Tools
- ใช้ Context7 **ก่อน** เขียนโค้ดที่เกี่ยวกับ library ใหม่ ๆ
- ใช้ ByteRover **ก่อน** สร้าง pattern ใหม่ (อาจมีอยู่แล้ว)
- ใช้ Playwright **ทุก** story ที่มี UI

### 3. Testing
- เขียน tests **ทันทีหลัง** implement (ไม่ใช่ทีหลัง)
- Target: ≥80% coverage สำหรับ business logic
- Target: Zero axe-core violations สำหรับ UI

### 4. Documentation
- อัปเดต story status ทันที (Draft → InProgress → Review)
- เก็บ knowledge ใน ByteRover สำหรับ stories ต่อไป
- เขียน git commit message ตาม template

---

## FAQ

### Q1: ใช้ prompt เดียวกันได้กับทุก story ใน Epic 1-7 จริงหรือ?
**A:** ใช่ได้ 100% - แค่เปลี่ยน `{STORY_ID}` ตาม story ที่ต้องการ implement

### Q2: ถ้า story มี tasks มากกว่า 10 tasks จะยังใช้ได้หรือเปล่า?
**A:** ได้ครับ - prompt จะสร้าง todo list อัตโนมัติตามจำนวน tasks ใน story

### Q3: ต้องแก้ไข prompt ทุกครั้งที่ใช้หรือเปล่า?
**A:** **ไม่ต้อง** - prompt ถูกออกแบบให้เป็น **reusable template** แค่เปลี่ยน story ID ในคำสั่งที่รัน

### Q4: ถ้า story ไม่มี UI (เช่น database migration only) ใช้ได้หรือเปล่า?
**A:** ได้ครับ - prompt จะข้าม UI-related tasks (Playwright, accessibility) อัตโนมัติ

### Q5: ถ้าต้องการ implement หลาย stories พร้อมกันทำได้หรือเปล่า?
**A:** ได้ แต่แนะนำทำทีละ story เพื่อง่ายต่อ QA review และ debugging

---

## Example: Complete Workflow สำหรับ Story 1.6

### ขั้นตอนที่ 1: Run Command
```
Implement Story 1.6 using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```

### ขั้นตอนที่ 2: Claude จะทำ (อัตโนมัติ)

**Phase 0**: โหลด context
- Read story 1.6 document
- Load architecture docs
- Use ByteRover search patterns

**Phase 1**: Planning
- สร้าง todo list (12 tasks)
- อัปเดต story status → InProgress

**Phase 2**: Parallel execution (4 agents พร้อมกัน)
- business-logic-specialist → Cart store logic
- react-component-architect → CartItem component
- supabase-backend-architect → Inventory validation
- ui-ux-accessibility-specialist → Tailwind styling

**Phase 3**: Integration + Testing
- รวม components
- เขียน tests (unit + component + integration + accessibility)
- รัน Playwright (screenshots 3 viewports)

**Phase 4**: QA
- Run type-check, lint, vitest, build
- Check bundle size
- Regression testing

**Phase 5**: Completion
- อัปเดต story document (Dev Agent Record)
- สร้าง git commit
- เก็บ knowledge ใน ByteRover
- อัปเดต status → Review

### ขั้นตอนที่ 3: ตรวจสอบผลลัพธ์

```bash
# Check story status
cat docs/stories/1.6.cart-management-quantity-adjustment.md | grep "## Status"
# Output: ## Status
#         Review

# Check git commit
git log -1 --oneline
# Output: abc1234 Complete Story 1.6 - Cart Management Quantity Adjustment

# Check screenshots
ls docs/qa/1.6-screenshots/
# Output: 01-desktop-cart.png
#         02-tablet-cart.png
#         03-mobile-cart.png

# Run tests
pnpm vitest run
# Output: Test Suites: 5 passed, 5 total
#         Tests:       32 passed, 32 total
```

---

## สรุป

✅ **1 Prompt = ใช้ได้กับทุก Story ใน Epic 1-7**
✅ **Parallel Execution = ประหยัดเวลา ~50%**
✅ **MCP Tools Integration = Context7 + ByteRover + Playwright**
✅ **Complete Testing = Unit + Component + Integration + Accessibility + E2E**
✅ **Auto Status Update = Draft → InProgress → Review**
✅ **Quality Assurance = TypeScript + Lint + Build ผ่านก่อนส่ง QA**

---

**ใช้งานง่าย แค่ 1 คำสั่ง**:
```
Implement Story {STORY_ID} using the Master Story Implementation Protocol in MASTER_STORY_IMPLEMENTATION_PROMPT.md
```

**แล้ว Claude จะทำให้หมดเลย!** 🚀
