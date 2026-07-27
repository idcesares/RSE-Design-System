#!/usr/bin/env node
// Splits the official cube artwork (assets/motifs/cubes-official.svg) into one file per
// construction and generates components/brand/BrandMotif.jsx from the same geometry.
//
//   node scripts/build-motifs.mjs          # write
//   node scripts/build-motifs.mjs --check  # fail if the generated files are out of date
//
// The geometry is OFFICIAL ARTWORK and is never redrawn — the script only splits the
// supplied sheet and re-emits the same shapes. If Sesc supplies more constructions, drop a
// new sheet in and re-run.
//
// Colour: the sheet ships three hue families (green, blue, pink). Rendered in its own hue a
// construction keeps the supplied fills byte for byte. `BrandMotif` also accepts a `hue`, and
// the ramps emitted below let it restate a construction in any of the six palette families —
// authorised by the design owner, and derived from the manual's published palette rather than
// sampled off the artwork. The remap preserves each shade's luminance rank, which is what
// makes the impossible cube read as a solid; changing that ordering flattens the illusion.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets/motifs/cubes-official.svg');
const checkOnly = process.argv.includes('--check');

// Order matches the groups in the supplied sheet. Names are ours (the source file has none);
// bounding boxes were measured from the rendered artwork.
const VARIANTS = [
  { name: 'cube', hue: 'green', box: [0, 0, 255.74, 295.51], note: 'solid isometric cube — the base mark' },
  { name: 'interlock', hue: 'blue', box: [634.49, 11.17, 294.56, 283.19], note: 'two cubes interlocking through each other' },
  { name: 'bar', hue: 'green', box: [321.13, 315.74, 257.17, 296.92], note: 'cube pierced by a bar that cannot pass through it' },
  { name: 'frame', hue: 'pink', box: [653.65, 321.43, 256.16, 295.5], note: 'open frame with two impossible voids' },
  { name: 'chain', hue: 'pink', box: [296.49, 15.03, 306.44, 265.44], note: 'zig-zag chain of bars — the widest construction' },
  { name: 'hollow', hue: 'blue', box: [0.78, 325.7, 254.18, 295.51], note: 'cube opened out around a hollow centre' },
];

