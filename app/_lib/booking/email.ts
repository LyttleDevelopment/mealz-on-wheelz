import { Resend } from "resend";
import { getBookingEnv } from "./env";
import { formatEuro } from "./pricing";
import { BookingRequest } from "./schema";
import { getExperience, getExperienceMainOption } from "./constants";
import { CalendarConflictEvent } from "./calendar";

function getResendClient() {
  const env = getBookingEnv();
  return { env, resend: new Resend(env.RESEND_API_KEY) };
}

function buildInternalHtml(
  req: BookingRequest,
  bookingId: string,
  estimatedTotal: number,
): string {
  const exp = getExperience(req.experienceId);
  const mainOption = getExperienceMainOption(
    req.experienceId,
    req.mainOptionId,
  );
  return `
<h2>Nieuwe booking aanvraag</h2>
<p><strong>Booking ID:</strong> ${bookingId}</p>
<hr>
<h3>Experience</h3>
<ul>
  <li><strong>Formule:</strong> ${exp.title}</li>
  ${exp.hasApero ? `<li><strong>Apéro:</strong> ${req.includeApero ? "Ja" : "Nee"}</li>` : ""}
  ${exp.hasMain ? `<li><strong>${exp.mainLabel}:</strong> ${req.includeMain ? "Ja" : "Nee"}</li>` : ""}
  ${req.includeMain && mainOption ? `<li><strong>Gekozen formule:</strong> ${mainOption.label}</li>` : ""}
  <li><strong>Aantal gasten:</strong> ${req.guestCount}</li>
  <li><strong>Geschatte totaalprijs:</strong> ${formatEuro(estimatedTotal)}</li>
</ul>
<h3>Contact</h3>
<ul>
  <li><strong>Naam:</strong> ${req.fullName}</li>
  <li><strong>E-mail:</strong> ${req.email}</li>
  <li><strong>Telefoon:</strong> ${req.phone}</li>
  <li><strong>Type event:</strong> ${req.eventType}</li>
  <li><strong>Datum:</strong> ${req.eventDate}</li>
  <li><strong>Tijdstip:</strong> ${req.eventTime}</li>
  <li><strong>Locatie:</strong> ${req.streetName}, ${req.postalCode} ${req.city}${req.province ? `, ${req.province}` : ""}</li>
  ${req.notes ? `<li><strong>Opmerkingen:</strong> ${req.notes}</li>` : ""}
</ul>
`.trim();
}

function buildCustomerHtml(
  req: BookingRequest,
  bookingId: string,
  estimatedTotal: number,
): string {
  const exp = getExperience(req.experienceId);
  const mainOption = getExperienceMainOption(
    req.experienceId,
    req.mainOptionId,
  );
  return `
<h2>Bedankt voor uw aanvraag, ${req.fullName}!</h2>
<p>Wij hebben uw reservatie-aanvraag ontvangen en nemen binnen <strong>24 uur</strong> contact met u op om de beschikbaarheid te bevestigen.</p>
<p><strong>Dit is een aanvraag, geen bevestiging.</strong></p>
<hr>
<h3>Uw aanvraag</h3>
<ul>
  <li><strong>Booking ID:</strong> ${bookingId}</li>
  <li><strong>Formule:</strong> ${exp.title}</li>
  <li><strong>Datum:</strong> ${req.eventDate}</li>
  <li><strong>Tijdstip:</strong> ${req.eventTime}</li>
  ${req.includeMain && mainOption ? `<li><strong>Gekozen formule:</strong> ${mainOption.label}</li>` : ""}
  <li><strong>Locatie:</strong> ${req.streetName}, ${req.postalCode} ${req.city}${req.province ? `, ${req.province}` : ""}</li>
  <li><strong>Aantal gasten:</strong> ${req.guestCount}</li>
  <li><strong>Geschatte prijs:</strong> ${formatEuro(estimatedTotal)} (incl. opstartkost)</li>
</ul>
<p>Met vriendelijke groeten,<br>Mealz on Wheelz</p>
`.trim();
}

