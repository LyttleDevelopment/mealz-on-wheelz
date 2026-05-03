import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { bookingRequestSchema, BookingWarning } from "@/_lib/booking/schema";
import { calcPricing } from "@/_lib/booking/pricing";
import { verifyTurnstile } from "@/_lib/booking/turnstile";
import { checkRateLimit } from "@/_lib/booking/rate-limit";
import {
  sendCustomerAcknowledgmentEmail,
  sendCustomerBookingFailureEmail,
  sendInternalBookingConflictEmail,
  sendInternalBookingEmail,
} from "@/_lib/booking/email";
import {
  listUnavailableBookingDates,
  removeBookedCalendarEvent,
  reserveBookingDate,
} from "@/_lib/booking/calendar";
import { minSubmitTime } from "@data/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function formatDateString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function noStoreHeaders() {
  return { "Cache-Control": "no-store" };
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const from = url.searchParams.get("from") ?? formatDateString(today);
  const to =
    url.searchParams.get("to") ?? formatDateString(addDays(today, 730));

  if (!DATE_RE.test(from) || !DATE_RE.test(to) || from > to) {
    return NextResponse.json(
      {
        ok: false,
        code: "validation_error",
        message: "Ongeldige beschikbaarheidsperiode.",
      },
      { status: 400, headers: noStoreHeaders() },
    );
  }

  try {
    const unavailableDates = await listUnavailableBookingDates(from, to);
    return NextResponse.json(
      { ok: true, unavailableDates },
      { headers: noStoreHeaders() },
    );
  } catch (err) {
    console.error("[booking] Availability lookup failed", err);
    return NextResponse.json(
      {
        ok: false,
        code: "availability_check_failed",
        message:
          "Beschikbaarheid kon niet geladen worden. Probeer het opnieuw.",
      },
      { status: 503, headers: noStoreHeaders() },
    );
  }
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
      {
        ok: false,
        code: "validation_error",
        message: "Validatiefout.",
        fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // ─── Honeypot ────────────────────────────────────────────────────────────
  // Already enforced via zod (max length 0), but double-check
  if (data.website !== "") {
    // Return fake success so bots learn nothing
    return NextResponse.json(
      { ok: true, bookingId: randomUUID(), message: "Ontvangen." },
      { status: 201 },
    );
  }

  // ─── Timing check ────────────────────────────────────────────────────────
  const elapsed = Date.now() - data.startedAt;
  if (elapsed < minSubmitTime) {
    return NextResponse.json(
      { ok: true, bookingId: randomUUID(), message: "Ontvangen." },
      { status: 201 },
    );
  }

  // ─── Rate limiting ───────────────────────────────────────────────────────
  const ip = getIp(req);
  const rateResult = await checkRateLimit(ip, data.email);
  if (rateResult.limited) {
    return NextResponse.json(
      {
        ok: false,
        code: "rate_limited",
        message: "Te veel aanvragen. Probeer het later opnieuw.",
      },
      { status: 429 },
    );
  }

  // ─── Turnstile verification ──────────────────────────────────────────────
  const turnstileOk = await verifyTurnstile(data.turnstileToken, ip).catch(
    () => false,
  );
  if (!turnstileOk) {
    return NextResponse.json(
      {
        ok: false,
        code: "spam_rejected",
        message: "Verificatie mislukt. Probeer het opnieuw.",
      },
      { status: 429 },
    );
  }

  // ─── Recalculate pricing server-side ─────────────────────────────────────
  const pricing = calcPricing(
    data.experienceId,
    data.includeApero,
    data.includeMain,
    data.guestCount,
    data.mainOptionId,
  );

  const bookingId = randomUUID();
  const warnings: BookingWarning[] = [];
  let reservedEventId: string | null = null;

  // ─── Reserve date in Google Calendar (hard failure) ──────────────────────
  try {
    const reservation = await reserveBookingDate(
      data,
      bookingId,
      pricing.total,
    );

    if (!reservation.ok) {
      const reservationReason =
        "reason" in reservation ? reservation.reason : "date_unavailable";

      if (reservationReason === "conflict_after_insert") {
        try {
          await sendInternalBookingConflictEmail(
            data,
            bookingId,
            reservation.conflicts,
            reservation.keptEvent,
          );
        } catch (err) {
          console.warn("[booking] Conflict notification email failed", {
            bookingId,
            err,
          });
        }

        try {
          await sendCustomerBookingFailureEmail(data);
        } catch (err) {
          console.warn("[booking] Customer failure email failed", {
            bookingId,
            err,
          });
        }
      }

      return NextResponse.json(
        {
          ok: false,
          code: "date_unavailable",
          message:
            "Deze datum is net niet meer beschikbaar. Kies een andere datum.",
        },
        { status: 409, headers: noStoreHeaders() },
      );
    }

    reservedEventId = reservation.eventId;
  } catch (err) {
    console.error("[booking] Calendar reservation failed", { bookingId, err });
    return NextResponse.json(
      {
        ok: false,
        code: "availability_check_failed",
        message:
          "De beschikbaarheid kon niet bevestigd worden. Probeer het opnieuw.",
      },
      { status: 503, headers: noStoreHeaders() },
    );
  }

  // ─── Internal email (hard failure) ───────────────────────────────────────
  try {
    await sendInternalBookingEmail(data, bookingId, pricing.total);
  } catch (err) {
    console.error("[booking] Internal email failed", { bookingId, err });

    if (reservedEventId) {
      try {
        await removeBookedCalendarEvent(reservedEventId);
      } catch (cleanupErr) {
        console.error("[booking] Failed to rollback reserved calendar event", {
          bookingId,
          reservedEventId,
          cleanupErr,
        });
      }
    }

    return NextResponse.json(
      {
        ok: false,
        code: "booking_delivery_failed",
        message:
          "Er is een fout opgetreden. Probeer het opnieuw of neem contact met ons op.",
      },
      { status: 502, headers: noStoreHeaders() },
    );
  }

  // ─── Customer email (soft failure) ───────────────────────────────────────
  try {
    await sendCustomerAcknowledgmentEmail(data, bookingId, pricing.total);
  } catch (err) {
    console.warn("[booking] Customer email failed", { bookingId, err });
    warnings.push("customer_email_failed");
  }

  return NextResponse.json(
    {
      ok: true,
      bookingId,
      message:
        "Uw aanvraag is ontvangen. Wij nemen binnen 24 uur contact met u op.",
      ...(warnings.length > 0 ? { warnings } : {}),
    },
    { status: 201, headers: noStoreHeaders() },
  );
}
