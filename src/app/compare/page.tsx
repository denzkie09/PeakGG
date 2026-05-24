"use client";

import { useState } from "react";
import type { Game } from "@/types";
import GameSelector from "@/components/ui/GameSelector";
import { MOCK_VALORANT_STATS, MOCK_SEARCH_PLAYERS, MOCK_PRO_PLAYERS } from "@/lib/mock/data";
import { Search, Trophy, ChevronRight } from "lucide-react";

interface CompareBar {
  label: string;
  you: number;
  them: number;
  suffix?: string;
  higherIsBetter?: boolean;
}

function CompareBarRow({ label, you, them, suffix = "", higherIsBetter = true }: CompareBar) {
  const youBetter = higherIsBetter ? you >= them : you <= them;
  const maxVal = Math.max(you, them, 1);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "var(--text-secondary)" }}>
        <span>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)" }}>
          <span style={{ color: youBetter ? "var(--accent-green)" : "var(--accent-red)" }}>{you}{suffix}</span>
          <span style={{ color: "var(--text-tertiary)", margin: "0 6px" }}>vs</span>
          <span style={{ color: "var(--text-secondary)" }}>{them}{suffix}</span>
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* You */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "var(--accent-purple)", width: 28, fontFamily: "var(--font-mono)" }}>you</span>
          <div style={{ flex: 1, height: 6, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(you / maxVal) * 100}%`, background: "var(--accent-purple)", borderRadius: 99, transition: "width 0.5s ease" }} />
          </div>
        </div>
        {/* Them */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "var(--text-tertiary)", width: 28, fontFamily: "var(--font-mono)" }}>them</span>
          <div style={{ flex: 1, height: 6, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(them / maxVal) * 100}%`, background: "var(--accent-cs)", borderRadius: 99, transition: "width 0.5s ease" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [game, setGame] = useState<Game>("valorant");
  const [search, setSearch] = useState("");
  const [compareMode, setCompareMode] = useState<"player" | "pro">("player");
  const [selected, setSelected] = useState<string | null>(null);

  const myStats = MOCK_VALORANT_STATS;
  const pros = MOCK_PRO_PLAYERS.filter((p) => p.game === game);
  const searchPlayers = MOCK_SEARCH_PLAYERS;

  const selectedPro = pros.find((p) => p.id === selected);
  const selectedPlayer = searchPlayers.find((p) => p.id === selected);

  const compareBars: CompareBar[] = game === "valorant" && (selectedPro || selectedPlayer)
    ? [
        { label: "KDA", you: myStats.kda, them: selectedPro?.valorantStats?.kda || (selectedPlayer as any)?.valorantStats?.kda || 2.0 },
        { label: "Win Rate", you: myStats.winRate, them: selectedPro?.valorantStats?.winRate || (selectedPlayer as any)?.valorantStats?.winRate || 50, suffix: "%" },
        { label: "HS%", you: myStats.headshotPercent, them: selectedPro?.valorantStats?.headshotPercent || (selectedPlayer as any)?.valorantStats?.headshotPercent || 30, suffix: "%" },
        { label: "Avg ACS", you: myStats.avgCombatScore, them: selectedPro?.valorantStats?.avgCombatScore || (selectedPlayer as any)?.valorantStats?.avgCombatScore || 200 },
      ]
    : [];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, width: "100%" }}>
      <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Compare</h1>
          <p style={{ color: "var(--text-tertiary)", fontSize: 13, marginTop: 2 }}>Stack your stats against players or pros</p>
        </div>
        <GameSelector value={game} onChange={(g) => { setGame(g); setSelected(null); }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20 }}>
        {/* Left: search panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Mode toggle */}
          <div className="card" style={{ padding: "4px", display: "flex", gap: 4 }}>
            {(["player", "pro"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setCompareMode(m); setSelected(null); }}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "var(--radius-md)",
                  border: compareMode === m ? "1px solid var(--border-default)" : "1px solid transparent",
                  background: compareMode === m ? "var(--bg-elevated)" : "transparent",
                  color: compareMode === m ? "var(--text-primary)" : "var(--text-secondary)",
                  fontFamily: "var(--font-display)",
                  fontWeight: compareMode === m ? 600 : 400,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {m === "pro" && <Trophy size={13} />}
                {m === "player" ? "Player Search" : "Pro Players"}
              </button>
            ))}
          </div>

          {/* Search */}
          {compareMode === "player" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                padding: "10px 14px",
              }}
            >
              <Search size={14} style={{ color: "var(--text-tertiary)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search summoner / username…"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                }}
              />
            </div>
          )}

          {/* List */}
          <div className="card" style={{ padding: "8px" }}>
            {compareMode === "pro"
              ? pros.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: selected === p.id ? "1px solid var(--border-strong)" : "1px solid transparent",
                      background: selected === p.id ? "var(--bg-elevated)" : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-subtle)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: "var(--text-tertiary)",
                        fontFamily: "var(--font-mono)",
                        flexShrink: 0,
                      }}
                    >
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{p.team} · {p.role}</div>
                    </div>
                    <ChevronRight size={14} style={{ color: "var(--text-tertiary)" }} />
                  </button>
                ))
              : searchPlayers.filter(p =>
                  !search || p.username.toLowerCase().includes(search.toLowerCase())
                ).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: selected === p.id ? "1px solid var(--border-strong)" : "1px solid transparent",
                      background: selected === p.id ? "var(--bg-elevated)" : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #a78bfa44, #60a5fa44)",
                        border: "1px solid var(--border-subtle)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--accent-purple)",
                        fontFamily: "var(--font-mono)",
                        flexShrink: 0,
                      }}
                    >
                      {p.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{p.username}</div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{p.region} · {(p as any).valorantStats?.rank}</div>
                    </div>
                    <ChevronRight size={14} style={{ color: "var(--text-tertiary)" }} />
                  </button>
                ))
            }
          </div>
        </div>

        {/* Right: comparison */}
        <div>
          {!selected ? (
            <div
              className="card"
              style={{
                padding: "60px 32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                color: "var(--text-tertiary)",
              }}
            >
              <Search size={32} style={{ opacity: 0.3 }} />
              <p style={{ fontSize: 14 }}>Select a player or pro to compare stats</p>
            </div>
          ) : (
            <div className="card" style={{ padding: "24px 28px" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid var(--border-subtle)" }}>
                {/* You */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>JD</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>jake_dev99</div>
                  <div className="stat-pill" style={{ color: "var(--accent-purple)" }}>
                    {game === "valorant" ? MOCK_VALORANT_STATS.rank : "Your Rank"}
                  </div>
                </div>

                <div className="font-display" style={{ fontSize: 20, fontWeight: 800, color: "var(--text-tertiary)", flexShrink: 0 }}>VS</div>

                {/* Them */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "var(--accent-cs)", fontFamily: "var(--font-mono)" }}>
                    {(selectedPro?.name || selectedPlayer?.username || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{selectedPro?.name || selectedPlayer?.username}</div>
                  <div className="stat-pill" style={{ color: "var(--accent-cs)" }}>
                    {selectedPro ? `${selectedPro.team}` : (selectedPlayer as any)?.valorantStats?.rank}
                  </div>
                </div>
              </div>

              {/* Bars */}
              {compareBars.length > 0 ? (
                compareBars.map((bar, i) => <CompareBarRow key={i} {...bar} />)
              ) : (
                <p style={{ color: "var(--text-tertiary)", fontSize: 13 }}>No comparison data for this game/player yet.</p>
              )}

              {/* Overall verdict */}
              {compareBars.length > 0 && (
                <div
                  style={{
                    marginTop: 20,
                    padding: "14px 18px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                  }}
                >
                  <span className="font-display" style={{ fontWeight: 600, color: "var(--text-primary)" }}>Summary: </span>
                  {compareMode === "pro"
                    ? `You have room to grow — pro players average ${((compareBars.reduce((s, b) => s + b.them, 0) / compareBars.reduce((s, b) => s + b.you, 0)) * 100 - 100).toFixed(0)}% better across these stats. Keep grinding!`
                    : `You're performing ${compareBars[0].you >= compareBars[0].them ? "ahead" : "behind"} on KDA compared to this player.`}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
