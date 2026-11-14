import React from 'react';
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}
/** Transient notification card with a tone accent; announced as role="status", or role="alert" for danger. Class contract: .rse-toast--<tone>. */
export declare const Toast: React.ForwardRefExoticComponent<ToastProps & React.RefAttributes<HTMLDivElement>>;
