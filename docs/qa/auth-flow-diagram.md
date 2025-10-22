# Authentication Flow Diagrams

## Before Fix (BROKEN)

```
User Action: Click "Sign In"
  │
  ├─> handleSignIn() called
  │     ├─> setLoading(true) ✅
  │     ├─> await authSignIn(email, password)
  │     │     ├─> Supabase API call ✅ (returns 200 OK)
  │     │     └─> Returns successfully
  │     │
  │     └─> finally block runs
  │           └─> setLoading(false) ❌ BUG HERE!
  │
  ├─> LoginPage sees: loading=false, user=null
  │     └─> useEffect doesn't navigate (condition: user && !loading)
  │           └─> Page stays on /login showing "Loading..."
  │
  └─> (500ms later) onAuthStateChange fires
        ├─> Receives SIGNED_IN event
        ├─> Fetches user profile ✅
        ├─> setUser(profile) ✅
        └─> setLoading(false) (too late!)
              └─> LoginPage STILL doesn't navigate (loading already false)
                    └─> 🔴 STUCK IN LOADING STATE FOREVER
```

---

## After Fix (WORKING)

```
User Action: Click "Sign In"
  │
  ├─> handleSignIn() called
  │     ├─> setLoading(true) ✅
  │     ├─> await authSignIn(email, password)
  │     │     ├─> Supabase API call ✅ (returns 200 OK)
  │     │     └─> Returns successfully
  │     │
  │     └─> (NO finally block - loading stays true) ✅
  │
  ├─> LoginPage sees: loading=true, user=null
  │     └─> Shows "Loading..." spinner
  │
  └─> (100-500ms later) onAuthStateChange fires
        ├─> Receives SIGNED_IN event
        ├─> Fetches user profile ✅
        ├─> setUser(profile) ✅
        └─> setLoading(false) ✅
              │
              └─> LoginPage sees: loading=false, user=profile ✅
                    └─> useEffect triggers (condition: user && !loading)
                          └─> navigate('/pos') ✅
                                └─> 🟢 SUCCESS! User on POS page
```

---

## Session Persistence Flow (After Fix)

```
User Action: Press F5 (refresh page)
  │
  ├─> App.tsx renders
  │     └─> AuthProvider mounts
  │           │
  │           ├─> useEffect runs
  │           │     ├─> setLoading(true) ✅
  │           │     ├─> await getSession()
  │           │     │     ├─> Checks localStorage for 'sb-*' key
  │           │     │     └─> Returns existing session ✅
  │           │     │
  │           │     ├─> Session found!
  │           │     ├─> Fetch user profile ✅
  │           │     ├─> setUser(profile) ✅
  │           │     └─> setLoading(false) ✅
  │           │
  │           └─> onAuthStateChange listener subscribed
  │                 (no event fires - session already exists)
  │
  └─> ProtectedRoute sees: loading=false, user=profile ✅
        └─> Renders child routes (stays on current page)
              └─> 🟢 SUCCESS! User stays logged in
```

---

## Key Differences

### BEFORE (Broken):
1. `handleSignIn()` sets `loading=false` **immediately** after API call
2. LoginPage sees `loading=false` and `user=null` → doesn't navigate
3. `onAuthStateChange` fires later with user profile → too late, loading already false
4. **Result:** Stuck in infinite loading state

### AFTER (Fixed):
1. `handleSignIn()` **does not** set `loading=false` (stays true)
2. LoginPage shows loading spinner while waiting
3. `onAuthStateChange` fires and sets both `user` AND `loading=false`
4. LoginPage sees both values change together → navigates successfully
5. **Result:** Smooth navigation to POS page

---

## State Transition Table

### Login Flow States

| Time | Event | Loading | User | LoginPage Action |
|------|-------|---------|------|------------------|
| T0 | Initial | false | null | Show login form |
| T1 | Click "Sign In" | true | null | Show "Signing in..." |
| T2 | API call completes | true | null | Show "Loading..." |
| T3 | onAuthStateChange fires | true | null | Still showing "Loading..." |
| T4 | Profile fetched | false | profile | **Navigate to /pos** ✅ |

### Refresh Flow States

| Time | Event | Loading | User | Page Action |
|------|-------|---------|------|-------------|
| T0 | Page loads | true | null | Show "Verifying..." |
| T1 | getSession() completes | true | null | Still showing "Verifying..." |
| T2 | Profile fetched | false | profile | **Stay on current page** ✅ |

---

## Error Scenarios

### Login Fails (Bad Credentials)

```
User Action: Click "Sign In" with wrong password
  │
  ├─> handleSignIn() called
  │     ├─> setLoading(true)
  │     ├─> await authSignIn(email, password)
  │     │     ├─> Supabase API returns 400 Bad Request
  │     │     └─> Throws AuthError
  │     │
  │     └─> catch block runs
  │           ├─> setLoading(false) ✅
  │           └─> throw error
  │
  └─> LoginPage catches error
        ├─> Shows error toast
        └─> Form re-enabled for retry
```

