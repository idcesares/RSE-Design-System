#!/usr/bin/env node
// Browser test of the motion contract (tokens/base-runtime.css), run by `npm run test:motion`.
// Loads scripts/fixtures/motion-nesting.html, pauses every animation at 500 ms and checks:
//   - unmanaged element under "reduced" does not move;
//   - unmanaged element in a nested "full" section does;
//   - managed element under "reduced" computes --rse-motion-travel to 0 (and so does not travel);
//   - the root's scroll-behavior is flattened under "reduced".
import { readFileSync, existsSync, statSync, createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const resolveTool = (name) => {
  try { return require.resolve(name, { paths: [ROOT, process.cwd()] }); } catch {}
  try { return require.resolve(name, { paths: [execSync('npm root -g').toString().trim()] }); } catch {}
  return null;
};
const pwPath = resolveTool('playwright');
if (!pwPath) {
  console.error('test-motion: needs playwright — npm i --no-save playwright && npx playwright install chromium');
  process.exit(1);
}
const pw = await import(pathToFileURL(pwPath).href);
const chromium = pw.chromium ?? pw.default.chromium;

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
const server = createServer((req, res) => {
  const p = join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' });
  createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;

let failed = 0;
const check = (name, ok, detail) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${ok ? '' : ` (${detail})`}`);
  if (!ok) failed++;
};

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(`${origin}/scripts/fixtures/motion-nesting.html`);
  const r = await page.evaluate(() => {
    const out = {};
    for (const a of document.getAnimations()) { a.pause(); a.currentTime = 500; }
    const tx = (id) => new DOMMatrix(getComputedStyle(document.getElementById(id)).transform).m41;
    out.reducedUnmanaged = tx('reduced-unmanaged');
    out.fullUnmanaged = tx('full-unmanaged');
    out.reducedManaged = tx('reduced-managed');
    out.travel = getComputedStyle(document.getElementById('reduced-managed')).getPropertyValue('--rse-motion-travel').trim();
    out.scroll = getComputedStyle(document.documentElement).scrollBehavior;
    return out;
  });
  check('unmanaged element under reduced does not move', Math.abs(r.reducedUnmanaged) < 0.5, `translateX ${r.reducedUnmanaged}`);
  check('unmanaged element in nested full section moves', Math.abs(r.fullUnmanaged - 50) < 1, `translateX ${r.fullUnmanaged}`);
  check('managed element under reduced computes --rse-motion-travel to 0', r.travel === '0', `got "${r.travel}"`);
  check('managed element under reduced does not travel', Math.abs(r.reducedManaged) < 0.5, `translateX ${r.reducedManaged}`);
  check('root scroll-behavior is flattened under reduced', r.scroll === 'auto', `got "${r.scroll}"`);
} finally {
  await browser.close();
  server.close();
}
if (failed) { console.error(`test-motion: ${failed} failed`); process.exit(1); }
console.log('test-motion: ok');
