# Playwright Testing Procedures for Vercel Deployment

## Overview

This document outlines the automated browser testing procedures using Playwright MCP tools to verify the CannaPOS Thailand production deployment on Vercel.

**Purpose**: Validate that the production deployment is accessible, functional, and properly connected to Supabase backend.

**Prerequisites**:
- User has completed Vercel deployment
- Production URL has been provided
- Manual browser testing has passed

---

## Test Execution Flow

### Phase 1: Pre-Test Preparation

**IMPORTANT**: Do NOT proceed until user confirms:
- ✅ Vercel deployment completed successfully
- ✅ Production URL is accessible
- ✅ Manual browser verification passed
- ✅ Production URL provided (e.g., `https://cannapos-thailand.vercel.app`)

**User Notification Template:**

```
🛑 WAITING FOR USER ACTION

Please complete the following steps and provide information:

1. Complete Vercel deployment following: docs/deployment/vercel-deployment-guide.md
2. Manually verify the production URL loads in your browser
3. Check browser console (F12) for any errors
4. Confirm Supabase connection works (try login page)
5. Provide your production URL here

Once confirmed, I will proceed with automated Playwright testing.
```

---

## Phase 2: Playwright Browser Testing

### Test 1: Browser Installation Check

**MCP Tool**: `mcp__playwright__browser_install`

**Purpose**: Ensure Playwright browser is installed and ready

**Execution**:
```typescript
mcp__playwright__browser_install
```

**Expected Result**:
- Browser (Chromium) installed successfully
- No installation errors

**Failure Handling**:
- If installation fails, document error
- Attempt manual browser download
- Report issue to user

---

### Test 2: Navigate to Production URL

**MCP Tool**: `mcp__playwright__browser_navigate`

**Purpose**: Load the production application in browser

**Execution**:
```typescript
mcp__playwright__browser_navigate
url: "[USER-PROVIDED-PRODUCTION-URL]"
```

**Example**:
```typescript
mcp__playwright__browser_navigate
url: "https://cannapos-thailand.vercel.app"
```

**Expected Result**:
- Page loads successfully (HTTP 200)
- No navigation errors
- Page responds within 5 seconds

**Success Indicators**:
- Navigation completes
- Page title loads
- No network errors

**Failure Scenarios**:
| Error | Cause | Action |
|-------|-------|--------|
| Timeout | Slow server response | Retry once, then document |
| 404 Not Found | Wrong URL or deployment failed | Verify URL with user |
| 500 Server Error | Build/deployment issue | Check Vercel deployment logs |
| DNS Error | Domain not configured | Verify Vercel domain settings |

---

### Test 3: Capture Page Snapshot

**MCP Tool**: `mcp__playwright__browser_snapshot`

**Purpose**: Capture accessibility tree snapshot to verify page structure

**Execution**:
```typescript
mcp__playwright__browser_snapshot
```

**Expected Result**: Snapshot shows:
- Login page elements present
- Email input field
- Password input field
- Login button
- No error messages or warnings

**Verification Checklist**:
- [ ] Page heading/title visible
- [ ] Input fields for email and password
- [ ] Submit/login button present
- [ ] No "Failed to fetch" or connection error messages
- [ ] Navigation elements (if applicable)

**Screenshot Capture**:
```typescript
mcp__playwright__browser_take_screenshot
filename: "docs/deployment/screenshots/production-login-page.png"
type: "png"
```

**Documentation**:
- Save snapshot output to file
- Include timestamp
- Note any unexpected elements

---

### Test 4: Check Console for Errors

**MCP Tool**: `mcp__playwright__browser_console_messages`

**Purpose**: Verify no JavaScript errors or Supabase connection issues

**Execution**:
```typescript
mcp__playwright__browser_console_messages
onlyErrors: true
```

**Expected Result**: Empty or minimal errors

**Acceptable Errors**:
- Minor favicon 404 (not critical)
- Third-party script warnings (if any)

**CRITICAL ERRORS** (Must be reported immediately):
```javascript
❌ Failed to fetch
❌ supabase is not defined
❌ import.meta.env.VITE_SUPABASE_URL is undefined
❌ 401 Unauthorized (Supabase)
❌ CORS policy error
❌ Network request failed
```

**Error Analysis**:

| Error Message | Root Cause | Solution |
|---------------|------------|----------|
| `VITE_SUPABASE_URL is undefined` | Missing environment variable | Add to Vercel → Settings → Environment Variables |
| `Failed to fetch` | Supabase connection blocked | Check Supabase URL, API key, and CORS settings |
| `supabase is not defined` | Import error or build issue | Check `src/lib/supabase.ts` is included in build |
| `401 Unauthorized` | Invalid Supabase anon key | Verify anon key in Vercel environment variables |

---

### Test 5: Test Supabase Connection (Optional)

**MCP Tool**: `mcp__playwright__browser_evaluate`

**Purpose**: Execute JavaScript to verify Supabase client initialization

