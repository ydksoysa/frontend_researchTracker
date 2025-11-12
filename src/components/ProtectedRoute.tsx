// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false, allowedRoles }) => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/projects" replace />;
  }
  // If allowedRoles provided, ensure the user's role is included
  if (allowedRoles && user) {
    const userRole = (user.role || '').toString().toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());
    const match = normalizedAllowed.some(r => userRole.includes(r) || userRole === r || userRole === `ROLE_${r}`);
    if (!match) return <Navigate to="/projects" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;