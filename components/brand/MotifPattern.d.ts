import React from 'react';
import type { MotifPatternOptions } from './MotifEngine';

export interface MotifPatternProps extends Omit<MotifPatternOptions, 'width' | 'height'>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Width of the drawing box, px (default 1920). Only the proportion matters: the art is scaled to fill the host */
  width?: number;
  /** Height of the drawing box, px (default 1080) */
  height?: number;
  /** Extra class on the root, e.g. one that gives the host its size */
  className?: string;
}
/**
 * A field of impossible shapes that fills its container (display:block, width and height 100%: the host sets the size). `animate` is 'none' (static, default), 'reveal' (cells fade in by --d stagger when the pattern scrolls into view; needs motion.js, never hidden without it) or 'ambient' (a slow breathing loop with a mandatory pause button). Text never sits on the cells: put it on a solid panel. An unknown shape or hue renders nothing. Follows the motion setting: reveal is opacity only and ambient is static when reduced.
 */
export declare const MotifPattern: React.ForwardRefExoticComponent<MotifPatternProps & React.RefAttributes<HTMLDivElement>>;
