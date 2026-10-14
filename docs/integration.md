# Using the design system from another project

Everything else in this repo assumes you are working *inside* it. This page is for a project that
**consumes** it: a regional site, the Sab.IA front end, the enrollment portal, a Python generator,
a deck handed over as a file. The rules that travel with the system are in
[RULES.md](../RULES.md) — read them once, they are short.

## Pick your route

| Your project | Route | What you link |
| --- | --- | --- |
| Has `npm` (React, Next.js, Vite, any bundler) | the **package** | `import '@idcesares/rse-design-system/styles.css'` |
| Cannot install (WordPress/Liferay theme, TOTVS portal, a static page you upload) | the **static kit** | `/rse/<version>/styles.css` on your server |
| Is not a browser (Python, print, a design tool) | either, then **JSON** | `brand.json`, `dist/tokens.json` |
| Is a one-off file (deck, mock, artifact) | a **starter** or **template** from this repo | `styles.css` next to it |

Both routes carry the same files at the same version. **Never edit them in place**: fix things
here, release, and update the version. That is what keeps thirty systems on one design.

## The package (GitHub Packages)

The package is published to GitHub Packages under the `@idcesares` scope. Tell npm where that scope
lives, once per project, with a token that can read packages:

```ini
# .npmrc
@idcesares:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm install @idcesares/rse-design-system
```

| Import | What it is |
| --- | --- |
| `@idcesares/rse-design-system` | React components (`react >= 18` is a peer) |
| `@idcesares/rse-design-system/styles.css` | everything: fonts, tokens, runtime base, element reset |
| `@idcesares/rse-design-system/tokens-only.css` | fonts + custom properties only — for a site with its own base styles |
| `@idcesares/rse-design-system/base-runtime.css` | what the components need (focus ring, control hiding, keyframes) |
| `@idcesares/rse-design-system/components.css` | the component CSS contract (`.rse-button`, `.rse-field`…), in `@layer rse.components` |
| `@idcesares/rse-design-system/tokens` | every token resolved per theme, as a typed ES module |
| `@idcesares/rse-design-system/tokens.json`, `/brand.json` | the same as JSON; the brand contract |
| `@idcesares/rse-design-system/bundle` | `dist/rse.js` — every component on `window.RSE` for unbuilt pages |
| `@idcesares/rse-design-system/assets/*` | logos, motifs, patterns, icons, fonts |
| `@idcesares/rse-design-system/tokens/src/*` | the DTCG source |

### React

```jsx
import { Button, Card, Stat, Tabs } from '@idcesares/rse-design-system';
import '@idcesares/rse-design-system/styles.css';
```

The `.jsx` files contain no JSX — they are `React.createElement` calls — so any bundler that
resolves `.jsx` handles them with no transform. Import from the package root, never from a file
under `components/`: component files will move when they become a CSS contract (roadmap P2).

## Recipe: Next.js (App Router)

Next works, with two rules that are specific to it. Both come from the App Router treating every
file as a Server Component until told otherwise.

**1. Global CSS goes in `app/layout.tsx` and nowhere else.** Next rejects a global stylesheet
imported from any other file.

```tsx
// app/layout.tsx
import '@idcesares/rse-design-system/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

Inside a site that already has base styles, import `@idcesares/rse-design-system/tokens-only.css` instead — plus
`@idcesares/rse-design-system/base-runtime.css` if you use the components, or Spinner, Skeleton and the
Checkbox/Radio/Switch focus behaviour break silently.

**2. Import components in a Client Component.** The 14 components that use hooks each carry a
`'use client'` directive, so they cross the boundary on their own:

```tsx
// app/page.tsx — a Server Component; this is fine
import { Card, Stat, Button } from '@idcesares/rse-design-system';
```

Server-render whatever you can, and mark your *own* component `'use client'` only when it holds
state or passes an event handler down:

```tsx
'use client';
import { Tabs } from '@idcesares/rse-design-system';

