import { NextResponse } from "next/server";

// ─────────────────────────────────────────────
// Steam uses OpenID 2.0 — no app registration
// needed for basic login! Just set this in .env.local:
//   NEXT_PUBLIC_BASE_URL=http://localhost:3000
//
// For reading player stats you'll also need:
//   STEAM_API_KEY=your_key_here
//   Get one free at: https://steamcommunity.com/dev/apikey
// ─────────────────────────────────────────────

const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const params = new URLSearchParams({
    "openid.ns":         "http://specs.openid.net/auth/2.0",
    "openid.mode":       "checkid_setup",
    "openid.return_to":  `${baseUrl}/api/auth/callback/steam`,
    "openid.realm":      baseUrl,
    "openid.identity":   "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });

  return NextResponse.redirect(`${STEAM_OPENID_URL}?${params.toString()}`);
}
