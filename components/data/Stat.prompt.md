# Stat

Impact figures — the "resultado" pillar made visible. Always compose 3–4 in a row with `gap: var(--rse-space-7)`, never a single lonely stat.

```jsx
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'var(--rse-space-7)'}}>
  <Stat value="000" label="Escolas e unidades" accent="primary" />
  <Stat value="00%" label="Aprovação das famílias" accent="green" />
  <Stat value="00" label="Estados participantes" accent="orange" />
</div>
```

- On a purple band use `accent="inverse"` for every stat in the group.
- Vary accent hues across a group (the "rede" palette) but keep one shade family per group.
- `accent="yellow"` renders in `--rse-color-tint-yellow-ink` (the derived yellow ink, themed): no official yellow reaches 3:1 on cream, so the
  figure would not be readable in the brand yellow.
- Numbers must be real and attributable; never invent figures as visual filler.

## Plain HTML contract

```html
<div class="rse-stat rse-stat--green rse-stat--center">
  <span class="rse-stat__value">[Dado a confirmar]</span>
  <span class="rse-stat__label">Escolas e unidades</span>
  <p class="rse-stat__description">Confirme o dado e a fonte antes da publicação.</p>
</div>
```

Accent modifiers match the React `accent` prop; `--sm` and `--lg` change the figure size, and
`--center` centres the group. The default size is medium and alignment is left. Accent colours
use themed text roles; `indigo` uses the indigo/link-hover role (light indigo, adapted in other themes). React forwards the ref and native div
attributes to the root, and merges `className`. All figures in examples require verification.
