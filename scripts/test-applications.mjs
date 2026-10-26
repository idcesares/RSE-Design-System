#!/usr/bin/env node
// Reference applications: actual filters, local dependencies, slide geometry and print output.
// Optional --update-previews refreshes the four manifest thumbnails after visual review.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let pwPath;
try { pwPath = require.resolve('playwright'); } catch {
  try { pwPath = require.resolve('playwright', { paths: [execSync('npm root -g').toString().trim()] }); } catch {}
}
if (!pwPath) throw new Error('test-applications: needs the same Playwright setup as test:pages');
const pw = await import(pathToFileURL(pwPath).href);
const chromium = pw.chromium ?? pw.default.chromium;
const update = process.argv.includes('--update-previews');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  const file = join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if ((!file.startsWith(ROOT + '/') && !file.startsWith(ROOT + '\\')) || !existsSync(file) || !statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
  res.end(readFileSync(file));
});
await new Promise(resolve => server.listen(0, resolve));
let browser;
try {
  browser = await chromium.launch();
  const origin = `http://localhost:${server.address().port}`;
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  // image-slot intentionally probes an optional, gitignored persistence sidecar.
  const optionalState = url => url.endsWith('/.image-slots.state.json');
  page.on('response', response => { if (response.status() >= 400 && !optionalState(response.url())) failures.push(`${response.status()}: ${response.url()}`); });
  page.on('console', message => { if (message.type() === 'error' && !optionalState(message.location().url)) failures.push(message.text()); });
  await page.route('**/*', route => {
    if (route.request().url().startsWith(origin + '/') || /^(data:|blob:)/.test(route.request().url())) return route.continue();
    failures.push('External dependency: ' + route.request().url());
    return route.abort();
  });
  const open = async (path) => {
    await page.goto(origin + '/' + path);
    await page.evaluate(() => window.RSE_TEMPLATE_BOOTSTRAP);
    await page.waitForSelector('#dc-root');
    await page.evaluate(() => document.fonts.ready);
    assert.deepEqual(await page.evaluate(() => RSE.__errors || []), []);
  };

  await open('templates/landing-page/LandingPage.dc.html');
  await page.waitForSelector('#programas .rse-card');
  assert.equal(await page.locator('#programas .rse-card').count(), 3);
  const logos = await page.evaluate(() => {
    const header = document.querySelector('.rse-navbar');
    const visible = () => [...header.querySelectorAll('img')].filter(el => getComputedStyle(el).display !== 'none').map(el => el.src);
    const light = visible();
    document.documentElement.setAttribute('data-rse-theme', 'dark');
    const dark = visible();
    header.setAttribute('data-rse-theme', 'light');
    const nestedLight = visible();
    header.removeAttribute('data-rse-theme'); document.documentElement.removeAttribute('data-rse-theme');
    return { light, dark, nestedLight, width: header.querySelector('.rse-navbar__logo--light').getBoundingClientRect().width };
  });
  assert.ok(logos.light[0].endsWith('wordmark-purple.svg') && logos.light.length === 1);
  assert.ok(logos.dark[0].endsWith('wordmark-white.svg') && logos.dark.length === 1);
  assert.deepEqual(logos.nestedLight, logos.light);
  assert.ok(logos.width >= 150);
  assert.ok(await page.locator('#programas .rse-card').evaluateAll(cards => cards.every(card => card.querySelector('.rse-card__description').getBoundingClientRect().bottom <= card.getBoundingClientRect().bottom)));
  await page.getByRole('tab', { name: 'Infantil', exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll('#programas .rse-card').length === 1);
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator(':focus').textContent(), 'Fundamental');
  await page.getByRole('tab', { name: 'Todos', exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll('#programas .rse-card').length === 3);
  for (const width of [360, 834, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `campaign overflow at ${width}px`);
  }
  if (update) { await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: join(ROOT, 'templates/landing-page/.thumbnail'), type: 'png' }); }
  console.log('ok   campaign programs actually filter; tabs support keyboard navigation');

  await open('templates/program-page/ProgramPage.dc.html');
  const rows = page.locator('#turmas tbody tr');
  await page.waitForSelector('#turmas tbody tr');
  assert.equal(await rows.count(), 4);
  await page.getByRole('button', { name: /^Tarde/ }).click();
  await page.waitForFunction(() => document.querySelectorAll('#turmas tbody tr').length === 1);
  assert.match(await rows.first().textContent(), /Tarde/);
  await page.getByRole('button', { name: 'Limpar', exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll('#turmas tbody tr').length === 4);
  assert.equal(await page.getByRole('button', { name: 'Acessar o portal TOTVS', exact: true }).isDisabled(), true);
  for (const width of [360, 834, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `program overflow at ${width}px`);
  }
  if (update) { await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: join(ROOT, 'templates/program-page/.thumbnail'), type: 'png' }); }
  console.log('ok   program turns filter real rows; unconfigured enrollment does not pretend to submit');

  await open('templates/institutional-deck/InstitutionalDeck.dc.html');
  await page.waitForFunction(() => document.querySelectorAll('deck-stage > .reference-slide').length === 10);
  await page.waitForSelector('.reference-slide[data-deck-active]');
  for (let index = 0; index < 10; index++) {
    await page.evaluate(index => document.querySelector('deck-stage').goTo(index), index);
    const result = await page.evaluate(index => {
      const slide = document.querySelectorAll('deck-stage > .reference-slide')[index];
      const box = slide.getBoundingClientRect();
      const overflow = [...slide.querySelectorAll('h1,h2,h3,p,footer')].filter(el => {
        const r = el.getBoundingClientRect();
        return r.width && r.height && (r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1);
      }).map(el => el.textContent.trim());
      const style = getComputedStyle(slide);
      return { overflow, words: slide.innerText.trim().split(/\s+/).length,
        width: parseFloat(style.width), height: parseFloat(style.height),
        motifs: slide.querySelectorAll('.reference-slide__motif').length };
    }, index);
    assert.deepEqual(result.overflow, [], `slide ${index + 1}: text outside canvas`);
    assert.ok(result.words <= 40, `slide ${index + 1}: ${result.words} words`);
    assert.equal(result.width, 1920); assert.equal(result.height, 1080);
    assert.ok(result.motifs <= 1);
  }
  await page.evaluate(() => document.querySelector('deck-stage').goTo(0));
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.querySelectorAll('deck-stage > .reference-slide')[1].hasAttribute('data-deck-active'));
  const deckPdf = await page.pdf({ printBackground: true, preferCSSPageSize: true });
  assert.equal((deckPdf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length, 10, 'one PDF page per slide');
  if (update) { await page.evaluate(() => document.querySelector('deck-stage').goTo(0)); await page.locator('.reference-slide[data-deck-active]').screenshot({ path: join(ROOT, 'templates/institutional-deck/.thumbnail'), type: 'png' }); }
  console.log('ok   ten editorial slides: word limits, canvas bounds, keyboard navigation and ten-page print output');

  await open('templates/enrollment-form/EnrollmentForm.dc.html');
  await page.waitForFunction(() => document.querySelector('doc-page')?.shadowRoot?.querySelector('.sheet'));
  const paper = await page.evaluate(() => [...document.querySelectorAll('.enrollment-sheet')].map(el => ({
    clipped: el.scrollHeight > el.clientHeight + 1,
    writingAreas: [...el.querySelectorAll('.print-field__line')].every(line => line.getBoundingClientRect().height >= 20),
  })));
  assert.equal(paper.length, 2);
  assert.ok(paper.every(p => !p.clipped && p.writingAreas));
  const formPdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
  assert.equal((formPdf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length, 2, 'two printed A4 sheets');
  if (update) await page.locator('.enrollment-sheet').first().screenshot({ path: join(ROOT, 'templates/enrollment-form/.thumbnail'), type: 'png' });
  assert.deepEqual(failures, []);
  console.log('ok   two A4 sheets: no clipping, usable writing areas, two-page print output; all apps use local dependencies');
  console.log('test-applications: ok' + (update ? ' (previews refreshed)' : ''));
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
