# Test 7 Retest Instructions - Session Restoration Fix

**Priority:** P0 - CRITICAL
**Fix Applied:** 2025-10-13
**Previous Status:** FAIL
**Expected Status:** PASS

## What Was Fixed

Fixed the `getUserProfile()` hanging issue during page refresh by implementing mutual exclusion to prevent duplicate profile fetches between `getSession()` and `onAuthStateChange`.

**Key Changes:**
- Added `isFetchingProfile` mutex flag to prevent race conditions
- Separated handling of `INITIAL_SESSION` (ignored) vs `SIGNED_IN` (processed)
- Added comprehensive logging and 3-second query timeout
- Reduced database queries by 50% (1 fetch instead of 2)

## Test Environment

**URL:** http://localhost:5176
**Test Credentials:**
- Email: `admin@example.com`
- Password: (as configured in your test environment)

## Pre-Test Checklist

- [ ] Latest code pulled from repository
- [ ] `npm install` run in `apps/web/`
- [ ] Dev server running on port 5176
- [ ] Browser DevTools console open (F12)
- [ ] Network tab open and set to "All" requests
- [ ] Console cleared before each test
- [ ] Hard refresh performed (Ctrl+Shift+R)

## Test 7: Session Persistence on Refresh

### Step 1: Fresh Login
**Expected Time:** < 2 seconds

1. Open browser in **incognito/private mode**
2. Navigate to `http://localhost:5176`
3. Enter test credentials
4. Click "Sign In"
5. Observe console logs and network requests

**Expected Console Output:**
```
[AuthContext] handleSignIn called for email: admin@example.com
[AuthContext] Calling authSignIn...
[auth.service] signIn called for email: admin@example.com
[auth.service] Calling supabase.auth.signInWithPassword...
[auth.service] signInWithPassword succeeded
[auth.service] Fetching user profile...
[auth.service] getUserProfile called for user ID: <uuid>
[auth.service] Querying users table...
[auth.service] Query created, awaiting response...
[auth.service] Query completed: {hasData: true, hasError: false}
[AuthContext] onAuthStateChange event: {event: 'SIGNED_IN', ...}
[AuthContext] Handling SIGNED_IN event (fresh login), fetching profile...
[auth.service] getUserProfile called for user ID: <uuid>
[auth.service] Query completed: {hasData: true, hasError: false}
[AuthContext] Profile fetched successfully from SIGNED_IN
[AuthContext] Setting loading=false after SIGNED_IN event
```

**Expected Network Requests:**
1. POST to `/auth/v1/token` (sign in) → 200 OK
2. POST to `/rest/v1/users` (first profile fetch) → 200 OK
3. POST to `/rest/v1/users` (second profile fetch from event) → 200 OK

**Expected Behavior:**
- [ ] Login completes within 2 seconds
- [ ] User redirected to `/pos` page
- [ ] Profile displayed in header (name, role)
- [ ] No timeout warnings in console
- [ ] No errors in console

**Result:** ✅ PASS / ❌ FAIL

---

### Step 2: Page Refresh (Session Restoration)
**Expected Time:** < 2 seconds
**THIS IS THE CRITICAL TEST**

