Ink-background site footer — the reusable primitive behind the site ui kit's bespoke `SiteFooter`.

```jsx
<Footer logoSrc="/assets/logos/wordmark-white.svg" tagline="Aprender para a vida acontecer."
  columns={[{ title: 'Institucional', links: [{ label: 'Sobre a Rede', href: '#' }] }]}
  note="© 2026 Sesc. Todos os direitos reservados." />
```

Column count is driven by the `columns` array. The columns sit in an auto-fit grid (min 160px each): one per row at 360px, more as the width allows; nothing overflows. Text uses the on-ink tokens (titles `--rse-color-text-on-ink`, links and tagline `--rse-color-text-on-ink-muted`); use the white wordmark. Each column is a `nav` labelled by its title.

Plain HTML:

```html
<footer class="rse-footer">
  <div class="rse-footer__inner">
    <div class="rse-footer__brand">
      <img class="rse-footer__logo" src="/assets/logos/wordmark-white.svg" alt="Rede Sesc de Educação">
      <p class="rse-footer__tagline">Aprender para a vida acontecer.</p>
    </div>
    <div class="rse-footer__columns">
      <nav class="rse-footer__column" aria-label="Institucional">
        <p class="rse-footer__title">Institucional</p>
        <a class="rse-footer__link" href="#">Sobre a Rede</a>
      </nav>
    </div>
  </div>
  <div class="rse-footer__note">© 2026 Sesc. Todos os direitos reservados.</div>
</footer>
```
