Pill tab bar for switching between sections (program levels, unit locations).

```jsx
const [tab, setTab] = React.useState('infantil');
<Tabs tabs={[{id:'infantil',label:'Educação Infantil'},{id:'fundamental',label:'Ensino Fundamental'}]} activeId={tab} onChange={setTab} />
```

Implements the ARIA tablist pattern: the bar is a `role="tablist"`, each pill a `role="tab"` with
`aria-selected`, and only the active tab is in the tab order (Left/Right/Home/End move between tabs).
Give each tab a `panelId` and put `role="tabpanel"` + `aria-labelledby="tab-<id>"` on the panel you
render below, so the pair is announced as one widget. Pass `label` to name the bar ("Níveis de ensino").

On narrow screens the tab list scrolls sideways inside its own container (nothing is hidden and the page
never overflows); the list is padded so the focus ring is never clipped. Extra props and `className` go
on the outer `.rse-tabs` element, and a `ref` points at it.

Plain HTML (CSS contract, no JavaScript needed for the look; wire `aria-selected`, `tabindex` and `hidden` yourself):

```html
<div class="rse-tabs">
  <div class="rse-tabs__list" role="tablist" aria-label="Níveis de ensino">
    <button class="rse-tabs__tab" type="button" role="tab" id="tab-infantil" aria-selected="true" aria-controls="painel-infantil">Educação Infantil</button>
    <button class="rse-tabs__tab" type="button" role="tab" id="tab-fundamental" aria-selected="false" aria-controls="painel-fundamental" tabindex="-1">Ensino Fundamental</button>
  </div>
</div>
<div class="rse-tabs__panel" role="tabpanel" id="painel-infantil" aria-labelledby="tab-infantil">…</div>
<div class="rse-tabs__panel" role="tabpanel" id="painel-fundamental" aria-labelledby="tab-fundamental" hidden>…</div>
```
