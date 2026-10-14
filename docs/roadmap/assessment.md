# Design system assessment — October 2026

**Scope.** Everything in this repo at `1.4.0`: tokens, 36 components, 4 templates, the UI kit,
starters, scripts, docs and the agent layer (`AGENTS.md`, `SKILL.md`, `brand.json`).
**Question.** Can this system carry a visual restructuring of the *whole* Rede ecosystem — the
regional sites, Sab.IA, the enrollment portal, print and social — and be reused by humans and agents
without drifting?
**Method.** Every claim below is measured or cited to a file. Numbers come from
`npm run audit` (new, `scripts/audit.mjs`), which anyone can re-run; the plan that follows from them
is [roadmap.md](roadmap.md).

---

## Verdict in one paragraph

The **brand layer is excellent** and should be kept almost untouched: the manual is extracted with
page citations, the palette carries the published CMYK, the selo and motif rules are precise, and
the "never re-sample colour from artwork" guard is the kind of lesson most systems never write down.
The **product layer is not ready to be the ecosystem's foundation.** It is a React-only, inline-style
component set with no responsive behaviour, an accessibility floor it states but does not meet,
and a distribution model (copy a folder) that guarantees every consuming system drifts. None of
this is visible from `npm run check`, which passes with 0 errors, because the checks verify that the
repo is *consistent*, not that what it ships is *good*. The fix is a change of centre of gravity —
from React components to a **CSS-first contract** that any system can adopt — not a rewrite of the
brand.

## Scorecard

1 = absent, 3 = workable, 5 = could be the reference for other networks.

| Dimension | Score | One-line reason |
| --- | :-: | --- |
| Brand fidelity | **4.5** | Manual extracted with citations, CMYK, selo/motif rules, drift guard in `build-brand.mjs`. |
| Token architecture | **2.5** | Good values, flat structure: no tiers, naming collision patched by convention, unusable breakpoint tokens. |
| Accessibility | **2** | 18 of 63 rendered colour pairs fail WCAG; error text, every Tag and every Badge among them. |
| Component engineering | **1.5** | Inline styles + JS hover, no `className`/`ref`/rest props, Unicode glyphs as icons. |
| Responsiveness | **1** | 0 of 34 components and 0 of 9 pages contain a media or container query. |
| Ecosystem portability | **1.5** | Only React (or a 3,400-line bundle on a global) can render a component; no CMS/portal path. |
| Distribution & versioning | **1.5** | `private`, `UNLICENSED`, no registry, no CI; `bind` copies a folder per consumer. |
| Quality assurance | **2** | Strong integrity checks; no visual, a11y or behaviour tests; the lint config does not parse. |
| Documentation | **3** | Rich and honest, but redundant across 6 entry points and contradictory in places. |
| Agent operability | **3.5** | `AGENTS.md` is a genuinely good routing doc; contradictions and an unenforced rule set undercut it. |

---

## Findings

Each finding has the evidence, why it matters for the *ecosystem* (not just this repo), and the
roadmap work package that closes it.

### F1 — The stated accessibility floor is not met, and the measurement hides it

`AGENTS.md` sets "contrast ≥ 4.5:1 for body text" and says tints "carry their paired
`--tint-*-ink` foreground". Measured (`npm run audit`), light theme:

| Pair the user actually sees | Ratio | Floor |
| --- | :-: | :-: |
| Input error message (`--danger` on card) | 3.75 | 4.5 |
| Secondary button label | 4.29 | 4.5 |
| Tag — pink / orange / green / blue / purple / yellow | 3.21 / 3.58 / 3.37 / 3.47 / 4.29 / **2.17** | 4.5 |
| Badge — success / warning / danger / info | 3.45 / **2.17** / 3.18 / 3.44 | 4.5 |
| `Stat accent="yellow"` on page | 2.15 | 3 |
| Sab.IA chrome, white on `--sabia-blue` | 2.27 | 4.5 |

18 of 63 pairs fail across the three themes. The showcase's "measured from the live DOM" contrast
table (`showcase/showcase.js:466`) tests nine pairs — all ones that pass — so the system reports
itself green. **This is a selection effect, not a lie, but the result is the same:** every
consuming system inherits failing chips, badges and error messages while believing it is compliant.

The root cause is a property of the palette, not of the components — see F2. The fix already
exists in the repo: the `contrast` theme's hue inks (`#8a1f26`, `#7a3d00`, …) clear 6.3–9.1:1 on
the same tints. They are simply confined to a theme almost nobody switches on. → **P1.1, P1.2**

### F2 — The palette is a light-surface palette; the system uses it as a dark one

Contrast of each of the 20 official colours against white text and against `--color-ink` text:

- **White text** clears 4.5:1 on only **2** colours: `purple-dark` (5.02) and `indigo` (6.84).
- **Ink text** clears 4.5:1 on **14**: every *light* and every *mid* tone except `purple` (4.22),
  from 4.79 (`pink`) to 10.10 (`yellow-light`).
