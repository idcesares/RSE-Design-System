#!/usr/bin/env node
// Builds host adapters from the tokens (dist/tokens.json) and the palette (brand.json):
//
//   adapters/wordpress/theme.json          a WordPress block theme's theme.json (v3): the Rede
//                                          palette, Montserrat, the type scale, spacing, layout
//                                          widths and shadows, with custom colours, sizes and
//                                          gradients switched off so editors stay on the system.
//   adapters/wordpress/styles/*.json       style variations: "Escuro" and "Alto contraste", the
//                                          system's dark and contrast themes resolved for WordPress.
//
//   node scripts/build-adapters.mjs          # write
//   node scripts/build-adapters.mjs --check  # exit 1 if stale
//
// Values are resolved (hex, rem, clamp()) rather than var(--rse-…), because the block editor
// shows presets as swatches and sizes and WordPress has no notion of the system's themes; the
// variations carry those. Everything a person reads (palette and size names) is pt-BR.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const tokens = JSON.parse(read('dist/tokens.json'));
const brand = JSON.parse(read('brand.json'));
const pkg = JSON.parse(read('package.json'));
const SCHEMA = 'https://schemas.wp.org/wp/6.6/theme.json';

const mode = (m) => tokens.modes[m];
const v = (name, m = 'light') => {
  const value = mode(m)[name] ?? mode('light')[name];
  if (value === undefined) throw new Error(`build-adapters: ${name} is not a token`);
  return value;
};

// ─── Palette ───────────────────────────────────────────────────────────────
const FAMILY = { cream: 'Creme', indigo: 'Índigo', green: 'Verde', yellow: 'Amarelo', orange: 'Laranja', purple: 'Roxo', pink: 'Rosa', blue: 'Azul', black: 'Preto' };
const TONE = { base: '', light: ' claro', dark: ' escuro' };
const palette = [
  ...brand.palette.map((p) => ({
    slug: p.token.replace('--rse-brand-', ''),
    name: FAMILY[p.family] + (FAMILY[p.family] === 'Creme' || FAMILY[p.family] === 'Preto' || FAMILY[p.family] === 'Índigo' ? '' : TONE[p.tone]),
    color: p.hex,
  })),
  { slug: 'ink', name: 'Ink (texto e rodapé)', color: v('--rse-brand-ink') },
  { slug: 'white', name: 'Branco', color: '#ffffff' },
];

// ─── Type, spacing, layout, shadows ────────────────────────────────────────
const SIZE_NAMES = {
  'display-1': 'Destaque 1', 'display-2': 'Destaque 2', h1: 'Título 1', h2: 'Título 2', h3: 'Título 3', h4: 'Título 4',
  'body-lg': 'Texto grande', 'body-md': 'Texto', 'body-sm': 'Texto pequeno', caption: 'Legenda',
};
const fontSizes = Object.entries(SIZE_NAMES).map(([slug, name]) => ({ slug, name, size: v(`--rse-font-size-${slug}`), fluid: false }));
const spacingSizes = Array.from({ length: 10 }, (_, i) => ({ slug: String((i + 1) * 10), name: `Espaço ${i + 1}`, size: v(`--rse-space-${i + 1}`) }));
const shadows = ['sm', 'md', 'lg'].map((s, i) => ({ slug: s, name: ['Sombra leve', 'Sombra média', 'Sombra forte'][i], shadow: v(`--rse-shadow-${s}`) }));

// ─── Styles per theme ──────────────────────────────────────────────────────
const styles = (m) => ({
  color: { background: v('--rse-color-surface-page', m), text: v('--rse-color-text-body', m) },
  typography: { fontFamily: 'var(--wp--preset--font-family--montserrat)', fontSize: 'var(--wp--preset--font-size--body-md)', lineHeight: v('--rse-line-height-body') },
  spacing: { blockGap: v('--rse-space-5') },
  elements: {
    link: { color: { text: v('--rse-color-text-link', m) }, ':hover': { color: { text: v('--rse-color-text-link-hover', m) } } },
    heading: {
      color: { text: v('--rse-color-text-heading', m) },
      typography: { fontWeight: String(v('--rse-font-weight-extrabold')), letterSpacing: v('--rse-letter-spacing-tight'), lineHeight: v('--rse-line-height-heading') },
    },
    h1: { typography: { fontSize: 'var(--wp--preset--font-size--h1)' } },
    h2: { typography: { fontSize: 'var(--wp--preset--font-size--h2)' } },
    h3: { typography: { fontSize: 'var(--wp--preset--font-size--h3)' } },
    h4: { typography: { fontSize: 'var(--wp--preset--font-size--h4)' } },
    button: {
      color: { background: v('--rse-button-primary-bg', m), text: v('--rse-button-primary-fg', m) },
      border: { radius: v('--rse-button-radius') },
      typography: { fontWeight: String(v('--rse-font-weight-semibold')) },
      ':hover': { color: { background: v('--rse-button-primary-bg-hover', m), text: v('--rse-button-primary-fg', m) } },
    },
  },
});

