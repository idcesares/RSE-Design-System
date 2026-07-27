import React from 'react';
export interface DataTableColumn {
  /** Key into each row object */
  key: string;
  /** Column header label */
  label: string;
  align?: 'left' | 'center' | 'right';
  /** CSS width, e.g. 180px or 20% */
  width?: string;
}
export interface DataTableProps {
  columns: DataTableColumn[];
  /** Row objects keyed by column key; values may be nodes (Tags, Badges, links) */
  rows: Record<string, React.ReactNode>[];
  /** Optional eyebrow caption above the table */
  caption?: string;
  /** Alternate row tint (default true) */
  zebra?: boolean;
  /** Tighter row height for dense schedules */
  compact?: boolean;
  emptyMessage?: string;
}
/** Rounded, card-surface table for schedules, unit lists, fees and program comparisons. Horizontally scrollable on narrow screens. */
export function DataTable(props: DataTableProps): JSX.Element;
