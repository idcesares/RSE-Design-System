import React from 'react';
export interface TabItem {
  id: string;
  label: string;
  /** id of the panel this tab controls — put `role="tabpanel"` and `aria-labelledby="tab-<id>"` on that element */
  panelId?: string;
}
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: TabItem[];
  activeId?: string;
  onChange?: (id: string) => void;
  /** Accessible name for the tab bar (default "Seções") */
  label?: string;
}
/**
 * Pill tab bar for switching sections. Implements the ARIA tablist pattern:
 * roving tabIndex, `aria-selected`, and Left/Right/Home/End keyboard navigation. The tab list scrolls
 * sideways inside itself on narrow screens. Class contract: .rse-tabs, __list, __tab, __panel.
 */
export declare const Tabs: React.ForwardRefExoticComponent<TabsProps & React.RefAttributes<HTMLDivElement>>;
