// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole") || "guest";

  const hasAccess = allowedRoles.includes(userRole);

  return hasAccess ? element : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
