Sticky site header — the reusable primitive behind the site ui kit's bespoke `SiteHeader`. Translucent cream, blurred, thin bottom border.

```jsx
<Navbar logoSrc="/assets/logos/wordmark-purple.svg" logoAlt="Rede Sesc de Educação"
  links={[{ label: 'Programas', href: '#programas' }, { label: 'Unidades', href: '#unidades' }]}
  activeHref="#programas" ctaLabel="Encontre uma unidade" ctaHref="#unidades" />
```

String/array props only (no icon or nested-component slots) so it drops straight into templates. For a fully custom header layout, compose `IconButton`/`Button` directly instead.

- The row wraps; from 360px up nothing overflows. Below 48rem the links move to their own row under logo + call to action. Every link and the CTA are at least `--rse-hit-target-min` tall.
- The link matching `activeHref` gets `aria-current="page"`; in plain HTML set it yourself.
- Not included: a hamburger/drawer for narrow screens. That is roadmap P3.2 (SiteHeader with mobile nav); until then keep the link list short (about five).

Plain HTML:

```html
<header class="rse-navbar">
  <div class="rse-navbar__inner">
    <img class="rse-navbar__logo" src="/assets/logos/wordmark-purple.svg" alt="Rede Sesc de Educação">
    <nav class="rse-navbar__links" aria-label="Principal">
      <a class="rse-navbar__link" href="#programas" aria-current="page">Programas</a>
      <a class="rse-navbar__link" href="#unidades">Unidades</a>
    </nav>
    <a class="rse-navbar__cta" href="#unidades">Encontre uma unidade</a>
  </div>
</header>
```
