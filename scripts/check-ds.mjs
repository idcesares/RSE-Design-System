#!/usr/bin/env node
// Integrity check for the Rede Sesc de Educação design system.
//
//   node scripts/check-ds.mjs          # report
//   node scripts/check-ds.mjs --quiet  # only problems
//
// Exits 1 on any ERROR. Warnings never fail the run — they are style debt, not breakage.
// Run this after touching components, tokens or the manifest. See AGENTS.md.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HOOK_CLASSES, emittedClasses, dynamicModifiers } from './lib/css-contract.mjs';
import { literalValues } from './lib/dts.mjs';

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

const manifest = JSON.parse(read('rse.manifest.json'));
const allFiles = walk('.');

// ─── 1. Every component ships source + types + usage doc ────────────────────
for (const c of manifest.components) {
  for (const ext of ['.js', '.d.ts', '.prompt.md']) {
    const p = c.sourcePath.replace(/\.js$/, ext);
    if (!existsSync(join(ROOT, p))) err(`${c.name}: missing ${p}`);
  }
  const src = existsSync(join(ROOT, c.sourcePath)) ? read(c.sourcePath) : '';
  if (src && !new RegExp(`export (function|const) ${c.name}\\b`).test(src)) {
    err(`${c.name}: ${c.sourcePath} does not export ${c.name} (function or forwardRef const)`);
  }
}

// ─── 2. No component file is orphaned from the manifest ─────────────────────
const known = new Set(manifest.components.map((c) => c.sourcePath));
for (const f of allFiles) {
  if (f.startsWith('components/') && f.endsWith('.js') && !known.has(f)) {
    err(`${f} exists but is not registered in rse.manifest.json`);
  }
}

// ─── 3. index.js re-exports the whole set ───────────────────────────────────
const index = read('index.js');
for (const c of manifest.components) {
  if (!new RegExp(`\\b${c.name}\\b`).test(index)) err(`index.js does not export ${c.name}`);
}

// ─── 4. Generated files are fresh ───────────────────────────────────────────
// dist/rse.js, tokens/tokens.css, dist/tokens.*, brand.json and the docs are each verified by
// their own builder's --check, which `npm run check` runs after this script.

// ─── 4b. Token source names follow the scheme ───────────────────────────────
// Every token lives under rse.<category>; a name outside it would collide with a host's CSS.
for (const f of allFiles.filter((f) => /^tokens\/src\/.+\.tokens\.json$/.test(f))) {
  const top = Object.keys(JSON.parse(read(f))).filter((k) => !k.startsWith('$'));
  if (top.join() !== 'rse') err(`${f}: top-level groups must be exactly "rse" (found ${top.join(', ')})`);
}

