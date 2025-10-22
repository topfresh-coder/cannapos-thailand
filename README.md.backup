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
