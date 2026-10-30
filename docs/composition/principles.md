# Principles — the editorial grammar

How a static editorial piece for the Rede looks (a poster, a print page, a calm slide), whatever the
stack or format. Numbers live in [formats.json](formats.json); the brand's non-negotiables are in
[AGENTS.md](../../AGENTS.md#non-negotiables) and are not repeated here. Each rule has the
**generic version** to avoid, because the generic version is what an unguided agent produces.

**These are defaults, not a cage.** They are the grammar of the *editorial* profile. A showpiece,
explainer, interactive or immersive piece is built under
[creative-latitude](creative-latitude.md): the invariants stay, and the craft is yours. Where a
rule below says "one hue", "a third empty" or "flat", read it as the right starting point for a
calm canvas, and depart on purpose when the idea needs it. Rules 1, 10 and 13 (one idea, honest
placeholders, readable type) still hold in every profile, and a clear hierarchy always does; a dense
data canvas may use a smaller headline-to-body ratio than rule 2 if the first read is still obvious.

1. **One idea per canvas.** A slide, poster or card says one thing, and everything on it serves that
   thing. *Generic:* a title, three bullets and a logo, each competing.
2. **A scale jump of at least 3:1.** The headline is at least three times the body size
   (`type.h1 / type.body` in the format). The contrast in size is the hierarchy; weight and colour
   only confirm it. *Generic:* a headline 1.4× the body, so everything looks the same size.
3. **Headlines left-aligned, on a grid.** Align to the format's `gridColumns` and to the shared
   margin. Margins are asymmetric: more room at the top and on the reading side than at the bottom.
   Centred text is for a single short line, such as a closing. *Generic:* everything centred, boxed
   and evenly padded.
4. **Whitespace is content.** Aim for at least a third of the canvas empty. Remove an element before
   you shrink one. *Generic:* filling the gap with an icon grid.
5. **Eyebrow, headline, then one support.** Bold uppercase eyebrow (the only uppercase), Extrabold
   headline, and one block of supporting text, figure or image. A fourth tier is a second slide.
   *Generic:* subtitle, tagline, caption and footer at four similar sizes.
6. **The focal cube motif appears once, large, and cropped.** It bleeds off an edge at a scale that makes it
   architecture, not ornament, and it never sits behind text that must be read. At full strength it is the picture; the roughly 0.3
   opacity is only for a construction that does sit under content, because at 0.3 over purple or
   indigo the supplied green or pink turns to a muddy grey. The supplied cubes
   come in green, blue and pink: put a cube of one family on a field of another (green on purple or
   cream, pink on blue, green or indigo, blue on orange), never on its own hue. The `BrandMotif`
   component can derive purple, orange and yellow; say so when you use them. A composition is one
   canvas, so a deck may use a different construction on each. A pattern is a field, not a construction,
   and a loader is transient; neither counts as the focal motif. *Generic:* small
   cubes scattered as bullets or dividers.
7. **One hue per composition (layouts).** The page is cream (`--rse-color-surface-page` / `--rse-brand-cream`)
   or white. A single band or field takes one palette hue: the brand purple (`--rse-color-primary`)
   or indigo with white text, or a light or mid accent with ink text (`--rse-brand-ink`). The
   brand purple used as text or line colour (a big figure, a rule, a step number) is the brand
   itself and does not count as a second hue. Use the paired tint and its ink
   (`--rse-color-tint-<hue>` with `-ink`) for small labels. These pairings are measured and gated by
   the repo (ink on the light accents is 4.8–10:1). Never white on an accent, never the mid
   `--rse-brand-purple` or any other `-dark` accent as a band (the primary purple is the one dark tone
   that works). The one exception is the artwork itself: a multi-hue pattern is allowed only as a
   hero field or a standalone spectrum piece; page text and bands stay in one hue, and text never
   sits directly on pattern cells (use a solid panel). *Generic:* a rainbow of six hues across one
   slide.
8. **Honest edges, depth by intention.** Editorial default: rectangles with square or token-radius
   corners, hairline rules and flat fields. Depth is allowed when it earns its place: a subtle
   palette gradient that reads as light ([the gradient rules](creative-latitude.md#gradients)),
   layering, overlap, the system's shadows. No textures or noise over text, no off-palette colour,
   no glow that lowers contrast. A pattern and the signature constructions stay flat; they may sit
   on a gradient. *Generic:* a default gradient banner or glow with no light source behind it.
9. **Numbers are the picture.** A figure set at display size, with a short label, is stronger than a
   chart of the same data. Use a chart only when the comparison is the point, and then follow the
   [chart module](modules.md#m-chart). *Generic:* a dashboard of tiny tiles.
10. **Real placeholders.** Imagery is a labelled box naming the shot needed, in pt-BR
    ("estudantes em sala, luz natural, estilo documental"). Facts are visibly placeholder. The
    piece should be honest about what is not yet real.
11. **Rhythm across a set.** In a deck or report, alternate dense and empty canvases, change the
    background every few slides, and put the strongest statement first and last. *Generic:* ten
    identical slides.
12. **Set headlines tight, body loose.** Headlines at line-height 1.04–1.1 with tracking −0.02em
    (`--rse-letter-spacing-tight`); body at 1.5; eyebrows at +0.14em (`--rse-letter-spacing-eyebrow`).
    *Generic:* default line-height everywhere.
13. **Cut copy before shrinking type.** If text overflows, shorten it to the format's `maxWords` and
    to `maxHeadlineChars` (headline at h1) or `maxDisplayChars` (headline at display), which hold about
    three lines; do not reduce the type below `minText`.

## Reading order test

Squint at the piece. In three seconds you should be able to say what it is about (the headline),
who it is from (the selo or wordmark) and what to do or remember (one supporting element). If you
cannot, remove something. [rubric.md](rubric.md) turns this into twelve checks.
