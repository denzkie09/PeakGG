"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_CS2_STATS } from "@/lib/mock/data";
import { useSettings } from "@/context/SettingsContext";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const CS = "#e06b30";
const CS_STEEL = "rgba(180,180,190,0.06)";

const GAME_LINKS = [
  { label: "Valorant",          href: "/games/valorant", color: "var(--accent-val)", active: false },
  { label: "League of Legends", href: "/games/league",   color: "var(--accent-lol)", active: false },
  { label: "CS2",               href: "/games/cs2",      color: CS,                 active: true  },
  { label: "Dota 2",            href: "/games/dota2",    color: "#e05c30",          active: false },
];

export default function CS2Page() {
  const stats = MOCK_CS2_STATS;
  const { settings } = useSettings();
  const [tab, setTab] = useState<"overview" | "maps" | "matches">("overview");

  const radarData = [
    { stat: "Aim",        value: 75 },
    { stat: "Utility",    value: 55 },
    { stat: "Positioning",value: 68 },
    { stat: "Clutch",     value: 58 },
    { stat: "Spray",      value: 72 },
    { stat: "Awareness",  value: 64 },
  ];

  const mapBarData = stats.mapStats.map(m => ({
    name: m.name,
    WinRate: m.winRate,
    Games: m.played,
  }));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", position: "relative", overflow: "hidden" }}>

      {/* CS2 themed bg — tactical grid pattern */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 300, background: `linear-gradient(180deg, rgba(224,107,48,0.08) 0%, transparent 100%)`, pointerEvents: "none" }} />
      {/* Grid lines */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", opacity: 0.025, backgroundImage: `linear-gradient(${CS} 1px, transparent 1px), linear-gradient(90deg, ${CS} 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      <div style={{ padding: "28px 32px", width: "100%", position: "relative" }}>

        {/* Game switcher */}
        <div className="fade-up" style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {GAME_LINKS.map(g => (
            <Link key={g.href} href={g.href} style={{
              padding: "7px 16px", borderRadius: "var(--radius-md)",
              border: g.active ? `1px solid ${g.color}` : "1px solid var(--border-subtle)",
              background: g.active ? `${g.color}15` : "transparent",
              color: g.active ? g.color : "var(--text-secondary)",
              fontSize: 12, fontFamily: "var(--font-display)", fontWeight: g.active ? 700 : 400,
              textDecoration: "none",
            }}>{g.label}</Link>
          ))}
        </div>

        {/* Header — military style */}
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, color: CS, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "3px", marginBottom: 4 }}>
                [COUNTER-STRIKE 2] // COMPETITIVE
              </div>
              <h1 className="font-display" style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-2px", color: "var(--text-primary)", lineHeight: 1 }}>
                CS2
              </h1>
              <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                PLAYER_ID: jake_dev99 · NA PREMIER
              </div>
            </div>
            {/* ELO panel */}
            {settings.showRankBanner && <div style={{ marginLeft: "auto", background: CS_STEEL, border: `1px solid ${CS}30`, borderRadius: 0, padding: "14px 22px", textAlign: "right", position: "relative", clipPath: "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: CS }} />
              <div style={{ fontSize: 10, color: CS, fontFamily: "var(--font-mono)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "2px" }}>ELO RATING</div>
              <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>{stats.elo}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{stats.rank}</div>
            </div>}
          </div>
        </div>

        {/* Stat strip — tactical HUD style */}
        <div className="fade-up-delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 24 }}>
          {[
            { label: "K/D RATIO",  value: stats.kda.toFixed(2),          color: stats.kda >= 1 ? "var(--accent-green)" : "var(--accent-red)" },
            { label: "WIN RATE",   value: `${stats.winRate}%`,            color: "var(--text-primary)" },
            { label: "HS PERCENT", value: `${stats.headshotPercent}%`,    color: CS },
            { label: "AVG RATING", value: stats.avgRating.toFixed(2),     color: stats.avgRating >= 1 ? "var(--accent-green)" : "var(--accent-red)" },
          ].map((s, i) => (
            <div key={s.label} style={{
              padding: "16px 18px",
              background: CS_STEEL,
              border: `1px solid ${CS}20`,
              borderLeft: i === 0 ? `3px solid ${CS}` : `1px solid ${CS}20`,
              position: "relative",
            }}>
              <div style={{ fontSize: 9, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>{s.label}</div>
              <div className="font-display" style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="fade-up-delay-2" style={{ display: "flex", gap: 2, marginBottom: 20 }}>
          {(["overview", "maps", "matches"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 20px",
              border: `1px solid ${tab === t ? CS : "var(--border-subtle)"}`,
              background: tab === t ? `${CS}15` : CS_STEEL,
              color: tab === t ? CS : "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
              fontWeight: tab === t ? 700 : 400,
              fontSize: 12,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "1px",
              clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)",
            }}>{t}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="fade-up" style={{ display: "grid", gridTemplateColumns: settings.showRadarChart && settings.showMapStats ? "1fr 1.3fr" : "1fr", gap: 16 }}>
            {settings.showRadarChart && <div style={{ background: CS_STEEL, border: `1px solid ${CS}25`, borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
              <h2 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: CS, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 16 }}>Performance Radar</h2>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={`${CS}20`} />
                  <PolarAngleAxis dataKey="stat" tick={{ fill: "rgba(240,240,248,0.45)", fontSize: 11, fontFamily: "var(--font-mono)" }} />
                  <Radar dataKey="value" stroke={CS} fill={CS} fillOpacity={0.18} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>}
            {settings.showMapStats && <div style={{ background: CS_STEEL, border: `1px solid ${CS}25`, borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
              <h2 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: CS, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 16 }}>Win Rate by Map</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={mapBarData} barSize={18}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "rgba(240,240,248,0.35)", fontSize: 10, fontFamily: "var(--font-mono)" }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "rgba(240,240,248,0.35)", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: `1px solid ${CS}40`, borderRadius: 6, fontSize: 12, fontFamily: "var(--font-mono)" }} />
                  <Bar dataKey="WinRate" fill={CS} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>}
          </div>
        )}

        {/* MAPS */}
        {tab === "maps" && settings.showMapStats && (
          <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {stats.mapStats.map(m => (
              <div key={m.name} style={{ background: CS_STEEL, border: `1px solid ${m.winRate >= 50 ? CS : "var(--border-subtle)"}40`, borderRadius: "var(--radius-lg)", padding: "18px 20px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.winRate >= 50 ? CS : "var(--accent-red)", opacity: 0.6 }} />
                <div className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", marginBottom: 12 }}>{m.played} matches played</div>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "var(--font-mono)", color: m.winRate >= 50 ? "var(--accent-green)" : "var(--accent-red)" }}>{m.winRate}%</div>
                <div style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "1px" }}>Win Rate</div>
                <div style={{ marginTop: 12, height: 3, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${m.winRate}%`, background: m.winRate >= 50 ? CS : "var(--accent-red)", borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MATCHES */}
        {tab === "matches" && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {stats.recentMatches.slice(0, settings.matchCount).map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "3px 1.2fr 1fr 1fr 1fr 80px", alignItems: "center", gap: 14, padding: "14px 20px", background: i % 2 === 0 ? CS_STEEL : "transparent", border: `1px solid ${CS}15` }}>
                <div style={{ width: 3, height: 36, background: m.result === "win" ? "var(--accent-green)" : "var(--accent-red)" }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-display)" }}>{m.map}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>{m.durationMinutes}m · {m.playedAt}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                  <span style={{ color: "var(--accent-green)" }}>{m.kills}</span>
                  <span style={{ color: "var(--text-tertiary)" }}>/</span>
                  <span style={{ color: "var(--accent-red)" }}>{m.deaths}</span>
                  <span style={{ color: "var(--text-tertiary)" }}>/</span>
                  {m.assists}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: CS }}>{m.hsPercent}% HS</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: m.rating >= 1 ? "var(--accent-green)" : "var(--accent-red)" }}>{m.rating.toFixed(2)} RTG</div>
                <div style={{ padding: "4px 10px", border: `1px solid ${m.result === "win" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`, color: m.result === "win" ? "var(--accent-green)" : "var(--accent-red)", fontSize: 10, fontWeight: 700, fontFamily: "var(--font-mono)", textAlign: "center", textTransform: "uppercase", clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)" }}>
                  {m.result}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
