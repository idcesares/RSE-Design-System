#!/usr/bin/env node
// Builds every token output from the one source: tokens/src/*.tokens.json (W3C DTCG format).
//
//   node scripts/build-tokens.mjs          # write
//   node scripts/build-tokens.mjs --check  # report drift only (exit 1 if anything is stale)
//
// Outputs (all GENERATED — edit the JSON, never these):
//   tokens/tokens.css      every custom property; light on :root, then [data-rse-theme="dark"],
//                          [data-rse-theme="contrast"] and [data-rse-theme="auto"] (dark under
//                          prefers-color-scheme)
//   dist/tokens.json       every token resolved to a literal, per mode, with type and metadata
//   dist/tokens.js/.d.ts   the same as an ES module, typed
//   rse.manifest.json      its `tokens`, `themes` and `globalCssPaths` entries
//
// Source conventions
//   - A token's CSS name is its path joined by "-": rse.color.text-body → --rse-color-text-body.
//   - "{rse.brand.purple-dark}" is an alias; it becomes var(--rse-brand-purple-dark).
//   - $extensions.rse.modes.{dark,contrast} hold the value in that theme.
//   - $extensions.rse.css === false keeps a token out of the CSS (breakpoints: CSS cannot read
//     var() inside @media).
//   - $extensions.rse.derived marks a value the manual does not publish.
//
// A theme block also re-declares every token whose alias chain reaches a token that theme
// overrides. Without that, `--a: var(--b)` resolves once on :root, and a [data-rse-theme]
// section nested in a light page keeps the light value of --a.

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const pkg = JSON.parse(read('package.json'));

const SRC_ORDER = ['brand', 'color', 'typography', 'layout', 'effects'];
const MODES = ['dark', 'contrast'];
const THEME_LABELS = { dark: 'Dark', contrast: 'High contrast', auto: 'Auto (follows the OS)' };

// ─── 1. Load and flatten ────────────────────────────────────────────────────
const srcFiles = readdirSync(join(ROOT, 'tokens/src'))
  .filter((f) => f.endsWith('.tokens.json'))
  .sort((a, b) => SRC_ORDER.indexOf(a.split('.')[0]) - SRC_ORDER.indexOf(b.split('.')[0]));

const tokens = []; // { name, path, type, value, description, ext, file }
const byPath = new Map();
for (const file of srcFiles) {
  const json = JSON.parse(read(`tokens/src/${file}`));
  const visit = (node, path) => {
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$') || typeof child !== 'object') continue;
      const p = [...path, key];
      if ('$value' in child) {
        const t = {
          name: '--' + p.join('-'),
          path: p.join('.'),
          type: child.$type ?? node.$type ?? null,
          value: String(child.$value),
          description: child.$description ?? null,
          ext: child.$extensions?.rse ?? {},
          file: `tokens/src/${file}`,
        };
        if (byPath.has(t.path)) throw new Error(`duplicate token ${t.path} in ${file}`);
        tokens.push(t);
        byPath.set(t.path, t);
      } else visit(child, p);
    }
  };
  visit(json, []);
}

const ALIAS = /\{([a-z0-9.-]+)\}/g;
const refsOf = (v) => [...v.matchAll(ALIAS)].map((m) => m[1]);
for (const t of tokens) {
  for (const v of [t.value, ...Object.values(t.ext.modes ?? {})]) {
    for (const r of refsOf(v)) if (!byPath.has(r)) throw new Error(`${t.path} refers to unknown token {${r}}`);
  }
}
const toCss = (v) => v.replace(ALIAS, (_, p) => `var(--${p.replace(/\./g, '-')})`);
const valueIn = (t, mode) => (mode && t.ext.modes?.[mode] !== undefined ? t.ext.modes[mode] : t.value);

