#!/usr/bin/env node
// Renders composition exemplars to PNG. Author tooling: not part of `npm run check`, and the
// composition spec does not depend on it.
//
//   node scripts/render-exemplars.mjs                 # every exemplar
//   node scripts/render-exemplars.mjs pitch-deck      # one
//
// docs/composition/exemplars/src/<name>.html declares its canvas in
// <meta name="canvas" content="WxH">. A page holding several slides marks each one with
// [data-slide]; those render to exemplars/<name>/<nn>.png and a contact sheet to exemplars/<name>.png.
// Needs the pre-installed Playwright + Chromium (require('playwright'); no install step).

import { readFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'docs/composition/exemplars');
const SRC = join(DIR, 'src');
const { chromium } = createRequire(import.meta.url)('playwright');

const wanted = process.argv.slice(2);
const names = readdirSync(SRC).filter((f) => f.endsWith('.html')).map((f) => f.replace(/\.html$/, ''))
  .filter((n) => !wanted.length || wanted.includes(n));
if (!names.length) { console.error('no exemplar matched'); process.exit(1); }

const browser = await chromium.launch();
let failed = false;
for (const name of names) {
  const file = join(SRC, `${name}.html`);
  const [w, h] = readFileSync(file, 'utf8').match(/name="canvas"\s+content="(\d+)x(\d+)"/).slice(1).map(Number);
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const problems = [];
  page.on('console', (m) => { if (m.type() === 'error') problems.push(m.text()); });
  page.on('pageerror', (e) => problems.push(e.message));
  page.on('requestfailed', (r) => problems.push(`failed to load ${r.url()}`));
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(() => document.fonts.ready);
  const slides = await page.$$('[data-slide]');
  if (slides.length) {
    mkdirSync(join(DIR, name), { recursive: true });
    for (const [i, el] of slides.entries()) {
      await el.screenshot({ path: join(DIR, name, `${String(i + 1).padStart(2, '0')}.png`) });
    }
    // Contact sheet: the same page scaled to a grid, which the page's own print of [data-sheet] provides.
    const sheet = await page.$('[data-sheet]');
    if (sheet) await sheet.screenshot({ path: join(DIR, `${name}.png`) });
    else await page.screenshot({ path: join(DIR, `${name}.png`), fullPage: true });
  } else {
    await page.screenshot({ path: join(DIR, `${name}.png`), fullPage: false });
  }
  console.log(`${problems.length ? 'FAIL' : 'ok  '} ${name}  ${w}x${h}${slides.length ? `  ${slides.length} slides` : ''}`);
  for (const p of problems) { console.log(`       ${p}`); failed = true; }
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
