# Changelog

## 2.0.0 — 2026-10-14 — one source, one name, one package

Breaking, by design: nothing consumed 1.x, so there are no aliases. Every token, the theme
attribute, the bundle global and several file paths changed. Decisions D1–D6 in
`docs/roadmap/roadmap.md`.

### Tokens: a DTCG source, tiers, and names that say what they are

- **Source of truth is `tokens/src/*.tokens.json`** (W3C DTCG). `scripts/build-tokens.mjs`
  generates `tokens/tokens.css`, `dist/tokens.json` (every token resolved per theme),
  `dist/tokens.js` + `.d.ts`, and the manifest entries. The six hand-written token CSS files and
  `sync-tokens.mjs` are gone.
- **`--rse-<category>-<role>` everywhere.** Tier 1 `--rse-brand-*` is the palette (official 20 with
  CMYK, plus the derived inks, ink, grays); tier 2 `--rse-color-*` holds every role components read
  (`--rse-color-text-body`, `--rse-color-danger-text`, `--rse-color-tint-pink-ink`…); scales are
  `--rse-font-size-*`, `--rse-space-*`, `--rse-radius-*`, `--rse-shadow-*`, `--rse-duration-*`, etc.
  The colour/size collision that rule 2 used to police cannot happen any more.
- **Themes are `data-rse-theme="dark" | "contrast" | "auto"`.** `auto` follows
  `prefers-color-scheme`. A theme block re-declares every alias that reaches a themed token, so a
  themed section nested inside a light page now gets the right values (before, `--a: var(--b)`
  kept its `:root` value).
- **Removed:** the sampled `--cube-*` values (the rule forbids sampling artwork), unused
  `--color-accent-*` / `--color-secondary` aliases, `--shadow-inset`, `--grid-columns`,
  `--letter-spacing-normal`, `--line-height-loose`, `--state-*-layer`, and `--container-max`
  (merged into `--rse-container-xl`). Breakpoints left the CSS (it cannot read `var()` inside
  `@media`) and live in `dist/tokens.json` / `brand.json` → `scales.breakpoints`.
- **Fluid:** H1–H3 and display sizes scale with `rem + vw` (so they also scale with zoom);
  `--rse-container-padding` is 16px on a phone and 24px from ~600px.

### Components: the CSS contract (roadmap P2.1–P2.4)

- **Twelve components are now a CSS contract first**: Button, IconButton, Card, Tag, Badge, Alert,
  Input, Select, Textarea, Checkbox, Radio, Switch. Each has a `components/<group>/<Name>.css`
  (`.rse-button`, `.rse-field`, `.rse-choice`…) built into `dist/components.css` inside
  `@layer rse.components`; `styles.css` puts the reset in `@layer rse.base`. A CMS or the portal
  can use the classes with no JavaScript; host styles win without `!important`.
- **The React components render that markup**: `forwardRef`, every native prop passed through,
  `className` merged, ids from `useId`. No inline style objects and no hover held in state, so
  hover, focus and checked states exist before hydration and on touch.
- **Behaviour fixes that came with it**: Input/Select wire their message with `aria-describedby`
  and `aria-invalid`; text fields keep the visible focus ring (the pale shadow alone was not one);
  Select draws its chevron with `Icon` (no raw-hex data URI); Alert is `role="status"` unless
  `urgent`, and shows its tone as an icon; Card with `href` makes the title the link and stretches
  it over the card, so footer buttons are no longer nested inside a link — without `href` the card
  is static; Checkbox/Radio/Switch states follow `:checked`, and the Switch's off track now clears
  3:1; Button takes `href` and `block`.
- **No more Unicode glyphs as icons**: `×`, `▾`, `‹ ›`, `✓` in Modal, Toast, FileUpload, Stepper, Menu
  and Pagination are `Icon`s. Components can import each other; the bundle orders them.
- Modal and Tooltip ids come from `useId` (no `Math.random`, no hydration mismatch).
- `tokens/base.css` is gone; `styles.css` imports the pieces directly.

### Tests in a real browser (roadmap P2.5)

