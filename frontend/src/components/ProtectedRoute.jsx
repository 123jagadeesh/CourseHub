import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    
    return <Navigate to="/auth" replace />;
  }

  if (role && user.role !== role) {
    
    if (user.role === "instructor") return <Navigate to="/instructor" replace />;
    return <Navigate to="/student/mylearnings" replace />;
  }

  return children;
};

export default ProtectedRoute;
