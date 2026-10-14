import React from 'react';
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  /** The message (children also work) */
  message?: React.ReactNode;
  onDismiss?: () => void;
  /** Interrupts screen readers (role="alert"). Default is role="status". */
  urgent?: boolean;
  /** Accessible label of the dismiss button (default "Fechar") */
  dismissLabel?: string;
}
/** Persistent inline banner with a tone icon. Class contract: .rse-alert--<tone>. */
export declare const Alert: React.ForwardRefExoticComponent<AlertProps & React.RefAttributes<HTMLDivElement>>;
