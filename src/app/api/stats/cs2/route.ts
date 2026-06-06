import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, decodeAuthUser } from "@/lib/auth-session";
import { fetchRealCs2Stats } from "@/lib/steam-real-stats";

export async function GET(req: NextRequest) {
  const user = decodeAuthUser(req.cookies.get(AUTH_COOKIE_NAME)?.value);

  if (!user || user.provider !== "steam") {
    return NextResponse.json(
      { error: "Sign in with Steam to load CS2 stats." },
      { status: 401 },
    );
  }

  try {
    const stats = await fetchRealCs2Stats(user.id);
    return NextResponse.json({ stats, source: "steam" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load CS2 stats." },
      { status: 502 },
    );
  }
}
