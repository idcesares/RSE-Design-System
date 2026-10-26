# Skeleton

Loading state for program lists, unit search results and dashboards. Prefer it to `Spinner` whenever the final layout is known — it keeps the page from jumping.

```jsx
<Skeleton variant="card" />
<Skeleton variant="text" lines={3} />
<Skeleton variant="circle" width={56} />
```

- Match the real content shape and count; three card skeletons for a 3-up card grid.
- Shimmer is neutral grey only — never tint it with brand purple.
- Unmanaged by the motion setting (it is not `.rse-motion-managed`): when `data-rse-motion` is reduced, the safety net in `tokens/base-runtime.css` suppresses the shimmer.

## Plain HTML contract

```html
<div class="rse-skeleton rse-skeleton--text" aria-hidden="true">
  <div class="rse-skeleton__line"></div>
  <div class="rse-skeleton__line"></div>
  <div class="rse-skeleton__line"></div>
</div>
<div class="rse-skeleton rse-skeleton--circle" aria-hidden="true" style="--rse-skeleton-width:56px"></div>
```

Variants are `--text`, `--rect`, `--card`, and `--circle`. Optional custom properties
`--rse-skeleton-width` and `--rse-skeleton-height` accept CSS lengths or percentages;
`--rse-skeleton-radius` accepts a `var(--rse-radius-*)` reference for non-text blocks.
The last text line is shortened automatically. Announce loading in a separate status message,
not on each decorative shape. React forwards the ref and native div attributes, merges
`className` and caller `style`, and writes only geometry custom properties inline. The existing
neutral shimmer uses themed surface/border roles and the loop duration token.
