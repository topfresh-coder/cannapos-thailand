# User Interface Design Goals

## Overall UX Vision

The Cannabis Dispensary POS system prioritizes **speed, simplicity, and reliability** for high-volume retail operations. The interface should feel familiar to cashiers with retail experience while accommodating the unique workflows of cannabis dispensaries (tare weights, tiered pricing, shift reconciliation).

Key UX principles:
- **Transaction speed**: Minimize clicks and cognitive load during checkout
- **Error prevention**: Clear visual feedback and validation before irreversible actions
- **Discoverability**: Critical features (tier progression, shift status) surfaced prominently
- **Touch-optimized**: Large tap targets, swipe gestures, tablet-first layout
- **Graceful degradation**: Clear error states with recovery paths

## Key Interaction Paradigms

- **Single-screen POS flow**: Cart sidebar + product search main area (no navigation away during transaction)
- **Modal dialogs for critical inputs**: Tare weight entry, price overrides, shift open/close
- **Real-time feedback**: Immediate visual updates for tier changes, inventory warnings, pricing calculations
- **Progressive disclosure**: Advanced features (manager overrides, detailed reports) hidden until needed
- **Confirmation for destructive actions**: Delete, force close shift, finalize stock count

## Core Screens and Views

From a product perspective, the most critical screens necessary to deliver the PRD values and goals:

1. **Login Screen** - Email/password authentication, minimal branding
2. **POS Main Screen** - Split layout: product search/grid (left), cart sidebar (right), tier indicator, shift status bar
3. **Product Search/Selection** - Grid view with product images, SKU, price, stock level
4. **Cart Review** - Itemized list, tier progression indicator, quantity adjustment, remove item
5. **Tare Weight Entry Modal** - Gross weight, tare weight, calculated net weight display
6. **Payment Processing** - Payment method selection (cash default for MVP), total confirmation
7. **Receipt Confirmation** - Transaction summary, "New Transaction" and "Print" options
8. **Shift Open Reconciliation** - Starting cash float entry, shift time display
9. **Shift Close Reconciliation** - Expected vs actual cash, variance calculation, reason entry
10. **Reconciliation History** - List of past shifts with variance tracking, manager approval status
11. **Product Catalog** - Table/grid view with search, filter by category, add/edit product
12. **Batch Receiving** - Product selection, quantity, cost, received date entry
13. **Stock Count (Weekly)** - Product list with expected vs actual quantity entry, variance highlights
14. **Dashboard Home** - Multi-location summary cards, quick links to reports and critical alerts
15. **Report Viewer** - Report selection hub, parameter inputs (date range, location), export controls
16. **Report Detail Drill-Down** - Detailed tables, charts, transaction-level drilldown links
17. **User Profile** - Name, role, assigned location, password change
18. **Settings/Admin** - Tier configuration, shift definitions, user management (manager only)

## Accessibility

**Target Standard**: WCAG 2.1 Level AA

Accessibility Requirements:
- Keyboard navigation for all interactive elements
- Screen reader support with ARIA labels and live regions
- Sufficient color contrast (4.5:1 minimum for normal text)
- Focus indicators visible on all interactive elements
- Form labels associated with inputs (visible or aria-label)
- Error announcements for screen readers (aria-live)
- Semantic HTML (proper heading hierarchy, landmarks)
- No reliance on color alone to convey information

## Branding

**Style**: Modern, clean, professional retail aesthetic

- **Color Palette**: Neutral base (grays, whites) with green accent (cannabis association) for primary actions, amber for warnings, red for errors/critical alerts
- **Typography**: Sans-serif system font stack for readability and performance (Inter, SF Pro, Roboto)
- **Iconography**: Consistent icon set from Lucide React (included with shadcn/ui)
- **Spacing**: Generous padding and margins for touch-friendly interface (minimum 44px tap targets)
- **Visual Hierarchy**: Clear distinction between primary actions (high contrast, large buttons) and secondary actions (subtle, smaller)

## Target Device and Platforms

**Primary Platform**: Web Responsive (tablet-optimized)

- **Primary Device**: iPad 10.2" or similar Android tablets (1620×2160 resolution)
- **Secondary Support**: Desktop browsers (Chrome, Safari, Edge) for manager/owner access to reports and configuration
- **Mobile Fallback**: Responsive down to iPhone size (390px width minimum) for emergency access
- **Browser Support**: Modern evergreen browsers (last 2 versions of Chrome, Safari, Firefox, Edge)
- **Orientation**: Both portrait and landscape supported, optimized for landscape on tablets
- **Network**: Designed for 4G/LTE connectivity with graceful offline handling (error states, retry mechanisms)

---
