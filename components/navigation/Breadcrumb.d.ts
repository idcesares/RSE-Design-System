import React from 'react';
export interface BreadcrumbItem { label: string; href?: string; }
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> { items?: BreadcrumbItem[]; }
/** Navigation trail with a non-link current page. Class contract: .rse-breadcrumb. */
export declare const Breadcrumb: React.ForwardRefExoticComponent<BreadcrumbProps & React.RefAttributes<HTMLElement>>;
