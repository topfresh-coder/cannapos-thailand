import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import {
  signIn as authSignIn,
  signOut as authSignOut,
  getUserProfile,
  type UserProfile,
} from '@/services/auth.service';
import type { AuthError } from '@supabase/supabase-js';

/**
 * Authentication Context Value
 *
 * Provides authentication state and methods to all components in the app.
 */
interface AuthContextValue {
  /** Current authenticated user profile, null if not authenticated */
  user: UserProfile | null;
  /** True when auth operations are in progress (loading, signing in, etc.) */
  loading: boolean;
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<void>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Authentication Provider Component
 *
 * Wraps the application to provide authentication state and methods.
 * Automatically listens for Supabase auth state changes and fetches user profiles.
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthContext] useEffect initializing');
    let isTimedOut = false;
    let isFetchingProfile = false;

    // Safety timeout: if auth verification takes more than 5 seconds, stop loading
    const timeoutId = setTimeout(() => {
      console.warn('[AuthContext] Auth verification timeout (5s) - stopping loading state');
      isTimedOut = true;
      setLoading(false);
    }, 5000);

    // Check for existing session on mount
    console.log('[AuthContext] Checking for existing session...');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AuthContext] getSession result:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
      });

      if (session?.user && !isFetchingProfile) {
        console.log('[AuthContext] Session found, fetching user profile...');
        isFetchingProfile = true;
        getUserProfile(session.user.id)
          .then((profile) => {
            console.log('[AuthContext] User profile fetched from getSession:', {
              userId: profile.id,
              email: profile.email,
              role: profile.role,
            });
            setUser(profile);
          })
          .catch((error) => {
            console.error('[AuthContext] Failed to fetch user profile from getSession:', error);
            setUser(null);
          })
          .finally(() => {
            isFetchingProfile = false;
            if (!isTimedOut) {
              console.log('[AuthContext] Setting loading=false after getSession');
              setLoading(false);
              clearTimeout(timeoutId);
            }
          });
      } else {
        console.log('[AuthContext] No session found, setting loading=false');
        setLoading(false);
        clearTimeout(timeoutId);
      }
    });

    // Listen for auth state changes
    console.log('[AuthContext] Setting up onAuthStateChange listener');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] onAuthStateChange event:', {
        event,
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        isFetchingProfile,
      });

      // IMPORTANT: Only fetch profile for SIGNED_IN during fresh login
      // Do NOT fetch for INITIAL_SESSION - that's handled by getSession() above
      if (event === 'SIGNED_IN' && session?.user && !isFetchingProfile) {
        console.log('[AuthContext] Handling SIGNED_IN event (fresh login), fetching profile...');
        isFetchingProfile = true;
        try {
          const profile = await getUserProfile(session.user.id);
          console.log('[AuthContext] Profile fetched successfully from SIGNED_IN:', {
            userId: profile.id,
            email: profile.email,
            role: profile.role,
          });
          setUser(profile);
        } catch (error) {
          console.error('[AuthContext] Failed to fetch user profile from SIGNED_IN:', error);
          setUser(null);
        } finally {
          isFetchingProfile = false;
          if (!isTimedOut) {
            console.log('[AuthContext] Setting loading=false after SIGNED_IN event');
            setLoading(false);
            clearTimeout(timeoutId);
          }
        }
      } else if (event === 'INITIAL_SESSION') {
        console.log('[AuthContext] Ignoring INITIAL_SESSION event - profile already fetched by getSession()');
        // Do nothing - profile was already fetched by getSession() above
      } else if (event === 'SIGNED_OUT') {
        console.log('[AuthContext] Handling SIGNED_OUT event');
        setUser(null);
        setLoading(false);
        clearTimeout(timeoutId);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        console.log('[AuthContext] Token refreshed for user:', session.user.id);
        // Profile doesn't change on token refresh, no need to re-fetch
      } else {
        console.log('[AuthContext] Unhandled auth event:', event);
      }
    });

    console.log('[AuthContext] Auth state listener subscribed');

    // Cleanup subscription and timeout on unmount
    return () => {
      console.log('[AuthContext] Cleaning up subscription and timeout');
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  /**
   * Sign in handler
   *
   * Authenticates user with email/password and fetches profile.
   * User state is automatically updated via onAuthStateChange listener.
   *
   * IMPORTANT: We do NOT set loading=false here because the onAuthStateChange
   * listener will handle that after successfully fetching the user profile.
   * Only on error do we set loading=false.
   */
  const handleSignIn = async (email: string, password: string): Promise<void> => {
    console.log('[AuthContext] handleSignIn called for email:', email);
    setLoading(true);
    try {
      console.log('[AuthContext] Calling authSignIn...');
      await authSignIn(email, password);
      console.log('[AuthContext] authSignIn completed successfully');
      // User state will be updated by onAuthStateChange listener
      // DO NOT set loading=false here - let the listener handle it
    } catch (error) {
      console.error('[AuthContext] authSignIn failed:', error);
      setLoading(false);
      throw error as AuthError;
    }
  };

  /**
   * Sign out handler
   *
   * Signs out user and clears session.
   * User state is automatically updated via onAuthStateChange listener.
   *
   * IMPORTANT: We do NOT set loading=false here because the onAuthStateChange
   * listener will handle that after processing the SIGNED_OUT event.
   * Only on error do we set loading=false.
   */
  const handleSignOut = async (): Promise<void> => {
    console.log('[AuthContext] handleSignOut called');
    setLoading(true);
    try {
      console.log('[AuthContext] Calling authSignOut...');
      await authSignOut();
      console.log('[AuthContext] authSignOut completed successfully');
      // User state will be cleared by onAuthStateChange listener
      // DO NOT set loading=false here - let the listener handle it
    } catch (error) {
      console.error('[AuthContext] authSignOut failed:', error);
      setLoading(false);
      throw error as AuthError;
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access authentication context
 *
 * Must be used within an AuthProvider component.
 *
 * @throws {Error} If used outside of AuthProvider
 * @returns Authentication context value
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, loading, signIn, signOut } = useAuth();
 *
 *   if (loading) return <LoadingSpinner />;
 *   if (!user) return <LoginPage />;
 *
 *   return <div>Welcome, {user.name}!</div>;
 * }
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
