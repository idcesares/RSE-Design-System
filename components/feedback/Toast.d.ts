import React from 'react';
export interface ToastProps {
  tone?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}
export function Toast(props: ToastProps): JSX.Element;
