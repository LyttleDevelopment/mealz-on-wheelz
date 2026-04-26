import { Resend } from "resend";
import { getBookingEnv } from "./env";
import { formatEuro } from "./pricing";
import { BookingRequest } from "./schema";
import { getExperience } from "./constants";

function buildInternalHtml(req: BookingRequest, bookingId: string, estimatedTotal: number): string {
  const exp = getExperience(req.experienceId);
  return `
<h2>Nieuwe booking aanvraag</h2>
<p><strong>Booking ID:</strong> ${bookingId}</p>
<hr>
<h3>Experience</h3>
<ul>
  <li><strong>Formule:</strong> ${exp.title}</li>
  ${exp.hasApero ? `<li><strong>Apéro:</strong> ${req.includeApero ? "Ja" : "Nee"}</li>` : ""}
  ${exp.hasMain ? `<li><strong>${exp.mainLabel}:</strong> ${req.includeMain ? "Ja" : "Nee"}</li>` : ""}
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
  <li><strong>Locatie:</strong> ${req.streetName} ${req.houseNumber}, ${req.postalCode} ${req.city}${req.province ? `, ${req.province}` : ""}</li>
  ${req.notes ? `<li><strong>Opmerkingen:</strong> ${req.notes}</li>` : ""}
</ul>
`.trim();
}

function buildCustomerHtml(req: BookingRequest, bookingId: string, estimatedTotal: number): string {
  const exp = getExperience(req.experienceId);
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
  <li><strong>Locatie:</strong> ${req.streetName} ${req.houseNumber}, ${req.postalCode} ${req.city}${req.province ? `, ${req.province}` : ""}</li>
  <li><strong>Aantal gasten:</strong> ${req.guestCount}</li>
  <li><strong>Geschatte prijs:</strong> ${formatEuro(estimatedTotal)} (incl. opstartkost)</li>
</ul>
<p>Met vriendelijke groeten,<br>Mealz on Wheelz</p>
`.trim();
}

export async function sendInternalBookingEmail(
  req: BookingRequest,
  bookingId: string,
  estimatedTotal: number,
): Promise<void> {
  const env = getBookingEnv();
  const resend = new Resend(env.RESEND_API_KEY);

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
  const env = getBookingEnv();
  const resend = new Resend(env.RESEND_API_KEY);

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

