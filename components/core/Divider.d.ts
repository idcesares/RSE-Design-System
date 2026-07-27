import React from 'react';
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  /** Optional centered label (horizontal only), e.g. "ou" */
  label?: string;
}
export function Divider(props: DividerProps): JSX.Element;
