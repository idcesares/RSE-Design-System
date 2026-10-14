import React from 'react';
export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Optional media element (e.g. <image-slot> or <img>) rendered at 16:10 */
  image?: React.ReactNode;
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  /** Optional Tag/Badge element shown above the eyebrow */
  tag?: React.ReactNode;
  /** Actions or meta below the body; stays independently clickable */
  footer?: React.ReactNode;
  /** Makes the title a link whose hit area covers the whole card */
  href?: string;
  /** Heading level of the title (default 3) */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}
/** Program/school card: media, eyebrow, title, description, footer. Class contract: .rse-card. */
export declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLElement>>;
