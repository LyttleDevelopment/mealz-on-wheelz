import { getBookingEnv } from "./env";

// Lazy-load Upstash to avoid crashing when env vars are not set (e.g. local dev without Redis)
async function getClients() {
  const env = getBookingEnv();
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  const { Redis } = await import("@upstash/redis");
  const { Ratelimit } = await import("@upstash/ratelimit");

  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  const byIp = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "booking:ip",
  });

  const byEmail = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "24 h"),
    prefix: "booking:email",
  });

  return { byIp, byEmail };
}

async function hashEmail(email: string): Promise<string> {
  const data = new TextEncoder().encode(email.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export type RateLimitResult = { limited: false } | { limited: true; reason: string };

export async function checkRateLimit(
  ip: string,
  email: string,
): Promise<RateLimitResult> {
  const clients = await getClients();
  if (!clients) {
    // No Redis configured – allow in dev but log a warning
    if (process.env.NODE_ENV === "production") {
      console.warn("[booking] Rate limiting is disabled (no Upstash config).");
    }
    return { limited: false };
  }

  const { byIp, byEmail } = clients;

  const ipResult = await byIp.limit(ip);
  if (!ipResult.success) {
    return { limited: true, reason: "rate_limited_ip" };
  }

  const emailHash = await hashEmail(email);
  const emailResult = await byEmail.limit(emailHash);
  if (!emailResult.success) {
    return { limited: true, reason: "rate_limited_email" };
  }

  return { limited: false };
}

