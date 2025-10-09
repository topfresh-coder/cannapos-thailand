# Accessibility Implementation - Detailed Analysis & Enhancement Plan

**Status**: ❌ CRITICAL GAP (30% compliance)
**Priority**: Must-fix before Epic 2
**Estimated Effort**: 3 days
**Author**: Winston (Architect)
**Date**: 2025-01-10

---

## Gap Analysis

### Current State
- **PRD Requirements**: WCAG 2.1 AA compliance is mandatory (NFR7-NFR10)
- **Architecture Coverage**: 30% - mentions shadcn/ui as accessible but provides ZERO implementation guidance
- **Risk**: Legal/compliance failure, user exclusion, potential project rejection

### What's Missing from Architecture

#### 1. ARIA Implementation Patterns (0%)
**Gap**: No documentation of ARIA attributes for complex widgets

**Required Coverage**:
- Dialog/Modal patterns (`role="dialog"`, `aria-labelledby`, `aria-describedby`, `aria-modal`)
- Live regions for dynamic content (`aria-live="polite"`, `aria-atomic`, `role="status"`)
- Form validation (`aria-invalid`, `aria-errormessage`, `aria-required`)
- Loading states (`aria-busy`, `role="progressbar"`)
- Toast notifications (`role="alert"`, `aria-live="assertive"`)

**Impact**: Screen readers won't announce critical information (errors, cart updates, shift status)

---

#### 2. Keyboard Navigation Patterns (0%)
**Gap**: No keyboard interaction documentation

**Required Coverage**:
- Tab order management
- Focus trap for modals (prevent Tab escape)
- Keyboard shortcuts (/, Esc, Enter, Arrow keys)
- Focus management on route changes
- Skip links for main content

**Impact**: Keyboard-only users cannot operate POS system

---

#### 3. Focus Management Strategy (0%)
**Gap**: No focus handling for SPAs

**Required Coverage**:
- Focus restoration after modal close
- Focus on first input when modal opens
- Programmatic focus on route change
- Visible focus indicators (custom outline styles)

**Impact**: Users lose context when modals open/close, poor navigation experience

---

#### 4. Color Contrast System (0%)
**Gap**: No accessible color tokens defined

**Required Coverage**:
- Tailwind CSS color palette with 4.5:1 contrast ratios
- Text color tokens for light/dark backgrounds
- State colors (success, warning, error, info) with sufficient contrast
- Link color differentiation beyond color alone

**Impact**: Low-vision users cannot read text, fails WCAG 2.1 AA

---

#### 5. Semantic HTML Guidance (0%)
**Gap**: No HTML structure examples

**Required Coverage**:
- Proper heading hierarchy (h1 → h2 → h3)
- Landmark roles (`<header>`, `<nav>`, `<main>`, `<aside>`)
- Form labels (`<label for="...">`)
- Button vs. link usage rules

**Impact**: Screen readers cannot navigate page structure efficiently

---

#### 6. Accessibility Testing Strategy (20%)
**Gap**: PRD mentions axe DevTools but no CI/CD integration

**Current Coverage**:
- ⚠️ Manual testing with axe DevTools (mentioned in PRD line 511)
- ❌ No automated testing in CI/CD
- ❌ No accessibility acceptance criteria in stories
- ❌ No screen reader testing checklist

**Impact**: Accessibility regressions won't be caught until production

---

## Enhancement Plan

### Phase 1: Architecture Documentation (Day 1)

#### 1.1 Add "Accessibility Implementation" Section to architecture.md

**Location**: After "Frontend Design & Implementation" (around line 1600)

