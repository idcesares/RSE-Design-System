import React from 'react';
export interface TestimonialProps extends React.HTMLAttributes<HTMLElement> {
  /** The quoted text, without quotation marks (the CSS adds the pt-BR ones) */
  quote: React.ReactNode;
  /** Who said it */
  name: string;
  /** Role or relationship, e.g. "responsável", "ex-estudante" */
  role?: string;
  /** Unit or programme the person is tied to */
  unit?: string;
  /** Avatar node; the caller passes an <Avatar> */
  avatar?: React.ReactNode;
  /** Marks the testimonial as a placeholder: shows a visible "Depoimento de exemplo" pill (read by screen readers too). Default false */
  example?: boolean;
}
/** A single static testimonial as figure, blockquote and figcaption. Never invent one: use example while the text is a placeholder. */
export const Testimonial: React.ForwardRefExoticComponent<TestimonialProps & React.RefAttributes<HTMLElement>>;
