import { getBookingEnv } from "./env";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string,
  remoteIp?: string,
): Promise<boolean> {
  const env = getBookingEnv();

  // No secret key configured → skip verification entirely (warn in production)
  if (!env.TURNSTILE_SECRET_KEY) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[booking] Turnstile is disabled: TURNSTILE_SECRET_KEY is not set. Set it to enable bot protection in production.",
      );
    }
    return true;
  }

  // Explicit dev bypass flag
  if (
    process.env.NODE_ENV !== "production" &&
    env.TURNSTILE_BYPASS_IN_DEV === "true"
  ) {
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
