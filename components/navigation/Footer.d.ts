import React from 'react';
export interface FooterColumn { title: string; links: { label: string; href?: string }[]; }
export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Logo image URL (use the white wordmark on the ink surface) */
  logoSrc?: string;
  logoAlt?: string;
  /** One line under the logo */
  tagline?: string;
  /** Link columns; the grid reflows to as many as fit, one per row on a phone */
  columns?: FooterColumn[];
  /** Legal line below a divider */
  note?: string;
}
/** Ink-surface site footer: brand block, responsive link columns and a legal note. */
export const Footer: React.ForwardRefExoticComponent<FooterProps & React.RefAttributes<HTMLElement>>;
