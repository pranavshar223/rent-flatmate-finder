import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If authenticated but no role, go to role-selection
  if (!role) {
    return <Navigate to="/role-selection" replace />;
  }

  // If role is not in allowedRoles, redirect to their own dashboard
  if (!allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  return <>{children}</>;
};
