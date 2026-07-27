export interface SkeletonProps {
  /** text = stacked lines; rect / card / circle = single block */
  variant?: 'text' | 'rect' | 'card' | 'circle';
  /** CSS width (default 100%, or 48px for circle) */
  width?: string | number;
  height?: string | number;
  /** Line count for variant text */
  lines?: number;
  /** Override border radius */
  radius?: string;
}
/** Loading placeholder with a slow shimmer. Mirror the shape of the content that will replace it. */
export function Skeleton(props: SkeletonProps): JSX.Element;
