#!/usr/bin/env node
// Quality scorecard and ratchet for the Rede Sesc de Educação design system.
//
//   node scripts/audit.mjs                    # human-readable scorecard
//   node scripts/audit.mjs --json             # machine-readable, for agents and CI trend lines
//   node scripts/audit.mjs --strict           # the gate `npm run check` runs (see below)
//   node scripts/audit.mjs --update-baseline  # after a change that lowers debt, lock it in
//
// check-ds.mjs answers "is the repo consistent?". This answers "is what it ships good?" — it
// measures the things docs/roadmap/assessment.md argues about, so the roadmap is tracked as
// numbers going down instead of opinions.
//
// --strict fails when any contrast pair misses its floor, a pair names a token that does not
// exist, or any debt count rises above scripts/audit-baseline.json. Debt may only go down: when a
// change lowers a count, run --update-baseline in the same PR so it cannot creep back.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTRAST_PAIRS } from './contrast-pairs.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const asJson = process.argv.includes('--json');
const strict = process.argv.includes('--strict');
const updateBaseline = process.argv.includes('--update-baseline');
const BASELINE = 'scripts/audit-baseline.json';
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

// ─── 1. Contrast of every pair the components actually render ───────────────
// Pairs live in contrast-pairs.mjs, shared with the showcase. Resolved from brand.json, so they
// follow the tokens without re-parsing CSS.

const brand = JSON.parse(read('brand.json'));
const base = Object.fromEntries(Object.entries(brand.tokens).map(([k, v]) => [k, v.value]));
const themes = {
  light: base,
  dark: { ...base, ...Object.fromEntries(Object.entries(brand.themes.dark.overrides).map(([k, v]) => [k, v.value])) },
  contrast: { ...base, ...Object.fromEntries(Object.entries(brand.themes.contrast.overrides).map(([k, v]) => [k, v.value])) },
};

