import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || 'null');

    if (token && userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleAuthExpired = (e) => {
      setAuthError(e.detail);
    };
  
    window.addEventListener('authExpired', handleAuthExpired);
    return () => window.removeEventListener('authExpired', handleAuthExpired);
  }, [isAuthenticated, user, location.pathname]);

  useEffect(() => {
    setAuthError(null);
  }, [location.pathname]);

  const login = (token, userData) => {
    console.log('[AuthContext] Guardando token:', token.substring(0, 10) + '...');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    console.log('[AuthContext] Logout ejecutado');
  };

  const userMemo = useMemo(() => user, [user?.id]);

  return (
    <AuthContext.Provider value={{ user: userMemo, isAuthenticated, isLoading, login, logout, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};