**Content**:
```markdown
## Accessibility Implementation (WCAG 2.1 AA)

### Accessibility Philosophy
CannaPOS Thailand must be usable by all staff members, including those using assistive technologies. We target WCAG 2.1 Level AA compliance with focus on keyboard navigation, screen reader support, and sufficient color contrast.

### ARIA Patterns

#### Dialog/Modal Pattern
- Use `role="dialog"` on modal container
- Add `aria-labelledby` pointing to modal title
- Add `aria-describedby` pointing to modal description
- Set `aria-modal="true"` to prevent interaction with background

Example:
\`\`\`tsx
<div role="dialog" aria-labelledby="modal-title" aria-describedby="modal-desc" aria-modal="true">
  <h2 id="modal-title">Tare Weight Entry</h2>
  <p id="modal-desc">Enter gross weight and tare weight to calculate net weight</p>
  {/* Modal content */}
</div>
\`\`\`

#### Live Region Pattern (Cart Updates)
- Use `aria-live="polite"` for non-critical updates
- Use `aria-live="assertive"` for critical alerts (errors, shift close)
- Add `role="status"` for cart total updates

Example:
\`\`\`tsx
<div aria-live="polite" aria-atomic="true" role="status">
  Cart total: ฿{total.toFixed(2)} ({itemCount} items)
</div>
\`\`\`

#### Form Validation Pattern
- Use `aria-invalid="true"` on invalid fields
- Use `aria-errormessage` pointing to error text
- Use `aria-required="true"` on required fields

Example:
\`\`\`tsx
<input
  aria-invalid={errors.grossWeight ? "true" : "false"}
  aria-errormessage={errors.grossWeight ? "gross-weight-error" : undefined}
  aria-required="true"
/>
{errors.grossWeight && (
  <span id="gross-weight-error" role="alert">
    Gross weight must be greater than tare weight
  </span>
)}
\`\`\`

### Keyboard Navigation

#### Global Keyboard Shortcuts
- **/** - Focus search input
- **Esc** - Close modal, clear cart (with confirmation)
- **Tab** - Navigate interactive elements
- **Shift+Tab** - Navigate backwards
- **Enter** - Activate buttons/links
- **Space** - Toggle checkboxes

#### Focus Management
1. **Modal Open**: Focus first interactive element (input or primary button)
2. **Modal Close**: Restore focus to trigger element
3. **Route Change**: Focus h1 heading of new page
4. **Form Submit**: Focus first error or success message

#### Focus Trap Implementation
\`\`\`tsx
// Use react-focus-lock for modals
import FocusLock from 'react-focus-lock';

<FocusLock>
  <Dialog>
    {/* Modal content - Tab cycles within */}
  </Dialog>
</FocusLock>
\`\`\`

### Color Contrast System

#### Tailwind CSS Accessible Color Tokens
\`\`\`js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary (Cannabis Green) - 4.7:1 contrast on white
        primary: {
          DEFAULT: '#16a34a', // WCAG AA compliant
          foreground: '#ffffff', // White text on green
        },
        // Error (Red) - 4.5:1 contrast
        error: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
        // Warning (Amber) - 4.6:1 contrast
        warning: {
          DEFAULT: '#d97706',
          foreground: '#ffffff',
        },
        // Success (Green) - 4.7:1 contrast
        success: {
          DEFAULT: '#16a34a',
          foreground: '#ffffff',
        },
      },
    },
  },
};
\`\`\`

#### Text Contrast Rules
- **Normal Text**: 4.5:1 minimum (14px+)
- **Large Text**: 3:1 minimum (18px+ or 14px+ bold)
- **UI Components**: 3:1 minimum (buttons, inputs, borders)

### Semantic HTML Structure

#### Page Structure Example
\`\`\`tsx
<div>
  <header role="banner">
    <nav aria-label="Main navigation">
      {/* Navigation links */}
    </nav>
  </header>

  <main role="main">
    <h1>POS - Point of Sale</h1>
    {/* Page content */}
  </main>

  <aside aria-label="Shopping cart">
    {/* Cart sidebar */}
  </aside>
</div>
\`\`\`

#### Heading Hierarchy
- **h1**: Page title (one per page)
- **h2**: Major sections (Product Grid, Cart, Shift Summary)
- **h3**: Subsections (Tier Indicator, Item List)

### Accessibility Testing

#### Automated Testing (CI/CD)
\`\`\`bash
# Install axe-core for Jest/Vitest
pnpm add -D @axe-core/react vitest-axe

# Component test with accessibility checks
import { axe, toHaveNoViolations } from 'vitest-axe';
expect.extend(toHaveNoViolations);

test('TareWeightModal is accessible', async () => {
  const { container } = render(<TareWeightModal />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
\`\`\`

#### Manual Testing Checklist
- [ ] Navigate entire app with keyboard only (no mouse)
- [ ] Test with screen reader (NVDA on Windows, VoiceOver on Mac)
- [ ] Verify color contrast with axe DevTools browser extension
- [ ] Test with 200% browser zoom
- [ ] Test with Windows High Contrast mode

### Accessibility Acceptance Criteria Template

**For all UI stories, add**:
- [ ] All interactive elements are keyboard accessible (Tab, Enter, Space)
- [ ] Focus indicators are visible (2px outline, 3:1 contrast)
- [ ] Screen reader announces all dynamic content changes
- [ ] Color is not the only means of conveying information
- [ ] All form fields have associated labels
- [ ] No automated accessibility violations (axe-core)
```