`npm run test:pages` (`scripts/test-pages.mjs`) opens every shipped page in Chromium at 1280px and
360px: runtime errors fail; axe-core WCAG 2.2 AA violations and horizontal overflow on a phone are
ratcheted against `scripts/test-pages-baseline.json`. It runs in CI and before every release.
Specimen pages gained `lang="pt-BR"` and a `<title>`.

### Package and release

- Published as **`@idcesares/rse-design-system`** on GitHub Packages, with subpath exports
  (`/styles.css`, `/tokens-only.css`, `/tokens`, `/tokens.json`, `/brand.json`, `/bundle`,
  `/assets/*`). `LICENSE` (Sesc internal use; to be confirmed by Sesc legal) and `RULES.md` (the
  short rules for consuming projects) ship inside it.
- **Static kit** for sites that cannot `npm install`: `npm run pack` → `dist/static/rse-<version>/`,
  attached as a zip to each GitHub Release.
- `.github/workflows/release.yml`: on a `v*` tag matching `package.json` and a CHANGELOG section,
  runs `check`, publishes, and creates the release.

### Bundle

- `_ds_bundle.js` → **`dist/rse.js`**, on **`window.RSE`**. `scripts/build-bundle.mjs` regenerates
  it whole from the manifest each time (it used to be patched in place and still carried the ui kit
  and a second copy of `image-slot.js`). `_ds_manifest.json` → `rse.manifest.json`.

### Removed (D6)

`ui_kits/site/` (a second, older landing page), the five superseded raster logos,
`_adherence.oxlintrc.json`, `scripts/bind.mjs` (replaced by the package and the static kit) and
`scripts/sync-bundle.mjs`. CSS class hooks are `rse-control-input` / `rse-control-box`; keyframes
`rse-spin` / `rse-shimmer`.

### Docs

`readme.md` is the brand brief only (the history of passes is here, below). Known gaps live in one
place, `docs/known-gaps.md`. `docs/integration.md` is rewritten around the package and the kit.
`docs/tokens.md` shows every token's value in all three themes. Several specimens and the showcase
used status *indicator* colours for text; they now use the `-text` roles.


### Before 2.0 in this cycle: roadmap phase 0 and P1.1–P1.2 (decisions D1–D3)

**Every rendered colour pair now meets its floor — 0 of 108 fail across the three themes (was 18
of 63 in the earlier set).** The fix is in the tokens, not the brand: the official `-dark` tones sit
at 3.4–4.1:1 against both white and ink, so nothing small can be written in them.

- **Derived inks (D2).** `--color-{pink,orange,green,blue,purple,yellow}-ink`, one deep step per
  hue, marked *derived*. Light-theme `--tint-*-ink` now point at them: every Tag clears 6.2:1.
- **Status colours split into roles.** `--success-text` / `--warning-text` / `--danger-text` /
  `--info-text` for words; the bare `--success`… stay as indicators (dots, borders, icons). Badge,
  Alert, the error and required markers of Input, Textarea, DateField and FileUpload, and the
  DateField deadline chip use the text role. Field errors went from 3.75:1 to 9.1:1.
- **`--text-on-primary-tint`** for text on the pale purple: secondary Button, Menu hover, Avatar
  initials, Badge `primary`, the ui kit and program page links (4.29 → 5.29:1).
- **`--sabia-on-blue`**: Sab.IA chrome text is ink (6.17:1), not white (2.27:1).
- **`Stat accent="yellow"`** renders the themed yellow ink; no official yellow reaches 3:1 on cream.
- **Accent bands (D3).** Pages may use a light or mid accent band with ink text; the rule changed
  in `AGENTS.md`, `readme.md`, `brand-manual.md`, `brand.json` rules and the rules `bind` ships.
- **The gate.** `npm run check` now ends with `audit --strict`: any failing pair, any pair naming a
  missing token, or any debt count above `scripts/audit-baseline.json` fails it. Pairs live in
  `scripts/contrast-pairs.mjs`, which the showcase's contrast table now reads too — it can no
  longer test only the pairs that pass.
