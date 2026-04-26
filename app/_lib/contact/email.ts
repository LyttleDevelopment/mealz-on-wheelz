import { Resend } from "resend";
import { getBookingEnv } from "../booking/env";
import { ContactRequest } from "./schema";

function buildInternalHtml(req: ContactRequest): string {
  return `
<h2>Nieuw contactbericht</h2>
<hr>
<ul>
  <li><strong>Naam:</strong> ${req.naam}</li>
  <li><strong>E-mail:</strong> ${req.email}</li>
  ${req.telefoon ? `<li><strong>Telefoon:</strong> ${req.telefoon}</li>` : ""}
  <li><strong>Bericht:</strong><br><pre style="white-space:pre-wrap">${req.bericht}</pre></li>
</ul>
`.trim();
}

function buildCustomerHtml(req: ContactRequest): string {
  return `
<h2>Bedankt voor uw bericht, ${req.naam}!</h2>
<p>Wij hebben uw bericht ontvangen en nemen zo snel mogelijk contact met u op.</p>
<hr>
<h3>Uw bericht</h3>
<pre style="white-space:pre-wrap">${req.bericht}</pre>
<p>Met vriendelijke groeten,<br>Mealz on Wheelz</p>
`.trim();
}

export async function sendInternalContactEmail(req: ContactRequest): Promise<void> {
  const env = getBookingEnv();
  const resend = new Resend(env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: env.BOOKING_FROM_EMAIL,
    to: env.BOOKING_NOTIFICATION_TO,
    ...(env.BOOKING_NOTIFICATION_CC ? { cc: env.BOOKING_NOTIFICATION_CC } : {}),
    replyTo: req.email,
    subject: `Nieuw contactbericht — ${req.naam}`,
    html: buildInternalHtml(req),
  });

  if (error) {
    throw new Error(`Resend internal contact email failed: ${error.message}`);
  }
}

export async function sendCustomerContactAcknowledgment(req: ContactRequest): Promise<void> {
  const env = getBookingEnv();
  const resend = new Resend(env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: env.BOOKING_FROM_EMAIL,
    to: req.email,
    ...(env.BOOKING_REPLY_TO ? { replyTo: env.BOOKING_REPLY_TO } : {}),
    subject: `Wij hebben uw bericht ontvangen — Mealz on Wheelz`,
    html: buildCustomerHtml(req),
  });

  if (error) {
    throw new Error(`Resend customer contact email failed: ${error.message}`);
  }
}

