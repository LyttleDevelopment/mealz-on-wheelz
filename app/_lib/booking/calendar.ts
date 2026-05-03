import { calendar_v3, google } from "googleapis";
import { getBookingEnv } from "./env";
import { formatEuro } from "./pricing";
import { BookingRequest } from "./schema";
import { getExperience, getExperienceMainOption } from "./constants";

export interface CalendarConflictEvent {
  calendarId: string;
  eventId: string;
  summary: string;
  createdAt: string | null;
  updatedAt: string | null;
  bookingId: string | null;
}

export interface BookingAvailabilityResult {
  available: boolean;
  conflicts: CalendarConflictEvent[];
}

export type CalendarReservationResult =
  | {
      ok: true;
      eventId: string;
    }
  | {
      ok: false;
      reason: "date_unavailable" | "conflict_after_insert";
      conflicts: CalendarConflictEvent[];
      keptEvent: CalendarConflictEvent | null;
    };

function parseDateParts(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return { year, month, day };
}

function formatDateString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateString: string, days: number): string {
  const { year, month, day } = parseDateParts(dateString);
  const next = new Date(Date.UTC(year, month - 1, day));
  next.setUTCDate(next.getUTCDate() + days);
  return formatDateString(next);
}

function buildTimeRange(startDate: string, endDateExclusive: string) {
  const start = parseDateParts(startDate);
  const end = parseDateParts(endDateExclusive);

  return {
    timeMin: new Date(Date.UTC(start.year, start.month - 1, start.day)).toISOString(),
    timeMax: new Date(Date.UTC(end.year, end.month - 1, end.day)).toISOString(),
  };
}

function getBlockingCalendarIds(): string[] {
  const env = getBookingEnv();

  return env.GOOGLE_RERSERVED_CALENDAR_ID ? [env.GOOGLE_RERSERVED_CALENDAR_ID] : [];
}

function getCalendarClient() {
  const env = getBookingEnv();

  const auth = new google.auth.JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  return google.calendar({ version: "v3", auth });
}

async function listEvents(
  calendar: calendar_v3.Calendar,
  calendarId: string,
  timeMin: string,
  timeMax: string,
): Promise<calendar_v3.Schema$Event[]> {
  const events: calendar_v3.Schema$Event[] = [];
  let pageToken: string | undefined;

  do {
    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
      showDeleted: false,
      maxResults: 2500,
      pageToken,
    });

    events.push(...(response.data.items ?? []));
    pageToken = response.data.nextPageToken ?? undefined;
  } while (pageToken);

  return events;
}

function toConflictEvent(
  calendarId: string,
  event: calendar_v3.Schema$Event,
): CalendarConflictEvent | null {
  if (!event.id) return null;

  return {
    calendarId,
    eventId: event.id,
    summary: event.summary ?? "Gereserveerde dag",
    createdAt: event.created ?? null,
    updatedAt: event.updated ?? null,
    bookingId: event.extendedProperties?.private?.bookingId ?? null,
  };
}

function compareConflicts(a: CalendarConflictEvent, b: CalendarConflictEvent) {
  const aStamp = a.createdAt ?? a.updatedAt ?? "";
  const bStamp = b.createdAt ?? b.updatedAt ?? "";

  if (aStamp !== bStamp) {
    return aStamp.localeCompare(bStamp);
  }

  return a.eventId.localeCompare(b.eventId);
}

function getEventDateBounds(event: calendar_v3.Schema$Event) {
  // All-day event — end.date is exclusive by Google Calendar convention
  if (event.start?.date) {
    return {
      startDate: event.start.date,
      endDateExclusive: event.end?.date ?? addDays(event.start.date, 1),
    };
  }

  // Timed event — block every calendar date the event falls on
  const startDate = event.start?.dateTime?.slice(0, 10) ?? null;
  if (!startDate) return null;

  let endDateStr = startDate;

  if (event.end?.dateTime) {
    const end = new Date(event.end.dateTime);
    // Move the end time back by 10 hours for logical day grouping.
    // If an event ends at 02:00 AM or 00:00 midnight, it belongs to the previous calendar day.
    end.setUTCHours(end.getUTCHours() - 10);

    const y = end.getUTCFullYear();
    const m = String(end.getUTCMonth() + 1).padStart(2, "0");
    const day = String(end.getUTCDate()).padStart(2, "0");
    endDateStr = `${y}-${m}-${day}`;

    // Safety check: if our shift pushes the end date before the start date (e.g. 1-hour event in the morning),
    // we just fallback to startDate so we always block at least the start day.
    if (endDateStr < startDate) {
      endDateStr = startDate;
    }
  }

  return {
    startDate,
    endDateExclusive: addDays(endDateStr, 1),
  };
}

function expandEventDates(
  event: calendar_v3.Schema$Event,
  rangeStart: string,
  rangeEndInclusive: string,
): string[] {
  const bounds = getEventDateBounds(event);
  if (!bounds) return [];

  const dates: string[] = [];
  let cursor = bounds.startDate < rangeStart ? rangeStart : bounds.startDate;

  while (cursor < bounds.endDateExclusive && cursor <= rangeEndInclusive) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return dates;
}