const theme = {
  $schema: SCHEMA,
  version: 3,
  title: 'Rede Sesc de Educação',
  settings: {
    appearanceTools: true,
    useRootPaddingAwareAlignments: true,
    color: { palette, custom: false, customGradient: false, defaultPalette: false, defaultGradients: false, defaultDuotone: false, duotone: [] },
    typography: {
      customFontSize: false, defaultFontSizes: false, fluid: false, fontSizes,
      fontFamilies: [{
        slug: 'montserrat', name: 'Montserrat', fontFamily: v('--rse-font-family'),
        fontFace: [
          { fontFamily: 'Montserrat', fontStyle: 'normal', fontWeight: '400 900', fontDisplay: 'swap', src: ['file:./assets/fonts/Montserrat-Variable.woff2'] },
          { fontFamily: 'Montserrat', fontStyle: 'italic', fontWeight: '400 900', fontDisplay: 'swap', src: ['file:./assets/fonts/Montserrat-Italic-Variable.woff2'] },
        ],
      }],
    },
    spacing: { defaultSpacingSizes: false, spacingSizes, units: ['px', 'rem', '%', 'vw'], padding: true, margin: true, blockGap: true },
    layout: { contentSize: v('--rse-container-md'), wideSize: v('--rse-container-xl') },
    shadow: { defaultPresets: false, presets: shadows },
    custom: {
      // Exposed by WordPress as --wp--custom--rse--… for theme CSS that needs them.
      rse: {
        version: pkg.version,
        radius: Object.fromEntries(['sm', 'md', 'lg', 'xl', 'pill'].map((r) => [r, v(`--rse-radius-${r}`)])),
        hitTargetMin: v('--rse-hit-target-min'),
        sectionY: Object.fromEntries(['sm', 'md', 'lg'].map((s) => [s, v(`--rse-section-y-${s}`)])),
      },
    },
  },
  styles: { ...styles('light'), spacing: { blockGap: v('--rse-space-5'), padding: { left: v('--rse-container-padding'), right: v('--rse-container-padding') } } },
};

const variation = (m, title) => ({ $schema: SCHEMA, version: 3, title, styles: styles(m) });

const outputs = {
  'adapters/wordpress/theme.json': theme,
  'adapters/wordpress/styles/escuro.json': variation('dark', 'Escuro'),
  'adapters/wordpress/styles/alto-contraste.json': variation('contrast', 'Alto contraste'),
};

// Self-checks: what WordPress would silently accept but render wrong.
const slugs = palette.map((p) => p.slug);
if (new Set(slugs).size !== slugs.length) throw new Error('build-adapters: duplicate palette slug');
for (const p of palette) if (!/^#[0-9a-f]{6}$/i.test(p.color)) throw new Error(`build-adapters: palette ${p.slug} is ${p.color}, not a hex colour`);

let stale = 0;
for (const [path, json] of Object.entries(outputs)) {
  const out = JSON.stringify(json, null, 2) + '\n';
  const current = existsSync(join(ROOT, path)) ? read(path) : null;
  if (current === out) continue;
  stale++;
  if (checkOnly) { console.log(`${path} is out of date — run \`npm run sync\``); continue; }
  mkdirSync(dirname(join(ROOT, path)), { recursive: true });
  writeFileSync(join(ROOT, path), out);
  console.log(`wrote ${path}`);
}
if (checkOnly && stale) process.exit(1);
if (!stale) console.log(`adapters up to date (WordPress theme.json: ${palette.length} colours, ${fontSizes.length} sizes, 2 variations)`);
