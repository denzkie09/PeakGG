"use client";

import { useState } from "react";
import type { Game } from "@/types";
import { Crown, TrendingUp, Medal } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ProPlayer {
  rank: number;
  name: string;
  team: string;
  country: string;
  role: string;
  kda: number;
  winRate: number;
  acs?: number;
  hsPercent?: number;
  rr?: number;
  avgCs?: number;
  visionScore?: number;
  lp?: number;
  rating?: number;
  kdRatio?: number;
  elo?: number;
  gpm?: number;
  xpm?: number;
  mmr?: number;
}

// ── Mock leaderboard data ─────────────────────────────────────────────────────
const LEADERBOARDS: Record<Game, ProPlayer[]> = {
  valorant: [
    { rank: 1,  name: "yay",        team: "G2 Esports",      country: "🇺🇸", role: "Operator",  kda: 4.5, winRate: 72, acs: 312, hsPercent: 38, rr: 820 },
    { rank: 2,  name: "TenZ",       team: "Sentinels",        country: "🇨🇦", role: "Duelist",   kda: 4.2, winRate: 68, acs: 298, hsPercent: 42, rr: 780 },
    { rank: 3,  name: "aspas",      team: "LOUD",             country: "🇧🇷", role: "Duelist",   kda: 4.0, winRate: 70, acs: 290, hsPercent: 44, rr: 760 },
    { rank: 4,  name: "Derke",      team: "Fnatic",           country: "🇫🇮", role: "Duelist",   kda: 3.9, winRate: 67, acs: 285, hsPercent: 36, rr: 745 },
    { rank: 5,  name: "cNed",       team: "Team Vitality",    country: "🇹🇷", role: "Operator",  kda: 3.8, winRate: 65, acs: 278, hsPercent: 40, rr: 730 },
    { rank: 6,  name: "Zekken",     team: "Sentinels",        country: "🇺🇸", role: "Duelist",   kda: 3.7, winRate: 64, acs: 272, hsPercent: 35, rr: 715 },
    { rank: 7,  name: "Less",       team: "LOUD",             country: "🇧🇷", role: "Initiator", kda: 3.6, winRate: 66, acs: 265, hsPercent: 33, rr: 700 },
    { rank: 8,  name: "Alfajer",    team: "Fnatic",           country: "🇷🇺", role: "Duelist",   kda: 3.5, winRate: 63, acs: 260, hsPercent: 37, rr: 688 },
    { rank: 9,  name: "ScreaM",     team: "Team Liquid",      country: "🇧🇪", role: "Duelist",   kda: 3.4, winRate: 62, acs: 255, hsPercent: 45, rr: 675 },
    { rank: 10, name: "Victor",     team: "NRG Esports",      country: "🇺🇸", role: "Duelist",   kda: 3.3, winRate: 61, acs: 250, hsPercent: 32, rr: 660 },
  ],
  league: [
    { rank: 1,  name: "Faker",      team: "T1",               country: "🇰🇷", role: "Mid",     kda: 5.8, winRate: 74, avgCs: 245, visionScore: 38, lp: 1200 },
    { rank: 2,  name: "Chovy",      team: "Gen.G",             country: "🇰🇷", role: "Mid",     kda: 5.5, winRate: 72, avgCs: 260, visionScore: 32, lp: 1050 },
    { rank: 3,  name: "Caps",       team: "G2 Esports",       country: "🇩🇰", role: "Mid",     kda: 5.1, winRate: 70, avgCs: 230, visionScore: 35, lp: 980  },
    { rank: 4,  name: "Keria",      team: "T1",               country: "🇰🇷", role: "Support", kda: 5.2, winRate: 71, avgCs: 42,  visionScore: 55, lp: 890  },
    { rank: 5,  name: "Ruler",      team: "JDG",               country: "🇰🇷", role: "ADC",     kda: 4.8, winRate: 69, avgCs: 270, visionScore: 28, lp: 920  },
    { rank: 6,  name: "Zeus",       team: "T1",               country: "🇰🇷", role: "Top",     kda: 4.5, winRate: 68, avgCs: 220, visionScore: 30, lp: 860  },
    { rank: 7,  name: "Gumayusi",   team: "T1",               country: "🇰🇷", role: "ADC",     kda: 4.6, winRate: 67, avgCs: 255, visionScore: 26, lp: 840  },
    { rank: 8,  name: "Knight",     team: "TES",               country: "🇨🇳", role: "Mid",     kda: 4.9, winRate: 66, avgCs: 248, visionScore: 31, lp: 790  },
    { rank: 9,  name: "Perkz",      team: "Team Liquid",      country: "🇭🇷", role: "Mid",     kda: 4.3, winRate: 65, avgCs: 215, visionScore: 34, lp: 810  },
    { rank: 10, name: "ShowMaker",  team: "Dplus KIA",         country: "🇰🇷", role: "Mid",     kda: 4.7, winRate: 65, avgCs: 235, visionScore: 33, lp: 770  },
  ],
  cs2: [
    { rank: 1,  name: "ZywOo",      team: "Team Vitality",    country: "🇫🇷", role: "AWPer",  kda: 1.85, winRate: 71, rating: 1.44, kdRatio: 1.85, hsPercent: 52, elo: 22100 },
    { rank: 2,  name: "s1mple",     team: "NAVI",             country: "🇺🇦", role: "AWPer",  kda: 1.72, winRate: 69, rating: 1.38, kdRatio: 1.72, hsPercent: 55, elo: 21500 },
    { rank: 3,  name: "NiKo",       team: "G2 Esports",       country: "🇧🇦", role: "Rifler", kda: 1.68, winRate: 68, rating: 1.32, kdRatio: 1.68, hsPercent: 48, elo: 21000 },
    { rank: 4,  name: "sh1ro",      team: "Cloud9",           country: "🇷🇺", role: "AWPer",  kda: 1.65, winRate: 67, rating: 1.30, kdRatio: 1.65, hsPercent: 58, elo: 20800 },
    { rank: 5,  name: "device",     team: "Astralis",         country: "🇩🇰", role: "AWPer",  kda: 1.60, winRate: 66, rating: 1.28, kdRatio: 1.60, hsPercent: 50, elo: 20400 },
    { rank: 6,  name: "EliGE",      team: "Team Liquid",      country: "🇺🇸", role: "Rifler", kda: 1.55, winRate: 65, rating: 1.22, kdRatio: 1.55, hsPercent: 46, elo: 20000 },
    { rank: 7,  name: "Magisk",     team: "Astralis",         country: "🇩🇰", role: "Rifler", kda: 1.52, winRate: 64, rating: 1.20, kdRatio: 1.52, hsPercent: 44, elo: 19700 },
    { rank: 8,  name: "electronic", team: "NAVI",             country: "🇷🇺", role: "Rifler", kda: 1.50, winRate: 63, rating: 1.18, kdRatio: 1.50, hsPercent: 47, elo: 19400 },
    { rank: 9,  name: "ropz",       team: "FaZe Clan",        country: "🇪🇪", role: "Rifler", kda: 1.48, winRate: 62, rating: 1.16, kdRatio: 1.48, hsPercent: 43, elo: 19100 },
    { rank: 10, name: "broky",      team: "FaZe Clan",        country: "🇱🇻", role: "AWPer",  kda: 1.45, winRate: 61, rating: 1.14, kdRatio: 1.45, hsPercent: 54, elo: 18800 },
  ],
  dota2: [
    { rank: 1,  name: "Miracle-",   team: "Team Liquid",      country: "🇯🇴", role: "Carry",   kda: 5.2, winRate: 72, gpm: 780, xpm: 850, mmr: 12000 },
    { rank: 2,  name: "Topson",     team: "OG",               country: "🇫🇮", role: "Mid",     kda: 5.0, winRate: 70, gpm: 720, xpm: 880, mmr: 11500 },
    { rank: 3,  name: "ana",        team: "OG",               country: "🇦🇺", role: "Carry",   kda: 4.8, winRate: 69, gpm: 760, xpm: 820, mmr: 11000 },
    { rank: 4,  name: "Puppey",     team: "Team Secret",      country: "🇪🇪", role: "Support", kda: 3.8, winRate: 68, gpm: 420, xpm: 510, mmr: 10500 },
    { rank: 5,  name: "N0tail",     team: "OG",               country: "🇩🇰", role: "Support", kda: 3.5, winRate: 67, gpm: 400, xpm: 490, mmr: 10200 },
    { rank: 6,  name: "Ceb",        team: "OG",               country: "🇫🇷", role: "Offlane", kda: 4.0, winRate: 66, gpm: 560, xpm: 640, mmr: 9800  },
    { rank: 7,  name: "Resolut1on", team: "Team Spirit",      country: "🇺🇦", role: "Carry",   kda: 4.5, winRate: 65, gpm: 740, xpm: 800, mmr: 9500  },
    { rank: 8,  name: "Yatoro",     team: "Team Spirit",      country: "🇺🇦", role: "Carry",   kda: 4.3, winRate: 64, gpm: 720, xpm: 780, mmr: 9200  },
    { rank: 9,  name: "TORONTOTOKYO",team: "Team Spirit",     country: "🇷🇺", role: "Mid",     kda: 4.6, winRate: 63, gpm: 700, xpm: 820, mmr: 9000  },
    { rank: 10, name: "Collapse",   team: "Team Spirit",      country: "🇷🇺", role: "Offlane", kda: 3.9, winRate: 63, gpm: 540, xpm: 620, mmr: 8800  },
  ],
};

