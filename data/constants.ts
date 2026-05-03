import { BOOKING_EXPERIENCES } from "app/_lib/booking/constants";
import {
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Phone,
  Store,
  Truck,
} from "lucide-react";
import type {
  ContactInfo,
  GalleryTile,
  NavigationItem,
  Service,
} from "./types";

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

export const experiences = BOOKING_EXPERIENCES;

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
