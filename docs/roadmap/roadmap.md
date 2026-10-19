# Roadmap — from a brand repo to the ecosystem's design foundation

This is the action plan for [assessment.md](assessment.md). It is written to be executed by people
and by agents alike: every work package has a goal, the concrete change, an acceptance test that
a script can verify, and whether it can start now or waits on a decision.

## Status

| | |
| --- | --- |
| Decisions approved | **D1–D6** (October 2026). D5 without legacy aliases: nothing consumed 1.x, so 2.0.0 is a clean break. |
| Done in 2.0.0 | **Phase 0** (P0.1–P0.3) · **Phase 1** (P1.1–P1.4) · D6 removals · **P2.4** glyphs → `Icon` · **P2.1–P2.3** for 12 components (Button, IconButton, Card, Tag, Badge, Alert, Input, Select, Textarea, Checkbox, Radio, Switch) · **P2.5** browser tests (errors + axe + 360px) |
| Measured | axe WCAG 2.2 AA violation nodes across 8 pages: **171 → 0**; contrast pairs gated: **117**, all passing in 3 themes; glyph icons **9 → 0**; px literals in components **133 → 81** |
| Next | **P2.1/P2.2** for the other 24 components · **P3.1** responsive templates (12 pages still scroll sideways at 360px, ratcheted) · **P3.4** one docs site (see the showcase proposal) |

P2.5 landed without screenshot diffs on purpose: baselines of 46 pages × 3 themes churn on every
intended change and get approved blindly. Runtime errors, axe and phone overflow catch the
regressions that matter; visual snapshots can come with the docs site.

How phase 1 landed differently from the plan below, on purpose:

- **One package, not four.** `@idcesares/rse-design-system` with subpath exports (`/styles.css`,
  `/tokens`, `/brand.json`, `/bundle`, `/assets/*`). Splitting into `brand`/`tokens`/`css`/`react`
  waits until `@rede-sesc/css` has something in it (P2.1); until then four packages would be one
  package in four boxes. The scope is the GitHub owner because GitHub Packages requires it; moving
  to an organisation scope is a rename at release time.
- **A static kit, not a CDN.** The repository is private, so no public CDN can serve it. Each
  release attaches `rse-<version>.zip`, to be hosted at a versioned path on a Sesc server.
- **No Tailwind preset or Figma export yet.** The DTCG source is readable by Style Dictionary and
  Tokens Studio directly; a preset gets built when a consumer needs one.
- **No changesets.** The repo has zero dependencies and keeps it that way: the release workflow
  requires a `## <version>` section in `CHANGELOG.md` and a tag that matches `package.json`.

Progress is tracked with numbers, not adjectives:

```bash
npm run audit          # scorecard: contrast failures, component debt, page debt, doc drift
npm run audit -- --json
```

---

## 1. Target architecture

One repo, four layers, published as versioned packages. The layers are ordered by how many
systems in the ecosystem can consume them — the lower the layer, the wider its reach.

```
                 who consumes it                                    owner
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ @rede-sesc/react     React apps (Sab.IA front end, new Next.js sites)                │ DS team
│   thin wrappers that render the CSS contract; ref, rest props, useId                 │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ @rede-sesc/css       ANY HTML: WordPress / Liferay regional sites, TOTVS portal       │ DS team
│   @layer rse.base, rse.components, rse.patterns, rse.utilities                       │
│   class contract .rse-*  ·  responsive  ·  themeable  ·  no JS needed for visuals     │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ @rede-sesc/tokens    everything: CSS vars, JSON, JS/TS, Tailwind preset,              │ DS team
│   Figma variables, Python dict                                                       │
│   source = DTCG JSON (tokens/*.tokens.json); everything else generated               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ @rede-sesc/brand     print, social, decks, agents, any language                        │ Sesc DN
│   brand.json, logos, motifs, patterns, fonts, docs/brand-manual.md                   │ comunicação
└──────────────────────────────────────────────────────────────────────────────────────┘
  adapters/          host-specific stylesheets that map tokens onto a product the network
                     does not own (TOTVS portal skin, LMS theme, WordPress theme.json)
```

Why this shape:

- **CSS is the lingua franca of the ecosystem.** Most Rede surfaces are CMSs and third-party
  products, not React apps. A class contract reaches all of them; React wrappers keep the current
  React consumers working.
