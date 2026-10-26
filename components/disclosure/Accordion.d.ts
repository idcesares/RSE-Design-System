import React from 'react';
export interface AccordionItem {
  /** Question or section title */
  title: string;
  /** Body content — string or nodes */
  content: React.ReactNode;
}
export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  /** Allow several panels open at once (default: single-open) */
  allowMultiple?: boolean;
  /** Indices open on first render */
  defaultOpen?: number[];
}
/** Expand/collapse list for FAQs and long-form program details. Animated with grid-template-rows so panel height is automatic. */
export declare const Accordion: React.ForwardRefExoticComponent<AccordionProps & React.RefAttributes<HTMLDivElement>>;
