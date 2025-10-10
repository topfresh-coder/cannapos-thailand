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

### Vercel (Frontend)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Supabase (Backend)

- Already deployed as managed service
- Ensure migrations are applied via dashboard
- Configure RLS policies (included in initial migration)

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

