# Archetypes — fourteen layouts, grouped by their job in the story

An archetype is a composition of [modules](modules.md) on a grid. **Grid** gives regions as
fractions of the canvas width × height, inside the format's `margin` (written *m*) and on its
`gridColumns`. **Colour** names tokens from [brand.json](../../brand.json); *page* is
`--rse-color-surface-page` (cream) and *band* is any one palette hue with ink text, or brand
purple / indigo with white text. Nothing here is tied to a stack: translate the regions into
whatever your tool uses.

A set is built by choosing the job each canvas does, then the archetype that does it. A deck
usually needs one **Open**, two or three **Argue**, one or two **Prove**, and a **Close**.

# Open

## A-cover
The title canvas. One idea, large, with the selo small in a corner.
Modules: headline, folio, imageslot
Grid: headline in columns 1–8 at the lower half (y 0.45–0.80); the single cube motif bleeds off the right edge at 0.6–0.9 of the height; selo at top left inside *m*; everything else empty.
Colour: band background (`--rse-color-primary` with `--rse-color-text-on-primary`), or page with the headline in `--rse-color-text-heading`.
Fails when: more than a title, a subtitle and the selo are present, or the motif sits behind the headline.

## A-section
The divider between parts. A number and a name, nothing else.
Modules: headline, folio
Grid: section number at `display` in columns 1–3 (y 0.15–0.45); title at `h1` in columns 1–8 (y 0.55–0.75); folio at the bottom edge.
Colour: alternates between page and band so the set has rhythm.
Fails when: it carries body copy, or two section dividers in a row use the same background.

# Argue

## A-statement
One declarative sentence as the whole canvas.
Modules: headline, folio
Grid: headline at `display` or `h1` in columns 1–10 (y 0.30–0.70); no other element above the folio.
Colour: page, or a band for the one statement that matters most.
Fails when: the sentence exceeds `maxHeadlineChars`, or a supporting paragraph is added.

## A-pillars
Three parallel ideas of equal weight.
Modules: headline, list, callout
Grid: headline columns 1–8 (y 0.10–0.30); three equal columns across *m*–(1−*m*) at y 0.42–0.85, each with a number at `h2` in the accent hue, a title at `h2`, one sentence at `body`, separated by hairline rules.
Colour: page, with one tint-card or rule accent; the three columns share one hue.
Fails when: the columns are unequal in length, there are two or four, or each uses a different hue.

## A-process
How something works, in order.
Modules: headline, timeline, list
Grid: headline columns 1–8 (y 0.10–0.30); a horizontal axis at y 0.55 across the margins with up to five steps, each with a numeral, a title and one line.
Colour: page; only the current or first step in the accent hue.
Fails when: more than five steps, or no sequence is implied by position and number.

# Prove

## A-proof-number
One number carries the argument.
Modules: bignumber, headline, folio
Grid: figure at `display` in columns 1–7 (y 0.25–0.65); label and source at columns 1–6 below it; headline in columns 8–12 at the top right, or omitted.
Colour: band with ink text for the strongest figure; otherwise page with the figure in `--rse-color-primary`.
Fails when: the figure is invented, there are more than three figures, or the label is missing.

## A-evidence
A chart that makes one point.
Modules: headline, chart, folio
Grid: headline stating the finding in columns 1–9 (y 0.08–0.25); chart in columns 1–10 (y 0.32–0.88); source line at *m* below.
Colour: page; marks in the `-dark` tones in the order given by [M-chart](modules.md#m-chart).
Fails when: the headline names the chart rather than the finding, or the chart exceeds its series cap.

## A-testimonial
One voice.
Modules: quote, imageslot, folio
Grid: quote in columns 1–8 (y 0.25–0.70) at `h1`; portrait slot in columns 9–12 (y 0.25–0.75); attribution below the quote.
Colour: tint background with its `-ink` text, or page with the quote in `--rse-color-text-heading`.
Fails when: the person, quote or portrait is invented rather than a labelled placeholder.

# Compare

## A-comparison
Two things, side by side.
Modules: headline, comparison, folio
Grid: headline across the top (y 0.08–0.22); two equal halves at y 0.30–0.88, split at x 0.5, with a hairline between them.
Colour: page; one half tinted when it is the recommended one.
Fails when: there are three subjects, or the attributes differ between halves.

## A-data-table
Structured information for reference.
Modules: headline, table, folio
Grid: headline columns 1–8 (y 0.08–0.22); table across columns 1–12 (y 0.30–0.88).
Colour: page; header rule in `--rse-color-primary`; no zebra fills beyond one tint.
Fails when: it exceeds the table module's limits, or the text drops below `minText`.

# Show

## A-image-split
Image and idea, half and half.
Modules: headline, figure, imageslot, folio
Grid: text half at columns 1–6 (headline and one paragraph at `body`, centred vertically at y 0.30–0.75); image half bleeding off the top, right and bottom edges at columns 7–12.
Colour: page for the text half; the image half is a labelled slot with a brief.
Fails when: the image is invented, or text overlaps the image half.

## A-journey
A path over time.
Modules: headline, timeline, folio
Grid: headline columns 1–8 (y 0.08–0.25); axis at y 0.58 across the margins with up to six milestones, labels alternating above and below the axis.
Colour: page; one milestone, the present, in the accent hue.
Fails when: milestones are out of order, or more than one is emphasised.

# Close

## A-ask
The one thing the audience should do next.
Modules: headline, callout, folio
Grid: headline at `h1` in columns 1–9 (y 0.30–0.60); one action line at `h2` below; the callout band spans the lower fifth, edge to edge.
Colour: band background or page with a single band; the action line in ink or `--rse-color-primary`.
Fails when: there are two asks, or the action has no concrete next step (a date, a place, a link).

## A-contact
Who to talk to, and where.
Modules: headline, list, folio
Grid: headline columns 1–6 (y 0.25–0.45); contacts in columns 7–12 as a ruled list (y 0.25–0.75); selo at the bottom left with its clearspace.
Colour: page.
Fails when: the details are invented rather than flagged placeholders, or the Sesc signature sits next to the selo.
