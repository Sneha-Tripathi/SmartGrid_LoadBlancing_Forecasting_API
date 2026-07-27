import { Navigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import PageLoader from "../common/PageLoader";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access check
  if (requiredRole) {
    const userRole = user?.role || "user";
    const roleHierarchy = { admin: 3, operator: 2, user: 1 };
    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    if (userLevel < requiredLevel) {
      return (
        <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
            <p className="text-xl text-slate-300 mb-2">Access Denied</p>
            <p className="text-slate-400 mb-6">
              You do not have the required role to access this page.
            </p>
            <Navigate to="/dashboard" replace />
          </div>
        </div>
      );
    }
  }

  return children;
}