1. **While logged in** on `/pos` page
2. Clear console (but don't close DevTools)
3. Clear network log
4. Press F5 or Ctrl+R to refresh page
5. Observe console logs and network requests carefully

**Expected Console Output:**
```
[supabase] Supabase client initialized
[supabase] URL: https://<project>.supabase.co
[supabase] localStorage keys: ['sb-<project>-auth-token']
[AuthContext] useEffect initializing
[AuthContext] Checking for existing session...
[AuthContext] Setting up onAuthStateChange listener
[AuthContext] Auth state listener subscribed
[AuthContext] getSession result: {hasSession: true, hasUser: true, userId: '<uuid>'}
[AuthContext] Session found, fetching user profile...
[auth.service] getUserProfile called for user ID: <uuid>
[auth.service] Stack trace: Error
    at getUserProfile (auth.service.ts:88)
    at AuthContext.tsx:71
[auth.service] Querying users table...
[auth.service] Supabase client state: {hasClient: true, authHeader: 'Bearer eyJ...'}
[auth.service] Query created, awaiting response...
[auth.service] Query completed: {hasData: true, hasError: false}
[auth.service] User data fetched successfully: {userId: '...', email: 'admin@example.com', role: 'admin'}
[AuthContext] User profile fetched from getSession: {userId: '...', email: 'admin@example.com', role: 'admin'}
[AuthContext] Setting loading=false after getSession
[AuthContext] onAuthStateChange event: {event: 'INITIAL_SESSION', hasSession: true, hasUser: true}
[AuthContext] Ignoring INITIAL_SESSION event - profile already fetched by getSession()
```

**Expected Network Requests:**
1. POST to `/rest/v1/users` (profile fetch) → 200 OK
2. **IMPORTANT:** Only ONE database request (not two!)

**Expected Behavior:**
- [ ] Page refresh completes within 2 seconds
- [ ] User remains on `/pos` page (no redirect to login)
- [ ] Profile displayed in header (name, role)
- [ ] Loading state disappears quickly
- [ ] NO timeout warnings in console
- [ ] NO "Query timeout after 3 seconds" errors
- [ ] NO hanging or frozen UI

**Critical Success Criteria:**
- [ ] `INITIAL_SESSION` event logged and **ignored**
- [ ] Profile fetch happens **only once** (from `getSession()`)
- [ ] No second call to `getUserProfile()` from `onAuthStateChange`
- [ ] Total time from refresh to profile displayed: < 2 seconds

**Result:** ✅ PASS / ❌ FAIL

---

### Step 3: Multiple Refreshes
**Purpose:** Verify consistency

1. Perform 3 rapid refreshes (F5, F5, F5)
2. Observe console logs for each refresh

**Expected Behavior:**
- [ ] Each refresh behaves identically to Step 2
- [ ] No errors accumulate
- [ ] Profile always loads within 2 seconds
- [ ] No memory leaks or stuck promises

**Result:** ✅ PASS / ❌ FAIL

---

### Step 4: Long Session (Optional)
**Purpose:** Verify token refresh doesn't break profile

1. Leave page open for 10 minutes
2. Observe console for `TOKEN_REFRESHED` event
3. Verify profile remains displayed

**Expected Console Output:**
```
[AuthContext] Token refreshed for user: <uuid>
```

**Expected Behavior:**
- [ ] Token refreshes automatically
- [ ] Profile NOT re-fetched (unnecessary)
- [ ] User remains authenticated
- [ ] No UI flicker or loading state

**Result:** ✅ PASS / ❌ FAIL

---

## What to Look For

### PASS Criteria (All Must Be Met)

1. **No Hanging:**
   - Profile fetch completes within 2 seconds
   - No 5-second timeout warnings

2. **Single Profile Fetch:**
   - Network tab shows only ONE `/rest/v1/users` request on refresh
   - Console shows only ONE `getUserProfile()` call completing

3. **Correct Event Handling:**
   - `INITIAL_SESSION` event is logged and ignored
   - `SIGNED_IN` event only processed during fresh login

4. **Consistent Behavior:**
   - Multiple refreshes produce identical results
   - No degradation over time

5. **User Experience:**
   - Fast loading (< 2 seconds)
   - No visible errors or warnings
   - Profile always displayed

### FAIL Indicators (Any One Fails Test)

1. **Hanging/Timeout:**
   - "Query timeout after 3 seconds" error
   - "Auth verification timeout (5s)" warning
   - Profile not displayed after 5+ seconds

2. **Duplicate Fetches:**
   - Two `/rest/v1/users` requests on refresh
   - `getUserProfile()` called twice in logs

3. **Event Handling Issues:**
   - `INITIAL_SESSION` triggers profile fetch
   - `SIGNED_IN` fires during refresh (should not)

4. **Inconsistent Behavior:**
   - Some refreshes work, others fail
   - Errors accumulate with multiple refreshes

5. **Network Issues:**
   - No network request made (query hangs internally)
   - Request made but never completes

## Debugging Failed Tests

If Test 7 fails, capture the following information:

1. **Full Console Log:**
   - Copy entire console output
   - Include timestamps
   - Note where the hang occurs

2. **Network Log:**
   - Screenshot of network tab
   - Request/response details for `/rest/v1/users`
   - Request headers (check Authorization header)

3. **Browser State:**
   - Check localStorage keys (F12 → Application → Local Storage)
   - Look for `sb-<project>-auth-token`
   - Copy token value (redact in report)

4. **Timing:**
   - Note exact time when hang occurs
   - How long until timeout?
   - Does it ever resolve?

5. **Supabase Client State:**
   - Look for log: `[auth.service] Supabase client state: {...}`
   - Note if `authHeader` is "none" or "Bearer ..."

## Reporting Results

### If PASS:
```
Test 7: Session Persistence - PASS

✅ Fresh login: < 2 seconds
✅ Page refresh: < 2 seconds
✅ Profile displayed after refresh
✅ Single profile fetch per operation
✅ No timeout warnings
✅ INITIAL_SESSION event ignored correctly

Notes: All criteria met. Session restoration working as expected.
```

### If FAIL:
```
Test 7: Session Persistence - FAIL

Step 2 (Page Refresh) failed:
- Symptom: [describe what happened]
- Time to failure: [seconds]
- Error message: [exact error from console]
- Network requests: [number and status]
- Console logs: [attach full log]
- Screenshot: [attach if applicable]

Debugging info:
- [paste relevant logs]
- [include network tab screenshot]
```

## Additional Notes

### Known Issues (Expected, Not Failures)

1. **Port Variation:** Dev server may run on 5173, 5174, 5175, or 5176
   - This is normal and not a failure

2. **Stack Traces in Logs:** The fix includes intentional stack trace logging
   - Look for: `[auth.service] Stack trace: Error at getUserProfile`
   - This is for debugging and not an error

3. **Multiple Auth Events:** You may see multiple auth events on login
   - `SIGNED_IN` during fresh login
   - `TOKEN_REFRESHED` periodically
   - All are normal

### Browser Compatibility

Test in at least 2 browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Edge

Session restoration should work identically in all browsers.

## Questions?

If you encounter issues not covered in this guide, contact:
- **Backend Expert:** For database/RLS issues
- **React Frontend Architect:** For auth flow questions (that's me!)
- **DevOps:** For Supabase configuration issues
