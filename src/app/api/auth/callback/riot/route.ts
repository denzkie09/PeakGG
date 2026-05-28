import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, encodeAuthUser } from "@/lib/auth-session";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const storedState = req.cookies.get("riot_oauth_state")?.value;

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=riot_no_code`);
  }

  if (!state || state !== storedState) {
    return NextResponse.redirect(`${baseUrl}/login?error=riot_state_mismatch`);
  }

  const clientId = process.env.RIOT_CLIENT_ID;
  const clientSecret = process.env.RIOT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/login?error=riot_not_configured`);
  }

  try {
    const tokenRes = await fetch("https://auth.riotgames.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${baseUrl}/api/auth/callback/riot`,
      }),
    });

    if (!tokenRes.ok) {
      console.error("Riot token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${baseUrl}/login?error=riot_token_failed`);
    }

    const { access_token } = await tokenRes.json();

    const accountRes = await fetch(
      "https://americas.api.riotgames.com/riot/account/v1/accounts/me",
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    if (!accountRes.ok) {
      console.error("Riot account fetch failed:", await accountRes.text());
      return NextResponse.redirect(`${baseUrl}/login?error=riot_account_failed`);
    }

    const account = await accountRes.json();
    const username = account.gameName ?? "Riot Player";
    const tagline = account.tagLine;

    const res = NextResponse.redirect(`${baseUrl}/dashboard`);
    res.cookies.delete("riot_oauth_state");
    res.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: encodeAuthUser({
        id: account.puuid,
        username,
        tagline,
        provider: "riot",
        rank: "Riot connected",
      }),
      httpOnly: true,
      sameSite: "lax",
      secure: baseUrl.startsWith("https://"),
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("Riot callback error:", err);
    return NextResponse.redirect(`${baseUrl}/login?error=riot_unknown`);
  }
}
