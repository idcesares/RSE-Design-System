#!/usr/bin/env node
// Integrity check for the Rede Sesc de Educação design system.
//
//   node scripts/check-ds.mjs          # report
//   node scripts/check-ds.mjs --quiet  # only problems
//
// Exits 1 on any ERROR. Warnings never fail the run — they are style debt, not breakage.
// Run this after touching components, tokens or the manifest. See AGENTS.md.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const quiet = process.argv.includes('--quiet');
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const rel = (p) => relative(ROOT, p).split(sep).join('/');

function walk(dir, out = []) {
  for (const name of readdirSync(join(ROOT, dir))) {
    if (name === 'node_modules' || name === '.git') continue;
    const p = join(ROOT, dir, name);
    if (statSync(p).isDirectory()) walk(rel(p), out);
    else out.push(rel(p));
  }
  return out;
}

const manifest = JSON.parse(read('_ds_manifest.json'));
const bundle = read('_ds_bundle.js');
const bundleMeta = JSON.parse(bundle.match(/^\/\* @ds-bundle: (.*?) \*\//s)[1]);
const allFiles = walk('.');

// ─── 1. Every component ships source + types + usage doc ────────────────────
for (const c of manifest.components) {
  for (const ext of ['.jsx', '.d.ts', '.prompt.md']) {
    const p = c.sourcePath.replace(/\.jsx$/, ext);
    if (!existsSync(join(ROOT, p))) err(`${c.name}: missing ${p}`);
  }
  const src = existsSync(join(ROOT, c.sourcePath)) ? read(c.sourcePath) : '';
  if (src && !new RegExp(`export function ${c.name}\\b`).test(src)) {
    err(`${c.name}: ${c.sourcePath} does not "export function ${c.name}"`);
  }
}

// ─── 2. No component file is orphaned from the manifest ─────────────────────
const known = new Set(manifest.components.map((c) => c.sourcePath));
for (const f of allFiles) {
  if (f.startsWith('components/') && f.endsWith('.jsx') && !known.has(f)) {
    err(`${f} exists but is not registered in _ds_manifest.json`);
  }
}

// ─── 3. index.js re-exports the whole set ───────────────────────────────────
const index = read('index.js');
for (const c of manifest.components) {
  if (!new RegExp(`\\b${c.name}\\b`).test(index)) err(`index.js does not export ${c.name}`);
}

// ─── 4. _ds_bundle.js is in sync with component sources ─────────────────────
// The bundle is what every static page and template actually loads. Editing a
// .jsx without regenerating the bundle means the page keeps running old code.
let stale = 0;
for (const [p, hash] of Object.entries(bundleMeta.sourceHashes ?? {})) {
  if (!existsSync(join(ROOT, p))) { err(`bundle references missing source ${p}`); continue; }
  const actual = createHash('sha256').update(readFileSync(join(ROOT, p))).digest('hex').slice(0, 12);
  if (actual !== hash) { err(`bundle is stale for ${p} (source ${actual} ≠ bundle ${hash})`); stale++; }
}
for (const c of manifest.components) {
  if (!(c.sourcePath in (bundleMeta.sourceHashes ?? {}))) err(`bundle does not include ${c.sourcePath}`);
}

// ─── 5. Token hygiene: one name, one meaning ────────────────────────────────
const tokenFiles = allFiles.filter((f) => f.startsWith('tokens/') && f.endsWith('.css'));
const defs = new Map(); // name -> [{file, scope, value}]
const scopeOf = (css, at) => {
  const before = css.slice(0, at);
  const open = before.lastIndexOf('{');
  const sel = before.slice(before.lastIndexOf('}', open) + 1, open).trim();
  return sel || ':root';
};
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
for (const f of tokenFiles) {
  const css = stripComments(read(f));
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;}]+)/gi)) {
    defs.set(m[1], [...(defs.get(m[1]) ?? []), { file: f, scope: scopeOf(css, m.index), value: m[2].trim() }]);
  }
}
const looksColor = (v) => /^#|rgba?\(|hsla?\(|^(white|black|transparent)$/i.test(v);
const looksSize = (v) => /^-?[\d.]+(px|rem|em|ch|vw|vh|%)$|^clamp\(|^calc\(/i.test(v);
for (const [name, list] of defs) {
  const base = list.filter((d) => d.scope === ':root');
  if (base.length > 1 && new Set(base.map((d) => d.file)).size > 1) {
    err(`token ${name} is defined in :root by ${base.map((d) => d.file).join(' and ')} — one of them silently wins`);
  }
  const kinds = new Set(list.map((d) => (looksColor(d.value) ? 'color' : looksSize(d.value) ? 'size' : 'other')));
  kinds.delete('other');
  if (kinds.size > 1) {
    err(`token ${name} means different things in different files (${list.map((d) => `${d.file}: ${d.value}`).join(', ')})`);
  }
}

// ─── 6. Every var() used across the system resolves to a defined token ──────
const consumers = allFiles.filter(
  (f) => /\.(jsx|html|css)$/.test(f) && !f.startsWith('tokens/') && f !== '_ds_bundle.js' && !f.startsWith('scripts/')
);
const missing = new Map();
for (const f of consumers) {
  const text = stripComments(read(f));
  const locallyDefined = new Set([...text.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]));
  for (const m of text.matchAll(/var\((--[a-z0-9-]+)/gi)) {
    const name = m[1];
    if (defs.has(name) || locallyDefined.has(name)) continue;
    missing.set(name, [...(missing.get(name) ?? []), f]);
  }
}
for (const [name, files] of missing) {
  err(`undefined token ${name} used in ${[...new Set(files)].slice(0, 3).join(', ')}${files.length > 3 ? ' …' : ''}`);
}

// ─── 7. Components stay on tokens (no raw hex / no hard-coded font stacks) ──
for (const f of allFiles.filter((f) => f.startsWith('components/') && f.endsWith('.jsx'))) {
  const text = read(f);
  // Generated components carry official artwork (logo/motif geometry and its colours) or
  // vendored icon paths. Their contents are reproduced verbatim on purpose, so the
  // token rules below do not apply — the generator is the thing to review, not the output.
  const generated = /GENERATED by scripts\//.test(text);
  for (const m of generated ? [] : text.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
    warn(`${f}: raw hex ${m[0]} — use a colour token`);
  }
  if (/font-family|fontFamily/.test(text) && !/var\(--font-family-base\)/.test(text)) {
    warn(`${f}: sets a font without --font-family-base`);
  }
}

// ─── 8. A11y guards for the patterns we have already had to fix ─────────────
for (const f of allFiles.filter((f) => f.startsWith('components/') && f.endsWith('.jsx'))) {
  const text = read(f);
  if (/createElement\('input'[^)]*display: 'none'/.test(text.replace(/\s+/g, ' '))) {
    err(`${f}: native input hidden with display:none — it leaves the tab order. Use className 'rede-control-input'.`);
  }
  if (/zIndex: *\d/.test(text)) warn(`${f}: hard-coded zIndex — use the --z-* scale from tokens/layout.css`);
}

// ─── 9. Manifest paths and referenced assets exist ──────────────────────────
for (const group of ['cards', 'templates']) {
  for (const entry of manifest[group] ?? []) {
    const p = typeof entry === 'string' ? entry : entry.path ?? entry.entry ?? entry.file;
    if (p && !existsSync(join(ROOT, p))) err(`_ds_manifest.json ${group}: ${p} does not exist`);
  }
}
for (const p of manifest.globalCssPaths ?? []) {
  if (!existsSync(join(ROOT, p))) err(`globalCssPaths: ${p} does not exist`);
}
for (const m of read('tokens/fonts.css').matchAll(/url\('([^']+)'\)/g)) {
  const p = join(ROOT, 'tokens', m[1]);
  if (!existsSync(p)) err(`tokens/fonts.css references missing font file ${m[1]}`);
}

// ─── 10. Every local asset reference resolves on disk ──────────────────────
// Catches a moved logo or motif before a page ships with a broken image.
for (const f of allFiles.filter((f) => /\.(html|jsx|css)$/.test(f) && !f.startsWith('assets/'))) {
  const text = read(f);
  const dir = dirname(f);
  const refs = [
    ...[...text.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g)].map((m) => m[1]),
    ...[...text.matchAll(/url\((['"]?)([^)'"]+)\1\)/g)].map((m) => m[2]),
    ...[...text.matchAll(/(?:logoSrc|logo-src|src):\s*['"]([^'"]+)['"]/g)].map((m) => m[1]),
  ];
  for (const ref of refs) {
    if (/^(https?:|data:|#|mailto:|\/\/)/.test(ref) || ref.startsWith('{{')) continue;
    const clean = ref.split(/[?#]/)[0];
    if (!clean) continue;
    const resolved = clean.startsWith('/') ? join(ROOT, clean.slice(1)) : join(ROOT, dir, clean);
    if (!existsSync(resolved)) err(`${f}: references missing file "${ref}"`);
  }
}

// ─── report ────────────────────────────────────────────────────────────────
if (!quiet) {
  console.log(`components  ${manifest.components.length}`);
  console.log(`tokens      ${defs.size} names in ${tokenFiles.length} files`);
  console.log(`bundle      ${stale ? `${stale} stale source(s)` : 'in sync with sources'}`);
  console.log('');
}
for (const w of warnings) console.log(`warn   ${w}`);
for (const e of errors) console.log(`ERROR  ${e}`);
console.log('');
console.log(errors.length ? `FAILED — ${errors.length} error(s), ${warnings.length} warning(s)` : `OK — 0 errors, ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
