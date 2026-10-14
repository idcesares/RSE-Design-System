import React from 'react';
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  /** Helper text below the field (alias: helpText) */
  hint?: string;
  helpText?: string;
  /** Error message — replaces the hint and sets aria-invalid */
  error?: string;
  /** Enables the character counter (needs a controlled value) */
  maxLength?: number;
  rows?: number;
}
/** Multi-line text field matching Input, with optional hint, error and character counter. Class contract: .rse-field + .rse-textarea. */
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
