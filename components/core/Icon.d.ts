import React from 'react';

// GENERATED list — see scripts/build-icons.mjs. 97 glyphs from Lucide v1.27.0 (ISC).
export type IconName =
  | 'accessibility'
  | 'activity'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'at-sign'
  | 'award'
  | 'backpack'
  | 'badge-check'
  | 'book-open'
  | 'bookmark'
  | 'bot'
  | 'brain'
  | 'building-2'
  | 'calendar-check'
  | 'calendar'
  | 'camera'
  | 'chart-column'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'circle-alert'
  | 'circle-check'
  | 'circle-help'
  | 'circle-x'
  | 'clipboard-check'
  | 'clock'
  | 'contrast'
  | 'credit-card'
  | 'download'
  | 'external-link'
  | 'eye'
  | 'file-check'
  | 'file-text'
  | 'filter'
  | 'folder'
  | 'globe'
  | 'graduation-cap'
  | 'headphones'
  | 'heart'
  | 'house'
  | 'id-card'
  | 'image'
  | 'info'
  | 'languages'
  | 'layout-dashboard'
  | 'lightbulb'
  | 'link'
  | 'list'
  | 'lock'
  | 'log-in'
  | 'log-out'
  | 'mail'
  | 'map-pin'
  | 'map'
  | 'menu'
  | 'message-circle'
  | 'message-square'
  | 'mic'
  | 'moon'
  | 'navigation'
  | 'pause'
  | 'pencil'
  | 'phone-call'
  | 'phone'
  | 'pie-chart'
  | 'play'
  | 'plus'
  | 'printer'
  | 'quote'
  | 'refresh-cw'
  | 'school'
  | 'search'
  | 'send'
  | 'settings'
  | 'share-2'
  | 'shield-check'
  | 'sliders-horizontal'
  | 'sparkles'
  | 'star'
  | 'sun'
  | 'target'
  | 'trash-2'
  | 'trending-up'
  | 'triangle-alert'
  | 'trophy'
  | 'upload'
  | 'user-check'
  | 'user-round'
  | 'user'
  | 'users'
  | 'video'
  | 'volume-2'
  | 'wifi-off'
  | 'x';

export interface IconProps {
  /** Which glyph to render */
  name: IconName;
  /** Pixel size (width & height), default 20 */
  size?: number;
  /** Stroke weight, default 2 — the grid these icons are drawn on */
  strokeWidth?: number;
  /** Stroke colour; defaults to currentColor so it inherits text colour */
  color?: string;
  /** Accessible label. Omit for decorative icons (rendered aria-hidden) */
  title?: string;
}

/**
 * Line-icon primitive — the single source of truth for iconography.
 * 24×24 grid, 2px stroke, inherits `currentColor`. Pass to Button/IconButton via `icon`.
 * Returns null for an unknown name, so a typo fails visibly in review rather than
 * rendering a broken glyph.
 */
export function Icon(props: IconProps): JSX.Element | null;

/** All available icon names, alphabetical */
export const iconNames: IconName[];