const svg = readFileSync(SRC, 'utf8');
const styles = Object.fromEntries([...svg.matchAll(/\.(cls-\d+)\s*\{\s*fill:\s*(#[0-9a-f]{3,6});/gi)].map((m) => [m[1], m[2]]));

/* ── Hue ramps, read from the palette so they cannot drift from the manual ───────── */

const HUE_FAMILIES = ['green', 'blue', 'pink', 'purple', 'orange', 'yellow'];
const colorsCss = readFileSync(join(ROOT, 'tokens/colors.css'), 'utf8');

const paletteHex = (name) => {
  const m = colorsCss.match(new RegExp(`--color-${name}\\s*:\\s*(#[0-9a-f]{6})`, 'i'));
  if (!m) { console.error(`build-motifs: --color-${name} not found in tokens/colors.css`); process.exit(1); }
  return m[1];
};

// light → base → dark, the three anchors every accent family publishes.
const HUE_ANCHORS = Object.fromEntries(
  HUE_FAMILIES.map((h) => [h, [paletteHex(`${h}-light`), paletteHex(h), paletteHex(`${h}-dark`)]])
);

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luma = (hex) => { const [r, g, b] = toRgb(hex); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

// pull the six top-level constructions out of the sheet
function topLevelGroups(source) {
  const outer = source.indexOf('<g id="Camada_1-2"');
  const wrapper = source.indexOf('<g>', outer);
  let i = source.indexOf('<g', wrapper + 3);
  const groups = [];
  while (i !== -1 && groups.length < VARIANTS.length) {
    let depth = 0, j = i;
    while (j < source.length) {
      const open = source.indexOf('<g', j);
      const close = source.indexOf('</g>', j);
      if (close === -1) break;
      if (open !== -1 && open < close) { depth++; j = open + 2; }
      else { depth--; j = close + 4; if (depth === 0) break; }
    }
    groups.push(source.slice(i, j));
    i = source.indexOf('<g', j);
  }
  return groups;
}

const groups = topLevelGroups(svg);
if (groups.length !== VARIANTS.length) {
  console.error(`expected ${VARIANTS.length} constructions in the sheet, found ${groups.length}`);
  process.exit(1);
}

const ATTR = { 'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin' };
const parseShapes = (group) =>
  [...group.matchAll(/<(path|polygon|polyline|rect|circle)\b([^>]*?)\/?>/g)].map((el) => {
    const attrs = {};
    for (const a of el[2].matchAll(/([\w-]+)="([^"]*)"/g)) {
      if (a[1] === 'class') { attrs.fill = styles[a[2]] ?? 'currentColor'; continue; }
      attrs[ATTR[a[1]] ?? a[1]] = a[2];
    }
    // NB: a <polyline> with a fill and no stroke renders as a filled, implicitly closed
    // shape — that is how the source sheet uses them. Do not "helpfully" convert the fill
    // to a stroke here; it changes the artwork.
    return [el[1], attrs];
  });

const files = {};
const built = [];
for (let i = 0; i < VARIANTS.length; i++) {
  const v = VARIANTS[i];
  const shapes = parseShapes(groups[i]);
  const [x, y, w, h] = v.box;
  const pad = Math.max(w, h) * 0.03;
  const viewBox = `${(x - pad).toFixed(2)} ${(y - pad).toFixed(2)} ${(w + 2 * pad).toFixed(2)} ${(h + 2 * pad).toFixed(2)}`;
  // The construction's own palette, lightest first. Position in this list is the shade's
  // luminance rank, and that rank is what a recolour has to preserve.
  const shades = [...new Set(shapes.map(([, a]) => a.fill).filter((f) => /^#[0-9a-f]{6}$/i.test(f)))]
    .sort((a, b) => luma(b) - luma(a));
  built.push({ ...v, shapes, viewBox, shades });
  const body = shapes
    .map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k, val]) => `${k}="${val}"`).join(' ')}/>`)
    .join('\n  ');
  files[`assets/motifs/cube-${v.name}.svg`] =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n  <title>Cubo impossível — ${v.name}</title>\n  ${body}\n</svg>\n`;
}

const jsBody = built
  .map((v) => {
    const shapes = v.shapes
      .map(([tag, attrs]) => `['${tag}',{${Object.entries(attrs).map(([k, val]) => `${/^[a-z][\w]*$/i.test(k) ? k : `'${k}'`}:'${val}'`).join(',')}}]`)
      .join(',');
    const shades = v.shades.map((s) => `'${s}'`).join(',');
    return `  '${v.name}': { viewBox: '${v.viewBox}', hue: '${v.hue}', shades: [${shades}], shapes: [${shapes}] },`;
  })
  .join('\n');

const huesBody = HUE_FAMILIES
  .map((hue) => `  ${hue}: [${HUE_ANCHORS[hue].map((c) => `'${c}'`).join(', ')}],`)
  .join('\n');

files['components/brand/BrandMotif.jsx'] = `import React from 'react';
// GENERATED by scripts/build-motifs.mjs from assets/motifs/cubes-official.svg — do not edit.
// This is the OFFICIAL "cubo impossível" artwork supplied by Sesc, split into its six
// constructions. Geometry is never redrawn, rotated or distorted.
//
// Colour: left alone, a construction renders in the exact fills Sesc supplied. Pass \`hue\` to
// restate it in another palette family — the sheet only ships green, blue and pink, so this is
// how the other three are reached. Ramps come from the manual's published palette, never from
// sampling the artwork, and the remap keeps each shade's luminance rank so the solid still
// reads as a solid.
const MOTIFS = {
${jsBody}
};

// light → base → dark for each accent family, from tokens/colors.css.
const HUES = {
${huesBody}
};

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (rgb) => '#' + rgb.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => toRgb(a).map((v, i) => v + (toRgb(b)[i] - v) * t);

/** N shades of \`hue\`, lightest first, walking light → base → dark. */
function ramp(hue, steps) {
  const [light, base, dark] = HUES[hue];
  if (steps === 1) return [base];
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    return toHex(t < 0.5 ? mix(light, base, t * 2) : mix(base, dark, (t - 0.5) * 2));
  });
}

export function BrandMotif({ variant = 'cube', size = 240, title, opacity = 1, hue }) {
  const motif = MOTIFS[variant];
  if (!motif) return null;

  // Only build a remap when a different, known family is asked for; otherwise the official
  // fills pass through untouched.
  let recolour = null;
  if (hue && hue !== motif.hue && HUES[hue]) {
    const target = ramp(hue, motif.shades.length);
    recolour = Object.fromEntries(motif.shades.map((from, i) => [from, target[i]]));
  }

  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': 'true', focusable: 'false' };
  return React.createElement('svg', {
    viewBox: motif.viewBox, width: size, height: size,
    style: { display: 'block', overflow: 'visible', opacity }, ...a11y
  }, motif.shapes.map(([tag, attrs], i) => React.createElement(tag, {
    key: i, ...attrs, ...(recolour && recolour[attrs.fill] ? { fill: recolour[attrs.fill] } : null)
  })));
}

export const motifVariants = Object.keys(MOTIFS);
export const motifHues = Object.keys(HUES);
`;

files['components/brand/BrandMotif.d.ts'] = `import React from 'react';

// GENERATED list — see scripts/build-motifs.mjs.
export type MotifVariant =
${built.map((v) => `  /** ${v.hue} — ${v.note} */\n  | '${v.name}'`).join('\n')};

export type MotifHue = ${HUE_FAMILIES.map((h) => `'${h}'`).join(' | ')};

export interface BrandMotifProps {
  /** Which official construction to render (default 'cube') */
  variant?: MotifVariant;
  /** Rendered square size in px (default 240) */
  size?: number;
  /** Accessible label. Omit when decorative (rendered aria-hidden) */
  title?: string;
  /** Fade the motif when it sits behind content (default 1) */
  opacity?: number;
  /**
   * Restate the construction in another palette family. Omit to render the exact fills Sesc
   * supplied — the sheet ships green, blue and pink only, so this is how the other three
   * families are reached. Ramps derive from the published palette, never from the artwork.
   */
  hue?: MotifHue;
}

/**
 * The official "cubo impossível" motif — the brand's central visual idea, supplied by Sesc
 * as vector artwork and split into six constructions. Renders the supplied colours untouched
 * unless \`hue\` asks for another family. Never re-maps per theme. Returns null for an unknown
 * variant.
 */
export function BrandMotif(props: BrandMotifProps): JSX.Element | null;

/** All available construction names */
export const motifVariants: MotifVariant[];

/** All palette families a construction can be restated in */
export const motifHues: MotifHue[];
`;

let stale = false;
for (const [rel, content] of Object.entries(files)) {
  const p = join(ROOT, rel);
  if (existsSync(p) && readFileSync(p, 'utf8') === content) continue;
  stale = true;
  if (checkOnly) { console.log(`out of date: ${rel}`); continue; }
  writeFileSync(p, content);
  console.log(`wrote ${rel}`);
}
if (!stale) console.log(`motifs up to date (${built.length} constructions)`);
process.exit(checkOnly && stale ? 1 : 0);
