# Adding or changing a component

The set is deliberately complete for this brand's use case (35 components). Before adding one,
check [components.md](components.md) and `guidelines/system-audit.card.html` — most "missing"
components are an existing one with a prop you haven't read.

Add a component when a pattern appears on **three or more** surfaces and cannot be expressed by
composing what exists. Otherwise compose it in the page.

## 1. Write the source

`components/<group>/Name.jsx` — groups are `core`, `brand`, `forms`, `navigation`, `feedback`,
`data`, `disclosure`, `overlay`.

```jsx
import React from 'react';
export function Name({ tone = 'primary', children }) {
  return React.createElement('div', { style: { /* tokens only */ } }, children);
}
```

Hard rules:

- **`React.createElement`, never JSX.** `scripts/sync-bundle.mjs` copies this file into
  `_ds_bundle.js` verbatim so static pages can load it with no build step; JSX is rejected.
- **One default export shape**: `export function Name`. The name must match the filename.
- **Tokens only** for colour, type, radius, shadow, motion, z-index. Layout geometry (a 20px
  checkbox box, a 16:10 media ratio) may be literal.
- **Prop shapes stay simple** — strings, numbers, booleans, arrays of plain objects, React nodes.
  Templates mount components through `<x-import>` HTML attributes; a prop that needs a class
  instance or a callback-returning-JSX will not survive.
- **Controlled by default.** Take `value`/`checked` + `onChange`, don't hide state, except for
  purely presentational open/close (`Menu`, `Accordion`) which support both.
- **Accessibility is part of the component, not the page**: roles, `aria-*`, keyboard handling and
  focus management live here. See the floor in [../AGENTS.md](../AGENTS.md#accessibility-floor).
  A native input behind custom chrome uses `className="rede-control-input"` — never `display:none`.

## 2. Write the types

`components/<group>/Name.d.ts` — every prop, each with a `/** short note */` where the name isn't
self-evident, plus one doc comment on the function. Both feed the generated
[components.md](components.md), so write them for a reader who has never seen the component.

```ts
import React from 'react';
export interface NameProps {
  /** What this does, in one line */
  tone?: 'primary' | 'success';
  children: React.ReactNode;
}
/** One sentence: what it is and when to reach for it. */
export function Name(props: NameProps): JSX.Element;
```

## 3. Write the usage doc

`components/<group>/Name.prompt.md` — the file an agent reads before using the component. Lead
with when to reach for it in this brand's context (enrollment, programmes, units), show a
realistic **pt-BR** example, then note variants and any accessibility contract the caller must
uphold (e.g. "always pass `label`").

## 4. Add it to a specimen card

Each group has one or more `*.card.html` specimens rendered in the design system browser. Add your
component to the relevant card, or create a new one and register it in `_ds_manifest.json` under
`cards` with `path`, `group`, `name`, `subtitle` and `viewport`.

## 5. Register it

- `_ds_manifest.json` → `components`: `{ "name": "Name", "sourcePath": "components/<group>/Name.jsx" }`
- `index.js` → `export { Name } from './components/<group>/Name.jsx';`
- `index.d.ts` → the matching type re-export.
- `_adherence.oxlintrc.json` → the prop allow-list entry, if you want the lint rules to cover it.

## 6. Sync and check

```bash
npm run sync    # mirror into _ds_bundle.js, refresh manifest tokens, regenerate docs
npm run check   # must pass
```

`npm run check` will fail if: a `.d.ts` or `.prompt.md` is missing, the component isn't in the
manifest or `index.js`, the bundle is stale, a token name collides, a `var()` points at an
undefined token, or a native input is hidden with `display:none`.

## Reviewing a change to an existing component

- Does the change belong to every consumer, or only to the page that prompted it? If only one
  page, do it in the page.
- Is the prop addition backwards compatible? Templates and the UI kit mount these by attribute;
  a renamed prop breaks them silently.
- Did you check dark and contrast themes? Re-check any colour you touched.
- Did you re-run `npm run sync`? An unsynced edit is a change that only exists in the source tree
  and nowhere on any actual page.
