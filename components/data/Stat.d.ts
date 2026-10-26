import React from 'react';
export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The figure itself, pre-formatted: 1.200, 97%, +38 mil */
  value: React.ReactNode;
  /** Short uppercase label under the figure */
  label: string;
  /** Optional supporting sentence */
  description?: string;
  /** Figure colour — use inverse on purple bands */
  accent?: 'primary' | 'indigo' | 'pink' | 'orange' | 'green' | 'blue' | 'yellow' | 'inverse';
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg';
}
/** A single impact figure with uppercase label. Compose 3–4 in a flex/grid band to show the Rede reach. */
export declare const Stat: React.ForwardRefExoticComponent<StatProps & React.RefAttributes<HTMLDivElement>>;
