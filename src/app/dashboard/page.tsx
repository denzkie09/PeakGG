"use client";

import { useState } from "react";
import type { Game } from "@/types";
import GameSelector from "@/components/ui/GameSelector";
import StatCard from "@/components/ui/StatCard";
import MatchRow from "@/components/ui/MatchRow";
import MapStats from "@/components/ui/MapStats";
import {
  MOCK_VALORANT_STATS,
  MOCK_LEAGUE_STATS,
  MOCK_CS2_STATS,
  MOCK_DOTA2_STATS,
} from "@/lib/mock/data";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

export default function DashboardPage() {
  const [game, setGame] = useState<Game>("valorant");

  const valStats  = MOCK_VALORANT_STATS;
  const lolStats  = MOCK_LEAGUE_STATS;
  const cs2Stats  = MOCK_CS2_STATS;
  const dota2Stats = MOCK_DOTA2_STATS;

  const gameColor =
    game === "valorant" ? "var(--accent-val)" :
    game === "league"   ? "var(--accent-lol)" :
    game === "cs2"      ? "var(--accent-cs)"  :
    "#e05c30";

  // Build stat cards per game
  const statCards = game === "valorant" ? [
    { label: "KDA Ratio", value: valStats.kda.toFixed(2), sub: "↑ 0.3 vs last month", trend: "up" as const, accentColor: "var(--accent-green)" },
    { label: "Win Rate", value: `${valStats.winRate}%`, sub: "138 / 256 matches" },
    { label: "HS%", value: `${valStats.headshotPercent}%`, sub: "↓ 2% vs last month", trend: "down" as const },
    { label: "Avg ACS", value: valStats.avgCombatScore, sub: "Top 38% of players" },
  ] : game === "league" ? [
    { label: "KDA Ratio", value: lolStats.kda.toFixed(1), sub: "↑ 0.5 vs last month", trend: "up" as const, accentColor: "var(--accent-green)" },
    { label: "Win Rate", value: `${lolStats.winRate}%`, sub: "93 / 180 matches" },
    { label: "Avg CS", value: lolStats.avgCs, sub: "↑ 12 vs last month", trend: "up" as const },
    { label: "Rank", value: "Plat IV", sub: `${lolStats.lp} LP`, accentColor: "var(--accent-lol)" },
  ] : game === "cs2" ? [
    { label: "KDA Ratio", value: cs2Stats.kda.toFixed(2), sub: "K/D focused", trend: "neutral" as const },
    { label: "Win Rate", value: `${cs2Stats.winRate}%`, sub: "112 / 216 matches" },
    { label: "HS%", value: `${cs2Stats.headshotPercent}%`, sub: "↑ 3% vs last month", trend: "up" as const, accentColor: "var(--accent-green)" },
    { label: "Avg Rating", value: cs2Stats.avgRating.toFixed(2), sub: "↑ 0.04 vs last month", trend: "up" as const },
  ] : [
    { label: "Avg KDA",  value: dota2Stats.avgKda.toFixed(1), sub: "across all heroes", trend: "up" as const, accentColor: "var(--accent-green)" },
    { label: "Win Rate", value: `${dota2Stats.winRate}%`,     sub: `${dota2Stats.wins}W / ${dota2Stats.losses}L` },
    { label: "Avg GPM",  value: dota2Stats.avgGpm,            sub: "gold per minute",   accentColor: "#f09b3a" },
    { label: "Avg XPM",  value: dota2Stats.avgXpm,            sub: "exp per minute" },
  ];

  const mapStats =
    game === "valorant" ? valStats.mapStats :
    game === "league"   ? lolStats.mapStats :
    game === "cs2"      ? cs2Stats.mapStats :
    dota2Stats.recentMatches.slice(0, 3).map(m => ({ name: m.hero, winRate: m.result === "win" ? 100 : 0, played: 1 }));

  const matches =
    game === "valorant" ? valStats.recentMatches.map(m => ({
      map: m.map, agent: m.agent, agentIcon: m.agentIcon, result: m.result,
      kills: m.kills, deaths: m.deaths, assists: m.assists,
      extra: `${m.hsPercent}% HS`, time: m.playedAt,
    })) :
    game === "league" ? lolStats.recentMatches.map(m => ({
      map: m.lane, agent: m.champion, agentIcon: undefined, result: m.result,
      kills: m.kills, deaths: m.deaths, assists: m.assists,
      extra: `${m.cs} CS`, time: m.playedAt,
    })) :
    game === "cs2" ? cs2Stats.recentMatches.map(m => ({
      map: m.map, agent: undefined, agentIcon: undefined, result: m.result,
      kills: m.kills, deaths: m.deaths, assists: m.assists,
      extra: `${m.hsPercent}% HS`, time: m.playedAt,
    })) :
    dota2Stats.recentMatches.map(m => ({
      map: m.hero, agent: m.role, agentIcon: undefined, result: m.result,
      kills: m.kills, deaths: m.deaths, assists: m.assists,
      extra: `${m.gpm} GPM`, time: m.playedAt,
    }));

  // Radar data for skill overview
  const radarData = game === "valorant" ? [
    { stat: "Aim",         value: 70 },
    { stat: "Util",        value: 58 },
    { stat: "Game IQ",     value: 65 },
    { stat: "Positioning", value: 72 },
    { stat: "Clutch",      value: 50 },
    { stat: "Consistency", value: 68 },
  ] : game === "league" ? [
    { stat: "CS",          value: 62 },
    { stat: "Vision",      value: 70 },
    { stat: "Teamfight",   value: 65 },
    { stat: "Objectives",  value: 58 },
    { stat: "Roaming",     value: 55 },
    { stat: "Laning",      value: 72 },
  ] : game === "cs2" ? [
    { stat: "Aim",         value: 75 },
    { stat: "Utility",     value: 55 },
    { stat: "Positioning", value: 68 },
    { stat: "Clutch",      value: 58 },
    { stat: "Spray",       value: 72 },
    { stat: "Awareness",   value: 64 },
  ] : [
    { stat: "Fighting",    value: 72 },
    { stat: "Farming",     value: 80 },
    { stat: "Supporting",  value: 45 },
    { stat: "Pushing",     value: 60 },
    { stat: "Versatility", value: 55 },
    { stat: "Vision",      value: 50 },
  ];

  const agentOrChampStats =
    game === "valorant" ? valStats.agentStats :
    game === "league"   ? lolStats.championStats :
    game === "dota2"    ? dota2Stats.heroStats.map(h => ({ name: h.hero, icon: h.heroIcon, winRate: h.winRate, kda: h.kda, played: h.played })) :
    null;

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, width: "100%" }}>
      {/* Header */}
      <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>
            Dashboard
          </h1>
          <p style={{ color: "var(--text-tertiary)", fontSize: 13, marginTop: 2 }}>
            Welcome back, <span style={{ color: "var(--text-secondary)" }}>jake_dev99</span>
          </p>
        </div>
        <GameSelector value={game} onChange={setGame} />
      </div>

      {/* Rank banner */}
      <div
        className="fade-up-delay-1 card"
        style={{
          padding: "16px 24px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 20,
          borderLeft: `3px solid ${gameColor}`,
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--font-mono)" }}>
            Current Rank
          </div>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: gameColor, marginTop: 2 }}>
            {game === "valorant" ? `${valStats.rank} · ${valStats.rr} RR` :
             game === "league"   ? `${lolStats.rank} · ${lolStats.lp} LP` :
             game === "cs2"      ? `${cs2Stats.rank} · ${cs2Stats.elo} ELO` :
             `${dota2Stats.rank} · ${dota2Stats.mmr} MMR`}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <div className="stat-pill">
            {game === "valorant" ? `#${valStats.topAgent} main` :
             game === "league"   ? `#${lolStats.topChampion} main` :
             game === "dota2"    ? `#${dota2Stats.heroStats[0]?.hero} main` :
             "Rifler"}
          </div>
          <div className="stat-pill" style={{ color: gameColor }}>
            {game === "valorant" ? "NA region" : game === "league" ? "NA region" : game === "cs2" ? "NA Premier" : "SEA server"}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div
        className="fade-up-delay-2"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}
      >
        {statCards.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Main grid: matches + maps + radar */}
      <div
        className="fade-up-delay-3"
        style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 16 }}
      >
        {/* Recent Matches */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 className="font-display" style={{ fontSize: 15, fontWeight: 600 }}>Recent Matches</h2>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>last {matches.length} games</span>
          </div>
          {matches.map((m, i) => (
            <MatchRow key={i} {...m} />
          ))}
        </div>

        {/* Map stats */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <h2 className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Map Performance</h2>
          <MapStats maps={mapStats} />
        </div>
      </div>

      {/* Radar + Agent/Champion breakdown */}
      <div
        className="fade-up-delay-4"
        style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16 }}
      >
        {/* Skill radar */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <h2 className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Skill Overview</h2>
          <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 12 }}>Based on recent 50 games</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis
                dataKey="stat"
                tick={{ fill: "rgba(240,240,248,0.45)", fontSize: 11, fontFamily: "var(--font-mono)" }}
              />
              <Radar
                dataKey="value"
                stroke={gameColor}
                fill={gameColor}
                fillOpacity={0.18}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Agent / Champion stats */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <h2 className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
            {game === "valorant" ? "Agent Stats" : game === "league" ? "Champion Stats" : game === "dota2" ? "Hero Stats" : "Weapon Stats"}
          </h2>
          {agentOrChampStats ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 60px 50px", gap: 8, paddingBottom: 8, borderBottom: "1px solid var(--border-subtle)", fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                <span>Name</span>
                <span style={{ textAlign: "center" }}>WR%</span>
                <span style={{ textAlign: "center" }}>KDA</span>
                <span style={{ textAlign: "center" }}>Played</span>
              </div>
              {agentOrChampStats.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 60px 60px 50px",
                    gap: 8,
                    padding: "9px 0",
                    borderBottom: i < agentOrChampStats.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "var(--radius-sm)",
                        background: "var(--bg-elevated)",
                        overflow: "hidden",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {a.icon ? (
                        <img src={a.icon} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: 9, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                          {a.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</span>
                  </div>
                  <span style={{ textAlign: "center", fontSize: 13, fontFamily: "var(--font-mono)", color: a.winRate >= 50 ? "var(--accent-green)" : "var(--accent-red)" }}>
                    {a.winRate}%
                  </span>
                  <span style={{ textAlign: "center", fontSize: 13, fontFamily: "var(--font-mono)" }}>
                    {a.kda.toFixed(1)}
                  </span>
                  <span style={{ textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                    {a.played}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "var(--text-tertiary)", fontSize: 13 }}>
              Weapon breakdown coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
