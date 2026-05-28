import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, encodeAuthUser } from "@/lib/auth-session";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;
  const params = req.nextUrl.searchParams;

  const claimedId = params.get("openid.claimed_id") ?? "";
  const steamId = claimedId.split("/").pop();

  if (!steamId || !/^\d+$/.test(steamId)) {
    return NextResponse.redirect(`${baseUrl}/login?error=steam_no_id`);
  }

  const verifyParams = new URLSearchParams(params);
  verifyParams.set("openid.mode", "check_authentication");

  const verifyRes = await fetch("https://steamcommunity.com/openid/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: verifyParams.toString(),
  });
  const verifyText = await verifyRes.text();

  if (!verifyText.includes("is_valid:true")) {
    return NextResponse.redirect(`${baseUrl}/login?error=steam_invalid`);
  }

  const apiKey = process.env.STEAM_API_KEY;
  let personaName = steamId;
  let avatarUrl: string | undefined;
  let profileUrl: string | undefined;

  if (apiKey) {
    try {
      const profileRes = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`,
      );
      const data = await profileRes.json();
      const player = data?.response?.players?.[0];
      personaName = player?.personaname ?? steamId;
      avatarUrl = player?.avatarfull ?? player?.avatarmedium;
      profileUrl = player?.profileurl;
    } catch {
      personaName = steamId;
    }
  }

  const res = NextResponse.redirect(`${baseUrl}/dashboard`);
  res.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: encodeAuthUser({
      id: steamId,
      username: personaName,
      provider: "steam",
      avatarUrl,
      profileUrl,
      rank: "Steam connected",
    }),
    httpOnly: true,
    sameSite: "lax",
    secure: baseUrl.startsWith("https://"),
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
