"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  Trophy,
  Settings,
  LogOut,
  Sword,
  Gamepad2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/dashboard",      label: "Dashboard",   icon: LayoutDashboard },
  { href: "/compare",        label: "Compare",     icon: ArrowLeftRight  },
  { href: "/players",        label: "Players",     icon: Users           },
  { href: "/pro",            label: "Pro Players", icon: Trophy          },
];

const GAME_NAV = [
  { href: "/games/valorant", label: "Valorant",    color: "var(--accent-val)" },
  { href: "/games/league",   label: "League",      color: "var(--accent-lol)" },
  { href: "/games/cs2",      label: "CS2",         color: "var(--accent-cs)"  },
  { href: "/games/dota2",    label: "Dota 2",      color: "#e05c30"            },
];

export default function Sidebar() {
  return (
    <Suspense fallback={<div style={{ width: 220, minHeight: "100vh", background: "var(--bg-surface)", borderRight: "1px solid var(--border-subtle)", flexShrink: 0 }} />}>
      <SidebarInner />
    </Suspense>
  );
}

function SidebarInner() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const providerColor = user?.provider === "riot" ? "var(--accent-val)" : "#c2c2c2";
  const ProviderIcon  = user?.provider === "riot" ? Sword : Gamepad2;
  const providerLabel = user?.provider === "riot" ? "Riot Account" : "Steam Account";

  return (
    <aside
      style={{
        width: 220,
        minHeight: "100vh",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        gap: 8,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 32, paddingLeft: 8 }}>
        <div className="font-display shimmer-text" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>
          PeakGG
        </div>
        <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>
          Reach your peak, track your grind.
        </div>
      </div>

      {/* Logged-in account badge */}
      {user && (
        <div
          style={{
            background: "var(--bg-elevated)",
            border: `1px solid ${providerColor}25`,
            borderRadius: "var(--radius-md)",
            padding: "10px 12px",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Signed in via
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "var(--radius-sm)",
                background: `${providerColor}15`,
                border: `1px solid ${providerColor}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ProviderIcon size={14} style={{ color: providerColor }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.username}{user.tagline ? <span style={{ color: "var(--text-tertiary)" }}>#{user.tagline}</span> : ""}
              </div>
              <div style={{ fontSize: 10, color: providerColor }}>{providerLabel}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: "var(--radius-md)",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--bg-elevated)" : "transparent",
                border: active ? "1px solid var(--border-default)" : "1px solid transparent",
                textDecoration: "none",
                fontWeight: active ? 500 : 400,
                fontSize: 14,
                transition: "all 0.15s",
              }}
            >
              <Icon size={16} style={{ opacity: active ? 1 : 0.6 }} />
              {label}
              {active && (
                <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: "var(--accent-purple)" }} />
              )}
            </Link>
          );
        })}

        {/* Games section */}
        <div style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px", padding: "12px 12px 6px", fontFamily: "var(--font-mono)" }}>
          Games
        </div>
        {GAME_NAV.map(({ href, label, color }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                color: active ? color : "var(--text-secondary)",
                background: active ? `${color}10` : "transparent",
                border: active ? `1px solid ${color}30` : "1px solid transparent",
                textDecoration: "none",
                fontWeight: active ? 500 : 400,
                fontSize: 13,
                transition: "all 0.15s",
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0, opacity: active ? 1 : 0.5 }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: settings + user row */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, borderTop: "1px solid var(--border-subtle)", paddingTop: 16 }}>
        <Link
          href="/settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: "var(--radius-md)",
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontSize: 14,
            transition: "color 0.15s",
          }}
        >
          <Settings size={16} style={{ opacity: 0.6 }} />
          Settings
        </Link>

        {/* User row with logout */}
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              marginTop: 4,
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 600,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.username}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{user.rank ?? "Unranked"}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0 }}
            >
              <LogOut size={14} style={{ color: "var(--text-tertiary)" }} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
