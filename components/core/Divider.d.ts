import React from 'react';
export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Optional centered label (horizontal only), e.g. "ou" */
  label?: string;
}
/** Horizontal or vertical separator, optionally with a centred label. Class contract: .rse-divider. */
export declare const Divider: React.ForwardRefExoticComponent<DividerProps & React.RefAttributes<HTMLElement>>;
