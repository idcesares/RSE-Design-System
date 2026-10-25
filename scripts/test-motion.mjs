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

  // ─── MotifLoader ──────────────────────────────────────────────────────────
  // Real component from dist/rse.js. Animations are paused and set to 0, 40% and 80% of a cycle.
  await page.goto(`${origin}/scripts/fixtures/motif-loader.html`);
  const shapes = ['cube', 'triangle', 'twin'];
  await page.evaluate((shapes) => {
    const list = [...shapes.map((shape) => ({ shape })), { shape: 'cube', hues: ['green', 'blue'] }];
    window.mount('full', list);
    window.mount('reduced', list);
  }, shapes);
  const probe = await page.evaluate(() => {
    const identity = (t) => { const m = new DOMMatrix(t === 'none' ? undefined : t); return m.isIdentity; };
    const out = {};
    for (const form of ['full', 'reduced']) {
      document.querySelectorAll(`#${form} .rse-motif-loader`).forEach((loader, n) => {
        const pieces = [...loader.querySelectorAll('.rse-motif-loader__piece')];
        const anims = loader.getAnimations({ subtree: true }).filter((a) => a.animationName === 'rse-motif-build');
        const cycle = anims[0].effect.getComputedTiming().duration;
        const at = (frac) => {
          for (const a of loader.getAnimations({ subtree: true })) { a.pause(); a.currentTime = frac * cycle; }
          return pieces.map((p) => { const cs = getComputedStyle(p); return { opacity: parseFloat(cs.opacity), identity: identity(cs.transform) }; });
        };
        const rec = { cycle, count: pieces.length, delays: anims.map((a) => a.effect.getTiming().delay) };
        for (const f of [0, 0.15, 0.3, 0.4, 0.5, 0.8]) rec['t' + f] = at(f);
        rec.fill = getComputedStyle(pieces[0]).animationFillMode;
        // Hue loader: the face fill of the first piece, in the first and second cycle.
        const poly = loader.querySelector('polygon');
        const fillAt = (frac) => { for (const a of loader.getAnimations({ subtree: true })) { a.pause(); a.currentTime = frac * cycle; } return getComputedStyle(poly).fill; };
        rec.fill0 = fillAt(0.5); rec.fill1 = fillAt(1.5);
        rec.c0 = poly.style.getPropertyValue('--c0').trim(); rec.c1 = poly.style.getPropertyValue('--c1').trim();
        // With every animation cancelled, the underlying style is the assembled shape.
        for (const a of loader.getAnimations({ subtree: true })) a.cancel();
        rec.rest = pieces.map((p) => { const cs = getComputedStyle(p); return { opacity: parseFloat(cs.opacity), identity: identity(cs.transform) }; });
        out[`${form}/${n}`] = rec;
      });
    }
    return out;
  });
  const rgb = (hex) => `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`;
  shapes.forEach((shape, n) => {
    const f = probe[`full/${n}`], r = probe[`reduced/${n}`];
    check(`${shape}: full has a non-identity transform at 0%`, f.t0.some((p) => !p.identity), 'every piece identity');
    check(`${shape}: full build is staggered and every piece is in place by 30%`, f.t0.every((p) => p.opacity === 0) && f['t0.3'].every((p) => p.opacity === 1 && p.identity) && f['t0.15'].some((p) => p.opacity < 1) && f['t0.15'].some((p) => p.opacity > 0), `0.15: ${f['t0.15'].map((p) => p.opacity.toFixed(2))}`);
    check(`${shape}: full pieces start in order, last start under 20% of the cycle`, f.delays.every((d, i) => i === 0 || d > f.delays[i - 1]) && f.delays[f.count - 1] < 0.2 * f.cycle && f.delays[0] === 0, `delays ${f.delays}`);
    check(`${shape}: full holds the assembled shape at 40%`, f['t0.4'].every((p) => p.opacity === 1 && p.identity), 'not assembled');
    check(`${shape}: full has released at least one piece at 80%`, f['t0.8'].some((p) => p.opacity < 1), 'nothing releasing');
    const times = ['t0', 't0.4', 't0.8'];
    check(`${shape}: reduced is identity at 0, 40 and 80%`, times.every((t) => r[t].every((p) => p.identity)), 'a piece moved');
    check(`${shape}: reduced opacity still changes`, r.t0.every((p) => p.opacity === 0) && r['t0.4'].every((p) => p.opacity === 1) && r['t0.8'].some((p) => p.opacity < 1), `0.8: ${r['t0.8'].map((p) => p.opacity.toFixed(2))}`);
    check(`${shape}: reduced cycle is double the full cycle`, r.cycle === 2 * f.cycle, `${r.cycle} vs ${f.cycle}`);
    check(`${shape}: end state is the assembled shape, nothing held`, f.fill === 'backwards' && r.fill === 'backwards' && [...f.rest, ...r.rest].every((p) => p.opacity === 1 && p.identity), `fill ${f.fill}`);
  });
  const hf = probe['full/3'], hr = probe['reduced/3'];
  check('hues: fill is the first hue in cycle 1 and the second in cycle 2', hf.fill0 === rgb(hf.c0) && hf.fill1 === rgb(hf.c1) && hf.c0 !== hf.c1, `${hf.fill0} / ${hf.fill1} vs ${hf.c0} / ${hf.c1}`);
  check('hues: reduced steps through the hues on its own (doubled) cycle', hr.fill0 === rgb(hr.c0) && hr.fill1 === rgb(hr.c1), `${hr.fill0} / ${hr.fill1}`);
} finally {
  await browser.close();
  server.close();
}
if (failed) { console.error(`test-motion: ${failed} failed`); process.exit(1); }
console.log('test-motion: ok');
