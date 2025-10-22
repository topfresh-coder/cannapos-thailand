# Vercel Deployment Guide - CannaPOS Thailand

## Overview

This guide provides step-by-step instructions for deploying the CannaPOS Thailand application to Vercel. This is a **MANUAL PROCESS** - all steps must be executed by a human operator.

**Project Details:**
- **Framework**: Vite 7.1.7 + React 18.3.1
- **Monorepo Structure**: `apps/web` is the deployment root
- **Package Manager**: pnpm 8.0+ (NOT npm)
- **Node.js Version**: 18.0+
- **Build Tool**: Vite with TypeScript compilation

---

## Prerequisites

Before starting, ensure you have:

1. **GitHub Account**: Repository must be pushed to GitHub
2. **Vercel Account**: Sign up at https://vercel.com
3. **Environment Variables**: Values from `apps/web/.env` file
4. **Repository Access**: Admin or write access to the GitHub repository

---

## Part 1: Vercel Account Setup

### Step 1.1: Create Vercel Account

1. Navigate to **https://vercel.com**
2. Click **"Sign Up"** button
3. Select **"Continue with GitHub"** (recommended for seamless integration)
4. Authorize Vercel to access your GitHub account
5. Grant Vercel access to the `cannapos-thailand` repository (or your repository name)

**Why GitHub integration?**
- Automatic deployments on git push
- Preview deployments for pull requests
- Seamless environment variable syncing

### Step 1.2: Install Vercel for GitHub

1. In GitHub, go to **Settings → Integrations → Applications**
2. Find **"Vercel"** in installed applications
3. Click **"Configure"**
4. Select repository access:
   - **Option A**: "Only select repositories" → Choose `cannapos-thailand`
   - **Option B**: "All repositories" (not recommended for security)
5. Click **"Save"**

---

## Part 2: Import Project to Vercel

### Step 2.1: Create New Project

1. Log in to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click **"Add New..."** button → Select **"Project"**
3. You'll see a list of your GitHub repositories
4. Find **`cannapos-thailand`** (or your repo name)
5. Click **"Import"** button next to it

### Step 2.2: Configure Build Settings

**CRITICAL**: Vercel must be configured for the monorepo structure. Enter these settings EXACTLY:

| Setting | Value | Explanation |
|---------|-------|-------------|
| **Framework Preset** | `Vite` | Auto-detects Vite configuration |
| **Root Directory** | `apps/web` | **IMPORTANT**: Monorepo app location |
| **Build Command** | `pnpm run build` | Uses pnpm (NOT npm) |
| **Output Directory** | `dist` | Vite default output directory |
| **Install Command** | `pnpm install` | Installs dependencies with pnpm |
| **Node.js Version** | `18.x` | Set in Project Settings if needed |

**Visual Guide:**

```
┌─────────────────────────────────────────┐
│ Configure Project                        │
├─────────────────────────────────────────┤
│ Framework Preset:   [Vite         ▼]   │
│ Root Directory:     apps/web      🔍    │
│ Build Command:      pnpm run build      │
│ Output Directory:   dist                │
│ Install Command:    pnpm install        │
└─────────────────────────────────────────┘
```

### Step 2.3: Important Notes on Monorepo Configuration

**Why `apps/web` as Root Directory?**
- This is a monorepo with multiple packages
- The deployable application is in `apps/web`
- Vercel needs to know where to find `package.json` and `vite.config.ts`

**Build Process:**
```bash
# Vercel will execute these commands in apps/web directory:
1. cd apps/web
2. pnpm install
3. tsc -b && vite build  # From package.json "build" script
4. Output: dist/ directory
```

---

## Part 3: Environment Variables Configuration

### Step 3.1: Locate Your Environment Variables

Open your local file: `d:\test\apps\web\.env`

**Current values** (from your project):
```env
VITE_SUPABASE_URL=https://cqbjcxbumucgohfhebdq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxYmpjeGJ1bXVjZ29oZmhlYmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNzcwNTMsImV4cCI6MjA3NTg1MzA1M30.7GA3ue4jEE2S6JCduPkcpMSUaoQLz7Agiq56wq074MU
```

### Step 3.2: Add Environment Variables in Vercel

**Method 1: During Initial Project Setup** (Before first deployment)

1. After configuring build settings, you'll see **"Environment Variables"** section
2. Click **"Add Environment Variable"**
3. Add each variable:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://cqbjcxbumucgohfhebdq.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (full token) | Production, Preview, Development |