- **The brand layer changes rarely and is owned by communication; the UI layer changes weekly and
  is owned by the DS team.** Separate packages, separate release cadence, separate approvals.
- **Prefixed everything (`--rse-*`, `.rse-*`).** Unprefixed `--color-primary` or `--text-body`
  collides with host CSS the moment the system is loaded into a WordPress theme or a portal.
- **`bind` stays** for offline artifacts (decks, a file handed to a user), but it is no longer the
  way a *system* consumes the design system.

### The CSS contract, concretely

Variants are modifier classes, not data attributes — a CMS editor can add a class to a block but
usually cannot add an attribute.

```html
<a class="rse-button rse-button--primary rse-button--lg" href="/matricula">Quero me inscrever</a>

<div class="rse-field rse-field--invalid">
  <label class="rse-field__label" for="cpf">CPF do responsável</label>
  <input class="rse-input" id="cpf" name="cpf" aria-invalid="true" aria-describedby="cpf-msg">
  <p class="rse-field__message" id="cpf-msg">Informe os 11 dígitos do CPF.</p>
</div>

<span class="rse-tag rse-tag--green">Ensino Médio</span>
```

```jsx
// @rede-sesc/react renders exactly the markup above. Nothing visual lives in JS.
<Button variant="primary" size="lg" href="/matricula">Quero me inscrever</Button>
```

### Token tiers and names

| Tier | Purpose | Example | Who may read it |
| --- | --- | --- | --- |
| 1 · brand | The manual's values, unchanged, plus clearly marked derived steps | `--rse-brand-pink-dark` `#cc646a`, `--rse-brand-pink-ink` *(derived)* | Tier 2 and brand artwork only |
| 2 · system | Roles that re-map per theme | `--rse-color-text-body`, `--rse-color-feedback-danger-text`, `--rse-font-size-body-md`, `--rse-space-4` | Components, patterns, pages |
| 3 · component | Decisions local to one component | `--rse-button-primary-bg` | That component; hosts that need to override one thing |

Category is always the second segment, so a colour and a size can never share a name again (this
retires rule 2 of `AGENTS.md` as a convention and makes it a property of the scheme). Every 1.x
name keeps working through a generated `tokens/legacy-aliases.css` for the whole 2.x line.

---

## 2. Conformance levels — the path for every system in the ecosystem

A restructuring across many systems needs a finish line each team can reach independently. Each
level is a checklist a script or a reviewer can verify.

| Level | What the system must do | How it is verified |
| --- | --- | --- |
| **Bronze — "looks like the Rede"** | Loads `@rede-sesc/tokens` (or the adapter); Montserrat; selo per manual (version, clearspace, min size, distance from the Sesc signature); palette only; pt-BR copy in the brand voice. | Token usage scan; manual selo checklist; reviewer sign-off from DN comunicação. |
| **Silver — "works like the Rede"** | Bronze + uses `@rede-sesc/css` components and patterns for all chrome (header, footer, forms, feedback); WCAG 2.2 AA on audited pages; responsive 360 → 1440px. | axe-core zero violations on the key flows; visual snapshots at 360/834/1440. |
| **Gold — "is the Rede"** | Silver + all page sections from patterns; light/dark/contrast themes; tracks the current major; contributes fixes upstream. | `audit` clean on the consumer; within one minor of latest. |

Target for the pilot quarter: **one regional site at Silver, Sab.IA login + shell at Silver, the
TOTVS portal at Bronze through an adapter.**

---

## 3. Decisions required before or during phase 1

These are not engineering questions. Each needs a named owner's yes or no; the recommendation is
what the work packages assume.

