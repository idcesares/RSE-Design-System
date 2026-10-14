#!/usr/bin/env node
// Builds brand.json — the language-agnostic contract for this design system.
//
//   node scripts/build-brand.mjs          # write
//   node scripts/build-brand.mjs --check  # report drift only (exit 1 if out of date)
//
// WHY THIS FILE EXISTS
// dist/tokens.json is the full token set. brand.json is the *brand* contract: the palette
// with CMYK cross-checked against the manual, the token values per theme, the scales grouped
// by role, assets indexed by role, and the rules a generator needs to check its own output. Anything that can parse JSON —
// Python, Go, a shell script, a design tool — can consume the brand from this one file
// without knowing CSS, React or this repo's layout.
//
// AUTHORITY: brand.json is generated and is a *summary*. AGENTS.md and docs/brand-manual.md
// remain the source of truth. Never hand-edit brand.json; edit tokens/src/*.tokens.json or the
// docs and re-run `npm run sync`.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const warnings = [];
const warn = (m) => warnings.push(m);

const pkg = JSON.parse(read('package.json'));
const manifest = JSON.parse(read('rse.manifest.json'));

// ─── 1. Palette: the manual is the authority ────────────────────────────────
// The published table in docs/brand-manual.md governs. tokens/src/brand.tokens.json carries
// the same hex and CMYK; we read both and report any disagreement rather than silently
// trusting one. Colour drift between the manual and the artwork has already put
// this system off-spec once (AGENTS.md, known gap 9) — this check is the guard against it.

const manualRows = [
  ...read('docs/brand-manual.md').matchAll(
    /^\|\s*`(--rse-brand-[a-z-]+)`\s*\|\s*`(#[0-9a-f]{6})`\s*\|\s*(\d+)\s+(\d+)\s+(\d+)\s*\|\s*C(\d+)\s*M(\d+)\s*Y(\d+)\s*K(\d+)\s*\|/gim
  ),
].map((m) => ({
  token: m[1],
  hex: m[2].toLowerCase(),
  manualRgb: [+m[3], +m[4], +m[5]],
  cmyk: { c: +m[6], m: +m[7], y: +m[8], k: +m[9] },
}));

if (manualRows.length !== 20) {
  warn(`docs/brand-manual.md palette table parsed as ${manualRows.length} rows, expected 20 — CMYK may be incomplete`);
}

// Hex and CMYK as recorded in the token source, for cross-checking.
const cssCmyk = new Map();
const cssHex = new Map();
for (const [key, t] of Object.entries(JSON.parse(read('tokens/src/brand.tokens.json')).rse.brand)) {
  if (!/^#[0-9a-f]{6}$/i.test(t.$value)) continue;
  cssHex.set(`--rse-brand-${key}`, t.$value.toLowerCase());
  if (t.$extensions?.rse?.cmyk) cssCmyk.set(`--rse-brand-${key}`, t.$extensions.rse.cmyk);
}

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};

const sameCmyk = (a, b) => a && b && a.c === b.c && a.m === b.m && a.y === b.y && a.k === b.k;

const palette = manualRows.map((row) => {
  // The manual publishes RGB that disagrees with its own hex for --rse-brand-orange
  // (255 127 56 = #ff7f38 vs published #e17f38). docs/brand-manual.md settles it: the
  // hex governs digital. So RGB here is computed from the hex, and the manual's printed
  // RGB is carried alongside only where it differs, flagged.
  const rgb = hexToRgb(row.hex);
  const entry = {
    token: row.token,
    hex: row.hex,
    rgb,
    cmyk: row.cmyk,
    family: row.token.replace(/^--rse-brand-/, '').replace(/-(light|dark)$/, ''),
    tone: /-light$/.test(row.token) ? 'light' : /-dark$/.test(row.token) ? 'dark' : 'base',
    source: 'manual p.59',
  };
  if (row.manualRgb.join() !== rgb.join()) {
    entry.manualPublishedRgb = row.manualRgb;
    entry.note = 'The manual\'s printed RGB disagrees with its own hex; the hex governs digital output.';
  }
  if (cssHex.has(row.token) && cssHex.get(row.token) !== row.hex) {
    warn(`palette drift: ${row.token} is ${cssHex.get(row.token)} in tokens/src/brand.tokens.json but ${row.hex} in the manual — the manual wins`);
  }
  if (cssCmyk.has(row.token) && !sameCmyk(cssCmyk.get(row.token), row.cmyk)) {
    const a = cssCmyk.get(row.token);
    warn(`CMYK drift: ${row.token} is C${a.c} M${a.m} Y${a.y} K${a.k} in tokens/src/brand.tokens.json but C${row.cmyk.c} M${row.cmyk.m} Y${row.cmyk.y} K${row.cmyk.k} in the manual`);
  }
  return entry;
});

