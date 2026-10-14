# Integrating this design system

Everything else in this repo assumes you are working *inside* it. This page is the opposite:
how to put the Rede Sesc de Educação into something that is not this repo — a website, a React
app, a Python script that renders social posts, a print piece, a one-off artifact.

## The one idea

**[`brand.json`](../brand.json) is the contract.** Every colour resolved to a literal hex with its
CMYK, the full type and spacing scales, every logo, motif, pattern and icon indexed by role, and
the brand rules in machine-readable form. Anything that can parse JSON can consume this brand —
no CSS, no React, no npm, no build step.

The CSS and the React entry are conveniences layered on top of that contract, for the two cases
where the target happens to be a browser. They are not the system; the contract is.

```
brand.json
├── palette      21 colours — hex, rgb, cmyk, family, tone
├── tokens       181 tokens, every var() chain already resolved
├── themes       dark + contrast override maps, also resolved
├── scales       type / spacing / radius / shadow / layout, grouped and named
├── assets       logos, motifs, patterns, icons, fonts — by role, with paths
├── rules        colour, typography, logo, motif, language, content, accessibility
└── caveats      what is still unverified in this system
```

> `brand.json` is generated and is a **summary**. [AGENTS.md](../AGENTS.md) and
> [docs/brand-manual.md](brand-manual.md) are the source of truth. Where they disagree, they win.
> Never hand-edit `brand.json` — edit `tokens/*.css` or the docs and run `npm run sync`.

## Quick start

From this repo, bind the system into your project:

```bash
npm run bind ../my-project
```

That copies a self-contained `_ds/` folder into `../my-project` — contract, tokens, assets,
browser bundle, React entry — and stamps it with the version and a hash per file. There is no
registry and no network involved.

If your target never touches a browser (a Python generator, a print pipeline), take the smaller
tier — contract, tokens and artwork only, no JavaScript:

```bash
npm run bind ../my-generator -- --tier=brand
```

The bound folder also gets an `AGENTS.md` carrying the non-negotiables, so agents working in the
consuming repo inherit the rules instead of reaching for a raw hex, and a `check.mjs` so that repo
can answer "is my copy current?" without this one:

```bash
node _ds/check.mjs
```

## Pick your tier

