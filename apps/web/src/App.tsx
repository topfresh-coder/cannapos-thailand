import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from '@/pages/LoginPage';
import POSPage from '@/pages/POSPage';
import ReceiptPage from '@/pages/ReceiptPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { InventoryPage } from '@/pages/InventoryPage';
import { ShiftsPage } from '@/pages/ShiftsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import './App.css';

/**
 * Main Application Component
 *
 * Sets up routing, authentication, and global UI components.
 * Structure:
 * - AuthProvider: Provides authentication state to entire app
 * - BrowserRouter: Enables client-side routing
 * - Routes: Defines public and protected routes
 * - Toaster: Global toast notification system
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route - Login page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes - Require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/pos" element={<POSPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/shifts" element={<ShiftsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/receipt/:transactionId" element={<ReceiptPage />} />
            </Route>
          </Route>

          {/* Root redirect - Go to POS (will redirect to login if not authenticated) */}
          <Route path="/" element={<Navigate to="/pos" replace />} />

          {/* Catch-all - Redirect unknown routes to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global toast notification container */}
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
