import {
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Phone,
  Store,
  Truck,
} from "lucide-react";
import type { ContactInfo, Experience, GalleryTile, NavigationItem, Service } from "./types";

export const navigation: NavigationItem[] = [
  { label: "Home", href: "#home" },
  { label: "Over ons", href: "#over-ons" },
  { label: "Menu", href: "#menu" },
  { label: "Diensten", href: "#diensten" },
  { label: "Galerij", href: "#galerij" },
  { label: "Reservatie", href: "#reserveren" },
];

export const footerNavigation: NavigationItem[] = [
  { label: "Home", href: "#home" },
  { label: "Over ons", href: "#over-ons" },
  { label: "Menu", href: "#menu" },
  { label: "Diensten", href: "#diensten" },
  { label: "Algemene voorwaarden", href: "#algemene-voorwaarden" },
];

export const experiences: Experience[] = [
  {
    id: "italian",
    title: "Italian Experience",
    category: "Apéro + hoofdgerecht",
    priceBadges: ["Apéro €15,95", "Hoofd v.a. €8"],
    detailSubtitle: "Apéro €15,95 p.p. · Hoofdgerecht v.a. €8 p.p. · Apart te boeken",
    notice:
      "Min. 20 personen · Opstartkost €150 · Apéro en hoofdgerecht kunnen apart geboekt worden",
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
        label: "Hoofdgerecht",
        entries: [
          { name: "Ragu bolognese", price: "S €8 · M €10 · L €12 · à volonté €18" },
          { name: "Quattro formaggi", price: "S €8 · M €10 · L €12 · à volonté €18" },
          { name: "Thai curry + kip", price: "S €8 · M €10 · L €12 · à volonté €18" },
          { name: "Scampi crema + zeevruchten", price: "S €8 · M €10 · L €12 · à volonté €18" },
        ],
      },
    ],
    icon: "🍝",
  },
  {
    id: "tex-mex",
    title: "Tex-Mex Experience",
    category: "Apéro + burgers",
    priceBadges: ["Apéro €11,95", "Hoofd v.a. €10"],
    detailSubtitle: "Apéro €11,95 p.p. · Burgers v.a. €10 · Apart te boeken",
    notice:
      "Min. 20 personen · Opstartkost €150 · Apéro en hoofdgerecht kunnen apart geboekt worden · Min. 10 stuks per burgertype",
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
    icon: "🌮",
  },
  {
    id: "barbecue",
    title: "Barbecue Experience",
    category: "Apéro + grill formules",
    priceBadges: ["Apéro €11,95", "Hoofd v.a. €22,95"],
    detailSubtitle: "Apéro €11,95 p.p. · Formules v.a. €22,95 · Apart te boeken",
    notice:
      "Min. 20 personen · Opstartkost €150 · Apéro en hoofdgerecht kunnen apart geboekt worden",
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
        label: "Formules",
        entries: [
          { name: "Classic", price: "€22,95 · €25,95 · €27,95" },
          { name: "Deluxe", price: "€34,95" },
          { note: "Zie bijlage voor samenstelling" },
        ],
      },
    ],
    icon: "🔥",
  },
  {
    id: "sweet",
    title: "Sweet Experience",
    category: "Dessertbuffet",
    priceBadges: ["€10,95 p.p."],
    detailSubtitle: "€10,95 p.p. · Dessertbuffet · Apart te boeken",
    notice: "Min. 20 personen · Opstartkost €150 · Apart te boeken als dessertbuffet",
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
    icon: "🍮",
  },
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

export const gallery: GalleryTile[] = [
  {
    title: "City festivals",
    note: "Snelle service met een premium look & feel.",
  },
  {
    title: "Private celebrations",
    note: "Warm, persoonlijk en afgestemd op jouw gasten.",
  },
  { title: "Corporate events", note: "Van lunch activatie tot avondbeleving." },
  { title: "Dessert moments", note: "Sweet stations die meteen opvallen." },
];

export const quickFacts = [
  "Gent & heel Oost-Vlaanderen",
  "Vanaf kleine groepen tot grotere events",
  "Food, styling en service in één flow",
];

export const planningSteps = [
  "Kies je formule of vertel ons jouw idee.",
  "Wij stemmen timing, opstelling en menu af.",
  "Op de dag zelf rollen wij zorgeloos binnen en serveren we met flair.",
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
    value: "+32 (0)9 123 45 67",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "hallo@mealzonwheelz.be",
  },
  {
    icon: Clock,
    label: "Contacttijden",
    value: "Ma–Za: 10u – 21u\nZo: 12u – 19u",
  },
];

