# DataTable

Schedules, turmas, unit listings, fee tables. Card-surface with a sunken header row — matches Card radius so tables sit naturally on the cream page.

```jsx
<DataTable
  caption="Turmas 2026"
  columns={[{key:'programa',label:'Programa'},{key:'turno',label:'Turno'},{key:'status',label:'Status',align:'right'}]}
  rows={[{programa:'Ensino Médio', turno:'Manhã', status:<Badge tone="success">Vagas abertas</Badge>}]}
/>
```

- First column renders semibold as the row label — put the identifying value there.
- Cell values accept nodes: use `Badge` for status, `Tag` for program family.
- Use `compact` only for 10+ rows; default density suits the brand unhurried rhythm.

## Plain HTML contract

Use `.rse-data-table`, adding `--zebra` and/or `--compact` to the root for those variants.
The root ref and native attributes target the outer `div`. The focusable scroller lets keyboard
users scroll wide tables. No JavaScript is required. Column width is optional geometry supplied
through `--rse-data-table-column-width` on the header cell; alignment uses `__cell--left`,
`__cell--center`, or `__cell--right` on both header and body cells.

```html
<div class="rse-data-table rse-data-table--zebra">
  <div class="rse-data-table__scroller" tabindex="0" role="region" aria-label="Turmas de exemplo">
    <table class="rse-data-table__table">
      <caption class="rse-data-table__caption">Turmas de exemplo</caption>
      <thead><tr><th class="rse-data-table__cell" scope="col">Programa</th><th class="rse-data-table__cell rse-data-table__cell--right" scope="col">Turno</th></tr></thead>
      <tbody><tr><td class="rse-data-table__cell">Ensino médio</td><td class="rse-data-table__cell rse-data-table__cell--right">Manhã</td></tr></tbody>
    </table>
  </div>
</div>
```

For empty results, render a single `td.rse-data-table__empty` with `colspan` equal to the
column count and the message `Nenhum resultado.`. Captions and headers stay in sentence case.
