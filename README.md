# CannaPOS Thailand

Cannabis Dispensary POS System for Thailand with tiered pricing, FIFO inventory, and shift reconciliation.

## Tech Stack

- **Frontend**: React 18+ with Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL 15+, Auth, Real-time)
- **State Management**: React Context + Zustand
- **Hosting**: Vercel (Frontend) + Supabase (Backend)

## Project Structure

```
/
├── apps/
│   └── web/              # React SPA
│       ├── src/
│       │   ├── components/  # UI components
│       │   ├── pages/       # Route components
│       │   ├── hooks/       # Custom hooks
│       │   ├── services/    # Supabase service layer
│       │   ├── stores/      # Zustand stores
│       │   ├── contexts/    # React contexts
│       │   ├── utils/       # Utility functions
│       │   └── lib/         # Core libraries
│       └── package.json
├── packages/
│   └── shared-types/     # Shared TypeScript types
├── supabase/
│   └── migrations/       # Database migrations
└── docs/                 # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm 8+
- Supabase account (free tier)

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd cannapos-thailand
   npm install
   ```

2. **Setup Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Navigate to Project Settings > API
   - Copy the Project URL and anon/public key

3. **Configure environment variables**:
   ```bash
   cp .env.example apps/web/.env
   ```

   Edit `apps/web/.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Run database migrations**:
   - Open your Supabase project dashboard
   - Go to SQL Editor
   - Copy contents of `supabase/migrations/20250110000001_initial_schema.sql`
   - Execute the migration

5. **Start development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

## Development Workflow

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Database Migrations

1. Create new migration file in `supabase/migrations/`
2. Name format: `YYYYMMDDHHMMSS_description.sql`
3. Execute via Supabase dashboard SQL Editor

### Adding shadcn/ui Components

```bash
cd apps/web
npx shadcn@latest add button
npx shadcn@latest add dialog
# etc.
```

## Architecture Overview

### Database Schema

- **users**: User accounts with role-based access (cashier, manager, owner)
- **locations**: Store locations
- **products**: Product catalog with SKU, pricing, tare weight flags
- **product_batches**: FIFO inventory tracking with received dates
- **pricing_tiers**: Tiered pricing rules based on flower weight thresholds
- **transactions**: Sales transactions with payment methods
- **transaction_items**: Line items with FIFO batch allocations
- **shifts**: Shift reconciliation with cash variance tracking
- **stock_counts**: Weekly stock count sessions

### Key Features

1. **Tiered Pricing**: Aggregate flower weight → match tier → apply discounted price
2. **FIFO Allocation**: Allocate inventory from oldest batches first
3. **Shift Reconciliation**: AM/PM shifts with variance calculation and manager approval
4. **Tare Weight**: Modal for gross/tare/net weight calculation on flower products
5. **Stock Count**: Weekly physical inventory count with variance tracking
6. **Multi-Location**: RLS policies enforce data isolation per location

### Security

- Row-Level Security (RLS) policies enforce authorization at database layer
- JWT authentication via Supabase Auth
- Cashiers: Access only their location
- Managers: Manage their location
- Owners: Multi-location access

## Deployment

### Production URL

- Production: `https://cannapos-thailand.vercel.app`
- All deployments are accessible via this URL once merged to `main`

### CI/CD Pipeline

The project uses GitHub Actions for continuous integration and Vercel for continuous deployment.

**Automated Triggers**:
- Pull requests to `main` branch
- Direct pushes to `main` branch

**CI Checks** (must pass before deployment):
1. **ESLint Linting**: `pnpm run lint` - Ensures code quality and consistency
2. **TypeScript Type Checking**: `pnpm run type-check` - Validates type safety
3. **Vitest Unit Tests**: `pnpm --filter web test` - Runs all unit tests

**Build Failure Prevention**:
- If any CI check fails, deployment is automatically blocked
- Fix errors locally and push again to trigger a new CI run
- All checks must pass before Vercel deploys the build

### Deployment Workflows

#### Production Deployment

1. **Merge to Main**: Merge pull request to `main` branch (or push directly to `main`)
2. **CI Execution**: GitHub Actions automatically runs all CI checks
3. **Auto-Deploy**: If all checks pass, Vercel automatically deploys to production
4. **Live in Minutes**: New deployment is live at production URL within 1-2 minutes
5. **Notifications**: Deployment status appears in GitHub commit status and Vercel dashboard

#### Preview Deployments