4. Click **"Deploy"** button

**Method 2: After Project Creation** (Add/edit variables later)

1. Go to **Vercel Dashboard** → Select your project
2. Click **"Settings"** tab
3. Navigate to **"Environment Variables"** section (left sidebar)
4. Click **"Add New"** button
5. Enter variable details:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://cqbjcxbumucgohfhebdq.supabase.co`
   - **Environments**: Check ✅ Production, ✅ Preview, ✅ Development
6. Click **"Save"**
7. Repeat for `VITE_SUPABASE_ANON_KEY`

### Step 3.3: Understanding Environment Scopes

| Environment | When It's Used | Git Branch |
|-------------|----------------|------------|
| **Production** | Main deployment URL (e.g., `cannapos.vercel.app`) | `main` or `master` |
| **Preview** | Pull request deployments | Any non-production branch |
| **Development** | Local `vercel dev` command | N/A |

**Best Practice**: Apply all variables to **all three environments** for consistency.

### Step 3.4: Verify Environment Variables

After adding variables:

1. Go to **Settings → Environment Variables**
2. You should see:
   ```
   VITE_SUPABASE_URL
   Environments: Production, Preview, Development

   VITE_SUPABASE_ANON_KEY
   Environments: Production, Preview, Development
   ```

3. **IMPORTANT**: After adding/editing variables, you must **redeploy** for changes to take effect

---

## Part 4: Deploy to Production

### Step 4.1: Trigger Initial Deployment

**Option A: Automatic Deployment** (Recommended)

1. After clicking **"Deploy"** in project setup, Vercel will automatically:
   - Clone your repository
   - Install dependencies with `pnpm install`
   - Run `pnpm run build` in `apps/web`
   - Deploy the `dist/` output
2. Wait for build to complete (usually 2-5 minutes)
3. Watch the build logs in real-time

**Option B: Manual Deployment via Git Push**

```bash
# Make any change to trigger deployment
git add .
git commit -m "Trigger Vercel deployment"
git push origin main
```

Vercel will automatically detect the push and start deployment.

### Step 4.2: Monitor Deployment Status

1. In **Vercel Dashboard → Deployments** tab, you'll see:
   ```
   🔵 Building...
   ├─ Cloning repository
   ├─ Installing dependencies (pnpm install)
   ├─ Building application (pnpm run build)
   └─ Uploading static files
   ```

2. **Successful deployment** shows:
   ```
   ✅ Deployment completed successfully
   🌐 Visit: https://your-project.vercel.app
   ```

3. **Failed deployment** shows:
   ```
   ❌ Build failed
   📋 View logs for details
   ```

### Step 4.3: Common Build Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `pnpm: command not found` | Vercel using npm instead of pnpm | Set Install Command to `pnpm install` |
| `Cannot find module 'vite'` | Wrong root directory | Set Root Directory to `apps/web` |
| `import.meta.env.VITE_SUPABASE_URL is undefined` | Missing environment variables | Add variables in Settings → Environment Variables |
| `tsc: command not found` | TypeScript not installed | Ensure devDependencies are installed |
| `Build exceeded maximum duration` | Build timeout (free plan: 45s) | Optimize build or upgrade plan |

---

## Part 5: Post-Deployment Verification

### Step 5.1: Get Your Production URL

After successful deployment, you'll receive:

1. **Production URL**: `https://cannapos-thailand.vercel.app` (example)
2. **Deployment URL**: `https://cannapos-thailand-abc123.vercel.app` (unique per deployment)

**Copy your production URL** - you'll need it for testing.

### Step 5.2: Manual Browser Testing

**BEFORE Playwright automation**, manually verify:

1. **Open production URL** in browser
2. Check if login page loads without errors
3. Open **Developer Tools** (F12) → **Console** tab
4. Verify no errors like:
   ```
   ❌ Failed to fetch
   ❌ supabase is not defined
   ❌ 404 Not Found
   ```

5. Test Supabase connection:
   - Try logging in with test credentials
   - Check Network tab for API calls to `https://cqbjcxbumucgohfhebdq.supabase.co`

### Step 5.3: Inform DevOps for Playwright Testing

**Once manual verification is complete**, provide to DevOps:

```
✅ Production URL: https://your-actual-url.vercel.app
✅ Login page loads successfully
✅ No console errors
✅ Supabase connection working
```

