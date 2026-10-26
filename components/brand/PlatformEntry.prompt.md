The bridge from a Rede Sesc de Educação page into the **Plataforma Sesc Sab.IA** — the network's
adaptive-learning platform. Use it once per page, near the end of a marketing or programme page, so
a student, family or teacher reaches the platform in one click.

```jsx
<PlatformEntry
  href="https://…"                                   // ask Sesc for the real URL
  logoSrc="assets/logos/sabia-wordmark-cream.svg"
  title="Aprendizagem que acompanha cada estudante"
  ctaLabel="Acessar a plataforma"
  note="Acesso para estudantes, famílias e educadores da Rede."
/>

<PlatformEntry tone="cream" logoSrc="assets/logos/sabia-wordmark-purple.svg" />
```

Two tones: `purple` (solid Sab.IA purple band — the default, for a page's closing CTA) and `cream`
(quiet block inside the page flow). Pair the lockup with the tone: the cream wordmark on purple,
the purple wordmark on cream. Without `logoSrc` it falls back to a text eyebrow.

Write the copy about **what the student gets**, not about the technology: "acompanhamento contínuo
da aprendizagem", not "plataforma de IA adaptativa com analytics". Sab.IA is where learning is
diagnosed, personalised and followed; the TOTVS portal is where enrollment, secretaria and finance
live — never send someone here for a matrícula task.

`href` defaults to `#`, which is a placeholder, not a value: flag it to the user until Sesc supplies
the real platform URL.

## Plain HTML contract

Native section attributes and the forwarded ref target `.rse-platform-entry`. Add
`.rse-platform-entry--cream` for the cream variant. The Sab.IA surfaces and their paired
foregrounds remain fixed across themes. Hover is CSS; no JavaScript is required.

```html
<section class="rse-platform-entry" aria-label="Plataforma Sesc Sab.IA">
  <div class="rse-platform-entry__content">
    <span class="rse-platform-entry__eyebrow">Plataforma Sesc Sab.IA</span>
    <h2 class="rse-platform-entry__title">Aprendizagem que acompanha cada estudante</h2>
    <p class="rse-platform-entry__description">Acompanhamento contínuo da aprendizagem.</p>
    <p class="rse-platform-entry__note">Acesso para a comunidade da Rede.</p>
  </div>
  <a class="rse-platform-entry__link" href="#">Acessar a plataforma</a>
</section>
```

Replace the eyebrow with `img.rse-platform-entry__logo` when using an approved lockup, with
`alt="Plataforma Sesc Sab.IA"`. The note is optional. Replace the placeholder URL before publishing.