// The official black of the marks is in the manual but outside the 20-value ramp table.
if (cssHex.has('--rse-brand-black')) {
  palette.push({
    token: '--rse-brand-black',
    hex: cssHex.get('--rse-brand-black'),
    rgb: hexToRgb(cssHex.get('--rse-brand-black')),
    cmyk: null,
    family: 'black',
    tone: 'base',
    source: 'manual — official black of the marks',
    note: 'No CMYK published. For one-ink print, use rich black per the printer\'s profile.',
  });
}

// ─── 2. Tokens, resolved, per theme ─────────────────────────────────────────
// From dist/tokens.json (scripts/build-tokens.mjs). `value` is the literal, `raw` what the CSS
// says when it is an alias. Themes list only the tokens whose value differs.
const dist = JSON.parse(read('dist/tokens.json'));
const KIND = { brand: 'color', color: 'color', font: 'font', line: 'font', letter: 'font', radius: 'radius', shadow: 'shadow', space: 'spacing', container: 'spacing', grid: 'spacing', section: 'spacing', header: 'spacing', hit: 'spacing' };
const kindOf = (name) => KIND[name.replace(/^--rse-/, '').split('-')[0]] ?? 'other';
const tokens = {};
for (const [name, meta] of Object.entries(dist.tokens)) {
  if (!meta.css) continue;
  tokens[name] = { value: dist.modes.light[name], kind: kindOf(name) };
}
const themes = {};
for (const mode of ['dark', 'contrast']) {
  const overrides = {};
  for (const name of Object.keys(tokens)) {
    if (dist.modes[mode][name] !== dist.modes.light[name]) overrides[name] = { value: dist.modes[mode][name] };
  }
  themes[mode] = { selector: `[data-rse-theme="${mode}"]`, label: mode === 'dark' ? 'Dark' : 'High contrast', overrides };
}

// ─── 3. Scales: tokens grouped so a non-CSS consumer never has to guess names ─
const pick = (prefix, from = tokens) =>
  Object.fromEntries(
    Object.entries(from)
      .filter(([name]) => name.startsWith(prefix))
      .map(([name, t]) => [name.slice(prefix.length), t.value ?? t])
  );

const scales = {
  type: {
    family: tokens['--rse-font-family']?.value ?? null,
    weights: pick('--rse-font-weight-'),
    sizes: pick('--rse-font-size-'),
    lineHeights: pick('--rse-line-height-'),
    letterSpacings: pick('--rse-letter-spacing-'),
  },
  spacing: pick('--rse-space-'),
  radius: pick('--rse-radius-'),
  shadow: pick('--rse-shadow-'),
  layout: Object.fromEntries(
    Object.entries(tokens)
      .filter(([name]) => /^--rse-(container|grid-gutter|section-y|header-height|hit-target)/.test(name))
      .map(([name, t]) => [name.slice(6), t.value])
  ),
  // Not CSS custom properties (CSS cannot read var() inside @media) — literals for media queries.
  breakpoints: pick('--rse-breakpoint-', dist.modes.light),
};

// ─── 4. Assets, indexed by role ─────────────────────────────────────────────
// Without this a consumer can only find artwork by knowing the folder layout, which is
// exactly the knowledge a non-web generator does not have.

