import React from 'react';
import type { BandTone } from './CtaBand';
export interface HeroProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Surface: page (default, no fill), card (white), or a band tone (primary/indigo white text, ink on-ink text, accents ink text) */
  tone?: 'page' | 'card' | BandTone;
  /** Short uppercase line above the title */
  eyebrow?: string;
  /** The page headline */
  title: string;
  /** One supporting paragraph, capped at the prose width */
  lead?: string;
  /** Node beside the eyebrow, e.g. a Badge or Tag with the enrollment deadline */
  badge?: React.ReactNode;
  /** Media node, e.g. <image-slot placeholder="…">. Hero never renders a default image; without it the layout is one column */
  media?: React.ReactNode;
  /** Which side the media sits on when there are two columns */
  mediaPosition?: 'end' | 'start';
  /** Heading element for the title. Default h1: a page has exactly one, so use h2 if the page already has one */
  as?: 'h1' | 'h2';
  /** Actions: compose Button components here */
  children?: React.ReactNode;
}
/** The opening block of a page: eyebrow, the one h1, a lead, buttons and optional media in two columns that collapse to one. */
export const Hero: React.ForwardRefExoticComponent<HeroProps & React.RefAttributes<HTMLElement>>;
