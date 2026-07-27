Ink-background site footer — the reusable primitive behind the site ui kit's bespoke `SiteFooter`.

```jsx
<Footer logoSrc="/assets/logos/wordmark-white.svg" tagline="Aprender para a vida acontecer."
  columns={[{ title: 'Institucional', links: [{ label: 'Sobre a Rede', href: '#' }] }]}
  note="© 2026 Sesc. Todos os direitos reservados." />
```

Column count is driven by the `columns` array — the grid adapts automatically.
