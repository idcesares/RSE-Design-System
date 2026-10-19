# Hero

The opening block of a landing page or a program page: who we are, the promise, and the one or two actions that matter ("Quero me inscrever"). Use it once, at the top. For the closing call to action use `CtaBand`; for figures use `StatBand`.

```jsx
<Hero
  eyebrow="Rede Sesc de Educação"
  badge={<Badge tone="success">Vagas abertas</Badge>}
  title="Aprender para a vida acontecer"
  lead="Educação que acolhe, forma e transforma — em unidades por todo o Brasil."
  media={<image-slot id="hero-photo" shape="rounded" radius="32" placeholder="estudantes em sala, luz natural, estilo documental"></image-slot>}
>
  <Button variant="primary" size="lg">Quero me inscrever</Button>
  <Button variant="ghost" size="lg">Assista a nossa história</Button>
</Hero>
```

- **One h1 per page.** `title` renders as `h1`; if the page already has one, pass `as="h2"`.
- `media` is a node the caller supplies, normally an `<image-slot>` with a `placeholder` describing the shot. Hero never renders a default image or a fake photo. Without `media` the layout is one column, text capped at the prose width.
- `mediaPosition`: `end` (default) or `start`. Two columns collapse to one when a column would be narrower than 320px, with no media query; `start` puts the media first when stacked.
- `badge` sits beside the eyebrow: a `Badge` ("Vagas abertas") or a `Tag`. Enrollment dates are examples until verified, for instance "Inscrições até 00/00/0000".
- `tone`: `page` (default, cream page), `card`, or a band tone as in `CtaBand`. On a band tone the badge and buttons are the caller's to keep legible (use a variant that reads on that surface).
- Actions are children: at most two Buttons, `primary` first.

Plain HTML:

```html
<section class="rse-hero" aria-labelledby="hero-title">
  <div class="rse-hero__inner">
    <div class="rse-hero__content">
      <div class="rse-hero__meta">
        <p class="rse-hero__eyebrow">Rede Sesc de Educação</p>
        <span class="rse-badge rse-badge--success">Vagas abertas</span>
      </div>
      <h1 id="hero-title" class="rse-hero__title">Aprender para a vida acontecer</h1>
      <p class="rse-hero__lead">Educação que acolhe, forma e transforma — em unidades por todo o Brasil.</p>
      <div class="rse-hero__actions"><a class="rse-button rse-button--primary rse-button--lg" href="#">Quero me inscrever</a></div>
    </div>
    <div class="rse-hero__media"><image-slot id="hero-photo" placeholder="estudantes em sala, luz natural, estilo documental"></image-slot></div>
  </div>
</section>
```
Add `rse-hero--no-media` when there is no media block, and `rse-hero--media-start` to put it first.
