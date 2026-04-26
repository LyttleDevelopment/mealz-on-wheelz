import { z } from "zod";

const envSchema = z.object({
  // Turnstile – optional when TURNSTILE_BYPASS_IN_DEV is set
  TURNSTILE_SECRET_KEY: z.string().optional(),
  TURNSTILE_BYPASS_IN_DEV: z.string().optional(),

  // Upstash – both optional; rate limiting disabled when absent
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Resend
  RESEND_API_KEY: z.string().min(1),
  BOOKING_FROM_EMAIL: z.string().email(),
  BOOKING_NOTIFICATION_TO: z.string().email(),
  BOOKING_REPLY_TO: z.string().email().optional(),
  BOOKING_NOTIFICATION_CC: z.string().email().optional(),

  // Google Calendar
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().email(),
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().min(1),
  GOOGLE_CALENDAR_ID: z.string().min(1),
});

export type BookingEnv = z.infer<typeof envSchema>;

// Keys that are optional and whose empty-string value should be treated as absent
const STRIP_IF_EMPTY: (keyof BookingEnv)[] = [
  "TURNSTILE_SECRET_KEY",
  "TURNSTILE_BYPASS_IN_DEV",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "BOOKING_REPLY_TO",
  "BOOKING_NOTIFICATION_CC",
];

let _env: BookingEnv | null = null;

export function getBookingEnv(): BookingEnv {
  if (_env) return _env;

  // Build a clean copy of process.env, removing empty strings for optional keys
  const raw: Record<string, string | undefined> = { ...process.env };
  for (const key of STRIP_IF_EMPTY) {
    if (raw[key] === "") delete raw[key];
  }

  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Missing or invalid booking env vars: ${missing}`);
  }

  // Normalize escaped newlines in the private key (common in .env files)
  parsed.data.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY =
    parsed.data.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n");

  _env = parsed.data;
  return _env;
}

