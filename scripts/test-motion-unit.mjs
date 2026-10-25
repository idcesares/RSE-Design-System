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

// ─── reveal and bindPause ───────────────────────────────────────────────────
// A tiny fake DOM: elements with attributes, classes, a parent chain and the few methods motion.js uses.
function el(cls, attrs = {}, parent = null) {
  const a = { ...attrs };
  const classes = new Set(cls.split(' ').filter(Boolean));
  const node = {
    parent,
    attrs: a,
    classes,
    classList: { add: (c) => classes.add(c), contains: (c) => classes.has(c), remove: (c) => classes.delete(c) },
    hasAttribute: (k) => k in a,
    getAttribute: (k) => (k in a ? a[k] : null),
    setAttribute: (k, v) => { a[k] = String(v); },
    removeAttribute: (k) => { delete a[k]; },
    matches: (sel) => sel.split(',').some((s) => {
      const m = s.trim().match(/^\.([\w-]+)(?:\[([\w-]+)="([^"]*)"\])?$/);
      return !!m && classes.has(m[1]) && (!m[2] || a[m[2]] === m[3]);
    }),
    closest(sel) { for (let n = this; n; n = n.parent) if (n.matches(sel)) return n; return null; },
    querySelectorAll: () => [],
  };
  return node;
}

function makeDom({ io = false } = {}) {
  const listeners = [];
  const patterns = [];
  const document = {
    addEventListener: (type, fn) => listeners.push({ type, fn }),
    querySelectorAll: () => patterns,
    documentElement: { setAttribute() {}, getAttribute: () => null },
  };
  const observers = [];
  const win = {
    document,
    matchMedia: () => ({ matches: false }),
    localStorage: { getItem: () => null, setItem() {} },
  };
  if (io) {
    win.IntersectionObserver = function (cb) {
      const o = { cb, observed: [], unobserved: [], observe(t) { o.observed.push(t); }, unobserve(t) { o.unobserved.push(t); }, disconnect() {} };
      observers.push(o);
      return o;
    };
  }
  new Function('window', src)(win);
  const click = (target) => { for (const l of listeners.filter((x) => x.type === 'click')) l.fn({ target }); };
  return { win, document, patterns, observers, listeners, click };
}

test('reveal marks ready + visible via a fake IntersectionObserver, once', () => {
  const dom = makeDom({ io: true });
  const p = el('rse-motif-pattern', { 'data-animate': 'reveal' });
  const other = el('rse-motif-pattern', { 'data-animate': 'ambient' });
  dom.patterns.push(p);
  dom.win.RSE.motion.reveal();
  assert.equal(p.hasAttribute('data-reveal-ready'), true);
  assert.equal(p.classList.contains('is-visible'), false);
  assert.equal(dom.observers.length, 1);
  assert.deepEqual(dom.observers[0].observed, [p]);
  assert.equal(other.hasAttribute('data-reveal-ready'), false);
  // Not intersecting yet: still waiting.
  dom.observers[0].cb([{ target: p, isIntersecting: false }]);
  assert.equal(p.classList.contains('is-visible'), false);
  dom.observers[0].cb([{ target: p, isIntersecting: true }]);
  assert.equal(p.classList.contains('is-visible'), true);
  assert.deepEqual(dom.observers[0].unobserved, [p]);
  // A second call does not observe it again.
  dom.win.RSE.motion.reveal();
  assert.equal(dom.observers.reduce((n, o) => n + o.observed.length, 0), 1);
});

test('reveal accepts the pattern element itself as root', () => {
  const dom = makeDom({ io: true });
  const p = el('rse-motif-pattern', { 'data-animate': 'reveal' });
  dom.win.RSE.motion.reveal(p);
  assert.equal(p.hasAttribute('data-reveal-ready'), true);
});

test('reveal never hides without IntersectionObserver, and does not throw without a document', () => {
  const dom = makeDom({ io: false });
  const p = el('rse-motif-pattern', { 'data-animate': 'reveal' });
  dom.patterns.push(p);
  dom.win.RSE.motion.reveal();
  assert.equal(p.hasAttribute('data-reveal-ready'), false);
  assert.equal(p.classList.contains('is-visible'), false);
  const bare = { RSE: undefined };
  new Function('window', src)(bare);
  assert.doesNotThrow(() => bare.RSE.motion.reveal());
  assert.doesNotThrow(() => bare.RSE.motion.bindPause());
});

test('bindPause toggles once, however many times it is bound', () => {
  const dom = makeDom();
  const pattern = el('rse-motif-pattern rse-motion-managed');
  const art = el('rse-motif-pattern__art', {}, pattern);
  const btn = el('rse-motif-pattern__pause', { 'aria-pressed': 'false', 'aria-label': 'Pausar animação' }, pattern);
  const inner = el('rse-motif-pattern__icon', {}, btn);
  // Auto-bound at load; binding again must not add a second listener.
  assert.equal(dom.listeners.filter((l) => l.type === 'click').length, 1);
  dom.win.RSE.motion.bindPause();
  dom.win.RSE.motion.bindPause();
  assert.equal(dom.listeners.filter((l) => l.type === 'click').length, 1);

  dom.click(inner);
  assert.equal(pattern.hasAttribute('data-paused'), true);
  assert.equal(btn.getAttribute('aria-pressed'), 'true');
  assert.equal(btn.getAttribute('aria-label'), 'Retomar animação');
  dom.click(btn);
  assert.equal(pattern.hasAttribute('data-paused'), false);
  assert.equal(btn.getAttribute('aria-pressed'), 'false');
  assert.equal(btn.getAttribute('aria-label'), 'Pausar animação');
  dom.click(art); // not the button: nothing happens
  assert.equal(pattern.hasAttribute('data-paused'), false);
});

test('bindPause is a no-op without a document', () => {
  const win = {};
  new Function('window', src)(win);
  assert.doesNotThrow(() => win.RSE.motion.bindPause());
});

test('executing motion.js twice against the same window and document adds one listener: one click, one toggle', () => {
  const dom = makeDom();
  new Function('window', src)(dom.win); // second execution, same window and document
  new Function('window', src)(dom.win);
  assert.equal(dom.listeners.filter((l) => l.type === 'click').length, 1);
  const pattern = el('rse-motif-pattern');
  const btn = el('rse-motif-pattern__pause', { 'aria-pressed': 'false' }, pattern);
  dom.click(btn);
  assert.equal(pattern.hasAttribute('data-paused'), true);
  assert.equal(btn.getAttribute('aria-pressed'), 'true');
  dom.click(btn);
  assert.equal(pattern.hasAttribute('data-paused'), false);
});

test('a click already handled is not toggled again, even by a second listener', () => {
  const dom = makeDom();
  const pattern = el('rse-motif-pattern');
  const btn = el('rse-motif-pattern__pause', { 'aria-pressed': 'false' }, pattern);
  const event = { target: btn };
  const handler = dom.listeners.find((l) => l.type === 'click').fn;
  handler(event);
  handler(event);
  assert.equal(pattern.hasAttribute('data-paused'), true);
});

test('loading twice keeps get/set working and keeps the first RSE.motion', () => {
  const { win, attrs } = makeWindow();
  const first = win.RSE.motion;
  win.RSE.motion.set('reduced');
  new Function('window', src)(win);
  assert.equal(win.RSE.motion, first);
  assert.equal(win.RSE.motion.get(), 'reduced');
  win.RSE.motion.set('full');
  assert.equal(win.RSE.motion.get(), 'full');
  assert.equal(attrs['data-rse-motion'], 'full');
});
