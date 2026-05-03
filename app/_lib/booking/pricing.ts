import {
  BOOKING_EXPERIENCES,
  ExperienceId,
  getExperienceMainOption,
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
  mainOptionId?: string | null,
): PriceBreakdown {
  const exp = BOOKING_EXPERIENCES.find((e) => e.id === experienceId);
  if (!exp) {
    return { perPerson: 0, startupCost: STARTUP_COST, total: STARTUP_COST, guestCount };
  }

   const mainOptionPrice = includeMain
    ? (getExperienceMainOption(experienceId, mainOptionId)?.price ?? exp.mainPrice)
    : 0;

  const guests = Math.max(MIN_GUESTS, guestCount);
  const perPerson =
    exp.basePrice +
    (includeApero && exp.hasApero ? exp.aperoPrice : 0) +
    (includeMain && exp.hasMain ? mainOptionPrice : 0);
  const total = STARTUP_COST + guests * perPerson;
  return { perPerson, startupCost: STARTUP_COST, total, guestCount: guests };
}

