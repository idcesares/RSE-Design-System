// Unit tests for the motif engine. Run: node --test scripts/test-motif-engine.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadMotifEngine } from './lib/load-motif-engine.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const engine = await loadMotifEngine();
const palette = JSON.parse(readFileSync(join(HERE, '..', 'tokens', 'src', 'brand.tokens.json'), 'utf8')).rse.brand;
const hex = (name) => palette[name].$value.toLowerCase();
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

test('motifRamp returns 3 palette hexes per hue and null for unknown', () => {
  assert.equal(typeof engine.motifRamp, 'function');
  for (const hue of engine.motifHues) {
    const ramp = engine.motifRamp(hue, 3);
    assert.equal(ramp.length, 3, hue);
    for (const c of ramp) assert.match(c, /^#[0-9a-f]{6}$/, hue);
  }
  for (const hue of ['green', 'blue', 'pink', 'purple', 'orange', 'yellow']) {
    const light = hex(`${hue}-light`), base = hex(hue), dark = hex(`${hue}-dark`);
    assert.deepEqual(engine.motifRamp(hue, 3), [light, base, dark], hue);
    assert.deepEqual(engine.motifRamp(hue, 2), [light, dark], hue);
    assert.deepEqual(engine.motifRamp(hue, 1), [base], hue);
  }
  assert.equal(engine.motifRamp('chartreuse', 3), null);
  assert.equal(engine.motifRamp(undefined, 3), null);
});

test('motifRamp is lightest first by luminance for all six hues', () => {
  assert.equal(engine.motifHues.length, 6);
  for (const hue of engine.motifHues) {
    const [a, b, c] = engine.motifRamp(hue, 3).map(luminance);
    assert.ok(a > b && b > c, `${hue}: ${a} > ${b} > ${c}`);
  }
});

test('BrandMotif output unchanged', () => {
  const snapshot = JSON.parse(readFileSync(join(HERE, 'fixtures', 'brandmotif-snapshot.json'), 'utf8'));
  assert.deepEqual(Object.keys(snapshot), engine.motifVariants);
  for (const variant of engine.motifVariants) {
    const actual = {
      default: engine.BrandMotif({ variant }),
      purple: engine.BrandMotif({ variant, hue: 'purple' }),
    };
    assert.deepEqual(JSON.parse(JSON.stringify(actual)), snapshot[variant], variant);
  }
});

// ─── Engine core (components/brand/MotifEngine.jsx) ─────────────────────────
const HUES6 = ['green', 'blue', 'pink', 'purple', 'orange', 'yellow'];
const close = (a, b, eps = 0.011) => Math.abs(a - b) <= eps;
// A small hand-built crossing: bar 0 (along x) and bar 1 (along y) overlap on screen.
const crossShape = (crossings) => engine.makeMotifShape('test-cross', [
  engine.motifBar('x', [0, 0, 0], 4),
  engine.motifBar('y', [2, -2, 0], 4),
], crossings);
const centroid = (pts) => pts.reduce(([sx, sy], [x, y]) => [sx + x / pts.length, sy + y / pts.length], [0, 0]);

test('isoPoint maps lattice axes to 90 and ±30 degrees', () => {
  assert.deepEqual(engine.isoPoint([0, 0, 0]), [0, 0]);
  const up = engine.isoPoint([0, 0, 1]);
  assert.equal(up[0], 0);
  assert.ok(up[1] < 0 && close(up[1], -1), `z is straight up: ${up}`);
  const x = engine.isoPoint([1, 0, 0]);
  const y = engine.isoPoint([0, 1, 0]);
  const tan30 = Math.tan(Math.PI / 6);
  assert.ok(close(x[1] / x[0], tan30), `x at +30°: ${x}`);
  assert.ok(close(y[1] / y[0], -tan30), `y at −30°: ${y}`);
  for (const [px, py] of [up, x, y]) assert.ok(close(Math.hypot(px, py), 1), 'unit length');
  for (const v of [...x, ...y]) assert.equal(v, Math.round(v * 100) / 100, 'rounded to 2 decimals');
});

test('every face vertex is on the lattice', () => {
  const lattice = [];
  for (let a = -2; a <= 4; a++) for (let b = -2; b <= 4; b++) for (let c = -2; c <= 4; c++) lattice.push(engine.isoPoint([a, b, c]));
  const onLattice = ([px, py]) => lattice.some(([lx, ly]) => lx === px && ly === py);
  for (const part of [engine.motifCube([0, 0, 0]), engine.motifCube([1, -1, 0], 2), engine.motifBar('z', [0, 0, 0], 3)]) {
    const faces = engine.motifFaces(engine.makeMotifShape('t', [part]));
    assert.equal(faces.length, 3);
    assert.deepEqual(faces.map((f) => f.role).sort(), ['left', 'right', 'top']);
    for (const f of faces) for (const p of f.points) assert.ok(onLattice(p), `${f.role} vertex ${p} is off the lattice`);
  }
  // A split bar stays on the lattice too.
  for (const f of engine.motifFaces(crossShape([{ over: 0, under: 1, overAt: 'end' }]))) {
    for (const p of f.points) assert.ok(onLattice(p), `crossing vertex ${p} is off the lattice`);
  }
});

test('top > left > right luminance for all six hues', () => {
  const shape = engine.makeMotifShape('cube', [engine.motifCube([0, 0, 0])]);
  for (const hue of HUES6) {
    const [piece] = engine.motifPieces(shape, hue);
    const fill = Object.fromEntries(piece.faces.map((f) => [f.role, f.fill]));
    const ramp = engine.motifRamp(hue, 3);
    assert.deepEqual([fill.top, fill.left, fill.right], ramp, hue);
    assert.ok(luminance(fill.top) > luminance(fill.left) && luminance(fill.left) > luminance(fill.right), hue);
  }
});

test('motifToSvg uses only ramp colours', () => {
  for (const hue of HUES6) {
    const svg = engine.motifToSvg(crossShape([{ over: 0, under: 1, overAt: 'start' }]), { hue });
    const ramp = engine.motifRamp(hue, 3);
    const fills = [...svg.matchAll(/fill="([^"]*)"/g)].map((m) => m[1]);
    assert.ok(fills.length > 0, hue);
    for (const f of fills) assert.ok(ramp.includes(f), `${hue}: ${f} not in ramp`);
    assert.doesNotMatch(svg, /gradient|url\(|filter/i, hue);
    assert.equal((svg.match(/#[0-9a-f]{3,8}\b/gi) || []).length, fills.length, `${hue}: colour outside a fill`);
  }
});

test('motifToSvg output shape: viewBox, size, pieces, a11y', () => {
  const shape = engine.makeMotifShape('cube', [engine.motifCube([0, 0, 0])]);
  const svg = engine.motifToSvg(shape, { hue: 'purple' });
  assert.match(svg, /^<svg [^>]*viewBox="-0\.87 -1 1\.74 2"/);
  assert.match(svg, /width="240" height="240"/);
  assert.match(svg, /aria-hidden="true"/);
  assert.doesNotMatch(svg, /role="img"|<title>/);
  assert.match(svg, /<g class="rse-motif__piece" style="--i:0;--ax:0;--ay:-1">/);
  assert.equal((svg.match(/<polygon /g) || []).length, 3);
  assert.match(svg, /<\/svg>$/);

  const titled = engine.motifToSvg(shape, { hue: 'purple', size: 48, title: 'Cubo <A & "B">' });
  assert.match(titled, /width="48" height="48"/);
  assert.match(titled, /role="img"/);
  assert.doesNotMatch(titled, /aria-hidden/);
  assert.match(titled, /<title>Cubo &lt;A &amp; &quot;B&quot;&gt;<\/title>/);

  const pieces = engine.motifToSvg(crossShape(), { hue: 'blue' }).match(/class="rse-motif__piece"/g);
  assert.equal(pieces.length, 2);
  assert.match(engine.motifToSvg(crossShape(), { hue: 'blue' }), /style="--i:0;--ax:0\.87;--ay:0\.5"/);
});

test('a declared crossing flips layer order at one end only', () => {
  // No crossing: one layer, and each part is a single piece.
  const plain = engine.motifFaces(crossShape());
  assert.deepEqual([...new Set(plain.map((f) => f.layer))], [0]);

  for (const overAt of ['start', 'end']) {
    const faces = engine.motifFaces(crossShape([{ over: 0, under: 1, overAt }]));
    const under = faces.filter((f) => f.piece === 1);
    const over = faces.filter((f) => f.piece === 0);
    const underLayers = [...new Set(under.map((f) => f.layer))];
    assert.equal(underLayers.length, 1, 'the under part is not split');
    const ax = engine.isoPoint([1, 0, 0]);
    const along = (f) => { const [cx, cy] = centroid(f.points); return cx * ax[0] + cy * ax[1]; };
    const mid = (along(over.reduce((a, b) => (along(a) < along(b) ? a : b))) + along(over.reduce((a, b) => (along(a) > along(b) ? a : b)))) / 2;
    const atStart = over.filter((f) => along(f) < mid);
    const atEnd = over.filter((f) => along(f) > mid);
    assert.ok(atStart.length && atEnd.length, overAt);
    const front = overAt === 'end' ? atEnd : atStart;
    const back = overAt === 'end' ? atStart : atEnd;
    for (const f of front) assert.ok(f.layer > underLayers[0], `${overAt}: front half above under`);
    for (const f of back) assert.ok(f.layer < underLayers[0], `${overAt}: back half below under`);
    // Paint order: back half, then under, then front half.
    const lastBack = Math.max(...back.map((f) => faces.indexOf(f)));
    const firstFront = Math.min(...front.map((f) => faces.indexOf(f)));
    for (const f of under) assert.ok(faces.indexOf(f) > lastBack && faces.indexOf(f) < firstFront, overAt);
    // The split leaves no cap face at the seam: one top, one left, at most one right per half.
    assert.ok(over.length <= 6, `${overAt}: ${over.length} faces on the split bar`);
  }
});

test('makeMotifShape rejects bad crossings', () => {
  const parts = [engine.motifBar('x', [0, 0, 0], 4), engine.motifBar('y', [2, -2, 0], 4)];
  assert.throws(() => engine.makeMotifShape('t', parts, [{ over: 0, under: 0, overAt: 'end' }]));
  assert.throws(() => engine.makeMotifShape('t', parts, [{ over: 0, under: 5, overAt: 'end' }]));
  assert.throws(() => engine.makeMotifShape('t', parts, [{ over: 0, under: 1, overAt: 'middle' }]));
  assert.throws(() => engine.makeMotifShape('t', [engine.motifBar('x', [0, 0, 0], 1), parts[1]], [{ over: 0, under: 1, overAt: 'end' }]));
});

test('motifToSvg is deterministic', () => {
  const a = engine.motifToSvg(crossShape([{ over: 0, under: 1, overAt: 'end' }]), { hue: 'orange', size: 96 });
  const b = engine.motifToSvg(crossShape([{ over: 0, under: 1, overAt: 'end' }]), { hue: 'orange', size: 96 });
  assert.equal(a, b);
  for (const m of a.matchAll(/-?\d+\.\d+/g)) assert.ok(m[0].split('.')[1].length <= 2, `${m[0]} has more than 2 decimals`);
  assert.deepEqual(engine.motifPieces(crossShape(), 'pink'), engine.motifPieces(crossShape(), 'pink'));
});

test('unknown hue returns \'\'', () => {
  assert.equal(engine.motifToSvg(crossShape(), { hue: 'chartreuse' }), '');
  assert.equal(engine.motifToSvg(crossShape(), {}), '');
});

test('motifPieces unknown hue returns null', () => {
  assert.equal(engine.motifPieces(crossShape(), 'chartreuse'), null);
  assert.equal(engine.motifPieces(crossShape(), undefined), null);
});
