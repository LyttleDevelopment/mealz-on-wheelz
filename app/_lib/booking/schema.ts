import { z } from "zod";
import { getExperience, getExperienceMaxGuests } from "./constants";
import { eventTypes, expirienceIds, minGuests } from "@data/constants";

// ─── Request schema ───────────────────────────────────────────────────────────

export const bookingRequestSchema = z
  .object({
    // Experience selection
    experienceId: z.enum(expirienceIds, {
      error: () => "Selecteer een geldige experience.",
    }),
    includeApero: z.boolean(),
    includeMain: z.boolean(),
    mainOptionId: z.string().trim().min(1).optional().nullable(),
    guestCount: z
      .number()
      .int()
      .min(minGuests, { message: `Minimum ${minGuests} gasten vereist.` })
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
    eventType: z.enum(eventTypes, {
      error: () => "Selecteer een geldig event-type.",
    }),
    eventDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Datum is ongeldig." })
      .refine((d) => new Date(d) > new Date(), {
        message: "De evenementdatum moet in de toekomst liggen.",
      }),
    eventTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
      message: "Voer een geldig tijdstip in.",
    }),
    // Location (Belgium)
    streetName: z
      .string()
      .min(2, { message: "Straatnaam is verplicht." })
      .max(120, { message: "Straatnaam is te lang." })
      .trim(),
    postalCode: z.string().regex(/^\d{4}$/, {
      message: "Voer een geldige Belgische postcode in (4 cijfers).",
    }),
    city: z
      .string()
      .min(2, { message: "Gemeente is verplicht." })
      .max(80, { message: "Gemeente is te lang." })
      .trim(),
    province: z.string().max(60).trim().optional(),
    notes: z
      .string()
      .max(2000, { message: "Opmerkingen zijn te lang." })
      .trim()
      .optional(),

    // Anti-spam fields
    turnstileToken: z.string(), // may be empty when Turnstile is not configured
    website: z.string().max(0, { message: "Spam gedetecteerd." }), // honeypot – must be empty
    startedAt: z.number().int(),
  })
  .superRefine((value, ctx) => {
    const experience = getExperience(value.experienceId);
    const maxGuests = getExperienceMaxGuests(value.experienceId);

    if (!experience.hasApero && value.includeApero) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["includeApero"],
        message: "Deze experience heeft geen apéro-optie.",
      });
    }

    if (!experience.hasMain && value.includeMain) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["includeMain"],
        message: "Deze experience heeft geen hoofdgerecht-optie.",
      });
    }

    if (value.guestCount > maxGuests) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["guestCount"],
        message: `Maximum ${maxGuests} gasten voor ${experience.title}.`,
      });
    }

    const mainOptions = experience.mainOptions ?? [];
    if (value.includeMain && mainOptions.length > 0) {
      if (!value.mainOptionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mainOptionId"],
          message: "Kies een formule voor het hoofdgerecht.",
        });
      } else if (
        !mainOptions.some((option) => option.id === value.mainOptionId)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mainOptionId"],
          message: "Kies een geldige formule.",
        });
      }
    }
  });

export type BookingRequest = z.infer<typeof bookingRequestSchema>;

// ─── Response types ───────────────────────────────────────────────────────────

export type BookingWarning = "customer_email_failed";

export interface BookingSuccessResponse {
  ok: true;
  bookingId: string;
  message: string;
  warnings?: BookingWarning[];
}

export interface BookingErrorResponse {
  ok: false;
  code:
    | "validation_error"
    | "spam_rejected"
    | "rate_limited"
    | "booking_delivery_failed"
    | "date_unavailable"
    | "availability_check_failed";
  message: string;
  fieldErrors?: Record<string, string>;
}

export type BookingApiResponse = BookingSuccessResponse | BookingErrorResponse;

export interface BookingAvailabilitySuccessResponse {
  ok: true;
  unavailableDates: string[];
}

export interface BookingAvailabilityErrorResponse {
  ok: false;
  code: "availability_check_failed" | "validation_error";
  message: string;
}

export type BookingAvailabilityResponse =
  | BookingAvailabilitySuccessResponse
  | BookingAvailabilityErrorResponse;
