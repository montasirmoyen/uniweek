'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, subscribeToAuthState } from '@/lib/firebase/auth';
import { getUserProfile } from '@/lib/firebase/db';
import type { User as FirebaseUser } from 'firebase/auth';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Subscribe to Firebase auth state changes on mount
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is logged in, get their profile
        const profile = await getUserProfile(firebaseUser.uid);
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: profile?.firstName || firebaseUser.email?.split('@')[0] || 'User',
        });
      } else {
        // User is logged out
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const firebaseUser = await loginUser(email, password);
    const profile = await getUserProfile(firebaseUser.uid);
    setUser({
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: profile?.firstName || email.split('@')[0],
    });
  };

  const register = async (email: string, password: string, name: string) => {
    const firebaseUser = await registerUser(email, password, name);
    setUser({
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name,
    });
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isGuest: !user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
