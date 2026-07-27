import React from 'react';
export interface SpinnerProps {
  /** Diameter in px */
  size?: number;
  /** Use "inverse" on purple/ink backgrounds */
  tone?: 'primary' | 'inverse';
}
export function Spinner(props: SpinnerProps): JSX.Element;
