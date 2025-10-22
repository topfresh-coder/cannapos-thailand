# Deployment Documentation - CannaPOS Thailand

This directory contains all documentation related to deploying the CannaPOS Thailand application to Vercel.

---

## Quick Navigation

### 🚀 For Users (Getting Started)

**Start Here**:
1. **Quick Start** (15-30 min): [`QUICK-START.md`](./QUICK-START.md)
2. **Comprehensive Guide**: [`vercel-deployment-guide.md`](./vercel-deployment-guide.md)
3. **Current Status**: [`DEPLOYMENT-STATUS.md`](./DEPLOYMENT-STATUS.md)

### 🤖 For DevOps (After User Completes Deployment)

**Testing Procedures**:
1. [`playwright-testing-procedures.md`](./playwright-testing-procedures.md)
2. [`DEVOPS-COMPLETION-NOTES.md`](./DEVOPS-COMPLETION-NOTES.md)

### 📸 Test Results

**Screenshots**: [`screenshots/`](./screenshots/)

---

## Document Descriptions

### User Documentation

#### [`QUICK-START.md`](./QUICK-START.md)
**Purpose**: Fast-track deployment guide
**Time**: 15-30 minutes
**Audience**: Experienced users who want to deploy quickly
**Content**:
- 5-step deployment process
- Common issues (90% of problems)
- Emergency rollback procedure
- Environment variables ready to copy-paste

**When to use**: First time deployment, you want the fastest path

---

#### [`vercel-deployment-guide.md`](./vercel-deployment-guide.md)
**Purpose**: Comprehensive deployment documentation
**Time**: Reference guide (read as needed)
**Audience**: All users, especially for troubleshooting
**Content**: 11 parts covering:
1. Vercel Account Setup
2. Import Project to Vercel
3. Environment Variables Configuration
4. Deploy to Production
5. Post-Deployment Verification
6. Automated Playwright Testing
7. Continuous Deployment Setup
8. Configuration Files & Best Practices
9. Troubleshooting (8 common issues)
10. Performance Optimization
11. Monitoring & Analytics

**When to use**: Detailed instructions needed, troubleshooting issues, learning best practices

---

#### [`DEPLOYMENT-STATUS.md`](./DEPLOYMENT-STATUS.md)
**Purpose**: Real-time deployment status tracker
**Time**: Check periodically
**Audience**: All team members
**Content**:
- Current deployment phase status
- Checklist of completed tasks
- Pending action items
- Success criteria tracking
- Context7 documentation references
- Timeline and estimates

**When to use**: Check current deployment progress, see what's pending, verify success criteria

---

### DevOps Documentation

#### [`playwright-testing-procedures.md`](./playwright-testing-procedures.md)
**Purpose**: Automated browser testing procedures
**Time**: 5-10 minutes to execute
**Audience**: DevOps Deployment Specialist
**Content**:
- 8 detailed test procedures
- Expected results for each test
- Error handling and troubleshooting
- Test report templates
- Supabase connection verification
- Complete testing checklist

**When to use**: After user provides production URL, execute automated testing

---

#### [`DEVOPS-COMPLETION-NOTES.md`](./DEVOPS-COMPLETION-NOTES.md)
**Purpose**: Final completion summary
**Time**: Reference document
**Audience**: DevOps team, project managers
**Content**:
- Executive summary of all tasks
- Documentation artifacts created
- Technical insights from Context7
- Success criteria review
- Lessons learned
- Support resources

**When to use**: Review what was completed, handoff to other team members, project documentation

---

### Supporting Directories

#### [`screenshots/`](./screenshots/)
**Purpose**: Store Playwright test screenshots
**Content**:
- Production deployment screenshots
- Test verification evidence
- Error screenshots (if any)

**Populated**: After Playwright testing completes

---

## Deployment Workflow

### Phase 1: Preparation ✅ COMPLETE
**Status**: Documentation created
**Documents**: All guides listed above
**Duration**: Completed

### Phase 2: User Deployment 🟡 IN PROGRESS
**Status**: Awaiting user action
**Required Steps**:
1. Read [`QUICK-START.md`](./QUICK-START.md)
2. Complete Vercel setup (15-30 min)
3. Manual verification in browser
4. Provide production URL to DevOps

**Checklist**: See [`DEPLOYMENT-STATUS.md`](./DEPLOYMENT-STATUS.md)

### Phase 3: Automated Testing 🔴 PENDING
**Status**: Waiting for production URL
**Procedures**: [`playwright-testing-procedures.md`](./playwright-testing-procedures.md)
**Duration**: 5-10 minutes (automated)
**Output**: Test report + screenshots

### Phase 4: Completion 🔴 PENDING
**Status**: Will complete after testing
**Deliverables**:
- Test results report
- Production URL verification
- Screenshot evidence
- Knowledge stored in Byterover

---

## Essential Information

### Project Configuration

**Repository**: cannapos-thailand
**Monorepo**: Yes (`apps/web` is deployment root)
**Framework**: React 18.3.1 + Vite 7.1.7
**Package Manager**: pnpm 8.0+ (NOT npm)
**Backend**: Supabase

