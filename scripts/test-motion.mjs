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

  // Nesting matrix: nearest [data-rse-motion] ancestor decides, for unmanaged and managed motion.
  // Each fixture element runs a 100 px slide (managed: scaled by --rse-motion-travel), sampled at 500 ms of 1000.
  const slideAt = async (pg, url, ids) => {
    await pg.goto(`${origin}/scripts/fixtures/${url}`);
    return pg.evaluate((ids) => {
      for (const a of document.getAnimations()) { a.pause(); a.currentTime = 500; }
      return Object.fromEntries(ids.map((id) => [id, new DOMMatrix(getComputedStyle(document.getElementById(id)).transform).m41]));
    }, ids);
  };
  const expectSlides = (label, got, want) => {
    for (const [id, moves] of Object.entries(want)) {
      const ok = moves ? Math.abs(got[id] - 50) < 1 : Math.abs(got[id]) < 0.5;
      check(`${label}: ${id} ${moves ? 'moves' : 'holds still'}`, ok, `translateX ${got[id]}`);
    }
  };
  expectSlides('reduced page', await slideAt(page, 'motion-nesting.html', ['reduced-unmanaged', 'reduced-managed', 'full-unmanaged', 'full-managed', 'rfr-unmanaged', 'rfr-managed']),
    { 'reduced-unmanaged': false, 'reduced-managed': false, 'full-unmanaged': true, 'full-managed': true, 'rfr-unmanaged': false, 'rfr-managed': false });
  expectSlides('full page', await slideAt(page, 'motion-nesting-full.html', ['top-unmanaged', 'top-managed', 'fr-unmanaged', 'fr-managed']),
    { 'top-unmanaged': true, 'top-managed': true, 'fr-unmanaged': false, 'fr-managed': false });
  const osNest = await browser.newPage({ reducedMotion: 'reduce' });
  expectSlides('no attribute, OS reduce', await slideAt(osNest, 'motion-nesting-bare.html', ['top-unmanaged', 'top-managed', 'full-unmanaged', 'full-managed', 'fr-unmanaged', 'fr-managed']),
    { 'top-unmanaged': false, 'top-managed': false, 'full-unmanaged': true, 'full-managed': true, 'fr-unmanaged': false, 'fr-managed': false });
  await osNest.close();
  const noPref = await browser.newPage({ reducedMotion: 'no-preference' });
  expectSlides('no attribute, no OS preference', await slideAt(noPref, 'motion-nesting-bare.html', ['top-unmanaged', 'top-managed', 'fr-unmanaged', 'fr-managed']),
    { 'top-unmanaged': true, 'top-managed': true, 'fr-unmanaged': false, 'fr-managed': false });
  await noPref.close();

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

  // Nested sections: the nearest [data-rse-motion] ancestor picks the form of a managed component.
  await page.goto(`${origin}/scripts/fixtures/motif-loader.html`);
  const loaderForm = await page.evaluate(() => {
    const ids = ['full', 'reduced', 'nested-full', 'nested-reduced', 'nested-rfr'];
    for (const id of ids) window.mount(id, [{ shape: 'cube' }]);
    return Object.fromEntries(ids.map((id) => {
      const loader = document.querySelector(`#${id} .rse-motif-loader`);
      const anims = loader.getAnimations({ subtree: true }).filter((a) => a.animationName === 'rse-motif-build');
      const cycle = anims[0].effect.getComputedTiming().duration;
      for (const a of loader.getAnimations({ subtree: true })) { a.pause(); a.currentTime = 0; }
      const moved = [...loader.querySelectorAll('.rse-motif-loader__piece')].some((p) => !new DOMMatrix(getComputedStyle(p).transform).isIdentity);
      return [id, { cycle, moved, travel: getComputedStyle(loader).getPropertyValue('--rse-motion-travel').trim() }];
    }));
  });
  const FULL_CYCLE = loaderForm.full.cycle;
  for (const [id, wantFull] of [['nested-full', true], ['nested-reduced', false], ['nested-rfr', false]]) {
    const f = loaderForm[id];
    check(`loader in ${id}: ${wantFull ? 'full cycle, travels' : 'doubled cycle, no travel'}`,
      wantFull ? f.cycle === FULL_CYCLE && f.moved && f.travel === '1' : f.cycle === 2 * FULL_CYCLE && !f.moved && f.travel === '0',
      JSON.stringify(f));
  }

  // ─── MotifPattern ─────────────────────────────────────────────────────────
  // React path (dist/rse.js, no motion.js), static-HTML path (motion.js, no React), and both together.
  const PATTERN = `${origin}/scripts/fixtures/motif-pattern.html`;
  const AMBIENT = { shape: 'cube', hue: 'purple', animate: 'ambient', cell: 160 };
  const REVEAL = { shape: 'cube', hue: 'green', animate: 'reveal', cell: 160 };
  const cellStates = (sel) => page.evaluate((sel) => {
    const root = document.querySelector(sel);
    const cells = [...root.querySelectorAll('.rse-motif-pattern__cell')];
    const anims = cells.flatMap((c) => c.getAnimations());
    return {
      cells: cells.length,
      animations: anims.length,
      running: anims.filter((a) => a.playState === 'running').length,
      paused: anims.filter((a) => a.playState === 'paused').length,
      dataPaused: root.hasAttribute('data-paused'),
    };
  }, sel);
  const buttonState = (sel) => page.evaluate((sel) => {
    const b = document.querySelector(sel + ' .rse-motif-pattern__pause');
    const vis = (cls) => { const e = b.querySelector(cls); return !!e && getComputedStyle(e).display !== 'none'; };
    const r = b.getBoundingClientRect();
    return { pressed: b.getAttribute('aria-pressed'), label: b.getAttribute('aria-label'), pauseIcon: vis('.rse-motif-pattern__icon--pause'), playIcon: vis('.rse-motif-pattern__icon--play'), w: r.width, h: r.height };
  }, sel);

  // React only: no RSE.motion on the page.
  await page.goto(PATTERN);
  await page.evaluate((a) => window.mount('full', [a]), AMBIENT);
  check('React path: RSE.motion is absent (the component imports nothing from motion.js)', await page.evaluate(() => typeof window.RSE.motion === 'undefined'), 'RSE.motion exists');
  const before = await cellStates('#full .rse-motif-pattern');
  check('ambient cells run before pausing', before.cells > 5 && before.running === before.animations && before.animations >= before.cells && !before.dataPaused, JSON.stringify(before));
  const b0 = await buttonState('#full');
  check('pause button starts unpressed, labelled in pt-BR, pause icon shown', b0.pressed === 'false' && b0.label === 'Pausar animação' && b0.pauseIcon && !b0.playIcon, JSON.stringify(b0));
  check('pause button hit target is at least 44 x 44', b0.w >= 44 && b0.h >= 44, `${b0.w} x ${b0.h}`);
  await page.click('#full .rse-motif-pattern__pause');
  const after = await cellStates('#full .rse-motif-pattern');
  const b1 = await buttonState('#full');
  check('pause button sets data-paused and aria-pressed=true and pauses animations', after.dataPaused && b1.pressed === 'true' && after.paused === after.animations && after.running === 0 && after.animations > 0, `${JSON.stringify(after)} ${b1.pressed}`);
  check('paused swaps the label and shows the play icon', b1.label === 'Retomar animação' && b1.playIcon && !b1.pauseIcon, JSON.stringify(b1));
  await page.click('#full .rse-motif-pattern__pause');
  const again = await cellStates('#full .rse-motif-pattern');
  const b2 = await buttonState('#full');
  check('a second click resumes (React path, one click = one toggle)', !again.dataPaused && again.running === again.animations && b2.pressed === 'false' && b2.label === 'Pausar animação', `${JSON.stringify(again)} ${b2.pressed}`);
  await page.focus('#full .rse-motif-pattern__pause');
  await page.keyboard.press('Space');
  check('Space on the focused pause button pauses', (await cellStates('#full .rse-motif-pattern')).dataPaused, 'not paused');
  const ring = await page.evaluate(() => { const cs = getComputedStyle(document.querySelector('#full .rse-motif-pattern__pause')); return { style: cs.outlineStyle, width: parseFloat(cs.outlineWidth) }; });
  check('pause button shows a focus ring', ring.style !== 'none' && ring.width > 0, JSON.stringify(ring));

  // No button for none or reveal; the root is not aria-hidden, the art is.
  await page.goto(PATTERN);
  await page.evaluate((r) => window.mount('full', [{ shape: 'cube', cell: 160 }, r]), REVEAL);
  check('none and reveal render no pause button', await page.evaluate(() => document.querySelectorAll('.rse-motif-pattern__pause').length === 0), 'a button exists');
  check('the art is aria-hidden and the root is not', await page.evaluate(() => [...document.querySelectorAll('.rse-motif-pattern')].every((p) => !p.hasAttribute('aria-hidden') && p.querySelector('.rse-motif-pattern__art').getAttribute('aria-hidden') === 'true')), 'aria wrong');

  // Reduced: ambient is static, in the attribute form, the OS-media form, and not in a nested full section.
  await page.goto(PATTERN);
  await page.evaluate((a) => { window.mount('full', [a]); window.mount('reduced', [a]); window.mount('nested-full', [a]); }, AMBIENT);
  const fullAmb = await cellStates('#full .rse-motif-pattern');
  const redAmb = await cellStates('#reduced .rse-motif-pattern');
  const nestedAmb = await cellStates('#nested-full .rse-motif-pattern');
  check('in reduced, ambient cells have no running animation', redAmb.cells > 5 && redAmb.running === 0 && redAmb.animations === 0, JSON.stringify(redAmb));
  check('in full, ambient cells do animate', fullAmb.running > 0, JSON.stringify(fullAmb));
  check('a full section nested in a reduced one animates again', nestedAmb.running > 0, JSON.stringify(nestedAmb));
  await page.evaluate((a) => { window.mount('nested-reduced', [a]); window.mount('nested-rfr', [a]); }, AMBIENT);
  const nestedRed = await cellStates('#nested-reduced .rse-motif-pattern');
  const nestedRfr = await cellStates('#nested-rfr .rse-motif-pattern');
  check('a reduced section nested in a full one has a static ambient pattern', nestedRed.cells > 5 && nestedRed.running === 0, JSON.stringify(nestedRed));
  check('reduced inside full inside reduced has a static ambient pattern', nestedRfr.cells > 5 && nestedRfr.running === 0, JSON.stringify(nestedRfr));
  const osPage = await browser.newPage({ reducedMotion: 'reduce' });
  await osPage.goto(PATTERN);
  await osPage.evaluate((a) => window.mount('bare', [a]), AMBIENT);
  const osRunning = await osPage.evaluate(() => [...document.querySelectorAll('#bare .rse-motif-pattern__cell')].flatMap((c) => c.getAnimations()).filter((a) => a.playState === 'running').length);
  check('in reduced (OS preference, no attribute), ambient cells have no running animation', osRunning === 0, `${osRunning} running`);
  await osPage.close();

  // Reveal: cells are visible by default, hidden only under [data-reveal-ready]:not(.is-visible).
  // The animation is sampled at the start, middle and end of each cell's own run.
  const revealProbe = (form) => page.evaluate((form) => {
    const root = document.querySelector(`#${form} .rse-motif-pattern`);
    const cells = [...root.querySelectorAll('.rse-motif-pattern__cell')];
    const op = () => cells.map((c) => parseFloat(getComputedStyle(c).opacity));
    const out = { n: cells.length, plain: op() };
    root.setAttribute('data-reveal-ready', '');
    out.hidden = op();
    root.classList.add('is-visible');
    const anims = cells.map((c) => c.getAnimations().find((a) => a.animationName === 'rse-motif-reveal'));
    out.animated = anims.every(Boolean);
    const at = (frac) => {
      anims.forEach((a) => { a.pause(); const t = a.effect.getComputedTiming(); a.currentTime = t.delay + frac * t.duration; });
      return cells.map((c) => { const cs = getComputedStyle(c); const m = new DOMMatrix(cs.transform === 'none' ? undefined : cs.transform); return { o: parseFloat(cs.opacity), identity: m.isIdentity, dy: m.m42 }; });
    };
    out.t0 = at(0); out.t50 = at(0.5); out.t100 = at(0.999);
    out.delays = anims.map((a) => a.effect.getComputedTiming().delay);
    out.duration = anims[0].effect.getComputedTiming().duration;
    anims.forEach((a) => a.cancel());
    out.rest = op();
    return out;
  }, form);
  await page.goto(PATTERN);
  await page.evaluate((r) => { window.mount('full', [r]); window.mount('reduced', [r]); window.mount('nested-full', [r]); window.mount('nested-reduced', [r]); }, REVEAL);
  const rf = await revealProbe('full');
  const rr = await revealProbe('reduced');
  const rnf = await revealProbe('nested-full');
  const rnr = await revealProbe('nested-reduced');
  check('reveal in a full section nested in reduced travels', rnf.t0.some((c) => !c.identity), JSON.stringify(rnf.t0.slice(0, 2)));
  check('reveal in a reduced section nested in full never translates', [rnr.t0, rnr.t50, rnr.t100].every((t) => t.every((c) => c.identity)), 'a cell moved');
  check('reveal: cells are visible with no JS enhancement', rf.plain.every((o) => o === 1), `opacity ${rf.plain.slice(0, 3)}`);
  check('reveal: [data-reveal-ready] without .is-visible hides the cells', rf.hidden.every((o) => o === 0), `opacity ${rf.hidden.slice(0, 3)}`);
  check('reveal: full travels (non-identity at the start) and lands in place, opacity 0 to 1', rf.animated && rf.t0.some((c) => !c.identity) && rf.t0.every((c) => c.o === 0) && rf.t100.every((c) => Math.abs(c.dy) < 0.1 && c.o > 0.95) && rf.t50.every((c) => c.o > 0 && c.o < 1), JSON.stringify(rf.t0.slice(0, 2)));
  check('reveal: stagger follows --d and the run uses --rse-duration-reveal', rf.delays.some((d) => d > 0) && rf.duration === 600, `duration ${rf.duration}`);
  check('reveal: after the run the cells rest fully visible', rf.rest.every((o) => o === 1), `opacity ${rf.rest.slice(0, 3)}`);
  check('in reduced, reveal cells never translate', rr.animated && [rr.t0, rr.t50, rr.t100].every((t) => t.every((c) => c.identity)), 'a cell moved');
  check('in reduced, reveal still fades (opacity only)', rr.t0.every((c) => c.o === 0) && rr.t50.every((c) => c.o > 0 && c.o < 1) && rr.t100.every((c) => c.o > 0.95), JSON.stringify(rr.t50.slice(0, 2)));

  // Print: a reveal-ready pattern that never became visible still prints in full.
  await page.evaluate(() => { document.querySelector('#full .rse-motif-pattern').setAttribute('data-reveal-ready', ''); document.querySelector('#full .rse-motif-pattern').classList.remove('is-visible'); });
  const screenHidden = await page.evaluate(() => getComputedStyle(document.querySelector('#full .rse-motif-pattern__cell')).opacity);
  await page.emulateMedia({ media: 'print' });
  const printOp = await page.evaluate(() => { const c = document.querySelector('#full .rse-motif-pattern__cell'); const cs = getComputedStyle(c); return { o: cs.opacity, t: cs.transform }; });
  await page.emulateMedia({ media: 'screen' });
  check('reveal-ready cells are hidden on screen but print in full', screenHidden === '0' && printOp.o === '1' && (printOp.t === 'none' || new DOMMatrix(printOp.t).isIdentity), `screen ${screenHidden}, print ${JSON.stringify(printOp)}`);

  // Reveal through motion.js (React + RSE.motion.reveal): ready, then visible on entering the viewport, once.
  await page.goto(`${PATTERN}?motion`);
  await page.setViewportSize({ width: 800, height: 600 });
  await page.evaluate((r) => window.mount('full', [r, Object.assign({}, r, { __offset: 2500 })]), REVEAL);
  await page.waitForFunction(() => document.querySelector('#full .rse-motif-pattern.is-visible'));
  const rv = await page.evaluate(() => [...document.querySelectorAll('#full .rse-motif-pattern')].map((p) => ({ ready: p.hasAttribute('data-reveal-ready'), visible: p.classList.contains('is-visible') })));
  check('reveal via motion.js: marks ready, visible once in the viewport, the far one waits', rv[0].ready && rv[0].visible && rv[1].ready && !rv[1].visible, JSON.stringify(rv));
  await page.evaluate(() => document.querySelectorAll('#full .rse-motif-pattern')[1].scrollIntoView());
  await page.waitForFunction(() => document.querySelectorAll('#full .rse-motif-pattern')[1].classList.contains('is-visible'));
  check('reveal via motion.js: scrolling it into view reveals it', true, '');

  // Static HTML, motion.js only (no React on the page).
  await page.goto(`${origin}/scripts/fixtures/motif-pattern-static.html`);
  const S = '#ambient-box .rse-motif-pattern';
  const s0 = await cellStates(S);
  await page.click(`${S} .rse-motif-pattern__pause`);
  const s1 = await cellStates(S);
  const sb = await buttonState('#ambient-box');
  check('clicking pause works with the static-HTML markup and motion.js only', s0.running > 0 && s1.dataPaused && s1.paused === s1.animations && s1.running === 0 && sb.pressed === 'true' && sb.label === 'Retomar animação' && sb.playIcon && !sb.pauseIcon, `${JSON.stringify(s1)} ${JSON.stringify(sb)}`);
  await page.click(`${S} .rse-motif-pattern__pause`);
  const s2 = await cellStates(S);
  check('static: the second click resumes (one click = one toggle)', !s2.dataPaused && s2.running === s2.animations, JSON.stringify(s2));
  await page.evaluate(() => window.RSE.motion.reveal());
  await page.waitForFunction(() => document.getElementById('reveal-pattern').classList.contains('is-visible'));
  check('static: RSE.motion.reveal() reveals a pattern in the viewport', await page.evaluate(() => document.getElementById('reveal-pattern').hasAttribute('data-reveal-ready')), 'not ready');

  // React and motion.js together: the React handler stops the event, so one click is one toggle.
  await page.goto(`${PATTERN}?motion`);
  await page.evaluate((a) => window.mount('full', [a]), AMBIENT);
  await page.click('#full .rse-motif-pattern__pause');
  const t1 = await cellStates('#full .rse-motif-pattern');
  const tb1 = await buttonState('#full');
  await page.click('#full .rse-motif-pattern__pause');
  const t2 = await cellStates('#full .rse-motif-pattern');
  check('React and motion.js together: one click = one toggle, both directions', t1.dataPaused && tb1.pressed === 'true' && !t2.dataPaused && t2.running === t2.animations, `${JSON.stringify(t1)} ${tb1.pressed} ${JSON.stringify(t2)}`);
} finally {
  await browser.close();
  server.close();
}
if (failed) { console.error(`test-motion: ${failed} failed`); process.exit(1); }
console.log('test-motion: ok');
