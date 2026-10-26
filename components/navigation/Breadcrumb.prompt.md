Path trail for deep pages — unit detail, program detail, portal sub-pages.

```jsx
<Breadcrumb items={[{ label: 'Unidades', href: '/unidades' }, { label: 'Sesc São Paulo' }]} />
```

The last item renders as plain (non-link) text with `aria-current="page"`. Keep to 2-4 levels; this brand's IA is shallow.

## Plain HTML contract

```html
<nav class="rse-breadcrumb" aria-label="Trilha de navegação">
  <ol class="rse-breadcrumb__list">
    <li class="rse-breadcrumb__item">
      <a class="rse-breadcrumb__link" href="/unidades">Unidades</a>
      <span class="rse-breadcrumb__separator" aria-hidden="true">/</span>
    </li>
    <li class="rse-breadcrumb__item"><span class="rse-breadcrumb__current" aria-current="page">Detalhes da unidade</span></li>
  </ol>
</nav>
```

Separators are decorative; keep `aria-current="page"` on the last item and the navigation label
on the root. React forwards the ref and native nav attributes to the nav, and merges `className`.
