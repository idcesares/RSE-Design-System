# Menu

Dropdown for the national + regional navigation problem: state/unit pickers, "Programas" sections, table row actions.

```jsx
<Menu label="Escolha o estado" items={[
  { heading: 'Sudeste' },
  { label: 'São Paulo', meta: 'exemplo', href: '#' },
  { label: 'Minas Gerais', meta: 'exemplo', href: '#' },
  { divider: true },
  { label: 'Ver todas as unidades', href: '#' }
]} />
```

- Group with `heading` entries once past ~7 items; never ship an ungrouped 20-item list.
- `trigger="link"` inside `Navbar`; the pill button elsewhere.
- Use `meta` for counts, not descriptions — long text belongs on a page, not in a menu.
- Not a select: for form input use `Select`.


## CSS contract and plain HTML

Link `styles.css`, or tokens + base runtime + `dist/components.css`. Native root attributes, `className` and a forwarded `ref` are supported.

```html
<div class="rse-menu">
  <button class="rse-menu__trigger" id="menu-trigger" aria-expanded="true" aria-haspopup="menu" aria-controls="menu-panel" type="button">Programas</button>
  <div class="rse-menu__panel" id="menu-panel" role="menu" aria-labelledby="menu-trigger">
    <a class="rse-menu__item" role="menuitem" tabindex="-1" href="/programas">Conheça os programas</a>
  </div>
</div>
```

The host must implement opening/closing, initial item focus, ArrowUp/ArrowDown/Home/End navigation, Escape with focus return, Tab exit, and outside dismissal. Render the panel only while open. React supplies these behaviors. `width` maps to the geometry property `--rse-menu-width`.