| # | Decision | Recommendation | Owner | Blocks |
| --- | --- | --- | --- | --- |
| D1 | Adopt CSS-first components as the contract; React becomes a wrapper (2.0.0, breaking). | **Yes.** It is the only route to CMSs and the portal. | DS lead | P2 |
| D2 | Add a derived **ink** step per hue (darker than `-dark`, same hue) for text on tints and status text. Values start from the existing contrast-theme inks. | **Yes.** Marked *derived*, like the grays; brand artwork keeps using the 20 official values only. | DS lead + DN comunicação | P1.1 |
| D3 | Allow **ink-on-colour fields** (light/mid accent backgrounds with `--rse-color-ink` text) in pages, not only in print. Optionally assign hue families to segments for wayfinding. | **Yes to fields** (5–10:1, the most legible pairs the palette has). Segment-to-hue mapping only if DN wants it — it is a brand semantic, not ours to invent. | DN comunicação | P3.3 |
| D4 | Publish to a registry: GitHub Packages (private) + a versioned static CDN path for CMSs. License the code for internal Sesc reuse. | **Approved.** Done as package + static kit; LICENSE drafted, pending Sesc legal review. | DS lead + Sesc TI | P1.4 |
| D5 | Rename the token namespace to `--rse-*` and the bundle global to `RSE`, with aliases for 2.x. | **Approved, without aliases** (no consumer yet). Done in 2.0.0. | DS lead | P1.3 |
| D6 | Remove `ui_kits/site/` and the raster logos (see assessment, "What to remove"). The oxlint config stays: it carries tool metadata (`x-omelette`), and P1.2 already moved enforcement out of it. | **Yes.** | DS lead | P3.4 |

---

## 4. Phases and work packages

Sizes: **S** ≤ 1 day, **M** 2–4 days, **L** 1–2 weeks, for one person or one agent session with
review. Phases overlap; the arrows are real dependencies.

### Phase 0 — Baseline and guard rails (week 1, no decisions needed)

| WP | Change | Acceptance | Size |
| --- | --- | --- | :-: |
| **P0.1** CI | `.github/workflows/ci.yml` runs `npm run check` and `npm run audit -- --json` (uploaded as an artifact) on every PR. | A PR that breaks `check` is red. Audit JSON attached to every run. | S |
| **P0.2** Doc contradictions | Fix F8 (counts, pattern hues, motif recolouring, stale notes). | `audit` → `docCountDrift: 0`; `grep -i red readme.md` finds no pattern hue. *Done in this change.* | S |
| **P0.3** Freeze scope | No new components until P2.1 lands; bug fixes only. | Stated in `AGENTS.md`. | S |

### Phase 1 — Foundations (weeks 1–3, ships as 1.5.0, non-breaking)

| WP | Change | Acceptance | Size | Needs |
| --- | --- | --- | :-: | :-: |
| **P1.1** Accessible inks | Add `--color-<hue>-ink` for the six hues (start: `#8a1f26 #7a3d00 #3f6100 #1d5c86 #3a3186 #6b4700`). Point `--tint-*-ink` at them in light theme. Split status roles into `--success-text` (ink), `--success` (indicator: dots, borders, icons — 3:1 non-text). Secondary button label → `--color-primary-hover`. Sab.IA chrome text → ink. Drop `yellow` from `Stat` accents. | `npm run audit -- --strict` exits 0 in all three themes. Showcase contrast table includes every pair in `scripts/audit.mjs`. | M | D2 |
| **P1.2** Make the floor a gate | Add `audit --strict` to `npm run check`. Move enforcement out of `_adherence.oxlintrc.json` (nothing ran it) into `check-ds` (direct component imports) and the audit ratchet (raw colour/px/glyph in `components/`, `templates/`): the counts may only go down, baseline in `scripts/audit-baseline.json`. The oxlint file stays as prop metadata for external design tooling. | A PR that adds a raw colour or a failing pair fails CI. | M | P0.1 |
| **P1.3** Token source and tiers | Move the source of truth to DTCG JSON (`tokens/src/*.tokens.json`) with the three tiers; generate today's CSS files, `brand.json`, a TS module, a Tailwind preset and a Figma-variables JSON from it. Rename to `--rse-*`; generate `legacy-aliases.css`. Remove duplicates (F6). Breakpoints as `@custom-media` + JSON. Add `prefers-color-scheme` opt-in (`[data-theme="auto"]`). Fluid type and container padding with `clamp(rem + vw)`. | `git diff` of resolved values in `brand.json` is empty except the intended changes. Every 1.x token name still resolves. | L | D5 |
| **P1.4** Release pipeline | Workspaces: `packages/{brand,tokens,css,react}`. Changesets for SemVer + changelog. Publish to GitHub Packages and a versioned CDN path (`/rse/<version>/rse.css`). `bind` reads from the built packages. | `npm i @rede-sesc/tokens` works in a scratch project; a CDN URL serves a pinned version. | M | D4 |