function buildDescription(req: BookingRequest, bookingId: string, estimatedTotal: number): string {
  const exp = getExperience(req.experienceId);
  const mainOption = getExperienceMainOption(req.experienceId, req.mainOptionId);
  const lines = [
    `Booking ID: ${bookingId}`,
    "Bron: website reservatie-aanvraag",
    `Formule: ${exp.title}`,
    exp.hasApero ? `Apéro: ${req.includeApero ? "Ja" : "Nee"}` : null,
    exp.hasMain ? `${exp.mainLabel}: ${req.includeMain ? "Ja" : "Nee"}` : null,
    req.includeMain && mainOption ? `Gekozen formule: ${mainOption.label}` : null,
    `Aantal gasten: ${req.guestCount}`,
    `Geschatte prijs: ${formatEuro(estimatedTotal)}`,
    "",
    `Naam: ${req.fullName}`,
    `E-mail: ${req.email}`,
    `Telefoon: ${req.phone}`,
    `Type event: ${req.eventType}`,
    `Locatie: ${req.streetName}, ${req.postalCode} ${req.city}${req.province ? `, ${req.province}` : ""}`,
    `Tijdstip: ${req.eventTime}`,
    req.notes ? `Opmerkingen: ${req.notes}` : null,
  ];
  return lines.filter(Boolean).join("\n");
}

export async function checkBookingDateAvailability(
  eventDate: string,
): Promise<BookingAvailabilityResult> {
  const calendar = getCalendarClient();
  const { timeMin, timeMax } = buildTimeRange(eventDate, addDays(eventDate, 1));

  const conflicts = (
    await Promise.all(
      getBlockingCalendarIds().map(async (calendarId) => {
        const events = await listEvents(calendar, calendarId, timeMin, timeMax);
        return events
          .map((event) => toConflictEvent(calendarId, event))
          .filter((event): event is CalendarConflictEvent => event !== null);
      }),
    )
  )
    .flat()
    .sort(compareConflicts);

  return {
    available: conflicts.length === 0,
    conflicts,
  };
}

export async function listUnavailableBookingDates(
  startDate: string,
  endDateInclusive: string,
): Promise<string[]> {
  const calendar = getCalendarClient();
  const { timeMin, timeMax } = buildTimeRange(startDate, addDays(endDateInclusive, 1));
  const unavailableDates = new Set<string>();

  const eventsPerCalendar = await Promise.all(
    getBlockingCalendarIds().map((calendarId) =>
      listEvents(calendar, calendarId, timeMin, timeMax),
    ),
  );

  for (const events of eventsPerCalendar) {
    for (const event of events) {
      for (const date of expandEventDates(event, startDate, endDateInclusive)) {
        unavailableDates.add(date);
      }
    }
  }

  return Array.from(unavailableDates).sort((a, b) => a.localeCompare(b));
}

async function deleteCalendarEvent(calendarId: string, eventId: string) {
  const calendar = getCalendarClient();
  await calendar.events.delete({ calendarId, eventId });
}

export async function removeBookedCalendarEvent(eventId: string) {
  const env = getBookingEnv();
  await deleteCalendarEvent(env.GOOGLE_BOOKED_CALENDAR_ID, eventId);
}

export async function reserveBookingDate(
  req: BookingRequest,
  bookingId: string,
  estimatedTotal: number,
): Promise<CalendarReservationResult> {
  const env = getBookingEnv();

  const availability = await checkBookingDateAvailability(req.eventDate);
  if (!availability.available) {
    return {
      ok: false,
      reason: "date_unavailable",
      conflicts: availability.conflicts,
      keptEvent: availability.conflicts[0] ?? null,
    };
  }

  const calendar = getCalendarClient();

  const res = await calendar.events.insert({
    calendarId: env.GOOGLE_BOOKED_CALENDAR_ID,
    requestBody: {
      summary: `Booking aanvraag — ${req.fullName} — ${req.eventType}`,
      description: buildDescription(req, bookingId, estimatedTotal),
      start: { date: req.eventDate },
      end: { date: addDays(req.eventDate, 1) },
      transparency: "opaque",
      status: "tentative",
      extendedProperties: {
        private: {
          bookingId,
          bookingStatus: "reserved_request",
          bookingSource: "website",
        },
      },
    },
  });

  const eventId = res.data.id;
  if (!eventId) {
    throw new Error("Google Calendar did not return an event id.");
  }

  const conflictsAfterInsert = (await checkBookingDateAvailability(req.eventDate)).conflicts;
  if (conflictsAfterInsert.length > 0) {
    await deleteCalendarEvent(env.GOOGLE_BOOKED_CALENDAR_ID, eventId);

    return {
      ok: false,
      reason: "date_unavailable",
      conflicts: conflictsAfterInsert,
      keptEvent: conflictsAfterInsert[0] ?? null,
    };
  }

  return { ok: true, eventId };
}

