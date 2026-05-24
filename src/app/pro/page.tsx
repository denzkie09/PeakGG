"use client";

import { useState } from "react";
import type { Game } from "@/types";
import GameSelector from "@/components/ui/GameSelector";
import { MOCK_PRO_PLAYERS } from "@/lib/mock/data";
import { ExternalLink } from "lucide-react";

export default function ProPlayersPage() {
  const [game, setGame] = useState<Game>("valorant");

  const pros = MOCK_PRO_PLAYERS.filter((p) => p.game === game);
  const gameColor =
    game === "valorant" ? "var(--accent-val)" :
    game === "league" ? "var(--accent-lol)" :
    "var(--accent-cs)";

  const getStats = (p: typeof pros[0]) => {
    if (game === "valorant" && p.valorantStats)
      return [
        { label: "Rank", value: p.valorantStats.rank || "—" },
        { label: "RR", value: p.valorantStats.rr || "—" },
        { label: "KDA", value: p.valorantStats.kda?.toFixed(2) || "—" },
        { label: "Win%", value: `${p.valorantStats.winRate}%` || "—" },
        { label: "HS%", value: `${p.valorantStats.headshotPercent}%` || "—" },
        { label: "ACS", value: p.valorantStats.avgCombatScore || "—" },
      ];
    if (game === "league" && p.leagueStats)
      return [
        { label: "Rank", value: p.leagueStats.rank || "—" },
        { label: "LP", value: p.leagueStats.lp || "—" },
        { label: "KDA", value: p.leagueStats.kda?.toFixed(1) || "—" },
        { label: "Win%", value: `${p.leagueStats.winRate}%` || "—" },
        { label: "Avg CS", value: p.leagueStats.avgCs || "—" },
        { label: "Role", value: p.role },
      ];
    if (game === "cs2" && p.cs2Stats)
      return [
        { label: "Rank", value: p.cs2Stats.rank || "—" },
        { label: "ELO", value: p.cs2Stats.elo || "—" },
        { label: "K/D", value: p.cs2Stats.kda?.toFixed(2) || "—" },
        { label: "Win%", value: `${p.cs2Stats.winRate}%` || "—" },
        { label: "HS%", value: `${p.cs2Stats.headshotPercent}%` || "—" },
        { label: "Rating", value: p.cs2Stats.avgRating?.toFixed(2) || "—" },
      ];
    return [];
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, width: "100%" }}>
      <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Pro Players</h1>
          <p style={{ color: "var(--text-tertiary)", fontSize: 13, marginTop: 2 }}>
            See how you measure up to the professionals
          </p>
        </div>
        <GameSelector value={game} onChange={setGame} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {pros.map((p, i) => {
          const stats = getStats(p);
          return (
            <div
              key={p.id}
              className="card card-hover fade-up"
              style={{
                padding: "20px 24px",
                animationDelay: `${i * 0.08}s`,
                borderLeft: `3px solid ${gameColor}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
                {/* Avatar */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: `${gameColor}20`,
                    border: `1px solid ${gameColor}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 700,
                    color: gameColor,
                    fontFamily: "var(--font-display)",
                    flexShrink: 0,
                  }}
                >
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
                      {p.name}
                    </h2>
                    <ExternalLink size={13} style={{ color: "var(--text-tertiary)" }} />
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>
                    {p.realName} · {p.team}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <span className="stat-pill" style={{ color: gameColor }}>{p.role}</span>
                    <span className="stat-pill">{p.country}</span>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {stats.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: "var(--bg-elevated)",
                      borderRadius: "var(--radius-md)",
                      padding: "10px 12px",
                    }}
                  >
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.4px", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
                      {s.label}
                    </div>
                    <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
