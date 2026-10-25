# Composition layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give an agent that sees only the repo URL a stack-agnostic route, rules, exemplars and self-check for building decks, pitches, posters, social cards and one-pagers in the Rede Sesc de Educação brand.

**Architecture:** Prose + data under `docs/composition/`, a root `DESIGN.md` router, and a `formats` section generated into `brand.json`. A new `scripts/check-composition.mjs` validates the data and the cross-references and runs inside `npm run check`. Exemplars are authored in HTML (`exemplars/src/`) and rendered to PNG with the pre-installed Chromium; the spec text never depends on HTML.

**Tech Stack:** Node ≥18 ESM scripts (the repo has zero dependencies and keeps it that way), Markdown, JSON, Playwright/Chromium for author-time rendering only.

**Spec:** `docs/superpowers/specs/2026-10-25-composition-layer-design.md`

## Global Constraints

- Tokens only: no raw hex, font stack, radius, shadow or duration in exemplar sources (`--rse-*`).
- Montserrat only, headings 800 with `--rse-letter-spacing-tight`, eyebrows 700 uppercase.
- Human-readable copy is pt-BR, sentence case, no emoji. File names, ids, prop names and all documentation are English.
- No gradients, no photography, no invented Sesc facts: placeholders are visibly placeholder (`000`) and use `<image-slot>`-style boxes with a shot brief.
- One cube motif per composition; one band/accent hue per composition; `-dark` accents never carry small text.
- All sizes in `formats.json` are fractions of the canvas short side. Docs links are relative.
- No new components or tokens. If an exemplar cannot be built without one, stop and flag it to the owner.
- `npm run check` must pass at every commit. Never hand-edit `brand.json`.
- Commit messages end with the attribution lines required by the session reminder.

## Review Focus

1. Montserrat unavailable in the agent's stack (PPTX, Figma, Pillow) → `DESIGN.md` states where the fonts are and the allowed fallback; pinned by Task 2.
2. A chart with more series than the palette has distinguishable hues → `modules.md` sets a maximum and says to group or split; pinned by Task 3.
3. The user supplies real figures, or none → rule on provenance: use theirs, label as theirs, never fill gaps; pinned by Task 2.
4. A headline longer than the format allows → `maxHeadlineChars` per format and the rule to shorten, not shrink; pinned by Task 1.
5. The user asks for a gradient, stock photo or emoji → `DESIGN.md` says to decline and offer the sanctioned alternative; pinned by Task 2.

---

### Task 1: Format data and the composition validator

**Files:**
- Create: `scripts/check-composition.mjs`, `docs/composition/formats.json`
- Modify: `scripts/build-brand.mjs` (add `formats` + `composition` to the `brand` object), `package.json` (`check` script, `files`)

