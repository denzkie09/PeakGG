"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_LEAGUE_STATS } from "@/lib/mock/data";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

const LOL = "#c89b3c";
const LOL_BLUE = "#0a1428";
const LOL_DIM = "rgba(200,155,60,0.10)";

const GAME_LINKS = [
  { label: "Valorant",          href: "/games/valorant", color: "var(--accent-val)", active: false },
  { label: "League of Legends", href: "/games/league",   color: LOL,                active: true  },
  { label: "CS2",               href: "/games/cs2",      color: "var(--accent-cs)", active: false },
  { label: "Dota 2",            href: "/games/dota2",    color: "#e05c30",          active: false },
];

export default function LeaguePage() {
  const stats = MOCK_LEAGUE_STATS;
  const [tab, setTab] = useState<"overview" | "champions" | "matches">("overview");

  const radarData = [
    { stat: "CS",         value: 62 },
    { stat: "Vision",     value: 70 },
    { stat: "Teamfight",  value: 65 },
    { stat: "Objectives", value: 58 },
    { stat: "Roaming",    value: 55 },
    { stat: "Laning",     value: 72 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", position: "relative", overflow: "hidden" }}>

      {/* LoL themed background — dark blue top gradient with gold accents */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 360, background: `linear-gradient(180deg, ${LOL_BLUE}cc 0%, transparent 100%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${LOL}, transparent)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)", width: 500, height: 200, background: `radial-gradient(ellipse, ${LOL}0a 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ padding: "28px 32px", maxWidth: 1100, width: "100%", position: "relative" }}>

        {/* Game switcher */}
        <div className="fade-up" style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {GAME_LINKS.map(g => (
            <Link key={g.href} href={g.href} style={{
              padding: "7px 16px", borderRadius: "var(--radius-md)",
              border: g.active ? `1px solid ${g.color}` : "1px solid var(--border-subtle)",
              background: g.active ? `${g.color}15` : "transparent",
              color: g.active ? g.color : "var(--text-secondary)",
              fontSize: 12, fontFamily: "var(--font-display)", fontWeight: g.active ? 700 : 400,
              textDecoration: "none", transition: "all 0.15s",
            }}>{g.label}</Link>
          ))}
        </div>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: LOL, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 4 }}>
                ⚔ THE RIFT AWAITS
              </div>
              <h1 className="font-display" style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text-primary)", lineHeight: 1 }}>
                LEAGUE OF<br />
                <span style={{ color: LOL }}>LEGENDS</span>
              </h1>
            </div>
            {/* Rank crest */}
            <div style={{ marginLeft: "auto", background: `linear-gradient(135deg, ${LOL}18, ${LOL_BLUE}cc)`, border: `1px solid ${LOL}40`, borderRadius: "var(--radius-lg)", padding: "14px 22px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: LOL, fontFamily: "var(--font-mono)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "1px" }}>Ranked Solo</div>
              <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color: LOL }}>{stats.rank}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{stats.lp} LP</div>
              <div style={{ marginTop: 6, height: 1, background: `${LOL}30` }} />
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 6, fontFamily: "var(--font-mono)" }}>
                {stats.winRate}% WR
              </div>
            </div>
          </div>
        </div>

        {/* Ornamental divider */}
        <div className="fade-up-delay-1" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${LOL}40)` }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: LOL }} />
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${LOL}40, transparent)` }} />
        </div>

        {/* Stat cards */}
        <div className="fade-up-delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { label: "KDA",     value: stats.kda.toFixed(1),  sub: "ratio" },
            { label: "Win Rate",value: `${stats.winRate}%`,   sub: `${stats.winRate > 50 ? "positive" : "negative"} record` },
            { label: "Avg CS",  value: stats.avgCs,            sub: "creep score" },
            { label: "Main",    value: stats.topChampion,      sub: "champion" },
          ].map(s => (
            <div key={s.label} style={{ background: `linear-gradient(135deg, ${LOL_BLUE}aa, var(--bg-card))`, border: `1px solid ${LOL}25`, borderRadius: "var(--radius-lg)", padding: "16px 18px" }}>
              <div style={{ fontSize: 10, color: LOL, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>{s.label}</div>
              <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs — LoL style scroll tabs */}
        <div className="fade-up-delay-2" style={{ display: "flex", gap: 0, marginBottom: 20, position: "relative" }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `${LOL}25` }} />
          {(["overview", "champions", "matches"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "10px 28px", border: "none",
              borderBottom: tab === t ? `2px solid ${LOL}` : "2px solid transparent",
              background: tab === t ? `${LOL}08` : "transparent",
              color: tab === t ? LOL : "var(--text-secondary)",
              fontFamily: "var(--font-display)", fontWeight: tab === t ? 700 : 400,
              fontSize: 13, cursor: "pointer", textTransform: "capitalize",
              letterSpacing: "0.3px", transition: "all 0.15s", marginBottom: -1,
            }}>{t}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
            <div style={{ background: `linear-gradient(135deg, ${LOL_BLUE}99, var(--bg-card))`, border: `1px solid ${LOL}25`, borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
              <h2 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: LOL, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>Champion Mastery Radar</h2>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={`${LOL}20`} />
                  <PolarAngleAxis dataKey="stat" tick={{ fill: "rgba(240,240,248,0.45)", fontSize: 11, fontFamily: "var(--font-mono)" }} />
                  <Radar dataKey="value" stroke={LOL} fill={LOL} fillOpacity={0.18} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: `linear-gradient(135deg, ${LOL_BLUE}99, var(--bg-card))`, border: `1px solid ${LOL}25`, borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
              <h2 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: LOL, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>Map Performance</h2>
              {stats.mapStats.map(m => (
                <div key={m.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{m.name}</span>
                    <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: m.winRate >= 50 ? "var(--accent-green)" : "var(--accent-red)" }}>{m.winRate}% ({m.played}g)</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 99, background: "var(--bg-elevated)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${m.winRate}%`, background: m.winRate >= 50 ? LOL : "var(--accent-red)", borderRadius: 99, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHAMPIONS */}
        {tab === "champions" && (
          <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {stats.championStats.map((c) => (
              <div key={c.name} style={{ background: `linear-gradient(135deg, ${LOL_BLUE}99, var(--bg-card))`, border: `1px solid ${LOL}25`, borderRadius: "var(--radius-lg)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${LOL}20`, border: `2px solid ${LOL}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: LOL, fontFamily: "var(--font-display)", flexShrink: 0 }}>
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 8 }}>{c.played} games played</div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-mono)", color: c.winRate >= 50 ? "var(--accent-green)" : "var(--accent-red)" }}>{c.winRate}%</div>
                      <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Win Rate</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-mono)" }}>{c.kda.toFixed(1)}</div>
                      <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>KDA</div>
                    </div>
                  </div>
                </div>
                <div style={{ width: 4, height: 52, borderRadius: 99, background: c.winRate >= 50 ? LOL : "var(--accent-red)" }} />
              </div>
            ))}
          </div>
        )}

        {/* MATCHES */}
        {tab === "matches" && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stats.recentMatches.map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "3px 44px 1fr 1fr 1fr 80px", alignItems: "center", gap: 14, padding: "14px 20px", background: `linear-gradient(135deg, ${LOL_BLUE}99, var(--bg-card))`, border: `1px solid ${LOL}20`, borderRadius: "var(--radius-md)" }}>
                <div style={{ width: 3, height: 40, borderRadius: 99, background: m.result === "win" ? "var(--accent-green)" : "var(--accent-red)" }} />
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${LOL}20`, border: `2px solid ${LOL}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: LOL, fontFamily: "var(--font-mono)" }}>
                  {m.champion.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{m.champion}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{m.role} · {m.durationMinutes}m · {m.playedAt}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)" }}>
                  <span style={{ color: "var(--accent-green)" }}>{m.kills}</span>
                  <span style={{ color: "var(--text-tertiary)" }}> / </span>
                  <span style={{ color: "var(--accent-red)" }}>{m.deaths}</span>
                  <span style={{ color: "var(--text-tertiary)" }}> / </span>
                  {m.assists}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{m.cs} CS · {m.visionScore} VS</div>
                <div style={{ padding: "4px 10px", borderRadius: 99, background: m.result === "win" ? "rgba(52,211,153,0.10)" : "rgba(248,113,113,0.10)", color: m.result === "win" ? "var(--accent-green)" : "var(--accent-red)", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)", textAlign: "center", textTransform: "uppercase" }}>
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
