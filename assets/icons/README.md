# Icons

The system uses **[Lucide](https://lucide.dev)** as its icon set. `assets/icons/lucide/` holds the
vendored SVGs; `components/core/Icon.jsx` is **generated** from them by
`node scripts/build-icons.mjs`.

## Why Lucide

The `Icon` primitive was specified as a 24×24 grid with a 2px stroke inheriting `currentColor`.
That is exactly Lucide's drawing spec, so adopting it replaced the hand-drawn starter set with a
maintained library **without changing a single visual rule** — no restyling, no re-spacing, no
change to how `Button`/`IconButton` consume icons.

| | |
| --- | --- |
| Licence | **ISC** — commercial use allowed, keep the notice. `lucide/LICENSE` ships here. |
| Grid | 24×24, 2px stroke, round caps and joins |
| Size | 1,500+ glyphs upstream; 97 vendored here |
| Origin | community fork of Feather Icons, actively maintained |

Alternatives considered: Phosphor and Tabler (both MIT, both fine, but Phosphor's six weights and
Tabler's 5,900 glyphs are variety this brand does not need), Material Symbols (Apache-2.0, but its
variable-font delivery fights a build-step-free system), Heroicons (MIT, smaller and tied to
Tailwind's visual language).

## Vendored, not installed

The SVGs live in the repo instead of coming from npm or a CDN because static pages here load
`dist/rse.js` with no build step and must work offline. Vendoring also pins exactly what shipped.

## Adding an icon

```bash
curl -sSLo "assets/icons/lucide/<name>.svg" \
  "https://cdn.jsdelivr.net/npm/lucide-static@1.27.0/icons/<name>.svg"
node scripts/build-icons.mjs
npm run sync
```

Rules:

- **Never hand-draw a glyph** or paste a one-off SVG into a page. If an icon is missing, vendor it.
- Keep the version pinned across the set — mixing Lucide versions mixes drawing revisions.
- Icons carry no colour of their own. They inherit `currentColor`; set colour on the parent.
- Decorative icons render `aria-hidden`. Pass `title` only when the icon is the sole carrier of
  meaning, and write that title in pt-BR.

## What is vendored

97 glyphs chosen for this brand's surfaces: the original 21 utility icons (so nothing that used
the old set broke), plus education (`graduation-cap`, `school`, `book-open`, `backpack`,
`award`, `trophy`), enrollment (`file-text`, `file-check`, `clipboard-check`, `upload`, `id-card`,
`calendar-check`, `credit-card`), units and reach (`map-pin`, `map`, `navigation`, `building-2`,
`globe`), data and results (`chart-column`, `pie-chart`, `trending-up`, `target`, `activity`),
the Sab.IA platform (`sparkles`, `brain`, `bot`, `lightbulb`, `layout-dashboard`), accessibility
and theming (`accessibility`, `languages`, `contrast`, `sun`, `moon`, `eye`), plus the usual
navigation, status and media glyphs.

Run `node -e "console.log(require('fs').readdirSync('assets/icons/lucide'))"` for the current list,
or read the `IconName` union in `components/core/Icon.d.ts`.
