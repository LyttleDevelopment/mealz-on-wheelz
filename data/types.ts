import type { ExperienceDefinition } from "app/_lib/booking/constants";
import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
};

export type Experience = ExperienceDefinition;

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
