"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarPlus, Library, LogOut, Menu, Upload, UserRound } from "lucide-react";

import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/lib/contexts/AuthContext";

export function Navbar1() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold">
              <CalendarPlus className="size-5 text-tint" />
              UniWeek
            </Link>

            <nav className="hidden items-center gap-4 text-sm md:flex">
              <Link href="/upload" className="text-muted-foreground transition hover:text-foreground">
                Upload
              </Link>
              <Link href="/library" className="text-muted-foreground transition hover:text-foreground">
                Library
              </Link>
              <Link href="/privacy-policy" className="text-muted-foreground transition hover:text-foreground">
                Privacy
              </Link>
            </nav>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
                  <UserRound className="size-3.5" />
                  {user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="size-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowLogin(true)}>
                  Login
                </Button>
                <Button size="sm" onClick={() => setShowRegister(true)}>
                  Register
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="icon" />}>
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>UniWeek</SheetTitle>
                </SheetHeader>
                <div className="space-y-2 p-4">
                  <Link href="/upload" className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-muted">
                    <Upload className="size-4" />
                    Upload
                  </Link>
                  <Link href="/library" className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-muted">
                    <Library className="size-4" />
                    Library
                  </Link>
                  <Link href="/privacy-policy" className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-muted">
                    Privacy Policy
                  </Link>

                  <div className="pt-2">
                    {isAuthenticated ? (
                      <Button variant="outline" className="w-full" onClick={logout}>
                        <LogOut className="size-4" />
                        Logout
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full" onClick={() => setShowLogin(true)}>
                          Login
                        </Button>
                        <Button className="w-full" onClick={() => setShowRegister(true)}>
                          Register
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {showLogin ? (
        <LoginForm
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      ) : null}

      {showRegister ? (
        <RegisterForm
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      ) : null}
    </>
  );
}
