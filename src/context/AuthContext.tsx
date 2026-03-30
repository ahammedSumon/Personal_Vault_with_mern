import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import { UserModel } from '../models';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ isAuthenticated: false });
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const isAuth = UserModel.isAuthenticated();
    setUser({ isAuthenticated: isAuth });
    setIsLoading(false);
  }, []);

  const register = (password: string): boolean => {
    try {
      if (UserModel.isRegistered()) {
        console.error('Account already registered');
        return false;
      }

      if (password.length < 4) {
        console.error('Password must be at least 4 characters');
        return false;
      }

      UserModel.setPassword(password);
      UserModel.setAuthToken();
      setUser({ isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = (password: string): boolean => {
    try {
      if (!UserModel.isRegistered()) {
        console.error('Account not registered yet');
        return false;
      }

      if (!UserModel.verifyPassword(password)) {
        console.error('Invalid password');
        return false;
      }

      UserModel.setAuthToken();
      setUser({ isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = (): void => {
    try {
      UserModel.logout();
      setUser({ isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