// ── Stat leader categories ────────────────────────────────────────────────────
interface StatCategory {
  key: string;
  label: string;
  suffix?: string;
  decimals: number;
  getValue: (p: ProPlayer) => number;
  color: string;
}

const STAT_CATEGORIES: Record<Game, StatCategory[]> = {
  valorant: [
    { key: "kda",     label: "Highest KDA",    decimals: 2, getValue: p => p.kda,           color: "var(--accent-green)" },
    { key: "acs",     label: "Highest ACS",    decimals: 0, getValue: p => p.acs ?? 0,      color: "var(--accent-val)"   },
    { key: "hs",      label: "Best HS%",       decimals: 0, suffix: "%", getValue: p => p.hsPercent ?? 0, color: "#f472b6" },
    { key: "winrate", label: "Best Win Rate",  decimals: 0, suffix: "%", getValue: p => p.winRate, color: "var(--accent-purple)" },
  ],
  league: [
    { key: "kda",     label: "Highest KDA",    decimals: 1, getValue: p => p.kda,              color: "var(--accent-green)" },
    { key: "cs",      label: "Highest Avg CS", decimals: 0, getValue: p => p.avgCs ?? 0,       color: "var(--accent-lol)"   },
    { key: "vision",  label: "Best Vision",    decimals: 0, getValue: p => p.visionScore ?? 0, color: "#60a5fa"             },
    { key: "winrate", label: "Best Win Rate",  decimals: 0, suffix: "%", getValue: p => p.winRate, color: "var(--accent-purple)" },
  ],
  cs2: [
    { key: "rating",  label: "Highest Rating", decimals: 2, getValue: p => p.rating ?? 0,    color: "var(--accent-green)" },
    { key: "kd",      label: "Best K/D",       decimals: 2, getValue: p => p.kdRatio ?? 0,   color: "var(--accent-cs)"    },
    { key: "hs",      label: "Best HS%",       decimals: 0, suffix: "%", getValue: p => p.hsPercent ?? 0, color: "#f472b6" },
    { key: "winrate", label: "Best Win Rate",  decimals: 0, suffix: "%", getValue: p => p.winRate, color: "var(--accent-purple)" },
  ],
  dota2: [
    { key: "kda",     label: "Highest KDA",    decimals: 1, getValue: p => p.kda,          color: "var(--accent-green)" },
    { key: "gpm",     label: "Highest GPM",    decimals: 0, getValue: p => p.gpm ?? 0,     color: "#f09b3a"             },
    { key: "xpm",     label: "Highest XPM",    decimals: 0, getValue: p => p.xpm ?? 0,     color: "var(--accent-purple)"},
    { key: "winrate", label: "Best Win Rate",  decimals: 0, suffix: "%", getValue: p => p.winRate, color: "var(--accent-green)" },
  ],
};

