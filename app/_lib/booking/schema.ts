import { z } from "zod";
import { EXPERIENCE_IDS, EVENT_TYPES, MIN_GUESTS, MIN_SUBMIT_MS } from "./constants";

// ─── Request schema ───────────────────────────────────────────────────────────

export const bookingRequestSchema = z.object({
  // Experience selection
  experienceId: z.enum(EXPERIENCE_IDS, {
    error: () => "Selecteer een geldige experience.",
  }),
  includeApero: z.boolean(),
  includeMain: z.boolean(),
  guestCount: z
    .number()
    .int()
    .min(MIN_GUESTS, { message: `Minimum ${MIN_GUESTS} gasten vereist.` })
    .max(5000, { message: "Meer dan 5000 gasten is niet toegestaan." }),

  // Contact details
  fullName: z
    .string()
    .min(2, { message: "Naam is verplicht." })
    .max(100, { message: "Naam is te lang." })
    .trim(),
  email: z
    .string()
    .email({ message: "Vul een geldig e-mailadres in." })
    .max(254)
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .min(5, { message: "Telefoonnummer is verplicht." })
    .max(30, { message: "Telefoonnummer is te lang." })
    .trim(),
  eventType: z.enum(EVENT_TYPES, {
    error: () => "Selecteer een geldig event-type.",
  }),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Datum is ongeldig." })
    .refine(
      (d) => new Date(d) > new Date(),
      { message: "De evenementdatum moet in de toekomst liggen." },
    ),
  // Location (Belgium)
  streetName: z
    .string()
    .min(2, { message: "Straatnaam is verplicht." })
    .max(120, { message: "Straatnaam is te lang." })
    .trim(),
  postalCode: z
    .string()
    .regex(/^\d{4}$/, { message: "Voer een geldige Belgische postcode in (4 cijfers)." }),
  city: z
    .string()
    .min(2, { message: "Gemeente is verplicht." })
    .max(80, { message: "Gemeente is te lang." })
    .trim(),
  province: z.string().max(60).trim().optional(),
  notes: z.string().max(2000, { message: "Opmerkingen zijn te lang." }).trim().optional(),

  // Anti-spam fields
  turnstileToken: z.string(), // may be empty when Turnstile is not configured
  website: z.string().max(0, { message: "Spam gedetecteerd." }), // honeypot – must be empty
  startedAt: z.number().int(),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;

// ─── Response types ───────────────────────────────────────────────────────────

export type BookingWarning = "customer_email_failed" | "calendar_failed";

export interface BookingSuccessResponse {
  ok: true;
  bookingId: string;
  message: string;
  warnings?: BookingWarning[];
}

export interface BookingErrorResponse {
  ok: false;
  code: "validation_error" | "spam_rejected" | "rate_limited" | "booking_delivery_failed";
  message: string;
  fieldErrors?: Record<string, string>;
}

export type BookingApiResponse = BookingSuccessResponse | BookingErrorResponse;

