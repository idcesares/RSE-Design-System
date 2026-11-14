#!/usr/bin/env node
// Renders the brand rasters from the vectors and the tokens, so no raster is ever composited by
// hand or re-sampled from old extractions (docs/known-gaps.md).
//
//   assets/og-image.png   1200 × 630 social preview: the white wordmark (assets/logos/
//                         wordmark-white.svg) centred on --rse-brand-purple-dark, a sanctioned
//                         combination (assets/logos/README.md: white wordmark on purple).
//
//   node scripts/render-brand-rasters.mjs
//
// An author tool, like render-exemplars.mjs: it needs Playwright with Chromium, and its output is
// committed. assets/favicon.png is NOT rendered here: at favicon sizes the selo is below its
// 150 px digital minimum, so which mark the favicon carries is a brand decision for DN
// comunicação (docs/known-gaps.md, gap 8).

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
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
if (!pwPath) { console.error('render-brand-rasters: needs playwright with Chromium'); process.exit(2); }
const pw = await import(pathToFileURL(pwPath).href);
const chromium = pw.chromium ?? pw.default.chromium;

const tokens = JSON.parse(readFileSync(join(ROOT, 'dist/tokens.json'), 'utf8')).modes.light;
const purple = tokens['--rse-brand-purple-dark'];
const wordmark = readFileSync(join(ROOT, 'assets/logos/wordmark-white.svg'), 'utf8');

// The wordmark's width, as a share of the canvas width. 38 % reproduces the earlier raster's
// composition exactly, with clearspace well beyond X (the stem of the E) on every side.
const OG = { width: 1200, height: 630, markShare: 0.38 };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: OG.width, height: OG.height }, deviceScaleFactor: 1 });
await page.setContent(`<!doctype html><html><head><style>
  html, body { margin: 0; width: ${OG.width}px; height: ${OG.height}px; background: ${purple}; }
  body { display: grid; place-items: center; }
  .mark { width: ${Math.round(OG.width * OG.markShare)}px; }
  .mark svg { display: block; width: 100%; height: auto; }
</style></head><body><div class="mark">${wordmark.replace(/<\?xml[^>]*>/, '')}</div></body></html>`);
const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: OG.width, height: OG.height } });
writeFileSync(join(ROOT, 'assets/og-image.png'), png);
await browser.close();
console.log(`wrote assets/og-image.png (${OG.width}×${OG.height}, wordmark-white.svg on ${purple})`);
