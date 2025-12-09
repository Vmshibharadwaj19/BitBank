import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Transactions from './components/Transactions';
import Statements from './components/Statements';
import Profile from './components/Profile';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageCustomers from './components/admin/ManageCustomers';
import './App.css';
import './styles/enterprise-design-system.css';

// Component to handle redirects based on authentication
const AppRoutes = () => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();

  // Debug logging
  React.useEffect(() => {
    if (user) {
      console.log('AppRoutes - User:', user);
      console.log('AppRoutes - User role:', user.role);
      console.log('AppRoutes - isAdmin:', isAdmin);
    }
  }, [user, isAdmin]);

  // Show loading while checking auth
  if (loading) {
    return null; // ProtectedRoute will handle loading spinner
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />
      
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace /> : <Login />}
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {isAdmin ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Layout>
                <Dashboard />
              </Layout>
            )}
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/accounts"
        element={
          <ProtectedRoute>
            {isAdmin ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Layout>
                <Accounts />
              </Layout>
            )}
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            {isAdmin ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Layout>
                <Transactions />
              </Layout>
            )}
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/statements"
        element={
          <ProtectedRoute>
            {isAdmin ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Layout>
                <Statements />
              </Layout>
            )}
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            {!isAdmin ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Layout>
                <AdminDashboard />
              </Layout>
            )}
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/customers"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <Layout>
              <ManageCustomers />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
