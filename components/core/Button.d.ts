import React from 'react';
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Visual style */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Optional leading icon element, usually an <Icon> */
  icon?: React.ReactNode;
  /** Renders an <a> that looks like a button. With disabled, the link is removed and aria-disabled set. */
  href?: string;
  /** Full width */
  block?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}
/** Action button (or link styled as one) with 3 variants and 3 sizes. Class contract: .rse-button. Accepts every native attribute and a ref. */
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>>;
