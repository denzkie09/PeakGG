import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────
// This route handles the redirect back from Riot
// after the player logs in.
//
// It exchanges the "code" for an access token,
// then fetches the player's account info (PUUID,
// gameName, tagLine) from the Riot API.
//
// Requires in .env.local:
//   RIOT_CLIENT_ID=...
//   RIOT_CLIENT_SECRET=...
//   NEXT_PUBLIC_BASE_URL=http://localhost:3000
// ─────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/settings?error=riot_no_code`);
  }

  const clientId     = process.env.RIOT_CLIENT_ID;
  const clientSecret = process.env.RIOT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/settings?error=riot_not_configured`);
  }

  try {
    // Exchange code for token
    const tokenRes = await fetch("https://auth.riotgames.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type:   "authorization_code",
        code,
        redirect_uri: `${baseUrl}/api/auth/callback/riot`,
      }),
    });

    if (!tokenRes.ok) {
      console.error("Riot token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${baseUrl}/settings?error=riot_token_failed`);
    }

    const { access_token } = await tokenRes.json();

    // Fetch account info (gameName + tagLine)
    const accountRes = await fetch(
      "https://americas.api.riotgames.com/riot/account/v1/accounts/me",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!accountRes.ok) {
      return NextResponse.redirect(`${baseUrl}/settings?error=riot_account_failed`);
    }

    const account = await accountRes.json();
    // account = { puuid, gameName, tagLine }

    // TODO: Save account.puuid + gameName + tagLine to your database
    // linked to the currently logged-in user session.
    // Example: await db.user.update({ riotPuuid: account.puuid, ... })

    console.log("Riot account linked:", account.gameName, "#" + account.tagLine);

    // Redirect back to settings with success
    return NextResponse.redirect(
      `${baseUrl}/settings?linked=riot&name=${encodeURIComponent(account.gameName + "#" + account.tagLine)}`
    );
  } catch (err) {
    console.error("Riot callback error:", err);
    return NextResponse.redirect(`${baseUrl}/settings?error=riot_unknown`);
  }
}