- **Direct component imports** are now an error in `check-ds`; `_adherence.oxlintrc.json`, which
  nothing ran, is documented as tool metadata. `lint:adherence` (whose config no longer parsed) is gone.
- **CI.** `.github/workflows/ci.yml` runs `npm run check` on every PR and keeps the audit JSON.
- **Scope freeze** on new components until the CSS contract lands (`AGENTS.md`).
- Specimens: the semantic colour card shows the three roles instead of white text on status
  colours (which failed); the accent card shows the inks.

### `docs/roadmap/` — where the system stands, and the plan to make it the ecosystem's foundation

[`assessment.md`](docs/roadmap/assessment.md) scores the system on ten dimensions with measured
evidence: the brand layer is strong; the product layer is React-only, inline-styled, not
responsive, and fails its own contrast floor on 18 of 63 rendered colour pairs (every Tag, every
Badge, input errors). [`roadmap.md`](docs/roadmap/roadmap.md) turns that into a target
architecture (brand → tokens → CSS contract → React wrappers), conformance levels for the systems
that adopt it, the decisions that need an owner, and work packages whose acceptance is a number.

### `npm run audit` — the quality scorecard

New `scripts/audit.mjs`. Where `check` asks whether the repo is consistent, `audit` asks whether
what it ships is good: contrast of every pair the components render in all three themes, raw
values and glyph icons in components and templates, responsiveness, and docs that disagree with
the manifest. Not part of `check` yet — the baseline fails on purpose; roadmap P1.2 makes it a gate.

### Documentation contradictions fixed

Component count in `readme.md` (35 → 36), pattern hues (`readme.md` said red, `brand-manual.md`
said only green/pink/blue — the SVGs are blue, green, orange, pink), the motif recolouring rule in
`brand-manual.md` and the "placeholder" wording in `AGENTS.md` now agree with rule 10, and a stale
note about `/* derived */` markers is gone.

## 1.5.0 (unreleased) — the showcase, and what it found

### `showcase/index.html` — the system presented as one page

A single self-contained document that opens by double-click: why the system exists, the same page
built with and without it, the foundations, all 36 components running live, the three themes side
by side, the four templates in frames, and the open caveats. Built for showing the work to people
who do not build screens, and useful to those who do.

It cannot drift, because it transcribes nothing: components come from `_ds_bundle.js`, palette and
scales from `brand.json` through the generated `showcase/showcase-data.js`, counts from
`_ds_manifest.json`, and the semantic colours are measured from the live DOM. New
`scripts/build-showcase.mjs`, wired into `npm run sync` and `npm run check`.

### The ui kit opened blank outside a web server — no more Babel, no more CDN

Clicking through to the marketing site from the showcase gave a blank page. `ui_kits/site/index.html`
was the one artefact that loaded `@babel/standalone` from a CDN and compiled its screens at runtime
with `<script type="text/babel" src="…">`. Babel fetches such a `src` over XHR, and a `file://` page
is not allowed to — so the page only ever worked behind a web server, which is exactly what the
showcase's "open it by double-clicking" premise is not.

The four screens are now `React.createElement` — the form `AGENTS.md` already required of the rest
of the repo, and the form `_ds_bundle.js` was already mirroring them in. The page loads vendored
React plus the bundle and mounts from it; the separate screen scripts turned out to be redundant.
`ui_kits/site/*.jsx` became `*.js`. Verified on `file://`: renders, and makes **zero** network
requests.

React 18.3.1 UMD moved to `assets/vendor/`, shared by the ui kit and the showcase.

`sync-bundle.mjs` used to skip a tracked source that no longer existed, so renaming one left a dead
entry that failed `check-ds` on every later run with no fix but hand-editing a generated file. It now
prunes the entry and reports it.

### The motif alternates hue — `BrandMotif` gains `hue`

Sesc's sheet ships the six constructions in three families (green, blue, pink), and the system
previously refused to recolour them, telling you to ask Sesc for the other three. The design owner
authorised recolouring, so `BrandMotif` now takes `hue` and reaches all six palette families.

