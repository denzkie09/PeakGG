"use client";

import { useState } from "react";
import type { Game } from "@/types";
import GameSelector from "@/components/ui/GameSelector";
import { MOCK_SEARCH_PLAYERS } from "@/lib/mock/data";
import { Search, ArrowLeftRight } from "lucide-react";
import Link from "next/link";

export default function PlayersPage() {
  const [game, setGame] = useState<Game>("valorant");
  const [search, setSearch] = useState("");

  const players = MOCK_SEARCH_PLAYERS.filter(
    (p) => !search || p.username.toLowerCase().includes(search.toLowerCase())
  );

  const gameColor =
    game === "valorant" ? "var(--accent-val)" :
    game === "league" ? "var(--accent-lol)" :
    "var(--accent-cs)";

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, width: "100%" }}>
      <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Players</h1>
          <p style={{ color: "var(--text-tertiary)", fontSize: 13, marginTop: 2 }}>Browse and search other players</p>
        </div>
        <GameSelector value={game} onChange={setGame} />
      </div>

      {/* Search bar */}
      <div
        className="fade-up-delay-1"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)",
          padding: "12px 18px",
          marginBottom: 20,
        }}
      >
        <Search size={16} style={{ color: "var(--text-tertiary)" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username, summoner name, or Steam ID…"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: 14,
            fontFamily: "var(--font-body)",
          }}
        />
      </div>

      {/* Player list */}
      <div className="fade-up-delay-2 card" style={{ overflow: "hidden" }}>
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 120px",
            gap: 12,
            padding: "12px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            fontSize: 11,
            color: "var(--text-tertiary)",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.4px",
          }}
        >
          <span>Player</span>
          <span>Rank</span>
          <span>KDA</span>
          <span>Win%</span>
          <span>HS%</span>
          <span />
        </div>

        {players.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-tertiary)" }}>
            No players found for "{search}"
          </div>
        ) : (
          players.map((p, i) => {
            const stats = (p as any).valorantStats;
            return (
              <div
                key={p.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 120px",
                  gap: 12,
                  padding: "14px 20px",
                  borderBottom: i < players.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  alignItems: "center",
                  transition: "background 0.15s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* Player */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: `${gameColor}20`,
                      border: `1px solid ${gameColor}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: gameColor,
                      fontFamily: "var(--font-mono)",
                      flexShrink: 0,
                    }}
                  >
                    {p.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{p.username}</div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{p.region}</div>
                  </div>
                </div>

                <span className="stat-pill" style={{ fontSize: 12, color: gameColor }}>{stats?.rank || "—"}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{stats?.kda?.toFixed(2) || "—"}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: stats?.winRate >= 50 ? "var(--accent-green)" : "var(--accent-red)" }}>
                  {stats?.winRate ? `${stats.winRate}%` : "—"}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{stats?.headshotPercent ? `${stats.headshotPercent}%` : "—"}</span>

                <Link
                  href={`/compare?player=${p.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-default)",
                    background: "transparent",
                    color: "var(--text-secondary)",
                    fontSize: 12,
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.15s",
                    cursor: "pointer",
                  }}
                >
                  <ArrowLeftRight size={12} />
                  Compare
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
