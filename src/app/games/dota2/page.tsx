"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_DOTA2_STATS } from "@/lib/mock/data";
import StatCard from "@/components/ui/StatCard";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ChevronRight } from "lucide-react";

const DOTA_COLOR = "#e05c30";
const DOTA_ACCENT = "#f09b3a";

export default function Dota2Page() {
  const stats = MOCK_DOTA2_STATS;
  const [tab, setTab] = useState<"overview" | "heroes" | "matches">("overview");
  const [heroSearch, setHeroSearch] = useState("");

  const radarData = [
    { stat: "Fighting",    value: 72 },
    { stat: "Farming",     value: 80 },
    { stat: "Supporting",  value: 45 },
    { stat: "Pushing",     value: 60 },
    { stat: "Versatility", value: 55 },
    { stat: "Vision",      value: 50 },
  ];

  const gpmTrend = stats.recentMatches.map((m, i) => ({
    game: `G${i + 1}`,
    GPM: m.gpm,
    XPM: m.xpm,
  })).reverse();

  const filteredHeroStats = stats.heroStats.filter((hero) =>
    hero.hero.toLowerCase().includes(heroSearch.trim().toLowerCase()),
  );

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, width: "100%" }}>

      {/* Header */}
      <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>
            Dota 2
          </h1>
          <p style={{ color: "var(--text-tertiary)", fontSize: 13, marginTop: 2 }}>
            Connected via Steam
          </p>
        </div>
        {/* Game switcher */}
        <div className="fade-up" style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {[
            { label: "Valorant",          href: "/games/valorant", color: "var(--accent-val)", active: false },
            { label: "League of Legends", href: "/games/league",   color: "var(--accent-lol)", active: false },
            { label: "CS2",               href: "/games/cs2",      color: "var(--accent-cs)",  active: false },
            { label: "Dota 2",            href: "/games/dota2",    color: DOTA_COLOR,           active: true  },
          ].map(g => (
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
      </div>

      {/* Rank banner */}
      <div className="fade-up-delay-1 card" style={{ padding: "16px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20, borderLeft: `3px solid ${DOTA_COLOR}` }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--font-mono)" }}>Current Medal</div>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: DOTA_COLOR, marginTop: 2 }}>
            {stats.rank} · {stats.mmr} MMR
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <div className="stat-pill" style={{ color: DOTA_ACCENT }}>{stats.wins}W · {stats.losses}L</div>
          <div className="stat-pill">{stats.winRate}% Win Rate</div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="fade-up-delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard label="Avg KDA"       value={stats.avgKda.toFixed(1)}  sub="across all heroes" />
        <StatCard label="Avg GPM"       value={stats.avgGpm}             sub="gold per minute"   accentColor={DOTA_ACCENT} />
        <StatCard label="Avg XPM"       value={stats.avgXpm}             sub="exp per minute"    />
        <StatCard label="Avg Last Hits" value={stats.avgLastHits}        sub="per game"          />
      </div>

      {/* Tabs */}
      <div className="fade-up-delay-3" style={{ display: "flex", gap: 4, marginBottom: 16, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 4, width: "fit-content" }}>
        {([
          { id: "overview", label: "overview" },
          { id: "heroes", label: `heroes (${stats.heroStats.length})` },
          { id: "matches", label: "matches" },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "7px 20px",
            borderRadius: "var(--radius-md)",
            border: tab === t.id ? `1px solid ${DOTA_COLOR}40` : "1px solid transparent",
            background: tab === t.id ? `${DOTA_COLOR}12` : "transparent",
            color: tab === t.id ? DOTA_COLOR : "var(--text-secondary)",
            fontFamily: "var(--font-display)",
            fontWeight: tab === t.id ? 600 : 400,
            fontSize: 13,
            cursor: "pointer",
            textTransform: "capitalize",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === "overview" && (
        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16 }}>
          {/* Radar */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <h2 className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Playstyle Overview</h2>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 12 }}>Based on recent 50 games</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: "rgba(240,240,248,0.45)", fontSize: 11, fontFamily: "var(--font-mono)" }} />
                <Radar dataKey="value" stroke={DOTA_COLOR} fill={DOTA_COLOR} fillOpacity={0.18} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* GPM / XPM trend */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <h2 className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>GPM / XPM Trend</h2>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 12 }}>Last 5 games</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={gpmTrend}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="game" tick={{ fill: "rgba(240,240,248,0.35)", fontSize: 11 }} />
                <YAxis tick={{ fill: "rgba(240,240,248,0.35)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="GPM" stroke={DOTA_ACCENT} strokeWidth={2} dot={{ fill: DOTA_ACCENT, r: 3 }} />
                <Line type="monotone" dataKey="XPM" stroke="#a78bfa" strokeWidth={2} dot={{ fill: "#a78bfa", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── HEROES TAB ── */}
      {tab === "heroes" && (
        <div className="fade-up card" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
            <input
              value={heroSearch}
              onChange={(event) => setHeroSearch(event.target.value)}
              placeholder="Search heroes"
              style={{ width: 280, padding: "9px 12px", borderRadius: "var(--radius-md)", border: `1px solid ${DOTA_COLOR}25`, background: "var(--bg-elevated)", color: "var(--text-primary)", fontSize: 13, outline: "none" }}
            />
            <button style={{ padding: "9px 14px", borderRadius: "var(--radius-md)", border: `1px solid ${DOTA_COLOR}35`, background: `${DOTA_COLOR}12`, color: DOTA_COLOR, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Search
            </button>
            <span style={{ marginLeft: "auto", color: "var(--text-tertiary)", fontSize: 12, fontFamily: "var(--font-mono)" }}>
              {filteredHeroStats.length} / {stats.heroStats.length}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 80px 80px 70px", gap: 12, padding: "12px 20px", borderBottom: "1px solid var(--border-subtle)", fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
            <span>Hero</span>
            <span style={{ textAlign: "center" }}>Win%</span>
            <span style={{ textAlign: "center" }}>KDA</span>
            <span style={{ textAlign: "center" }}>GPM</span>
            <span style={{ textAlign: "center" }}>XPM</span>
            <span style={{ textAlign: "center" }}>Games</span>
          </div>
          <div style={{ maxHeight: 620, overflowY: "auto" }}>
            {filteredHeroStats.map((h, i) => (
              <div key={h.hero} style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 80px 80px 70px", gap: 12, padding: "12px 20px", borderBottom: i < filteredHeroStats.length - 1 ? "1px solid var(--border-subtle)" : "none", alignItems: "center" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: `${DOTA_COLOR}20`, border: `1px solid ${DOTA_COLOR}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: DOTA_COLOR, fontFamily: "var(--font-mono)", flexShrink: 0 }}>
                    {h.hero.slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{h.hero}</span>
                </div>
                <span style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 13, color: h.winRate >= 50 ? "var(--accent-green)" : "var(--accent-red)" }}>{h.winRate}%</span>
                <span style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 13 }}>{h.kda.toFixed(1)}</span>
                <span style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 13, color: DOTA_ACCENT }}>{h.avgGpm}</span>
                <span style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 13, color: "#a78bfa" }}>{h.avgXpm}</span>
                <span style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>{h.played}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MATCHES TAB ── */}
      {tab === "matches" && (
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {stats.recentMatches.map((m) => (
            <Link key={m.matchId} href={`/games/dota2/match/${m.matchId}`} style={{ textDecoration: "none" }}>
              <div
                className="card card-hover"
                style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "3px 44px 1.2fr 1fr 1fr 1fr 80px 32px", alignItems: "center", gap: 14, cursor: "pointer" }}
              >
                {/* Result bar */}
                <div style={{ width: 3, height: 40, borderRadius: 99, background: m.result === "win" ? "var(--accent-green)" : "var(--accent-red)" }} />

                {/* Hero icon */}
                <div style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: `${DOTA_COLOR}20`, border: `1px solid ${DOTA_COLOR}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: DOTA_COLOR, fontFamily: "var(--font-mono)" }}>
                  {m.hero.slice(0, 2).toUpperCase()}
                </div>

                {/* Hero + role */}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{m.hero}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{m.role} · {m.durationMinutes}m · {m.playedAt}</div>
                </div>

                {/* KDA */}
                <div style={{ fontFamily: "var(--font-mono)" }}>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: "var(--accent-green)" }}>{m.kills}</span>
                    <span style={{ color: "var(--text-tertiary)" }}> / </span>
                    <span style={{ color: "var(--accent-red)" }}>{m.deaths}</span>
                    <span style={{ color: "var(--text-tertiary)" }}> / </span>
                    {m.assists}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>KDA</div>
                </div>

                {/* GPM / XPM */}
                <div style={{ fontFamily: "var(--font-mono)" }}>
                  <div style={{ fontSize: 13, color: DOTA_ACCENT }}>{m.gpm} GPM</div>
                  <div style={{ fontSize: 12, color: "#a78bfa" }}>{m.xpm} XPM</div>
                </div>

                {/* LH / Net worth */}
                <div style={{ fontFamily: "var(--font-mono)" }}>
                  <div style={{ fontSize: 13 }}>{m.lastHits} LH</div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{(m.netWorth / 1000).toFixed(1)}k net</div>
                </div>

                {/* Result badge */}
                <div style={{ padding: "4px 10px", borderRadius: 99, background: m.result === "win" ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", color: m.result === "win" ? "var(--accent-green)" : "var(--accent-red)", fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)", textAlign: "center", textTransform: "uppercase" }}>
                  {m.result}
                </div>

                <ChevronRight size={16} style={{ color: "var(--text-tertiary)" }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
