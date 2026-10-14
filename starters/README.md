# Starters

Blank starting points. Copy one, rename it, replace the content. They are wired to the design
system by relative path (`../styles.css`, `../dist/rse.js`) — if you move a copy elsewhere,
update those paths.

Moving one into another project? Use the copy of `starters/` inside the static kit
(`npm run pack`, or the zip on each GitHub Release) — its paths already resolve. See
[../docs/integration.md](../docs/integration.md).

| File | What it is | Use when |
| --- | --- | --- |
| `page.html` | Static page, tokens only, **no JavaScript at all** | Mocks, artifacts, anything you hand over as a single file. Opens offline. |
| `page-react.html` | Same page built from real components (React UMD + `dist/rse.js`) | Prototypes that need real component behaviour — tabs, accordions, dialogs. |
| `poster.html` | A3 print piece with `@page` rules | Posters, flyers, printed notices. |

For a full page with sections already composed, start from `templates/` instead — see
[../docs/recipes.md](../docs/recipes.md).

## Which one

Start with `page.html`. Move to `page-react.html` only when you need behaviour that markup can't
express; it pulls React from a CDN, so it needs a network connection on first load.

`page.html` deliberately repeats a few component styles (button, card) as local CSS rather than
loading React. Keep those in sync with the tokens, not with a copy of the component source — if a
page starts needing more than two or three of these, switch to `page-react.html`.

## Rules that still apply

Everything in [../AGENTS.md](../AGENTS.md) — tokens only, pt-BR sentence-case copy, no emoji, no
invented Sesc figures, placeholder imagery labelled with the shot needed, and the accessibility
floor. Every starter ships with placeholder numbers written as `000` on purpose: they are meant to
be visibly unreal until someone verifies them.
