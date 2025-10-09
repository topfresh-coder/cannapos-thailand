# Next Steps

## UX Expert Prompt

Review the Cannabis Dispensary POS PRD (docs/prd.md) and Project Brief (docs/brief.md), then create a detailed UX/UI architecture document covering:

1. **Information Architecture**: Complete sitemap with screen hierarchy and navigation flows
2. **Wireframes**: Key screens (POS main screen, cart, shift reconciliation, stock count) with component layouts
3. **Component Library**: Inventory of shadcn/ui components needed with customization requirements
4. **Interaction Patterns**: Detailed interaction specifications for tier pricing indicator, tare weight modal, shift workflows
5. **Responsive Layouts**: Mobile, tablet, and desktop breakpoint specifications
6. **Accessibility Implementation**: WCAG AA compliance checklist with specific ARIA patterns for complex widgets

Focus on tablet-optimized touch interfaces and ensure the design supports sub-90-second transaction times.

## Architect Prompt

Review the Cannabis Dispensary POS PRD (docs/prd.md), Project Brief (docs/brief.md), and UX architecture (once available), then create a comprehensive technical architecture document covering:

1. **Database Schema**: Complete ERD with tables, columns, types, indexes, constraints, and RLS policies for all entities (users, locations, products, batches, transactions, shifts, pricing_tiers)
2. **Data Model**: Relationships, FIFO allocation strategy, batch depletion logic, shift state machine
3. **Application Architecture**: Component structure, state management patterns (Context vs Zustand), routing strategy
4. **API Design**: Supabase client patterns, real-time subscription usage, server-side validation approach
5. **Business Logic**: Tier pricing calculation algorithm, FIFO allocation implementation, shift variance calculation
6. **Security Model**: RLS policy definitions, authentication flows, role-based access control
7. **Performance Strategy**: Query optimization, caching, code splitting, bundle optimization
8. **Testing Approach**: Unit test boundaries, integration test scenarios, test data strategy

Prioritize solutions that fit the 12-week timeline and minimize technical complexity while ensuring production-grade quality.

---

**PRD Version 1.0 - Ready for Architecture Phase**
