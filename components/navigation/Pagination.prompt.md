Page-number control for long unit/program listings.

```jsx
<Pagination page={3} totalPages={12} onChange={setPage} />
```

Collapses distant pages to an ellipsis, always keeps first/last/current ±1 visible. Pairs well with `Tabs` for filtering + `Pagination` for paging the filtered results.
