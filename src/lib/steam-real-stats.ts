import type { CS2Stats, Dota2HeroStat, Dota2Match, Dota2Stats } from "@/types";

const STEAM_ID64_OFFSET = 76561197960265728n;

type SteamStat = {
  name: string;
  value: number;
};

type OpenDotaPlayer = {
  rank_tier?: number | null;
  leaderboard_rank?: number | null;
  mmr_estimate?: { estimate?: number | null } | null;
};

type OpenDotaMatch = {
  match_id: number;
  player_slot: number;
  radiant_win: boolean;
  hero_id: number;
  kills: number;
  deaths: number;
  assists: number;
  duration: number;
  start_time: number;
  gold_per_min?: number;
  xp_per_min?: number;
  last_hits?: number;
  denies?: number;
  hero_damage?: number;
  tower_damage?: number;
  hero_healing?: number;
};

type OpenDotaHero = {
  id: number;
  localized_name: string;
};

export function steamId64ToDotaAccountId(steamId64: string): string {
  return String(BigInt(steamId64) - STEAM_ID64_OFFSET);
}

export async function fetchRealCs2Stats(steamId64: string): Promise<CS2Stats> {
  const apiKey = process.env.STEAM_API_KEY;

  if (!apiKey) {
    throw new Error("STEAM_API_KEY is not configured.");
  }

  const url = new URL("https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("steamid", steamId64);
  url.searchParams.set("appid", "730");

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`Steam CS2 stats request failed with ${res.status}.`);
  }

  const data = await res.json();
  const stats = new Map<string, number>(
    ((data?.playerstats?.stats ?? []) as SteamStat[]).map((stat) => [stat.name, stat.value]),
  );

  const kills = stats.get("total_kills") ?? 0;
  const deaths = stats.get("total_deaths") ?? 0;
  const headshots = stats.get("total_kills_headshot") ?? 0;
  const wins = stats.get("total_matches_won") ?? stats.get("total_wins") ?? 0;
  const matches = stats.get("total_matches_played") ?? stats.get("total_rounds_played") ?? 0;

  return {
    rank: "Steam Stats",
    elo: 0,
    kda: ratio(kills, deaths),
    winRate: percent(wins, matches),
    headshotPercent: percent(headshots, kills),
    avgRating: Number(Math.max(0.5, Math.min(2, ratio(kills, deaths))).toFixed(2)),
    mapStats: [],
    recentMatches: [],
  };
}

export async function fetchRealDota2Stats(steamId64: string): Promise<Dota2Stats> {
  const accountId = steamId64ToDotaAccountId(steamId64);
  const [player, recentMatches, heroesById] = await Promise.all([
    fetchOpenDota<OpenDotaPlayer>(`players/${accountId}`),
    fetchOpenDota<OpenDotaMatch[]>(`players/${accountId}/recentMatches`),
    fetchOpenDotaHeroes(),
  ]);

  if (!recentMatches.length) {
    throw new Error("OpenDota returned no recent matches. Enable Expose Public Match Data in Dota 2.");
  }

  const matches = recentMatches.map((match): Dota2Match => {
    const isRadiant = match.player_slot < 128;
    const won = isRadiant === match.radiant_win;
    const durationMinutes = Math.max(1, Math.round(match.duration / 60));
    const hero = heroesById.get(match.hero_id) ?? `Hero ${match.hero_id}`;

    return {
      matchId: String(match.match_id),
      hero,
      heroIcon: "",
      role: inferDotaRole(match.gold_per_min ?? 0, match.last_hits ?? 0),
      result: won ? "win" : "loss",
      kills: match.kills ?? 0,
      deaths: match.deaths ?? 0,
      assists: match.assists ?? 0,
      gpm: match.gold_per_min ?? 0,
      xpm: match.xp_per_min ?? 0,
      lastHits: match.last_hits ?? 0,
      denies: match.denies ?? 0,
      heroDamage: match.hero_damage ?? 0,
      towerDamage: match.tower_damage ?? 0,
      healingDone: match.hero_healing ?? 0,
      netWorth: (match.gold_per_min ?? 0) * durationMinutes,
      durationMinutes,
      playedAt: relativeTime(match.start_time),
      items: [],
      skillTimeline: [],
    };
  });

  const wins = matches.filter((match) => match.result === "win").length;
  const losses = matches.length - wins;
  const heroStats = buildHeroStats(matches);

  return {
    rank: formatDotaRank(player.rank_tier),
    rankIcon: "",
    mmr: player.mmr_estimate?.estimate ?? 0,
    winRate: percent(wins, matches.length),
    wins,
    losses,
    avgKda: average(matches.map((match) => (match.kills + match.assists) / Math.max(1, match.deaths))),
    avgGpm: Math.round(average(matches.map((match) => match.gpm))),
    avgXpm: Math.round(average(matches.map((match) => match.xpm))),
    avgLastHits: Math.round(average(matches.map((match) => match.lastHits))),
    recentMatches: matches,
    heroStats,
  };
}

async function fetchOpenDota<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.opendota.com/api/${path}`, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`OpenDota request failed with ${res.status}.`);
  }
  return res.json() as Promise<T>;
}

async function fetchOpenDotaHeroes(): Promise<Map<number, string>> {
  const heroes = await fetchOpenDota<Record<string, OpenDotaHero>>("constants/heroes");
  return new Map(Object.values(heroes).map((hero) => [hero.id, hero.localized_name]));
}

function buildHeroStats(matches: Dota2Match[]): Dota2HeroStat[] {
  const grouped = new Map<string, Dota2Match[]>();
  matches.forEach((match) => {
    grouped.set(match.hero, [...(grouped.get(match.hero) ?? []), match]);
  });

  return [...grouped.entries()]
    .map(([hero, heroMatches]) => ({
      hero,
      heroIcon: "",
      winRate: percent(heroMatches.filter((match) => match.result === "win").length, heroMatches.length),
      kda: average(heroMatches.map((match) => (match.kills + match.assists) / Math.max(1, match.deaths))),
      avgGpm: Math.round(average(heroMatches.map((match) => match.gpm))),
      avgXpm: Math.round(average(heroMatches.map((match) => match.xpm))),
      played: heroMatches.length,
    }))
    .sort((a, b) => b.played - a.played || b.winRate - a.winRate);
}

function inferDotaRole(gpm: number, lastHits: number): string {
  if (gpm >= 560 || lastHits >= 220) return "Carry";
  if (gpm >= 470 || lastHits >= 150) return "Core";
  if (gpm >= 380 || lastHits >= 80) return "Offlane";
  return "Support";
}

function formatDotaRank(rankTier?: number | null): string {
  if (!rankTier) return "Unranked";

  const tier = Math.floor(rankTier / 10);
  const stars = rankTier % 10;
  const names = ["Unranked", "Herald", "Guardian", "Crusader", "Archon", "Legend", "Ancient", "Divine", "Immortal"];

  if (tier >= 8) return "Immortal";
  return `${names[tier] ?? "Unranked"} ${roman(stars)}`;
}

function roman(value: number): string {
  return ["", "I", "II", "III", "IV", "V"][value] ?? "";
}

function relativeTime(unixSeconds: number): string {
  const elapsedSeconds = Math.max(0, Math.floor(Date.now() / 1000) - unixSeconds);
  const hours = Math.floor(elapsedSeconds / 3600);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return Number((values.reduce((total, value) => total + value, 0) / values.length).toFixed(1));
}

function percent(value: number, total: number): number {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function ratio(value: number, total: number): number {
  if (!total) return 0;
  return Number((value / total).toFixed(2));
}
