import React from 'react';
export interface TagProps {
  color?: 'pink' | 'orange' | 'green' | 'blue' | 'purple' | 'yellow';
  children: React.ReactNode;
  onRemove?: () => void;
}
export function Tag(props: TagProps): JSX.Element;
