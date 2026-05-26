import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import PageLoader from './components/ui/PageLoader';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MyDocuments = lazy(() => import('./pages/MyDocuments'));
const FamilyDocuments = lazy(() => import('./pages/FamilyDocuments'));
const FamilyMemberPage = lazy(() => import('./pages/FamilyMemberPage'));
const DocumentViewerPage = lazy(() => import('./pages/DocumentViewerPage'));
const Settings = lazy(() => import('./pages/Settings'));
const ActivityLogPage = lazy(() => import('./pages/ActivityLogPage'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  const { loading } = useAuth();

  if (loading) return <PageLoader />;

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><AuthLayout><LoginPage /></AuthLayout></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><AuthLayout><SignupPage /></AuthLayout></PublicRoute>} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="documents" element={<MyDocuments />} />
            <Route path="documents/:id" element={<DocumentViewerPage />} />
            <Route path="family" element={<FamilyDocuments />} />
            <Route path="family/:memberId" element={<FamilyMemberPage />} />
            <Route path="family/:memberId/documents/:id" element={<DocumentViewerPage />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="activity" element={<ActivityLogPage />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
