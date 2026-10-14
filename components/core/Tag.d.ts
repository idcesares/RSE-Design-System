import React from 'react';
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'pink' | 'orange' | 'green' | 'blue' | 'purple' | 'yellow';
  children: React.ReactNode;
  /** Shows a remove button */
  onRemove?: () => void;
  /** Accessible label of the remove button (default "Remover") */
  removeLabel?: string;
}
/** Accent chip on a pale tint with its paired ink. Class contract: .rse-tag--<hue>. */
export declare const Tag: React.ForwardRefExoticComponent<TagProps & React.RefAttributes<HTMLSpanElement>>;
