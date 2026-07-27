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
