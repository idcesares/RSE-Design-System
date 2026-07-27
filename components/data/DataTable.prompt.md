# DataTable

Schedules, turmas, unit listings, fee tables. Card-surface with a sunken uppercase header row — matches Card radius so tables sit naturally on the cream page.

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
