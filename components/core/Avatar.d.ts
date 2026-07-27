import React from 'react';
export interface AvatarProps {
  /** Photo URL; when omitted, initials are shown */
  src?: string;
  alt?: string;
  /** 1-2 letter fallback shown when no src */
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Optional presence dot */
  status?: 'online' | 'offline' | 'away';
}
export function Avatar(props: AvatarProps): JSX.Element;
