// ─── Booking constants – single source of truth for UI and server ────────────

import { defaultMaxGuests, ExperienceId, experiences } from "@data/constants";

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

export interface ExperienceMenuSection {
  title?: string;
  entries: readonly ExperienceMenuEntry[];
}

export interface ExperienceTab {
  label: string;
  entries?: readonly ExperienceMenuEntry[];
  sections?: readonly ExperienceMenuSection[];
}

export function getExperienceTabSections(
  tab: ExperienceTab,
): readonly ExperienceMenuSection[] {
  if (tab.sections && tab.sections.length > 0) {
    return tab.sections;
  }

  return [{ entries: tab.entries ?? [] }];
}

export function getExperience(id: ExperienceId): ExperienceDefinition {
  const exp = experiences.find((e) => e.id === id);
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
  return getExperience(experienceId).maxGuests || defaultMaxGuests;
}
