# Technical Assumptions

## Repository Structure: Monorepo

The project will use a monorepo structure with all frontend code, configuration, and documentation in a single repository. This simplifies dependency management, enables atomic commits across the stack, and reduces context switching for AI agent development.

**Repository structure**:
```
/
├── src/                    # React application source
├── supabase/               # Database migrations and config
│   └── migrations/         # SQL migration files
├── public/                 # Static assets
├── docs/                   # Project documentation (PRD, architecture)
├── tests/                  # Test files (unit, integration)
├── .env.example            # Environment variable template
└── package.json            # Dependencies and scripts
```

## Service Architecture: Client-side SPA + Managed Backend (Supabase)

**Architecture Pattern**: Single Page Application (SPA) with managed backend services

- **Frontend**: React 18+ SPA served as static files from Vercel CDN
- **Backend**: Supabase managed services (PostgreSQL database, Auth, Storage, Real-time)
- **API Layer**: Supabase auto-generated REST and GraphQL APIs with client SDK
- **Authentication**: Supabase Auth with Row-Level Security (RLS) for authorization
- **Real-time**: Supabase real-time subscriptions for inventory updates and shift dashboards
- **Storage**: Supabase Storage for product images (if needed post-MVP)

**Rationale**: Managed backend eliminates server infrastructure complexity, auto-scales, provides built-in security (RLS), and fits 12-week timeline. SPA architecture supports offline-first capabilities (future enhancement) and fast client-side routing.

## Testing Strategy: Unit + Integration Testing

**Testing Framework**: Vitest for unit tests, React Testing Library for component tests, manual UAT for end-to-end validation

**Testing Scope**:
- **Unit Tests**: Business logic functions (tier pricing calculation, FIFO allocation algorithm, validation rules, currency/weight formatting)
- **Component Tests**: React components in isolation (Cart, Product Search, Shift Reconciliation forms) with mocked Supabase client
- **Integration Tests**: Supabase client integration, API calls, database queries (using test database)
- **Manual UAT**: End-to-end user journeys (POS transaction, shift reconciliation, stock count) performed by pilot users and QA

**Test Coverage Target**: >70% for critical business logic, lower priority for UI-only components

**CI/CD Integration**: Tests run automatically on pull requests via GitHub Actions, blocking merge on failure

## Frontend Stack

**Build Tool**: Vite 5+
- Fast dev server with HMR (Hot Module Replacement)
- Optimized production builds with code splitting
- Native TypeScript support

**Language**: TypeScript (strict mode enabled)
- Type safety for props, state, API responses
- Catch errors at compile time
- Improved IDE autocomplete and refactoring

**Framework**: React 18+
- Functional components with hooks (useState, useEffect, useContext, custom hooks)
- No class components
- Concurrent features for better UX (useTransition for non-blocking updates)

**UI Components**: shadcn/ui
- Accessible components built on Radix UI primitives
- Customizable with Tailwind CSS
- Copy-paste component code (not npm dependency) for full control
- Includes: Form, Dialog, Sheet (drawer), Table, Card, Button, Input, Select, etc.

**Styling**: Tailwind CSS
- Utility-first CSS framework
- Responsive design with mobile-first breakpoints
- Custom theme configuration for brand colors
- Consistent spacing and sizing scale

**State Management**: React Context API + Zustand (lightweight)
- **React Context**: Global state for auth, current location, active shift
- **Zustand**: Client-side cart state, UI state (modals, drawers)
- **Supabase Real-time**: Server state automatically synced (products, inventory, transactions)

**Form Handling**: React Hook Form + Zod
- React Hook Form for performant form state management
- Zod schema validation (type-safe, reusable schemas)
- Integration with shadcn/ui Form components

**Routing**: React Router v6
- Client-side routing with nested routes
- Protected routes (redirect unauthenticated users)
- URL-based state for reports (date range, filters)

**Data Fetching**: Supabase JS Client
- Auto-generated client from database schema
- Real-time subscriptions for live updates
- Optimistic UI updates for better perceived performance

