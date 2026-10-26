import React from 'react';
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Photo URL; when omitted, initials are shown */
  src?: string;
  alt?: string;
  /** 1-2 letter fallback shown when no src */
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Optional presence dot */
  status?: 'online' | 'offline' | 'away';
}
/** Circular image or initials with optional decorative presence dot. Class contract: .rse-avatar. */
export declare const Avatar: React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLSpanElement>>;
