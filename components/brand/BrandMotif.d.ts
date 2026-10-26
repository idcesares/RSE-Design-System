import React from 'react';

// GENERATED list — see scripts/build-motifs.mjs.
export type MotifVariant =
  /** purple default; green supplied — solid isometric cube — the base mark */
  | 'cube'
  /** blue default; blue supplied — two cubes interlocking through each other */
  | 'interlock'
  /** green default; green supplied — cube pierced by a bar that cannot pass through it */
  | 'bar'
  /** pink default; pink supplied — open frame with two impossible voids */
  | 'frame'
  /** orange default; pink supplied — zig-zag chain of bars — the widest construction */
  | 'chain'
  /** yellow default; blue supplied — cube opened out around a hollow centre */
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
  /** Omit for the assigned brand family; "original" preserves supplied fills; a palette family selects a derived remap. */
  hue?: MotifHue | 'original';
}

/**
 * The official "cubo impossível" motif — the brand's central visual idea, supplied by Sesc
 * as vector artwork and split into six constructions. Defaults to one brand family per shape;
 * hue="original" retains supplied colours. Never re-maps per theme. Invalid variants/hues return null.
 */
export function BrandMotif(props: BrandMotifProps): JSX.Element | null;

/** All available construction names */
export const motifVariants: MotifVariant[];

/** All palette families a construction can be restated in */
export const motifHues: MotifHue[];

/** Assigned default brand family for each construction (derived remaps). */
export const motifDefaultHues: Readonly<Record<MotifVariant, MotifHue>>;

/** N palette shades of a hue, lightest first; null for an unknown hue. */
export function motifRamp(hue: MotifHue, steps: number): string[] | null;
