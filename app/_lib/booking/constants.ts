// ─── Booking constants – single source of truth for UI and server ────────────

export const STARTUP_COST = 150;
export const MIN_GUESTS = 20;
export const DEFAULT_MAX_GUESTS = 5_000;
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

export interface ExperienceDefinition {
  id: ExperienceId;
  title: string;
  category: string;
  icon: string;
  cardSubtitle: string;
  priceBadges: string[];
  detailSubtitle: string;
  notice: string;
  basePrice: number;
  maxGuests: number;
  hasApero: boolean;
  aperoPrice: number;
  aperoDisplay: string;
  hasMain: boolean;
  mainLabel: string;
  mainPrice: number;
  mainPriceLabel: string;
  mainOptions?: readonly ExperienceMainOption[];
  tabs: readonly ExperienceTab[];
}

export interface ExperienceMainOption {
  id: string;
  label: string;
  price: number;
  priceLabel: string;
  description?: string;
}

export interface ExperienceMenuEntry {
  name?: string;
  price?: string;
  note?: string;
}

export interface ExperienceTab {
  label: string;
  entries: readonly ExperienceMenuEntry[];
}

export const BOOKING_EXPERIENCES: readonly ExperienceDefinition[] = [
  {
    id: "italian",
    title: "Italian Experience",
    category: "Apéro + pasta",
    icon: "🍝",
    cardSubtitle: "Apéro €15,95 · Hoofd v.a. €8",
    priceBadges: ["Apéro €15,95", "Pasta v.a. €8"],
    detailSubtitle: "Apéro €15,95 p.p. · Pasta v.a. €8 p.p. · Apart te boeken",
    notice:
      "Min. 20 personen · Max. 300 personen per boeking · Opstartkost €150 · Apéro en hoofdgerecht kunnen apart geboekt worden",
    basePrice: 0,
    maxGuests: 300,
    hasApero: true,
    aperoPrice: 15.95,
    aperoDisplay: "€15,95 p.p.",
    hasMain: true,
    mainLabel: "Hoofdgerecht inbegrepen",
    mainPrice: 8,
    mainPriceLabel: "v.a. €8 p.p.",
    tabs: [
      {
        label: "Apéro",
        entries: [
          { name: "Pastrami sandwich" },
          { name: "Arancini" },
          { name: "Antipasto" },
        ],
      },
      {
        label: "Pasta",
        entries: [
          { name: "Ragu bolognese", price: "S €8 · M €10 · L €12 · à volonté €18" },
          { name: "Quattro formaggi", price: "S €8 · M €10 · L €12 · à volonté €18" },
          { name: "Thai curry + kip", price: "S €8 · M €10 · L €12 · à volonté €18" },
          { name: "Scampi crema + zeevruchten", price: "S €8 · M €10 · L €12 · à volonté €18" },
        ],
      },
    ],
  },
  {
    id: "tex-mex",
    title: "Tex-Mex Experience",
    category: "Apéro + burgers",
    icon: "🌮",
    cardSubtitle: "Apéro €11,95 · Burgers v.a. €10",
    priceBadges: ["Apéro €11,95", "Burgers v.a. €10"],
    detailSubtitle: "Apéro €11,95 p.p. · Burgers v.a. €10 · Apart te boeken",
    notice:
      "Min. 20 personen · Max. 120 personen per boeking · Opstartkost €150 · Apéro en hoofdgerecht kunnen apart geboekt worden · Min. 10 stuks per burgertype",
    basePrice: 0,
    maxGuests: 120,
    hasApero: true,
    aperoPrice: 11.95,
    aperoDisplay: "€11,95 p.p.",
    hasMain: true,
    mainLabel: "Burgers inbegrepen",
    mainPrice: 10,
    mainPriceLabel: "v.a. €10 p.p.",
    tabs: [
      {
        label: "Apéro",
        entries: [
          { name: "Loaded nacho's" },
          { name: "Buffalo chicken wings" },
          { name: "Taco met pulled beef" },
        ],
      },
      {
        label: "Burgers",
        entries: [
          { name: "Juicy Lucy", price: "€10" },
          { name: "Black Pepper", price: "€12" },
          { name: "Truffle Burger", price: "€11" },
          { name: "Tropical Chicken", price: "€10" },
          { name: "Bubba Shrimp Burger", price: "€12" },
          { name: "Mexican Avocado Burger", price: "€10" },
        ],
      },
      {
        label: "Frietjes",
        entries: [
          { name: "Classic", price: "€3,95" },
          { name: "Sweet potato", price: "€3,95" },
          { name: "Truffle", price: "€4,50" },
        ],
      },
    ],
  },
  {
    id: "barbecue",
    title: "Barbecue Experience",
    category: "Apéro + BBQ-formules",
    icon: "🔥",
    cardSubtitle: "Apéro €11,95 · Formules v.a. €22,95",
    priceBadges: ["Apéro €11,95", "Classic v.a. €22,95", "Deluxe €35"],
    detailSubtitle: "Apéro €11,95 p.p. · BBQ-formules vanaf €22,95 p.p. · Apart te boeken",
    notice:
      "Min. 20 personen · Max. 80 personen per boeking · Opstartkost €150 · Apéro en hoofdgerecht kunnen apart geboekt worden",
    basePrice: 0,
    maxGuests: 80,
    hasApero: true,
    aperoPrice: 11.95,
    aperoDisplay: "€11,95 p.p.",
    hasMain: true,
    mainLabel: "Formules inbegrepen",
    mainPrice: 22.95,
    mainPriceLabel: "v.a. €22,95 p.p.",
    mainOptions: [
      {
        id: "classic-3",
        label: "Classic · 3 stukken vlees",
        price: 22.95,
        priceLabel: "€22,95 p.p.",
        description: "Groentenbuffet, stokbrood met boter en diverse sauzen inbegrepen.",
      },
      {
        id: "classic-4",
        label: "Classic · 4 stukken vlees",
        price: 25.95,
        priceLabel: "€25,95 p.p.",
        description: "Classic buffet met een extra stuk vlees per persoon.",
      },
      {
        id: "classic-fish",
        label: "Classic · Papillot met zalm & kabeljauw + scampibrochette",
        price: 27.95,
        priceLabel: "€27,95 p.p.",
        description: "Classic buffet aangevuld met vispapillot en scampibrochette.",
      },
      {
        id: "deluxe",
        label: "Deluxe",
        price: 35,
        priceLabel: "€35 p.p.",
        description: "Uitgebreid saladebuffet met scampibrochette, varkenshaassaté en gemarineerde kipfilet.",
      },
    ],
    tabs: [
      {
        label: "Apéro",
        entries: [
          { name: "Gegrilde mosseltjes met spek" },
          { name: "Witte pens / bloedworst met uienconfijt" },
          { name: "Bao bun met pulled chicken" },
        ],
      },
      {
        label: "Classic",
        entries: [
          { name: "Groentenbuffet", price: "Sla, tomaat, komkommer, wortel, pastasalade, aardappelsalade, witloof en boontjes" },
          { name: "Versgebakken stokbrood met boter" },
          { name: "Sauzen", price: "Mayo, cocktail, ketchup (curry & normaal) en andalouse" },
          { name: "3 stukken vlees", price: "€22,95 p.p." },
          { name: "4 stukken vlees", price: "€25,95 p.p." },
          { name: "Papillot met zalm & kabeljauw + scampibrochette", price: "€27,95 p.p." },
        ],
      },
      {
        label: "Deluxe",
        entries: [
          { name: "Libanese tabouleh" },
          { name: "Griekse salade met orzo" },
          { name: "Gegrilde groentensalade met pijnboompitten en basilicumdressing" },
          { name: "Gegrilde pêche met burrata" },
          { name: "Coleslaw" },
          { name: "Italiaanse pastasalade met pesto" },
          { name: "Assortiment rauwe groentjes" },
          { name: "Scampibrochette" },
          { name: "Varkenshaassaté" },
          { name: "Gemarineerde kipfilet" },
          { name: "Versgebakken stokbrood met boter + diverse sauzen", price: "€35 p.p." },
        ],
      },
    ],
  },
  {
    id: "sweet",
    title: "Sweet Experience",
    category: "Dessertbuffet",
    icon: "🍮",
    cardSubtitle: "€10,95 p.p.",
    priceBadges: ["€10,95 p.p."],
    detailSubtitle: "€10,95 p.p. · Dessertbuffet · Apart te boeken",
    notice:
      "Min. 20 personen · Opstartkost €150 · Apart te boeken als dessertbuffet",
    basePrice: 10.95,
    maxGuests: DEFAULT_MAX_GUESTS,
    hasApero: false,
    aperoPrice: 0,
    aperoDisplay: "",
    hasMain: false,
    mainLabel: "",
    mainPrice: 0,
    mainPriceLabel: "",
    tabs: [
      {
        label: "Menu",
        entries: [
          { name: "Assortiment mousses (choco, mango, framboos)" },
          { name: "Petit fours" },
          { name: "Rijstpap" },
          { name: "Panna cotta" },
          { name: "Frangipane" },
          { name: "Macarons" },
          { name: "Vers fruit" },
        ],
      },
    ],
  },
] as const;

export function getExperience(id: ExperienceId): ExperienceDefinition {
  const exp = BOOKING_EXPERIENCES.find((e) => e.id === id);
  if (!exp) throw new Error(`Unknown experience id: ${id}`);
  return exp;
}

export function getExperienceMainOption(
  experienceId: ExperienceId,
  mainOptionId: string | null | undefined,
): ExperienceMainOption | null {
  const experience = getExperience(experienceId);
  const options = experience.mainOptions ?? [];

  if (options.length === 0) return null;
  if (mainOptionId) {
    const match = options.find((option) => option.id === mainOptionId);
    if (match) return match;
  }

  return options[0] ?? null;
}

export function getExperienceMaxGuests(experienceId: ExperienceId): number {
  return getExperience(experienceId).maxGuests || DEFAULT_MAX_GUESTS;
}

