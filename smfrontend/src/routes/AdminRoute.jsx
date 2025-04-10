import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSpinner } from '../context/SpinnerContext';

export default function AdminRoute() {
  const { showSpinner, hideSpinner } = useSpinner();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      showSpinner();
    } else {
      hideSpinner();
    }
  }, [isLoading]);

  if (!isLoading && (!isAuthenticated || !user || user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}