// ─── 2. Per-mode declarations (with alias propagation) ──────────────────────
const modeDecls = {};
for (const mode of MODES) {
  const set = new Set(tokens.filter((t) => t.ext.modes?.[mode] !== undefined).map((t) => t.path));
  for (let changed = true; changed; ) {
    changed = false;
    for (const t of tokens) {
      if (set.has(t.path)) continue;
      if (refsOf(t.value).some((r) => set.has(r))) { set.add(t.path); changed = true; }
    }
  }
  modeDecls[mode] = tokens.filter((t) => set.has(t.path));
}

// ─── 3. Resolve to literals ────────────────────────────────────────────────
const resolve = (t, mode, seen = new Set()) => {
  if (seen.has(t.path)) throw new Error(`alias cycle at ${t.path}`);
  seen.add(t.path);
  return valueIn(t, mode).replace(ALIAS, (_, p) => resolve(byPath.get(p), mode, new Set(seen)));
};
const resolved = { light: {}, dark: {}, contrast: {} };
for (const t of tokens) {
  resolved.light[t.name] = resolve(t, null);
  for (const m of MODES) resolved[m][t.name] = resolve(t, m);
}

// ─── 4. tokens/tokens.css ───────────────────────────────────────────────────
const comment = (text, indent = '') =>
  text ? `${indent}/* ${text.replace(/\*\//g, '* /').split('\n').join(`\n${indent}   `)} */\n` : '';
const decl = (t, mode) => `--${t.path.replace(/\./g, '-')}:${toCss(valueIn(t, mode))};`;
const cssTokens = tokens.filter((t) => t.ext.css !== false);

let css = `/* GENERATED by scripts/build-tokens.mjs from tokens/src/*.tokens.json — do not edit.
   Run \`npm run sync\`. Light is the default; set data-rse-theme="dark" | "contrast" | "auto"
   on <html> or on any section. */\n`;
css += ':root{\n';
let lastGroup = '';
for (const t of cssTokens) {
  const group = t.path.split('.').slice(0, 2).join('.');
  if (group !== lastGroup) { css += `\n/* ── ${group} ── */\n`; lastGroup = group; }
  css += comment(t.description) + decl(t, null) + (t.ext.derived ? ' /* derived */' : '') + '\n';
}
css += '}\n';
const block = (mode, indent = '') => {
  let out = mode === 'dark' ? `${indent}color-scheme:dark;\n` : '';
  for (const t of modeDecls[mode].filter((t) => t.ext.css !== false)) {
    const note = t.ext.modeNotes?.[mode];
    out += comment(note, indent) + indent + decl(t, mode) + '\n';
  }
  return out;
};
css += `\n[data-rse-theme="dark"]{\n${block('dark')}}\n`;
css += `\n[data-rse-theme="contrast"]{\n${block('contrast')}}\n`;
css += `\n@media (prefers-color-scheme:dark){\n  [data-rse-theme="auto"]{\n${block('dark', '  ')}  }\n}\n`;

