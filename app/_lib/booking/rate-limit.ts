/**
 * In-memory sliding-window rate limiter.
 * No external service required.
 *
 * Limits:
 *   - Per IP  : 10 requests / 60 minutes
 *   - Per email: 3 requests / 24 hours
 *
 * Note: the store is process-scoped. On serverless cold starts it resets,
 * which is acceptable — the goal is to throttle repeated bursts, not build
 * a persistent blocklist.
 */

export type RateLimitResult =
  | { limited: false }
  | { limited: true; reason: string };

// ─── Store ────────────────────────────────────────────────────────────────────

/** Map of key → array of request timestamps (ms) */
const store = new Map<string, number[]>();

const IP_MAX = 10;
const IP_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const EMAIL_MAX = 3;
const EMAIL_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Prune entries older than `windowMs` and return the trimmed list. */
function prune(timestamps: number[], windowMs: number, now: number): number[] {
  return timestamps.filter((t) => now - t < windowMs);
}

function check(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = prune(store.get(key) ?? [], windowMs, now);
  if (hits.length >= max) return false; // limited
  hits.push(now);
  store.set(key, hits);
  return true; // allowed
}

// Periodically sweep the entire store to prevent unbounded memory growth.
// Runs every 30 minutes; removes keys whose last hit is outside the longest window.
const SWEEP_INTERVAL_MS = 30 * 60 * 1000;
const MAX_WINDOW_MS = EMAIL_WINDOW_MS;

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of store.entries()) {
      const pruned = prune(timestamps, MAX_WINDOW_MS, now);
      if (pruned.length === 0) {
        store.delete(key);
      } else {
        store.set(key, pruned);
      }
    }
  }, SWEEP_INTERVAL_MS).unref?.(); // .unref() so the timer doesn't keep the process alive in Node
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function checkRateLimit(
  ip: string,
  email: string,
): Promise<RateLimitResult> {
  const normalizedEmail = email.toLowerCase().trim();

  if (!check(`ip:${ip}`, IP_MAX, IP_WINDOW_MS)) {
    return { limited: true, reason: "rate_limited_ip" };
  }

  if (!check(`email:${normalizedEmail}`, EMAIL_MAX, EMAIL_WINDOW_MS)) {
    return { limited: true, reason: "rate_limited_email" };
  }

  return { limited: false };
}
