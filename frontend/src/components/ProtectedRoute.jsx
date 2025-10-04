import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * usage:
 * <ProtectedRoute role="student"><StudentComponent/></ProtectedRoute>
 * role is optional. If provided, user.role must match.
 */
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    // not authenticated
    return <Navigate to="/auth" replace />;
  }

  if (role && user.role !== role) {
    // role mismatch: redirect to their default dashboard
    if (user.role === "instructor") return <Navigate to="/instructor" replace />;
    return <Navigate to="/student/mylearnings" replace />;
  }

  return children;
};

export default ProtectedRoute;
