import React from 'react';
export interface MenuEntry {
  /** Item text */
  label?: string;
  /** Renders as a link instead of a button */
  href?: string;
  icon?: React.ReactNode;
  /** Right-aligned secondary text (count, state) */
  meta?: string;
  onSelect?: () => void;
  /** Renders an uppercase group heading instead of an item */
  heading?: string;
  /** Renders a hairline separator */
  divider?: boolean;
}
export interface MenuProps {
  /** Trigger text */
  label: string;
  items: MenuEntry[];
  align?: 'left' | 'right';
  /** Panel width in px (default 260) */
  width?: number;
  /** Pill button (default) or bare nav link */
  trigger?: 'button' | 'link';
  /** Controlled open state */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
/** Dropdown menu for navigation and actions: regional unit pickers, Programas nav sections, row actions. Closes on outside click and Escape. */
export function Menu(props: MenuProps): JSX.Element;
