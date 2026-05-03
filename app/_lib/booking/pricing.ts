import { getExperienceMainOption } from "./constants";
import {
  ExperienceId,
  experiences,
  minGuests,
  startupCost,
} from "../../../data/constants";

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
  const exp = experiences.find((e) => e.id === experienceId);
  if (!exp) {
    return {
      perPerson: 0,
      startupCost: startupCost,
      total: startupCost,
      guestCount,
    };
  }

  const mainOptionPrice = includeMain
    ? (getExperienceMainOption(experienceId, mainOptionId)?.price ??
      exp.mainPrice)
    : 0;

  const guests = Math.max(minGuests, guestCount);
  const perPerson =
    exp.basePrice +
    (includeApero && exp.hasApero ? exp.aperoPrice : 0) +
    (includeMain && exp.hasMain ? mainOptionPrice : 0);
  const total = startupCost + guests * perPerson;
  return { perPerson, startupCost: startupCost, total, guestCount: guests };
}