1. **Create PR**: Open a pull request targeting `main` branch
2. **Auto-Preview**: Vercel automatically creates a unique preview URL for this PR
3. **PR Comment**: Preview URL is posted as a comment on the pull request
4. **Test Safely**: Test changes in isolated preview environment before merging
5. **Environment Parity**: Preview deployments inherit environment variables from project settings

### Environment Variables Setup

#### Required Variables

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (public, safe for client-side use)

#### Configuration in Vercel

1. **Navigate to Settings**:
   - Open Vercel Dashboard
   - Select your project
   - Go to Settings tab

2. **Add Environment Variables**:
   - Click "Environment Variables" in left sidebar
   - For each variable:
     - **Name**: `VITE_SUPABASE_URL`
     - **Value**: Copy from your local `apps/web/.env` file
     - **Environments**: Select all (Production, Preview, Development)
   - Click "Save"
   - Repeat for `VITE_SUPABASE_ANON_KEY`

3. **Redeploy Application**:
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment
   - Or push a new commit to trigger deployment

#### Where to Find Values

- **Local Development**: Check `apps/web/.env` file
- **Supabase Dashboard**:
  - Go to Project Settings
  - Navigate to API section
  - Copy "Project URL" and "anon/public" key

### Rollback Procedures

#### Option 1: Instant Rollback via Vercel (Recommended)

1. **Open Vercel Dashboard** → Navigate to Deployments tab
2. **Find Previous Working Deployment** from the list
3. **Promote to Production**:
   - Click the "..." menu next to the deployment
   - Select "Promote to Production"
   - Confirm the action
4. **Instant Switchover**: Previous version becomes live immediately
5. **Verify**: Check production URL to confirm rollback

**Use Case**: Fastest rollback for critical production issues

#### Option 2: Git Revert (1-2 minutes)

1. **Identify Problem Commit**:
   ```bash
   git log --oneline
   ```

2. **Revert Commit**:
   ```bash
   git revert <commit-hash>
   ```

3. **Push to Main**:
   ```bash
   git push origin main
   ```

4. **Auto-Deploy**: Vercel automatically deploys the reverted version
5. **Wait**: Deployment completes in 1-2 minutes

**Use Case**: When you need to preserve git history or revert multiple commits

### Health Check Verification

After every deployment, verify the following:

1. **Basic Accessibility**:
   - [ ] Production URL loads successfully
   - [ ] No browser console errors on initial load
   - [ ] Page renders correctly (no blank screens)

2. **Authentication**:
   - [ ] Login page displays correctly
   - [ ] Supabase connection working (check Network tab)
   - [ ] Can successfully log in with test credentials

3. **Environment Configuration**:
   - [ ] `VITE_SUPABASE_URL` is set correctly
   - [ ] `VITE_SUPABASE_ANON_KEY` is set correctly
   - [ ] No "undefined" errors in console related to env vars

4. **Monitoring**:
   - [ ] Check Vercel dashboard for deployment status
   - [ ] Review deployment logs for errors or warnings
   - [ ] Monitor application performance metrics

**Quick Health Check**:
```bash
# Check production URL returns 200 OK
curl -I https://cannapos-thailand.vercel.app

# Verify Supabase connection (check for CORS errors)
# Open browser console on production site and check Network tab
```

### Supabase Backend

- **Managed Service**: Already deployed and managed by Supabase
- **Database Migrations**:
  - Apply migrations via Supabase dashboard SQL Editor
  - Copy contents from `supabase/migrations/*.sql` files
  - Execute in chronological order
- **RLS Policies**: Configured automatically via initial migration
- **No Additional Deployment**: Backend is always available

### Troubleshooting Deployments

