import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Protected Route Component
 *
 * Route guard that ensures only authenticated users can access protected pages.
 * Unauthenticated users are redirected to the login page.
 *
 * Usage with React Router v6:
 * ```tsx
 * <Route element={<ProtectedRoute />}>
 *   <Route path="pos" element={<POSPage />} />
 *   <Route path="products" element={<ProductsPage />} />
 * </Route>
 * ```
 *
 * @param allowedRoles - Optional array of roles that can access this route (future enhancement)
 */
interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps = {}) {
  const { user, loading } = useAuth();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
            aria-label="Loading"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Optional: Check role-based access control (future enhancement)
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // User doesn't have required role, redirect to unauthorized page
      // For now, redirect to POS (or create an unauthorized page later)
      return <Navigate to="/pos" replace />;
    }
  }

  // User is authenticated (and has required role), render child routes
  return <Outlet />;
}
