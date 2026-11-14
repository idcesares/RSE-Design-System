# Adding or changing a component

The set is deliberately complete for this brand's use case (43 components). Before adding one,
check [components.md](components.md) and the component gallery in `showcase/index.html` — most "missing"
components are an existing one with a prop you haven't read.

Add a component when a pattern appears on **three or more** surfaces and cannot be expressed by
composing what exists. Otherwise compose it in the page.

## 1. Write the CSS contract, then the wrapper

Start with `components/<group>/Name.css`: a root class `.rse-name`, BEM elements
(`.rse-name__part`) and modifiers (`.rse-name--variant`). Every visual state is CSS — `:hover`,
`:focus-visible`, `:checked`, `:disabled`, `[aria-invalid="true"]`. Behavior such as dialog focus
management or menu keyboard navigation still needs a host controller. `npm run sync` wraps the CSS in `@layer rse.components` in
`dist/components.css`; a raw colour fails the build.

Then `components/<group>/Name.js` renders that markup. Groups are `core`, `brand`, `forms`,
`navigation`, `feedback`, `data`, `disclosure`, `overlay`.

```jsx
import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
export const Name = React.forwardRef(function Name({ tone = 'primary', className, children, ...rest }, ref) {
  return React.createElement('div', { ref, className: cx('rse-name', tone !== 'primary' && 'rse-name--' + tone, className), ...rest }, children);
});
```

Another component is imported by relative path (`import { Icon } from '../core/Icon.js';`); the
bundle builder resolves it and orders the blocks.

Hard rules:

- **`React.createElement`, never JSX.** `scripts/build-bundle.mjs` copies this file into
  `dist/rse.js` verbatim so static pages can load it with no build step; JSX is rejected.
- **Export shape**: `export const Name = React.forwardRef(function Name(…))` (or `export function
  Name` for one that needs no ref). The name must match the filename.
- **No visual inline styles, no hover styling in state.** Dynamic geometry may set documented CSS
  custom properties (e.g. progress percentage); all visual rules belong in CSS. Forward `ref`, spread `...rest` onto the main
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
Shared stylesheets must be registered in `scripts/lib/css-contract.mjs`, so the CSS builder,
audit and showcase agree. Document the controller needed for interactive plain HTML; copying
markup does not copy React event handlers.

## 5. Register it

- `rse.manifest.json` → `components`: `{ "name": "Name", "sourcePath": "components/<group>/Name.js" }`
- `index.js` → `export { Name } from './components/<group>/Name.js';`
- `index.d.ts` → the matching type re-export.
- If it renders text on a new surface, add the pair to `scripts/contrast-pairs.mjs` — the audit
  gate and the showcase both read it.

## 6. Sync and check

```bash
npm run sync    # mirror into dist/rse.js, refresh manifest tokens, regenerate docs
npm run check   # must pass
```

`npm run check` will fail if: a `.d.ts` or `.prompt.md` is missing, the component isn't in the
manifest or `index.js`, the bundle or `dist/components.json` is stale, a token name collides, a
`var()` points at an undefined token, a native input is hidden with `display:none`, the component
emits an `rse-*` class that no stylesheet defines (declare a deliberate hook in `HOOK_CLASSES`,
`scripts/lib/css-contract.mjs`, with its reason), a prop value in the `.d.ts` union builds a
modifier the CSS lacks, or a media query is off the breakpoint scale.

Write the props interface one prop per line with a `/** doc */` above anything not obvious, and a
`/** summary */` above the `export declare const`: `docs/components.md` and `dist/components.json`
are generated from them, and an interface on a single line is not read.

## Reviewing a change to an existing component

- Does the change belong to every consumer, or only to the page that prompted it? If only one
  page, do it in the page.
- Is the prop addition backwards compatible? Templates and the UI kit mount these by attribute;
  a renamed prop breaks them silently.
- Did you check dark and contrast themes? Re-check any colour you touched.
- Did you re-run `npm run sync`? An unsynced edit is a change that only exists in the source tree
  and nowhere on any actual page.

## The component rules in full

A component is these files. They move together:

```
components/<group>/Name.css        the CSS contract: .rse-name, BEM elements, --modifiers. Look and
                                   state live here (:hover, :focus-visible, :checked, [aria-*]).
components/<group>/Name.js        React wrapper that renders the contract (createElement form, no JSX)
components/<group>/Name.d.ts       props + one-line doc comment
components/<group>/Name.prompt.md  when to use it, a pt-BR example, and the plain-HTML markup
showcase/demos.js                  a demo for the showcase gallery (step 4 of docs/authoring-components.md)
```

**The CSS contract is the component; React is a convenience.** A CMS, the enrollment portal or a
static page uses the classes directly, so nothing visual may live only in JavaScript: no inline
style objects, no hover held in state. Wrappers forward `ref`, pass every other prop to the main
element (`...rest`), merge `className`, and build ids with `React.useId`. All 40 audited UI wrappers
are on the contract (`npm run audit` → `componentsOnCssContract`). IconButton shares `Button.css`,
and DateField shares `Input.css`; `scripts/lib/css-contract.mjs` records shared ownership. The 43
manifest entries also include generated Icon and BrandMotif, plus the MotifEngine function library.
CSS provides appearance and visual states; behavioral interactions still need a controller
(the React wrapper or host JavaScript). Geometry props may set documented CSS custom properties;
colours, typography, radii, shadows and motion stay in CSS and tokens.

Then:

```bash
npm run sync     # rebuilds tokens, dist/rse.js, brand.json and the generated docs
npm run check    # must pass
```

Rules:

- **`React.createElement` form, not JSX.** The bundle is a copy, not a compile; `build-bundle`
  rejects JSX. This is what lets static pages load components with no build step.
- A **new** component must also be registered in `rse.manifest.json` under `components` (name +
  sourcePath) and exported from `index.js`. `npm run check` fails until both are true.
- **Calls a hook? Line 1 is `'use client';`**, above the React import. `index.js` is a flat barrel,
  so a React Server Components host (Next.js App Router) pulls every component into the server
  graph on any import from it, and a hook without the directive fails *their* build. `npm run check`
  fails without it. The directive never reaches `dist/rse.js` — `build-bundle` strips it, so
  static pages are unaffected.
- Props are strings, arrays and plain objects wherever possible — templates mount components
  through `<x-import>` with HTML attributes, so exotic prop shapes don't survive the trip.
- **New components start on the contract** (a `.css` file first). The scope freeze of roadmap P0.3
  ended with P2.1; still check for an existing component with a prop before adding one.
- Don't add a component that duplicates an existing one with a prop. Check
  [components.md](components.md) and the gallery in `showcase/index.html` first.

Full checklist: this file.

## Changing tokens

1. Edit `tokens/src/*.tokens.json` — `brand` (tier 1, the palette), `color` (tier 2 roles),
   `typography`, `layout`, `effects`. The CSS name is the path: `rse.color.text-body` →
   `--rse-color-text-body`. An alias is `"{rse.brand.purple-dark}"`.
2. A role that differs per theme carries `$extensions.rse.modes.dark` / `.contrast`. **Brand values
   never change per theme** — only tier 2 re-maps. Aliases are followed for you: a token that points
   at a themed token is re-declared in each theme block automatically.
3. Text on a new surface? Add the pair to `scripts/contrast-pairs.mjs`.
4. `npm run sync`, then `npm run check`.

A component that reads a raw hex instead of a token is invisible to theming — that is exactly how
this system's chips ended up light-on-light in dark mode before the tint tokens existed.
