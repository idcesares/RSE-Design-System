import React from 'react';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
  children: React.ReactNode;
}
/** Small status pill with a dot. Class contract: .rse-badge--<tone>. */
export declare const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLSpanElement>>;
