import type { ExperienceId } from "@/_lib/booking/constants";
import type { LucideIcon } from 'lucide-react';

export type NavigationItem = {
  label: string;
  href: string;
};

export type ExperienceDetailEntry = {
  name?: string;
  price?: string;
  note?: string;
};

export type ExperienceTab = {
  label: string;
  entries: ExperienceDetailEntry[];
};

export type Experience = {
  id: ExperienceId;
  title: string;
  category: string;
  priceBadges: string[];
  detailSubtitle: string;
  notice: string;
  tabs: ExperienceTab[];
  icon: string;
};

export type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type GalleryTile = {
  title: string;
  note: string;
};

export type ContactInfo = {
  label: string;
  value: string;
  icon: LucideIcon;
};

