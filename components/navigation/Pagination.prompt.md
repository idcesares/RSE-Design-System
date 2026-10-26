Page-number control for long unit/program listings.

```jsx
<Pagination page={3} totalPages={12} onChange={setPage} />
```

Collapses distant pages to an ellipsis, always keeps first/last/current ±1 visible. Pairs well with `Tabs` for filtering + `Pagination` for paging the filtered results.

## Plain HTML contract

Native attributes and the forwarded ref target `nav.rse-pagination`. Use real buttons with
`type="button"`, native `disabled` at the bounds, and `aria-current="page"` on the active page.
Previous/next buttons may contain the vendored chevron Icon markup with their pt-BR labels.

```html
<nav class="rse-pagination" aria-label="Paginação">
  <button class="rse-pagination__button" type="button" aria-label="Página anterior" disabled>Anterior</button>
  <button class="rse-pagination__button" type="button" aria-label="Página 1" aria-current="page">1</button>
  <button class="rse-pagination__button" type="button" aria-label="Página 2">2</button>
  <span class="rse-pagination__ellipsis">…</span>
  <button class="rse-pagination__button" type="button" aria-label="Página 5">5</button>
  <button class="rse-pagination__button" type="button" aria-label="Próxima página">Próxima</button>
</nav>
```

CSS supplies appearance only. JavaScript must load the requested results, update
`aria-current` and disabled bounds, and rebuild the visible page window. React calls `onChange`
with the requested page; the caller updates `page` and results. Provide positive page counts
and a current page within range.