**Next Step**: DevOps will execute automated Playwright browser tests (see Part 6 below).

---

## Part 6: Automated Playwright Testing (DevOps Task)

**IMPORTANT**: This section is executed by the DevOps specialist AFTER user confirms production deployment.

### Step 6.1: Wait for User Confirmation

**HALT HERE** until user provides:
- ✅ Production URL
- ✅ Confirmation that manual testing passed

### Step 6.2: Playwright Test Plan

Once production URL is received, DevOps will:

1. **Install Playwright browser** (if needed):
   ```
   mcp__playwright__browser_install
   ```

2. **Navigate to production URL**:
   ```
   mcp__playwright__browser_navigate
   url: "https://[USER-PROVIDED-URL].vercel.app"
   ```

3. **Capture page snapshot**:
   ```
   mcp__playwright__browser_snapshot
   ```
   - Verify login page elements are present
   - Take screenshot: `d:\test\docs\deployment\screenshots\production-login-page.png`

4. **Check console for errors**:
   ```
   mcp__playwright__browser_console_messages
   onlyErrors: true
   ```
   - Verify no Supabase connection errors
   - Verify no 404 or network errors

5. **Test login page interaction** (optional):
   ```
   mcp__playwright__browser_click
   element: "Email input field"
   ref: [from snapshot]
   ```

6. **Document results**:
   - Screenshot locations
   - Console errors (if any)
   - Page load time
   - Supabase connection status

---

## Part 7: Continuous Deployment Setup

### Step 7.1: Automatic Deployments

Vercel is now configured for **automatic deployments**:

| Git Action | Deployment Type | URL |
|------------|-----------------|-----|
| Push to `main` | Production | `cannapos-thailand.vercel.app` |
| Push to other branch | Preview | `cannapos-thailand-git-feature.vercel.app` |
| Open Pull Request | Preview | Unique URL per PR |

### Step 7.2: Preview Deployments for PRs

Every pull request automatically gets a **preview deployment**:

1. Create a feature branch: `git checkout -b feature/new-cart`
2. Make changes and push: `git push origin feature/new-cart`
3. Open Pull Request on GitHub
4. Vercel bot comments on PR with preview URL:
   ```
   ✅ Deployed to https://cannapos-thailand-git-feature-new-cart.vercel.app
   ```

5. Test changes in preview environment before merging

### Step 7.3: Rollback Procedure

If production deployment fails or has bugs:

**Option A: Instant Rollback via Vercel Dashboard**

1. Go to **Deployments** tab
2. Find the last working deployment
3. Click **"..."** menu → **"Promote to Production"**
4. Previous working version is now live (takes ~30 seconds)

**Option B: Git Revert**

```bash
# Revert the problematic commit
git revert [commit-hash]
git push origin main

# Vercel will automatically deploy the reverted version
```

**Option C: Redeploy from Dashboard**

1. Go to **Deployments** tab
2. Find a successful deployment
3. Click **"..."** menu → **"Redeploy"**

---

## Part 8: Configuration Files & Best Practices

### Step 8.1: Optional vercel.json Configuration

Create `d:\test\apps\web\vercel.json` for advanced configuration:

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "framework": "vite",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Benefits:**
- Security headers for production
- SPA routing support (all routes → `index.html`)
- Explicit build configuration

### Step 8.2: .gitignore for Vercel

Ensure `.gitignore` includes:

```gitignore
# Vercel
.vercel

# Environment files (NEVER commit these)
.env
.env.local
.env.production
```

### Step 8.3: Environment Variable Security

**DO NOT** commit these files:
- ❌ `.env` - Contains production secrets
- ❌ `.env.local` - Local development secrets
- ❌ `.vercel/project.json` - Vercel project configuration

**DO** commit these files:
- ✅ `.env.example` - Template without actual values
- ✅ `vercel.json` - Public configuration

**Example `.env.example`**:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url-here
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

---

## Part 9: Troubleshooting

### Issue 1: Build Fails with "Cannot find module"

**Symptoms:**
```
Error: Cannot find module '@/components/ui/button'
```

**Solution:**
1. Check `vite.config.ts` has correct alias:
   ```ts
   resolve: {
     alias: {
       '@': path.resolve(__dirname, './src'),
     },
   }
   ```

2. Check `tsconfig.json` has matching paths:
   ```json
   "paths": {
     "@/*": ["./src/*"]
   }
   ```

### Issue 2: Environment Variables Not Working