export function ProgramTabs({ tabs }) {
  const [active, setActive] = React.useState(tabs[0].id);
  return <Tabs tabs={tabs} activeId={active} onChange={setActive} />;
}
```

An event handler is the usual trap: `<Button onClick={...}>` from a Server Component fails, because
functions cannot cross the boundary — not a design-system problem, but this is where you will hit it.

**Fonts and assets.** `tokens/fonts.css` reaches for `../assets/fonts/Montserrat-Variable.woff2`,
a path relative to the CSS file inside the package, so the bundler resolves and emits it. Do not reach for `next/font` — it would fetch Montserrat from Google rather
than using the vendored file, and the `@font-face` block in `fonts.css` already declares the
variable weights this system needs.

`.jsx` resolves out of the box; the sources contain no JSX, so no transform is involved.

## The static kit (CMS, portals, uploads)

Every release attaches `rse-<version>.zip` to its GitHub Release (`npm run pack` builds the same
folder locally). Unzip it to a **versioned** path on a server you control and link it:

```html
<link rel="stylesheet" href="/rse/2.0.0/styles.css">
<!-- inside a site with its own typography, instead: -->
<link rel="stylesheet" href="/rse/2.0.0/tokens/tokens-only.css">
<link rel="stylesheet" href="/rse/2.0.0/tokens/base-runtime.css">
<link rel="stylesheet" href="/rse/2.0.0/dist/components.css">
```

Components that are on the CSS contract need no JavaScript at all — write the classes:

```html
<a class="rse-button" href="/matricula">Quero me inscrever</a>
<span class="rse-badge rse-badge--success">Vagas abertas</span>
<div class="rse-field">
  <label class="rse-field__label" for="nome">Nome completo</label>
  <input class="rse-input" id="nome" name="nome">
</div>
```

Which components are on the contract, and their markup: each `components/<group>/<Name>.prompt.md`
and `dist/components.css`. The rest still need React (below) until roadmap P2 moves them.

Then use `var(--rse-…)` in your own theme CSS. Components in an unbuilt page:

```html
<script src="/rse/2.0.0/assets/vendor/react.production.min.js"></script>
<script src="/rse/2.0.0/assets/vendor/react-dom.production.min.js"></script>
<script src="/rse/2.0.0/dist/rse.js"></script>
<script>const { Button, Card } = window.RSE;</script>
```

The version in the path is the point: a page links one version until someone moves it, and a new
release never changes a page that did not ask for it. The kit also carries `starters/`.

Themes work the same everywhere: `data-rse-theme="dark" | "contrast" | "auto"` on `<html>` or on any
section; no attribute means light, and `"light"` brings it back inside a section that set another theme.

## Recipe: anything that is not a browser

This is the case the contract exists for. Read `brand.json`, use the assets, ignore the CSS
entirely. In any language:

```python
import json
brand = json.load(open("node_modules/@idcesares/rse-design-system/brand.json"))  # or rse-<version>/brand.json from the static kit

purple = next(c for c in brand["palette"] if c["token"] == "--rse-brand-purple-dark")
purple["hex"]                       # '#6c62c4'   — screen
purple["cmyk"]                      # {'c': 67, 'm': 68, 'y': 0, 'k': 0}  — print
brand["tokens"]["--rse-color-primary"]["value"]     # '#6c62c4'  — alias already followed
brand["themes"]["dark"]["overrides"]                 # what changes in the dark theme
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

Need every token, per theme, including the ones `brand.json` leaves out (breakpoints)? Read
`dist/tokens.json`: `modes.light|dark|contrast` map every `--rse-*` name to a literal, and `tokens`
carries the type, description, derived flag and CMYK. The same data is an ES module with types at
`@idcesares/rse-design-system/tokens`.

The token *source*, `tokens/src/*.tokens.json`, is W3C DTCG — Style Dictionary, Tokens Studio and
other DTCG tools read it directly, which is the route into Figma variables or native apps.

---

## Things that break

1. **`assets/` must stay a sibling of `tokens/`.** `tokens/fonts.css` reaches for
   `../assets/fonts/Montserrat-Variable.woff2`. Break that layout (say, by copying only `tokens/`)
   and the page silently falls back to a system font.
2. **`styles.css` restyles the host.** It sets `body`, `a`, `h1–h4`, `p`, `*{box-sizing}` and
   `::selection` globally — right for a page you own, wrong inside someone else's site. Use
   `tokens-only.css` (+ `base-runtime.css`) there.
3. **Editing the package or the kit in place.** The next update overwrites it, and your system
   drifts from the other twenty-nine. Fix it upstream.
4. **Mixing versions.** One page, one version: never link `styles.css` from one version and
   `dist/rse.js` from another.
5. **Templates copied out of this repo.** Each carries a `ds-base.js` with one `base` line pointing
   at the design system root. Point it at the package folder or the unzipped kit.
