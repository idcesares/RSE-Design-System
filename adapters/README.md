# Host adapters

An adapter maps the design system onto a product the Rede runs but does not build from this repo:
a CMS theme, a vendor portal. It targets the **Bronze** conformance level of the roadmap ("looks
like the Rede": palette, Montserrat, type scale, spacing) without touching the host's code beyond
its theming surface. Everything here is generated from the tokens by `scripts/build-adapters.mjs`
(`npm run sync`); never edit the output by hand.

## WordPress (block themes)

`wordpress/theme.json` (theme.json v3, validated against the WordPress 6.6 schema) gives the
editor:

- **the palette** — the 21 published Rede values plus ink and white, with pt-BR names. Custom
  colours, custom gradients, duotone and the core palette are switched off, so editors cannot
  leave the palette (non-negotiable 1);
- **Montserrat** (400–900, variable) as the only font family;
- **the type scale** (`Destaque 1` … `Legenda`, the system's fluid `clamp()` sizes) and **spacing**
  (`Espaço 1` … `Espaço 10`), with custom sizes off;
- **layout widths** (`contentSize` = `--rse-container-md`, `wideSize` = `--rse-container-xl`),
  **shadows**, and radius / section rhythm under `--wp--custom--rse--*`;
- **element styles** for page, links, headings and buttons, from the role and component tokens.

`wordpress/styles/escuro.json` and `alto-contraste.json` are style variations carrying the dark and
contrast themes (Appearance → Editor → Styles).

To install, in the theme (or a child theme) root:

1. Copy `adapters/wordpress/theme.json` and `adapters/wordpress/styles/` over the theme's own.
2. Copy `assets/fonts/Montserrat-Variable.woff2` and `Montserrat-Italic-Variable.woff2` to
   `assets/fonts/` in the theme (the `fontFace` entries point there).
3. To use the components' plain-HTML markup (`.rse-*`, from each `.prompt.md`) in Custom HTML or
   pattern blocks, enqueue the CSS from the static kit — tokens, the runtime base and the
   components, *not* `styles.css` (it restyles `body` and headings, which the theme owns):

   ```php
   add_action( 'wp_enqueue_scripts', function () {
       $kit = get_theme_file_uri( 'rse' ); // the static kit, copied into the theme as rse/
       wp_enqueue_style( 'rse-tokens', "$kit/tokens/tokens-only.css", array(), null );
       wp_enqueue_style( 'rse-runtime', "$kit/tokens/base-runtime.css", array( 'rse-tokens' ), null );
       wp_enqueue_style( 'rse-components', "$kit/dist/components.css", array( 'rse-runtime' ), null );
   } );
   ```

   Behaviour that needs a controller (tabs, accordion, modal) needs `dist/rse.js` and React, or
   host JavaScript; the CSS gives appearance and states only.

What WordPress cannot enforce, editors must: a band is purple or indigo with white text, or a light
or mid accent with ink text — never white text on an accent (`AGENTS.md`, building a page). The
selo, the motif and the photography rules apply unchanged.

## TOTVS portal (enrollment)

Not generated yet, on purpose: a skin maps tokens onto the portal's own selectors and variables,
and those are not available to this repo. Writing selectors blind would ship a stylesheet that
matches nothing, or the wrong thing. When the portal's theming surface is known (its CSS custom
properties if it has them, otherwise its markup), the adapter is a stylesheet that:

- loads `tokens/tokens-only.css` and maps the portal's variables or selectors onto **role**
  tokens (`--rse-color-*`, `--rse-button-*`, `--rse-input-*`, `--rse-card-*`), never raw values;
- adds every new foreground/background pair to `scripts/contrast-pairs.mjs`;
- is generated here like the WordPress one, so a token change reaches the portal on release.

Anything deeper than Bronze is a vendor request, with the tokens as the specification.
