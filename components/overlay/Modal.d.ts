import React from 'react';
export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
/** Centred dialog on a dimmed backdrop: traps focus, closes on Escape and returns focus to the trigger. Class contract: .rse-modal--<size>. */
export declare const Modal: React.ForwardRefExoticComponent<ModalProps & React.RefAttributes<HTMLDivElement>>;
