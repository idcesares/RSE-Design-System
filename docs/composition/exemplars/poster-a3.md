# Poster — A3 portrait

![Poster A3](poster-a3.png)

An enrolment poster: a slogan, a deadline and an address. Rendered at 1485 × 2100 px (5 px per mm of
an A3 sheet, 297 × 420 mm). Source: [src/poster-a3.html](src/poster-a3.html). Format `print-a3`.

## Why it works

- **A poster is a headline.** "Aprender para a vida acontecer" at about 178 px takes the upper half
  of the sheet, set in four words over three lines; the support is one deadline and one address.
  Read from a few metres, the slogan is the only thing that has to land.
- **The cube is architecture.** One green cube, cropped by the right edge and by the purple band,
  fills the empty lower right. It sits clear of the headline and carries no text.
- **Hierarchy by size, not by decoration.** Eyebrow, headline, deadline, address: four sizes with a
  jump of at least 3 to 1 between the headline and everything else. No boxes, no icons.
- **One band, one colour.** The lower fifth is a flat brand-purple field with white text; the rest
  is cream. The selo is the official wordmark in purple, at about 345 px (roughly 69 mm) wide.
- **Nothing to trim.** Text stays inside a 119 px (24 mm) margin, well within the 5% safe area.

## Spec

- Format `print-a3`: margin 8% of the short side (119 px), twelve columns, bleed 0.01 (3 mm, 15 px).
- Type: display 0.12, h1 0.07, h2 0.04, body 0.02, caption 0.015 of the short side.
- Under 60 words (it has about 16) and a display headline under 38 characters (it has 30).
- Archetype: `cover`. One motif: `assets/motifs/cube-cube.svg`, official fills.
- This PNG is the trimmed size. For a print file extend the purple band and the cube 15 px past each edge, so a cut never leaves a white sliver. Print at 100% with background graphics on. For A4 reuse the same fractions on 210 mm.

## Rubric

- R1: yes — the slogan reads first and the wordmark says who it is from
- R2: yes — the headline is about 178 px against 30 px body copy, close to 6 to 1
- R3: yes — one 119 px left margin; headline, deadline and address share it
- R4: yes — more than a third of the sheet is empty; the text stays out of the safe-area band and only the band and the cube bleed into it
- R5: yes — ink on cream and white on brand purple, both gated pairs
- R6: yes — one cube, cropped, clear of all text
- R7: yes — one band, brand purple, with white text
- R8: yes — about 16 words, a 30-character headline, smallest text 27 px (the eyebrow, 0.018 of the short side, above the 0.014 minimum)
- R9: yes — flat fields only
- R10: yes — deadline, address and phone are placeholders and are listed below
- R11: yes — pt-BR, sentence case, no emoji, Montserrat only
- R12: yes — official wordmark, unmodified, about 69 mm wide (minimum 45 mm), clearspace respected, no Sesc signature

## Placeholders

- "Matrículas abertas" and the deadline `00/00`: confirm the enrolment window with the unit.
- The address and the telephone of the unit.
