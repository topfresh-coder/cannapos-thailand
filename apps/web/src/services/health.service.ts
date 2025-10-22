/**
 * Health Check Service
 *
 * This service provides health check operations for verifying database connectivity
 * and overall system health. Use these functions during application startup or
 * for monitoring/diagnostics.
 *
 * @module services/health
 */

import { supabase } from '@/lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

/**
 * Health check response structure
 */
export interface HealthCheckResponse {
  /** Whether the health check passed */
  success: boolean;
  /** Human-readable message describing the result */
  message: string;
  /** Error details if the check failed */
  error?: {
    code: string;
    message: string;
    details?: string;
    hint?: string;
  };
  /** Additional metadata about the health check */
  metadata?: {
    timestamp: string;
    latency?: number;
  };
}

/**
 * Tests the database connection by querying the locations table
 *
 * This function performs a lightweight query to verify that:
 * 1. The Supabase client is properly configured
 * 2. Network connectivity to Supabase is working
 * 3. Database credentials are valid
 * 4. The locations table exists and is accessible
 *
 * @returns {Promise<HealthCheckResponse>} Health check result with success status and message
 *
 * @example
 * ```typescript
 * // Test connection on app startup
 * const health = await testDatabaseConnection();
 *
 * if (!health.success) {
 *   console.error('Database connection failed:', health.message);
 *   // Show error UI to user
 * } else {
 *   console.log('Database connected successfully');
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Use in a health check endpoint
 * app.get('/api/health', async (req, res) => {
 *   const health = await testDatabaseConnection();
 *   res.status(health.success ? 200 : 503).json(health);
 * });
 * ```
 */
export async function testDatabaseConnection(): Promise<HealthCheckResponse> {
  const startTime = performance.now();

  try {
    // Perform a simple query to test database connectivity
    // We use .limit(1) to minimize data transfer and only check connectivity
    // We use .select('id') to only fetch the minimal required column
    const { error } = await supabase
      .from('locations')
      .select('id')
      .limit(1);

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    // Check for query errors
    if (error) {
      return handleDatabaseError(error, latency);
    }

    // Connection successful
    return {
      success: true,
      message: 'Database connection successful',
      metadata: {
        timestamp: new Date().toISOString(),
        latency,
      },
    };
  } catch (error) {
    // Handle unexpected errors (network failures, etc.)
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    return handleUnexpectedError(error, latency);
  }
}

/**
 * Handles PostgreSQL errors from Supabase queries
 *
 * Maps PostgreSQL error codes to user-friendly messages and provides
 * detailed error information for debugging.
 *
 * @param {PostgrestError} error - The PostgreSQL error from Supabase
 * @param {number} latency - Time taken for the query attempt
 * @returns {HealthCheckResponse} Formatted error response
 * @private
 */
function handleDatabaseError(
  error: PostgrestError,
  latency: number
): HealthCheckResponse {
  // Map common PostgreSQL error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    '42P01': 'Database table not found. Please run migrations first.',
    '42883': 'Database function not found. Please run migrations first.',
    '42501': 'Insufficient database permissions. Check RLS policies.',
    '28P01': 'Invalid database credentials. Check environment variables.',
    '53300': 'Database connection limit reached. Please try again.',
    '08006': 'Database connection failed. Check network connectivity.',
  };

  const friendlyMessage =
    errorMessages[error.code] ||
    'Database query failed. Check configuration and network.';

  return {
    success: false,
    message: friendlyMessage,
    error: {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message,
      details: error.details,
      hint: error.hint,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      latency,
    },
  };
}

/**
 * Handles unexpected errors (network failures, timeout, etc.)
 *
 * @param {unknown} error - The unexpected error
 * @param {number} latency - Time taken before the error occurred
 * @returns {HealthCheckResponse} Formatted error response
 * @private
 */
function handleUnexpectedError(
  error: unknown,
  latency: number
): HealthCheckResponse {
  // Extract error message safely
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : 'An unexpected error occurred';

  // Determine if this is likely a network issue
  const isNetworkError =
    errorMessage.includes('fetch') ||
    errorMessage.includes('network') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('ECONNREFUSED');

  const message = isNetworkError
    ? 'Network error: Unable to reach Supabase. Check your internet connection and Supabase URL.'
    : 'Unexpected error during database connection test. Check console for details.';

  // Log error details for debugging
  console.error('[Health Service] Database connection test failed:', {
    error,
    errorMessage,
    timestamp: new Date().toISOString(),
    latency,
  });

  return {
    success: false,
    message,
    error: {
      code: isNetworkError ? 'NETWORK_ERROR' : 'UNEXPECTED_ERROR',
      message: errorMessage,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      latency,
    },
  };
}

/**
 * Comprehensive health check that tests multiple system components
 *
 * This function can be extended to check multiple system components beyond
 * just the database (e.g., authentication service, storage, etc.)
 *
 * @returns {Promise<HealthCheckResponse>} Comprehensive health check result
 *
 * @example
 * ```typescript
 * // Perform comprehensive health check
 * const health = await performHealthCheck();
 *
 * if (!health.success) {
 *   // Display detailed error information
 *   console.error('System health check failed:', health);
 * }
 * ```
 */
export async function performHealthCheck(): Promise<HealthCheckResponse> {
  // For now, we only check database connectivity
  // This can be extended to check:
  // - Authentication service (supabase.auth.getSession())
  // - Storage service (supabase.storage.listBuckets())
  // - Custom API endpoints
  // - External service dependencies

  const dbHealth = await testDatabaseConnection();

  if (!dbHealth.success) {
    return {
      ...dbHealth,
      message: `System health check failed: ${dbHealth.message}`,
    };
  }

  return {
    success: true,
    message: 'All system components are healthy',
    metadata: {
      timestamp: new Date().toISOString(),
      latency: dbHealth.metadata?.latency,
    },
  };
}

/**
 * Tests if the Supabase client can authenticate (optional)
 *
 * This is a lightweight check to verify that the auth service is reachable.
 * It does not require valid credentials, just checks if the service responds.
 *
 * @returns {Promise<HealthCheckResponse>} Auth service health check result
 *
 * @example
 * ```typescript
 * // Test auth service connectivity
 * const authHealth = await testAuthService();
 * console.log('Auth service status:', authHealth.message);
 * ```
 */
export async function testAuthService(): Promise<HealthCheckResponse> {
  const startTime = performance.now();

  try {
    // Try to get the current session (returns null if not logged in, which is fine)
    const { error } = await supabase.auth.getSession();

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    if (error) {
      return {
        success: false,
        message: 'Auth service check failed',
        error: {
          code: error.name || 'AUTH_ERROR',
          message: error.message,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          latency,
        },
      };
    }

    return {
      success: true,
      message: 'Auth service is healthy',
      metadata: {
        timestamp: new Date().toISOString(),
        latency,
      },
    };
  } catch (error) {
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    return handleUnexpectedError(error, latency);
  }
}
