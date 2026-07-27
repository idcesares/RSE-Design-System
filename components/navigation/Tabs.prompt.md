Pill tab bar for switching between sections (program levels, unit locations).

```jsx
const [tab, setTab] = React.useState('infantil');
<Tabs tabs={[{id:'infantil',label:'Educação Infantil'},{id:'fundamental',label:'Ensino Fundamental'}]} activeId={tab} onChange={setTab} />
```

Implements the ARIA tablist pattern: the bar is a `role="tablist"`, each pill a `role="tab"` with
`aria-selected`, and only the active tab is in the tab order (Left/Right/Home/End move between tabs).
Give each tab a `panelId` and put `role="tabpanel"` + `aria-labelledby="tab-<id>"` on the panel you
render below, so the pair is announced as one widget. Pass `label` to name the bar ("Níveis de ensino").