### Phase 2 — CSS-first components (weeks 3–8, ships as 2.0.0)

| WP | Change | Acceptance | Size | Needs |
| --- | --- | --- | :-: | :-: |
| **P2.1** CSS contract | `packages/css/components/*.css`, one file per component, in `@layer rse.components`, BEM `.rse-*`, states via `:hover`, `:focus-visible`, `[aria-*]`, `:disabled`; responsive via container queries. Start with the 12 the ecosystem needs first: Button, Link, Field (label/help/error), Input, Select, Checkbox, Radio, Switch, Tag, Badge, Alert, Card. | Each component renders correctly with **no JavaScript** in a plain HTML specimen, in 3 themes × 360/834/1440. | L | D1 |
| **P2.2** React wrappers | Rewrite `components/*.jsx` to render the P2.1 markup: `forwardRef`, `...rest` spread, `className` merge, `useId`, `href` → `<a>`. No inline style except custom-property pass-through. | `audit` → `componentPxLiterals: 0`, `componentRawColors: 0`, `componentsWithJsHover: 0`, `componentsWithRandomIds: 0`, `componentsWithoutRestProps: 0`. | L | P2.1 |
| **P2.3** Semantics | Native `<dialog>` for Modal; live region for Toast (`ToastRegion`); Alert `role="status"` unless `urgent`; Menu with roving tabindex + arrows (or downgrade to a disclosure); Card as a container with a stretched primary link, not an `<a>` wrapper; `SkipLink`, `VisuallyHidden`. | axe-core: 0 violations on every specimen; keyboard script (Playwright) walks every interactive specimen. | M | P2.1 |
| **P2.4** Icons | Replace the 9 glyphs with `Icon` (`x`, `chevron-down`, `chevron-right`, `check`). | `audit` → `componentGlyphIcons: 0`. *Done in 2.0.0.* | S | — (can start now) |
| **P2.5** Tests | Playwright (Chromium is available in CI images): visual snapshots of every specimen × 3 themes × 3 widths; axe on every specimen and template. | Runs in CI; a visual change requires an approved snapshot update. | M | P0.1 |

### Phase 3 — Patterns, templates and docs (weeks 6–12)

| WP | Change | Acceptance | Size | Needs |
| --- | --- | --- | :-: | :-: |
| **P3.1** Layout primitives + responsive templates | `.rse-container`, `.rse-stack`, `.rse-cluster`, `.rse-grid` (auto-fit, no fixed column counts), `.rse-section`. Rewrite the 4 templates as plain HTML using classes only (keep `.dc.html` wrappers only if a tool still needs them). | `audit` → `pageRawColors: 0`, `pageHardWidths: 0`; templates pass the P2.5 snapshot + axe suite at 360px. | L | P2.1 |
| **P3.2** Rede patterns | One pattern per section the manual's *Presença digital* mandates for a regional education area: Hero, Visão geral, Proposta pedagógica, Estrutura (unit facts), Projetos (card grid), Histórias (testimonial), Acesso e contato (unit finder + map slot), plus SiteHeader with mobile nav and a **co-brand footer** that enforces the selo's distance from the Sesc signature. A `regional-education-area` template composes them in the manual's order. | A regional team can build the mandated area by copying one template and replacing content only. | L | P3.1 |
| **P3.3** Expressive layer | `rse-band--<hue>` ink-on-colour section fields; motif and pattern placement rules as pattern variants; if D3 approves, segment→hue wayfinding tokens (`--rse-segment-infantil`, …). | Every band variant passes `audit`; showcase shows a page using all six hues within the rules. | M | D3 |
| **P3.4** One front door per audience | `readme.md` → brand brief only. `AGENTS.md` → rules + routing, ≤ 200 lines, each rule naming the check that enforces it. Known gaps in one file (`docs/known-gaps.md`) that `brand.json` and the showcase read. Merge `guidelines/*.card.html` + component cards into the showcase as the single docs site. Remove what D6 lists. | No fact stated in two hand-written files (spot-checked by `audit` for counts and hue lists). | M | D6 |
| **P3.5** Sab.IA shell | AppShell (blue header with endorsement, text nav, footer per `docs/sabia-platform.md`), Login screen, feature-card row. Ink-on-blue throughout. | Matches the manual's published screens; passes P2.5. | M | P2.1 |

