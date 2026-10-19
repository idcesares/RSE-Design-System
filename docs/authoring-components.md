# Adding or changing a component

The set is deliberately complete for this brand's use case (38 components). Before adding one,
check [components.md](components.md) and the component gallery in `showcase/index.html` — most "missing"
components are an existing one with a prop you haven't read.

Add a component when a pattern appears on **three or more** surfaces and cannot be expressed by
composing what exists. Otherwise compose it in the page.

## 1. Write the CSS contract, then the wrapper

Start with `components/<group>/Name.css`: a root class `.rse-name`, BEM elements
(`.rse-name__part`) and modifiers (`.rse-name--variant`). Every state is CSS — `:hover`,
`:focus-visible`, `:checked`, `:disabled`, `[aria-invalid="true"]` — so the component works in a CMS
page with no JavaScript. `npm run sync` wraps all of them in `@layer rse.components` in
`dist/components.css`; a raw colour fails the build.

Then `components/<group>/Name.jsx` renders that markup. Groups are `core`, `brand`, `forms`,
`navigation`, `feedback`, `data`, `disclosure`, `overlay`.

```jsx
import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
export const Name = React.forwardRef(function Name({ tone = 'primary', className, children, ...rest }, ref) {
  return React.createElement('div', { ref, className: cx('rse-name', tone !== 'primary' && 'rse-name--' + tone, className), ...rest }, children);
});
```

Another component is imported by relative path (`import { Icon } from '../core/Icon.jsx';`); the
bundle builder resolves it and orders the blocks.

Hard rules:

- **`React.createElement`, never JSX.** `scripts/build-bundle.mjs` copies this file into
  `dist/rse.js` verbatim so static pages can load it with no build step; JSX is rejected.
- **Export shape**: `export const Name = React.forwardRef(function Name(…))` (or `export function
  Name` for one that needs no ref). The name must match the filename.
- **No inline style objects, no hover in state.** Forward `ref`, spread `...rest` onto the main
  element, merge `className`, build ids with `React.useId` (never `Math.random`).
- **Tokens only** for colour, type, radius, shadow, motion, z-index. Layout geometry (a 20px
  checkbox box, a 16:10 media ratio) may be literal.
- **Prop shapes stay simple** — strings, numbers, booleans, arrays of plain objects, React nodes.
  Templates mount components through `<x-import>` HTML attributes; a prop that needs a class
  instance or a callback-returning-JSX will not survive.
- **Controlled by default.** Take `value`/`checked` + `onChange`, don't hide state, except for
  purely presentational open/close (`Menu`, `Accordion`) which support both.
- **Accessibility is part of the component, not the page**: roles, `aria-*`, keyboard handling and
  focus management live here. See the floor in [../AGENTS.md](../AGENTS.md#accessibility-floor).
  A native input behind custom chrome uses `className="rse-control-input"` — never `display:none`.

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

## 4. Give it a demo in the showcase

The showcase gallery lists every component in the manifest on its own. Add a demo for yours to
`showcase/demos.js` (a `render()` returning realistic pt-BR content, and `block: true` if it needs
the full card width) and a one-line pt-BR gloss to `GLOSS` in the same file. Components on the CSS
contract get the "HTML" tab automatically: it prints the markup the demo just rendered.

## 5. Register it

- `rse.manifest.json` → `components`: `{ "name": "Name", "sourcePath": "components/<group>/Name.jsx" }`
- `index.js` → `export { Name } from './components/<group>/Name.jsx';`
- `index.d.ts` → the matching type re-export.
- If it renders text on a new surface, add the pair to `scripts/contrast-pairs.mjs` — the audit
  gate and the showcase both read it.

## 6. Sync and check

```bash
npm run sync    # mirror into dist/rse.js, refresh manifest tokens, regenerate docs
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
