import React from 'react';
export interface BadgeProps {
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
  children: React.ReactNode;
}
export function Badge(props: BadgeProps): JSX.Element;