### Phase 4 — Rollout across the ecosystem (from week 8, continuous)

| WP | Change | Acceptance | Size |
| --- | --- | --- | :-: |
| **P4.1** Pilot | One regional site to Silver, Sab.IA login + shell to Silver. Pair a DS person with each product team for two weeks. Log every friction as an issue labelled `adoption`. | Both at Silver; every `adoption` issue triaged. | L |
| **P4.2** Adapters | `adapters/totvs/` (portal skin mapping tokens onto its selectors), `adapters/wordpress/theme.json` generated from tokens. | Portal at Bronze without touching its code. | M per host |
| **P4.3** Adoption tracker | `ecosystem.json` in this repo: every system, owner, level, DS version. Rendered in the showcase. | Updated each release; nobody more than one minor behind for > 90 days. | S |
| **P4.4** Governance | RFC template for new components/patterns (problem, evidence from ≥ 2 systems, a11y contract, pt-BR example). Monthly release; patch any a11y defect within one week across all consumers via the registry. | First RFC merged through the process. | S |

---

## 5. Targets

| Metric (`npm run audit`) | Baseline 1.4.0 | After phase 1 | After phase 2 | After phase 3 |
| --- | :-: | :-: | :-: | :-: |
| `contrastPairsFailing` | 18 / 63 | **0** | 0 | 0 |
| `componentGlyphIcons` | 9 | 9 | **0** | 0 |
| `componentRawColors` | 9 | 9 | **0** | 0 |
| `componentPxLiterals` | 133 | ≤ 133 (ratchet) | **0** | 0 |
| `componentsWithJsHover` | 6 | 6 | **0** | 0 |
| `componentsWithoutRestProps` | 34 / 34 | 34 | **0** | 0 |
| `componentsResponsive` | 0 / 34 | 0 | all layout-bearing | all |
| `pageRawColors` | 68 | ≤ 68 | ≤ 68 | **0** |
| `pagesWithoutMediaQueries` | 9 / 9 | 9 | 9 | **0** (container queries count) |
| `docCountDrift` | 2 | **0** | 0 | 0 |

Outside the script: axe violations on templates (target 0 from phase 2), number of ecosystem
systems at each conformance level (target from phase 4).

---

## 6. How an agent picks up a work package

1. Read `AGENTS.md`, this file and the WP row. If the WP lists a decision in **Needs** and the
   decision is not recorded as approved in `CHANGELOG.md` or an issue, stop and ask.
2. Run `npm run audit -- --json` and save the baseline numbers the WP's acceptance names.
3. One WP per branch and per PR. Title: `P2.4: replace glyph icons with Icon`.
4. Change only what the WP names. If you find a defect outside it, open an issue; do not widen
   the PR.
5. Done means: `npm run check` passes, the acceptance metric moved to its target, and the PR
   description quotes the before/after audit numbers.

Ticket template for anything not in this file:

```markdown
### Problem   (what a user of which system sees — with evidence: file, measurement, screenshot)
### Change    (the smallest change that fixes it; files touched)
### Acceptance (a command whose output proves it — prefer `npm run audit` metrics)
### Needs     (decisions or WPs it depends on)
```

## 7. Risks

| Risk | Mitigation |
| --- | --- |
| 2.0 breaks current consumers. | Legacy aliases for every token for all of 2.x; React prop names unchanged; codemod (`scripts/migrate-2.mjs`) for renamed tokens; 1.x patched for a11y for 6 months. |
| Inks drift the brand's look (D2). | Inks only replace text-on-tint and status text; fills, artwork and the selo still use the 20 official values. DN signs off the six values once. |
| Teams adopt Bronze and stop. | Conformance levels are published per system (P4.3); Silver is the requirement for new builds. |
| The DS team becomes a bottleneck. | CSS contract + RFC process lets product teams contribute; agents execute WPs against measurable acceptance. |
| Third-party products (TOTVS) resist theming. | Adapters target Bronze only; anything deeper is a vendor request with the tokens as the spec. |
