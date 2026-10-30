# Creative latitude — what is fixed, and everything else is yours

The brand is a small, firm set of invariants. Everything around them is craft, and craft is where
a piece earns its place. Be ambitious. A deck, an artifact, a page, a flashcard or a 3D scene for
the Rede should make a person stop and look, and it should be well structured, easy to use and
unmistakably the Rede while doing it.

The other composition docs ([principles](principles.md), [modules](modules.md),
[archetypes](archetypes.md), [formats](formats.json)) describe one thing very well: the **static
editorial piece** (a printed poster, a calm institutional slide). They are defaults for that job,
not a cage for every job. This page says how to leave them.

## Two tiers

| Tier | What it covers | Who decides |
| --- | --- | --- |
| **Invariants** | the selo, the palette, Montserrat, pt-BR copy, no invented facts or imagery, accessibility, the geometry of the six signature cube constructions | the brand. Never bend these. |
| **Craft** | concept, layout, structure, diagrams, illustration, data storytelling, depth, gradients, light, motion, interaction, 3D | **you.** Use judgement and take risks. |

The invariants are the full list in [AGENTS.md → Non-negotiables](../../AGENTS.md#non-negotiables).
Two of them are routinely misread as limits on craft, so:

- *"No hand-drawn icons"* is about **icons**: a glyph standing in for a Lucide icon. It does not
  stop you drawing diagrams, org charts, maps, illustrations, charts or scenes out of palette
  geometry. Do that freely.
- *"Generated shapes come only from the motif engine"* is about **the cubo impossível family**.
  Do not forge a lookalike of it. An original scene, structure or illustration is your own work;
  say it is new work and not supplied artwork.

## Pick the kind of piece first

Choose the profile that fits the job. The wrong profile is the usual source of a dull result.

| Profile | Look for | Lean on |
| --- | --- | --- |
| **Editorial** (poster, print, quiet slide, report cover) | calm, type-led, lots of air | [principles](principles.md), [archetypes](archetypes.md), [rubric](rubric.md) in full |
| **Showpiece** (cover, hero, pitch opener, social hero, launch page) | an *awe moment*: scale, depth, light, a surprising device | this page; the editorial numbers become starting points |
| **Explainer / data story** (org structure, journey, system, results) | the diagram is the argument | [artifact-craft](artifact-craft.md) diagrams and data sections |
| **Interactive artifact** (flashcards, calculators, quizzes, explorers, dashboards, configurators) | clear affordances, delightful feedback, no dead ends | [artifact-craft](artifact-craft.md) states and interaction |
| **Immersive** (Three.js / WebGL / canvas, animated scenes) | one controlled, beautiful moment that works on a phone | [artifact-craft](artifact-craft.md) 3D section |

A real piece is often two profiles: an editorial deck with one showpiece slide and one data story.
Switch profile per canvas, not per project.

## Concept before layout

Before you place anything, write down in one line the **idea**: the metaphor or device that makes
this piece this piece. "A trail of lit steps from enrolment to graduation." "A network that grows
as the cursor moves." "A card that opens like a notebook." Then design towards it. If the idea is
"title, three bullets, logo", you have not started.

- Do not reuse the layout of the last piece you made, nor of an exemplar. The exemplars
  ([institutional deck](exemplars/institutional-deck.md), [pitch](exemplars/pitch-deck.md),
  [poster](exemplars/poster-a3.md), [social card](exemplars/social-card.md)) show the *level of
  finish*, not the structure to copy. Two pieces side by side should not look like siblings by
  template.
- Choose a **visual vocabulary** that fits the content: a tree, a map, a timeline, a ladder, a
  network, orbits, layers, a path, a stacked landscape, a ring, a ledger. Structure and organisation
  are things to *show*, not list.
- Give every piece one **awe moment**: the thing someone would describe to a colleague. It can be
  scale, an unexpected viewpoint, a perfectly timed reveal, a depth effect, a tactile interaction,
  a 3D object they can turn. One is enough; make it excellent.

## What you may use

All of this is open, in any profile, provided the invariants hold:

- **Depth and light.** Subtle gradients (below), soft glows used as *light*, layered translucent
  planes, overlap, cropping, scale contrast, offset shadows, blurred backdrops, grain only if it is
  extremely light and never over text.
- **Colour in range.** Every palette hue, tints and shades from the palette ramps, and a colour
  story across a set. The one-band-hue and one-hue-per-composition defaults are *editorial*
  defaults. In showpiece, explainer and data pieces you may use several hues where the content has
  several categories or a progression. Keep each text pair above its contrast floor.
- **Layout.** Asymmetry, bleeds, diagonals, overlap, bento grids, split screens, horizontal
  journeys, full-viewport scenes, sticky scroll stories, canvases, unusual aspect ratios. A 12
  column grid is a good habit; breaking it on purpose is a skill.
- **Illustration and diagrams** drawn from palette geometry (shapes, lines, curves, isometric
  blocks, abstract figures). No photographs of people; no invented real places or people.
- **Motion** (the artifact tier below) and **interaction** of any quality you can make robust.
- **Libraries.** Three.js and other WebGL helpers, GSAP, D3, canvas, Lottie-like SVG animation,
  charting libraries. See [artifact-craft](artifact-craft.md) for how to load them safely.
- **Density when the job calls for it.** A dashboard, a data room or a reference sheet may be dense
  and still be well organised. The "a third empty" and `maxWords` defaults serve calm editorial
  work; for a dashboard-style pitch or deck, density with a clear hierarchy is correct.

## Gradients

Subtle gradients are part of the toolkit in **artwork, artifacts, decks, pitches and page heroes or
bands**. They are not used in the CSS contract of the UI components (those stay flat so they theme
cleanly), and they never touch the official artwork.

Rules for a gradient to be on brand:

1. **Palette stops only.** Colours come from the palette (`--rse-brand-*`, or `--rse-color-*` roles
   on a web page). Never a colour sampled from artwork, never an off-palette in-between hue.
2. **Subtle means related.** Blend within one hue family (light → base → dark), or between a hue
   and a neighbouring surface (cream, white, ink, indigo, purple). Two or three stops. A rainbow
   across a flat band is not subtle; reserve full-spectrum sweeps for a deliberate spectrum piece.
3. **Contrast at the worst point.** Text sits on the *least* favourable stop behind it, not the
   average. White text only where every stop under it is purple, indigo or ink; ink text where
   every stop under it is a light or mid accent or a tint. White never goes on an accent.
4. **Never behind the selo or on its fill.** The selo keeps its sanctioned colour combinations and
   clearspace; place it on a solid area or a region where the gradient is effectively flat.
5. **Never inside the signature constructions or the engine's output.** `BrandMotif` and the
   generated shapes and patterns stay flat. They may sit *on* a gradient field.
6. **Gradients are light, not decoration.** A gradient should suggest a light source, a horizon or
   depth. If it can be removed with no loss, remove it.

## Motion in artifacts

UI state changes in components keep their tight 360 ms cap and the standard easing, because they
are used a hundred times a session. **Artwork and artifacts are a different tier** and may
choreograph.

| | UI state (components) | Artifact motion |
| --- | --- | --- |
| Duration | `--rse-duration-fast/base/slow` (≤ 360 ms) | whatever the moment needs: a flip 400–700 ms, an entrance sequence 0.8–3 s, ambient loops of any length |
| Easing | `--rse-ease-standard` / `--rse-ease-out` | start from `--rse-ease-assemble` / `--rse-ease-settle`; custom curves and tasteful springs and overshoot are fine when they add meaning (a flip landing, a card snapping into place) |
| Reveal | opacity + small travel, once | staggered, choreographed, scroll-linked, parallax and pinned scenes are all allowed |
| Ambient | needs a pause control | needs a pause control if it autoplays beyond five seconds |

What does not change, because it is accessibility:

- **Honour the motion setting.** Read `data-rse-motion` (else `prefers-reduced-motion`). When it is
  reduced, show the finished state with no travel, no looping, no camera drift, no parallax. Keep
  gentle opacity and colour changes. The code for this is in [artifact-craft](artifact-craft.md).
- Nothing flashes more than three times a second.
- Nothing essential is *only* in motion. The final frame must be complete, readable and usable.
- Motion has a reason: it explains a relationship, shows state, directs the eye, or delights at
  one chosen moment. Constant motion everywhere is noise.
- Animate `transform`, `opacity`, `filter`, canvas and WebGL. Avoid animating layout properties.

## Structure and UX

Beautiful and organised, always. Creative layouts are still read in order.

- A clear **reading and action order**: one thing first, one thing next. You can break the grid;
  you cannot lose the hierarchy. Squint test from [principles](principles.md#reading-order-test).
- **Every interactive element** has rest, hover, focus-visible, active, disabled and (where it
  applies) selected, loading and error states. Focus is always visible. Hit targets are at least
  44 px on touch.
- **Keyboard and screen reader paths** work end to end. A flashcard is a button, a tab list is a
  tab list, a 3D viewer has keyboard controls and a text equivalent.
- **Feedback** within 100 ms of any action. Anything slower shows progress.
- **Responsive on purpose.** Check 360 px wide and a large screen. Rearrange rather than shrink.
- **Content first.** Real structure comes from the content: a tree for hierarchy, a path for
  sequence, a matrix for comparison, a ring for share of whole. Do not decorate what you could
  explain.

## Always, whatever the profile

These are the invariants a creative piece must still pass:

- Montserrat only; headings Extrabold; the eyebrow is the only uppercase; pt-BR sentence case.
- Palette colours only, contrast floors met (4.5:1 body, 3:1 large text and UI), white never on an
  accent hue.
- Selo unmodified, clearspace X, above its minimum size, never with the Sesc signature.
- Signature cube constructions untouched; one focal construction if you use one.
- No emoji; icons from `Icon` (Lucide). No photos, real or generated, of people; `<image-slot>`
  placeholders instead.
- No invented Sesc facts. Placeholder figures look like placeholders and are listed to the user.
- Accessible: keyboard, focus, text alternatives, reduced motion, 360 px.

## Creative review

Run this after the [rubric](rubric.md) (use the rubric items that apply to the profile; R4's
safe-area and R8's density limits are for print and calm slides). Answer yes or no and fix any "no".

- **C1.** Can you state the idea in one line, and does the piece deliver it?
- **C2.** Is there an awe moment, and is it the strongest thing on its canvas?
- **C3.** Is the hierarchy clear at a squint, even with the layout broken or dense?
- **C4.** Is the visual vocabulary right for the content (not a list that wanted to be a diagram)?
- **C5.** Does every interactive piece have all its states, a visible focus and a keyboard path?
- **C6.** Does motion explain or delight, finish in a complete frame, and honour reduced motion?
- **C7.** Is it fast enough on a mid-range phone (smooth, no long blank, no layout jump)?
- **C8.** Do all invariants above still hold, with contrast measured at the worst point of any
  gradient or animated frame?
- **C9.** Would it look different from the last thing you made for the Rede? If not, push further.

When you hand the piece over, say in two lines what the idea was, what is derived or new (a new
illustration, an original 3D scene, a purple/orange/yellow construction) and which numbers or
images are placeholders.
