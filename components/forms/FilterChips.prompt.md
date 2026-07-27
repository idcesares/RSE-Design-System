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
