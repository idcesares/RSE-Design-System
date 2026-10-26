import React from 'react';
export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}
/** Page navigation for long result lists. Class contract: .rse-pagination. */
export declare const Pagination: React.ForwardRefExoticComponent<PaginationProps & React.RefAttributes<HTMLElement>>;