### Profile Fetch Fails (User Not in Database)

```
User Action: Click "Sign In" (auth succeeds, profile query fails)
  │
  ├─> handleSignIn() succeeds
  │
  └─> onAuthStateChange fires
        ├─> Receives SIGNED_IN event
        ├─> Attempts to fetch profile
        │     └─> Database returns "User profile not found"
        │
        └─> catch block runs
              ├─> setUser(null)
              ├─> setLoading(false)
              └─> User sees error, stays on login
```

### Timeout (Profile Fetch Takes > 5 Seconds)

```
User Action: Click "Sign In" (network very slow)
  │
  ├─> handleSignIn() called
  │     └─> setLoading(true)
  │
  ├─> (5 seconds pass)
  │
  └─> Safety timeout fires
        ├─> Sets isTimedOut = true
        ├─> setLoading(false)
        └─> Console warning: "Auth verification timeout"
              └─> User sees login form again, can retry
```

---

## Debug Console Output Examples

### Successful Login (Full Trace)

```
[supabase] Supabase client initialized
[supabase] URL: https://cqbjcxbumucgohfhebdq.supabase.co
[supabase] localStorage keys: []

[AuthContext] useEffect initializing
[AuthContext] Checking for existing session...
[AuthContext] Setting up onAuthStateChange listener
[AuthContext] Auth state listener subscribed

[AuthContext] getSession result: { hasSession: false, hasUser: false }
[AuthContext] No session found, setting loading=false

[LoginPage] Auth state changed: { hasUser: false, authLoading: false, shouldNavigate: false }

--- USER CLICKS SIGN IN ---

[LoginPage] onSubmit called for email: test@example.com
[LoginPage] Calling signIn...

[AuthContext] handleSignIn called for email: test@example.com
[AuthContext] Calling authSignIn...

[auth.service] signIn called for email: test@example.com
[auth.service] Calling supabase.auth.signInWithPassword...
[auth.service] signInWithPassword succeeded, user ID: abc-123-def-456
[auth.service] Fetching user profile...

[auth.service] getUserProfile called for user ID: abc-123-def-456
[auth.service] Querying users table...
[auth.service] User data fetched: {
  userId: 'abc-123-def-456',
  email: 'test@example.com',
  role: 'budtender',
  locationName: 'Main Street'
}
[auth.service] User profile fetched successfully

[AuthContext] authSignIn completed successfully
[LoginPage] signIn completed, waiting for navigation...

--- onAuthStateChange EVENT FIRES ---

[AuthContext] onAuthStateChange event: {
  event: 'SIGNED_IN',
  hasSession: true,
  hasUser: true,
  userId: 'abc-123-def-456'
}
[AuthContext] Handling SIGNED_IN event, fetching profile...

[auth.service] getUserProfile called for user ID: abc-123-def-456
[auth.service] Querying users table...
[auth.service] User data fetched: {
  userId: 'abc-123-def-456',
  email: 'test@example.com',
  role: 'budtender',
  locationName: 'Main Street'
}

[AuthContext] Profile fetched successfully: {
  userId: 'abc-123-def-456',
  email: 'test@example.com',
  role: 'budtender'
}
[AuthContext] Setting loading=false after auth event

[LoginPage] Auth state changed: {
  hasUser: true,
  authLoading: false,
  shouldNavigate: true
}
[LoginPage] Navigating to /pos

--- SUCCESS! User on POS page ---
```

---

## Testing Checklist

Use this checklist during QA testing:

### Login Flow
- [ ] Console shows `[LoginPage] onSubmit called`
- [ ] Console shows `[auth.service] signInWithPassword succeeded`
- [ ] Console shows `[AuthContext] onAuthStateChange event: SIGNED_IN`
- [ ] Console shows `[AuthContext] Profile fetched successfully`
- [ ] Console shows `[LoginPage] Navigating to /pos`
- [ ] Page navigates to POS within 2 seconds
- [ ] No "timeout" warning in console
- [ ] Loading state never "stuck"

### Session Persistence
- [ ] Console shows `[AuthContext] Checking for existing session...`
- [ ] Console shows `[AuthContext] getSession result: { hasSession: true }`
- [ ] Console shows `[AuthContext] Session found, fetching user profile...`
- [ ] Console shows `[AuthContext] Setting loading=false after getSession`
- [ ] Page stays on current route (no redirect)
- [ ] User profile visible immediately
- [ ] No timeout (completes in < 1 second)

### localStorage
- [ ] After login, localStorage contains `sb-cqbjcxbumucgohfhebdq-auth-token` key
- [ ] Key value is valid JSON with `access_token` and `refresh_token`
- [ ] Key persists after page refresh

---

**This completes the authentication flow documentation.**
