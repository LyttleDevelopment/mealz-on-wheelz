import type { LucideIcon } from 'lucide-react';

export type NavigationItem = {
  label: string;
  href: string;
};

export type Experience = {
  title: string;
  subtitle: string;
  price: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
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

