import React from 'react';
import type { MotifHue } from '../brand/BrandMotif';
import type { MotifShapeName } from '../brand/MotifEngine';

export interface MotifLoaderProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Which shape assembles (default 'cube', the 12-bar frame). An unknown name renders nothing */
  shape?: MotifShapeName;
  /** Palette family (default 'purple'). An unknown name renders nothing */
  hue?: MotifHue;
  /** 2 to 4 families to step through, one per cycle. Any other length uses `hue` */
  hues?: MotifHue[];
  /** Width and height in px (default 48). Below 32 the facets blur and a console warning is logged once */
  size?: number;
  /** Accessible name announced to screen readers, in pt-BR (default 'Carregando') */
  label?: string;
}
/** Animated loader: an impossible shape assembles piece by piece, holds, comes apart and loops. For page and section loading at 48 px or larger; use Spinner for buttons. Follows the motion setting: reduced is a slower, opacity-only build. */
export declare const MotifLoader: React.ForwardRefExoticComponent<MotifLoaderProps & React.RefAttributes<HTMLSpanElement>>;
