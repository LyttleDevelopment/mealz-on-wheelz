import {
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Phone,
  Store,
  Truck,
} from "lucide-react";
import type { ContactInfo, NavigationItem, Service } from "./types";
import { ExperienceDefinition } from "@/_lib/booking/constants";

export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Over ons", href: "#over-ons" },
  { label: "Menu", href: "#menu" },
  { label: "Diensten", href: "#diensten" },
  { label: "Galerij", href: "#galerij" },
  { label: "Reservatie", href: "#reserveren" },
];

export const footerNavigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Over ons", href: "#over-ons" },
  { label: "Menu", href: "#menu" },
  { label: "Diensten", href: "#diensten" },
  { label: "Algemene voorwaarden", href: "/algemene-voorwaarden" },
];

export const services: Service[] = [
  {
    title: "Food truck service",
    description:
      "Je vindt ons op lokale evenementen, festivals en buurtfeesten, waar we verse, heerlijke maaltijden serveren.",
    icon: Truck,
  },
  {
    title: "Event catering",
    description:
      "Full-service catering voor bruiloften, bedrijfsevenementen en privéfeesten.",
    icon: CalendarDays,
  },
  {
    title: "Food bar concept",
    description:
      "Aanpasbare bar naar wens, kan gebruikt worden als charcuterie/chocolade bar (of andere).",
    icon: Store,
  },
];

export const contactInfo: ContactInfo[] = [
  {
    icon: MapPin,
    label: "Plaats",
    value: "Gent & heel Oost-Vlaanderen",
  },
  {
    icon: Phone,
    label: "Telefoonnummer",
    value: "+32 (0)499/41.03.75",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "mealzonwheelz-foodtruck@outlook.com",
  },
  {
    icon: Clock,
    label: "Contacttijden",
    value: "24/7 bereikbaar, snelle reactie binnen 24u",
  },
];

export const startupCost = 150;
export const minGuests = 20;
export const defaultMaxGuests = 300;
export const minSubmitTime = 4_000; // reject submissions faster than this

export const expirienceIds = [
  "italian",
  "tex-mex",
  "barbecue",
  "sweet",
] as const;

// Gallery / carousel images used in the site gallery component.
export const galleryImages: { src: string; alt: string }[] = Array.from({ length: 19 }, (_, i) => ({
  src: `/media/food-${i + 1}.webp`,
  alt: `Galerij afbeelding ${i + 1}`,
}));

export type ExperienceId = (typeof expirienceIds)[number];

export const eventTypes = [
  "Bedrijfsevenement",
  "Privéfeest",
  "Huwelijk",
  "Festival",
  "Andere",
] as const;

export const experiences: readonly ExperienceDefinition[] = [
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
          {
            name: "Ragu bolognese",
            price: "S €8 · M €10 · L €12 · à volonté €18",
          },
          {
            name: "Quattro formaggi",
            price: "S €8 · M €10 · L €12 · à volonté €18",
          },
          {
            name: "Thai curry + kip",
            price: "S €8 · M €10 · L €12 · à volonté €18",
          },
          {
            name: "Scampi crema + zeevruchten",
            price: "S €8 · M €10 · L €12 · à volonté €18",
          },
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
    detailSubtitle:
      "Apéro €11,95 p.p. · BBQ-formules vanaf €22,95 p.p. · Apart te boeken",
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
        description:
          "Groentenbuffet, stokbrood met boter en diverse sauzen inbegrepen.",
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
        description:
          "Classic buffet aangevuld met vispapillot en scampibrochette.",
      },
      {
        id: "deluxe",
        label: "Deluxe",
        price: 35,
        priceLabel: "€35 p.p.",
        description:
          "Uitgebreid saladebuffet met scampibrochette, varkenshaassaté en gemarineerde kipfilet.",
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
        sections: [
          {
            title: "Groentenbuffet",
            entries: [
              { name: "Sla" },
              { name: "Tomaat" },
              { name: "Komkommer" },
              { name: "Wortel" },
              { name: "Pastasalade" },
              { name: "Aardappelsalade" },
              { name: "Witloof" },
              { name: "Boontjes" },
            ],
          },
          {
            title: "Brood",
            entries: [{ name: "Versgebakken stokbrood met boter" }],
          },
          {
            title: "Sauzen",
            entries: [
              { name: "Mayo" },
              { name: "Cocktail" },
              { name: "Ketchup (curry & normaal)" },
              { name: "Andalouse" },
            ],
          },
          {
            title: "Formules",
            entries: [
              { name: "3 stukken vlees", price: "€22,95 p.p." },
              { name: "4 stukken vlees", price: "€25,95 p.p." },
              {
                name: "Papillot met zalm & kabeljauw + scampibrochette",
                price: "€27,95 p.p.",
              },
            ],
          },
        ],
      },
      {
        label: "Deluxe",
        sections: [
          {
            title: "Salades",
            entries: [
              { name: "Libanese tabouleh" },
              { name: "Griekse salade met orzo" },
              {
                name: "Gegrilde groentensalade met pijnboompitten en basilicumdressing",
              },
              { name: "Gegrilde pêche met burrata" },
              { name: "Coleslaw" },
              { name: "Italiaanse pastasalade met pesto" },
              { name: "Assortiment rauwe groentjes" },
            ],
          },
          {
            title: "Vlees/vis",
            entries: [
              { name: "Scampibrochette" },
              { name: "Varkenshaassaté" },
              { name: "Gemarineerde kipfilet" },
            ],
          },
          {
            title: "Brood",
            entries: [{ name: "Versgebakken stokbrood met boter" }],
          },
          {
            title: "Sauzen",
            entries: [
              { name: "Mayo" },
              { name: "Cocktail" },
              { name: "Ketchup (curry & normaal)" },
              { name: "Andalouse" },
            ],
          },
          {
            title: "Prijs",
            entries: [{ name: "Deluxe formule", price: "€35 p.p." }],
          },
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
    maxGuests: defaultMaxGuests,
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
