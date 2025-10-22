# Story 1.2: Manual Tasks Documentation

## Overview

This document provides step-by-step instructions for the **manual tasks** required to complete Story 1.2. These tasks require user interaction with external services and cannot be automated.

**Status:** Ready for execution
**Prerequisite:** Completed Story 1.1

---

## Task 1: Create Supabase Project and Configure Environment

**Estimated Time:** 15 minutes
**Prerequisites:** Supabase account (free tier available)

### Step-by-Step Instructions

#### 1.1 Create Supabase Project

1. Navigate to https://supabase.com
2. Sign up or log in to your account
3. Click **"New Project"**
4. Configure project:
   - **Organization:** Select or create organization
   - **Name:** `cannapos-thailand-dev` (or your preferred name)
   - **Database Password:** Generate strong password (save securely!)
   - **Region:** **Southeast Asia (Singapore)** - Critical for low latency to Thailand
   - **Pricing Plan:** Free tier is sufficient for development

5. Click **"Create new project"**
6. Wait 2-3 minutes for provisioning to complete

#### 1.2 Retrieve Project Credentials

1. Once project is ready, navigate to **Settings → API**
2. Copy the following credentials:
   - **Project URL:** `https://<project-id>.supabase.co`
   - **Anon Key:** `eyJhbGc...` (long JWT token - this is safe for client-side use)

#### 1.3 Configure Environment Variables

**Update `.env.example`:**
```bash
# Open apps/web/.env.example
# Verify it contains:
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Create `.env.local`:**
```bash
# Create apps/web/.env.local with ACTUAL credentials:
VITE_SUPABASE_URL=https://<your-actual-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-actual-anon-key>
```

**Security Note:** The `.env.local` file is gitignored. Never commit real credentials!

#### 1.4 Test Connection in Supabase SQL Editor

1. In Supabase Dashboard, go to **SQL Editor**
2. Run this test query:
   ```sql
   SELECT NOW() as current_time;
   ```
3. You should see the current timestamp - connection is working!

**✓ Task 1 Complete** - Project created and credentials configured

---

## Task 2: Initialize Supabase CLI and Migration Structure

**Estimated Time:** 10 minutes
**Prerequisites:** Node.js 18+, npm/pnpm installed

### Step-by-Step Instructions

#### 2.1 Install Supabase CLI

**⚠️ Important:** Global NPM installation (`npm install -g supabase`) is **no longer supported** by Supabase CLI.

**Recommended Method for Windows (Scoop):**

```powershell
# Install Scoop (if not already installed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Add Supabase bucket
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git

# Install Supabase CLI
scoop install supabase

# Verify installation
supabase --version
# Should show: supabase 1.x.x
```

**Alternative Method (Project-local installation):**

```bash
# Install as dev dependency in project
npm install supabase --save-dev

# Use via npx (prefix all supabase commands with npx)
npx supabase --version
# Should show: supabase 1.x.x
```

**Note:** If using project-local installation, all subsequent `supabase` commands in this document must be prefixed with `npx` (e.g., `npx supabase init`, `npx supabase link`).

#### 2.2 Initialize Supabase in Project

```bash
# Navigate to project root
cd D:\test

# Initialize Supabase
supabase init

# You should see output:
# ✓ Finished supabase init.
# Generated supabase/config.toml
```

#### 2.3 Verify Directory Structure

```bash
# Check created structure
ls supabase/

# You should see:
# config.toml
# migrations/
# seed.sql (optional)
```

#### 2.4 Link to Supabase Cloud Project

```bash
# Get your project reference ID from Supabase Dashboard
# Settings → General → Reference ID (format: abcdefghijklmnop)

# Link local project to cloud
supabase link --project-ref <your-project-ref>

# You'll be prompted for your database password (from Task 1.1)
# Enter the password you created

# Successful link shows:
# ✓ Linked to project <project-ref>
```

#### 2.5 Configure .gitignore

Verify `.gitignore` contains (should already be configured):
```gitignore
# Supabase
supabase/.temp/
supabase/.branches/
.env.local
.env*.local
```

**DO NOT** ignore `supabase/migrations/` - these are tracked in git!

**✓ Task 2 Complete** - Supabase CLI initialized and linked

---

## Task 9: Run All Migrations on Supabase Cloud

**Estimated Time:** 5 minutes
**Prerequisites:** Tasks 1-8 completed, migrations exist in `supabase/migrations/`

### Step-by-Step Instructions

#### 9.1 Test Migrations Locally (Recommended)

```bash
# Start local Supabase (uses Docker)
supabase start

# This will:
# - Start PostgreSQL container
# - Start Supabase services
# - Apply all migrations automatically

# Reset database and test all migrations from scratch
supabase db reset

