import React from 'react';
export interface TextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  /** Helper text below the field */
  hint?: string;
  /** Error message — replaces hint and turns the border red */
  error?: string;
  /** Enables the character counter */
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  id?: string;
}
/** Multi-line text field matching Input styling, with optional hint, error and character counter. */
export function Textarea(props: TextareaProps): JSX.Element;
