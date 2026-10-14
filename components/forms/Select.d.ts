import React from 'react';
export interface SelectOption { label: string; value: string }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  /** Disabled first option shown until a value is picked */
  placeholder?: string;
  helpText?: string;
  hint?: string;
  error?: string;
}
/** Native select with the system's field chrome. Class contract: .rse-field + .rse-select. */
export declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;
