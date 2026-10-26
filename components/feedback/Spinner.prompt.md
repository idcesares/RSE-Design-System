# Spinner

Compatibility adapter for `MotifLoader variant="inline"`. New work should use MotifLoader directly;
there is one loading implementation and no separate rotating ring. Existing `size`, `tone`, native
attributes, className and refs remain supported.

```jsx
<MotifLoader variant="inline" size={20} tone="inverse" label="Enviando dados" />
<Spinner size={24} />
```

Inline loading uses generated three-bar triangle geometry, not an animated signature construction.
It assembles and fades; reduced motion removes travel and doubles the fade cycle. Use inverse tone
on primary/ink surfaces and primary tone on page/card surfaces. Name the operation through
`aria-label` when using the compatibility wrapper.

## Plain HTML contract

Use the compact `.rse-motif-loader.rse-motif-loader--inline.rse-motion-managed` markup documented
in `MotifLoader.prompt.md`. `.rse-spinner` is retained as a compatibility class, not a second visual
contract. Link the system styles so MotifLoader.css is available.
