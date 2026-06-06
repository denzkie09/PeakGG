"use client";

import { useState } from "react";
import type { Game } from "@/types";
import { Search, Trophy, ChevronRight, ArrowLeftRight } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type CompareMode = "player" | "pro";

interface PlayerProfile {
  id: string;
  username: string;
  tagline?: string;
  region: string;
  rank: string;
  winRate: number;
  kda: number;
  // Valorant
  hsPercent?: number;
  avgAcs?: number;
  topAgent?: string;
  mapStats?: { name: string; winRate: number; played: number }[];
  agentStats?: { name: string; winRate: number; kda: number; played: number }[];
  // League
  avgCs?: number;
  visionScore?: number;
  topChampion?: string;
  championStats?: { name: string; winRate: number; kda: number; played: number }[];
  roleStats?: { role: string; winRate: number; played: number; kda: number }[];
  // CS2
  rating?: number;
  gunStats?: { name: string; kills: number; hsPercent: number; accuracy: number }[];
  // Dota 2
  mmr?: number;
  avgGpm?: number;
  avgXpm?: number;
  topHero?: string;
  heroStats?: { name: string; winRate: number; kda: number; played: number; role: string }[];
  roleWinRate?: { role: string; winRate: number; played: number }[];
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const YOU: Record<Game, PlayerProfile> = {
  valorant: {
    id: "you", username: "jake_dev99", tagline: "PH1", region: "AP",
    rank: "Gold II", winRate: 54, kda: 2.41, hsPercent: 28, avgAcs: 218,
    topAgent: "Jett",
    mapStats: [
      { name: "Ascent", winRate: 67, played: 42 },
      { name: "Bind",   winRate: 41, played: 37 },
      { name: "Haven",  winRate: 60, played: 30 },
      { name: "Pearl",  winRate: 52, played: 25 },
      { name: "Lotus",  winRate: 44, played: 18 },
    ],
    agentStats: [
      { name: "Jett",    winRate: 62, kda: 2.8, played: 60 },
      { name: "Reyna",   winRate: 55, kda: 2.5, played: 44 },
      { name: "Killjoy", winRate: 50, kda: 2.1, played: 28 },
      { name: "Sage",    winRate: 48, kda: 1.9, played: 22 },
    ],
  },
  league: {
    id: "you", username: "jake_dev99", region: "AP",
    rank: "Platinum IV", winRate: 51, kda: 3.1, avgCs: 172, visionScore: 22,
    topChampion: "Jinx",
    championStats: [
      { name: "Jinx",     winRate: 58, kda: 3.8, played: 45 },
      { name: "Caitlyn",  winRate: 52, kda: 3.2, played: 38 },
      { name: "Ezreal",   winRate: 48, kda: 2.9, played: 30 },
    ],
    roleStats: [
      { role: "ADC",     winRate: 54, played: 110, kda: 3.4 },
      { role: "Mid",     winRate: 48, played: 40,  kda: 2.8 },
      { role: "Support", winRate: 50, played: 30,  kda: 2.5 },
    ],
  },
  cs2: {
    id: "you", username: "jake_dev99", region: "AP",
    rank: "Gold Nova III", winRate: 52, kda: 1.18, hsPercent: 44, rating: 1.09,
    gunStats: [
      { name: "AK-47",  kills: 820, hsPercent: 48, accuracy: 24 },
      { name: "M4A4",   kills: 510, hsPercent: 42, accuracy: 22 },
      { name: "AWP",    kills: 280, hsPercent: 92, accuracy: 78 },
      { name: "Deagle", kills: 190, hsPercent: 55, accuracy: 38 },
    ],
  },
  dota2: {
    id: "you", username: "jake_dev99", region: "AP",
    rank: "Ancient III", winRate: 53, kda: 3.2, mmr: 4280, avgGpm: 524, avgXpm: 612,
    topHero: "Juggernaut",
    heroStats: [
      { name: "Juggernaut",    winRate: 62, kda: 3.8, played: 55, role: "Carry"   },
      { name: "Pudge",         winRate: 50, kda: 2.9, played: 48, role: "Support" },
      { name: "Invoker",       winRate: 48, kda: 3.4, played: 40, role: "Mid"     },
      { name: "Anti-Mage",     winRate: 55, kda: 3.1, played: 35, role: "Carry"   },
      { name: "Crystal Maiden",winRate: 52, kda: 2.6, played: 28, role: "Support" },
    ],
    roleWinRate: [
      { role: "Carry",   winRate: 57, played: 110 },
      { role: "Mid",     winRate: 50, played: 60  },
      { role: "Support", winRate: 51, played: 80  },
      { role: "Offlane", winRate: 45, played: 40  },
    ],
  },
};

const SEARCH_PLAYERS: Record<Game, PlayerProfile[]> = {
  valorant: [
    {
      id: "p1", username: "shadowbyte", tagline: "NA1", region: "NA",
      rank: "Diamond II", winRate: 60, kda: 3.1, hsPercent: 35, avgAcs: 255,
      topAgent: "Reyna",
      mapStats: [
        { name: "Ascent", winRate: 72, played: 55 },
        { name: "Bind",   winRate: 55, played: 40 },
        { name: "Haven",  winRate: 65, played: 32 },
        { name: "Pearl",  winRate: 60, played: 28 },
        { name: "Lotus",  winRate: 50, played: 20 },
      ],
      agentStats: [
        { name: "Reyna",   winRate: 68, kda: 3.5, played: 70 },
        { name: "Phoenix", winRate: 55, kda: 2.8, played: 30 },
        { name: "Jett",    winRate: 52, kda: 2.6, played: 25 },
      ],
    },
    {
      id: "p2", username: "neonrush99", tagline: "EU2", region: "EU",
      rank: "Platinum I", winRate: 50, kda: 2.2, hsPercent: 26, avgAcs: 200,
      topAgent: "Sage",
      mapStats: [
        { name: "Ascent", winRate: 55, played: 38 },
        { name: "Bind",   winRate: 48, played: 30 },
        { name: "Haven",  winRate: 52, played: 22 },
        { name: "Pearl",  winRate: 44, played: 18 },
        { name: "Lotus",  winRate: 50, played: 12 },
      ],
      agentStats: [
        { name: "Sage",    winRate: 54, kda: 2.2, played: 55 },
        { name: "Killjoy", winRate: 48, kda: 2.0, played: 30 },
      ],
    },
    {
      id: "p3", username: "ironwolf", tagline: "AP3", region: "AP",
      rank: "Silver III", winRate: 46, kda: 1.8, hsPercent: 20, avgAcs: 170,
      topAgent: "Omen",
      mapStats: [
        { name: "Ascent", winRate: 48, played: 30 },
        { name: "Bind",   winRate: 42, played: 25 },
        { name: "Haven",  winRate: 50, played: 20 },
        { name: "Pearl",  winRate: 40, played: 15 },
        { name: "Lotus",  winRate: 45, played: 10 },
      ],
      agentStats: [
        { name: "Omen",   winRate: 46, kda: 1.8, played: 50 },
        { name: "Viper",  winRate: 42, kda: 1.6, played: 20 },
      ],
    },
  ],
  league: [
    {
      id: "l1", username: "MidOrFeed", region: "NA",
      rank: "Diamond I", winRate: 62, kda: 4.2, avgCs: 210, visionScore: 30,
      topChampion: "Yasuo",
      championStats: [
        { name: "Yasuo",  winRate: 65, kda: 4.5, played: 60 },
        { name: "Zed",    winRate: 58, kda: 4.0, played: 40 },
        { name: "Akali",  winRate: 55, kda: 3.8, played: 30 },
      ],
      roleStats: [
        { role: "Mid",  winRate: 64, played: 120, kda: 4.3 },
        { role: "Top",  winRate: 52, played: 30,  kda: 3.2 },
      ],
    },
    {
      id: "l2", username: "SupportGod", region: "EU",
      rank: "Platinum II", winRate: 55, kda: 3.5, avgCs: 40, visionScore: 45,
      topChampion: "Thresh",
      championStats: [
        { name: "Thresh",  winRate: 60, kda: 3.8, played: 80 },
        { name: "Lulu",    winRate: 54, kda: 3.2, played: 40 },
        { name: "Nautilus",winRate: 52, kda: 3.0, played: 30 },
      ],
      roleStats: [
        { role: "Support", winRate: 56, played: 150, kda: 3.6 },
        { role: "ADC",     winRate: 44, played: 20,  kda: 2.5 },
      ],
    },
  ],
  cs2: [
    {
      id: "c1", username: "headshotkng", region: "NA",
      rank: "Master Guardian Elite", winRate: 58, kda: 1.35, hsPercent: 52, rating: 1.24,
      gunStats: [
        { name: "AK-47",  kills: 1200, hsPercent: 56, accuracy: 28 },
        { name: "AWP",    kills: 600,  hsPercent: 94, accuracy: 82 },
        { name: "M4A4",   kills: 400,  hsPercent: 44, accuracy: 24 },
        { name: "Deagle", kills: 250,  hsPercent: 62, accuracy: 42 },
      ],
    },
    {
      id: "c2", username: "clutchmaster", region: "EU",
      rank: "Gold Nova IV", winRate: 50, kda: 1.05, hsPercent: 38, rating: 0.98,
      gunStats: [
        { name: "AK-47",  kills: 700, hsPercent: 40, accuracy: 20 },
        { name: "M4A4",   kills: 500, hsPercent: 36, accuracy: 19 },
        { name: "AWP",    kills: 200, hsPercent: 88, accuracy: 70 },
        { name: "Deagle", kills: 120, hsPercent: 44, accuracy: 30 },
      ],
    },
  ],
  dota2: [
    {
      id: "d1", username: "DotaLord", region: "SEA",
      rank: "Divine II", winRate: 60, kda: 4.1, mmr: 5200, avgGpm: 620, avgXpm: 720,
      topHero: "Invoker",
      heroStats: [
        { name: "Invoker",   winRate: 65, kda: 4.5, played: 80, role: "Mid"   },
        { name: "Meepo",     winRate: 60, kda: 3.8, played: 50, role: "Carry" },
        { name: "Tinker",    winRate: 58, kda: 4.2, played: 40, role: "Mid"   },
      ],
      roleWinRate: [
        { role: "Mid",     winRate: 62, played: 130 },
        { role: "Carry",   winRate: 55, played: 60  },
        { role: "Support", winRate: 50, played: 30  },
      ],
    },
    {
      id: "d2", username: "SupportKing", region: "EU",
      rank: "Archon IV", winRate: 52, kda: 2.8, mmr: 3100, avgGpm: 380, avgXpm: 450,
      topHero: "Crystal Maiden",
      heroStats: [
        { name: "Crystal Maiden", winRate: 55, kda: 2.9, played: 70, role: "Support" },
        { name: "Lion",           winRate: 52, kda: 2.6, played: 50, role: "Support" },
        { name: "Rubick",         winRate: 50, kda: 3.0, played: 40, role: "Support" },
      ],
      roleWinRate: [
        { role: "Support", winRate: 54, played: 160 },
        { role: "Offlane", winRate: 44, played: 40  },
      ],
    },
  ],
};

const PRO_PLAYERS: Record<Game, PlayerProfile[]> = {
  valorant: [
    { id: "tenz",  username: "TenZ",  tagline: "000", region: "NA", rank: "Radiant", winRate: 68, kda: 4.2, hsPercent: 42, avgAcs: 298, topAgent: "Jett",  mapStats: [{ name: "Ascent", winRate: 78, played: 120 }, { name: "Bind", winRate: 65, played: 90 }, { name: "Haven", winRate: 72, played: 80 }, { name: "Pearl", winRate: 70, played: 60 }, { name: "Lotus", winRate: 66, played: 50 }], agentStats: [{ name: "Jett", winRate: 72, kda: 4.5, played: 150 }, { name: "Neon", winRate: 65, kda: 4.0, played: 60 }] },
    { id: "yay",   username: "yay",   tagline: "000", region: "NA", rank: "Radiant", winRate: 72, kda: 4.5, hsPercent: 38, avgAcs: 312, topAgent: "Chamber", mapStats: [{ name: "Ascent", winRate: 80, played: 100 }, { name: "Bind", winRate: 70, played: 85 }, { name: "Haven", winRate: 75, played: 70 }, { name: "Pearl", winRate: 72, played: 55 }, { name: "Lotus", winRate: 68, played: 45 }], agentStats: [{ name: "Chamber", winRate: 75, kda: 4.8, played: 140 }, { name: "Jett", winRate: 68, kda: 4.2, played: 50 }] },
  ],
  league: [
    { id: "faker", username: "Faker", region: "KR", rank: "Challenger", winRate: 74, kda: 5.8, avgCs: 245, visionScore: 38, topChampion: "Orianna", championStats: [{ name: "Orianna", winRate: 78, kda: 6.2, played: 200 }, { name: "Azir", winRate: 72, kda: 5.5, played: 150 }], roleStats: [{ role: "Mid", winRate: 75, played: 400, kda: 5.9 }] },
    { id: "caps",  username: "Caps",  region: "EU", rank: "Challenger", winRate: 70, kda: 5.1, avgCs: 230, visionScore: 35, topChampion: "Syndra", championStats: [{ name: "Syndra", winRate: 74, kda: 5.4, played: 180 }, { name: "LeBlanc", winRate: 70, kda: 5.0, played: 130 }], roleStats: [{ role: "Mid", winRate: 71, played: 350, kda: 5.2 }] },
  ],
  cs2: [
    { id: "s1mple", username: "s1mple", region: "EU", rank: "Premier", winRate: 69, kda: 1.72, hsPercent: 55, rating: 1.38, gunStats: [{ name: "AK-47", kills: 8000, hsPercent: 58, accuracy: 32 }, { name: "AWP", kills: 6000, hsPercent: 95, accuracy: 88 }, { name: "M4A4", kills: 2000, hsPercent: 50, accuracy: 28 }, { name: "Deagle", kills: 1000, hsPercent: 65, accuracy: 48 }] },
    { id: "zywoo",  username: "ZywOo",  region: "EU", rank: "Premier", winRate: 71, kda: 1.85, hsPercent: 52, rating: 1.44, gunStats: [{ name: "AK-47", kills: 7500, hsPercent: 55, accuracy: 30 }, { name: "AWP", kills: 7000, hsPercent: 93, accuracy: 86 }, { name: "M4A4", kills: 2200, hsPercent: 48, accuracy: 26 }, { name: "Deagle", kills: 900,  hsPercent: 62, accuracy: 44 }] },
  ],
  dota2: [
    { id: "miracle", username: "Miracle-", region: "EU", rank: "Immortal", winRate: 72, kda: 5.2, mmr: 12000, avgGpm: 780, avgXpm: 850, topHero: "Anti-Mage", heroStats: [{ name: "Anti-Mage", winRate: 75, kda: 5.5, played: 300, role: "Carry" }, { name: "Invoker", winRate: 70, kda: 5.0, played: 200, role: "Mid" }], roleWinRate: [{ role: "Carry", winRate: 73, played: 500 }, { role: "Mid", winRate: 68, played: 200 }] },
    { id: "puppey",  username: "Puppey",   region: "EU", rank: "Immortal", winRate: 68, kda: 3.8, mmr: 10500, avgGpm: 420, avgXpm: 510, topHero: "Chen",       heroStats: [{ name: "Chen",    winRate: 72, kda: 3.5, played: 250, role: "Support" }, { name: "Treant", winRate: 68, kda: 3.2, played: 150, role: "Support" }], roleWinRate: [{ role: "Support", winRate: 69, played: 600 }, { role: "Offlane", winRate: 55, played: 100 }] },
  ],
};

// ── Helper components ─────────────────────────────────────────────────────────

function CompareBar({ label, you, them, suffix = "", higherIsBetter = true }: { label: string; you: number; them: number; suffix?: string; higherIsBetter?: boolean }) {
  const youBetter = higherIsBetter ? you >= them : you <= them;
  const max = Math.max(you, them, 1);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12 }}>
        <span style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)" }}>
          <span style={{ color: youBetter ? "var(--accent-green)" : "var(--accent-red)" }}>{you}{suffix}</span>
          <span style={{ color: "var(--text-tertiary)", margin: "0 6px" }}>vs</span>
          <span style={{ color: "var(--text-secondary)" }}>{them}{suffix}</span>
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {[{ label: "you", val: you, color: "var(--accent-purple)" }, { label: "them", val: them, color: "var(--accent-cs)" }].map(b => (
          <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: b.label === "you" ? "var(--accent-purple)" : "var(--text-tertiary)", width: 28, fontFamily: "var(--font-mono)", flexShrink: 0 }}>{b.label}</span>
            <div style={{ flex: 1, height: 6, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(b.val / max) * 100}%`, background: b.color, borderRadius: 99, transition: "width 0.5s ease" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatTable({ headers, rows, youRow }: { headers: string[]; rows: (string | number)[][]; youRow?: (string | number)[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid var(--border-subtle)", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {youRow && (
            <tr style={{ background: "rgba(167,139,250,0.06)" }}>
              {youRow.map((cell, i) => (
                <td key={i} style={{ padding: "9px 10px", borderBottom: "1px solid var(--border-subtle)", fontFamily: i > 0 ? "var(--font-mono)" : undefined, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? "var(--accent-purple)" : "var(--text-primary)" }}>{cell}</td>
              ))}
            </tr>
          )}
          {rows.map((row, ri) => (
            <tr key={ri} onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: "9px 10px", borderBottom: ri < rows.length - 1 ? "1px solid var(--border-subtle)" : "none", fontFamily: ci > 0 ? "var(--font-mono)" : undefined, color: "var(--text-secondary)" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Game config ───────────────────────────────────────────────────────────────
const GAME_CONFIG: Record<Game, { label: string; color: string; searchPlaceholder: string }> = {
  valorant: { label: "Valorant",          color: "var(--accent-val)", searchPlaceholder: "Search by username#tag…" },
  league:   { label: "League of Legends", color: "var(--accent-lol)", searchPlaceholder: "Search by summoner name…" },
  cs2:      { label: "CS2",               color: "var(--accent-cs)",  searchPlaceholder: "Search by Steam username…" },
  dota2:    { label: "Dota 2",            color: "#e05c30",           searchPlaceholder: "Search by Steam username…" },
};

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ComparePage() {
  const [game, setGame]           = useState<Game>("valorant");
  const [mode, setMode]           = useState<CompareMode>("player");
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState<string | null>(null);
  const [deepTab, setDeepTab]     = useState<"basic" | "maps" | "agents" | "heroes" | "roles" | "guns" | "champions">("basic");

  const cfg    = GAME_CONFIG[game];
  const me     = YOU[game];
  const pool   = mode === "pro" ? PRO_PLAYERS[game] : SEARCH_PLAYERS[game];
  const them   = pool.find(p => p.id === selected);

  const filtered = pool.filter(p =>
    !search || p.username.toLowerCase().includes(search.toLowerCase())
  );

  // Reset selected when game changes
  const handleGameChange = (g: Game) => {
    setGame(g);
    setSelected(null);
    setSearch("");
    setDeepTab("basic");
  };

  // Deep stat tabs available per game
  const deepTabs: { id: typeof deepTab; label: string }[] = [
    { id: "basic", label: "Basic Stats" },
    ...(game === "valorant" ? [
      { id: "maps"   as const, label: "Map Stats"   },
      { id: "agents" as const, label: "Agent Stats"  },
    ] : []),
    ...(game === "league" ? [
      { id: "champions" as const, label: "Champion Stats" },
      { id: "roles"     as const, label: "Role Win Rate"  },
    ] : []),
    ...(game === "cs2" ? [
      { id: "guns" as const, label: "Gun Stats" },
    ] : []),
    ...(game === "dota2" ? [
      { id: "heroes" as const, label: "Hero Stats"      },
      { id: "roles"  as const, label: "Role Win Rate"   },
    ] : []),
  ];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, width: "100%" }}>

      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Compare</h1>
        <p style={{ color: "var(--text-tertiary)", fontSize: 13, marginTop: 2 }}>
          Stack your stats against other players or pros
        </p>
      </div>

      {/* Game selector */}
      <div className="fade-up-delay-1" style={{ display: "flex", gap: 6, marginBottom: 20, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 4, width: "fit-content" }}>
        {(Object.keys(GAME_CONFIG) as Game[]).map(g => (
          <button
            key={g}
            onClick={() => handleGameChange(g)}
            style={{
              padding: "7px 18px", borderRadius: "var(--radius-md)",
              border: game === g ? `1px solid ${GAME_CONFIG[g].color}40` : "1px solid transparent",
              background: game === g ? `${GAME_CONFIG[g].color}12` : "transparent",
              color: game === g ? GAME_CONFIG[g].color : "var(--text-secondary)",
              fontFamily: "var(--font-display)", fontWeight: game === g ? 700 : 400,
              fontSize: 13, cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {GAME_CONFIG[g].label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Player / Pro toggle */}
          <div className="card" style={{ padding: 4, display: "flex", gap: 4 }}>
            {(["player", "pro"] as CompareMode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setSelected(null); }}
                style={{
                  flex: 1, padding: "8px", borderRadius: "var(--radius-md)",
                  border: mode === m ? "1px solid var(--border-default)" : "1px solid transparent",
                  background: mode === m ? "var(--bg-elevated)" : "transparent",
                  color: mode === m ? "var(--text-primary)" : "var(--text-secondary)",
                  fontFamily: "var(--font-display)", fontWeight: mode === m ? 600 : 400,
                  fontSize: 13, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                {m === "pro" && <Trophy size={13} />}
                {m === "player" ? "Players" : "Pro Players"}
              </button>
            ))}
          </div>

          {/* Search */}
          {mode === "player" && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "10px 14px" }}>
              <Search size={14} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={cfg.searchPlaceholder}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-body)" }}
              />
            </div>
          )}

          {/* Player list */}
          <div className="card" style={{ padding: 8, maxHeight: 420, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "20px 12px", textAlign: "center", color: "var(--text-tertiary)", fontSize: 13 }}>
                No players found
              </div>
            ) : filtered.map(p => (
              <button
                key={p.id}
                onClick={() => { setSelected(p.id); setDeepTab("basic"); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: "var(--radius-md)", cursor: "pointer",
                  border: selected === p.id ? "1px solid var(--border-strong)" : "1px solid transparent",
                  background: selected === p.id ? "var(--bg-elevated)" : "transparent",
                  textAlign: "left",
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${cfg.color}20`, border: `1px solid ${cfg.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: cfg.color, fontFamily: "var(--font-mono)", flexShrink: 0 }}>
                  {p.username.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.username}{p.tagline ? `#${p.tagline}` : ""}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                    {p.rank} · {p.region}
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        {!them ? (
          <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "60px 32px", color: "var(--text-tertiary)" }}>
            <ArrowLeftRight size={36} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: 14 }}>Select a {mode === "pro" ? "pro player" : "player"} to compare</p>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Showing {cfg.label} stats</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* VS header */}
            <div className="card" style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 0 }}>
              {/* You */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  {me.username.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{me.username}</div>
                <div className="stat-pill" style={{ color: "var(--accent-purple)", fontSize: 11 }}>{me.rank}</div>
              </div>

              <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "var(--text-tertiary)" }}>VS</div>

              {/* Them */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${cfg.color}20`, border: `1px solid ${cfg.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: cfg.color, fontFamily: "var(--font-mono)" }}>
                  {them.username.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{them.username}</div>
                <div className="stat-pill" style={{ color: cfg.color, fontSize: 11 }}>{them.rank}</div>
              </div>
            </div>

            {/* Deep stat tabs */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {deepTabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setDeepTab(t.id)}
                  style={{
                    padding: "6px 14px", borderRadius: "var(--radius-md)",
                    border: deepTab === t.id ? `1px solid ${cfg.color}50` : "1px solid var(--border-subtle)",
                    background: deepTab === t.id ? `${cfg.color}12` : "var(--bg-elevated)",
                    color: deepTab === t.id ? cfg.color : "var(--text-secondary)",
                    fontSize: 12, fontFamily: "var(--font-display)", fontWeight: deepTab === t.id ? 700 : 400,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── BASIC STATS ── */}
            {deepTab === "basic" && (
              <div className="card" style={{ padding: "20px 24px" }}>
                <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Core Stats
                </h3>
                <CompareBar label="Win Rate"  you={me.winRate}  them={them.winRate}  suffix="%" />
                <CompareBar label="KDA"       you={me.kda}      them={them.kda}      />
                {game === "valorant" && me.hsPercent  !== undefined && <CompareBar label="HS%"        you={me.hsPercent!}  them={them.hsPercent  ?? 0} suffix="%" />}
                {game === "valorant" && me.avgAcs     !== undefined && <CompareBar label="Avg ACS"    you={me.avgAcs!}     them={them.avgAcs     ?? 0} />}
                {game === "league"   && me.avgCs      !== undefined && <CompareBar label="Avg CS"     you={me.avgCs!}      them={them.avgCs      ?? 0} />}
                {game === "league"   && me.visionScore!== undefined && <CompareBar label="Vision Scr" you={me.visionScore!}them={them.visionScore ?? 0} />}
                {game === "cs2"      && me.hsPercent  !== undefined && <CompareBar label="HS%"        you={me.hsPercent!}  them={them.hsPercent  ?? 0} suffix="%" />}
                {game === "cs2"      && me.rating     !== undefined && <CompareBar label="Rating"     you={me.rating! * 100} them={(them.rating ?? 0) * 100} />}
                {game === "dota2"    && me.avgGpm     !== undefined && <CompareBar label="Avg GPM"    you={me.avgGpm!}     them={them.avgGpm     ?? 0} />}
                {game === "dota2"    && me.avgXpm     !== undefined && <CompareBar label="Avg XPM"    you={me.avgXpm!}     them={them.avgXpm     ?? 0} />}
                {game === "dota2"    && me.mmr        !== undefined && <CompareBar label="MMR"        you={me.mmr!}        them={them.mmr        ?? 0} />}
              </div>
            )}

            {/* ── MAP STATS (Valorant) ── */}
            {deepTab === "maps" && game === "valorant" && me.mapStats && them.mapStats && (
              <div className="card" style={{ padding: "20px 24px" }}>
                <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Map Win Rate Comparison</h3>
                <StatTable
                  headers={["Map", `You (${me.username})`, `${them.username}`, "Difference"]}
                  youRow={[]}
                  rows={me.mapStats.map(m => {
                    const theirMap = them.mapStats?.find(tm => tm.name === m.name);
                    const diff = theirMap ? m.winRate - theirMap.winRate : 0;
                    return [m.name, `${m.winRate}% (${m.played}g)`, theirMap ? `${theirMap.winRate}% (${theirMap.played}g)` : "—", diff >= 0 ? `+${diff}%` : `${diff}%`];
                  })}
                />
              </div>
            )}

            {/* ── AGENT STATS (Valorant) ── */}
            {deepTab === "agents" && game === "valorant" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[{ label: `You — ${me.username}`, data: me.agentStats }, { label: them.username, data: them.agentStats }].map(side => (
                  <div key={side.label} className="card" style={{ padding: "18px 20px" }}>
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: cfg.color }}>{side.label}</h3>
                    <StatTable
                      headers={["Agent", "WR%", "KDA", "Played"]}
                      rows={(side.data ?? []).map(a => [a.name, `${a.winRate}%`, a.kda.toFixed(1), a.played])}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ── CHAMPION STATS (League) ── */}
            {deepTab === "champions" && game === "league" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[{ label: `You — ${me.username}`, data: me.championStats }, { label: them.username, data: them.championStats }].map(side => (
                  <div key={side.label} className="card" style={{ padding: "18px 20px" }}>
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: cfg.color }}>{side.label}</h3>
                    <StatTable
                      headers={["Champion", "WR%", "KDA", "Played"]}
                      rows={(side.data ?? []).map(c => [c.name, `${c.winRate}%`, c.kda.toFixed(1), c.played])}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ── ROLE WIN RATE (League + Dota 2) ── */}
            {deepTab === "roles" && (game === "league" || game === "dota2") && (
              <div className="card" style={{ padding: "20px 24px" }}>
                <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Role Win Rate Comparison</h3>
                <StatTable
                  headers={["Role", `You (${me.username})`, `${them.username}`, "Difference"]}
                  rows={(me.roleStats ?? me.roleWinRate ?? []).map((r: any) => {
                    const theirRole = (them.roleStats ?? them.roleWinRate ?? []).find((tr: any) => tr.role === r.role);
                    const diff = theirRole ? r.winRate - theirRole.winRate : 0;
                    return [r.role, `${r.winRate}% (${r.played}g)`, theirRole ? `${theirRole.winRate}% (${theirRole.played}g)` : "—", diff >= 0 ? `+${diff}%` : `${diff}%`];
                  })}
                />
              </div>
            )}

            {/* ── HERO STATS (Dota 2) ── */}
            {deepTab === "heroes" && game === "dota2" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[{ label: `You — ${me.username}`, data: me.heroStats }, { label: them.username, data: them.heroStats }].map(side => (
                  <div key={side.label} className="card" style={{ padding: "18px 20px" }}>
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: cfg.color }}>{side.label}</h3>
                    <StatTable
                      headers={["Hero", "Role", "WR%", "KDA", "Played"]}
                      rows={(side.data ?? []).map(h => [h.name, h.role, `${h.winRate}%`, h.kda.toFixed(1), h.played])}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ── GUN STATS (CS2) ── */}
            {deepTab === "guns" && game === "cs2" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[{ label: `You — ${me.username}`, data: me.gunStats }, { label: them.username, data: them.gunStats }].map(side => (
                  <div key={side.label} className="card" style={{ padding: "18px 20px" }}>
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: cfg.color }}>{side.label}</h3>
                    <StatTable
                      headers={["Weapon", "Kills", "HS%", "Accuracy"]}
                      rows={(side.data ?? []).map(g => [g.name, g.kills.toLocaleString(), `${g.hsPercent}%`, `${g.accuracy}%`])}
                    />
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
