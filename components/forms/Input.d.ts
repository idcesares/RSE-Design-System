import React from 'react';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Helper text below the field (alias: hint) */
  helpText?: string;
  hint?: string;
  /** Error message — replaces the helper text, sets aria-invalid and is announced with the field */
  error?: string;
}
/** Text field with label, helper text and error, wired for screen readers. Class contract: .rse-field + .rse-input. Every other prop goes to the <input>; className goes to the field wrapper. */
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
