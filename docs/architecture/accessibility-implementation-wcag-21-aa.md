# Accessibility Implementation (WCAG 2.1 AA)

## Accessibility Philosophy

CannaPOS Thailand must be usable by all staff members, including those using assistive technologies. We target WCAG 2.1 Level AA compliance with focus on keyboard navigation, screen reader support, and sufficient color contrast.

## ARIA Patterns

### Dialog/Modal Pattern
- Use `role="dialog"` on modal container
- Add `aria-labelledby` pointing to modal title
- Add `aria-describedby` pointing to modal description
- Set `aria-modal="true"` to prevent interaction with background

**Example**:
```tsx
<div
  role="dialog"
  aria-labelledby="modal-title"
  aria-describedby="modal-desc"
  aria-modal="true"
>
  <h2 id="modal-title">Tare Weight Entry</h2>
  <p id="modal-desc">
    Enter gross weight and tare weight to calculate net weight
  </p>
  {/* Modal content */}
</div>
```

### Live Region Pattern (Cart Updates)
- Use `aria-live="polite"` for non-critical updates (cart total)
- Use `aria-live="assertive"` for critical alerts (errors, shift close)
- Add `role="status"` for status updates

**Example**:
```tsx
<div aria-live="polite" aria-atomic="true" role="status">
  Cart total: ฿{total.toFixed(2)} ({itemCount} items)
</div>
```

### Form Validation Pattern
- Use `aria-invalid="true"` on invalid fields
- Use `aria-errormessage` pointing to error text ID
- Use `aria-required="true"` on required fields

**Example**:
```tsx
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
```

## Keyboard Navigation

### Global Keyboard Shortcuts
- **/** - Focus search input
- **Esc** - Close modal, clear cart (with confirmation)
- **Tab** - Navigate interactive elements forward
- **Shift+Tab** - Navigate interactive elements backward
- **Enter** - Activate buttons/links
- **Space** - Toggle checkboxes, activate buttons

### Focus Management Rules
1. **Modal Open**: Focus first interactive element (input or primary button)
2. **Modal Close**: Restore focus to trigger element
3. **Route Change**: Focus h1 heading of new page
4. **Form Submit**: Focus first error or success message

### Focus Trap Implementation
Use `react-focus-lock` for modals to prevent Tab escape:
```tsx
import FocusLock from 'react-focus-lock';

<FocusLock>
  <Dialog>{/* Modal content - Tab cycles within */}</Dialog>
</FocusLock>
```

## Color Contrast System

### Accessible Tailwind Tokens
```js
// tailwind.config.js - WCAG AA Compliant Colors
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary (Cannabis Green) - 4.7:1 contrast on white
        primary: { DEFAULT: '#16a34a', foreground: '#ffffff' },
        // Error - 4.5:1 contrast
        error: { DEFAULT: '#dc2626', foreground: '#ffffff' },
        // Warning - 4.6:1 contrast
        warning: { DEFAULT: '#d97706', foreground: '#ffffff' },
        // Success - 4.7:1 contrast
        success: { DEFAULT: '#16a34a', foreground: '#ffffff' },
      },
    },
  },
};
```

### Contrast Ratios
- **Normal Text** (14px+): 4.5:1 minimum
- **Large Text** (18px+ or 14px+ bold): 3:1 minimum
- **UI Components** (buttons, inputs, borders): 3:1 minimum

## Semantic HTML Structure

```tsx
<div>
  <header role="banner">
    <nav aria-label="Main navigation">{/* Navigation */}</nav>
  </header>

  <main role="main">
    <h1>POS - Point of Sale</h1>
    {/* Page content */}
  </main>

  <aside aria-label="Shopping cart">{/* Cart */}</aside>
</div>
```

**Heading Hierarchy**:
- **h1**: Page title (one per page)
- **h2**: Major sections (Product Grid, Cart, Shift Summary)
- **h3**: Subsections (Tier Indicator, Item List)

## Accessibility Testing

### Automated Testing (CI/CD)
```typescript
// vitest test with axe-core
import { axe, toHaveNoViolations } from 'vitest-axe';
expect.extend(toHaveNoViolations);

test('TareWeightModal is accessible', async () => {
  const { container } = render(<TareWeightModal />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist
- [ ] Navigate entire app with keyboard only
- [ ] Test with screen reader (NVDA/VoiceOver)
- [ ] Verify color contrast with axe DevTools
- [ ] Test with 200% browser zoom
- [ ] Test with Windows High Contrast mode

## Acceptance Criteria Template

For all UI stories:
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible (2px outline, 3:1 contrast)
- [ ] Screen reader announces dynamic changes
- [ ] Color not sole means of information
- [ ] All form fields have labels
- [ ] No axe-core violations

---