### Vercel Build Settings

**MUST BE EXACT**:
```
Framework Preset:    Vite
Root Directory:      apps/web
Build Command:       pnpm run build
Output Directory:    dist
Install Command:     pnpm install
Node.js Version:     18.x+
```

### Environment Variables

**Required** (from `apps/web/.env`):
```env
VITE_SUPABASE_URL=https://cqbjcxbumucgohfhebdq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxYmpjeGJ1bXVjZ29oZmhlYmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNzcwNTMsImV4cCI6MjA3NTg1MzA1M30.7GA3ue4jEE2S6JCduPkcpMSUaoQLz7Agiq56wq074MU
```

**Apply to**: Production, Preview, Development (all three)

---

## Common Issues & Quick Fixes

### Issue 1: Build fails with "Cannot find module"
**Fix**: Set Root Directory to `apps/web` in Vercel settings

### Issue 2: Environment variables undefined in console
**Fix**: Add variables in Vercel → Settings → Environment Variables, then redeploy

### Issue 3: Page shows 404 for routes
**Fix**: Create `apps/web/vercel.json` with SPA rewrite rules (see comprehensive guide)

### Issue 4: Build timeout
**Fix**: Build should complete in < 45 seconds; if not, optimize or upgrade plan

**More solutions**: See Part 9 in [`vercel-deployment-guide.md`](./vercel-deployment-guide.md)

---

## Support & Resources

### Documentation
- **Vercel Official**: https://vercel.com/docs
- **Vite Official**: https://vite.dev/guide/
- **Project Docs**: This directory

### Team Communication
- **Questions**: Tag @devops-team in project channel
- **Issues**: Create GitHub issue with "deployment" label
- **Urgent**: Contact project lead

### External Help
- **Vercel Community**: https://vercel.com/community
- **Vercel Discord**: https://vercel.com/discord
- **Vite Discord**: https://chat.vitejs.dev/

---

## Troubleshooting Decision Tree

```
Deployment Issue?
│
├─ Build fails?
│  ├─ "Cannot find module" → Check Root Directory setting
│  ├─ "pnpm not found" → Set Install Command to "pnpm install"
│  └─ "Build timeout" → Check build complexity, optimize, or upgrade plan
│
├─ Deployment succeeds but page broken?
│  ├─ Blank page → Check browser console (F12)
│  ├─ "VITE_* undefined" → Add environment variables, redeploy
│  └─ Routes 404 → Add vercel.json with rewrites
│
└─ Everything works but slow?
   └─ See Part 10 (Performance Optimization) in comprehensive guide
```

---

## Document Updates

This directory is maintained by the DevOps Deployment Specialist. Updates occur:
- After each deployment
- When issues are discovered and resolved
- When best practices evolve
- After Playwright testing completes

**Current Version**: 1.0
**Last Updated**: 2025-10-23
**Status**: Phase 1 Complete, awaiting user deployment

---

## Success Criteria

**Deployment is successful when**:
- ✅ Production URL loads without errors
- ✅ Login page visible and functional
- ✅ No console errors (F12)
- ✅ Supabase connection established
- ✅ Playwright tests pass (after execution)
- ✅ Screenshots captured
- ✅ Test report created

**Complete checklist**: See [`DEPLOYMENT-STATUS.md`](./DEPLOYMENT-STATUS.md)

---

## File Structure

```
docs/deployment/
├── README.md                              (This file - navigation guide)
├── QUICK-START.md                         (5-step fast deployment)
├── vercel-deployment-guide.md             (Comprehensive 11-part guide)
├── playwright-testing-procedures.md       (Automated testing guide)
├── DEPLOYMENT-STATUS.md                   (Real-time status tracker)
├── DEVOPS-COMPLETION-NOTES.md            (Final completion summary)
└── screenshots/
    ├── README.md                          (Screenshots info)
    └── [test-screenshots].png             (Added after testing)
```

---

## Next Actions

### For User (Right Now)
1. ✅ Read this README
2. ➡️ Open [`QUICK-START.md`](./QUICK-START.md)
3. ➡️ Complete Vercel deployment (15-30 min)
4. ➡️ Provide production URL to DevOps

### For DevOps (After User Provides URL)
1. Execute [`playwright-testing-procedures.md`](./playwright-testing-procedures.md)
2. Create test results report
3. Update [`DEPLOYMENT-STATUS.md`](./DEPLOYMENT-STATUS.md)
4. Notify user of completion

---

## Questions?

**Before deployment**: Read [`QUICK-START.md`](./QUICK-START.md) or [`vercel-deployment-guide.md`](./vercel-deployment-guide.md)

**During deployment**: Check Part 9 (Troubleshooting) in comprehensive guide

**After deployment**: Contact DevOps team with production URL for automated testing

**Stuck?**: Tag @devops-team in project channel with:
- What you were doing
- Error message (if any)
- Screenshot of issue
- Link to Vercel deployment logs

---

**Happy Deploying!** 🚀

---

**README Version**: 1.0
**Last Updated**: 2025-10-23
**Maintained By**: DevOps Deployment Specialist
**Project**: CannaPOS Thailand - Vercel Deployment
