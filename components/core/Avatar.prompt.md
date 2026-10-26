Circular photo or initials avatar for students, staff, and testimonial bylines.

```jsx
<Avatar src="/photos/ana.jpg" alt="Ana Souza" size="md" />
<Avatar initials="MS" size="sm" status="online" />
```

Falls back to initials on a tinted purple field when no `src` is given — never invent a photo. `status` adds a small presence dot (online/offline/away), useful for staff directories or messaging contexts.

## Plain HTML contract

```html
<span class="rse-avatar rse-avatar--sm" aria-label="Maria Souza">
  <span class="rse-avatar__initials">MS</span>
  <span class="rse-avatar__status rse-avatar__status--online" aria-hidden="true"></span>
</span>
```

Sizes are `--sm`, `--md` (default), and `--lg`. For a real photo, replace the initials with
`<img class="rse-avatar__image" src="/photos/ana.jpg" alt="Ana Souza">`. Presence dots are decorative;
include meaningful availability in nearby text or the accessible name. React forwards the ref and
native span attributes to the outer span, and merges `className`.
