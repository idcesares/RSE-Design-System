import React from 'react';
import type { MotifHue } from '../brand/BrandMotif';
import type { MotifShapeName } from '../brand/MotifEngine';

export interface MotifLoaderProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Shape to assemble. Defaults to cube for sections, triangle for inline. Invalid names render nothing */
  shape?: MotifShapeName;
  /** Palette family (default 'purple'). An unknown name renders nothing */
  hue?: MotifHue;
  /** 2 to 4 families to step through, one per cycle. Any other length uses `hue` */
  hues?: MotifHue[];
  /** Section feedback (48 px, palette facets) or compact inline feedback (24 px, monochrome) */
  variant?: 'section' | 'inline';
  /** Inline foreground: primary for light surfaces; inverse for primary/ink bands and buttons */
  tone?: 'primary' | 'inverse';
  /** Width and height in px. Below 32 automatically uses compact inline rendering */
  size?: number;
  /** Accessible name announced to screen readers, in pt-BR (default 'Carregando') */
  label?: string;
}
/** Primary branded loading feedback for buttons, inline waits and whole sections. Generated motif pieces assemble and release; reduced motion uses a slower opacity-only build. */
export declare const MotifLoader: React.ForwardRefExoticComponent<MotifLoaderProps & React.RefAttributes<HTMLSpanElement>>;
