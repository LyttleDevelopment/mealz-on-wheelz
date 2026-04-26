export type RateLimitResult =
  | { limited: false }
  | { limited: true; reason: string };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function checkRateLimit(
  _ip: string,
  _email: string,
): Promise<RateLimitResult> {
  return { limited: false };
}