# You should see:
# Applying migration 20250111000001_init_schema_enums_extensions.sql...
# Applying migration 20250111000002_init_schema_core_tables.sql...
# Applying migration 20250111000003_init_schema_triggers.sql...
# Applying migration 20250111000004_init_rls_helpers.sql...
# Applying migration 20250111000005_init_rls_policies_core.sql...
# Applying migration 20250111000006_init_rls_policies_operational.sql...
# ✓ Finished supabase db reset.
```

#### 9.2 Push Migrations to Supabase Cloud

```bash
# Push all local migrations to cloud
supabase db push

# You'll see:
# Applying migration 20250111000001_init_schema_enums_extensions.sql...
# Applying migration 20250111000002_init_schema_core_tables.sql...
# Applying migration 20250111000003_init_schema_triggers.sql...
# Applying migration 20250111000004_init_rls_helpers.sql...
# Applying migration 20250111000005_init_rls_policies_core.sql...
# Applying migration 20250111000006_init_rls_policies_operational.sql...
# ✓ All migrations applied successfully
```

#### 9.3 Verify Migrations in Supabase Dashboard

1. Go to **Database → Migrations** tab
2. You should see all 6 migrations listed:
   - ✓ 20250111000001_init_schema_enums_extensions
   - ✓ 20250111000002_init_schema_core_tables
   - ✓ 20250111000003_init_schema_triggers
   - ✓ 20250111000004_init_rls_helpers
   - ✓ 20250111000005_init_rls_policies_core
   - ✓ 20250111000006_init_rls_policies_operational

#### 9.4 Verify Tables Created

1. Go to **Table Editor**
2. Verify all 12 tables exist:
   - ✓ locations
   - ✓ users
   - ✓ products
   - ✓ product_batches
   - ✓ pricing_tiers
   - ✓ shift_definitions
   - ✓ shifts
   - ✓ transactions
   - ✓ transaction_items
   - ✓ inventory_adjustments
   - ✓ stock_counts
   - ✓ stock_count_items

#### 9.5 Verify RLS Enabled

1. Click on any table in Table Editor
2. Click **"RLS"** tab
3. Verify **"Enable RLS"** is ON (green)
4. Verify policies are listed for that table

#### 9.6 Document Migration History

Create entry in project notes:
```
Migration Applied: 2025-01-11
Environment: Production (Supabase Cloud)
Project: cannapos-thailand-dev
Migrations: 20250111000001 through 20250111000006
Status: Success
Tables Created: 12
RLS Policies: 27
```

**✓ Task 9 Complete** - All migrations applied to production

---

## Troubleshooting

### Issue: `supabase link` fails with authentication error

**Solution:**
```bash
# Login to Supabase CLI first
supabase login

# Then retry link
supabase link --project-ref <your-project-ref>
```

### Issue: Migration fails with "relation already exists"

**Solution:**
```bash
# Reset database and reapply migrations
supabase db reset

# If on cloud, you may need to manually drop tables first
# Be VERY careful with this on production!
```

### Issue: Cannot connect to local Supabase

**Solution:**
```bash
# Ensure Docker is running
docker --version

# Stop and restart Supabase
supabase stop
supabase start
```

### Issue: Missing environment variables in app

**Solution:**
```bash
# Verify .env.local exists
cat apps/web/.env.local

# Restart dev server to pick up new env vars
npm run dev
```

---

## Validation Checklist

Before proceeding to QA, verify:

- [ ] Supabase project created in Singapore region
- [ ] Project URL and anon key documented in .env.example
- [ ] .env.local created with actual credentials (gitignored)
- [ ] Supabase CLI installed and verified
- [ ] `supabase init` completed successfully
- [ ] `supabase link` connected to cloud project
- [ ] All 6 migration files exist in `supabase/migrations/`
- [ ] `supabase db reset` runs successfully locally
- [ ] `supabase db push` applied migrations to cloud
- [ ] All 12 tables visible in Supabase Dashboard
- [ ] RLS enabled on all tables
- [ ] All RLS policies visible in dashboard

---

## Next Steps

After completing these manual tasks:

1. **Generate TypeScript Types:**
   ```bash
   cd apps/web
   npm run types:supabase
   ```

2. **Test Database Connection:**
   ```bash
   npm run dev
   # App should connect to Supabase successfully
   ```

3. **Proceed to QA Testing** (Story 1.2 QA checklist)

---

## References

- **Supabase Documentation:** https://supabase.com/docs
- **Supabase CLI Reference:** https://supabase.com/docs/reference/cli
- **Database Schema:** `D:\test\docs\architecture\database-schema.md`
- **Security Model:** `D:\test\docs\architecture\security-model.md`
