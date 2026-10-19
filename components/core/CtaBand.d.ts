import React from 'react';
export type BandTone =
  | 'primary' | 'indigo' | 'ink'
  | 'pink' | 'orange' | 'yellow' | 'green' | 'blue'
  | 'pink-light' | 'orange-light' | 'yellow-light' | 'green-light' | 'blue-light';
export interface CtaBandProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Band colour: primary/indigo (white text), ink (on-ink text), accents (ink text) */
  tone?: BandTone;
  /** Short uppercase line above the title */
  eyebrow?: string;
  /** The call to action headline */
  title: string;
  /** One supporting sentence */
  description?: string;
  /** Alignment of the content block */
  align?: 'center' | 'left';
  /** Heading element for the title; pick the level that fits the page outline */
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  /** Actions: compose Button components here */
  children?: React.ReactNode;
}
/** A full-bleed call-to-action band: headline, one line of support and the caller's buttons. */
export const CtaBand: React.ForwardRefExoticComponent<CtaBandProps & React.RefAttributes<HTMLElement>>;
