// Unit tests for motion.js, the data-rse-motion setting (full | reduced).
// motion.js is a classic IIFE, so it is loaded with new Function and a fake window.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const src = readFileSync(fileURLToPath(new URL('../motion.js', import.meta.url)), 'utf8');

function makeWindow({ reduce = false, stored = null, throwStorage = false } = {}) {
  const store = new Map();
  if (stored !== null) store.set('rse-motion', stored);
  const attrs = {};
  const win = {
    document: { documentElement: { setAttribute: (k, v) => { attrs[k] = v; }, getAttribute: (k) => (k in attrs ? attrs[k] : null) } },
    matchMedia: (q) => ({ matches: reduce && q === '(prefers-reduced-motion: reduce)' }),
    localStorage: throwStorage
      ? { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } }
      : { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => { store.set(k, v); } },
  };
  new Function('window', src)(win);
  return { win, attrs, store };
}

test("init() returns 'reduced' when matchMedia reduces and nothing stored", () => {
  const { win, attrs } = makeWindow({ reduce: true });
  assert.equal(win.RSE.motion.init(), 'reduced');
  assert.equal(attrs['data-rse-motion'], 'reduced');
});

test("init() returns 'full' with no preference", () => {
  const { win, attrs } = makeWindow();
  assert.equal(win.RSE.motion.init(), 'full');
  assert.equal(attrs['data-rse-motion'], 'full');
});

test("stored 'full' beats an OS reduce", () => {
  const { win } = makeWindow({ reduce: true, stored: 'full' });
  assert.equal(win.RSE.motion.init(), 'full');
  assert.equal(win.RSE.motion.get(), 'full');
});

test("set('reduced') writes localStorage and the html attribute", () => {
  const { win, attrs, store } = makeWindow();
  win.RSE.motion.set('reduced');
  assert.equal(store.get('rse-motion'), 'reduced');
  assert.equal(attrs['data-rse-motion'], 'reduced');
  assert.equal(win.RSE.motion.get(), 'reduced');
});

test('init() does not throw and returns the OS value when localStorage throws', () => {
  const a = makeWindow({ reduce: true, throwStorage: true });
  assert.equal(a.win.RSE.motion.init(), 'reduced');
  const b = makeWindow({ throwStorage: true });
  assert.equal(b.win.RSE.motion.init(), 'full');
  assert.doesNotThrow(() => b.win.RSE.motion.set('reduced'));
});

test('importing with window undefined does not throw', () => {
  assert.doesNotThrow(() => new Function('window', src)(undefined));
});