Omit the prop and a construction renders the supplied fills byte for byte — that path is unchanged.
Pass one and the fills are remapped onto a ramp built from the manual's published `light → base →
dark` for that family, never from sampling the artwork (known gap 9 still stands). The remap keys on
each shade's **luminance rank**, not on a flat hue rotation: `cube` uses six distinct greens, `frame`
four pinks, the rest three each, and the ordering of those shades is what makes an impossible cube
read as a solid. Ramp endpoints land exactly on the published palette values; intermediate steps are
interpolated for constructions that need more than three.

Geometry is still untouchable, and the motif still takes no theme. Rule 10 in `AGENTS.md`, known gap
4, `readme.md`, `BrandMotif.prompt.md` and the caveat in `brand.json` were all rewritten — they had
forbidden exactly this, and would otherwise have contradicted the code. Purple, orange and yellow
should be described as **derived**, not supplied, and official artwork should replace them if Sesc
produces it.

The showcase's motif section now carries the alternation as a control, next to the six constructions.

### The showcase drops its caveats section

Removed at the owner's request, along with the code and generated data behind it. The open caveats
remain in `readme.md` and `AGENTS.md`; `showcase/README.md` notes where they went and why it matters
that the placeholder content inside the artefacts is still placeholder.

### Three contrast defects the showcase found on its first run

The page computes WCAG ratios from the colours the browser has actually resolved, rather than
asserting compliance. Switching it on surfaced three failures against this system's own
accessibility floor — none had ever been calculated. All three are fixed, with tones that already
existed in the scale; the table now reads 9 of 9 in all three themes.

- **`--text-muted` was `--gray-500`**, giving **3.56:1** on the cream page, **3.96:1** on a white
  card and **3.50:1** on a sunken surface. This token carries real body copy — card descriptions,
  lead paragraphs, help text. Now `--gray-600`: **5.91 / 6.59 / 5.83:1**. No new colour; the tone
  already existed in the neutral scale. The dark and contrast themes override `--text-muted`
  separately and were already above the floor, which is why only the default was wrong.
- **`Footer`'s note reached past the semantic layer** for `--gray-500` directly, landing at
  **3.53:1** on the ink footer — while the tagline and links beside it already used `--gray-400`
  at 5.61:1. The note now matches its siblings.

- **Controls drew their resting border with `--border-default`** (`--gray-300`) at **1.61:1**
  against the white card they sit on. Those controls fill with `--surface-card` — the same colour
  as the surface behind them — so the border is the only thing identifying the control, and WCAG
  1.4.11's 3:1 applies. All eleven now use `--border-strong` (3.96:1): `Input`, `Textarea`,
  `Select`, `DateField`, `FileUpload`, `Checkbox`, `Radio`, `FilterChips`, `Stepper`, `Menu`'s
  trigger and `Button`'s ghost variant, plus the matching `.btn-ghost` in `starters/page.html`.
  The dark theme's `--border-strong` was lifted from `#6b697a` to `#7a7890`, the lightest value
  that clears 3:1 on all three of its surfaces (card 3.62, page 4.02, sunken 3.16) — at the old
  value the fix would have landed at 2.89:1 and quietly still failed.

**`--border-default` vs `--border-strong` is now a documented rule**, not a matter of taste
(`tokens/colors.css`): subtle and default are decoration and may sit below 3:1; strong is the
resting boundary of an interactive control and may not. Dividers, table rules, specimen outlines
and the deck's agenda keep the light hairline.

## 1.4.0 — 2026-07-26 — integration surface

The system could always be *built in*. It could not be *taken elsewhere*: nothing described how to
add it to a website, and nothing outside a browser could read it at all. This release makes it
consumable — see the new **[docs/integration.md](docs/integration.md)**.

### `brand.json` — the language-agnostic contract

`_ds_manifest.json` was already a machine index, but it speaks CSS: 58 of its 266 token values were
`var()` chains that only a browser can follow, and it had no CMYK, no asset index and no version.
The new generated `brand.json` closes all four:

