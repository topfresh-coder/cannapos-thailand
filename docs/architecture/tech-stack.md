# Tech Stack

| Category                  | Technology                         | Version | Purpose                                      | Rationale                                                                 |
| ------------------------- | ---------------------------------- | ------- | -------------------------------------------- | ------------------------------------------------------------------------- |
| **Frontend Language**     | TypeScript                         | 5.3+    | Type-safe JavaScript                         | Catch errors at compile time, excellent IDE support, mandatory for scale |
| **Frontend Framework**    | React                              | 18.2+   | UI library                                   | Industry standard, huge ecosystem, concurrent features for performance   |
| **UI Component Library**  | shadcn/ui                          | Latest  | Accessible component primitives              | Copy-paste approach (full control), Radix UI accessibility, Tailwind CSS |
| **State Management**      | Zustand + React Context            | 4.5+    | Client state (cart, UI), global state (auth) | Minimal boilerplate, excellent DX, <1KB bundle for cart state            |
| **Routing**               | React Router                       | 6.21+   | Client-side routing                          | Industry standard for SPAs, nested routes, data loading                  |
| **Build Tool**            | Vite                               | 5.0+    | Dev server and bundler                       | Fast HMR, excellent DX, optimal production builds                        |
| **CSS Framework**         | Tailwind CSS                       | 3.4+    | Utility-first CSS                            | Rapid styling, consistent design system, purges unused CSS               |
| **Form Handling**         | React Hook Form + Zod              | 7.49+   | Form state + validation                      | Performant, minimal re-renders, type-safe validation schemas             |
| **Database**              | Supabase (PostgreSQL)              | 15+     | Managed PostgreSQL with RLS                  | Auto-scaling, RLS for security, real-time, auth integration              |
| **Backend API**           | Supabase Auto-Generated REST/GQL   | N/A     | Database API layer                           | No custom API code, auto-typed, instant updates on schema changes        |
| **Authentication**        | Supabase Auth                      | Latest  | Email/password auth + JWT                    | Integrated with RLS, battle-tested, minimal setup                        |
| **Real-Time**             | Supabase Real-time                 | Latest  | WebSocket subscriptions                      | Live cart updates, shift dashboards, built-in to Supabase                |
| **File Storage**          | Supabase Storage                   | Latest  | Product images (future)                      | S3-compatible, RLS policies, CDN integration                             |
| **Frontend Testing**      | Vitest + React Testing Library     | 1.2+    | Unit + component tests                       | Fast, Vite-native, same API as Jest, RTL for React best practices       |
| **Backend Testing**       | Supabase Test Helpers + pg-tap     | Latest  | Database tests (RLS, functions)              | Test RLS policies, triggers, Edge Functions                              |
| **E2E Testing**           | Manual UAT (Epic 7)                | N/A     | End-to-end user testing                      | Sufficient for MVP, manual testing by pilot users cheaper than Playwright|
| **Type Generation**       | Supabase CLI                       | Latest  | Generate TS types from database schema       | Auto-sync types, prevents schema-code drift                              |
| **Package Manager**       | pnpm                               | 8.15+   | Fast, disk-efficient package manager         | 2-3x faster than npm, strict dep resolution, workspace support           |
| **Linting**               | ESLint + TypeScript ESLint         | 8.56+   | Code quality and consistency                 | Industry standard, catches bugs, enforces style                          |
| **Formatting**            | Prettier                           | 3.2+    | Opinionated code formatter                   | Zero config, consistent style, integrates with ESLint                    |
| **CI/CD**                 | GitHub Actions                     | Latest  | Automated testing + deployment               | Free for public repos, native GitHub integration                         |
| **Hosting (Frontend)**    | Vercel                             | Latest  | Edge CDN for React SPA                       | Zero-config deploys, preview envs, global edge, generous free tier       |
| **Hosting (Backend)**     | Supabase Cloud                     | Latest  | Managed PostgreSQL + services                | Auto-scaling, backups, monitoring, free tier sufficient for MVP          |
| **Monitoring (Frontend)** | Vercel Analytics + Web Vitals      | Latest  | Performance monitoring                       | Built-in, free, Core Web Vitals tracking                                 |
| **Monitoring (Backend)**  | Supabase Dashboard                 | Latest  | Database performance, query logs             | Built-in, query performance insights, connection pooling metrics         |
| **Error Tracking**        | Sentry (optional, Epic 7)          | Latest  | Client + server error tracking               | Industry standard, source maps, release tracking                         |
| **Date Handling**         | date-fns                           | 3.2+    | Lightweight date utilities                   | Modular, tree-shakable, no Moment.js bloat                               |
| **Chart Library**         | Recharts                           | 2.10+   | React chart components                       | Composable, responsive, sufficient for MVP reports                       |

---
