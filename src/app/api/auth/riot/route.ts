import { NextRequest, NextResponse } from "next/server";

const RIOT_AUTH_URL = "https://auth.riotgames.com/authorize";

export async function GET(req: NextRequest) {
  const clientId = process.env.RIOT_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;
  const state = crypto.randomUUID();

  if (!clientId) {
    return NextResponse.json(
      {
        error: "RIOT_CLIENT_ID not set",
        instructions: [
          "Register an approved Riot app with RSO access.",
          "Add RIOT_CLIENT_ID and RIOT_CLIENT_SECRET to .env.local.",
          `Set the redirect URI to ${baseUrl}/api/auth/callback/riot.`,
        ],
      },
      { status: 503 },
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/auth/callback/riot`,
    response_type: "code",
    scope: "openid offline_access",
    state,
  });

  const res = NextResponse.redirect(`${RIOT_AUTH_URL}?${params.toString()}`);
  res.cookies.set({
    name: "riot_oauth_state",
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: baseUrl.startsWith("https://"),
    path: "/",
    maxAge: 60 * 10,
  });

  return res;
}