- **Every value resolved to a literal.** `--color-primary` is `#6c62c4`, not
  `var(--color-purple-dark)`. Both are kept — `value` resolved, `raw` as authored.
- **CMYK on every palette colour**, parsed from the manual's published table in
  `docs/brand-manual.md` and cross-checked against the trailing comments in `tokens/colors.css`.
  `build-brand.mjs` warns on any disagreement, so the drift that caused known gap 9 cannot recur
  silently. RGB is computed from the hex, since the manual's own printed RGB disagrees with its hex
  for `--color-orange` and the hex governs digital.
- **Assets indexed by role** — logos with their version (principal / secundária / simplificada) and
  the surface each belongs on, motifs and patterns with their hue *derived from the artwork's own
  fills*, the 97 Lucide glyphs, the font files.
- **Rules in machine-readable form**, so a generator can check its own output: clearspace, minimum
  sizes, weight range, the two-background-colours limit, the accessibility floor.

It is generated and it is a summary — `AGENTS.md` and `docs/brand-manual.md` remain the authority.

### The base layer split, so the system stops restyling its host

`tokens/base.css` was a global reset: `*{box-sizing}`, `body`, `a`, `h1–h4`, `p`, `::selection`.
Linking `styles.css` into an existing site therefore restyled that site's typography and links.
It is now two files behind the same entry point:

| | |
| --- | --- |
| `tokens/base-runtime.css` | focus ring, `.rede-control-input`, the two keyframes — components need it |
| `tokens/base-reset.css` | the global element styling — opt in |
| `tokens/tokens-only.css` | custom properties and `@font-face` only, zero element selectors |

`styles.css` and `tokens/base.css` compose to exactly what they were before, so nothing that
already links them changes.

### `npm run bind`

```bash
npm run bind ../my-project                 # contract + tokens + assets + bundle + React entry
npm run bind ../my-generator -- --tier=brand   # contract + tokens + assets, no JavaScript
npm run bind ../my-project -- --check      # is their copy current?
```

No registry, no network, no build step — binding is a copy plus a stamp. `_ds/BIND.json` records
the version and a hash per file; `_ds/check.mjs` travels with the copy so a consuming repo can
answer "am I stale?" on its own. Re-binding removes exactly what the previous bind wrote and leaves
anything else alone. Reference artboards and the superseded raster logos do not travel.

Every bound folder also gets an `_ds/AGENTS.md` carrying the non-negotiables, so agents working in
the consuming repo inherit the rules rather than reaching for a raw hex.

### `docs/examples/social_post.py`

A 1080×1080 social post rendered from `brand.json` with the **Python standard library and nothing
else** — no Pillow, no cairo, no npm. It embeds the Montserrat file and the official wordmark as
data URIs, and reads the clearspace and minimum-size rules out of the contract instead of
hard-coding them. It exists to prove the claim: this is not a web-only design system.

## 1.3.0 — 2026-07-25 — brand manual pass

Sesc supplied the full brand manual (*Manual da Rede Sesc de Educação*, Sesc DN 2026, 98pp). It is
extracted in **`docs/brand-manual.md`**, which is now the place to settle brand questions.

### Palette re-corrected — against the manual this time

1.2.0 corrected the palette against the supplied vectors. That was the wrong authority: the vendor's
own artwork sits 1–3 points below the vendor's published spec (the selo PDF draws the purple as
`#6b62c2` where the manual publishes `#6c62c4`). The manual is newer and governs RGB/digital, so
every brand hex is now the manual's value — reverting most of the 1.2.0 shift.

