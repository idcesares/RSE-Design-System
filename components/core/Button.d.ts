import React from 'react';
export interface ButtonProps {
  /** Visual style */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Optional leading icon element */
  icon?: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}
/** Primary action button with 3 variants (primary, secondary, ghost) and 3 sizes. */
export function Button(props: ButtonProps): JSX.Element;
