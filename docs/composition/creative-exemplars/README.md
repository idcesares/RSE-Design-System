# Creative exemplars — what ambition looks like inside the brand

The editorial [exemplars](../exemplars/) show the finish of a calm, static piece. These three show
the other half: pieces that move, respond and tell a story. Each has a different idea, a different
layout and a different technique, so that none of them is a template to copy. They are the quality
bar for the showpiece, explainer and interactive profiles in
[creative latitude](../creative-latitude.md); the how-to is in [artifact craft](../artifact-craft.md).

Open the `.html` files in a browser (no build step, they link the repo's own `styles.css` and
`motion.js`). The `.png` beside each is a contact sheet for agents that cannot run a page.

| Exemplar | Idea | Awe moment | Technique |
| --- | --- | --- | --- |
| [results-pitch.html](results-pitch.html) · [png](results-pitch.png) | A year of results told as a journey that widens, six canvases with one rhythm | The 87% that counts up over a gradient, then the funnel that grows | Slide transitions, count-up, SVG line that draws itself, bars that fill, keyboard and button navigation |
| [flashcards.html](flashcards.html) · [png](flashcards.png) | A deck with weight: a stack you feel, a turn, a decision | The card that tilts with your finger and flies off as you answer | CSS 3D flip on a real button, pointer drag with stamp feedback, keyboard shortcuts, result ring |
| [org-orbit.html](org-orbit.html) · [png](org-orbit.png) | An organisation as an orbit: the Rede at the centre, choosing anything lights its path home | The map that dims everything except the path you chose | Generated SVG, roving focus on real buttons, selection state, pulse at the core |

## What they have in common

- **A stated idea first**, and a layout that follows from it rather than from a template.
- **Palette gradients as light**, with text measured at the worst stop (white only on purple, indigo
  or ink; ink on the light accents).
- **Motion with a reason**, and a complete reduced form: the same page under `data-rse-motion="reduced"`
  (or the OS setting) is finished and usable, with no travel, loops or counts.
- **Every control is a real control**: focus ring, keyboard path, 44 px targets, text alternatives.
- **No hex in the file.** Colours are `var(--rse-…)`; the few places JavaScript needs a colour map to
  `var()` strings, never to values.
- **Example data labelled as such** ("Dados de exemplo", "exemplo"), listed to the user.

## Creative review (see [creative latitude](../creative-latitude.md#creative-review))

| | results-pitch | flashcards | org-orbit |
| --- | --- | --- | --- |
| C1 idea stated and delivered | yes: a year as a widening journey | yes: a deck with weight | yes: an organisation as an orbit |
| C2 awe moment is the strongest thing | yes: the count-up and funnel | yes: the dragged card | yes: the lit path |
| C3 hierarchy clear at a squint | yes | yes | yes |
| C4 vocabulary fits the content | yes: dashboard for data | yes: cards for recall | yes: orbit for a hierarchy |
| C5 states, focus, keyboard | yes | yes | yes |
| C6 motion explains, reduced form complete | yes | yes | yes |
| C7 smooth on a mid-range phone | yes: transforms and opacity | yes | yes |
| C8 invariants hold, gradient contrast measured | yes | yes | yes |
| C9 unlike the last piece | yes | yes | yes |

## Replacing the example content

All people, units, words and figures are examples. Replace the data object in each file's script and
remove the "exemplo" labels only once the content is verified.