**Execution**:
```typescript
mcp__playwright__browser_evaluate
function: "() => { return typeof window.supabase !== 'undefined' && window.supabase !== null }"
```

**Expected Result**: `true` (Supabase client is initialized)

**Alternative Test** - Check environment variables:
```typescript
mcp__playwright__browser_evaluate
function: "() => { return {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
}}"
```

**Expected Result**:
```json
{
  "supabaseUrl": "https://cqbjcxbumucgohfhebdq.supabase.co",
  "hasAnonKey": true
}
```

---

### Test 6: Verify Login Page Elements (Optional)

**MCP Tool**: `mcp__playwright__browser_click`

**Purpose**: Interact with login form to verify interactivity

**Execution** (requires snapshot refs):

1. **First, get snapshot to find element refs**:
   ```typescript
   mcp__playwright__browser_snapshot
   ```

2. **Then click email input**:
   ```typescript
   mcp__playwright__browser_click
   element: "Email input field"
   ref: "[REF-FROM-SNAPSHOT]"
   ```

3. **Verify input is focused** (check console or snapshot)

**Note**: Only execute if time permits and user explicitly requests full interaction testing.

---

### Test 7: Take Final Screenshot

**MCP Tool**: `mcp__playwright__browser_take_screenshot`

**Purpose**: Capture visual evidence of successful deployment

**Execution**:
```typescript
mcp__playwright__browser_take_screenshot
filename: "docs/deployment/screenshots/production-verified.png"
type: "png"
fullPage: true
```

**Screenshot Requirements**:
- Full page capture
- High quality (PNG format)
- Saved to `docs/deployment/screenshots/` directory
- Timestamped filename

---

### Test 8: Close Browser Session

**MCP Tool**: `mcp__playwright__browser_close`

**Purpose**: Clean up browser resources

**Execution**:
```typescript
mcp__playwright__browser_close
```

---

## Phase 3: Test Results Documentation

### Test Report Template

Create file: `docs/deployment/test-results-[DATE].md`

```markdown
# Playwright Test Results - Production Deployment

**Date**: [YYYY-MM-DD HH:MM:SS]
**Production URL**: [USER-PROVIDED-URL]
**Tester**: DevOps Deployment Specialist (Automated)

---

## Test Summary

| Test | Status | Notes |
|------|--------|-------|
| Browser Installation | ✅ PASS / ❌ FAIL | [Details] |
| Page Navigation | ✅ PASS / ❌ FAIL | [Response time] |
| Page Snapshot | ✅ PASS / ❌ FAIL | [Elements found] |
| Console Errors | ✅ PASS / ❌ FAIL | [Error count] |
| Supabase Connection | ✅ PASS / ❌ FAIL | [Connection status] |

---

## Detailed Results

### 1. Browser Installation
- **Status**: PASS
- **Browser**: Chromium
- **Version**: [Version number]

### 2. Page Navigation
- **URL**: https://cannapos-thailand.vercel.app
- **Status Code**: 200 OK
- **Response Time**: 1.2s
- **Notes**: Page loaded successfully

### 3. Page Snapshot
- **Elements Found**:
  - ✅ Login page heading
  - ✅ Email input field
  - ✅ Password input field
  - ✅ Login button
- **Screenshot**: `docs/deployment/screenshots/production-login-page.png`

### 4. Console Errors
- **Error Count**: 0
- **Warnings**: 1 (favicon 404 - not critical)
- **Critical Issues**: None

### 5. Supabase Connection
- **Supabase URL**: https://cqbjcxbumucgohfhebdq.supabase.co
- **Anon Key Present**: ✅ Yes
- **Connection Status**: ✅ Connected

---

## Screenshots

1. **Login Page**: `docs/deployment/screenshots/production-login-page.png`
2. **Full Page**: `docs/deployment/screenshots/production-verified.png`

---

## Issues & Recommendations

### Critical Issues
- None

### Warnings
- Favicon 404 (not critical, but can be fixed)

### Recommendations
1. Add favicon to `apps/web/public/` directory
2. Enable Vercel Analytics for performance monitoring
3. Set up error tracking (Sentry or similar)
4. Configure custom domain (optional)

---

## Conclusion

**Overall Status**: ✅ PASS

The production deployment is **VERIFIED** and ready for use. All critical tests passed:
- Page loads successfully
- Supabase connection established
- No critical console errors
- Login page renders correctly

**Production URL is LIVE**: [URL]

---

**Next Steps**:
1. Share production URL with team
2. Configure monitoring and alerts
3. Document rollback procedures
4. Plan for continuous deployment automation
```

---

## Phase 4: Error Handling & Troubleshooting

### Common Issues & Solutions

#### Issue 1: Browser Installation Fails

**Symptoms**:
```
Error: Failed to download browser
```

**Solution**:
1. Check internet connection
2. Retry installation: `mcp__playwright__browser_install`
3. If persistent, document error and notify user

#### Issue 2: Page Load Timeout

**Symptoms**:
```
Error: Navigation timeout of 30000ms exceeded
```

