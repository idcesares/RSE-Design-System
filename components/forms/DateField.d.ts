import React from 'react';
export interface DateFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  label?: string;
  /** ISO date string (yyyy-mm-dd) */
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Earliest selectable ISO date */
  min?: string;
  /** Latest selectable ISO date */
  max?: string;
  hint?: string;
  /** Alias of hint */
  helpText?: string;
  /** Error message — replaces hint, sets aria-invalid and is announced */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  /** Explicit id; otherwise generated with React.useId */
  id?: string;
  /** Optional deadline pill under the field, e.g. Inscrições até 28/02 */
  deadline?: string;
}
/** Native date input styled to match Input, with an optional deadline pill for enrollment windows. */
export const DateField: React.ForwardRefExoticComponent<DateFieldProps & React.RefAttributes<HTMLInputElement>>;
