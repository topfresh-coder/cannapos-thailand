# Vercel Deployment Quick Start Guide

## TL;DR - Deploy in 5 Steps

**Time Required**: 15-30 minutes (first time)

---

## Step 1: Prepare (2 minutes)

**Check you have**:
```bash
# Verify local build works
cd d:\test
pnpm install
pnpm run build

# Should complete without errors
# Output: apps/web/dist/ directory created
```

**Get your environment variables**:
```env
VITE_SUPABASE_URL=https://cqbjcxbumucgohfhebdq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxYmpjeGJ1bXVjZ29oZmhlYmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNzcwNTMsImV4cCI6MjA3NTg1MzA1M30.7GA3ue4jEE2S6JCduPkcpMSUaoQLz7Agiq56wq074MU
```

(Copy from `apps/web/.env`)

---

## Step 2: Sign Up for Vercel (3 minutes)

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel
5. Grant access to `cannapos-thailand` repository

---

## Step 3: Import Project (5 minutes)

1. **Vercel Dashboard** → **"Add New..."** → **"Project"**
2. Find **`cannapos-thailand`** → Click **"Import"**
3. **Configure exactly like this**:

```
Framework Preset:    Vite
Root Directory:      apps/web     ← IMPORTANT!
Build Command:       pnpm run build
Output Directory:    dist
Install Command:     pnpm install
```

4. **Don't deploy yet!** Click **"Environment Variables"** first

---

## Step 4: Add Environment Variables (3 minutes)

Click **"Add Environment Variable"** for each:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://cqbjcxbumucgohfhebdq.supabase.co` | ✅ All three |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (full key) | ✅ All three |

**"All three"** means check: Production, Preview, Development

---

## Step 5: Deploy! (2-5 minutes)

1. Click **"Deploy"** button
2. Wait for build (watch the logs)
3. ✅ **Success** → You'll see your production URL
4. Click the URL to test

---

## Verify Deployment (2 minutes)

**In your browser**:
1. Open production URL (e.g., `https://cannapos-thailand.vercel.app`)
2. Press **F12** (open Developer Tools)
3. Check **Console** tab → Should have **no red errors**
4. Should see **login page**

**Expected**: Login page loads, no errors

**If errors**, see troubleshooting below

---

## Common Issues (90% of problems)

### Issue 1: Build Fails - "Cannot find module"

**Fix**: Check **Root Directory** = `apps/web` (not empty!)

### Issue 2: Login page loads but errors in console

```javascript
❌ import.meta.env.VITE_SUPABASE_URL is undefined
```

**Fix**: Add environment variables → Then **"Redeploy"**
- Go to **Settings → Environment Variables**
- Add both variables
- Go to **Deployments → ... → Redeploy**

### Issue 3: Page loads but shows "404" for routes

**Fix**: Create `apps/web/vercel.json`:
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

Then push to GitHub (Vercel auto-deploys)

---

## Test Your Deployment

**Manual Test**:
```
✅ Open production URL
✅ Login page loads
✅ No console errors (F12)
✅ Can type in input fields
✅ Try logging in (if you have test credentials)
```

**Notify DevOps**: Once manual test passes, share your production URL for automated Playwright testing.

---

## What Happens Next?

**Automatic Deployments**:
- ✅ Every push to `main` → Production deployment
- ✅ Every pull request → Preview deployment (unique URL)
- ✅ Every branch push → Preview deployment

**Example**:
```bash
# This triggers automatic deployment
git add .
git commit -m "Update cart component"
git push origin main

# Vercel automatically builds and deploys (2-5 min)
```

---

## Important URLs

**Your URLs** (after deployment):
- Production: `https://cannapos-thailand.vercel.app` (example)
- Dashboard: `https://vercel.com/dashboard`

**Documentation**:
- Full Guide: `docs/deployment/vercel-deployment-guide.md`
- Playwright Testing: `docs/deployment/playwright-testing-procedures.md`

**Support**:
- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vite.dev/guide/

---

## Rollback (If something breaks)

**Emergency Rollback** (30 seconds):
1. Vercel Dashboard → **Deployments** tab
2. Find last working deployment
3. Click **"..."** → **"Promote to Production"**
4. Done! Old version is live again

---

## Environment Variables Reference

**Current Project** (from `apps/web/.env`):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://cqbjcxbumucgohfhebdq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxYmpjeGJ1bXVjZ29oZmhlYmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNzcwNTMsImV4cCI6MjA3NTg1MzA1M30.7GA3ue4jEE2S6JCduPkcpMSUaoQLz7Agiq56wq074MU
```

**⚠️ Security**: These are already in your `.env` file. They're "public" Supabase credentials (anon key), but still don't share them unnecessarily.

---

## Success Checklist

**After deployment, verify**:
- [ ] Production URL loads
- [ ] Login page visible
- [ ] No console errors
- [ ] Supabase connection works
- [ ] Can navigate (if multiple pages exist)

**Then notify team**:
```
✅ Production deployed: [YOUR-URL]
✅ Manual verification: PASSED
✅ Ready for Playwright testing
```

---

**Need detailed instructions?** See: `docs/deployment/vercel-deployment-guide.md`

**Questions?** Tag @devops-team in project channel

---

**Document Version**: 1.0
**Last Updated**: 2025-10-23
**Estimated Time**: 15-30 minutes
