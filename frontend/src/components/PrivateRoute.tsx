import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/roles';

type PrivateRouteProps = {
  children: ReactNode;
  requiredRole?: UserRole;
};

export default function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    // Si no tiene el rol requerido, redirigir al home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

