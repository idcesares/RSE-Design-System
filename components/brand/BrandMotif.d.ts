import React from 'react';

// GENERATED list — see scripts/build-motifs.mjs.
export type MotifVariant =
  /** green — solid isometric cube — the base mark */
  | 'cube'
  /** blue — two cubes interlocking through each other */
  | 'interlock'
  /** green — cube pierced by a bar that cannot pass through it */
  | 'bar'
  /** pink — open frame with two impossible voids */
  | 'frame'
  /** pink — zig-zag chain of bars — the widest construction */
  | 'chain'
  /** blue — cube opened out around a hollow centre */
  | 'hollow';

export type MotifHue = 'green' | 'blue' | 'pink' | 'purple' | 'orange' | 'yellow';

export interface BrandMotifProps {
  /** Which official construction to render (default 'cube') */
  variant?: MotifVariant;
  /** Rendered square size in px (default 240) */
  size?: number;
  /** Accessible label. Omit when decorative (rendered aria-hidden) */
  title?: string;
  /** Fade the motif when it sits behind content (default 1) */
  opacity?: number;
  /**
   * Restate the construction in another palette family. Omit to render the exact fills Sesc
   * supplied — the sheet ships green, blue and pink only, so this is how the other three
   * families are reached. Ramps derive from the published palette, never from the artwork.
   */
  hue?: MotifHue;
}

/**
 * The official "cubo impossível" motif — the brand's central visual idea, supplied by Sesc
 * as vector artwork and split into six constructions. Renders the supplied colours untouched
 * unless `hue` asks for another family. Never re-maps per theme. Returns null for an unknown
 * variant.
 */
export function BrandMotif(props: BrandMotifProps): JSX.Element | null;

/** All available construction names */
export const motifVariants: MotifVariant[];

/** All palette families a construction can be restated in */
export const motifHues: MotifHue[];
