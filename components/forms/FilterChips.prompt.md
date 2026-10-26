# FilterChips

Filtering for program and unit search — visible, tappable, instantly reversible, which matters more than a compact select on mobile.

```jsx
<FilterChips label="Nível de ensino" value={sel} onChange={setSel} options={[
  { id: 'infantil', label: 'Educação Infantil', count: 12 },
  { id: 'fundamental', label: 'Ensino Fundamental', count: 28 },
  { id: 'medio', label: 'Ensino Médio', count: 19 }
]} />
```

- Counts must be live result counts; a stale count is worse than none.
- Up to ~8 chips per group; beyond that use `Select` or `Menu`.
- Selected chips are solid primary — never colour chips by accent family (that reads as `Tag`, a label, not a control).
- Filters apply immediately; never pair with an "Aplicar" button.

## Plain HTML contract

Native attributes and the forwarded ref target `div.rse-filter-chips`. The optional `__label`
is an eyebrow. Name the `__options` group, and use `aria-pressed` on each native button to
communicate selection and drive CSS.

```html
<div class="rse-filter-chips">
  <div class="rse-filter-chips__label">Nível de ensino</div>
  <div class="rse-filter-chips__options" role="group" aria-label="Nível de ensino">
    <button class="rse-filter-chips__chip" type="button" aria-pressed="true">Ensino médio<span class="rse-filter-chips__count">3</span></button>
    <button class="rse-filter-chips__chip" type="button" aria-pressed="false">Educação infantil</button>
    <button class="rse-filter-chips__clear" type="button">Limpar</button>
  </div>
</div>
```

The count above is illustrative; replace it with verified live results. JavaScript must toggle
`aria-pressed`, filter results immediately, update counts, and show the clear button only when
selection exists. Clear resets every chip. With `multiple=false`, selecting a chip clears the
others and selecting the active chip clears the group. React calls `onChange` with the next id
array; the caller updates `value`. When no visible label is supplied, give the group an accessible
name in plain HTML (or provide `label` to the wrapper).
