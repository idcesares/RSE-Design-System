#!/usr/bin/env node
// Browser regressions for the CSS-contract migration and showcase keyboard details.
// Uses the same optional Playwright installation as test:pages and test:motion.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { cssContractPath } from './lib/css-contract.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let pwPath;
try { pwPath = require.resolve('playwright'); } catch {
  try { pwPath = require.resolve('playwright', { paths: [execSync('npm root -g').toString().trim()] }); } catch {}
}
if (!pwPath) throw new Error('test-contracts: needs playwright; use the test:pages setup');
const pw = await import(pathToFileURL(pwPath).href);
const chromium = pw.chromium ?? pw.default.chromium;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  if (req.url === '/contracts.html') {
    res.setHeader('Content-Type', 'text/html');
    return res.end('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Contratos de componentes</title><link rel="stylesheet" href="/styles.css"><script src="/assets/vendor/react.production.min.js"></script><script src="/assets/vendor/react-dom.production.min.js"></script><script src="/dist/rse.js"></script></head><body><main id="app"></main></body></html>');
  }
  const path = join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!path.startsWith(ROOT + '/') && !path.startsWith(ROOT + '\\')) { res.writeHead(404); return res.end(); }
  if (!existsSync(path) || !statSync(path).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream');
  res.end(readFileSync(path));
});
await new Promise(resolve => server.listen(0, resolve));
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 360, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const origin = `http://localhost:${server.address().port}`;
  await page.goto(origin + '/contracts.html');
  await page.evaluate(() => { window.testRoot = ReactDOM.createRoot(document.getElementById('app')); });
  const cases = {
    Avatar: { initials: 'RS' }, Divider: {}, Stat: { value: 'Exemplo', label: 'Indicador' },
    ProgressBar: { value: 60 }, Breadcrumb: { items: [{ label: 'Início', href: '#' }, { label: 'Programas' }] },
    Skeleton: {}, Spinner: {}, DataTable: { columns: [{ key: 'name', label: 'Programa', width: '180px' }], rows: [{ name: 'Exemplo' }] },
    Stepper: { steps: ['Dados', 'Revisão'], current: 1 }, Pagination: { page: 1, totalPages: 3 },
    FilterChips: { options: ['Infantil', 'Fundamental'] }, PlatformEntry: {},
    Accordion: { items: [{ title: 'Como participar?', content: 'Consulte a unidade.' }] },
    Menu: { label: 'Programas', items: [{ label: 'Infantil' }, { label: 'Fundamental' }] },
    Toast: { message: 'Dados salvos' }, Tooltip: { label: 'Ajuda' }, Modal: { open: true, title: 'Revisão' }
  };
  for (const [name, props] of Object.entries(cases)) {
    const result = await page.evaluate(({ name, props }) => {
      const h = React.createElement;
      const ref = React.createRef();
      const child = name === 'Tooltip' ? h('button', { type: 'button' }, 'Ajuda') : undefined;
      ReactDOM.flushSync(() => window.testRoot.render(h(RSE[name], { ...props, ref, className: 'test-native-class', 'data-native': name }, child)));
      const node = ref.current;
      return { attached: !!node && node.dataset.native === name && node.classList.contains('test-native-class'),
        // The generated Icon wrapper has its own existing inline SVG layout contract.
        visualInline: [...document.querySelectorAll('#app [style]')].filter(el => !el.matches('svg[viewBox="0 0 24 24"][stroke]')).flatMap(el => [...el.style].filter(property => !property.startsWith('--'))),
        errors: RSE.__errors };
    }, { name, props });
    assert.ok(result.attached, `${name}: ref/native attributes/className`);
    assert.deepEqual(result.visualInline, [], `${name}: CSS owns visual styles`);
    assert.deepEqual(result.errors, []);
  }
  console.log('ok   all 17 migrated wrappers forward refs/native attributes and keep visual styles in CSS');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').getAttribute('role'), 'dialog');
  const cycles = await page.evaluate(() => {
    const h = React.createElement;
    ReactDOM.flushSync(() => testRoot.render(h(React.Fragment, null, h(RSE.Spinner), h(RSE.Skeleton))));
    const duration = () => ['.rse-spinner .rse-motif-loader__piece', '.rse-skeleton__line'].map(selector => getComputedStyle(document.querySelector(selector)).animationDuration);
    document.documentElement.setAttribute('data-rse-motion', 'full');
    const full = duration();
    document.documentElement.setAttribute('data-rse-motion', 'reduced');
    const reduced = duration();
    document.documentElement.setAttribute('data-rse-motion', 'full');
    const compact = document.querySelector('.rse-spinner').classList.contains('rse-motif-loader--inline');
    return { full, reduced, compact };
  });
  assert.deepEqual(cycles.full, ['2.4s', '1.4s']);
  assert.equal(cycles.reduced[0], '4.8s');
  assert.ok(parseFloat(cycles.reduced[1]) <= 0.001);
  assert.ok(cycles.compact);
  console.log('ok   empty dialog retains focus; Spinner uses managed compact motif, Skeleton keeps its safety net');

  await page.evaluate(() => {
    const h = React.createElement;
    window.events = [];
    function App() {
      const [modal, setModal] = React.useState(false);
      return h(React.Fragment, null,
        h(RSE.Menu, { label: 'Programas', items: [{ label: 'Infantil', onSelect: () => events.push('selected') }, { heading: 'Outros programas' }, { label: 'Fundamental' }] }),
        h(RSE.Accordion, { items: [{ title: 'Como participar?', content: h('a', { href: '#next', id: 'closed-link' }, 'Orientações') }] }),
        h(RSE.Tooltip, { label: 'Orientações adicionais' }, h('button', { type: 'button', id: 'tip-trigger', 'aria-describedby': 'existing-description' }, 'Ajuda')),
        h('span', { id: 'existing-description' }, 'Descrição existente'),
        h('button', { type: 'button', id: 'open-modal', onClick: () => setModal(true) }, 'Revisar'),
        h(RSE.Modal, { open: modal, title: 'Revisão', onClose: () => setModal(false), footer: h('button', { id: 'last-modal', type: 'button' }, 'Continuar') }, h('input', { 'aria-label': 'Nome' })),
        h(RSE.Toast, { message: 'Dados salvos', onClose: () => events.push('dismissed') }));
    }
    ReactDOM.flushSync(() => testRoot.render(h(App)));
  });
  const menu = page.locator('.rse-menu__trigger');
  await menu.focus(); await page.keyboard.press('ArrowDown');
  await page.waitForFunction(() => document.activeElement?.getAttribute('role') === 'menuitem');
  assert.equal(await page.locator(':focus').textContent(), 'Infantil');
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator(':focus').textContent(), 'Fundamental');
  await page.keyboard.press('Home'); await page.keyboard.press('Enter');
  assert.deepEqual(await page.evaluate(() => events), ['selected']);
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  await page.keyboard.press('ArrowUp');
  await page.waitForFunction(() => document.activeElement?.textContent === 'Fundamental');
  await page.keyboard.press('Escape');
  assert.ok(await menu.evaluate(el => el === document.activeElement));
  await page.keyboard.press('ArrowDown');
  await page.waitForFunction(() => document.activeElement?.getAttribute('role') === 'menuitem');
  await page.keyboard.press('Tab');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  console.log('ok   menu keyboard navigation skips headings, activates items and returns focus');

  assert.ok(await page.locator('.rse-accordion__panel').evaluate(el => el.inert));
  await page.locator('.rse-accordion__trigger').click();
  assert.equal(await page.locator('.rse-accordion__panel').getAttribute('aria-hidden'), 'false');
  assert.equal(await page.locator('.rse-accordion__panel').evaluate(el => el.inert), false);
  await page.locator('.rse-accordion__trigger').click();
  assert.ok(await page.locator('.rse-accordion__panel').evaluate(el => el.inert));
  console.log('ok   accordion synchronizes expanded state, panel association and inert content');

  await page.locator('#tip-trigger').focus();
  assert.equal(await page.locator('.rse-tooltip__bubble').evaluate(el => getComputedStyle(el).visibility), 'visible');
  assert.match(await page.locator('#tip-trigger').getAttribute('aria-describedby'), /^existing-description rse-tip-/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.rse-tooltip__bubble').evaluate(el => getComputedStyle(el).visibility), 'hidden');
  console.log('ok   tooltip describes the trigger, preserves existing descriptions and dismisses on Escape');

  await page.locator('#open-modal').click();
  await page.waitForFunction(() => document.activeElement?.classList.contains('rse-modal__close'));
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.locator(':focus').getAttribute('id'), 'last-modal');
  await page.keyboard.press('Tab');
  assert.ok(await page.locator('.rse-modal__close').evaluate(el => el === document.activeElement));
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('.rse-modal'));
  assert.equal(await page.locator(':focus').getAttribute('id'), 'open-modal');
  assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
  await page.locator('.rse-toast__close').click();
  assert.deepEqual(await page.evaluate(() => events), ['selected', 'dismissed']);
  console.log('ok   dialog focus trap/return and scroll unlock; toast dismissal');

  const manifest = JSON.parse(readFileSync(join(ROOT, 'rse.manifest.json'), 'utf8'));
  const contracts = manifest.components.filter(c => cssContractPath(ROOT, c.sourcePath));
  assert.equal(contracts.length, 40);
  await page.goto(origin + '/showcase/index.html');
  await page.waitForSelector('#componente-iconbutton .is-contract');
  assert.equal(await page.locator('.sc-demo-tag.is-contract').count(), contracts.length);
  assert.equal(await page.locator('#componente-datefield .is-contract').count(), 1);
  await page.locator('#componente-iconbutton .sc-demo-summary').click();
  const tabs = page.locator('#componente-iconbutton .sc-demo-tabs [role="tab"]');
  await tabs.first().focus(); await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator(':focus').textContent(), 'HTML');
  const panelId = await page.locator(':focus').getAttribute('aria-controls');
  assert.equal(await page.locator(`#${panelId}`).getAttribute('hidden'), null);
  await page.keyboard.press('End'); assert.equal(await page.locator(':focus').textContent(), 'Usar');
  await page.keyboard.press('Home'); assert.equal(await page.locator(':focus').textContent(), 'Props');
  const search = page.getByLabel('Buscar componente', { exact: true });
  await search.fill('BOTAO');
  assert.equal(await page.locator('#componente-button').count(), 1);
  await search.fill('file upload');
  assert.equal(await page.locator('.sc-demo').count(), 1);
  assert.equal(await page.locator('#componente-fileupload').count(), 1);
  await search.fill('tabela dados');
  assert.equal(await page.locator('#componente-datatable').count(), 1);
  await search.fill('');
  await page.getByLabel('Grupo', { exact: true }).selectOption('feedback');
  assert.equal(await page.locator('.sc-demo').count(), 7);
  await search.fill('zzzz-no-results');
  assert.equal(await page.locator('.sc-gallery-empty').count(), 1);
  await page.locator('.sc-gallery-reset').click();
  assert.equal(await page.locator('.sc-demo').count(), manifest.components.length);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForFunction(() => [...document.querySelectorAll('.sc-demo')].every(el => el.style.gridRowEnd.startsWith('span ')));
  // Read actual browser geometry: no overlaps, no stretched short card, and DOM/visual order agree.
  const layout = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.sc-demo')].map(el => ({ id: el.id, box: el.getBoundingClientRect().toJSON() }));
    return {
      ordered: cards.every((card, i) => !i || card.box.top >= cards[i - 1].box.top - 1),
      overlaps: cards.some((a, i) => cards.slice(i + 1).some(b => a.box.left < b.box.right - 1 && a.box.right > b.box.left + 1 && a.box.top < b.box.bottom - 1 && a.box.bottom > b.box.top + 1)),
      divider: cards.find(c => c.id === 'componente-divider').box.height,
      upload: cards.find(c => c.id === 'componente-fileupload').box.height,
    };
  });
  assert.ok(layout.ordered);
  assert.equal(layout.overlaps, false);
  assert.ok(layout.divider < layout.upload);
  console.log('ok   bilingual search, group/reset/empty state and variable-height grid without overlaps or reordering');
  assert.deepEqual(errors, []);
  console.log('ok   shared contract coverage and gallery keyboard/panel associations');

  // Layout-bearing components respond to their own width (container queries), not the viewport:
  // on a wide screen, a Navbar and a Footer in a narrow region take their narrow layout, and the
  // same components at full width take the wide one.
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(origin + '/contracts.html');
  const widths = await page.evaluate(async () => {
    const h = React.createElement;
    const nav = { links: [{ label: 'Programas', href: '#a' }, { label: 'Unidades', href: '#b' }], ctaLabel: 'Matrícula', ctaHref: '#c', logoSrc: '/assets/logos/wordmark-purple.svg', logoAlt: 'Rede Sesc de Educação' };
    const foot = { logoSrc: '/assets/logos/wordmark-white.svg', logoAlt: 'Rede Sesc de Educação', tagline: 'Aprender para a vida acontecer.', columns: [{ title: 'Rede', links: [{ label: 'Programas', href: '#a' }] }] };
    const region = (id, width) => h('div', { id, style: { width } }, h(RSE.Navbar, nav), h(RSE.Footer, foot));
    ReactDOM.createRoot(document.getElementById('app')).render(h('div', null, region('narrow', '420px'), region('wide', '100%')));
    await new Promise(r => setTimeout(r, 200));
    const measure = (id) => {
      const root = document.getElementById(id);
      const logo = root.querySelector('.rse-navbar__logo').getBoundingClientRect();
      const links = root.querySelector('.rse-navbar__links').getBoundingClientRect();
      const cols = getComputedStyle(root.querySelector('.rse-footer__inner')).gridTemplateColumns.split(' ').length;
      return { linksBelowLogo: links.top >= logo.bottom, footerColumns: cols };
    };
    return { narrow: measure('narrow'), wide: measure('wide') };
  });
  assert.deepEqual(widths.narrow, { linksBelowLogo: true, footerColumns: 1 }, 'narrow region: navbar links wrap below the logo, footer stacks');
  assert.deepEqual(widths.wide, { linksBelowLogo: false, footerColumns: 2 }, 'full width: navbar on one row, footer brand beside the links');
  console.log('ok   Navbar and Footer follow their container width, not the viewport');
  console.log('test-contracts: ok');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