**Solutions**:
1. Verify URL is correct
2. Check Vercel deployment status
3. Retry navigation with longer timeout
4. If persistent, check Vercel deployment logs

#### Issue 3: Console Shows Supabase Errors

**Symptoms**:
```javascript
Error: supabase.auth.signInWithPassword is not a function
```

**Root Causes**:
- Wrong Supabase client version
- Missing environment variables
- Incorrect Supabase initialization

**Solutions**:
1. Check `apps/web/package.json` - `@supabase/supabase-js` version
2. Verify environment variables in Vercel
3. Redeploy with correct configuration

#### Issue 4: Blank Page or Build Errors

**Symptoms**:
- Page loads but shows nothing
- Console shows "Failed to load module"

**Solutions**:
1. Check Vercel build logs
2. Verify `apps/web` has correct build configuration
3. Check `vite.config.ts` paths and aliases
4. Ensure all dependencies are in `package.json`

---

## Phase 5: Reporting to User

### Success Report Template

```markdown
✅ **Playwright Testing Complete - ALL TESTS PASSED**

Your CannaPOS Thailand application is successfully deployed and verified!

**Production URL**: https://cannapos-thailand.vercel.app

**Test Results**:
- ✅ Page loads successfully (1.2s response time)
- ✅ Login page renders correctly
- ✅ Supabase connection established
- ✅ No critical console errors
- ✅ All UI elements present

**Screenshots**:
- Login Page: docs/deployment/screenshots/production-login-page.png
- Full Page: docs/deployment/screenshots/production-verified.png

**Detailed Report**: docs/deployment/test-results-[DATE].md

**Next Steps**:
1. Share production URL with your team
2. Test login functionality manually with real credentials
3. Set up monitoring (Vercel Analytics recommended)
4. Configure custom domain (optional)

**Automatic Deployments**:
- Push to `main` branch → Production deployment
- Pull requests → Preview deployments with unique URLs

Need help? Refer to: docs/deployment/vercel-deployment-guide.md
```

### Failure Report Template

```markdown
❌ **Playwright Testing Complete - ISSUES DETECTED**

Your application deployed, but there are issues that need attention.

**Production URL**: https://cannapos-thailand.vercel.app

**Failed Tests**:
- ❌ [Test Name]: [Error details]
- ❌ [Test Name]: [Error details]

**Critical Issues**:
1. **[Issue]**: [Description and impact]
   - **Root Cause**: [Analysis]
   - **Solution**: [Steps to fix]

**Console Errors**:
```
[Error messages from browser console]
```

**Screenshots**:
- Error Screenshot: docs/deployment/screenshots/production-error.png

**Recommended Actions**:
1. [Action 1 with specific steps]
2. [Action 2 with specific steps]
3. Contact DevOps if issues persist

**Support Resources**:
- Vercel Deployment Guide: docs/deployment/vercel-deployment-guide.md
- Vercel Build Logs: [Link to deployment logs]
- Troubleshooting Section: See Part 9 in deployment guide

Need assistance? Tag @devops-team in project channel.
```

---

## Appendices

### Appendix A: Playwright MCP Tools Reference

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `browser_install` | Install browser | First time setup |
| `browser_navigate` | Load URL | Every test session |
| `browser_snapshot` | Capture accessibility tree | Verify page structure |
| `browser_take_screenshot` | Capture visual screenshot | Documentation and debugging |
| `browser_console_messages` | Get console output | Check for errors |
| `browser_evaluate` | Run JavaScript | Test runtime behavior |
| `browser_click` | Interact with elements | Test user interactions |
| `browser_close` | Close browser | Cleanup after testing |

### Appendix B: Expected Page Elements (Login Page)

```
- heading: "CannaPOS Thailand" or "Login"
- textbox: "Email" or "Username"
- textbox: "Password"
- button: "Sign In" or "Login"
- link: "Forgot Password?" (optional)
```

### Appendix C: Supabase Health Check Script

```javascript
// Execute via browser_evaluate
() => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    return {
      status: 'healthy',
      supabaseUrl: supabaseUrl ? 'present' : 'missing',
      anonKey: supabaseAnonKey ? 'present' : 'missing',
      keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }
}
```

### Appendix D: Test Execution Checklist

**Pre-Test**:
- [ ] User completed Vercel deployment
- [ ] User provided production URL
- [ ] User confirmed manual browser testing passed
- [ ] Production URL format verified (https://)

**During Test**:
- [ ] Browser installed successfully
- [ ] Page navigates without timeout
- [ ] Snapshot captured and analyzed
- [ ] Console errors checked and documented
- [ ] Screenshots saved to correct directory
- [ ] All test results recorded

**Post-Test**:
- [ ] Test report created
- [ ] Screenshots attached
- [ ] Issues documented with solutions
- [ ] User notified with results
- [ ] Knowledge stored in Byterover
- [ ] Browser session closed

---

**Document Version**: 1.0
**Last Updated**: 2025-10-23
**Author**: DevOps Deployment Specialist
**Project**: CannaPOS Thailand - Playwright Testing Procedures
