import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, decodeAuthUser } from "@/lib/auth-session";

export async function GET(req: NextRequest) {
  const user = decodeAuthUser(req.cookies.get(AUTH_COOKIE_NAME)?.value);

  return NextResponse.json({ user });
}
