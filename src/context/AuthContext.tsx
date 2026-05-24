"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AuthProvider = "riot" | "steam";

export interface AuthUser {
  id: string;
  username: string;
  provider: AuthProvider;
  tagline?: string;       // Riot only: #TAG
  avatarUrl?: string;
  rank?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  loginWithRiot: () => void;
  loginWithSteam: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Mock user for development (remove when real OAuth is wired up) ───────────
const MOCK_RIOT_USER: AuthUser = {
  id: "mock-riot-001",
  username: "jake_dev99",
  tagline: "PH1",
  provider: "riot",
  rank: "Gold II",
};

const MOCK_STEAM_USER: AuthUser = {
  id: "mock-steam-001",
  username: "jake_steam",
  provider: "steam",
  rank: "Gold Nova III",
};
// ─────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Persist login across page refreshes via sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("peakgg_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: AuthUser | null) => {
    if (u) sessionStorage.setItem("peakgg_user", JSON.stringify(u));
    else   sessionStorage.removeItem("peakgg_user");
    setUser(u);
  };

  const loginWithRiot = () => {
    // REAL: window.location.href = "/api/auth/riot"
    // MOCK: simulate immediate login
    persist(MOCK_RIOT_USER);
  };

  const loginWithSteam = () => {
    // REAL: window.location.href = "/api/auth/steam"
    // MOCK: simulate immediate login
    persist(MOCK_STEAM_USER);
  };

  const logout = () => persist(null);

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