const GAME_CONFIG: Record<Game, { label: string; color: string; rankLabel: string }> = {
  valorant: { label: "Valorant",          color: "var(--accent-val)", rankLabel: "RR"  },
  league:   { label: "League of Legends", color: "var(--accent-lol)", rankLabel: "LP"  },
  cs2:      { label: "CS2",               color: "var(--accent-cs)",  rankLabel: "ELO" },
  dota2:    { label: "Dota 2",            color: "#e05c30",           rankLabel: "MMR" },
};

function getRankScore(p: ProPlayer, game: Game): number {
  if (game === "valorant") return p.rr    ?? 0;
  if (game === "league")   return p.lp    ?? 0;
  if (game === "cs2")      return p.elo   ?? 0;
  return p.mmr ?? 0;
}

function getMedalColor(rank: number) {
  if (rank === 1) return "#FFD700";
  if (rank === 2) return "#C0C0C0";
  if (rank === 3) return "#CD7F32";
  return "var(--text-tertiary)";
}

// ── Stat Leader Card ──────────────────────────────────────────────────────────
function StatLeaderCard({ cat, players }: { cat: StatCategory; players: ProPlayer[] }) {
  const sorted = [...players].sort((a, b) => cat.getValue(b) - cat.getValue(a));
  const top3   = sorted.slice(0, 3);
  const maxVal = cat.getValue(top3[0]);

  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <TrendingUp size={13} style={{ color: cat.color }} />
        <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{cat.label}</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {top3.map((p, i) => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
              background: `${i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : "#CD7F32"}15`,
              border: `1px solid ${i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : "#CD7F32"}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, fontFamily: "var(--font-mono)",
              color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : "#CD7F32",
            }}>
              {i + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.country} {p.name}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{p.team}</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "var(--font-mono)", color: i === 0 ? cat.color : "var(--text-secondary)" }}>
              {cat.getValue(p).toFixed(cat.decimals)}{cat.suffix ?? ""}
            </div>
          </div>
        ))}
      </div>

      {/* Bar comparison */}
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 5 }}>
        {top3.map((p, i) => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, width: 56, color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "var(--font-mono)" }}>
              {p.name}
            </span>
            <div style={{ flex: 1, height: 5, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(cat.getValue(p) / maxVal) * 100}%`, background: i === 0 ? cat.color : `${cat.color}55`, borderRadius: 99, transition: "width 0.6s ease" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Leaderboard Row ───────────────────────────────────────────────────────────
function LeaderboardRow({ p, game, index }: { p: ProPlayer; game: Game; index: number }) {
  const cfg       = GAME_CONFIG[game];
  const isTop3    = p.rank <= 3;
  const medalColor = getMedalColor(p.rank);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "52px 1fr 100px 80px 80px 90px",
        alignItems: "center", gap: 12, padding: "14px 20px",
        background: isTop3 ? `linear-gradient(90deg, ${cfg.color}08, transparent)` : index % 2 === 0 ? "var(--bg-elevated)" : "transparent",
        borderBottom: "1px solid var(--border-subtle)",
        borderLeft: isTop3 ? `3px solid ${medalColor}` : "3px solid transparent",
        transition: "background 0.15s",
        cursor: "default",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = `${cfg.color}10`)}
      onMouseLeave={e => (e.currentTarget.style.background = isTop3 ? `linear-gradient(90deg, ${cfg.color}08, transparent)` : index % 2 === 0 ? "var(--bg-elevated)" : "transparent")}
    >
      {/* Rank */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isTop3 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <Medal size={17} style={{ color: medalColor }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: medalColor, fontFamily: "var(--font-mono)" }}>#{p.rank}</span>
          </div>
        ) : (
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>#{p.rank}</span>
        )}
      </div>

      {/* Player */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          background: isTop3 ? `${cfg.color}20` : "var(--bg-card)",
          border: `1px solid ${isTop3 ? cfg.color + "40" : "var(--border-subtle)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700,
          color: isTop3 ? cfg.color : "var(--text-secondary)",
          fontFamily: "var(--font-mono)",
        }}>
          {p.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{p.country} {p.name}</div>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{p.team} · {p.role}</div>
        </div>
      </div>

      {/* Rank score */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-mono)", color: cfg.color }}>{getRankScore(p, game).toLocaleString()}</div>
        <div style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{cfg.rankLabel}</div>
      </div>

      {/* KDA */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--accent-green)" }}>{p.kda.toFixed(2)}</div>
        <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>KDA</div>
      </div>

      {/* Win Rate */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{p.winRate}%</div>
        <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Win Rate</div>
      </div>

      {/* Game stat */}
      <div style={{ textAlign: "right" }}>
        {game === "valorant" && <><div style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--accent-val)" }}>{p.acs}</div><div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>ACS</div></>}
        {game === "league"   && <><div style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--accent-lol)" }}>{p.avgCs}</div><div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Avg CS</div></>}
        {game === "cs2"      && <><div style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--accent-cs)" }}>{p.rating?.toFixed(2)}</div><div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Rating</div></>}
        {game === "dota2"    && <><div style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-mono)", color: "#f09b3a" }}>{p.gpm}</div><div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>GPM</div></>}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProPlayersPage() {
  const [game, setGame] = useState<Game>("valorant");
  const cfg     = GAME_CONFIG[game];
  const players = LEADERBOARDS[game];
  const cats    = STAT_CATEGORIES[game];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, width: "100%" }}>

      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Crown size={22} style={{ color: cfg.color }} />
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Pro Leaderboards</h1>
        </div>
        <p style={{ color: "var(--text-tertiary)", fontSize: 13 }}>Top ranked professional players and stat leaders per game</p>
      </div>

      {/* Game tabs */}
      <div className="fade-up-delay-1" style={{ display: "flex", gap: 6, marginBottom: 28, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 4, width: "fit-content" }}>
        {(Object.keys(GAME_CONFIG) as Game[]).map(g => (
          <button key={g} onClick={() => setGame(g)} style={{
            padding: "8px 20px", borderRadius: "var(--radius-md)",
            border: game === g ? `1px solid ${GAME_CONFIG[g].color}40` : "1px solid transparent",
            background: game === g ? `${GAME_CONFIG[g].color}12` : "transparent",
            color: game === g ? GAME_CONFIG[g].color : "var(--text-secondary)",
            fontFamily: "var(--font-display)", fontWeight: game === g ? 700 : 400,
            fontSize: 13, cursor: "pointer", transition: "all 0.15s",
          }}>
            {GAME_CONFIG[g].label}
          </button>
        ))}
      </div>

      {/* Stat leaders */}
      <div className="fade-up-delay-2" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <TrendingUp size={16} style={{ color: cfg.color }} />
          <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>Stat Leaders</h2>
          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>— top performers by category</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {cats.map(cat => <StatLeaderCard key={cat.key} cat={cat} players={players} />)}
        </div>
      </div>

      {/* Full leaderboard */}
      <div className="fade-up-delay-3">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Crown size={16} style={{ color: cfg.color }} />
          <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>{cfg.label} Pro Rankings</h2>
          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>— top 10 worldwide</span>
        </div>

        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 100px 80px 80px 90px", gap: 12, padding: "10px 20px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md) var(--radius-md) 0 0", border: "1px solid var(--border-subtle)", borderBottom: "none", fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          <span style={{ textAlign: "center" }}>Rank</span>
          <span>Player</span>
          <span style={{ textAlign: "right" }}>{cfg.rankLabel}</span>
          <span style={{ textAlign: "right" }}>KDA</span>
          <span style={{ textAlign: "right" }}>Win%</span>
          <span style={{ textAlign: "right" }}>{game === "valorant" ? "ACS" : game === "league" ? "Avg CS" : game === "cs2" ? "Rating" : "GPM"}</span>
        </div>

        <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "0 0 var(--radius-lg) var(--radius-lg)", overflow: "hidden" }}>
          {players.map((p, i) => <LeaderboardRow key={p.name} p={p} game={game} index={i} />)}
        </div>
      </div>
    </div>
  );
}