| | 1.2.0 | now | | | 1.2.0 | now |
| --- | --- | --- | --- | --- | --- | --- |
| purple (primary) | `#6b62c2` | **`#6c62c4`** | | blue | `#75b1db` | **`#76b3dd`** |
| indigo | `#4b549c` | **`#4c549e`** | | blue light | `#90c2e4` | **`#92c4e6`** |
| purple light | `#ab96e8` | **`#ad98ea`** | | blue dark | `#5083b0` | **`#4f85b2`** |
| pink light | `#f58d92` | **`#f78f94`** | | green light | `#a1d664` | **`#a3d864`** |
| pink | `#e07879` | **`#e27879`** | | green | `#83b53d` | **`#85b73d`** |
| pink dark | `#ca646a` | **`#cc646a`** | | green dark | `#658c2e` | **`#658e1e`** |
| orange light | `#fa9959` | **`#fc9b59`** | | yellow light | `#fdd47a` | **`#ffd67b`** |
| orange | `#df7e39` | **`#e17f38`** | | yellow | `#f2bd2b` | **`#f4bf2a`** |

Applied across 16 files: tokens, the two palette specimen cards, `thumbnail.html`, every logo SVG
(including `source/`), and the four pattern backgrounds. Cube face shading tones are artwork-internal
and were left untouched. `tokens/colors.css` now carries a standing warning never to re-sample colour
from the artwork.

### Print colour is solved

The manual publishes **CMYK for all 20 palette values**; each is recorded beside its token in
`tokens/colors.css` and tabulated in `docs/brand-manual.md`. Pantone numbers remain absent — the
manual defers to Formula Guide comparison.

### Corrections to stated rules

- **Clearspace was wrong.** The system said "área de proteção equivalente à altura do símbolo"; the
  manual specifies **X on all sides**, X being the height of the stem of the E — roughly a
  thirteenth of what was reserved. `guidelines/brand-clearspace.card.html` rewritten, and it now
  also carries the **minimum sizes** (45 mm print / 150 px digital), which were absent entirely.
- **"The logo is fixed / never recolour" was too strict.** The manual publishes ~25 sanctioned
  colour combinations for the selo. AGENTS.md rule 9 and `assets/logos/README.md` now state what is
  actually allowed (palette colours, adequate lettering contrast) and what is not (gradients,
  outlined lettering, low-contrast pairings). The three sanctioned versions — principal, secundária,
  simplificada — are named and mapped to their files.
- **Co-branding** with the Sesc signature is specified: never a lockup, always at a distance.

### Sab.IA

The manual publishes the platform's palette and real product screens. `docs/sabia-platform.md` now
documents the login, header and footer as observed rather than proposed. Two corrections: the
platform's chrome is **blue, not purple**, and `--sabia-purple/-blue/-orange` are exactly the Rede
values (now aliased to them), while `--sabia-cream` is flagged as a system tone with no manual basis.

### Photography

The manual contains six full-bleed documentary plates, so a photographic direction now exists and is
recorded in `docs/brand-manual.md` — it corroborates what `guidelines/imagery.card.html` had already
inferred, and adds wide/overhead framing. The plates themselves are photographs of identifiable
children with unknown usage rights: not extracted, not reusable. `<image-slot>` placeholders stand.

### Caveats rewritten

`AGENTS.md` and `readme.md` caveat lists were rebuilt around what the manual settles versus what it
genuinely omits — it covers brand, not layout: no grid, type scale, icon set, component specs,
accessibility floor or dark mode.

## 1.2.0 — 2026-07-25 — official artwork pass

Sesc supplied the vector artwork and the Sab.IA platform brief. Everything that had been inferred
from rasterised PDFs was replaced with the real thing.

### Brand palette corrected against the vectors

Every brand hex had been sampled from the rasterised selo PDF and was off by 1–2 per channel.
Measured from `assets/logos/source/rede-sesc-educacao-colour-sheet.svg`, corrected across 7 files:

| | was | now | | | was | now |
| --- | --- | --- | --- | --- | --- | --- |
| purple (primary) | `#6c62c4` | **`#6b62c2`** | | blue | `#76b3dd` | **`#75b1db`** |
| indigo | `#4c549e` | **`#4b549c`** | | blue light | `#92c4e6` | **`#90c2e4`** |
| purple light | `#ad98ea` | **`#ab96e8`** | | blue dark | `#4f85b2` | **`#5083b0`** |
| pink light | `#f78f94` | **`#f58d92`** | | green light | `#a3d864` | **`#a1d664`** |
| pink | `#e27879` | **`#e07879`** | | green | `#85b73d` | **`#83b53d`** |
| pink dark | `#cc646a` | **`#ca646a`** | | green dark | `#658e1e` | **`#658c2e`** |
| orange light | `#fc9b59` | **`#fa9959`** | | yellow light | `#ffd67b` | **`#fdd47a`** |
| orange | `#e17f38` | **`#df7e39`** | | yellow | `#f4bf2a` | **`#f2bd2b`** |

