import React from 'react';
export interface CardProps {
  /** Optional media element (e.g. <image-slot> or <img>) rendered at 16:10 */
  image?: React.ReactNode;
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  /** Optional Tag/Badge element shown above the eyebrow */
  tag?: React.ReactNode;
  footer?: React.ReactNode;
  href?: string;
}
/** Program/school card with image, eyebrow, title and optional footer. */
export function Card(props: CardProps): JSX.Element;
