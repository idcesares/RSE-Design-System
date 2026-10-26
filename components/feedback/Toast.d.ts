import React from 'react';
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}
export declare const Toast: React.ForwardRefExoticComponent<ToastProps & React.RefAttributes<HTMLDivElement>>;
