Thin rule for separating sections, form groups, or a vertical rule between toolbar items.

```jsx
<Divider />
<Divider label="ou" />
<Divider orientation="vertical" />
```

Uses `--border-subtle` only — never a heavier structuring device in this brand. `orientation="vertical"` needs a parent with an explicit height (e.g. a flex row) via `alignSelf: stretch`.
