# CtaBand

The closing call to action of a page ("Ainda com dúvidas?", "Matrículas abertas"). One per page, usually just above the footer. Not a hero: no image, at most two buttons.

```jsx
<CtaBand tone="ink" eyebrow="Fale conosco" title="Ainda com dúvidas?" description="Nossa equipe responde o mais rápido possível.">
  <Button variant="primary" size="lg">Fale conosco</Button>
</CtaBand>
```

- `tone`: `primary` (default) and `indigo` carry white text; `ink` carries on-ink text; `pink`, `orange`, `yellow`, `green`, `blue` and their `-light` versions carry ink text. One colour per band, flat, never a gradient, never white on an accent.
- Buttons are children. Pick the variant that reads on the band: on `primary`/`indigo`/`ink` use a variant that is legible on a dark surface; on accent tones use `primary` or `secondary` and check the pair in the showcase.
- `title` renders as `h2` by default; pass `as` to fit the page outline.
- `align="left"` for a band beside left-aligned content; the text block stays within `--rse-container-prose`.

Plain HTML:

```html
<section class="rse-cta-band rse-cta-band--ink">
  <div class="rse-cta-band__inner">
    <p class="rse-cta-band__eyebrow">Fale conosco</p>
    <h2 class="rse-cta-band__title">Ainda com dúvidas?</h2>
    <p class="rse-cta-band__description">Nossa equipe responde o mais rápido possível.</p>
    <div class="rse-cta-band__actions"><a class="rse-button rse-button--primary rse-button--lg" href="#">Fale conosco</a></div>
  </div>
</section>
```
