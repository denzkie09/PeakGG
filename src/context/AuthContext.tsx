"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { AuthUser } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  loginWithRiot: () => void;
  loginWithSteam: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadSession() {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = await res.json();
        if (alive) setUser(data.user ?? null);
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadSession();

    return () => {
      alive = false;
    };
  }, []);

  const loginWithRiot = () => {
    window.location.href = "/api/auth/riot";
  };

  const loginWithSteam = () => {
    window.location.href = "/api/auth/steam";
  };

  const logout = () => {
    void fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithRiot, loginWithSteam, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
