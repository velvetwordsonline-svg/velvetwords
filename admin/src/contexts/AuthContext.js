'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      const userData = localStorage.getItem('adminUser');
      if (token && userData && userData !== 'undefined') {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          localStorage.removeItem('adminUser');
          localStorage.removeItem('adminToken');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const { data } = await adminAPI.login(credentials);
    const userData = data.admin || data.user;
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setUser(userData);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 100);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
