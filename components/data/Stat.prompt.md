# Stat

Impact figures — the "resultado" pillar made visible. Always compose 3–4 in a row with `gap: var(--space-7)`, never a single lonely stat.

```jsx
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'var(--space-7)'}}>
  <Stat value="+1.200" label="Escolas e unidades" accent="primary" />
  <Stat value="97%" label="Aprovação das famílias" accent="green" />
  <Stat value="26" label="Estados + DF" accent="orange" />
</div>
```

- On a purple band use `accent="inverse"` for every stat in the group.
- Vary accent hues across a group (the "rede" palette) but keep one shade family per group.
- `accent="yellow"` renders in `--tint-yellow-ink` (the derived yellow ink, themed): no official yellow reaches 3:1 on cream, so the
  figure would not be readable in the brand yellow.
- Numbers must be real and attributable; never invent figures as visual filler.
