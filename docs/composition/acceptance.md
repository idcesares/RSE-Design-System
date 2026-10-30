# Acceptance test — can an agent use this from the repo alone?

The test for the whole composition layer: a fresh agent with no context gets a clean copy of the
repo (without the design spec and plan) and one sentence, and picks its own stack. I score what it
makes against [rubric.md](rubric.md) and read what it says was unclear. The agent's own report is
evidence, not a verdict. Run on 2026-10-25, at version 2.3.0.

## Run 1 — a pitch deck, free choice of stack

**Prompt:** make a 10-slide pitch deck for a fictional scholarship programme (bolsas de estudo).

**Stack the agent chose:** HTML, rendered with Playwright to PNG and PDF.

**Result:** ten slides. Scored by script and by eye:

| Check | Result |
| --- | --- |
| Words per slide (limit 40) | 8–37, pass |
| Headline length (limit 60) | 19–41 characters, pass |
| One motif per slide | pass (cover only) |
| Raw hex, gradients | none |
| One band hue, with ink text | pass (green-light) |
| Placeholders flagged in the piece and in the reply | pass |
| Selo minimum size | pass (reused the exemplar's wordmark, about 250 px wide) |

**What it showed.** The agent read `DESIGN.md`, the principles, the rubric, the archetypes, the
modules, the formats and the pitch exemplar, and its deck follows the exemplar's structure and
reuses its stylesheet. That proves an agent can find and follow the route. It does not prove that an
agent can compose something new from the rules alone: run 2 is the better test of that.

## Run 2 — a social card, no browser allowed

**Prompt:** one social card announcing a school open day, with Python only and no browser or HTML
rendering. The constraint was mine, to test the claim that the layer does not depend on HTML.

**Stack the agent chose:** Python and Pillow, with a rasteriser the agent wrote for the logo and
cube SVGs (no SVG library was installed).

**Result:** a 1080 × 1350 PNG that is on brand apart from the font: ink on orange-light, official wordmark and cube-hollow
unmodified, headline at the format's size, everything inside the safe area, one cube cropped by the
corner, placeholders flagged. One rubric item is only partly met: R11. The agent could not read the shipped WOFF2, used Inter as a
stand-in and said so, which `DESIGN.md` and R11 allow, but the card is not set in Montserrat and its
headline wraps differently from the exemplar.

## What the two runs found, and what changed

| Finding | Fix |
| --- | --- |
| Only a WOFF2 font ships; Pillow, PPTX and Figma cannot use it (run 2, the main failure) | `DESIGN.md` now gives a TTF route and a three-line conversion recipe, which I checked renders real Montserrat ExtraBold in Pillow |
| `social_post.py` writes an SVG and leaves the PNG to "a browser or Inkscape" (run 2) | New "Exporting" section in `DESIGN.md` |
| `formats.json` fractions versus the rem scales in `brand.json` (run 2) | `DESIGN.md` says artwork uses the fractions |
| `AGENTS.md` keeps `--rse-brand-*` for artwork, but the exemplars use it on slide fields (run 1) | `DESIGN.md` says it is allowed on artwork |
| Which cube colour goes on which field was unstated (run 1) | Principle 6 gives the pairings the exemplars use |
| Which wordmark file goes on which surface was unstated (runs 1, 2) | `DESIGN.md` hard rules |
| How to word placeholder labels inside the piece (run 1) | `DESIGN.md`: say "exemplo" in the footer or caption |
| A solo figure is larger than `display` in the exemplar (run 1) | `modules.md`: up to 0.46 of the short side |
| Leading and tracking were not stated (run 2) | New principle 12 |
| Which colour pairs are pre-verified was unstated (run 2) | Principle 7 cites the repo's gate |
| Wordmark width from its height was not given (run 1) | `rubric.md` R12 |

## Not fixed

- The `docs/examples/social_post.py` docstring says everything comes from `brand.json`, but it also
  hard-codes some sizes. It is existing code outside this change.
- Run 1's agent did not run the repo's own check, and neither agent could measure contrast. Both are
  expected for a URL-only consumer: the rubric is meant to be applied by eye and by count.
- The fixes in the table above were applied after the runs and not re-run with a fresh agent; only
  the font recipe was checked by hand (it renders real Montserrat in Pillow).
- Two runs are a small sample. The next real use of the layer is the better test.

## Runs 3–5 — creative latitude (2026-10-30)

After adding [creative latitude](creative-latitude.md), three fresh agents each got a clean snapshot of
the repo and one neutral sentence (no mention of creativity): a flashcard study artifact, an
explorable organisation structure, and a six-slide dashboard-style results pitch. I rendered each
output and read what the agents said was unclear.

| Run | Idea the agent chose | Verdict |
| --- | --- | --- |
| Flashcards | A notebook-page card on an indigo-to-ink desk; the word turns to its meaning; misses go to the back of the pile; a ring summarises the round | Distinct, tactile, accessible. Not parametric. |
| Org structure | Four linked columns (leadership, areas, units, programmes); choosing any node lights its connections | Distinct and usable; the detail panel covers the chart on load. |
| Results pitch | A funder asks five questions and each slide answers one; dense, organised, with example data labelled on every slide | The strongest of the three; used the official cube at full strength. |

All three stated an idea, chose different layouts, used palette gradients with a reduced-motion
guard, and none repeated an exemplar's structure. Their reports show what was still unclear, and
what changed:

| Finding | Fix |
| --- | --- |
| A standalone artifact had no stated way to get the tokens. One agent invented dark-theme values and wrote 51 hex colours; two copied token files by hand | [artifact-craft](artifact-craft.md#colour-in-a-standalone-artifact) now lists the exact files to copy and says never to retype or invent values; `starters/artifact.html` shows the wiring |
| Two agents put the supplied cube at 0.3 opacity on a purple field, where the green turns to a muddy grey | Principle 6, `AGENTS.md` and `DESIGN.md` say 0.3 is only for a construction sitting under content; clear of text it runs at full strength |
| The `000` placeholder rule does not give a dashboard any shapes (pitch run) | `creative-latitude.md` and `DESIGN.md` allow plausible example data in one named object, labelled on every canvas and listed to the user |
| The 3:1 headline ratio and 40-word cap cannot hold on a dense data slide (pitch run) | Principles say a clear hierarchy always holds, a dense canvas may use a smaller ratio |
| No shuffle or network icon in the vendored set (two runs worked around it) | Vendored `shuffle`, `network`, `layers`, `workflow` and `route` from Lucide |
| Dark and contrast themes and 360 px were not tested by any agent | The creative review and `artifact-craft` already ask for it; an artifact checker would make it automatic (not built yet) |

Three runs are a small sample, and each agent read the new guides because the neutral prompt still
pointed it at `AGENTS.md` and `DESIGN.md`. The next real use is the better test.
