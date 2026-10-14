import React from 'react';
export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  icon: React.ReactNode;
  /** Accessible label for the icon-only button (required — there is no visible text). Also accepts the native `aria-label`. */
  ariaLabel?: string;
  'aria-label'?: string;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}
/** Icon-only round button. Class contract: .rse-icon-button. Accepts every native attribute and a ref. */
export declare const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;
