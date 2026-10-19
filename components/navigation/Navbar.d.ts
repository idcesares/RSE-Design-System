import React from 'react';
export interface NavbarLink { label: string; href?: string; }
export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Logo image URL */
  logoSrc?: string;
  /** Alt text for the logo */
  logoAlt?: string;
  /** Text links; they wrap onto their own row on narrow screens */
  links?: NavbarLink[];
  /** The link whose href matches gets aria-current="page" and the primary colour */
  activeHref?: string;
  /** Call-to-action label; omit for no button */
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}
/** Sticky site header: logo, text links and one call to action; wraps instead of overflowing (no drawer yet, roadmap P3.2). */
export const Navbar: React.ForwardRefExoticComponent<NavbarProps & React.RefAttributes<HTMLElement>>;
