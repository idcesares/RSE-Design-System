import type { MotifHue } from './BrandMotif';

/** A lattice axis: x runs at +30°, y at −30°, z straight up. */
export type Axis = 'x' | 'y' | 'z';

/** A lattice point [x, y, z]. */
export type Vec = [number, number, number];

/** A face's orientation, which sets its shade: top lightest, left mid, right darkest. */
export type Role = 'top' | 'left' | 'right';

/** An axis-aligned box on the lattice: a bar or a cube. Build it with motifBar or motifCube. */
export interface Part {
  /** What built it */
  kind: 'bar' | 'cube';
  /** The axis it runs along, and moves along in motion (z for a cube) */
  axis: Axis;
  /** Its low corner */
  at: Vec;
  /** Its extent along x, y and z */
  size: Vec;
}

/**
 * Part `over` passes in front of part `under` at its `overAt` end and behind it at the other. The
 * `over` part is split at its midpoint; the order is enforced only where the halves and `under`
 * overlap on screen. A part may be `over` in one crossing and `under` in another, so a cyclic set
 * (A over B, B over C, C over A) is fine. Crossings beat plain geometry; if crossings contradict
 * each other, the one declared first wins.
 */
export interface Crossing {
  /** Index into the shape's parts of the part that is split and passes over */
  over: number;
  /** Index into the shape's parts of the part it crosses */
  under: number;
  /** The end of `over` that is in front */
  overAt: 'start' | 'end';
}

/** A named list of parts and the crossings that make it impossible. Build it with makeMotifShape. */
export interface Shape {
  /** The shape's name */
  name: string;
  /** Its parts, in build order */
  parts: Part[];
  /** Its declared crossings */
  crossings: Crossing[];
}

/** One visible face in screen space. */
export interface Face {
  /** Four screen points, rounded to 2 decimals */
  points: [number, number][];
  /** Its orientation */
  role: Role;
  /** Paint position of the face's box (0 is painted first); faces of one box share it */
  layer: number;
  /** Index of the part it belongs to */
  piece: number;
}

/** A face ready to draw. */
export interface PieceFace {
  /** SVG polygon points, "x,y x,y …" */
  points: string;
  /** Its orientation */
  role: Role;
  /** A colour from motifRamp(hue, 3) */
  fill: string;
}

/** One box of a shape (a part, or one half of a split part), in paint order. */
export interface Piece {
  /** Index of the part it belongs to (both halves of a split part share it) */
  index: number;
  /** The part's axis as a unit screen vector, for motion along it */
  axis: { x: number; y: number };
  /** Its visible faces */
  faces: PieceFace[];
}

/** Options for motifToSvg. */
export interface MotifSvgOptions {
  /** Palette family */
  hue: MotifHue;
  /** Rendered width and height in px (default 240) */
  size?: number;
  /** Accessible name. Omit when decorative (rendered aria-hidden) */
  title?: string;
}

/** Lattice point to screen point (unit length 1, z up, x at +30°, y at −30°), rounded to 2 decimals. */
export function isoPoint(p: Vec): [number, number];

/** A bar along `axis` from `start`, `length` long, `thickness` square in section (default 1). */
export function motifBar(axis: Axis, start: Vec, length: number, thickness?: number): Part;

/** A cube with its low corner at `at` (size default 1). */
export function motifCube(at: Vec, size?: number): Part;

/** A shape from parts and crossings. Throws on a crossing that names a missing or the same part, a part too short to split, or one pair crossed at both ends. */
export function makeMotifShape(name: string, parts: Part[], crossings?: Crossing[]): Shape;

/** Every visible face, in paint order: a box behind another (or the back of a crossing) paints first. */
export function motifFaces(shape: Shape): Face[];

/** The shape's pieces in paint order, filled from the hue's ramp; null for an unknown hue. */
export function motifPieces(shape: Shape, hue: MotifHue): Piece[] | null;

/** The shape as one SVG string with a `.rse-motif__piece` group per piece; '' for an unknown hue. */
export function motifToSvg(shape: Shape, opts: MotifSvgOptions): string;

/**
 * The motif engine: builds impossible isometric shapes from lattice bars and cubes with declared
 * crossings, and renders them as flat-filled SVG in any of the six palette families. A function
 * library with no visual output of its own; MotifLoader and MotifPattern build on it. Also
 * exported one function at a time.
 */
export const MotifEngine: {
  readonly isoPoint: typeof isoPoint;
  readonly motifBar: typeof motifBar;
  readonly motifCube: typeof motifCube;
  readonly makeMotifShape: typeof makeMotifShape;
  readonly motifFaces: typeof motifFaces;
  readonly motifPieces: typeof motifPieces;
  readonly motifToSvg: typeof motifToSvg;
};
