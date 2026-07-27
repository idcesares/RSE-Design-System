import React from 'react';
export interface SelectOption { label: string; value: string }
export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}
export function Select(props: SelectProps): JSX.Element;