- The four **darks** of the accent ramps (`pink-dark`, `orange-dark`, `green-dark`, `blue-dark`)
  sit in a dead zone: 3.4–4.1:1 against *both* white and ink. They can be neither text nor a
  background for text — yet they are the system's status colours and its tag inks.

Two consequences. First, F1 is structural: any rule of the form "dark tone as text on a pale tint"
fails with this palette. Second, the rule *"accent hues live in tags, chips and dots only, never
as a full-bleed section background"* (`AGENTS.md` → Building a page) is justified as an
accessibility measure but the numbers say the opposite: **ink on a light or mid accent field is
the most legible combination this brand has.** The rule removes the "rede" — the plurality of six
hues that the manual's own pieces show in full-bleed fields — from every screen, leaving cream,
white and one purple. That is the main reason generated pages read as a generic template.
→ **P1.1, P3.3 (decision D3)**

### F3 — The component layer cannot be responsive, themed from outside, or used outside React

Every component styles itself with inline `style` objects (`components/*/*.jsx`). Consequences,
all measured:

- **No responsiveness is possible.** Inline styles cannot hold `@media`, `@container`, `:hover` or
  `:focus-visible`. 0 of 34 hand-written components respond to viewport or container. `Navbar` has
  no mobile menu: on a phone the logo, every link and the CTA compete for one row.
- **Hover and press are JavaScript state** (`setHover`, `onMouseEnter`) in 6 components — they do not
  fire on touch, do not exist before hydration, and re-render on every pointer move.
- **Consumers cannot adapt anything.** 34 of 34 components drop unknown props: no `className`,
  no `style` merge, no `ref`, no `id`, no `aria-*`, no `data-*`. A team that needs `name` on an
  `Input` for a real form has to fork the component.
- **Not usable outside React.** A regional WordPress site, the TOTVS enrollment portal or a Moodle
  theme cannot render a `Button` without shipping React and `_ds_bundle.js` onto a global named
  `RedeSescDeEducaODesignSystem_2167ce`. For an ecosystem where most surfaces are *not* React
  apps, the component layer is effectively unavailable.
- **133 raw px literals, 9 raw colours** in components (`npm run audit`), against rule 1 of
  `AGENTS.md`. The checker cannot see them: `_adherence.oxlintrc.json` targets JSX syntax while the
  sources are `React.createElement`, every rule is `warn`, and the file no longer parses
  (`unknown field "x-omelette"`). It is not part of `npm run check`.

→ **P2 (CSS-first components)**

### F4 — The system breaks its own non-negotiables in its own code

Rule 5 forbids "a unicode glyph standing in for an icon". There are 9 in components: `×` in
`Modal`, `Toast`, `Alert`, `Tag`, `FileUpload`; `▾` in `Menu`; `›` in `Pagination`; `✓` in
`Stepper`. Rule 1 forbids raw colours; the templates and UI kit carry 68 (`rgba(255,255,255,.8)`, `#fbe8e8`,
`color:white`) and 28 hard-coded widths (`max-width:1200px` instead of `--container-max`).
Agents learn from examples more than from rules: **every template is a counter-example to the
rules agents are told to follow.** → **P2.4, P3.1**

### F5 — Accessibility semantics are thin below the colour layer

- `Input`, `Select`: the error message is not associated with the field (no `aria-invalid`, no
  `aria-describedby`); only `Textarea` and `DateField` do it.
- `Alert` is always `role="alert"`, so a static "Matrículas abertas" banner interrupts a screen
  reader on page load. `Toast` has no live region at all.
- `Modal` and `Tooltip` build ids with `Math.random()` — a guaranteed hydration mismatch in the
  Next.js App Router the integration guide recommends. React 18 ships `useId`.
- `Menu` has `role="menu"` without arrow-key navigation; `Card` renders the whole card as
  `<a href="#">` by default, so any interactive `footer` nests a control inside a link.
- `Modal` is a hand-rolled focus trap; native `<dialog>` + `showModal()` now does this correctly
  in every supported browser.

→ **P2.2, P2.3**

### F6 — Token structure: good values, no architecture

- **Flat namespace, collision patched by convention.** `--text-body` is a colour and
  `--text-body-md` a size; rule 2 and a checker exist only to stop people confusing them. The
  real fix is a naming scheme where the category is the prefix (`--color-text-body`,
  `--font-size-body-md`).
- **No tiers.** Brand values, semantic roles and component decisions share one level, so a
  component can (and does) read `--gray-200`, `--gray-50`, `--color-yellow-dark` directly,
  bypassing theming.
- **Duplicates.** `--container-max` = `--container-xl` = 1200px; `--surface-primary-tint` =
  `--tint-purple` = `#edecf8`; `--text-h4` = `--text-body-lg` = 1.125rem.
