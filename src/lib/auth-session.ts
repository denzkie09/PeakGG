import type { AuthUser } from "@/types/auth";
import { createHmac, timingSafeEqual } from "crypto";

export const AUTH_COOKIE_NAME = "peakgg_user";

function sessionSecret() {
  return process.env.AUTH_SESSION_SECRET ?? "peakgg-dev-session-secret";
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function encodeAuthUser(user: AuthUser): string {
  const payload = Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeAuthUser(value?: string): AuthUser | null {
  if (!value) return null;

  try {
    const [payload, signature] = value.split(".");
    if (!payload || !signature) return null;

    const expected = sign(payload);
    const providedBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);

    if (
      providedBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(providedBuffer, expectedBuffer)
    ) {
      return null;
    }

    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AuthUser;
  } catch {
    return null;
  }
}
