import React from 'react';
export interface BreadcrumbItem { label: string; href?: string; }
export interface BreadcrumbProps { items: BreadcrumbItem[]; }
export function Breadcrumb(props: BreadcrumbProps): JSX.Element;
