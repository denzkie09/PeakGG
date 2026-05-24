import { NextResponse } from "next/server";

// ─────────────────────────────────────────────
// STEP 1 — Register your app at:
//   https://developer.riotgames.com/
//
// STEP 2 — Add these to your .env.local:
//   RIOT_CLIENT_ID=your_client_id_here
//   RIOT_CLIENT_SECRET=your_client_secret_here
//   NEXT_PUBLIC_BASE_URL=http://localhost:3000
//
// STEP 3 — In your Riot app settings, add this
//   as an allowed redirect URI:
//   http://localhost:3000/api/auth/callback/riot
// ─────────────────────────────────────────────

const RIOT_AUTH_URL = "https://auth.riotgames.com/authorize";

export async function GET() {
  const clientId = process.env.RIOT_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  // If no client ID yet, return a helpful message
  if (!clientId) {
    return NextResponse.json(
      {
        error: "RIOT_CLIENT_ID not set",
        instructions: [
          "1. Go to https://developer.riotgames.com/ and register an app",
          "2. Add RIOT_CLIENT_ID and RIOT_CLIENT_SECRET to .env.local",
          "3. Set redirect URI to: " + baseUrl + "/api/auth/callback/riot",
        ],
      },
      { status: 503 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/auth/callback/riot`,
    response_type: "code",
    scope: "openid",
  });

  return NextResponse.redirect(`${RIOT_AUTH_URL}?${params.toString()}`);
}