Cream `#f2f4e4` was already correct. Added: `--color-brand-black` `#1d1d1b` (the marks' official
black), the `--sabia-*` sub-brand palette, and `--cube-*-top/left/right` face shading taken from the
official cube artwork. Purple-derived UI tones (hover, active, tints) were recomputed from the
corrected purple. Tokens still marked `derived` are ours, not Sesc's — they are labelled in
`tokens/colors.css`.

### Official vector assets

- `assets/logos/` — web-ready lockups (transparent, tight viewBox) for the Rede and Sab.IA, with
  the untouched originals and the approved colour sheets in `source/`. Every page, template, card
  and the UI kit now points at the SVGs; the raster PNGs are superseded.
- `assets/motifs/` — the official *cubo impossível* artwork, split into its six constructions.
- `assets/patterns/` — four full-bleed cube fields (blue, green, orange, red).

### The motif is no longer a placeholder

`BrandMotif` renders the official constructions — `cube`, `interlock`, `bar`, `frame`, `chain`,
`hollow` — generated from the supplied artwork by `scripts/build-motifs.mjs`. Five of the six render
pixel-identical to the source file; `frame` differs by 0.31% from viewBox rounding (anti-aliasing,
not geometry). The old hand-built Necker cube and its `color`/`variant="solid"` props are gone:
motif colours belong to the artwork and do not re-map per theme, exactly like the logo.

### Lucide adopted as the icon set

