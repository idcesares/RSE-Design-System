import React from 'react';
import type { BandTone } from '../core/CtaBand';
export interface StatBandProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Band colour: primary/indigo (white text), ink (on-ink text), accents (ink text) */
  tone?: BandTone;
  /** Visible heading, rendered as an uppercase eyebrow; also names the section for screen readers. Without it, pass aria-label. */
  title?: string;
  /** Small text under the figures: source, date, or the placeholder warning */
  note?: string;
  /** Stat components; each becomes one list item */
  children: React.ReactNode;
}
/** A full-bleed band of 3–4 Stat figures in a fluid grid, announced as a list. */
export const StatBand: React.ForwardRefExoticComponent<StatBandProps & React.RefAttributes<HTMLElement>>;
