import React from 'react';
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Diameter in px */
  size?: number;
  /** Use "inverse" on purple/ink backgrounds */
  tone?: 'primary' | 'inverse';
}
/** Compatibility wrapper for MotifLoader inline mode. Prefer MotifLoader for new loading feedback. Uses managed reduced motion, not a separate rotating ring. */
export declare const Spinner: React.ForwardRefExoticComponent<SpinnerProps & React.RefAttributes<HTMLSpanElement>>;
