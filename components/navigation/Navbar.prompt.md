Sticky site header — the reusable primitive behind the site ui kit's bespoke `SiteHeader`. Translucent cream, blurred, thin bottom border.

```jsx
<Navbar logoSrc="/assets/logos/wordmark-purple.svg" logoAlt="Rede Sesc de Educação"
  links={[{ label: 'Programas', href: '#programas' }, { label: 'Unidades', href: '#unidades' }]}
  activeHref="#programas" ctaLabel="Encontre uma unidade" ctaHref="#unidades" />
```

String/array props only (no icon or nested-component slots) so it drops straight into templates. For a fully custom header layout, compose `IconButton`/`Button` directly instead.
