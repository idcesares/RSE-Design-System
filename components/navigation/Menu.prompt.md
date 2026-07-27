# Menu

Dropdown for the national + regional navigation problem: state/unit pickers, "Programas" sections, table row actions.

```jsx
<Menu label="Escolha o estado" items={[
  { heading: 'Sudeste' },
  { label: 'São Paulo', meta: '48 unidades', href: '#' },
  { label: 'Minas Gerais', meta: '31 unidades', href: '#' },
  { divider: true },
  { label: 'Ver todas as unidades', href: '#' }
]} />
```

- Group with `heading` entries once past ~7 items; never ship an ungrouped 20-item list.
- `trigger="link"` inside `Navbar`; the pill button elsewhere.
- Use `meta` for counts, not descriptions — long text belongs on a page, not in a menu.
- Not a select: for form input use `Select`.
