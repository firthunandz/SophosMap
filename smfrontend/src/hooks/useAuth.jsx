import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || 'null');

    if (token) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (token, userData) => {
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
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// import { useState, useEffect } from 'react';

// export function useAuth() {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = JSON.parse(localStorage.getItem('user') || null);    

//     const verifyAuth = async () => {
//       if (token) {
//         setUser(userData);
//         setIsAuthenticated(true);
//       }
//       setIsLoading(false);
//     };

//     verifyAuth();
//   }, []);

//   const login = (token, userData) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     setUser(userData);
//     setIsAuthenticated(true);
//     window.dispatchEvent(new Event('storage'));
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//     setIsAuthenticated(false);
//     window.dispatchEvent(new CustomEvent('authChange', {
//       detail: { isAuthenticated: false }
//     }));

//   };
//   return { user, isAuthenticated, isLoading, login, logout };
// }