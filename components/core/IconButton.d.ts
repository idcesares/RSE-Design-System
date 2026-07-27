import React from 'react';
export interface IconButtonProps {
  icon: React.ReactNode;
  /** Accessible label for the icon-only button. Also accepts the native `aria-label` attribute (e.g. when mounted via x-import). */
  ariaLabel?: string;
  'aria-label'?: string;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}
export function IconButton(props: IconButtonProps): JSX.Element;