const lum = (hex) => {
  const h = hex.replace('#', '');
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const contrast = [];
const missingTokens = [];
for (const [theme, t] of Object.entries(themes)) {
  for (const { where, fg, bg, floor } of CONTRAST_PAIRS) {
    const a = t[fg], b = t[bg];
    const hex = (v) => /^#[0-9a-f]{6}$/i.test(v ?? '');
    if (!hex(a) || !hex(b)) { missingTokens.push(`${theme}: ${where} (${fg} = ${a}, ${bg} = ${b})`); continue; }
    const r = ratio(a, b);
    contrast.push({ theme, where, fg, bg, floor, ratio: Math.round(r * 100) / 100, pass: r >= floor });
  }
}

// ─── 2. Component implementation debt ───────────────────────────────────────
const GLYPH = /['"](?:×|▾|▸|›|‹|✓|→|←)['"]|\\u00d7|\\u203a|\\u2039/g;
const RAW_COLOR = /#[0-9a-fA-F]{3,8}\b|['"](?:white|black)['"]|rgba?\(/g;
const PX_LITERAL = /\b(?:padding|margin|gap|width|height|fontSize|borderRadius|top|left|right|bottom)\s*:\s*(?:\d+\b|'[^'v]*\d+px[^']*')/g;

const generated = new Set(['components/core/Icon.jsx', 'components/brand/BrandMotif.jsx']);
const components = walk('components')
  .filter((f) => f.endsWith('.jsx') && !generated.has(f))
  .map((f) => {
    const src = read(f);
    return {
      file: f,
      glyphIcons: (src.match(GLYPH) || []).length,
      rawColors: (src.match(RAW_COLOR) || []).length,
      pxLiterals: (src.match(PX_LITERAL) || []).length,
      jsHover: /setHover\(|onMouseEnter/.test(src),
      randomId: /Math\.random/.test(src),
      passesRest: /\.\.\.(?:rest|props|other)\b/.test(src),
      acceptsClassName: /\bclassName\b(?!:\s*'rse-control)/.test(src.replace(/className:\s*'rse-control-(?:input|box)'/g, '')),
      responsive: /matchMedia|@media|container-type/.test(src),
      cssContract: existsSync(join(ROOT, f.replace(/\.jsx$/, '.css'))) || /className: cx\('rse-/.test(src),
    };
  });

// ─── 3. Templates and kits: do they hold the system's own rules? ────────────
const pages = walk('templates')
  .filter((f) => /\.(dc\.html|html|js)$/.test(f) && !/(support|ds-base|deck-stage|doc-page)\.js$/.test(f))
  .map((f) => {
    const src = read(f);
    return {
      file: f,
      rawColors: (src.match(/#[0-9a-fA-F]{3,6}\b|:\s*(?:white|black)\b|rgba?\(/g) || []).length,
      hardWidths: (src.match(/max-width:\s*\d+px|maxWidth:\s*\d+/g) || []).length,
      mediaQueries: (src.match(/@media/g) || []).length,
      fixedGrids: (src.match(/grid-template-columns:\s*(?:repeat\(\d|1fr 1fr)/g) || []).length,
    };
  });

// ─── 4. Documentation consistency: do the docs agree with the manifest? ─────
const manifest = JSON.parse(read('rse.manifest.json'));
const truth = manifest.components.length;
const docClaims = [];
for (const f of ['readme.md', 'AGENTS.md', 'SKILL.md', 'package.json', 'docs/integration.md', 'docs/recipes.md']) {
  for (const m of read(f).matchAll(/\b(\d{2})\s+(?:React\s+)?(?:UI\s+)?(?:components|primitives)\b(?!\s+that)|\((\d{2})\s+built\b/g)) {
    const n = Number(m[1] ?? m[2]);
    if (n !== truth) docClaims.push({ file: f, claims: n, manifest: truth });
  }
}

// ─── Report ─────────────────────────────────────────────────────────────────
const sum = (xs, k) => xs.reduce((a, x) => a + (typeof x[k] === 'boolean' ? Number(x[k]) : x[k]), 0);
const failing = contrast.filter((c) => !c.pass);
const score = {
  contrastPairsFailing: failing.length,
  contrastPairsTotal: contrast.length,
  componentGlyphIcons: sum(components, 'glyphIcons'),
  componentRawColors: sum(components, 'rawColors'),
  componentPxLiterals: sum(components, 'pxLiterals'),
  componentsWithJsHover: sum(components, 'jsHover'),
  componentsWithRandomIds: sum(components, 'randomId'),
  componentsWithoutRestProps: components.length - sum(components, 'passesRest'),
  componentsResponsive: sum(components, 'responsive'),
  componentsOnCssContract: sum(components, 'cssContract'),
  componentsAudited: components.length,
  pageRawColors: sum(pages, 'rawColors'),
  pageHardWidths: sum(pages, 'hardWidths'),
  pagesWithoutMediaQueries: pages.filter((p) => p.mediaQueries === 0).length,
  pagesAudited: pages.length,
  docCountDrift: docClaims.length,
};

// Counts that may only go down (or, for componentsResponsive, only up).
const LOWER_IS_BETTER = [
  'componentGlyphIcons', 'componentRawColors', 'componentPxLiterals', 'componentsWithJsHover',
  'componentsWithRandomIds', 'componentsWithoutRestProps', 'pageRawColors', 'pageHardWidths',
  'pagesWithoutMediaQueries', 'docCountDrift',
];
const HIGHER_IS_BETTER = ['componentsResponsive', 'componentsOnCssContract'];
const baseline = (() => { try { return JSON.parse(read(BASELINE)); } catch { return null; } })();
const regressions = [];
if (baseline) {
  for (const k of LOWER_IS_BETTER) if (k in baseline && score[k] > baseline[k]) regressions.push(`${k} rose ${baseline[k]} → ${score[k]}`);
  for (const k of HIGHER_IS_BETTER) if (k in baseline && score[k] < baseline[k]) regressions.push(`${k} fell ${baseline[k]} → ${score[k]}`);
}

if (updateBaseline) {
  const keep = Object.fromEntries([...LOWER_IS_BETTER, ...HIGHER_IS_BETTER].map((k) => [k, score[k]]));
  writeFileSync(join(ROOT, BASELINE), JSON.stringify(keep, null, 2) + '\n');
  console.log(`${BASELINE} updated`);
} else if (strict) {
  const pad = (s, n) => String(s).padEnd(n);
  for (const m of missingTokens) console.error(`  missing token  ${m}`);
  for (const c of failing) console.error(`  contrast       ${pad(c.theme, 9)}${pad(c.where, 38)}${c.ratio.toFixed(2)} < ${c.floor}  (${c.fg} on ${c.bg})`);
  for (const r of regressions) console.error(`  debt ratchet   ${r} — fix it, or if intended lower another count; see ${BASELINE}`);
  if (!baseline) console.error(`  no ${BASELINE} — run \`npm run audit -- --update-baseline\``);
  const bad = missingTokens.length + failing.length + regressions.length + (baseline ? 0 : 1);
  if (bad) { console.error(`audit FAILED — ${bad} problem(s)`); process.exit(1); }
  console.log(`audit OK — ${contrast.length} contrast pairs pass in 3 themes, no debt above baseline`);
} else if (asJson) {
  console.log(JSON.stringify({ score, baseline, regressions, missingTokens, contrast, components, pages, docClaims }, null, 2));
} else {
  const pad = (s, n) => String(s).padEnd(n);
  console.log('\nContrast — pairs the components render (failures only)\n');
  for (const m of missingTokens) console.log(`  missing token: ${m}`);
  for (const c of failing) {
    console.log(`  ${pad(c.theme, 9)}${pad(c.where, 38)}${pad(c.ratio.toFixed(2), 6)}< ${c.floor}   ${c.fg} on ${c.bg}`);
  }
  console.log('\nComponents with debt\n');
  for (const c of components) {
    const d = [
      c.glyphIcons && `${c.glyphIcons} glyph icon`,
      c.rawColors && `${c.rawColors} raw colour`,
      c.pxLiterals && `${c.pxLiterals} px`,
      c.jsHover && 'JS hover',
      c.randomId && 'Math.random id',
    ].filter(Boolean);
    if (d.length) console.log(`  ${pad(c.file, 44)}${d.join(', ')}`);
  }
  console.log('\nPages and kits\n');
  for (const p of pages) {
    console.log(`  ${pad(p.file, 56)}raw colour ${pad(p.rawColors, 4)}fixed width ${pad(p.hardWidths, 4)}@media ${p.mediaQueries}`);
  }
  if (docClaims.length) {
    console.log('\nDocs that disagree with the manifest\n');
    for (const d of docClaims) console.log(`  ${pad(d.file, 24)}says ${d.claims}, manifest has ${d.manifest}`);
  }
  console.log('\nScorecard\n');
  for (const [k, v] of Object.entries(score)) {
    const b = baseline && k in baseline ? `   (baseline ${baseline[k]})` : '';
    console.log(`  ${pad(k, 30)}${pad(v, 6)}${b}`);
  }
  for (const r of regressions) console.log(`  REGRESSION: ${r}`);
  console.log('');
}
