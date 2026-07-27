import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";

// Route-level code splitting with React.lazy
const Home = lazy(() => import(/* webpackChunkName: "home" */ "../pages/Home"));
const Login = lazy(() => import(/* webpackChunkName: "login" */ "../pages/Login"));
const Signup = lazy(() => import(/* webpackChunkName: "signup" */ "../pages/Signup"));
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ "../pages/Dashboard"));
const Monitoring = lazy(() => import(/* webpackChunkName: "monitoring" */ "../pages/Monitoring"));
const Analytics = lazy(() => import(/* webpackChunkName: "analytics" */ "../pages/Analytics"));
const Reports = lazy(() => import(/* webpackChunkName: "reports" */ "../pages/Reports"));
const Meters = lazy(() => import(/* webpackChunkName: "meters" */ "../pages/Meters"));
const MeterDetail = lazy(() => import(/* webpackChunkName: "meter-detail" */ "../pages/MeterDetail"));
const Alerts = lazy(() => import(/* webpackChunkName: "alerts" */ "../pages/Alerts"));
const Settings = lazy(() => import(/* webpackChunkName: "settings" */ "../pages/Settings"));
const Profile = lazy(() => import(/* webpackChunkName: "profile" */ "../pages/Profile"));
const NotFound = lazy(() => import(/* webpackChunkName: "not-found" */ "../pages/NotFound"));
const InternalServerError = lazy(() => import(/* webpackChunkName: "error-pages" */ "../pages/InternalServerError"));
const OfflinePage = lazy(() => import(/* webpackChunkName: "error-pages" */ "../pages/OfflinePage"));

// Suspense fallback loader
function RouteLoader() {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Error Pages */}
        <Route path="/500" element={<InternalServerError />} />
        <Route path="/offline" element={<OfflinePage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitoring"
          element={
            <ProtectedRoute>
              <Monitoring />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meters"
          element={
            <ProtectedRoute>
              <Meters />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meters/:meterId"
          element={
            <ProtectedRoute>
              <MeterDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredRole="admin">
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}
