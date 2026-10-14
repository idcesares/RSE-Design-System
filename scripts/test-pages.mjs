#!/usr/bin/env node
// Opens every page the system ships in a real browser and checks what a static scan cannot:
// runtime errors, components that failed to load, tokens that did not apply, horizontal overflow
// on a 360px phone, and WCAG 2.2 AA violations found by axe-core.
//
//   node scripts/test-pages.mjs                    # report; exit 1 on any regression
//   node scripts/test-pages.mjs --update-baseline  # after fixing violations, lock the new counts in
//   node scripts/test-pages.mjs --only=templates   # pages whose path contains the string
//
// Needs `playwright` (with Chromium) and `axe-core`. The repo keeps zero dependencies, so CI
// installs them for this step only:  npm i --no-save playwright axe-core && npx playwright install chromium
// Locally, a global playwright install is found too.
//
// Runtime errors always fail. axe violations and phone overflow are ratcheted against
// scripts/test-pages-baseline.json: a page may not get worse, and lowering a count is locked in
// with --update-baseline in the same change.

import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, createReadStream } from 'node:fs';
import { join, dirname, extname, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE = join(ROOT, 'scripts/test-pages-baseline.json');
const update = process.argv.includes('--update-baseline');
const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7);

// ─── Tools ──────────────────────────────────────────────────────────────────
const require = createRequire(import.meta.url);
const resolveTool = (name) => {
  try { return require.resolve(name, { paths: [ROOT, process.cwd()] }); } catch {}
  try { return require.resolve(name, { paths: [execSync('npm root -g').toString().trim()] }); } catch {}
  return null;
};
const pwPath = resolveTool('playwright');
const axePath = process.env.AXE_CORE_PATH || resolveTool('axe-core/axe.min.js');
if (!pwPath || !axePath) {
  console.error('test-pages: needs playwright and axe-core — npm i --no-save playwright axe-core && npx playwright install chromium');
  process.exit(2);
}
const pw = await import(pathToFileURL(pwPath).href);
const chromium = pw.chromium ?? pw.default.chromium;
const axeSource = readFileSync(axePath, 'utf8');

// ─── Pages ──────────────────────────────────────────────────────────────────
const walk = (dir, out = []) => {
  for (const n of readdirSync(join(ROOT, dir))) {
    const p = join(dir, n);
    statSync(join(ROOT, p)).isDirectory() ? walk(p, out) : out.push(p.split(sep).join('/'));
  }
  return out;
};
const pages = [...walk('guidelines'), ...walk('components'), ...walk('templates'), ...walk('starters'), 'showcase/index.html']
  .filter((f) => f.endsWith('.html') && (!only || f.includes(only)));

// Print and slide artefacts are fixed-size canvases (A4, A3, 1920×1080), not responsive pages.
const FIXED_CANVAS = /enrollment-form|institutional-deck|poster\.html/;

// ─── Static server (templates fetch themselves, which file:// forbids) ──────
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = createServer((req, res) => {
  const p = join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' });
  createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}/`;

// ─── Run ────────────────────────────────────────────────────────────────────
const browser = await chromium.launch();
const results = {};
for (const page of pages) {
  const r = { errors: [], axe: 0, rules: {}, overflow: false };
  for (const width of [1280, 360]) {
    const tab = await browser.newPage({ viewport: { width, height: 900 } });
    tab.on('pageerror', (e) => r.errors.push(`${width}px pageerror: ${e.message}`));
    tab.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) r.errors.push(`${width}px console: ${m.text().slice(0, 200)}`); });
    await tab.goto(origin + page, { waitUntil: 'load' }).catch((e) => r.errors.push(`goto: ${e.message}`));
    await tab.waitForTimeout(1200);
    const state = await tab.evaluate(() => ({
      ds: ((window.RSE && window.RSE.__errors) || []).map((e) => `${e.path}: ${e.error}`),
      tokens: getComputedStyle(document.documentElement).getPropertyValue('--rse-color-primary').trim(),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    }));
    r.errors.push(...state.ds.map((e) => `RSE: ${e}`));
    if (!state.tokens) r.errors.push(`${width}px: tokens not loaded`);
    if (width === 360 && !FIXED_CANVAS.test(page)) r.overflow = state.overflow;
    if (width === 1280) {
      await tab.addScriptTag({ content: axeSource });
      const axe = await tab.evaluate(async () => {
        const res = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
        return res.violations.map((v) => ({ id: v.id, nodes: v.nodes.length }));
      });
      for (const v of axe) { r.rules[v.id] = v.nodes; r.axe += v.nodes; }
    }
    await tab.close();
  }
  results[page] = r;
}
await browser.close();
server.close();

// ─── Report and ratchet ─────────────────────────────────────────────────────
const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : {};
const problems = [];
let totalAxe = 0, overflowing = 0;
for (const [page, r] of Object.entries(results)) {
  totalAxe += r.axe;
  if (r.overflow) overflowing++;
  const b = baseline[page] ?? { axe: 0, overflow: false };
  for (const e of r.errors) problems.push(`${page}: ${e}`);
  if (r.axe > b.axe) problems.push(`${page}: axe violations rose ${b.axe} → ${r.axe} (${Object.entries(r.rules).map(([k, n]) => `${k}×${n}`).join(', ')})`);
  if (r.overflow && !b.overflow) problems.push(`${page}: scrolls horizontally at 360px`);
  const tag = [r.errors.length && `${r.errors.length} error(s)`, r.axe && `axe ${r.axe}${b.axe !== r.axe ? ` (baseline ${b.axe})` : ''}`, r.overflow && 'overflows at 360px'].filter(Boolean);
  console.log(`${tag.length ? '•' : '✓'} ${page}${tag.length ? '  — ' + tag.join(' · ') : ''}`);
}
console.log(`\n${pages.length} pages · ${totalAxe} axe violation nodes · ${overflowing} page(s) overflow at 360px`);

if (update) {
  const next = { ...baseline };
  for (const [page, r] of Object.entries(results)) next[page] = { axe: r.axe, overflow: r.overflow, rules: r.rules };
  writeFileSync(BASELINE, JSON.stringify(next, null, 2) + '\n');
  console.log(`${relative(ROOT, BASELINE)} updated`);
}
if (problems.length && !update) {
  console.error('\nFAILED');
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
if (problems.some((p) => !/axe violations rose|scrolls horizontally/.test(p))) process.exit(1);
