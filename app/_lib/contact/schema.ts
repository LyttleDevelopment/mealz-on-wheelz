import { z } from "zod";

export const contactRequestSchema = z.object({
  naam: z.string().min(1, "Naam is verplicht.").max(200),
  email: z.string().email("Vul een geldig e-mailadres in.").max(300),
  telefoon: z.string().min(7).max(25).optional().or(z.literal("")),
  bericht: z.string().min(5, "Bericht is verplicht.").max(5000),
  // Anti-spam
  turnstileToken: z.string(),
  website: z.string().max(0).default(""), // honeypot
  startedAt: z.number().int(),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;

export type ContactApiResponse =
  | { ok: true; message: string }
  | { ok: false; code: string; message: string; fieldErrors?: Record<string, string> };

