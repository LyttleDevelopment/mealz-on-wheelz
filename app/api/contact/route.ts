import { NextRequest, NextResponse } from "next/server";
import { contactRequestSchema, ContactApiResponse } from "@/_lib/contact/schema";
import { verifyTurnstile } from "@/_lib/booking/turnstile";
import { checkRateLimit } from "@/_lib/booking/rate-limit";
import { sendInternalContactEmail, sendCustomerContactAcknowledgment } from "@/_lib/contact/email";
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
  // ─── Parse body ────────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ContactApiResponse>(
      { ok: false, code: "validation_error", message: "Ongeldig verzoek." },
      { status: 400 },
    );
  }

  // ─── Validate schema ───────────────────────────────────────────────────────
  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return NextResponse.json<ContactApiResponse>(
      { ok: false, code: "validation_error", message: "Validatiefout.", fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // ─── Honeypot ──────────────────────────────────────────────────────────────
  if (data.website !== "") {
    return NextResponse.json<ContactApiResponse>({ ok: true, message: "Ontvangen." }, { status: 201 });
  }

  // ─── Timing check ──────────────────────────────────────────────────────────
  const elapsed = Date.now() - data.startedAt;
  if (elapsed < MIN_SUBMIT_MS) {
    return NextResponse.json<ContactApiResponse>({ ok: true, message: "Ontvangen." }, { status: 201 });
  }

  // ─── Rate limiting ─────────────────────────────────────────────────────────
  const ip = getIp(req);
  const rateResult = await checkRateLimit(ip, data.email);
  if (rateResult.limited) {
    return NextResponse.json<ContactApiResponse>(
      { ok: false, code: "rate_limited", message: "Te veel aanvragen. Probeer het later opnieuw." },
      { status: 429 },
    );
  }

  // ─── Turnstile verification ────────────────────────────────────────────────
  const turnstileOk = await verifyTurnstile(data.turnstileToken, ip).catch(() => false);
  if (!turnstileOk) {
    return NextResponse.json<ContactApiResponse>(
      { ok: false, code: "spam_rejected", message: "Verificatie mislukt. Probeer het opnieuw." },
      { status: 429 },
    );
  }

  // ─── Internal notification email (hard failure) ────────────────────────────
  try {
    await sendInternalContactEmail(data);
  } catch (err) {
    console.error("[contact] Internal email failed", { err });
    return NextResponse.json<ContactApiResponse>(
      {
        ok: false,
        code: "delivery_failed",
        message: "Er is een fout opgetreden. Probeer het opnieuw of neem rechtstreeks contact met ons op.",
      },
      { status: 502 },
    );
  }

  // ─── Customer acknowledgment email (soft failure) ─────────────────────────
  try {
    await sendCustomerContactAcknowledgment(data);
  } catch (err) {
    console.warn("[contact] Customer acknowledgment email failed", { err });
    // Not a hard failure — internal email already went out
  }

  return NextResponse.json<ContactApiResponse>(
    { ok: true, message: "Uw bericht is ontvangen. Wij nemen zo snel mogelijk contact met u op." },
    { status: 201 },
  );
}

