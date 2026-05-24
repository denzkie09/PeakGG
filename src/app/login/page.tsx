"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Shield, Gamepad2 } from "lucide-react";

export default function LoginPage() {
  const { user, loading, loginWithRiot, loginWithSteam } = useAuth();
  const router = useRouter();

  // Already logged in → go to dashboard
  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-base)",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glows */}
      <div style={{ position: "absolute", top: "10%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,70,85,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="fade-up" style={{ width: "100%", maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            className="font-display shimmer-text"
            style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1 }}
          >
            PeakGG
          </div>
          <p style={{ color: "var(--text-tertiary)", fontSize: 13, marginTop: 8 }}>
            Reach your peak, track your grind.
          </p>
        </div>

        {/* Card */}
        <div
          className="card"
          style={{ padding: "32px 28px" }}
        >
          <h1
            className="font-display"
            style={{ fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 6 }}
          >
            Sign in to continue
          </h1>
          <p style={{ color: "var(--text-tertiary)", fontSize: 13, textAlign: "center", marginBottom: 28 }}>
            Connect your gaming account to track your stats
          </p>

          {/* Riot button */}
          <button
            onClick={loginWithRiot}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 20px",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(255,70,85,0.30)",
              background: "rgba(255,70,85,0.07)",
              color: "var(--text-primary)",
              cursor: "pointer",
              marginBottom: 12,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,70,85,0.14)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,70,85,0.55)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,70,85,0.07)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,70,85,0.30)";
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "var(--radius-sm)",
                background: "rgba(255,70,85,0.15)",
                border: "1px solid rgba(255,70,85,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Shield size={18} style={{ color: "var(--accent-val)" }} />
            </div>
            <div style={{ textAlign: "left" }}>
              <div className="font-display" style={{ fontSize: 14, fontWeight: 600 }}>
                Continue with Riot
              </div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>
                Valorant · League of Legends · TFT
              </div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 18, color: "var(--accent-val)", opacity: 0.6 }}>→</div>
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
            <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
          </div>

          {/* Steam button */}
          <button
            onClick={loginWithSteam}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 20px",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(194,194,194,0.20)",
              background: "rgba(194,194,194,0.05)",
              color: "var(--text-primary)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(194,194,194,0.10)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(194,194,194,0.40)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(194,194,194,0.05)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(194,194,194,0.20)";
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "var(--radius-sm)",
                background: "rgba(194,194,194,0.10)",
                border: "1px solid rgba(194,194,194,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Gamepad2 size={18} style={{ color: "#c2c2c2" }} />
            </div>
            <div style={{ textAlign: "left" }}>
              <div className="font-display" style={{ fontSize: 14, fontWeight: 600 }}>
                Continue with Steam
              </div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>
                CS2 · and other Steam games
              </div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 18, color: "#c2c2c2", opacity: 0.5 }}>→</div>
          </button>

          {/* Fine print */}
          <p style={{ fontSize: 11, color: "var(--text-tertiary)", textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
            By signing in you agree to our Terms of Service.
            <br />PeakGG only reads your public match data.
          </p>
        </div>

        {/* Game tags */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
          {[
            { label: "Valorant", color: "var(--accent-val)" },
            { label: "League of Legends", color: "var(--accent-lol)" },
            { label: "CS2", color: "var(--accent-cs)" },
          ].map((g) => (
            <span
              key={g.label}
              style={{
                padding: "4px 12px",
                borderRadius: 99,
                border: `1px solid ${g.color}30`,
                background: `${g.color}08`,
                color: g.color,
                fontSize: 11,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
              }}
            >
              {g.label}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
