import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────
// Steam sends back the player's Steam ID in the
// URL after they log in. We verify it with Steam
// then optionally fetch their profile info.
//
// Requires in .env.local:
//   STEAM_API_KEY=...    (for fetching profile info)
//   NEXT_PUBLIC_BASE_URL=http://localhost:3000
// ─────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const params   = req.nextUrl.searchParams;

  // Steam returns the claimed ID like:
  // https://steamcommunity.com/openid/id/76561198XXXXXXXXX
  const claimedId = params.get("openid.claimed_id") ?? "";
  const steamId   = claimedId.split("/").pop();

  if (!steamId || !/^\d+$/.test(steamId)) {
    return NextResponse.redirect(`${baseUrl}/settings?error=steam_no_id`);
  }

  // Verify the OpenID response with Steam (important for security)
  const verifyParams = new URLSearchParams(params);
  verifyParams.set("openid.mode", "check_authentication");

  const verifyRes = await fetch("https://steamcommunity.com/openid/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: verifyParams.toString(),
  });

  const verifyText = await verifyRes.text();

  if (!verifyText.includes("is_valid:true")) {
    return NextResponse.redirect(`${baseUrl}/settings?error=steam_invalid`);
  }

  // Optionally fetch Steam profile info
  const apiKey = process.env.STEAM_API_KEY;
  let personaName = steamId;

  if (apiKey) {
    try {
      const profileRes = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`
      );
      const data = await profileRes.json();
      personaName = data?.response?.players?.[0]?.personaname ?? steamId;
    } catch {
      // Profile fetch failed — still link the account with just the Steam ID
    }
  }

  // TODO: Save steamId + personaName to your database
  // linked to the currently logged-in user session.
  // Example: await db.user.update({ steamId, steamName: personaName })

  console.log("Steam account linked:", steamId, personaName);

  return NextResponse.redirect(
    `${baseUrl}/settings?linked=steam&name=${encodeURIComponent(personaName)}`
  );
}