// ─── 4c. Nothing outside tokens/ uses a pre-2.0 token name ──────────────────
const OLD = /var\(--(?!rse-)(color|surface|text|border|tint|gray|space|radius|shadow|font|line-height|letter-spacing|duration|ease|z|container|section|focus|hit|sabia|success|warning|danger|info|data|overlay)-?[a-z0-9-]*\)/;
for (const f of allFiles.filter((f) => /\.(jsx|html|css|js|md)$/.test(f) && !/^(tokens\/|dist\/|CHANGELOG|docs\/roadmap\/|showcase\/showcase-data)/.test(f))) {
  const m = read(f).match(OLD);
  if (m) err(`${f}: uses ${m[0]} — 2.0 names are --rse-*; see docs/tokens.md`);
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
  (f) => (/\.(html|css)$/.test(f) || (f.startsWith('components/') && f.endsWith('.js'))) && !f.startsWith('tokens/') && f !== 'dist/rse.js' && !f.startsWith('scripts/')
    // The reference site's pages render the .prompt.md prose, which mentions var(--rse-radius-*)
    // patterns as text; its stylesheet (site/site.css) is still checked.
    && !/^site\/.+\.html$/.test(f)
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
for (const f of allFiles.filter((f) => f.startsWith('components/') && f.endsWith('.js'))) {
  const text = read(f);
  // Generated components carry official artwork (logo/motif geometry and its colours) or
  // vendored icon paths. Their contents are reproduced verbatim on purpose, so the
  // token rules below do not apply — the generator is the thing to review, not the output.
  const generated = /GENERATED by scripts\//.test(text);
  for (const m of generated ? [] : text.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
    err(`${f}: raw hex ${m[0]} — use a colour token`);
  }
  if (/font-family|fontFamily/.test(text) && !/var\(--rse-font-family\)/.test(text)) {
    warn(`${f}: sets a font without --rse-font-family`);
  }
}

// ─── 7b. Consumers import from index.js, never from a component file ───────
// So a component can be re-pathed or re-implemented (roadmap P2) without breaking anyone.
for (const f of allFiles.filter((f) => /^(templates|starters|showcase|docs\/examples)\//.test(f) && /\.(m?js|jsx|html)$/.test(f))) {
  if (f === 'showcase/showcase-data.js') continue;
  for (const m of read(f).matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]*components\/[a-z]+\/[A-Za-z]+(?:\.jsx?)?)['"]/g)) {
    err(`${f}: imports ${m[1]} directly — import from index.js`);
  }
}

// ─── 8. A11y guards for the patterns we have already had to fix ─────────────
for (const f of allFiles.filter((f) => f.startsWith('components/') && f.endsWith('.js'))) {
  const text = read(f);
  const flat = text.replace(/\s+/g, ' ');
  // Look ahead from each input element rather than matching up to the first ")" — an
  // arrow function in an earlier prop (onChange: (e) => …) would end the match too soon.
  for (const m of flat.matchAll(/createElement\('input'/g)) {
    if (/display: *'none'/.test(flat.slice(m.index, m.index + 600))) {
      err(`${f}: native input hidden with display:none — it leaves the tab order. Use className 'rse-control-input'.`);
      break;
    }
  }
  if (/outline: *'none'/.test(flat)) {
    err(`${f}: inline outline:'none' beats the global :focus-visible ring. Keep the ring (AGENTS.md, accessibility floor).`);
  }
  if (/zIndex: *\d/.test(text)) warn(`${f}: hard-coded zIndex — use the --rse-z-* scale (docs/tokens.md)`);
}

// ─── 8b. Hook-using components carry 'use client' ───────────────────────────
// index.js is a flat barrel, so a React Server Components host (Next.js App Router) pulls
// every component into the server graph on any import from it. A component that calls a hook
// without the directive fails the consumer's build, not ours — hence the guard here.
for (const f of allFiles.filter((f) => f.startsWith('components/') && f.endsWith('.js'))) {
  const text = read(f);
  if (!/\buse(State|Effect|LayoutEffect|Ref|Callback|Memo|Id|Reducer|Context)\s*\(/.test(text)) continue;
  if (!/^['"]use client['"];/.test(text)) {
    err(`${f}: calls a React hook but has no 'use client' — breaks in a Next.js App Router server component. Add it as line 1, above the import.`);
  }
}

// ─── 8c. Class contract: what a component emits, its CSS defines ─────────────
// A class the wrapper renders but no stylesheet defines is a silent no-op: the markup the
// .prompt.md documents for CMS use would not look like the component. Two checks:
//   - every literal rse-* class in a component's .js is defined in CSS (or is a declared hook);
//   - every value of a prop that builds a modifier ('rse-x--' + tone) has that modifier in CSS,
//     taking the values from the prop's union in the .d.ts (the default value may have none).
{
  const sheets = allFiles.filter((f) => (f.startsWith('components/') && f.endsWith('.css')) || f === 'tokens/base-runtime.css');
  const defined = new Set(sheets.flatMap((f) => [...read(f).replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/\.(rse-[a-z0-9_-]+)/g)].map((m) => m[1])));
  const dtsAll = allFiles.filter((f) => f.startsWith('components/') && f.endsWith('.d.ts')).map(read).join('\n');
  const unionOf = (dts, prop) => {
    const m = dts.match(new RegExp(`\\b${prop}\\??\\s*:\\s*([^;\\n]+)`));
    return m ? literalValues(m[1], dtsAll) : null;
  };
  for (const f of allFiles.filter((f) => f.startsWith('components/') && f.endsWith('.js'))) {
    const src = read(f);
    for (const cls of emittedClasses(src)) {
      if (defined.has(cls) || HOOK_CLASSES[cls]) continue;
      err(`${f}: emits class ${cls}, which no stylesheet defines — add the rule, or declare it in HOOK_CLASSES (scripts/lib/css-contract.mjs) with the reason`);
    }
    const dtsPath = f.replace(/\.js$/, '.d.ts');
    if (!existsSync(join(ROOT, dtsPath))) continue;
    const dts = read(dtsPath);
    for (const { prefix, prop, fallback } of dynamicModifiers(src)) {
      for (const v of unionOf(dts, prop) ?? []) {
        if (v === fallback || defined.has(prefix + v)) continue;
        err(`${f}: ${prop}="${v}" renders .${prefix}${v}, which no stylesheet defines`);
      }
    }
  }
}

// ─── 8d. Media and container queries sit on the breakpoint scale ─────────────
// CSS cannot read var() inside @media, so breakpoints are literals — which is how a 768px query
// crept in next to an 834px md token. A width must be a breakpoint token (layout.tokens.json) or
// that value minus 1px for max-width (in px, or the same in rem/em at 16px).
{
  const bp = JSON.parse(read('tokens/src/layout.tokens.json')).rse.breakpoint;
  const px = Object.entries(bp).filter(([k]) => !k.startsWith('$')).map(([, v]) => parseFloat(v.$value));
  const ok = new Set(px.flatMap((v) => [v, v - 1, v - 0.16]).map((v) => v.toFixed(2)));
  const names = Object.entries(bp).filter(([k]) => !k.startsWith('$')).map(([k, v]) => `${k} ${v.$value}`).join(', ');
  const scanned = allFiles.filter((f) => /^(components|templates|starters|showcase|tokens)\//.test(f) && /\.(css|html)$/.test(f) && f !== 'dist/components.css');
  for (const f of scanned) {
    for (const q of read(f).matchAll(/@(?:media|container)[^{]*/g)) {
      for (const m of q[0].matchAll(/\((?:min|max)-width\s*:\s*([\d.]+)(px|rem|em)\s*\)/g)) {
        const value = m[2] === 'px' ? Number(m[1]) : Number(m[1]) * 16;
        if (!ok.has(value.toFixed(2))) err(`${f}: query width ${m[1]}${m[2]} is not on the breakpoint scale (${names}; max-width may use the value minus 1px)`);
      }
    }
  }
}

// ─── 8e. Templates render with the in-repo runtime ──────────────────────────
// templates/runtime.js renders every .dc.html template. It replaced a generated dc-runtime build
// copied into each folder whose source was not in this repo; keep it from coming back.
for (const f of allFiles.filter((f) => /^templates\/[^/]+\/support\.js$/.test(f))) {
  err(`${f}: templates render with templates/runtime.js — remove the vendored runtime`);
}
for (const f of allFiles.filter((f) => /^templates\/[^/]+\/ds-base\.js$/.test(f))) {
  if (!read(f).includes("'templates/runtime.js'")) err(`${f}: does not load templates/runtime.js`);
}

// ─── 8f. The adoption tracker is well-formed ────────────────────────────────
// ecosystem.json (roadmap P4.3). Shape errors fail; a system more than one minor behind the
// package for over 90 days is a warning — it is an adoption fact to act on, not a repo defect.
if (existsSync(join(ROOT, 'ecosystem.json'))) {
  const eco = JSON.parse(read('ecosystem.json'));
  const LEVELS = Object.keys(eco.levels ?? {});
  const ROUTES = ['npm', 'static-kit', 'wordpress-adapter', 'other'];
  const pkgVersion = JSON.parse(read('package.json')).version.split('.').map(Number);
  const seen = new Set();
  for (const [i, sys] of (eco.systems ?? []).entries()) {
    const at = `ecosystem.json: systems[${i}]${sys && sys.name ? ` (${sys.name})` : ''}`;
    for (const k of ['name', 'owner']) if (typeof sys[k] !== 'string' || !sys[k].trim()) err(`${at}: "${k}" must be a non-empty string`);
    if (seen.has(sys.name)) err(`${at}: duplicate name`);
    seen.add(sys.name);
    if (!LEVELS.includes(sys.level) && sys.level !== 'none') err(`${at}: "level" must be one of ${[...LEVELS, 'none'].join(', ')}`);
    if (!ROUTES.includes(sys.route)) err(`${at}: "route" must be one of ${ROUTES.join(', ')}`);
    if (!/^\d+\.\d+\.\d+$/.test(sys.version ?? '')) { err(`${at}: "version" must be the design-system version it runs (x.y.z)`); continue; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(sys.updated ?? '')) { err(`${at}: "updated" must be the date it was last confirmed (YYYY-MM-DD)`); continue; }
    const [maj, min] = sys.version.split('.').map(Number);
    const behind = maj < pkgVersion[0] || (maj === pkgVersion[0] && pkgVersion[1] - min > 1);
    const days = (Date.now() - Date.parse(sys.updated)) / 864e5;
    if (behind && days > 90) warn(`${at}: runs ${sys.version}, more than one minor behind ${pkgVersion.join('.')}, confirmed ${Math.floor(days)} days ago`);
  }
}

// ─── 9. Manifest paths and referenced assets exist ──────────────────────────
for (const group of ['cards', 'templates', 'startingPoints']) {
  for (const entry of manifest[group] ?? []) {
    const p = typeof entry === 'string' ? entry : entry.path ?? entry.entry ?? entry.file ?? entry.entryPath;
    if (p && !existsSync(join(ROOT, p))) err(`rse.manifest.json ${group}: ${p} does not exist`);
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
for (const f of allFiles.filter((f) => (/\.(html|css)$/.test(f) || (f.startsWith('components/') && f.endsWith('.js'))) && !f.startsWith('assets/'))) {
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
    console.log('');
}
for (const w of warnings) console.log(`warn   ${w}`);
for (const e of errors) console.log(`ERROR  ${e}`);
console.log('');
console.log(errors.length ? `FAILED — ${errors.length} error(s), ${warnings.length} warning(s)` : `OK — 0 errors, ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