- **Breakpoint tokens that cannot be used.** `--bp-*` are custom properties; CSS does not allow
  `var()` inside `@media`. They are documentation pretending to be tokens.
- **Sampled values in the source of truth.** `--cube-*-top/left/right` are read off the artwork —
  exactly what known gap 9 forbids for the palette.
- **Theming is opt-in only.** No `prefers-color-scheme` mapping; dark exists only behind
  `data-theme`.
- **Fluid type is partial.** Display/H1 clamp on `vw`, H2–H4 are fixed; `--container-padding` is a
  fixed 24px on a 360px phone.

→ **P1.3**

### F7 — Distribution guarantees drift

`npm run bind` copies a stamped `_ds/` folder into each consumer. With one consumer that is fine;
with twenty-seven regional departments, Sab.IA and the portal it produces thirty forks, each
frozen at the day it was bound, with no way to ship a contrast fix to all of them. There is no
package registry, no CDN path, no semantic version contract, no CI (no `.github/`), and the package
is `private` + `UNLICENSED`. → **P1.4, P4**

### F8 — Documentation is honest but has six front doors and they disagree

`readme.md`, `AGENTS.md`, `SKILL.md`, `docs/integration.md`, `docs/brand-manual.md` and the
showcase all describe the system; known gaps live in three places. Measured contradictions:

- Component count: `readme.md` says 35 (twice), the manifest has 36.
- Pattern hues: `readme.md` says blue/green/orange/**red**, `docs/brand-manual.md` says
  green/pink/**blue** "only", `AGENTS.md` says blue/green/orange/pink. The SVGs are blue, green,
  orange, pink.
- Motif recolouring: `docs/brand-manual.md` says purple/orange/yellow constructions "must be
  requested, not invented by recolouring"; `AGENTS.md` rule 10 and `BrandMotif` do exactly that,
  authorised. `AGENTS.md` → Building artwork still calls `BrandMotif` a "placeholder".
- `docs/brand-manual.md` says `colors.css` wrongly marks three palette values `/* derived */`; it no
  longer does.
- `readme.md` lists `ui_kits/site/*.jsx`; they are `.js`. Its body is a history of "passes", which
  belongs in `CHANGELOG.md`.

For an agent, a contradiction is not a typo: it is two valid instructions, and it will follow
whichever it read last. → **P3.4**

### F9 — It ships primitives; the ecosystem needs patterns

The manual's *Presença digital* chapter specifies what every regional education area must contain
(visão geral, proposta pedagógica, estrutura, projetos, histórias, acesso e contato) and that it
must show the selo and belong visibly to the Rede. Sab.IA has a published header, nav, footer and
login. None of these exist as reusable patterns: templates assemble them from primitives with
inline layout each time. There are also no layout primitives (container, stack, grid), no
`SkipLink`, no `FormField`, no mobile navigation, no unit finder/combobox, no app shell — the
pieces a restructuring of *other systems* actually needs first. → **P3.2, P3.3**

### What is strong and must survive any restructuring

- `docs/brand-manual.md`: cited, explicit about where the system departs from the manual.
- `brand.json` as a language-agnostic contract, and `docs/examples/social_post.py` proving it.
- The palette drift guard in `scripts/build-brand.mjs`.
- `BrandMotif`'s luminance-rank hue remap: the right abstraction for a geometric brand asset.
- The `base-runtime` / `base-reset` / `tokens-only` integration tiers.
- `<image-slot>` with shot briefs, and the "never invent imagery / Sesc facts" rules.
- The four-file component contract (`.jsx` + `.d.ts` + `.prompt.md` + card) as a *documentation*
  contract — the structure is right, the implementation underneath is what changes.
- The `npm run check` habit. It needs a second half (`audit`), not replacing.

## What to remove

| Remove | Why | Replace with |
| --- | --- | --- |
| `assets/logo-*.png` (5 superseded rasters) | Kept "so older pages keep rendering"; a second, wrong logo source. | Vectors in `assets/logos/`; migrate references first. |
| `ui_kits/site/` | A second, older landing page next to `templates/landing-page/`. | One template per page type. |
| `_adherence.oxlintrc.json` | Does not parse, targets JSX the repo forbids, warns only. | Stylelint + checks in `check-ds` (P1.2). |
| Inline styles in every component and template | Root of F3/F4. | Class-based CSS in `@layer rse.components` (P2). |
| `RedeSescDeEducaODesignSystem_2167ce` as the public global | Generated, unreadable, leaks into every template. | `window.RSE`, old name aliased for one major. |
| History-of-passes sections in `readme.md` | Duplicates `CHANGELOG.md`, and is where count drift lives. | Brand brief only. |
| `--container-max`, `--tint-purple` duplicates, `--bp-*` as custom properties | F6. | One name each; breakpoints as `@custom-media` + documented values. |

Nothing in the brand layer is on this list.
