import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useSpinner } from '../context/SpinnerContext';

export default function ProtectedRoute() {
  const { showSpinner, hideSpinner } = useSpinner();
  const { isAuthenticated, isLoading, authError } = useAuth();

  useEffect(() => {
    if (isLoading) {
      showSpinner();
    } else {
      hideSpinner();
    }
  }, [isLoading]);

  if (!isAuthenticated && !isLoading && !authError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}