The 21 hand-drawn starter glyphs are replaced by **97 vendored [Lucide](https://lucide.dev) icons
(ISC)** covering education, enrollment, units, results and the platform. Lucide draws on a 24×24
grid with a 2px stroke inheriting `currentColor` — the exact spec `Icon` already required, so
nothing was restyled and every previous icon name still resolves. `Icon.jsx` is now generated by
`scripts/build-icons.mjs` from `assets/icons/lucide/`, which ships with the ISC licence.

### Plataforma Sesc Sab.IA

- `docs/sabia-platform.md` — what the platform is, the Sab.IA-vs-TOTVS split that must never be got
  wrong, how the sub-brand works, and how to link to it.
- `PlatformEntry` — new component: the co-branded band that takes a visitor from a Rede page to the
  platform in one click. Applied to both starters and the landing-page template.
- New guideline cards: **Sub-marca Sab.IA** and **Padrões de cubos**.

### Also

- `scripts/build-icons.mjs`, `scripts/build-motifs.mjs`, and `npm run icons`. `sync-bundle` can now
  insert a brand-new component into the bundle instead of failing.
- `check-ds` no longer flags generated components for raw hex — official artwork reproduces its own
  colours by definition; the generator is what gets reviewed.
- AGENTS.md states the language rule explicitly: **pt-BR for everything a person reads, English for
  everything the system is made of** (files, tokens, props, docs), so the repo stays agent-legible.


## 1.1.0 — 2026-07-25 — soundness pass

Made the system safe to generate from: fixed the defects that silently produced broken output,
and added the docs, entry points and checks that keep it that way.

### Fixed

- **`--text-body` meant two different things.** It was defined as a colour in `tokens/colors.css`
  and as a font size in `tokens/typography.css`. Whichever file loaded last won, so body text
  colour was broken in the light theme and every `font-size: var(--text-body)` was broken in the
  dark theme. The size token is now **`--text-body-md`**; `--text-body` is the colour. All 23 call
  sites updated.
- **Checkbox, Radio and Switch were unusable by keyboard.** Their native inputs were hidden with
  `display:none`, which removes them from the tab order and the accessibility tree. They now use
  the visually-hidden-but-focusable `.rede-control-input` pattern, with a focus ring on the visual
  control. `Switch` also carries `role="switch"`.
- **Tabs had no ARIA semantics.** Now implements the tablist pattern: `role="tablist"/"tab"`,
  `aria-selected`, roving `tabIndex`, and Left/Right/Home/End navigation. New optional `panelId`
  and `label` props.
- **Modal had no keyboard contract.** Now closes on Escape, moves focus in on open and returns it
  to the trigger on close, cycles Tab inside the panel, locks body scroll, and is labelled by its
  title. Its scrim and z-index now come from `--overlay-scrim` / `--z-modal` instead of literals.
- **Tooltip was hover-only.** Now opens on focus, closes on Escape, and is wired to its trigger
  with `aria-describedby`. Uses `--z-tooltip`.
- **ProgressBar was invisible to assistive tech.** Now `role="progressbar"` with
  `aria-valuenow/min/max` and a new `ariaLabel` prop.
- **Chips and banners broke in dark mode.** `Badge`, `Alert`, `Tag` and `Button` carried hard-coded
  light hex tints, so they rendered light-on-light under `[data-theme="dark"]`. They now use
  semantic tokens. `Toast` carried a `bg` value it never used — removed.
- **Navbar was not themeable** — its translucent cream background and `zIndex: 20` were literals.
  Now `--surface-page-translucent` and `--z-sticky`.
- **The UI kit hijacked any page that loaded the bundle.** `_ds_bundle.js` inlines
  `ui_kits/site/app.jsx`, which mounted itself into `#root` unconditionally — so any consuming page
  with a `#root` got the marketing site rendered into it. It now mounts only into
  `#rede-sesc-site-root`.
- `_ds_manifest.json` mis-classified every `--text-*` colour token as `kind: "font"`.

### Added

- `AGENTS.md` — the working guide: non-negotiables, repo map, the two consumption modes, how to
  build a page / artwork / component, accessibility floor, definition of done, open caveats.
- `index.js` / `index.d.ts` — the public import surface. `_adherence.oxlintrc.json` had been
  telling consumers to import from `index.js` for two passes; the file did not exist.
- `scripts/check-ds.mjs` — integrity check: missing files, unregistered components, stale bundle,
  token collisions, undefined `var()` references, raw hex in components, hidden-input regressions,
  broken manifest paths.
- `scripts/sync-bundle.mjs` — mirrors component sources into `_ds_bundle.js` and refreshes its
  hashes, so an edited component can't silently fail to reach any actual page.
- `scripts/sync-tokens.mjs` — regenerates the manifest's token index from `tokens/*.css`.
- `scripts/gen-docs.mjs` — generates `docs/components.md` and `docs/tokens.md` from the `.d.ts`
  files and the manifest.
- `docs/` — generated component and token references, plus `recipes.md`,
  `authoring-components.md` and `quality-checklist.md`.
- `starters/` — `page.html` (static, zero JavaScript), `page-react.html` (real components),
  `poster.html` (A3 print), with a README.
- `package.json` with `npm run check` / `sync` / `docs`, `.gitignore`, `CLAUDE.md`, this changelog.
- New tokens: `--text-body-md`, `--tint-{pink,orange,green,blue,purple,yellow}` and their
  `-ink` foregrounds, `--surface-primary-tint-hover`, `--surface-page-translucent`,
  `--border-on-ink`; all with dark and high-contrast counterparts.
- `.rede-control-input` / `.rede-control-box` in `tokens/base.css` — the sanctioned way to hide a
  native control behind custom chrome.

### Notes

`_ds_bundle.js` is now a literal mirror of the component sources rather than a separately
formatted build, which is what makes `npm run check` able to prove the two agree.

## 1.0.0 — initial system

Brand foundations, 35 components, 18 guideline cards, 4 templates and the 3-screen UI kit, built
from the brand brief and the official selo PDFs. See [readme.md](readme.md) for what was derived
from source material and what was an intentional addition.
