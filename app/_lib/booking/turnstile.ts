import { getBookingEnv } from "./env";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  const env = getBookingEnv();

  // Dev bypass – also allow when no secret key is configured
  if (
    process.env.NODE_ENV !== "production" &&
    (env.TURNSTILE_BYPASS_IN_DEV === "true" || !env.TURNSTILE_SECRET_KEY)
  ) {
    return true;
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    console.error("[booking] TURNSTILE_SECRET_KEY is not set in production.");
    return false;
  }

  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
    ...(remoteIp ? { remoteip: remoteIp } : {}),
  });

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body,
  });

  if (!res.ok) return false;

  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

