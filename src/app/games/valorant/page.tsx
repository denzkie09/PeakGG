"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_VALORANT_STATS } from "@/lib/mock/data";
import MatchRow from "@/components/ui/MatchRow";
import MapStats from "@/components/ui/MapStats";
import { useSettings } from "@/context/SettingsContext";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

const VAL = "#ff4655";
const VAL_DIM = "rgba(255,70,85,0.12)";

const GAME_LINKS = [
  { label: "Valorant",        href: "/games/valorant", color: VAL,             active: true  },
  { label: "League of Legends", href: "/games/league", color: "var(--accent-lol)", active: false },
  { label: "CS2",             href: "/games/cs2",      color: "var(--accent-cs)", active: false },
  { label: "Dota 2",          href: "/games/dota2",    color: "#e05c30",          active: false },
];

export default function ValorantPage() {
  const stats = MOCK_VALORANT_STATS;
  const { settings } = useSettings();
  const [tab, setTab] = useState<"overview" | "agents" | "matches">("overview");
  const [agentSearch, setAgentSearch] = useState("");

  const matches = stats.recentMatches.slice(0, settings.matchCount).map(m => ({
    map: m.map, agent: m.agent, agentIcon: m.agentIcon, result: m.result,
    kills: m.kills, deaths: m.deaths, assists: m.assists,
    extra: `${m.hsPercent}% HS`, time: m.playedAt,
  }));

  const radarData = [
    { stat: "Aim",         value: 70 },
    { stat: "Utility",     value: 58 },
    { stat: "Game IQ",     value: 65 },
    { stat: "Positioning", value: 72 },
    { stat: "Clutch",      value: 50 },
    { stat: "Consistency", value: 68 },
  ];

  const filteredAgentStats = stats.agentStats.filter((agent) =>
    agent.name.toLowerCase().includes(agentSearch.trim().toLowerCase()),
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", position: "relative", overflow: "hidden" }}>

      {/* Themed background */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 320, background: `linear-gradient(180deg, ${VAL}18 0%, transparent 100%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 60, right: 80, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${VAL}10 0%, transparent 70%)`, pointerEvents: "none" }} />

      {/* Decorative diagonal lines (Valorant aesthetic) */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, overflow: "hidden", pointerEvents: "none", opacity: 0.04 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ position: "absolute", top: i * 40 - 20, right: -40, width: 300, height: 2, background: VAL, transform: "rotate(-45deg)" }} />
        ))}
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1100, width: "100%", position: "relative" }}>

        {/* Game switcher */}
        <div className="fade-up" style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {GAME_LINKS.map(g => (
            <Link key={g.href} href={g.href} style={{
              padding: "7px 16px",
              borderRadius: "var(--radius-md)",
              border: g.active ? `1px solid ${g.color}` : "1px solid var(--border-subtle)",
              background: g.active ? `${g.color}15` : "transparent",
              color: g.active ? g.color : "var(--text-secondary)",
              fontSize: 12,
              fontFamily: "var(--font-display)",
              fontWeight: g.active ? 700 : 400,
              textDecoration: "none",
              transition: "all 0.15s",
            }}>{g.label}</Link>
          ))}
        </div>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: VAL, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 4 }}>
                {"// TACTICAL SHOOTER"}
              </div>
              <h1 className="font-display" style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-1px", color: "var(--text-primary)", lineHeight: 1 }}>
                VALORANT
              </h1>
            </div>
            {/* Rank badge */}
            {settings.showRankBanner && <div style={{ marginLeft: "auto", background: VAL_DIM, border: `1px solid ${VAL}40`, borderRadius: "var(--radius-lg)", padding: "12px 20px", textAlign: "right" }}>
              <div style={{ fontSize: 11, color: VAL, fontFamily: "var(--font-mono)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "1px" }}>Current Rank</div>
              <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>{stats.rank}</div>
              <div style={{ fontSize: 13, color: VAL, fontFamily: "var(--font-mono)" }}>{stats.rr} RR</div>
            </div>}
          </div>
        </div>

        {/* Stats strip */}
        <div className="fade-up-delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginBottom: 24, border: `1px solid ${VAL}25`, borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          {[
            { label: "KDA",      value: stats.kda.toFixed(2), color: "var(--accent-green)" },
            { label: "WIN RATE", value: `${stats.winRate}%`,  color: "var(--text-primary)" },
            { label: "HS%",      value: `${stats.headshotPercent}%`, color: VAL },
            { label: "AVG ACS",  value: stats.avgCombatScore, color: "var(--text-primary)" },
          ].map((s, i) => (
            <div key={s.label} style={{
              padding: "18px 20px",
              background: i % 2 === 0 ? "rgba(255,70,85,0.04)" : "rgba(255,70,85,0.02)",
              borderRight: i < 3 ? `1px solid ${VAL}20` : "none",
            }}>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>{s.label}</div>
              <div className="font-display" style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="fade-up-delay-2" style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `1px solid ${VAL}20` }}>
          {([
            { id: "overview", label: "overview" },
            { id: "agents", label: `agents (${stats.agentStats.length})` },
            { id: "matches", label: "matches" },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "10px 24px",
              border: "none",
              borderBottom: tab === t.id ? `2px solid ${VAL}` : "2px solid transparent",
              background: "transparent",
              color: tab === t.id ? VAL : "var(--text-secondary)",
              fontFamily: "var(--font-display)",
              fontWeight: tab === t.id ? 700 : 400,
              fontSize: 13,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              transition: "all 0.15s",
              marginBottom: -1,
            }}>{t.label}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="fade-up" style={{ display: "grid", gridTemplateColumns: settings.showRadarChart && settings.showMapStats ? "1fr 1.2fr" : "1fr", gap: 16 }}>
            {settings.showRadarChart && <div style={{ background: VAL_DIM, border: `1px solid ${VAL}25`, borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
              <h2 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: VAL, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>Skill Radar</h2>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={`${VAL}20`} />
                  <PolarAngleAxis dataKey="stat" tick={{ fill: "rgba(240,240,248,0.45)", fontSize: 11, fontFamily: "var(--font-mono)" }} />
                  <Radar dataKey="value" stroke={VAL} fill={VAL} fillOpacity={0.2} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>}
            {settings.showMapStats && <div style={{ background: VAL_DIM, border: `1px solid ${VAL}25`, borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
              <h2 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: VAL, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>Map Performance ({stats.mapStats.length} maps)</h2>
              <MapStats maps={stats.mapStats} />
            </div>}
          </div>
        )}

        {/* AGENTS */}
        {tab === "agents" && (
          <div className="fade-up">
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <input
                value={agentSearch}
                onChange={(event) => setAgentSearch(event.target.value)}
                placeholder="Search agents"
                style={{ width: 260, padding: "9px 12px", borderRadius: "var(--radius-md)", border: `1px solid ${VAL}25`, background: "var(--bg-elevated)", color: "var(--text-primary)", fontSize: 13, outline: "none" }}
              />
              <button style={{ padding: "9px 14px", borderRadius: "var(--radius-md)", border: `1px solid ${VAL}35`, background: `${VAL}12`, color: VAL, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Search
              </button>
              <span style={{ marginLeft: "auto", color: "var(--text-tertiary)", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                {filteredAgentStats.length} / {stats.agentStats.length}
              </span>
            </div>
            <div style={{ maxHeight: 560, overflowY: "auto", paddingRight: 6, display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredAgentStats.map((a, i) => (
                <div key={a.name} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 70px", alignItems: "center", gap: 16, padding: "14px 20px", background: i % 2 === 0 ? VAL_DIM : "rgba(255,70,85,0.04)", border: `1px solid ${VAL}20`, borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", background: `${VAL}20`, border: `1px solid ${VAL}30`, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {a.icon ? <img src={a.icon} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} /> : <span style={{ fontSize: 10, color: VAL, fontFamily: "var(--font-mono)" }}>{a.name.slice(0,2).toUpperCase()}</span>}
                    </div>
                    <div>
                      <div className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{a.played} games played</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono)", color: a.winRate >= 50 ? "var(--accent-green)" : "var(--accent-red)" }}>{a.winRate}%</div>
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Win Rate</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono)" }}>{a.kda.toFixed(1)}</div>
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase" }}>KDA</div>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${a.winRate}%`, background: a.winRate >= 50 ? "var(--accent-green)" : VAL, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MATCHES */}
        {tab === "matches" && (
          <div className="fade-up" style={{ background: VAL_DIM, border: `1px solid ${VAL}25`, borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: VAL, textTransform: "uppercase", letterSpacing: "1px" }}>Match History</h2>
              <span style={{ fontSize: 12, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>last {matches.length} games</span>
            </div>
            {matches.map((m, i) => <MatchRow key={i} {...m} />)}
          </div>
        )}
      </div>
    </div>
  );
}
