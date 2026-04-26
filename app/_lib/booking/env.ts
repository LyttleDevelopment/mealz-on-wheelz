import { z } from "zod";

const envSchema = z.object({
  // Turnstile
  TURNSTILE_SECRET_KEY: z.string().min(1),
  TURNSTILE_BYPASS_IN_DEV: z.string().optional(),

  // Upstash
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

let _env: BookingEnv | null = null;

export function getBookingEnv(): BookingEnv {
  if (_env) return _env;

  const parsed = envSchema.safeParse(process.env);
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

