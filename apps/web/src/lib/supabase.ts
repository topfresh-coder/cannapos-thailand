import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * Supabase Client Configuration
 *
 * This module exports a fully-typed Supabase client instance configured for
 * the cannabis dispensary POS system. The client is initialized with:
 *
 * - Type-safe database operations using generated TypeScript types
 * - Persistent authentication with automatic token refresh
 * - Session detection from URL (for magic links and OAuth flows)
 * - Local storage for session persistence across page reloads
 *
 * Environment Variables Required:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous/public API key
 *
 * @throws {Error} If required environment variables are missing
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables on module load
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file. ' +
    'See .env.example for reference.'
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch {
  throw new Error(
    `Invalid VITE_SUPABASE_URL format: "${supabaseUrl}". ` +
    'Expected a valid URL (e.g., https://your-project.supabase.co)'
  );
}

/**
 * Typed Supabase Client Instance
 *
 * Use this client for all database operations, authentication, storage, and real-time subscriptions.
 * The client is fully typed with the Database schema for compile-time type safety.
 *
 * @example
 * ```typescript
 * // Query with full type inference
 * const { data, error } = await supabase
 *   .from('products')
 *   .select('*')
 *   .eq('franchise_id', franchiseId);
 *
 * // data is typed as Product[]
 * ```
 *
 * @example
 * ```typescript
 * // Authentication with proper error handling
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'secure-password'
 * });
 * ```
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use localStorage for session persistence (works across page reloads)
    storage: window.localStorage,
    // Automatically refresh tokens before expiry
    autoRefreshToken: true,
    // Persist sessions across browser sessions
    persistSession: true,
    // Detect authentication callbacks in URL (for magic links, OAuth)
    detectSessionInUrl: true,
    // Enable debug logging for auth events
    debug: true,
  },
  realtime: {
    params: {
      // Limit real-time events to prevent overwhelming the client
      eventsPerSecond: 10,
    },
  },
});

// Debug helper: log localStorage keys on module load
console.log('[supabase] Supabase client initialized');
console.log('[supabase] URL:', supabaseUrl);
console.log('[supabase] localStorage keys:', Object.keys(window.localStorage).filter(key =>
  key.startsWith('sb-')
));
