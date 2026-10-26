import React from 'react';
export interface PlatformEntryProps extends React.HTMLAttributes<HTMLElement> {
  /** Where the platform lives. Ask Sesc for the real URL — the default # is a placeholder. */
  href?: string;
  /** Sab.IA lockup, e.g. assets/logos/sabia-wordmark-cream.svg on purple */
  logoSrc?: string;
  logoAlt?: string;
  /** Uppercase label shown when no logoSrc is given */
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  /** purple = solid Sab.IA purple band; cream = quiet block on a cream page */
  tone?: 'purple' | 'cream';
  /** Small print under the description (audience, access conditions) */
  note?: string;
}
/**
 * Co-branded entry point from a Rede Sesc de Educação surface into the Plataforma Sesc Sab.IA.
 * One click from a marketing page to the platform's home — see docs/sabia-platform.md.
 */
export declare const PlatformEntry: React.ForwardRefExoticComponent<PlatformEntryProps & React.RefAttributes<HTMLElement>>;