**Charting/Visualization**: Recharts or similar React chart library
- Bar charts, line charts, pie charts for reports
- Responsive charts for mobile/tablet

**Date Handling**: date-fns
- Lightweight, modular date utility library
- Timezone-aware formatting for Thai locale

## Backend Stack

**Database**: Supabase (Managed PostgreSQL)
- PostgreSQL 15+ with full SQL support
- Row-Level Security (RLS) policies for authorization
- Database triggers and functions for business logic (e.g., auto-update timestamps)
- Full-text search capabilities (if needed for product search)

**Authentication**: Supabase Auth
- Email/password authentication for MVP
- Session management with JWT tokens
- Password reset flow (email-based)
- User metadata for role and location assignment

**File Storage**: Supabase Storage (future enhancement)
- Product images, receipts (if PDF generation implemented)
- Public bucket for product images, private buckets for receipts

**Real-time**: Supabase Real-time
- WebSocket-based subscriptions to database changes
- Use cases: inventory updates after sales, shift summary dashboard live updates

## Deployment & Infrastructure

**Frontend Hosting**: Vercel
- Automatic deployments from GitHub (main branch → production, PRs → preview)
- Global CDN for fast static file delivery
- Environment variable management per deployment environment
- Zero-config HTTPS with automatic SSL certificates

**Database Hosting**: Supabase Cloud
- Managed PostgreSQL with automatic backups
- Connection pooling (PgBouncer)
- Free tier sufficient for MVP, easy upgrade path

**CI/CD**: GitHub Actions
- Automated workflows: lint → type-check → test → build
- Runs on pull requests and main branch pushes
- Deployment to Vercel triggered automatically on successful CI

**Monitoring & Logging**:
- **Error Tracking**: Sentry (or similar) for client-side and API errors
- **Uptime Monitoring**: UptimeRobot or similar for alerting on downtime
- **Database Monitoring**: Supabase dashboard for query performance, connection usage
- **Analytics**: (Optional post-MVP) Plausible or similar privacy-focused analytics

## Development Tools

**Package Manager**: pnpm
- Faster installs than npm/yarn
- Efficient disk space usage (content-addressable storage)
- Strict dependency resolution

**Code Quality**:
- **ESLint**: Linting for code quality and consistency
- **Prettier**: Code formatting (auto-format on save)
- **TypeScript Strict Mode**: Maximum type safety
- **Husky**: Git hooks for pre-commit linting (optional)

**Version Control**: Git + GitHub
- Feature branch workflow (PRs for all changes)
- Protected main branch (requires PR approval)
- Conventional commit messages for clear history

## Additional Technical Assumptions and Requests

Throughout the development process, the following technical assumptions and requests apply:

1. **All sensitive keys and credentials** (Supabase URL, anon key, service role key) must be stored in `.env` files and documented in `.env.example`. Never commit actual keys to version control.

2. **Database migrations** must be written as SQL files in `/supabase/migrations` directory and versioned sequentially (e.g., `20250110120000_create_products_table.sql`). All schema changes go through migrations, never manual DB edits.

3. **RLS policies** must be defined for every table, even if the policy is permissive during development. Policies should follow least-privilege principle (users only access their location's data).

4. **Offline handling**: While offline-first is not an MVP requirement, error states must gracefully handle network failures with clear user messaging and retry mechanisms.

5. **Performance budget**: Initial bundle size should be <500KB gzipped. Use code splitting for routes and large dependencies (charts, PDF generation).

6. **Accessibility testing**: Run automated axe DevTools audits on all major screens. Manual screen reader testing (NVDA or VoiceOver) on critical flows (POS transaction, shift reconciliation).

7. **Browser compatibility**: Target last 2 versions of Chrome, Safari, Edge. No IE11 support required.

8. **Mobile performance**: Test on real devices (iPad, Android tablet) not just browser DevTools responsive mode.

9. **Security headers**: Configure Vercel to send appropriate security headers (CSP, X-Frame-Options, HSTS).

10. **Logging strategy**: Use structured logging (JSON format) for easier parsing. Log levels: error (production), warn (production), info (dev), debug (dev only).

---
