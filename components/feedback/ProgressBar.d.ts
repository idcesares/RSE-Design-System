import React from 'react';
export interface ProgressBarProps {
  /** 0-100 */
  value?: number;
  tone?: 'primary' | 'success' | 'danger';
  /** Optional caption shown above the track, with the % on the right */
  label?: string;
  /** Accessible name when there is no visible `label` (default "Progresso") */
  ariaLabel?: string;
}
/** Determinate progress track exposed as `role="progressbar"` with aria-valuenow/min/max. */
export function ProgressBar(props: ProgressBarProps): JSX.Element;