const svgFills = (p) => [...new Set([...read(p).matchAll(/#[0-9a-f]{6}/gi)].map((m) => m[0].toLowerCase()))];
const familyOfHex = (hex) => palette.find((c) => c.hex === hex)?.family ?? null;

// Which mark goes on which surface, parsed from the "Use these" table in the logos README
// so the guidance has exactly one home.
const logoUse = new Map();
for (const m of read('assets/logos/README.md').matchAll(/^\|\s*`([a-z0-9-]+\.svg)`\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/gim)) {
  logoUse.set(m[1], { mark: m[2].trim(), placeOn: m[3].trim() });
}

const versionOf = (file) =>
  file === 'badge-solid.svg' ? 'principal' : file === 'badge-outline.svg' ? 'secundaria' : /^wordmark-/.test(file) ? 'simplificada' : null;

const logos = readdirSync(join(ROOT, 'assets/logos'))
  .filter((f) => f.endsWith('.svg'))
  .sort()
  .map((f) => {
    const entry = { id: f.replace(/\.svg$/, ''), path: `assets/logos/${f}`, brand: f.startsWith('sabia-') ? 'sabia' : 'rede' };
    const v = versionOf(f);
    if (v) entry.version = v;
    if (logoUse.has(f)) Object.assign(entry, logoUse.get(f));
    return entry;
  });

const motifHues = new Map(
  [...read('components/brand/BrandMotif.jsx').matchAll(/'([a-z]+)':\s*\{[^}]*?hue:\s*'([a-z]+)'/g)].map((m) => [m[1], m[2]])
);

const motifs = readdirSync(join(ROOT, 'assets/motifs'))
  .filter((f) => /^cube-.*\.svg$/.test(f))
  .sort()
  .map((f) => {
    const id = f.replace(/^cube-|\.svg$/g, '');
    return { id, path: `assets/motifs/${f}`, hue: motifHues.get(id) ?? null, variant: id };
  });

const patterns = readdirSync(join(ROOT, 'assets/patterns'))
  .filter((f) => f.endsWith('.svg'))
  .sort()
  .map((f) => {
    // Hue is derived from the artwork's own fills matched against the palette, not asserted.
    const hues = [...new Set(svgFills(`assets/patterns/${f}`).map(familyOfHex).filter(Boolean))];
    return { id: f.replace(/\.svg$/, ''), path: `assets/patterns/${f}`, hue: hues[0] ?? null };
  });

const iconDir = 'assets/icons/lucide';
const iconFiles = existsSync(join(ROOT, iconDir)) ? readdirSync(join(ROOT, iconDir)).filter((f) => f.endsWith('.svg')).sort() : [];

const assets = {
  logos,
  motifs,
  patterns,
  icons: {
    set: 'Lucide',
    license: 'ISC',
    dir: iconDir,
    count: iconFiles.length,
    spec: '24×24 grid, 2px stroke, currentColor',
    names: iconFiles.map((f) => f.replace(/\.svg$/, '')),
  },
  fonts: (manifest.fonts ?? []).map((f) => ({
    family: f.family,
    weight: f.weight,
    style: f.style,
    file: f.files[0],
  })),
  raster: {
    favicon: 'assets/favicon.png',
    ogImage: 'assets/og-image.png',
    note: 'Both are still composited from the superseded raster logos — regenerate from the vectors before launch.',
  },
};

// ─── 5. Rules a generator can check itself against ──────────────────────────
// A summary for machines. AGENTS.md is the authority and carries the reasoning.

const rules = {
  authority: 'AGENTS.md and docs/brand-manual.md govern. This block is a machine-checkable summary, never a second spec.',
  colour: {
    paletteOnly: true,
    backgrounds: 'Cream page surface, white cards. A feature or CTA band is brand purple or indigo with white text, or a light or mid accent with ink (--rse-brand-ink) text. Never white text on an accent, never a -dark accent or mid purple as a band, no gradients, one band colour per section.',
    gradients: false,
    resampleFromArtwork: false,
  },
  typography: {
    family: 'Montserrat',
    weightRange: [400, 900],
    weightRangeNote: 'The manual authorises 100–900; this system stops at 400 because Montserrat misses the contrast floor below it at body sizes.',
    headingWeight: 800,
    headingLetterSpacing: tokens['--rse-letter-spacing-tight']?.value ?? null,
    eyebrow: { weight: 700, uppercase: true, letterSpacing: tokens['--rse-letter-spacing-eyebrow']?.value ?? null },
    uppercase: 'Eyebrows only — the single uppercase context in the system.',
    case: 'Sentence case for headings and body.',
  },
  logo: {
    versions: { principal: 'badge-solid.svg', secundaria: 'badge-outline.svg', simplificada: 'wordmark-*.svg' },
    clearspace: 'X on all four sides, X being the height of the stem of the E. More than X is preferred.',
    minSize: { print: '45mm wide', digital: '150px wide' },
    belowMinSize: 'Switch to the simplificada (wordmark) version.',
    recolour: 'Palette colours only, across ~25 sanctioned combinations. Lettering must stay legible.',
    never: ['rotate', 'stretch', 'distort', 'add effects', 'redraw', 'gradient fill', 'outlined lettering', 'lock up with the Sesc signature'],
  },
  motif: {
    constructions: motifs.map((m) => m.id),
    huesAvailable: [...new Set(motifs.map((m) => m.hue).filter(Boolean))].sort(),
    perComposition: 1,
    recolour: 'hue-prop-only',
    recolourNote: 'Never edit the SVG fills. BrandMotif\'s hue prop restates a construction in any palette family, keeping each shade\'s luminance rank; purple, orange and yellow are derived, not supplied.',
    treatments: ['small', 'blown up', 'outline', 'tiled as a pattern'],
  },
  language: {
    humanReadable: 'pt-BR',
    humanReadableCovers: 'page copy, labels, alt text, error messages, titles',
    systemIdentifiers: 'en',
    systemIdentifiersCover: 'file and folder names, token names, component and prop names',
    htmlLang: 'pt-BR',
  },
  content: {
    slogan: 'Aprender para a vida acontecer',
    voice: 'Short declarative sentences, second person (você), verbs of transformation (acolhe, forma, transforma).',
    emoji: false,
    inventedFacts: false,
    inventedFactsNote: 'Student counts, addresses, fees, dates and enrollment windows in this repo are examples. Keep them visibly placeholder-ish and tell the user what needs verification.',
    inventedImagery: false,
    inventedImageryNote: 'No photography exists. Use an <image-slot> placeholder carrying a pt-BR shot brief.',
  },
  accessibility: {
    contrastBodyText: 4.5,
    contrastLargeTextAndUi: 3,
    hitTargetMin: tokens['--rse-hit-target-min']?.value ?? '44px',
    focusAlwaysVisible: true,
    reducedMotionHonoured: true,
    motionDurations: [tokens['--rse-duration-fast']?.value, tokens['--rse-duration-base']?.value, tokens['--rse-duration-slow']?.value].filter(Boolean),
  },
};

// ─── 6. Assemble ────────────────────────────────────────────────────────────
const brand = {
  $comment: 'GENERATED by scripts/build-brand.mjs — do not edit. Run `npm run sync`. AGENTS.md and docs/brand-manual.md are the source of truth; this file is a machine-readable summary of them.',
  name: 'Rede Sesc de Educação',
  description: pkg.description,
  version: pkg.version,
  contract: 1,
  namespace: manifest.namespace,
  source: {
    manual: 'Manual da Rede Sesc de Educação, Sesc Departamento Nacional, 2026',
    extract: 'docs/brand-manual.md',
    rules: 'AGENTS.md',
  },
  palette,
  tokens,
  themes,
  scales,
  assets,
  rules,
  web: {
    stylesheet: 'styles.css',
    stylesheetNote: 'Tokens, fonts, the runtime base and the element reset. A page looks like the Rede with this one link.',
    tokensOnlyStylesheet: 'tokens/tokens-only.css',
    tokensOnlyNote: 'Custom properties and @font-face only — no element selectors. Use this when adding the system to a site that already has its own base styles.',
    tokensJson: 'dist/tokens.json',
    tokensModule: 'dist/tokens.js',
    themes: { attribute: 'data-rse-theme', values: ['light', 'dark', 'contrast', 'auto'], default: 'light (no attribute; set "light" to nest it inside another theme)' },
    bundle: 'dist/rse.js',
    bundleGlobal: manifest.namespace,
    reactEntry: 'index.js',
    package: pkg.name,
    reactPeer: 'react >=18',
    assetsMustSit: 'assets/ must remain a sibling of tokens/ — tokens/fonts.css reaches for ../assets/fonts/ and falls back silently to a system font if that layout breaks.',
  },
  components: (manifest.components ?? []).map((c) => c.name).sort(),
  templates: manifest.templates ?? [],
  caveats: [
    'No photography exists in this repo; every image is a placeholder carrying a shot brief.',
    'Pantone numbers are not published by the manual — it defers to Formula Guide comparison. Ask before committing to a spot-colour job.',
    'The Sab.IA platform URL is unknown; PlatformEntry links to # until Sesc supplies it.',
    'Sesc supplied the motif constructions in green, blue and pink only. BrandMotif\'s hue prop derives purple, orange and yellow from the published palette — present those three as derived, not supplied. Full-bleed patterns come in blue, green, orange and pink.',
    'The manual covers brand, not layout. The grid, type scale, spacing, components, accessibility floor and dark mode are original system work.',
    'Icons are Lucide (ISC), not an official Sesc set.',
  ],
};

// ─── 7. Write or check ──────────────────────────────────────────────────────
const out = JSON.stringify(brand, null, 2) + '\n';
const path = join(ROOT, 'brand.json');
const current = existsSync(path) ? readFileSync(path, 'utf8') : null;

for (const w of warnings) console.log(`warn   ${w}`);

if (current === out) {
  console.log(`brand.json already in sync (${palette.length} palette colours, ${Object.keys(tokens).length} tokens, ${logos.length + motifs.length + patterns.length} vector assets)`);
  process.exit(0);
}

if (checkOnly) {
  console.log(current === null ? 'brand.json does not exist — run `npm run sync`' : 'brand.json is out of date — run `npm run sync`');
  process.exit(1);
}

writeFileSync(path, out);
console.log(`wrote brand.json — ${palette.length} palette colours, ${Object.keys(tokens).length} tokens, ${Object.keys(themes).length} themes, ${logos.length} logos, ${motifs.length} motifs, ${patterns.length} patterns, ${iconFiles.length} icons`);
