import React from 'react';
export interface AlertProps {
  tone?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  message: string;
  onDismiss?: () => void;
}
export function Alert(props: AlertProps): JSX.Element;
