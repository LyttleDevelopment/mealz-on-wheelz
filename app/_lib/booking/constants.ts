// ─── Booking constants – single source of truth for UI and server ────────────

export const STARTUP_COST = 150;
export const MIN_GUESTS = 20;
export const MIN_SUBMIT_MS = 4_000; // reject submissions faster than this

export const EXPERIENCE_IDS = ["italian", "tex-mex", "barbecue", "sweet"] as const;
export type ExperienceId = (typeof EXPERIENCE_IDS)[number];

export const EVENT_TYPES = [
  "Bedrijfsevenement",
  "Privéfeest",
  "Huwelijk",
  "Festival",
  "Andere",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export interface ExperienceDefinition {
  id: ExperienceId;
  title: string;
  cardSubtitle: string;
  basePrice: number;
  hasApero: boolean;
  aperoPrice: number;
  aperoDisplay: string;
  hasMain: boolean;
  mainLabel: string;
  mainPrice: number;
  mainPriceLabel: string;
}

export const BOOKING_EXPERIENCES: readonly ExperienceDefinition[] = [
  {
    id: "italian",
    title: "Italian Experience",
    cardSubtitle: "Apéro €15,95 · Hoofd v.a. €8",
    basePrice: 0,
    hasApero: true,
    aperoPrice: 15.95,
    aperoDisplay: "€15,95 p.p.",
    hasMain: true,
    mainLabel: "Hoofdgerecht inbegrepen",
    mainPrice: 8,
    mainPriceLabel: "v.a. €8 p.p.",
  },
  {
    id: "tex-mex",
    title: "Tex-Mex Experience",
    cardSubtitle: "Apéro €11,95 · Burgers v.a. €10",
    basePrice: 0,
    hasApero: true,
    aperoPrice: 11.95,
    aperoDisplay: "€11,95 p.p.",
    hasMain: true,
    mainLabel: "Burgers inbegrepen",
    mainPrice: 10,
    mainPriceLabel: "v.a. €10 p.p.",
  },
  {
    id: "barbecue",
    title: "Barbecue Experience",
    cardSubtitle: "Apéro €11,95 · Formules v.a. €22,95",
    basePrice: 0,
    hasApero: true,
    aperoPrice: 11.95,
    aperoDisplay: "€11,95 p.p.",
    hasMain: true,
    mainLabel: "Formules inbegrepen",
    mainPrice: 22.95,
    mainPriceLabel: "v.a. €22,95 p.p.",
  },
  {
    id: "sweet",
    title: "Sweet Experience",
    cardSubtitle: "€10,95 p.p.",
    basePrice: 10.95,
    hasApero: false,
    aperoPrice: 0,
    aperoDisplay: "",
    hasMain: false,
    mainLabel: "",
    mainPrice: 0,
    mainPriceLabel: "",
  },
] as const;

export function getExperience(id: ExperienceId): ExperienceDefinition {
  const exp = BOOKING_EXPERIENCES.find((e) => e.id === id);
  if (!exp) throw new Error(`Unknown experience id: ${id}`);
  return exp;
}

