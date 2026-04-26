import { google } from "googleapis";
import { getBookingEnv } from "./env";
import { formatEuro } from "./pricing";
import { BookingRequest } from "./schema";
import { getExperience } from "./constants";

function buildDescription(req: BookingRequest, bookingId: string, estimatedTotal: number): string {
  const exp = getExperience(req.experienceId);
  const lines = [
    `Booking ID: ${bookingId}`,
    `Formule: ${exp.title}`,
    exp.hasApero ? `Apéro: ${req.includeApero ? "Ja" : "Nee"}` : null,
    exp.hasMain ? `${exp.mainLabel}: ${req.includeMain ? "Ja" : "Nee"}` : null,
    `Aantal gasten: ${req.guestCount}`,
    `Geschatte prijs: ${formatEuro(estimatedTotal)}`,
    "",
    `Naam: ${req.fullName}`,
    `E-mail: ${req.email}`,
    `Telefoon: ${req.phone}`,
    `Type event: ${req.eventType}`,
    `Locatie: ${req.streetName} ${req.houseNumber}, ${req.postalCode} ${req.city}${req.province ? `, ${req.province}` : ""}`,
    req.notes ? `Opmerkingen: ${req.notes}` : null,
  ];
  return lines.filter(Boolean).join("\n");
}

export async function createCalendarEvent(
  req: BookingRequest,
  bookingId: string,
  estimatedTotal: number,
): Promise<string | null> {
  const env = getBookingEnv();

  const auth = new google.auth.JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.events.insert({
    calendarId: env.GOOGLE_CALENDAR_ID,
    requestBody: {
      summary: `Booking aanvraag — ${req.fullName} — ${req.eventType}`,
      description: buildDescription(req, bookingId, estimatedTotal),
      start: { date: req.eventDate },
      end: { date: req.eventDate },
      transparency: "transparent",
      status: "tentative",
      extendedProperties: {
        private: { bookingId },
      },
    },
  });

  return res.data.id ?? null;
}

