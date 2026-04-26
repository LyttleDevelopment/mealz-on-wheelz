import { getBookingEnv } from "./env";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string,
  remoteIp?: string,
): Promise<boolean> {
  const env = getBookingEnv();

  // Explicit bypass flag – honoured in any environment (not just dev).
  // Set TURNSTILE_BYPASS_IN_DEV=true when Turnstile is not yet configured.
  if (env.TURNSTILE_BYPASS_IN_DEV === "true") {
    return true;
  }

  // No secret key → skip verification, warn so it's visible in logs
  if (!env.TURNSTILE_SECRET_KEY) {
    console.warn(
      "[booking] Turnstile skipped: TURNSTILE_SECRET_KEY is not set. " +
      "Set TURNSTILE_BYPASS_IN_DEV=true to silence this, or configure both keys.",
    );
    return true;
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
