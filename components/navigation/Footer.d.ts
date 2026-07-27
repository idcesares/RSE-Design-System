import React from 'react';
export interface FooterColumn { title: string; links: { label: string; href?: string }[]; }
export interface FooterProps {
  logoSrc?: string;
  logoAlt?: string;
  tagline?: string;
  columns?: FooterColumn[];
  note?: string;
}
export function Footer(props: FooterProps): JSX.Element;
