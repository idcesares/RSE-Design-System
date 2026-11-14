import React from 'react';
export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  children: React.ReactNode;
}
/** Hover and focus label for a trigger (icon buttons, truncated text); dismissed with Escape. Class contract: .rse-tooltip. */
export declare const Tooltip: React.ForwardRefExoticComponent<TooltipProps & React.RefAttributes<HTMLSpanElement>>;
