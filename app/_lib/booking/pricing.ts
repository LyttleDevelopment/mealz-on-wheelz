import {
  BOOKING_EXPERIENCES,
  ExperienceId,
  MIN_GUESTS,
  STARTUP_COST,
} from "./constants";

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export interface PriceBreakdown {
  perPerson: number;
  startupCost: number;
  total: number;
  guestCount: number;
}

export function calcPricing(
  experienceId: ExperienceId,
  includeApero: boolean,
  includeMain: boolean,
  guestCount: number,
): PriceBreakdown {
  const exp = BOOKING_EXPERIENCES.find((e) => e.id === experienceId);
  if (!exp) {
    return { perPerson: 0, startupCost: STARTUP_COST, total: STARTUP_COST, guestCount };
  }
  const guests = Math.max(MIN_GUESTS, guestCount);
  const perPerson =
    exp.basePrice +
    (includeApero && exp.hasApero ? exp.aperoPrice : 0) +
    (includeMain && exp.hasMain ? exp.mainPrice : 0);
  const total = STARTUP_COST + guests * perPerson;
  return { perPerson, startupCost: STARTUP_COST, total, guestCount: guests };
}

