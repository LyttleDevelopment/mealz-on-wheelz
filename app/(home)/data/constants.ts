import {
  CalendarDays,
  ChefHat,
  PartyPopper,
  Sparkles,
  Store,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import type { Experience, GalleryTile, NavigationItem, Service } from "./types";

export const navigation: NavigationItem[] = [
  { label: "Home", href: "#home" },
  { label: "Over ons", href: "#over-ons" },
  { label: "Formules", href: "#formules" },
  { label: "Diensten", href: "#diensten" },
  { label: "Galerij", href: "#galerij" },
  { label: "Contact", href: "#contact" },
];

export const experiences: Experience[] = [
  {
    title: "Italian Experience",
    subtitle: "Romig comfortfood met een streetfood twist.",
    price: "Vanaf €14 p.p.",
    description:
      "Verse pasta, zachte focaccia en toppings die ter plekke worden afgewerkt voor een warme, elegante service.",
    highlights: [
      "Pasta live afgewerkt",
      "Vegetarische opties",
      "Perfect voor walking dinners",
    ],
    icon: ChefHat,
  },
  {
    title: "Tex Mex Experience",
    subtitle: "Vurig, kleurrijk en gemaakt om te delen.",
    price: "Vanaf €13 p.p.",
    description:
      "Loaded taco's, bowls en frisse toppings voor events die iets losser, socialer en energieker mogen aanvoelen.",
    highlights: [
      "Taco bar setup",
      "Milde & spicy keuzes",
      "Top voor teams en festivals",
    ],
    icon: Sparkles,
  },
  {
    title: "Barbecue Experience",
    subtitle: "Robuuste smaken met een premium uitstraling.",
    price: "Vanaf €18 p.p.",
    description:
      "Low & slow barbecue, seizoenssalades en stevige sharing plates voor events met impact en karakter.",
    highlights: [
      "Live grill moment",
      "Vlees & veggie",
      "Sterk voor buitenlocaties",
    ],
    icon: UtensilsCrossed,
  },
  {
    title: "Sweet Experience",
    subtitle: "Desserts en verwenmomenten voor elk publiek.",
    price: "Vanaf €9 p.p.",
    description:
      "Mini desserts, loaded waffles en feestelijke sweets die perfect werken als afsluiter of stand-alone concept.",
    highlights: ["Dessert corner", "Kinderproof", "Ideaal voor recepties"],
    icon: PartyPopper,
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