| You are building | Load | Touches the host's styles |
| --- | --- | --- |
| A page that should look like the Rede | `_ds/styles.css` | Yes — restyles `body`, `a`, `h1–h4`, `p` |
| Something inside a site that already has its own styles | `_ds/tokens/tokens-only.css` | No |
| …and you want this system's components too | + `_ds/tokens/base-runtime.css` | Focus ring and two keyframes only |
| Static HTML with real components | + `_ds/_ds_bundle.js` | — |
| React | `import { Button } from './_ds/index.js'` | — |
| Next.js (App Router) | the same, but global CSS only in `app/layout.tsx` — [recipe](#recipe-nextjs-app-router) | — |
| A social post, poster, PDF, deck — anything not a browser | `_ds/brand.json` | — |

`tokens/base.css` is now just `base-runtime.css` + `base-reset.css`. Everything that already
links `styles.css` or `tokens/base.css` keeps working exactly as before; the split only matters
when you are adding this system to something that already has base styles of its own.

---

## Recipe: an existing site that has its own CSS

The lowest-friction tier, and the one to reach for when you cannot restructure the host — a
WordPress theme, a CMS page, someone else's app.

```html
<link rel="stylesheet" href="/_ds/tokens/tokens-only.css">
```

That file is `@font-face` and custom properties and nothing else: no element selectors, no class
rules, no keyframes. The host's typography, links and box-sizing are untouched. You then style
your own markup with the tokens:

```css
.enrollment-cta {
  background: var(--color-primary);
  color: var(--text-on-primary);
  border-radius: var(--radius-pill);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  padding: 12px 24px;
  min-height: var(--hit-target-min);
}
```

Add `tokens/base-runtime.css` as well if you use the components — it carries the focus ring, the
`.rede-control-input` hook that keeps Checkbox/Radio/Switch in the tab order, and the two keyframes
Spinner and Skeleton animate with. Skipping it breaks those components silently.

## Recipe: a static HTML page

```html
<link rel="stylesheet" href="/_ds/styles.css">
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<script src="/_ds/_ds_bundle.js"></script>
<script>
  const DS = window.RedeSescDeEducaODesignSystem_2167ce;
  ReactDOM.createRoot(document.getElementById('cta')).render(
    React.createElement(DS.Button, { variant: 'primary' }, 'Quero me inscrever')
  );
</script>
```

No build step. If you only need markup and no component behaviour, drop the three scripts and copy
[`starters/page.html`](../starters/page.html) instead — it is tokens-only and opens offline.

## Recipe: React

```jsx
import { Button, Card, Stat, Tabs } from './_ds/index.js';
import './_ds/styles.css';
```

Three things to know:

1. **Import from `index.js`, never from a component file.** `npm run check` (check-ds) forbids the
   direct path inside this repo so components can be re-pathed without breaking consumers.
2. **The `.jsx` files contain no JSX** — they are `React.createElement` calls, which is what lets
   the same sources run unbuilt in a browser. Any bundler that resolves `.jsx` handles them; no
   transform is required beyond that. `react >= 18` is a peer, not bundled.
3. **`assets/` must be served.** Copy `_ds/assets/` into your public directory, or point your
   bundler at it. See the next section for why the layout matters.

## Recipe: Next.js (App Router)

Next works, with two rules that are specific to it. Both come from the App Router treating every
file as a Server Component until told otherwise.

**1. Global CSS goes in `app/layout.tsx` and nowhere else.** Next rejects a global stylesheet
imported from any other file.

```tsx
// app/layout.tsx
import './_ds/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

Inside a site that already has base styles, import `./_ds/tokens/tokens-only.css` instead — plus
`./_ds/tokens/base-runtime.css` if you use the components, or Spinner, Skeleton and the
Checkbox/Radio/Switch focus behaviour break silently.

**2. Import components in a Client Component.** The 14 components that use hooks each carry a
`'use client'` directive, so they cross the boundary on their own:

```tsx
// app/page.tsx — a Server Component; this is fine
import { Card, Stat, Button } from './_ds/index.js';
```

Server-render whatever you can, and mark your *own* component `'use client'` only when it holds
state or passes an event handler down:

```tsx
'use client';
import { Tabs } from './_ds/index.js';

export function ProgramTabs({ tabs }) {
  const [active, setActive] = React.useState(tabs[0].id);
  return <Tabs tabs={tabs} activeId={active} onChange={setActive} />;
}
```

An event handler is the usual trap: `<Button onClick={...}>` from a Server Component fails, because
functions cannot cross the boundary — not a design-system problem, but this is where you will hit it.

**Fonts and assets.** `tokens/fonts.css` reaches for `../assets/fonts/Montserrat-Variable.woff2`,
a path relative to the CSS file. Keep `_ds/assets/` a sibling of `_ds/tokens/` and the bundler
resolves and emits it. Do not reach for `next/font` — it would fetch Montserrat from Google rather
than using the vendored file, and the `@font-face` block in `fonts.css` already declares the
variable weights this system needs.

`.jsx` resolves out of the box; the sources contain no JSX, so no transform is involved.

## Recipe: anything that is not a browser

This is the case the contract exists for. Read `brand.json`, use the assets, ignore the CSS
entirely. In any language:

```python
import json
brand = json.load(open("_ds/brand.json"))

purple = next(c for c in brand["palette"] if c["token"] == "--color-purple-dark")
purple["hex"]                       # '#6c62c4'   — screen
purple["cmyk"]                      # {'c': 67, 'm': 68, 'y': 0, 'k': 0}  — print
brand["tokens"]["--color-primary"]["value"]     # '#6c62c4'  — alias already followed
brand["scales"]["spacing"]["6"]                 # '32px'
brand["assets"]["fonts"][0]["file"]             # 'assets/fonts/Montserrat-Variable.woff2'
brand["rules"]["logo"]["minSize"]["digital"]    # '150px wide'
```

A complete worked example ships in [`docs/examples/social_post.py`](examples/social_post.py): a
1080×1080 social post rendered from `brand.json` with the **Python standard library and nothing
else** — no Pillow, no cairo, no npm. It embeds the Montserrat file and the official wordmark as
data URIs, so the output SVG is self-contained and rasterises to PNG with whatever tool you have
(a browser screenshot, Inkscape, `rsvg-convert`, `resvg`, ImageMagick).

```bash
python docs/examples/social_post.py --out anuncio.svg \
  --eyebrow "Matrículas abertas" \
  --headline "Aprender para a vida acontecer" \
  --hue green
```

It reads the clearspace and minimum-size rules out of `brand.json` rather than hard-coding them,
which is the pattern to copy: **the generator asks the contract what the rules are.**

For print, read `cmyk` instead of `hex` — never convert the hex yourself. The manual publishes
CMYK for all 20 palette values and they are not round-trips of the RGB. Pantone numbers do not
exist; the manual defers to Formula Guide comparison, so ask before committing to a spot-colour job.

---

## Five things that break

1. **`assets/` must stay a sibling of `tokens/`.** `tokens/fonts.css` reaches for
   `../assets/fonts/Montserrat-Variable.woff2`. Break that layout and the page silently falls back
   to a system font — no error, just wrong type. This is the most common integration failure.
2. **`styles.css` restyles the host.** It sets `body`, `a`, `h1–h4`, `p`, `*{box-sizing}` and
   `::selection` globally. That is correct for a page you own and wrong for a widget inside someone
   else's site. Use the tokens-only tier there.
3. **Editing `_ds/` in place.** Re-binding overwrites it. `node _ds/check.mjs` reports anything
   modified so you find out before the next update eats it. Need a change? Make it in this repo.
4. **A stale bundle.** `_ds_bundle.js` is a *mirror* of the component sources, not a second
   implementation. Editing a `.jsx` without `npm run sync` means every static page keeps running the
   old code. `npm run check` catches it here, before it ever reaches a consumer.
5. **Templates copied out of the repo.** Each carries a `ds-base.js` with a single `base` line
   pointing at the design system. Copy the folder, edit that one line to point at your `_ds/`
   (`'_ds'` at the project root, `'../_ds'` one level down). That line is the entire wiring.

## Updating a consumer

```bash
npm run bind ../my-project --check    # is their copy current?
npm run bind ../my-project            # bring it up to date
```

`--check` compares every file against this repo and reports version drift, missing files, files
edited in place, and files that are no longer part of the system. Re-binding removes exactly what
the previous bind put there and leaves anything else in the folder alone.

## What a consumer does not get

Bind ships the system, not the workshop. `guidelines/*.card.html`, `templates/`, `starters/`,
`ui_kits/`, `docs/` and `scripts/` stay here — they are for building the system and for learning it,
and a consuming project has no use for them. The reference artboards in `assets/logos/source/` and
the superseded raster logos do not travel either.

If you want a template, copy it out of this repo by hand and point its `ds-base.js` at the bound
`_ds/` folder.
