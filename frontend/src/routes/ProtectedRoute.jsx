import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wrap any route that requires login, optionally restricted to specific roles.
// Usage: <ProtectedRoute roles={["employer"]}><EmployerDashboard /></ProtectedRoute>
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="py-24 text-center text-brand-grey">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