For deployment-specific issues, see:
- [Deployment Issues](./docs/TROUBLESHOOTING.md#deployment-issues)
- [Vercel Build Failures](./docs/TROUBLESHOOTING.md#vercel-build-failures)
- [Environment Variable Issues](./docs/TROUBLESHOOTING.md#environment-variable-issues)

## Documentation

- [Project Brief](./docs/brief.md) - Requirements and MVP scope
- [PRD](./docs/prd.md) - Product requirements with 7 epics, 67 stories
- [UX Specification](./docs/ux-spec.md) - UI/UX architecture and wireframes
- [Technical Architecture](./docs/architecture.md) - Complete technical architecture

## Timeline

12-week single-phase development (all-in-one):

- **Weeks 1-2**: Foundation & Core Infrastructure (Epic 1)
- **Weeks 3-5**: Product Management, Tiered Pricing, Core POS (Epics 2-3)
- **Weeks 6-7**: Shift Reconciliation, Stock Management (Epics 4-5)
- **Weeks 8-10**: Reporting Suite & Dashboard (Epic 6)
- **Weeks 11-12**: UAT, Polish & Pilot Deployment (Epic 7)

## License

MIT

## Troubleshooting

For common development, build, and deployment issues, see the comprehensive [Troubleshooting Guide](./docs/TROUBLESHOOTING.md).

Quick links:
- [Development Environment Issues](./docs/TROUBLESHOOTING.md#development-environment-issues)
- [Build and TypeScript Issues](./docs/TROUBLESHOOTING.md#build-and-typescript-issues)
- [Supabase Connection Issues](./docs/TROUBLESHOOTING.md#supabase-connection-issues)
- [Testing Issues](./docs/TROUBLESHOOTING.md#testing-issues)
- [Deployment Issues](./docs/TROUBLESHOOTING.md#deployment-issues)

## Testing

For comprehensive testing guidelines, examples, and best practices, see the [Testing Guide](./docs/TESTING_GUIDE.md).

### Quick Start

\`\`\`bash
cd apps/web

# Run tests in watch mode
npm run test

# Run with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
\`\`\`

### Test Coverage Goals

- **Business Logic**: 80%+ coverage
- **React Components**: 60%+ coverage
- **Overall Project**: 70%+ coverage

### Writing Tests

Tests are co-located with source files:

\`\`\`typescript
// src/utils/currency.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('formats Thai Baht correctly', () => {
    expect(formatCurrency(1000)).toBe('฿1,000.00');
  });
});
\`\`\`

See [Testing Guide](./docs/TESTING_GUIDE.md) for more examples and patterns.

## Contributing

### Development Workflow

1. **Create feature branch**:
   \`\`\`bash
   git checkout -b feature/add-discount-codes
   \`\`\`

2. **Make changes and test**:
   \`\`\`bash
   npm run type-check  # Ensure no TypeScript errors
   npm run lint        # Check code quality
   npm run test        # Run tests
   \`\`\`

3. **Commit changes**:
   \`\`\`bash
   git add .
   git commit -m "feat(pos): add discount code support"
   \`\`\`

4. **Push and create pull request**:
   \`\`\`bash
   git push origin feature/add-discount-codes
   \`\`\`

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`
type(scope): description

[optional body]

[optional footer]
\`\`\`

**Types**:
- \`feat\`: New feature
- \`fix\`: Bug fix
- \`docs\`: Documentation changes
- \`style\`: Code formatting (not CSS)
- \`refactor\`: Code refactoring
- \`test\`: Adding or updating tests
- \`chore\`: Build process or tooling changes

**Examples**:
\`\`\`
feat(pos): add discount code support to checkout
fix(auth): resolve token expiration issue
docs(readme): add troubleshooting section
test(cart): add tier pricing calculation tests
chore(deps): update Supabase client to v2.48
\`\`\`

### Code Style Guidelines

- **TypeScript**: Always use strict typing, avoid \`any\`
- **React**: Prefer function components with hooks
- **File Naming**:
  - Components: PascalCase (e.g., \`ProductCard.tsx\`)
  - Utilities: camelCase (e.g., \`formatCurrency.ts\`)
  - Tests: Same as source + \`.test\` (e.g., \`ProductCard.test.tsx\`)
- **Import Order**:
  1. React and external libraries
  2. Internal utilities and types
  3. Components
  4. Styles

**Example**:
\`\`\`typescript
// 1. External libraries
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

// 2. Internal utilities and types
import { formatCurrency } from '@/utils/currency';
import type { Product } from '@/types';

// 3. Components
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';

// 4. Styles (if needed)
import './styles.css';
\`\`\`

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all checks pass**:
   - TypeScript compilation
   - ESLint rules
   - All tests passing
4. **Request review** from team member
5. **Address review comments**
6. **Squash commits** before merging (keep history clean)

### Definition of Done

Before marking a story as complete:

- [ ] All acceptance criteria met
- [ ] Code follows style guidelines
- [ ] Tests written and passing (70%+ coverage)
- [ ] Documentation updated (README, JSDoc comments)
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Manually tested in browser
- [ ] PR reviewed and approved

