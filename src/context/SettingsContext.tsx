"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "dark" | "light" | "system";
export type AccentColor = "purple" | "val" | "lol" | "cs2" | "dota2";
export type DefaultGame = "valorant" | "league" | "cs2" | "dota2";
export type MatchCount = 5 | 10 | 20;
export type Region = "NA" | "EU" | "AP" | "KR" | "BR" | "LATAM" | "OCE";

export interface Settings {
  theme: Theme;
  accentColor: AccentColor;
  compactMode: boolean;
  displayName: string;
  region: Region;
  avatarColor: string;
  defaultGame: DefaultGame;
  matchCount: MatchCount;
  showRankBanner: boolean;
  showRadarChart: boolean;
  showMapStats: boolean;
}

const DEFAULTS: Settings = {
  theme:          "dark",
  accentColor:    "purple",
  compactMode:    false,
  displayName:    "jake_dev99",
  region:         "NA",
  avatarColor:    "#a78bfa",
  defaultGame:    "valorant",
  matchCount:     10,
  showRankBanner: true,
  showRadarChart: true,
  showMapStats:   true,
};

interface SettingsContextValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  reset: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("peakgg_settings");
      if (stored) setSettings({ ...DEFAULTS, ...JSON.parse(stored) });
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root   = document.documentElement;
    const isDark =
      settings.theme === "dark" ||
      (settings.theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      root.style.setProperty("--bg-base",       "#0a0a0f");
      root.style.setProperty("--bg-surface",    "#111118");
      root.style.setProperty("--bg-elevated",   "#18181f");
      root.style.setProperty("--bg-card",       "#1c1c26");
      root.style.setProperty("--bg-hover",      "#222230");
      root.style.setProperty("--text-primary",  "#f0f0f8");
      root.style.setProperty("--text-secondary","rgba(240,240,248,0.55)");
      root.style.setProperty("--text-tertiary", "rgba(240,240,248,0.30)");
      root.style.setProperty("--border-subtle", "rgba(255,255,255,0.06)");
      root.style.setProperty("--border-default","rgba(255,255,255,0.10)");
    } else {
      root.style.setProperty("--bg-base",       "#f4f4f8");
      root.style.setProperty("--bg-surface",    "#ffffff");
      root.style.setProperty("--bg-elevated",   "#ebebf2");
      root.style.setProperty("--bg-card",       "#ffffff");
      root.style.setProperty("--bg-hover",      "#e4e4ef");
      root.style.setProperty("--text-primary",  "#0e0e18");
      root.style.setProperty("--text-secondary","rgba(14,14,24,0.60)");
      root.style.setProperty("--text-tertiary", "rgba(14,14,24,0.35)");
      root.style.setProperty("--border-subtle", "rgba(0,0,0,0.07)");
      root.style.setProperty("--border-default","rgba(0,0,0,0.12)");
    }
  }, [settings.theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const ACCENTS: Record<AccentColor, string> = {
      purple: "#a78bfa",
      val:    "#ff4655",
      lol:    "#c89b3c",
      cs2:    "#e06b30",
      dota2:  "#e05c30",
    };
    document.documentElement.style.setProperty("--accent-purple", ACCENTS[settings.accentColor]);
  }, [settings.accentColor, mounted]);

  const update = (patch: Partial<Settings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem("peakgg_settings", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const reset = () => {
    setSettings(DEFAULTS);
    try { localStorage.removeItem("peakgg_settings"); } catch {}
  };

  if (!mounted) return <>{children}</>;

  return (
    <SettingsContext.Provider value={{ settings, update, reset }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
}
