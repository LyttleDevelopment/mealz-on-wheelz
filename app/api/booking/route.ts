import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { bookingRequestSchema, BookingWarning } from "@/_lib/booking/schema";
import { calcPricing } from "@/_lib/booking/pricing";
import { verifyTurnstile } from "@/_lib/booking/turnstile";
import { checkRateLimit } from "@/_lib/booking/rate-limit";
import { sendInternalBookingEmail, sendCustomerAcknowledgmentEmail } from "@/_lib/booking/email";
import { createCalendarEvent } from "@/_lib/booking/calendar";
import { MIN_SUBMIT_MS } from "@/_lib/booking/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  // ─── Parse body ──────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "validation_error", message: "Ongeldig verzoek." },
      { status: 400 },
    );
  }

  // ─── Validate schema ─────────────────────────────────────────────────────
  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, code: "validation_error", message: "Validatiefout.", fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // ─── Honeypot ────────────────────────────────────────────────────────────
  // Already enforced via zod (max length 0), but double-check
  if (data.website !== "") {
    // Return fake success so bots learn nothing
    return NextResponse.json({ ok: true, bookingId: randomUUID(), message: "Ontvangen." }, { status: 201 });
  }

  // ─── Timing check ────────────────────────────────────────────────────────
  const elapsed = Date.now() - data.startedAt;
  if (elapsed < MIN_SUBMIT_MS) {
    return NextResponse.json({ ok: true, bookingId: randomUUID(), message: "Ontvangen." }, { status: 201 });
  }

  // ─── Rate limiting ───────────────────────────────────────────────────────
  const ip = getIp(req);
  const rateResult = await checkRateLimit(ip, data.email);
  if (rateResult.limited) {
    return NextResponse.json(
      { ok: false, code: "rate_limited", message: "Te veel aanvragen. Probeer het later opnieuw." },
      { status: 429 },
    );
  }

  // ─── Turnstile verification ──────────────────────────────────────────────
  const turnstileOk = await verifyTurnstile(data.turnstileToken, ip).catch(() => false);
  if (!turnstileOk) {
    return NextResponse.json(
      { ok: false, code: "spam_rejected", message: "Verificatie mislukt. Probeer het opnieuw." },
      { status: 429 },
    );
  }

  // ─── Recalculate pricing server-side ─────────────────────────────────────
  const pricing = calcPricing(data.experienceId, data.includeApero, data.includeMain, data.guestCount);

  const bookingId = randomUUID();
  const warnings: BookingWarning[] = [];

  // ─── Internal email (hard failure) ───────────────────────────────────────
  try {
    await sendInternalBookingEmail(data, bookingId, pricing.total);
  } catch (err) {
    console.error("[booking] Internal email failed", { bookingId, err });
    return NextResponse.json(
      { ok: false, code: "booking_delivery_failed", message: "Er is een fout opgetreden. Probeer het opnieuw of neem contact met ons op." },
      { status: 502 },
    );
  }

  // ─── Customer email (soft failure) ───────────────────────────────────────
  try {
    await sendCustomerAcknowledgmentEmail(data, bookingId, pricing.total);
  } catch (err) {
    console.warn("[booking] Customer email failed", { bookingId, err });
    warnings.push("customer_email_failed");
  }

  // ─── Google Calendar event (soft failure) ────────────────────────────────
  try {
    await createCalendarEvent(data, bookingId, pricing.total);
  } catch (err) {
    console.warn("[booking] Calendar event creation failed", { bookingId, err });
    warnings.push("calendar_failed");
  }

  return NextResponse.json(
    {
      ok: true,
      bookingId,
      message: "Uw aanvraag is ontvangen. Wij nemen binnen 24 uur contact met u op.",
      ...(warnings.length > 0 ? { warnings } : {}),
    },
    { status: 201 },
  );
}