**Symptoms:**
```
import.meta.env.VITE_SUPABASE_URL is undefined
```

**Solution:**
1. Verify variable names start with `VITE_` prefix
2. Check variables are added in Vercel Settings
3. Redeploy after adding variables (Settings → Deployments → Redeploy)

### Issue 3: SPA Routing 404 Errors

**Symptoms:**
- Direct URLs like `/dashboard` return 404
- Only root `/` works

**Solution:**
Add to `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Issue 4: Build Timeout on Free Plan

**Symptoms:**
```
Build exceeded maximum duration of 45 seconds
```

**Solution:**
1. Optimize build:
   - Remove unnecessary dependencies
   - Use `vite build --minify esbuild` (faster than terser)
2. Upgrade to Pro plan (10-minute timeout)

---

## Part 10: Performance Optimization

### Step 10.1: Build Performance

Current build command:
```json
"build": "tsc -b && vite build"
```

**Optimization options:**

```json
{
  "scripts": {
    "build": "tsc -b && vite build --minify esbuild",
    "build:analyze": "tsc -b && vite build --mode analyze"
  }
}
```

### Step 10.2: Vite Build Configuration

Update `vite.config.ts` for production:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false, // Disable source maps for faster builds
    minify: 'esbuild', // Faster than terser
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
```

---

## Part 11: Monitoring & Analytics

### Step 11.1: Vercel Analytics (Optional)

Enable built-in analytics:

1. Go to **Project Settings → Analytics**
2. Toggle **"Enable Analytics"**
3. View metrics:
   - Page views
   - Top pages
   - Audience insights

### Step 11.2: Deployment Notifications

Set up notifications:

1. Go to **Project Settings → Notifications**
2. Choose notification types:
   - ✅ Deployment started
   - ✅ Deployment succeeded
   - ✅ Deployment failed
3. Select notification method:
   - Email
   - Slack (requires integration)
   - Discord (requires webhook)

---

## Summary Checklist

**Pre-Deployment:**
- [ ] GitHub repository is up to date
- [ ] Environment variables are documented
- [ ] Vite build works locally (`pnpm run build`)
- [ ] TypeScript compiles without errors (`tsc -b`)

**Vercel Setup:**
- [ ] Vercel account created and linked to GitHub
- [ ] Project imported from GitHub
- [ ] Build settings configured:
  - Framework: Vite
  - Root: `apps/web`
  - Build: `pnpm run build`
  - Output: `dist`
- [ ] Environment variables added (Production, Preview, Development)

**Deployment:**
- [ ] Initial deployment completed successfully
- [ ] Production URL accessible
- [ ] Login page loads without errors
- [ ] Supabase connection verified
- [ ] Console has no errors (F12 → Console)

**Post-Deployment:**
- [ ] Playwright tests executed by DevOps
- [ ] Screenshots captured and reviewed
- [ ] Performance verified (load time < 3s)
- [ ] Automatic deployments working (push to main)
- [ ] Preview deployments working (pull requests)

**Ongoing:**
- [ ] Rollback procedure documented
- [ ] Team notified of production URL
- [ ] Monitoring/analytics enabled (optional)

---

## Next Steps

1. **User Action Required**:
   - Complete Vercel setup following Parts 1-5
   - Manually verify deployment in browser
   - Share production URL with DevOps team

2. **DevOps Action Required** (AFTER user confirmation):
   - Execute Playwright browser tests (Part 6)
   - Capture and analyze screenshots
   - Document test results
   - Store knowledge in Byterover memory

3. **Team Handoff**:
   - Provide production URL to all team members
   - Update documentation with actual URL
   - Set up team access in Vercel (Settings → Members)

---

## Support & Resources

**Official Documentation:**
- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vite.dev/guide/
- Vercel CLI: https://vercel.com/docs/cli

**Common Commands:**

```bash
# Install Vercel CLI (optional, for local testing)
pnpm add -g vercel

# Login to Vercel
vercel login

# Deploy from CLI (alternative to git push)
vercel --prod

# Pull environment variables to local
vercel env pull
```

**Vercel Support:**
- Community: https://vercel.com/community
- Discord: https://vercel.com/discord
- GitHub Issues: https://github.com/vercel/vercel/issues

---

**Document Version**: 1.0
**Last Updated**: 2025-10-23
**Author**: DevOps Deployment Specialist
**Project**: CannaPOS Thailand - Vercel Deployment
