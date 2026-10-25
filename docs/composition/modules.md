# Modules — the parts every piece is made of

Twelve reusable parts. An [archetype](archetypes.md) is a composition of modules; a format
([formats.json](formats.json)) is the canvas they sit on. Sizes are the format's type roles
(`display`, `h1`, `h2`, `body`, `caption`, `eyebrow`) so the same module works on a slide, a poster
or a card. Colours are token names from [brand.json](../../brand.json). Each module lists 2–3
variants and the condition under which it fails.

## M-headline
The eyebrow (Bold, uppercase, `eyebrow` size, `--rse-color-text-muted`) above an Extrabold headline
(`h1`, or `display` on a cover) in `--rse-color-text-heading`, with tight tracking and at most one
line of support at `h2`–`body`. It is the first thing read on every canvas.
Variants: stacked, oversized, numbered
Fails when: the headline exceeds the format's `maxHeadlineChars`, runs past three lines, is centred
on a multi-line block, or the eyebrow is not the only uppercase on the canvas.

## M-bignumber
A figure at `display` size in `--rse-color-primary` (or in ink on a coloured band), a one-line
label at `body`, and a source line at `caption`. The strongest way to carry a fact.
Variants: solo, pair, row
Fails when: more than three figures share a canvas, a figure is smaller than the headline, the
label is missing, or the figure is not the user's own or a visible placeholder (`000`).

## M-quote
One sentence set at `h1` or `h2`, left-aligned, with a rule or a large opening mark in the accent
hue, and an attribution at `caption`: name, role, unit.
Variants: pull, attributed, full-bleed
Fails when: it is longer than 25 words, carries an invented person or an invented portrait, or the
quotation mark is used as decoration on a canvas with no quote.

## M-figure
An image or illustration with a caption at `caption`. Until real photography exists it is an
[M-imageslot](#m-imageslot).
Variants: full-bleed, framed, cropped
Fails when: it shows a generated or stock photo of people, the caption is missing for a framed
image, or the crop cuts through a face or a piece of text.

## M-list
Up to five items. Each is a short phrase at `body` or `h2`, separated by hairlines or numbered with
the figure at `h2` in the accent hue. Never round bullets.
Variants: numbered, ruled, two-column
Fails when: it has more than five items, an item is longer than two lines, or items are separated
by bullet glyphs.

## M-comparison
Exactly two subjects side by side, or one before-and-after, with the same attributes in the same
order. The difference is the headline; the rest is evidence.
Variants: split, delta, mirrored
Fails when: three or more subjects share a canvas, attributes differ between sides, or the
difference is not stated in words.

## M-table
A header row at `caption` in uppercase-free Bold, hairline rules, no zebra fills beyond one tint,
numbers aligned right. Used for schedules, enrolment windows and comparisons of programmes.
Variants: ruled, banded, compact
Fails when: it exceeds five columns or six rows on a slide, has no header row, or any text falls
below the format's `minText`.

## M-chart
A bar, line or dot chart with direct labels on the marks and no legend where it can be avoided.
Marks use the system's data series tokens in order, `--rse-color-data-1` to `--rse-color-data-4`
(purple-dark, blue-dark, green-dark, yellow-ink), which clear 3:1 against cream and white. Colour
never carries meaning alone. Bars start at zero. Gridlines are hairlines; there are no 3D effects, shadows or
gradients. Every chart has a one-line takeaway as its headline and a source line.
Variants: bar, line, dot
Maximum series: 4
Beyond the maximum, group the rest as "Outros" or split the chart in two. Never add a fifth hue.
Fails when: it has more than four series, a bar axis does not start at zero, a series is
identified by colour alone, the headline names the chart instead of the finding, or the data is
invented rather than the user's own or a visible placeholder.

## M-timeline
Up to six milestones on one axis. Dates at `h2` in the accent hue, labels at `body`, a hairline
axis. The present or the next step is the only filled marker.
Variants: horizontal, vertical, stepped
Fails when: it has more than six milestones, dates are not in chronological order, or more than
one milestone is emphasised.

## M-callout
One block that interrupts the page: a full-width band in one palette hue, a tinted card with its
`-ink` text, or a ruled aside. It carries one sentence or one number.
Variants: band, tint-card, rule
Fails when: two callouts share a canvas, white text sits on an accent hue, or a `-dark` accent is
used as a band.

## M-folio
The quiet frame: page number and section at `caption`, the selo or wordmark in one corner, a source
line where figures appear. It sits inside the format's `safeArea`.
Variants: minimal, sectioned, sourced
Fails when: it is larger than `caption` size, the selo is below its minimum size (45 mm print,
150 px screen), it breaks the selo's clearspace, or it sits beside the Sesc signature.

## M-imageslot
A flat box in `--rse-color-surface-card` or a tint with a pt-BR brief naming the shot needed, for
example "estudantes em sala, luz natural, estilo documental", and its intended crop. Real
photography replaces it later without moving anything.
Variants: full-bleed, half, inset
Fails when: it looks like a photograph, has no brief, or is drawn with stripes, gradients or
stand-in clip-art.
