export type Game = "valorant" | "league" | "cs2";

export interface Player {
  id: string;
  username: string;
  tagline?: string;
  avatarUrl?: string;
  region: string;
  accounts: {
    riot?: { puuid: string; gameName: string; tagLine: string };
    steam?: { steamId: string; personaName: string };
  };
}

export interface ValorantMatch {
  matchId: string;
  map: string;
  mode: string;
  agent: string;
  agentIcon: string;
  result: "win" | "loss" | "draw";
  kills: number;
  deaths: number;
  assists: number;
  score: number;
  hsPercent: number;
  durationMinutes: number;
  playedAt: string;
}

export interface LeagueMatch {
  matchId: string;
  champion: string;
  championIcon: string;
  role: string;
  lane: string;
  result: "win" | "loss";
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  visionScore: number;
  durationMinutes: number;
  playedAt: string;
}

export interface CS2Match {
  matchId: string;
  map: string;
  result: "win" | "loss" | "draw";
  kills: number;
  deaths: number;
  assists: number;
  hsPercent: number;
  rating: number;
  durationMinutes: number;
  playedAt: string;
}

export interface ValorantStats {
  rank: string;
  rankIcon: string;
  rr: number;
  kda: number;
  winRate: number;
  headshotPercent: number;
  avgCombatScore: number;
  topAgent: string;
  topAgentIcon: string;
  mapStats: MapStat[];
  agentStats: AgentStat[];
  recentMatches: ValorantMatch[];
}

export interface LeagueStats {
  rank: string;
  tier: string;
  lp: number;
  kda: number;
  winRate: number;
  avgCs: number;
  topChampion: string;
  topChampionIcon: string;
  mapStats: MapStat[];
  championStats: ChampionStat[];
  recentMatches: LeagueMatch[];
}

export interface CS2Stats {
  rank: string;
  elo: number;
  kda: number;
  winRate: number;
  headshotPercent: number;
  avgRating: number;
  mapStats: MapStat[];
  recentMatches: CS2Match[];
}

export interface MapStat {
  name: string;
  winRate: number;
  played: number;
}

export interface AgentStat {
  name: string;
  icon: string;
  winRate: number;
  kda: number;
  played: number;
}

export interface ChampionStat {
  name: string;
  icon: string;
  winRate: number;
  kda: number;
  played: number;
}

export interface ProPlayer {
  id: string;
  name: string;
  realName: string;
  team: string;
  teamLogo: string;
  role: string;
  country: string;
  game: Game;
  avatarUrl?: string;
  valorantStats?: Partial<ValorantStats>;
  leagueStats?: Partial<LeagueStats>;
  cs2Stats?: Partial<CS2Stats>;
}
