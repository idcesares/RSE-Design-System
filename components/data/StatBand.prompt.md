# StatBand

The "resultado" pillar as a full-bleed band: 3–4 `Stat` figures on one flat colour. Use it instead of hand-rolling a grid of Stats on a coloured div.

```jsx
<StatBand tone="primary" title="A Rede em números" note="Números de exemplo: substituir por dados verificados antes de publicar.">
  <Stat value="000" label="Unidades" accent="inverse" align="center" />
  <Stat value="00 anos" label="De tradição" accent="inverse" align="center" />
  <Stat value="000 mil" label="Estudantes" accent="inverse" align="center" />
</StatBand>
```

- `tone` is the same set as `CtaBand`: `primary` (default) and `indigo` with white text, `ink` with on-ink text, and `pink`, `orange`, `yellow`, `green`, `blue` (plus `-light`) with ink text. One colour per band, no gradient.
- Children are `Stat`. Pass `accent="inverse"` on `primary`, `indigo` and `ink`; the default accent on light and mid accents. The band re-colours the Stat text to the tone's sanctioned colour either way, so a stray `accent` cannot make a figure unreadable. `Stat` itself is unchanged.
- The grid is `repeat(auto-fit, minmax(min(100%, 180px), 1fr))`: it wraps by itself down to one column at 360 px. Keep to four figures.
- Accessibility: the band is a `<section>` named by `title` (`aria-labelledby`); without a `title`, pass `aria-label`. The figures are a `<ul>`, so a screen reader announces the count.
- `note` renders small text under the figures (source, reference date). It has no default. Figures are examples until verified: while a page carries placeholder numbers, pass the note `Números de exemplo: substituir por dados verificados antes de publicar.` and tell the user which numbers need verification.

Plain HTML:

```html
<section class="rse-stat-band" aria-labelledby="numeros">
  <div class="rse-stat-band__inner">
    <h2 id="numeros" class="rse-stat-band__title">A Rede em números</h2>
    <ul class="rse-stat-band__list">
      <li class="rse-stat-band__item"><!-- Stat markup --></li>
    </ul>
    <p class="rse-stat-band__note">Números de exemplo: substituir por dados verificados antes de publicar.</p>
  </div>
</section>
```