function buildInternalConflictHtml(
  req: BookingRequest,
  bookingId: string,
  conflicts: CalendarConflictEvent[],
  keptEvent: CalendarConflictEvent | null,
): string {
  return `
<h2>Booking registratie mislukt door dubbele reservatie</h2>
<p><strong>Booking ID:</strong> ${bookingId}</p>
<p>De aanvraag van <strong>${req.fullName}</strong> voor <strong>${req.eventDate}</strong> kon niet veilig geregistreerd worden omdat er gelijktijdig meerdere reserveringen bestonden.</p>
<hr>
<h3>Aanvraag</h3>
<ul>
  <li><strong>Naam:</strong> ${req.fullName}</li>
  <li><strong>E-mail:</strong> ${req.email}</li>
  <li><strong>Telefoon:</strong> ${req.phone}</li>
  <li><strong>Type event:</strong> ${req.eventType}</li>
  <li><strong>Datum:</strong> ${req.eventDate}</li>
</ul>
<h3>Behouden reservatie</h3>
<p>${keptEvent ? `${keptEvent.summary} (${keptEvent.calendarId})` : "Geen behouden reservatie gevonden tijdens de controle."}</p>
<h3>Conflicterende events</h3>
<ul>
  ${conflicts
    .map(
      (event) =>
        `<li><strong>${event.summary}</strong> — kalender: ${event.calendarId} — eventId: ${event.eventId}${event.bookingId ? ` — bookingId: ${event.bookingId}` : ""}</li>`,
    )
    .join("")}
</ul>
`.trim();
}

function buildCustomerFailureHtml(req: BookingRequest): string {
  return `
<h2>Uw reservatie-aanvraag kon niet worden geregistreerd</h2>
<p>Beste ${req.fullName},</p>
<p>Tijdens het vastleggen van uw aanvraag voor <strong>${req.eventDate}</strong> bleek deze datum net niet meer beschikbaar. Daarom hebben wij uw aanvraag niet geregistreerd.</p>
<p>Kies gerust een andere datum of neem rechtstreeks contact met ons op, dan bekijken we samen een alternatief.</p>
<p>Met vriendelijke groeten,<br>Mealz on Wheelz</p>
`.trim();
}

export async function sendInternalBookingEmail(
  req: BookingRequest,
  bookingId: string,
  estimatedTotal: number,
): Promise<void> {
  const { env, resend } = getResendClient();

  const { error } = await resend.emails.send({
    from: env.BOOKING_FROM_EMAIL,
    to: env.BOOKING_NOTIFICATION_TO,
    ...(env.BOOKING_NOTIFICATION_CC ? { cc: env.BOOKING_NOTIFICATION_CC } : {}),
    replyTo: req.email,
    subject: `Nieuwe booking aanvraag — ${req.fullName} — ${req.eventDate}`,
    html: buildInternalHtml(req, bookingId, estimatedTotal),
  });

  if (error) {
    throw new Error(`Resend internal email failed: ${error.message}`);
  }
}

export async function sendCustomerAcknowledgmentEmail(
  req: BookingRequest,
  bookingId: string,
  estimatedTotal: number,
): Promise<void> {
  const { env, resend } = getResendClient();

  const { error } = await resend.emails.send({
    from: env.BOOKING_FROM_EMAIL,
    to: req.email,
    ...(env.BOOKING_REPLY_TO ? { replyTo: env.BOOKING_REPLY_TO } : {}),
    subject: `Uw reservatie-aanvraag — ${req.eventDate}`,
    html: buildCustomerHtml(req, bookingId, estimatedTotal),
  });

  if (error) {
    throw new Error(`Resend customer email failed: ${error.message}`);
  }
}

export async function sendInternalBookingConflictEmail(
  req: BookingRequest,
  bookingId: string,
  conflicts: CalendarConflictEvent[],
  keptEvent: CalendarConflictEvent | null,
): Promise<void> {
  const { env, resend } = getResendClient();

  const { error } = await resend.emails.send({
    from: env.BOOKING_FROM_EMAIL,
    to: env.BOOKING_NOTIFICATION_TO,
    ...(env.BOOKING_NOTIFICATION_CC ? { cc: env.BOOKING_NOTIFICATION_CC } : {}),
    replyTo: req.email,
    subject: `Booking conflict — registratie mislukt — ${req.fullName} — ${req.eventDate}`,
    html: buildInternalConflictHtml(req, bookingId, conflicts, keptEvent),
  });

  if (error) {
    throw new Error(`Resend conflict email failed: ${error.message}`);
  }
}

export async function sendCustomerBookingFailureEmail(
  req: BookingRequest,
): Promise<void> {
  const { env, resend } = getResendClient();

  const { error } = await resend.emails.send({
    from: env.BOOKING_FROM_EMAIL,
    to: req.email,
    ...(env.BOOKING_REPLY_TO ? { replyTo: env.BOOKING_REPLY_TO } : {}),
    subject: `Uw reservatie-aanvraag kon niet worden geregistreerd — ${req.eventDate}`,
    html: buildCustomerFailureHtml(req),
  });

  if (error) {
    throw new Error(`Resend booking failure email failed: ${error.message}`);
  }
}
