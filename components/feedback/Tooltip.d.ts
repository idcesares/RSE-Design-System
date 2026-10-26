import React from 'react';
export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  children: React.ReactNode;
}
export declare const Tooltip: React.ForwardRefExoticComponent<TooltipProps & React.RefAttributes<HTMLSpanElement>>;
