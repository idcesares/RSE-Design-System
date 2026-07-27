import React from 'react';
export interface NavbarLink { label: string; href?: string; }
export interface NavbarProps {
  logoSrc?: string;
  logoAlt?: string;
  links?: NavbarLink[];
  activeHref?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}
export function Navbar(props: NavbarProps): JSX.Element;
