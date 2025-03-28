import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/users/login" replace />;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return <Outlet />;
}