// ─── 5. dist/tokens.json, dist/tokens.js, dist/tokens.d.ts ─────────────────
const meta = {};
for (const t of tokens) {
  const m = { type: t.type, ref: `{${t.path}}`, css: t.ext.css !== false };
  if (t.description) m.description = t.description;
  if (t.ext.derived) m.derived = true;
  if (t.ext.source) m.source = t.ext.source;
  if (t.ext.cmyk) m.cmyk = t.ext.cmyk;
  if (t.ext.modes) m.themed = Object.keys(t.ext.modes);
  meta[t.name] = m;
}
const distJson = {
  $comment: 'GENERATED by scripts/build-tokens.mjs from tokens/src/*.tokens.json — do not edit.',
  name: pkg.name,
  version: pkg.version,
  modes: resolved,
  tokens: meta,
};
const distJs = `// GENERATED by scripts/build-tokens.mjs — do not edit.
// Every Rede Sesc de Educação token resolved to a literal, per theme.
//   import { light, dark, cssVar } from '${pkg.name}/tokens';
//   light['--rse-color-primary'] // '${resolved.light['--rse-color-primary']}'
export const version = ${JSON.stringify(pkg.version)};
export const light = ${JSON.stringify(resolved.light, null, 2)};
export const dark = ${JSON.stringify(resolved.dark, null, 2)};
export const contrast = ${JSON.stringify(resolved.contrast, null, 2)};
export const modes = { light, dark, contrast };
/** \`var(--rse-…)\` for a token name, for inline styles that must stay themeable. */
export const cssVar = (name) => \`var(\${name})\`;
export default modes;
`;
const names = tokens.map((t) => JSON.stringify(t.name)).join('\n  | ');
const distDts = `// GENERATED by scripts/build-tokens.mjs — do not edit.
export type TokenName =
  | ${names};
export type TokenMap = Record<TokenName, string>;
export declare const version: string;
export declare const light: TokenMap;
export declare const dark: TokenMap;
export declare const contrast: TokenMap;
export declare const modes: { light: TokenMap; dark: TokenMap; contrast: TokenMap };
export declare const cssVar: (name: TokenName) => string;
export default modes;
`;

// ─── 6. Manifest entries ────────────────────────────────────────────────────
const KIND = { brand: 'color', color: 'color', font: 'font', 'line-height': 'font', 'letter-spacing': 'font', radius: 'radius', shadow: 'shadow', space: 'spacing', container: 'spacing', grid: 'spacing', 'section-y': 'spacing', header: 'spacing', 'hit-target': 'spacing' };
const kindOf = (t) => KIND[t.path.split('.')[1]] ?? 'other';
const manifest = JSON.parse(read('rse.manifest.json'));
manifest.tokens = [
  ...cssTokens.map((t) => ({ name: t.name, value: toCss(t.value), kind: kindOf(t), definedIn: 'tokens/tokens.css' })),
  ...MODES.flatMap((mode) => modeDecls[mode].filter((t) => t.ext.css !== false).map((t) => ({
    name: t.name, value: toCss(valueIn(t, mode)), kind: kindOf(t), definedIn: 'tokens/tokens.css', scope: `[data-rse-theme="${mode}"]`,
  }))),
];
manifest.themes = [...MODES, 'auto'].map((m) => ({ selector: `[data-rse-theme="${m}"]`, label: THEME_LABELS[m] }));
manifest.globalCssPaths = ['tokens/fonts.css', 'tokens/tokens.css', 'tokens/base-runtime.css', 'tokens/base-reset.css', 'tokens/tokens-only.css', 'dist/components.css', 'styles.css'];
manifest.brandFonts = (manifest.brandFonts ?? []).map((f) => ({ ...f, tokens: ['--rse-font-family'] }));

// ─── 7. Write or check ──────────────────────────────────────────────────────
const outputs = [
  ['tokens/tokens.css', css],
  ['dist/tokens.json', JSON.stringify(distJson, null, 2) + '\n'],
  ['dist/tokens.js', distJs],
  ['dist/tokens.d.ts', distDts],
  ['rse.manifest.json', JSON.stringify(manifest)],
];
const stale = outputs.filter(([p, body]) => !existsSync(join(ROOT, p)) || read(p) !== body).map(([p]) => p);
if (checkOnly) {
  if (stale.length) { console.log(`tokens out of date: ${stale.join(', ')} — run \`npm run sync\``); process.exit(1); }
  console.log(`tokens up to date (${tokens.length} tokens, ${cssTokens.length} in CSS, 3 themes + auto)`);
} else {
  mkdirSync(join(ROOT, 'dist'), { recursive: true });
  for (const [p, body] of outputs) if (stale.includes(p)) writeFileSync(join(ROOT, p), body);
  console.log(`tokens: ${tokens.length} from ${srcFiles.length} source files → ${stale.length ? stale.join(', ') : 'nothing changed'}`);
}
