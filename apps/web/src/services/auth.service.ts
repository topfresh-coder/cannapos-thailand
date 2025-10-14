import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/supabase';
import type { AuthError } from '@supabase/supabase-js';

/**
 * User Profile Type
 * Represents a complete user profile with authentication and role information
 */
export type UserProfile = Tables<'users'> & {
  location_name?: string;
};

/**
 * Authentication Service
 *
 * Provides methods for user authentication and profile management.
 * All methods use the Supabase client for authentication operations.
 */

/**
 * Sign in a user with email and password
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns User profile data including role and location
 * @throws {AuthError} If authentication fails
 */
export async function signIn(
  email: string,
  password: string
): Promise<UserProfile> {
  console.log('[auth.service] signIn called for email:', email);

  // Authenticate with Supabase Auth
  console.log('[auth.service] Calling supabase.auth.signInWithPassword...');
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) {
    console.error('[auth.service] signInWithPassword failed:', authError);
    throw authError;
  }

  if (!authData.user) {
    console.error('[auth.service] signInWithPassword succeeded but no user data returned');
    throw new Error('Authentication succeeded but no user data returned');
  }

  console.log('[auth.service] signInWithPassword succeeded, user ID:', authData.user.id);

  // Fetch full user profile from users table
  console.log('[auth.service] Fetching user profile...');
  const profile = await getUserProfile(authData.user.id);
  console.log('[auth.service] User profile fetched successfully');

  return profile;
}

/**
 * Sign out the current user
 *
 * Clears the authentication session and removes tokens from localStorage.
 * @throws {AuthError} If sign out fails
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Get user profile data from the users table
 *
 * Fetches complete user profile including name, role, and location information.
 * RLS policies ensure users can only access their own profile data.
 *
 * @param userId - UUID of the user (from auth.users)
 * @returns Complete user profile with location name
 * @throws {Error} If user not found or query fails
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  console.log('[auth.service] getUserProfile called for user ID:', userId);
  console.log('[auth.service] Stack trace:', new Error().stack);

  try {
    // Query users table with location join with explicit timeout
    console.log('[auth.service] Querying users table...');
    console.log('[auth.service] Supabase client state:', {
      hasClient: !!supabase,
      authHeader: (supabase as any)?.rest?.headers?.Authorization || 'none',
    });

    // Create query with timeout
    const queryPromise = supabase
      .from('users')
      .select(
        `
      *,
      location:locations (
        name
      )
    `
      )
      .eq('id', userId)
      .single();

    console.log('[auth.service] Query created, awaiting response...');

    // Race the query against a timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        console.error('[auth.service] Query timeout after 3 seconds');
        reject(new Error('Database query timeout after 3 seconds'));
      }, 3000);
    });

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    console.log('[auth.service] Query completed:', {
      hasData: !!data,
      hasError: !!error,
      errorCode: error?.code,
      errorMessage: error?.message,
    });

    if (error) {
      console.error('[auth.service] Failed to query users table:', error);
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }

    if (!data) {
      console.error('[auth.service] User profile not found in database');
      throw new Error('User profile not found');
    }

    console.log('[auth.service] User data fetched successfully:', {
      userId: data.id,
      email: data.email,
      role: data.role,
      locationName: data.location?.name,
    });

    // Transform the response to include location_name
    const profile: UserProfile = {
      ...data,
      location_name: data.location?.name,
    };

    return profile;
  } catch (error) {
    console.error('[auth.service] getUserProfile error:', {
      error,
      errorType: error?.constructor?.name,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

/**
 * Map Supabase auth errors to user-friendly messages
 *
 * @param error - AuthError from Supabase
 * @returns User-friendly error message
 */
export function getAuthErrorMessage(error: AuthError | Error): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password',
    'Email not confirmed': 'Please verify your email address',
    'User not found': 'No account found with this email',
    'Too many requests': 'Too many login attempts. Please try again later.',
  };

  return errorMap[error.message] || 'Sign in failed. Please try again.';
}