**Interfaces:**
- Produces: `docs/composition/formats.json` shaped `{ "unit": "fraction of short side", "formats": Format[] }`; `Format = { id, label, aspect: [w,h], margin, gridColumns, type: { display, h1, h2, body, caption, eyebrow }, minText, safeArea, maxWords, maxHeadlineChars, medium: "screen"|"print"|"social" }`. Format ids: `slide-16x9`, `slide-4x3`, `print-a4`, `print-a3`, `social-1x1`, `social-4x5`, `report-cover` (seven; the spec's "A3/A4 portrait" is two ids sharing one aspect).
- Produces: `node scripts/check-composition.mjs [--quiet]` exits 1 on any error. Exported check list is internal; later tasks add checks by appending to the same file.
- Produces: `brand.json` keys `formats` (the array) and `composition` (`{ entry: "DESIGN.md", dir: "docs/composition" }`).

- [ ] **Step 1: Write the failing validator.** `check-composition.mjs` fails with a clear message per violation. Invariants for every format: ids unique; `margin` between 0.04 and 0.12; `type.h1 / type.body >= 3`; `type.body >= minText`; `type.eyebrow <= type.body`; `safeArea <= margin`; `maxWords` and `maxHeadlineChars` positive integers; `aspect` two positive integers. Also: `formats.json` exists and parses; the seven ids above are all present.
- [ ] **Step 2: Run `node scripts/check-composition.mjs`.** Expected: exit 1, "docs/composition/formats.json missing".
- [ ] **Step 3: Author `formats.json`.** Choose the numbers so the invariants hold and each format reads as designed: slides get the largest type fractions and the lowest `maxWords` (≈40); social 4:5 gets the lowest `maxHeadlineChars`; print gets the highest `maxWords`. Record in each entry a one-line `note` saying why the numbers fit that medium.
- [ ] **Step 4: Run the validator.** Expected: `OK — 0 errors`.
- [ ] **Step 5: Add a deliberate-break test.** Temporarily set one format's `type.h1` below 3× body; confirm the validator exits 1 naming that id; revert.
- [ ] **Step 6: Extend `build-brand.mjs`** to read `docs/composition/formats.json` and emit `formats` and `composition` in `brand.json`; tolerate the file's absence with a warning so older checkouts still build. Run `npm run sync`.
- [ ] **Step 7: Wire in.** Append `&& node scripts/check-composition.mjs` to the `check` script; add `DESIGN.md` and `docs/composition` to `files` (excluding `docs/composition/exemplars/src`: use `!docs/composition/exemplars/src`).
- [ ] **Step 8: Run `npm run check`.** Expected: passes.
- [ ] **Step 9: Commit** — `git add scripts package.json brand.json docs/composition && git commit -m "Add composition formats data and validator"`.

### Task 2: Entry point, principles and rubric

**Files:**
- Create: `DESIGN.md`, `docs/composition/principles.md`, `docs/composition/rubric.md`
- Modify: `scripts/check-composition.mjs`

**Interfaces:**
- Consumes: format ids from Task 1.
- Produces: `DESIGN.md` with sections `## Brief`, `## Hard rules`, `## Route by intent`, `## Fonts and fallbacks`, `## When asked for something the brand forbids`. The route table has one row per intent: `deck`, `pitch`, `report`, `poster`, `social`, `one-pager`, `web page`, each listing at most four relative links. `rubric.md` has exactly twelve numbered checks (`## R1` … `## R12`), each one yes/no question.

- [ ] **Step 1: Add validator checks (failing first).** (a) every relative link in `DESIGN.md` and `docs/composition/*.md` resolves to an existing file; (b) the route table has the seven intents and ≤4 links per row; (c) `DESIGN.md` contains the five required headings; (d) `rubric.md` has `R1`–`R12`; (e) `DESIGN.md` mentions no `npm` command outside a line containing the word "optional". Run; expect failures for missing files.
- [ ] **Step 2: Write `DESIGN.md`.** Brief ≈10 lines (who the brand is, the editorial aesthetic in three sentences, pointer to `AGENTS.md` for web). Hard rules link to the `AGENTS.md` non-negotiables rather than restating them. Fonts section: states Montserrat's location (`assets/fonts/`), that a stack without it must embed it or, if it cannot, fall back to a geometric sans and tell the user. Provenance rule for figures (Review Focus 3). Forbidden-request section (gradient, stock photo, emoji → decline, offer flat field, `image-slot` brief, or Lucide icon).
- [ ] **Step 3: Write `principles.md`.** The spec's principles list, each with a one-line "generic version" counter-example and a pointer to the format or token it uses. Under one page.
- [ ] **Step 4: Write `rubric.md`** with the twelve checks from the spec, in that order, each phrased as a question answerable from the render.
- [ ] **Step 5: Run `npm run check`.** Expected: pass (links to `modules.md` / `archetypes.md` are listed in the route table, so create empty-heading stubs for those two files now and fill them in Task 3).
- [ ] **Step 6: Commit** — `"Add DESIGN.md entry point, principles and rubric"`.

### Task 3: Modules and archetypes

**Files:**
- Create: `docs/composition/modules.md`, `docs/composition/archetypes.md` (replacing the Task 2 stubs)
- Modify: `scripts/check-composition.mjs`

**Interfaces:**
- Consumes: format ids; principles.
- Produces: `modules.md` with one `## M-<id>` heading per module, ids from this list: `headline`, `bignumber`, `quote`, `figure`, `list`, `comparison`, `table`, `chart`, `timeline`, `callout`, `folio`, `imageslot`; each with a `Variants:` line of 2–3 names and a `Fails when:` line. `archetypes.md` with one `## A-<id>` heading per archetype, grouped under `# Open`, `# Argue`, `# Prove`, `# Compare`, `# Show`, `# Close`; each lists `Modules:` (module ids), `Grid:` (regions as fractions), `Colour:` (permitted pairings by token name) and `Fails when:`. Fourteen archetypes in total.

- [ ] **Step 1: Failing checks.** Validator asserts: the twelve module ids exist; every archetype has the four labelled lines; every id in an archetype's `Modules:` exists in `modules.md`; there are 12–16 archetypes covering all six groups; `M-chart` contains `Maximum series:` with an integer ≤ the number of palette hues in `brand.json` (Review Focus 2).
- [ ] **Step 2: Run; expect failures.**
- [ ] **Step 3: Write `modules.md`.** Chart module covers palette order, direct labelling, no 3D, no gradient, zero baseline for bars, source line, and the series cap with "group the rest as *Outros* or split the chart". Reference `dataviz` guidance only by principle; do not link external skills.
- [ ] **Step 4: Write `archetypes.md`.** Fourteen, at least one per group, expressed as grid fractions and token names, no stack-specific terms.
- [ ] **Step 5: Run `npm run check`.** Expected: pass.
- [ ] **Step 6: Commit** — `"Add composition modules and archetypes"`.

### Task 4: Exemplar rendering tool and specimen sheet

**Files:**
- Create: `scripts/render-exemplars.mjs`, `docs/composition/exemplars/src/specimen-sheet.html`, `docs/composition/exemplars/specimen-sheet.png`, `docs/composition/exemplars/specimen-sheet.md`
- Modify: `scripts/check-composition.mjs`

**Interfaces:**
- Produces: `node scripts/render-exemplars.mjs [name…]` renders each `exemplars/src/<name>.html` to `exemplars/<name>.png` using `require('playwright')` and `chromium.launch()` with no options, at the canvas size declared in the file's `<meta name="canvas" content="WxH">`. This is author tooling; it is not part of `npm run check`.
- Produces: exemplar convention used by Tasks 5–7: each exemplar `X` has `src/X.html`, `X.png`, `X.md`; `X.md` has sections `## Why it works`, `## Spec`, `## Rubric` (R1–R12 each marked yes/no with a one-line reason), and `## Placeholders` listing every placeholder the user must replace.

- [ ] **Step 1: Failing checks.** Validator asserts that every `exemplars/*.md` has the four sections, every `Rubric` section has R1–R12 and no "no" without a reason, every `src/*.html` has a matching `.png` and `.md`, and no `src/*.html` contains a raw `#rrggbb` colour, `gradient(`, or an emoji codepoint.
- [ ] **Step 2: Write the renderer.** Sizes to canvas meta; waits for `document.fonts.ready`; exits non-zero with the file name on any console error.
- [ ] **Step 3: Build the specimen sheet** (1:1 contact sheet, ≈3200×3200): every module and every archetype drawn small, labelled with its id, using only tokens and `assets/`. Link `styles.css` by relative path.
- [ ] **Step 4: Render** with `node scripts/render-exemplars.mjs specimen-sheet`; open the PNG and check it by eye for overflow, clipped text and contrast.
- [ ] **Step 5: Write `specimen-sheet.md`** per the convention; apply the rubric honestly.
- [ ] **Step 6: Run `npm run check`.** Expected: pass.
- [ ] **Step 7: Commit** — `"Add exemplar renderer and specimen sheet"`.

### Task 5: Institutional deck exemplar (16:9)

**Files:** Create `exemplars/src/institutional-deck.html`, `exemplars/institutional-deck.png` (contact sheet of all slides), one PNG per slide in `exemplars/institutional-deck/`, `exemplars/institutional-deck.md`.

**Interfaces:** Consumes the renderer and convention from Task 4, archetype ids from Task 3. Produces nothing later tasks depend on.

- [ ] **Step 1:** Compose 10 slides covering at least one archetype from each of the six groups; every slide declares its archetype id in `data-archetype`. The validator (extend it) fails if a `data-archetype` is not a known id.
- [ ] **Step 2:** Every slide obeys `slide-16x9` limits: word count ≤ `maxWords`, headline ≤ `maxHeadlineChars`, text ≥ `minText`. Extend the validator to check these on the HTML by counting words per `section`, and run it.
- [ ] **Step 3:** Render, view every slide PNG, fix overflow or crowding; then check contrast pairs against `scripts/contrast-pairs.mjs` for any new pairing used.
- [ ] **Step 4:** Write the `.md` with the rubric result. Anything that scores "no" is fixed, not documented.
- [ ] **Step 5:** `npm run check`, then commit — `"Add institutional deck exemplar"`.

### Task 6: Pitch deck exemplar (16:9)

Same structure as Task 5 with `pitch-deck`. Story arc: problem, why now, solution, how it works, proof (one `chart` or `bignumber` slide using clearly placeholder data), model, team, ask. At least three archetypes not used in Task 5. Uses a different band hue from Task 5 to show the range, with `-ink` text. Steps 1–5 as Task 5; commit — `"Add pitch deck exemplar"`.

### Task 7: Poster (A3) and social card (4:5) exemplars

Same structure as Task 5 with `poster-a3` (format `print-a3`) and `social-card` (format `social-4x5`). The poster must use `assets/patterns/` or a cropped `BrandMotif`-equivalent asset from `assets/motifs/` exactly once. The social card must keep all text inside `safeArea` and obey `maxHeadlineChars`. Commit — `"Add poster and social card exemplars"`.

### Task 8: Link-up and release notes

**Files:** Modify `SKILL.md`, `AGENTS.md` (Building artwork section, repo map), `readme.md` (table row), `docs/recipes.md` (deck and poster sections), `templates/institutional-deck/InstitutionalDeck.dc.html` (one comment line at top), `docs/roadmap/roadmap.md` (decisions + phase 2), `CHANGELOG.md`, `package.json` (`version` → 2.3.0).

**Interfaces:** Consumes everything above. The only new link target is `DESIGN.md`.

- [ ] **Step 1: Failing check.** Validator asserts that `SKILL.md`, `AGENTS.md`, `readme.md` and `docs/recipes.md` each contain a link to `DESIGN.md`, and that `CHANGELOG.md` has a `## 2.3.0` section matching `package.json`.
- [ ] **Step 2:** Make the edits. `AGENTS.md` "Building artwork" becomes a short pointer to `DESIGN.md` and keeps its existing artwork rules. The template comment says it is a functional starter and names the exemplars as the quality reference. The roadmap entry records: HTML-first with export on demand, stack-agnostic consumer, editorial direction, and the PPTX/generator option as phase 2.
- [ ] **Step 3:** `npm run sync && npm run check`. Expected: pass.
- [ ] **Step 4: Commit** — `"Link the composition layer into the repo and release 2.3.0 notes"`.

### Task 9: Fresh-agent acceptance test

**Files:** Create `docs/composition/acceptance.md` (the result record).

- [ ] **Step 1:** Copy the repo to a clean temporary directory outside the working tree. Start a general-purpose subagent whose only instruction is: *"Using only the repository in `<dir>`, starting from its root, make a 10-slide pitch for a fictional scholarship programme. Choose your own output format and stack."* Give it no other hints.
- [ ] **Step 2:** Render its output (or inspect it if it is not renderable) and score it against `rubric.md` yourself.
- [ ] **Step 3:** Record in `acceptance.md`: prompt, stack the agent chose, rubric scores, and every place the agent got lost or ignored a rule. Fix the docs for each such place (not the output), then repeat once with a different prompt (a social card for a school open day) in a different stack if the agent picks one.
- [ ] **Step 4:** `npm run check`; commit — `"Record composition layer acceptance test"`.
- [ ] **Step 5:** Push the branch. Do not open a PR unless the owner asks.

## Self-review notes

- Spec coverage: entry point (T2), principles/rubric (T2), formats (T1), modules/archetypes (T3), specimen + four exemplars (T4–T7), existing-material handling and roadmap (T8), validation and fresh-agent test (T1, T9). Optional `lint:artwork` is deliberately left out of this plan; the validator already checks the HTML exemplars for the same invariants. Add it only if the owner wants it as a consumer tool.
- Two additions beyond the spec's file list, both needed to keep exemplars re-renderable and checkable: `exemplars/src/*.html` and `scripts/check-composition.mjs`.
- Seven format ids (spec lists "A3/A4 portrait" as one entry; split because the sizes differ).
