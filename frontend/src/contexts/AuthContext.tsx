import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

type Role = 'owner' | 'tenant' | 'admin' | null;

interface AuthContextType {
  user: User | null;
  role: Role;
  token: string | null;
  isLoading: boolean;
  logout: () => void;
  setAuthData: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem('jwt_token');
        const storedUserStr = localStorage.getItem('user');

        if (storedToken && storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          setToken(storedToken);
          setUser(storedUser);
          setRole(storedUser.role.toLowerCase() as Role);
        }
      } catch (error) {
        console.error('Failed to parse auth data from local storage', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const setAuthData = (newUser: User, newToken: string) => {
    localStorage.setItem('jwt_token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setRole(newUser.role.toLowerCase() as Role);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      setUser(null);
      setRole(null);
      setToken(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, token, isLoading, logout, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
