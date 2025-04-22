import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useSpinner } from '../context/SpinnerContext';

export default function AdminRoute() {
  const { showSpinner, hideSpinner } = useSpinner();
  const { user, isAuthenticated, isLoading, authError } = useAuth();

  useEffect(() => {
    if (isLoading) {
      showSpinner();
    } else {
      hideSpinner();
    }
  }, [isLoading]);

  if (!isLoading && !authError && (!isAuthenticated || !user || user.role !== 'admin')) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}