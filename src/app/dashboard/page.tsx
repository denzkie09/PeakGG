"use client";

import Link from "next/link";
import MatchRow from "@/components/ui/MatchRow";
import {
  MOCK_VALORANT_STATS,
  MOCK_LEAGUE_STATS,
  MOCK_CS2_STATS,
  MOCK_DOTA2_STATS,
} from "@/lib/mock/data";

type RecentGameGroup = {
  title: string;
  href: string;
  accentColor: string;
  meta: string;
  matches: Array<{
    map: string;
    agent?: string;
    champion?: string;
    result: "win" | "loss" | "draw";
    kills: number;
    deaths: number;
    assists: number;
    extra?: string;
    time: string;
  }>;
};

const RECENT_LIMIT = 4;

export default function DashboardPage() {
  const valStats = MOCK_VALORANT_STATS;
  const lolStats = MOCK_LEAGUE_STATS;
  const cs2Stats = MOCK_CS2_STATS;
  const dota2Stats = MOCK_DOTA2_STATS;

  const gameGroups: RecentGameGroup[] = [
    {
      title: "Valorant",
      href: "/games/valorant",
      accentColor: "var(--accent-val)",
      meta: `${valStats.rank} · ${valStats.winRate}% WR`,
      matches: valStats.recentMatches.slice(0, RECENT_LIMIT).map((m) => ({
        map: m.map,
        agent: m.agent,
        result: m.result,
        kills: m.kills,
        deaths: m.deaths,
        assists: m.assists,
        extra: `${m.hsPercent}% HS`,
        time: m.playedAt,
      })),
    },
    {
      title: "League of Legends",
      href: "/games/league",
      accentColor: "var(--accent-lol)",
      meta: `${lolStats.rank} · ${lolStats.lp} LP`,
      matches: lolStats.recentMatches.slice(0, RECENT_LIMIT).map((m) => ({
        map: m.lane,
        champion: m.champion,
        result: m.result,
        kills: m.kills,
        deaths: m.deaths,
        assists: m.assists,
        extra: `${m.cs} CS`,
        time: m.playedAt,
      })),
    },
    {
      title: "CS2",
      href: "/games/cs2",
      accentColor: "var(--accent-cs)",
      meta: `${cs2Stats.rank} · ${cs2Stats.elo} ELO`,
      matches: cs2Stats.recentMatches.slice(0, RECENT_LIMIT).map((m) => ({
        map: m.map,
        result: m.result,
        kills: m.kills,
        deaths: m.deaths,
        assists: m.assists,
        extra: `${m.hsPercent}% HS`,
        time: m.playedAt,
      })),
    },
    {
      title: "Dota 2",
      href: "/games/dota2",
      accentColor: "#e05c30",
      meta: `${dota2Stats.rank} · ${dota2Stats.mmr} MMR`,
      matches: dota2Stats.recentMatches.slice(0, RECENT_LIMIT).map((m) => ({
        map: m.hero,
        agent: m.role,
        result: m.result,
        kills: m.kills,
        deaths: m.deaths,
        assists: m.assists,
        extra: `${m.gpm} GPM`,
        time: m.playedAt,
      })),
    },
  ];

  const totalRecentMatches = gameGroups.reduce((total, group) => total + group.matches.length, 0);
  const totalRecentWins = gameGroups.reduce(
    (total, group) => total + group.matches.filter((match) => match.result === "win").length,
    0,
  );

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1180, width: "100%" }}>
      <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 28 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>
            Dashboard
          </h1>
          <p style={{ color: "var(--text-tertiary)", fontSize: 13, marginTop: 2 }}>
            Recent matches across your connected games.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="stat-pill">{totalRecentMatches} recent games</div>
          <div className="stat-pill" style={{ color: "var(--accent-green)" }}>
            {totalRecentWins} wins
          </div>
        </div>
      </div>

      <div
        className="fade-up-delay-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {gameGroups.map((group) => (
          <section
            key={group.title}
            className="card"
            style={{
              padding: "18px 20px",
              borderLeft: `3px solid ${group.accentColor}`,
              minHeight: 320,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                  {group.title}
                </h2>
                <div style={{ fontSize: 12, color: group.accentColor, fontFamily: "var(--font-mono)", marginTop: 3 }}>
                  {group.meta}
                </div>
              </div>
              <Link
                href={group.href}
                style={{
                  color: group.accentColor,
                  border: `1px solid ${group.accentColor}35`,
                  background: `${group.accentColor}12`,
                  borderRadius: "var(--radius-md)",
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                View details
              </Link>
            </div>

            <div>
              {group.matches.map((match, index) => (
                <MatchRow key={`${group.title}-${index}`} {...match} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