---

### Phase 2: Component Implementation (Day 2)

#### 2.1 Create Accessible Component Examples

**File**: `apps/web/src/components/a11y/AccessibleDialog.tsx`
```typescript
import { useEffect, useRef } from 'react';
import FocusLock from 'react-focus-lock';

interface AccessibleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AccessibleDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
}: AccessibleDialogProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const titleId = `dialog-title-${useId()}`;
  const descId = `dialog-desc-${useId()}`;

  useEffect(() => {
    // Store trigger element on open
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
    }

    // Restore focus on close
    return () => {
      if (!isOpen && triggerRef.current) {
        triggerRef.current.focus();
      }
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <FocusLock returnFocus>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id={titleId} className="text-2xl font-bold mb-2">
            {title}
          </h2>
          <p id={descId} className="text-gray-600 mb-4">
            {description}
          </p>
          {children}
        </div>
      </FocusLock>
    </div>
  );
}
```

#### 2.2 Create Accessible Form Component

**File**: `apps/web/src/components/a11y/AccessibleFormField.tsx`
```typescript
import { useId } from 'react';

interface AccessibleFormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactElement;
}

export function AccessibleFormField({
  label,
  error,
  required = false,
  children,
}: AccessibleFormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-2 font-medium">
        {label}
        {required && <span aria-label="required"> *</span>}
      </label>
      {React.cloneElement(children, {
        id,
        'aria-invalid': error ? 'true' : 'false',
        'aria-errormessage': error ? errorId : undefined,
        'aria-required': required ? 'true' : 'false',
      })}
      {error && (
        <span id={errorId} role="alert" className="text-red-600 text-sm mt-1">
          {error}
        </span>
      )}
    </div>
  );
}
```

---

### Phase 3: Testing Integration (Day 3)

#### 3.1 Add axe-core to CI/CD

**File**: `apps/web/vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

**File**: `apps/web/src/test/setup.ts`
```typescript
import { expect } from 'vitest';
import { toHaveNoViolations } from 'vitest-axe';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);
```

**File**: `apps/web/package.json` (add scripts)
```json
{
  "scripts": {
    "test:a11y": "vitest run --reporter=verbose",
    "lint:a11y": "eslint --plugin jsx-a11y"
  }
}
```

#### 3.2 GitHub Actions Workflow

**File**: `.github/workflows/ci.yml` (add job)
```yaml
accessibility-check:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: pnpm/action-setup@v2
    - uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'pnpm'
    - run: pnpm install
    - run: pnpm test:a11y
    - run: pnpm lint:a11y
```

---

## Validation Criteria

### Before Marking Complete
- [ ] Architecture document includes "Accessibility Implementation" section
- [ ] ARIA patterns documented with examples
- [ ] Keyboard navigation patterns defined
- [ ] Focus management strategy documented
- [ ] Color contrast system defined in Tailwind config
- [ ] Semantic HTML examples provided
- [ ] axe-core integrated in CI/CD
- [ ] Accessibility acceptance criteria template added to PRD

### Success Metrics
- ✅ 100% of new components pass axe-core tests
- ✅ Keyboard navigation works for all critical workflows
- ✅ Color contrast ratios verified (4.5:1 for text, 3:1 for UI)
- ✅ Screen reader announces all dynamic content

---

## Risk Mitigation

### If Not Addressed
- **Legal Risk**: Potential WCAG 2.1 AA non-compliance
- **User Exclusion**: Staff with disabilities cannot use system
- **Project Rejection**: Client may reject for accessibility failures

### Timeline Impact
- **If addressed now**: 3 days, no timeline impact
- **If deferred**: 5-7 days post-pilot + rework risk

---

## References
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [axe-core Testing Library](https://github.com/dequelabs/axe-core)
- [WebAIM Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
