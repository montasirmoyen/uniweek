'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import { CalendarPlus } from 'lucide-react'

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <nav className="bg-card sticky top-0 z-30 shadow-lg shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold text-card-foreground flex items-center gap-2">
                <CalendarPlus className="text-primary relative top-[-1px]" size={24} />
                <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>UniWeek</span>
              </Link>
              <div className="hidden md:flex gap-6">
                <Link
                  href="/upload"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Upload
                </Link>
                {isAuthenticated && (
                  <Link
                    href="/library"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Library
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {user?.name}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="px-4 py-2 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showLogin && (
        <LoginForm
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <RegisterForm
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}
