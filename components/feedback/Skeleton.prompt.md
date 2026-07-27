# Skeleton

Loading state for program lists, unit search results and dashboards. Prefer it to `Spinner` whenever the final layout is known — it keeps the page from jumping.

```jsx
<Skeleton variant="card" />
<Skeleton variant="text" lines={3} />
<Skeleton variant="circle" width={56} />
```

- Match the real content shape and count; three card skeletons for a 3-up card grid.
- Shimmer is neutral grey only — never tint it with brand purple.
- Respects `prefers-reduced-motion` (animation is suppressed globally).
