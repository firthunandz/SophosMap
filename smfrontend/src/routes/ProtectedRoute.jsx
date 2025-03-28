import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSpinner } from '../context/SpinnerContext';

export default function ProtectedRoute() {
  const { showSpinner, hideSpinner } = useSpinner();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      showSpinner();
    } else {
      hideSpinner();
    }
  }, [isLoading]);

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/users/login" replace />;
  }

  return <Outlet />;
}