import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('travel_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('travel_token');
      if (savedToken) {
        try {
          const res = await authApi.getMe();
          setUser(res.data);
        } catch (err) {
          console.error("Token verification failed, clearing auth", err);
          logout();
        }
      } else {
        // Auto-initialize demo user for seamless zero-friction testing
        setUser({
          id: '00000000-0000-0000-0000-000000000001',
          email: 'demo@travelplanner.com',
          full_name: 'Alex Mercer (Demo Explorer)'
        });
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('travel_token', access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const register = async (email, password, full_name) => {
    const res = await authApi.register({ email, password, full_name });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('travel_token', access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const loginAsDemo = async () => {
    try {
      return await login('demo@travelplanner.com', 'Demo@1234');
    } catch {
      // Fallback
      setUser({
        id: '00000000-0000-0000-0000-000000000001',
        email: 'demo@travelplanner.com',
        full_name: 'Alex Mercer (Demo Explorer)'
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('travel_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
