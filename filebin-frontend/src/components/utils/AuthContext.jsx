import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }
    return false;
  });

  const login = (token) => {
    const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days expiration time
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('sessionExpiration', expirationTime);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('sessionExpiration');
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const expiration = localStorage.getItem('sessionExpiration');
      const currentTime = new Date().getTime();

      if (expiration && currentTime > expiration) {
        logout();
      } else {
        setIsAuthenticated(!!localStorage.getItem('token'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const expiration = localStorage.getItem('sessionExpiration');
    const currentTime = new Date().getTime();

    if (expiration && currentTime > expiration) {
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
