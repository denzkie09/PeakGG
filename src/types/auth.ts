export type AuthProvider = "riot" | "steam";

export interface AuthUser {
  id: string;
  username: string;
  provider: AuthProvider;
  tagline?: string;
  avatarUrl?: string;
  profileUrl?: string;
  rank?: string;
}
