# DESIGN.md — making decks, pitches, posters and other artwork for the Rede Sesc de Educação

Start here if you were given this repository's URL and asked to make something that is not a web
component: a deck, a pitch, a report, a poster, a social card, a one-pager. You choose the stack
(HTML, PPTX, SVG, Figma, a print pipeline). This repo gives you the brand, the composition rules, the
numbers, reference pieces and a checklist. It does not need installing, building or cloning.

## Brief

The **Rede Sesc de Educação** is Sesc's national network of schools and educational programmes in
Brazil. It is an institution: credibility first, warmth second, never loud. Its slogan is
**"Aprender para a vida acontecer"**; its voice is short declarative sentences in pt-BR, second
person ("você"), verbs of transformation.

The look is **editorial and type-led**. Montserrat Extrabold at a scale that does the work, a strict
grid with asymmetric margins, generous empty space, flat fields of colour, and one oversized cube
motif per composition instead of decoration everywhere. A piece should read in three seconds and
look designed, not assembled.

Everything a person reads is pt-BR. Everything the system is made of (files, ids, keys) is English.
You may use any stack, but the result must be something a designer would accept without a rewrite.
HTML rendered to PDF or PNG is the path of least resistance and the one the exemplars use.

## Hard rules

The full list, with reasons, is [AGENTS.md → Non-negotiables](AGENTS.md#non-negotiables). The ones
that are easiest to break by accident in a non-web piece:

- Colours come from the palette in [brand.json](brand.json). On artwork you may use the `--rse-brand-*` palette directly (`AGENTS.md` keeps it off web components). Flat fields only: no gradients, no textures, no effects.
- Montserrat only, weights 400–900. Headings 800, tight tracking. Eyebrows 700 uppercase, wide tracking. That is the only uppercase.
- The selo and the cube motif are official artwork in [assets/](assets/): never redraw, rotate, stretch or recolour outside the sanctioned combinations. One motif per composition. Wordmark files: purple on cream or white, white on purple, indigo or ink, black on the light accents.
- No emoji, no hand-drawn icons, no stock or generated photography. Use a labelled placeholder that says what shot is needed.
- Never invent Sesc facts (counts, addresses, fees, dates, quotes). Placeholders look like placeholders (`000`).
- Contrast: 4.5:1 for body text, 3:1 for large text. White text never goes on an accent hue; the accents take ink text.
- The selo never sits with the Sesc signature; clearspace is X on all sides.

## Route by intent

Read [principles](docs/composition/principles.md) and [rubric](docs/composition/rubric.md) every
time. Type for artwork comes from the fractions in `formats.json`; the rem scales in `brand.json`
are for web pages. Then read the row for what you are making. Canvas sizes, margins and type scale are in
[formats.json](docs/composition/formats.json), as fractions of the short side, so they convert to
any unit.

| Intent | Read next |
| --- | --- |
| deck | [archetypes](docs/composition/archetypes.md), [modules](docs/composition/modules.md), [formats](docs/composition/formats.json), [exemplar](docs/composition/exemplars/institutional-deck.md) |
| pitch | [archetypes](docs/composition/archetypes.md), [modules](docs/composition/modules.md), [formats](docs/composition/formats.json), [exemplar](docs/composition/exemplars/pitch-deck.md) |
| report | [archetypes](docs/composition/archetypes.md), [modules](docs/composition/modules.md), [formats](docs/composition/formats.json), [exemplar](docs/composition/exemplars/institutional-deck.md) |
| poster | [archetypes](docs/composition/archetypes.md), [formats](docs/composition/formats.json), [exemplar](docs/composition/exemplars/poster-a3.md), [patterns](assets/patterns/) |
| social | [archetypes](docs/composition/archetypes.md), [formats](docs/composition/formats.json), [exemplar](docs/composition/exemplars/social-card.md), [motifs](assets/motifs/) |
| one-pager | [archetypes](docs/composition/archetypes.md), [modules](docs/composition/modules.md), [formats](docs/composition/formats.json), [specimen sheet](docs/composition/exemplars/specimen-sheet.md) |
| web page | [AGENTS.md](AGENTS.md#building-a-page), [recipes](docs/recipes.md), [components](docs/components.md) |

The [specimen sheet](docs/composition/exemplars/specimen-sheet.md) shows every module and archetype on one image: look at it
before you design anything. The exemplars are the quality bar, and each has a written spec for
agents that cannot see images.

For colour, CMYK values, the selo versions and the Sab.IA platform, read
[brand.json](brand.json) and [the brand manual extract](docs/brand-manual.md).

An optional check, if you cloned the repo and have Node: `npm run check` validates the repo's own
data; it does not check your output. Check your output against the rubric.

## Fonts and fallbacks

Montserrat ships as a variable font in [assets/fonts/](assets/fonts/) (`Montserrat-Variable.woff2`,
weights 100–900). A browser uses that file directly. Most other stacks need a TTF: install
Montserrat from Google Fonts (SIL Open Font License), or convert the shipped file, which is what a
Python tool needs. With `pip install fonttools brotli`:

```python
from fontTools.ttLib import TTFont
f = TTFont('assets/fonts/Montserrat-Variable.woff2'); f.flavor = None; f.save('Montserrat-Variable.ttf')
# Pillow: font = ImageFont.truetype('Montserrat-Variable.ttf', size); font.set_variation_by_axes([800])
```

The last line picks the weight: 800 for headings, 700 for eyebrows, 400 for body. Embed or install the
font wherever your stack allows. If your stack cannot embed it
(some PPTX and Figma paths), use Montserrat if it is installed on the viewer's machine, and
otherwise a geometric sans with the same proportions, and **tell the user** the piece uses a
stand-in so they can fix it. Never fall back to a serif or a condensed face.

## Figures and facts

Use the numbers the user gives you and label them as theirs (provenance: where each figure came
from). Where they gave you none, write a placeholder (`000`, `00%`) and list it in your reply. Never
fill a gap with a plausible number, and never describe a real student, unit or testimonial you were
not given. Mark placeholders in the piece itself, in a footer or caption that says "exemplo" (the
exemplars do), so a printout cannot pass for the real thing.

## Exporting

The repo ships no export tool; use what your stack has. A browser can screenshot a page or print it to
PDF with one canvas per page (`@page` set to the canvas size). From Python, [docs/examples/social_post.py](docs/examples/social_post.py)
writes an SVG, which `rsvg-convert`, Inkscape or `cairosvg` turn into a PNG; the official logos and
motifs are plain polygons and paths, so you can also draw them yourself. Whatever you export, look at
the result before you hand it over.

## When asked for something the brand forbids

If the user asks for a gradient, a stock photo, an AI-generated photo of students, an emoji, or a
recoloured selo outside the sanctioned combinations, say no in one sentence and offer the sanctioned
alternative: a flat colour field or an official cube pattern instead of a gradient; a labelled image
placeholder instead of a photo; a Lucide icon from [assets/icons/lucide/](assets/icons/lucide/)
instead of an emoji; one of the sanctioned selo combinations instead of a recolour.
