import { createContext, useContext, useState, useEffect } from 'react';
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

    if (token) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
    console.log('[AuthContext] Estado inicial - isAuthenticated:', isAuthenticated, 'user:', userData);
  }, []);

  useEffect(() => {
    console.log('[AuthContext] Cambio de estado - isAuthenticated:', isAuthenticated, 'user:', user, 'location:', location.pathname);
    const handleAuthExpired = (e) => {
      setAuthError(e.detail);
      console.log('[AuthContext] Evento authExpired:', e.detail);
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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};