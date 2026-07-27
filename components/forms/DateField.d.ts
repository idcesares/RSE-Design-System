import React from 'react';
export interface DateFieldProps {
  label?: string;
  /** ISO date string (yyyy-mm-dd) */
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Earliest selectable ISO date */
  min?: string;
  /** Latest selectable ISO date */
  max?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  /** Optional deadline pill under the field, e.g. Inscrições até 28/02 */
  deadline?: string;
}
/** Native date input styled to match Input, with an optional deadline pill for enrollment windows. */
export function DateField(props: DateFieldProps): JSX.Element;
