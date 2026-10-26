Thin rule for separating sections, form groups, or a vertical rule between toolbar items.

```jsx
<Divider />
<Divider label="ou" />
<Divider orientation="vertical" />
```

Uses `--rse-color-border-subtle` only — never a heavier structuring device in this brand. `orientation="vertical"` needs a parent with an explicit height (e.g. a flex row) via `alignSelf: stretch`.

## Plain HTML contract

```html
<div class="rse-divider rse-divider--labelled" role="separator" aria-orientation="horizontal">
  <span class="rse-divider__line"></span>
  <span class="rse-divider__label">ou</span>
  <span class="rse-divider__line"></span>
</div>
```

A plain rule needs only `.rse-divider`. A vertical rule uses
`<span class="rse-divider rse-divider--vertical" role="separator" aria-orientation="vertical"></span>`
inside a flex row with a defined height. React forwards the ref and native attributes to the outer
div (horizontal) or span (vertical), and merges `className`.
