import React from 'react';
export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  helpText?: string;
  disabled?: boolean;
  type?: string;
}
export function Input(props: InputProps): JSX.Element;
