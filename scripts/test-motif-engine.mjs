// Unit tests for the motif engine. Run: node --test scripts/test-motif-engine.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
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
// A small hand-built crossing: bar 1 (along y) rests across the top of bar 0 (along x), so plain
// geometry paints bar 1 in front of all of bar 0; a crossing must override that at one end.
const crossShape = (crossings) => engine.makeMotifShape('test-cross', [
  engine.motifBar('x', [0, 0, 0], 4),
  engine.motifBar('y', [2, -2, 1], 4),
], crossings);
// A Penrose-style triangle of bars: A along x, B along y from A's far end, C up from B's far end.
// C's top projects onto A's start, which is the joint an impossible triangle inverts.
const triangle = (crossings) => engine.makeMotifShape('test-triangle', [
  engine.motifBar('x', [0, 0, 0], 5),
  engine.motifBar('y', [4, 1, 0], 4),
  engine.motifBar('z', [4, 4, 1], 3),
], crossings);
const insidePoly = ([px, py], poly) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]; const [xj, yj] = poly[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
// Do two groups of faces cover a common screen point? Sampled on a fine grid, interiors only.
const overlapOnScreen = (a, b) => {
  const pts = [...a, ...b].flatMap((f) => f.points);
  const [x0, x1] = [Math.min(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[0]))];
  const [y0, y1] = [Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[1]))];
  for (let x = x0 + 0.013; x < x1; x += 0.05) for (let y = y0 + 0.017; y < y1; y += 0.05) {
    if (a.some((f) => insidePoly([x, y], f.points)) && b.some((f) => insidePoly([x, y], f.points))) return true;
  }
  return false;
};
// Faces grouped by box: a box is one (piece, layer) pair.
const boxesOf = (faces) => {
  const map = new Map();
  for (const f of faces) map.set(`${f.piece}:${f.layer}`, [...(map.get(`${f.piece}:${f.layer}`) ?? []), f]);
  return [...map.values()].map((fs) => ({ piece: fs[0].piece, layer: fs[0].layer, faces: fs }));
};
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
  // No crossing: each part is one box, and geometry paints bar 1 (on top) after bar 0.
  const plain = boxesOf(engine.motifFaces(crossShape()));
  assert.deepEqual(plain.map((b) => b.piece), [0, 1]);
  assert.ok(plain[0].layer < plain[1].layer);

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
  assert.throws(() => engine.makeMotifShape('t', parts, [{ over: 0, under: 1, overAt: 'end' }, { over: 0, under: 1, overAt: 'start' }]));
});

test('plain geometry paints a near part after the part behind it', () => {
  // A cube directly in front of a long bar's start (+y side) must cover the bar, though the
  // bar's centre is nearer the viewer than the cube's.
  for (const parts of [
    [engine.motifBar('x', [0, 0, 0], 8), engine.motifCube([0, 1, 0])],
    [engine.motifBar('x', [0, 0, 0], 8), engine.motifBar('x', [0, 1, 0], 2)],
    [engine.motifCube([0, 1, 0]), engine.motifBar('x', [0, 0, 0], 8)],
  ]) {
    const near = parts[0].at[1] === 1 ? 0 : 1;
    const boxes = boxesOf(engine.motifFaces(engine.makeMotifShape('t', parts)));
    assert.equal(boxes[1].piece, near, JSON.stringify(parts));
  }
});

test('triangle joints paint by geometry when nothing is declared', () => {
  // A -> B (B sits in front of A's far end), B -> C (C stands on B's far end), A -> C.
  const boxes = boxesOf(engine.motifFaces(triangle()));
  assert.deepEqual(boxes.map((b) => b.piece), [0, 1, 2]);
});

test('a cyclic crossing declaration builds and honours every crossing', () => {
  const crossings = [{ over: 0, under: 1, overAt: 'end' }, { over: 1, under: 2, overAt: 'end' }, { over: 2, under: 0, overAt: 'end' }];
  const shape = triangle(crossings);
  const faces = engine.motifFaces(shape);
  const boxes = boxesOf(faces);
  assert.equal(boxes.length, 6, 'every part is split once');
  for (const c of crossings) {
    const axis = shape.parts[c.over].axis;
    const ax = engine.isoPoint([axis === 'x' ? 1 : 0, axis === 'y' ? 1 : 0, axis === 'z' ? 1 : 0]);
    const along = (b) => { const [cx, cy] = centroid(b.faces.flatMap((f) => f.points)); return cx * ax[0] + cy * ax[1]; };
    const [startHalf, endHalf] = boxes.filter((b) => b.piece === c.over).sort((a, b) => along(a) - along(b));
    const front = c.overAt === 'end' ? endHalf : startHalf;
    const back = c.overAt === 'end' ? startHalf : endHalf;
    let checked = 0;
    for (const u of boxes.filter((b) => b.piece === c.under)) {
      if (overlapOnScreen(front.faces, u.faces)) { assert.ok(u.layer < front.layer, `${JSON.stringify(c)}: front half over under`); checked++; }
      if (overlapOnScreen(back.faces, u.faces)) { assert.ok(back.layer < u.layer, `${JSON.stringify(c)}: back half under under`); checked++; }
    }
    assert.ok(checked > 0, `${JSON.stringify(c)}: the crossing is visible somewhere`);
  }
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

// ─── Shape library (motifShapes) ────────────────────────────────────────────
const SHAPE_NAMES = ['cube', 'triangle', 'stair', 'loop', 'tower', 'twin'];

test('all six shapes exist and render in all six hues', () => {
  assert.deepEqual(engine.motifShapeNames, SHAPE_NAMES);
  assert.deepEqual(Object.keys(engine.motifShapes).sort(), [...SHAPE_NAMES].sort());
  for (const name of SHAPE_NAMES) {
    const shape = engine.motifShapes[name];
    assert.equal(shape.name, name);
    for (const hue of HUES6) {
      const svg = engine.motifToSvg(shape, { hue, size: 96 });
      assert.match(svg, /^<svg [^>]*viewBox="[-\d. ]+"/, `${name}/${hue}`);
      assert.ok((svg.match(/<polygon /g) || []).length >= 3, `${name}/${hue}`);
      const ramp = engine.motifRamp(hue, 3);
      for (const [, f] of svg.matchAll(/fill="([^"]*)"/g)) assert.ok(ramp.includes(f), `${name}/${hue}: ${f}`);
    }
  }
});

test('triangle, stair and loop declare at least one crossing', () => {
  for (const name of ['triangle', 'stair', 'loop']) {
    assert.ok(engine.motifShapes[name].crossings.length >= 1, name);
  }
});

test('piece count per shape is between 3 and 24', () => {
  for (const name of SHAPE_NAMES) {
    const n = engine.motifPieces(engine.motifShapes[name], 'purple').length;
    assert.ok(n >= 3 && n <= 24, `${name}: ${n} pieces`);
  }
});

test('every library shape has all face vertices on the lattice', () => {
  for (const name of SHAPE_NAMES) {
    const shape = engine.motifShapes[name];
    // Integer lattice points spanning the shape's parts (with a margin), projected once.
    const lo = [0, 1, 2].map((k) => Math.min(...shape.parts.map((p) => p.at[k])) - 1);
    const hi = [0, 1, 2].map((k) => Math.max(...shape.parts.map((p) => p.at[k] + p.size[k])) + 1);
    const lattice = new Set();
    for (let a = lo[0]; a <= hi[0]; a++) for (let b = lo[1]; b <= hi[1]; b++) for (let c = lo[2]; c <= hi[2]; c++) {
      lattice.add(engine.isoPoint([a, b, c]).join(','));
    }
    for (const part of shape.parts) for (const v of [...part.at, ...part.size]) assert.ok(Number.isInteger(v), `${name}: part off the lattice`);
    const faces = engine.motifFaces(shape);
    assert.ok(faces.length > 0, name);
    for (const f of faces) for (const p of f.points) assert.ok(lattice.has(p.join(',')), `${name}: ${f.role} vertex ${p} is off the lattice`);
  }
});

test('every library shape renders identically twice in every hue', () => {
  for (const name of SHAPE_NAMES) for (const hue of HUES6) {
    const a = engine.motifToSvg(engine.motifShapes[name], { hue, size: 96 });
    const b = engine.motifToSvg(engine.motifShapes[name], { hue, size: 96 });
    assert.ok(a.length > 0, `${name}/${hue}`);
    assert.equal(a, b, `${name}/${hue}`);
  }
});

// ─── MotifLoader (components/feedback/MotifLoader.jsx) ──────────────────────
// The stub React returns { type, props, children } trees; these helpers read them.
const flat = (children) => children.flat(Infinity).filter((c) => c && typeof c === 'object');
const find = (node, pred, out = []) => {
  if (!node || typeof node !== 'object') return out;
  if (pred(node)) out.push(node);
  for (const c of flat(node.children ?? [])) find(c, pred, out);
  return out;
};
const loaderPieces = (tree) => find(tree, (n) => n.type === 'g' && /rse-motif-loader__piece/.test(n.props.className));
const loaderPolys = (tree) => find(tree, (n) => n.type === 'polygon');

test('renders role=status with the pt-BR label', () => {
  const tree = engine.MotifLoader({});
  assert.equal(tree.type, 'span');
  assert.equal(tree.props.role, 'status');
  assert.equal(tree.props['aria-label'], 'Carregando');
  assert.match(tree.props.className, /\brse-motif-loader\b/);
  assert.match(tree.props.className, /\brse-motion-managed\b/);
  const svg = find(tree, (n) => n.type === 'svg')[0];
  assert.equal(svg.props['aria-hidden'], 'true');
  assert.equal(svg.props.width, 48);
  assert.equal(engine.MotifLoader({ label: 'Carregando matrículas' }).props['aria-label'], 'Carregando matrículas');
  // One piece group per engine piece, each carrying --i/--ax/--ay; --n on the root.
  const pieces = engine.motifPieces(engine.motifShapes.cube, 'purple');
  const groups = loaderPieces(tree);
  assert.equal(groups.length, pieces.length);
  assert.equal(tree.props.style['--n'], pieces.length);
  groups.forEach((g, i) => {
    assert.equal(g.props.style['--i'], i);
    assert.equal(g.props.style['--ax'], pieces[i].axis.x);
    assert.equal(g.props.style['--ay'], pieces[i].axis.y);
  });
  // Fills are the engine's ramp, nothing else.
  const ramp = engine.motifRamp('purple', 3);
  for (const p of loaderPolys(tree)) assert.ok(ramp.includes(p.props.fill), p.props.fill);
});

test('unknown hue and unknown shape return null', () => {
  assert.equal(engine.MotifLoader({ hue: 'chartreuse' }), null);
  assert.equal(engine.MotifLoader({ shape: 'dodecahedron' }), null);
  assert.equal(engine.MotifLoader({ hues: ['green', 'chartreuse'] }), null);
});

test('prototype property names are not shapes or hues: null, never a throw', () => {
  for (const name of ['constructor', 'toString', '__proto__']) {
    assert.equal(engine.MotifLoader({ shape: name }), null, `shape ${name}`);
    assert.equal(engine.MotifLoader({ hue: name }), null, `hue ${name}`);
    assert.equal(engine.MotifLoader({ hues: ['green', name] }), null, `hues ${name}`);
  }
});

test('hues length 1 or 5 falls back to hue', () => {
  const single = engine.MotifLoader({ hue: 'green' });
  for (const hues of [['blue'], ['green', 'blue', 'pink', 'purple', 'orange']]) {
    const t = engine.MotifLoader({ hue: 'green', hues });
    assert.doesNotMatch(t.props.className, /--hues/);
    assert.deepEqual(JSON.parse(JSON.stringify(t)), JSON.parse(JSON.stringify(single)));
  }
  for (const n of [2, 3, 4]) {
    const t = engine.MotifLoader({ hues: ['green', 'blue', 'pink', 'orange'].slice(0, n) });
    assert.match(t.props.className, new RegExp(`rse-motif-loader--hues-${n}\\b`));
    const polys = loaderPolys(t);
    for (const p of polys) {
      for (let k = 0; k < n; k++) assert.match(p.props.style[`--c${k}`], /^#[0-9a-f]{6}$/);
      assert.equal(p.props.style[`--c${n}`], undefined);
    }
    // Each face role takes its colour from the matching ramp step of every hue.
    const ramps = ['green', 'blue', 'pink', 'orange'].slice(0, n).map((h) => engine.motifRamp(h, 3));
    for (const p of polys) {
      const step = ramps[0].indexOf(p.props.style['--c0']);
      assert.ok(step >= 0);
      ramps.forEach((r, k) => assert.equal(p.props.style[`--c${k}`], r[step]));
    }
  }
});

test('size 24 warns once and renders', () => {
  const warn = console.warn;
  const calls = [];
  console.warn = (...a) => calls.push(a);
  try {
    const a = engine.MotifLoader({ size: 24 });
    const b = engine.MotifLoader({ size: 20 });
    assert.ok(a && b);
    assert.equal(find(a, (n) => n.type === 'svg')[0].props.width, 24);
    assert.equal(calls.length, 1);
    engine.MotifLoader({ size: 48 });
    assert.equal(calls.length, 1);
  } finally {
    console.warn = warn;
  }
});

test('server render without window does not throw', () => {
  const saved = { window: globalThis.window, document: globalThis.document };
  delete globalThis.window;
  delete globalThis.document;
  try {
    for (const shape of engine.motifShapeNames) assert.doesNotThrow(() => engine.MotifLoader({ shape }), shape);
  } finally {
    if (saved.window !== undefined) globalThis.window = saved.window;
    if (saved.document !== undefined) globalThis.document = saved.document;
  }
});

// ─── renderMotifPattern (components/brand/MotifEngine.jsx) ──────────────────
// Cell markup: <g class="rse-motif-pattern__cell" style="--d:N"><use href="#rse-motif-pattern-<shape>-<hue>" xlink:href="#…"
// transform="translate(x y) scale(s)"/></g>; geometry lives once per (shape, hue) in <defs>.
const CELL_RE = /<g class="rse-motif-pattern__cell" style="--d:(\d+)"><use href="#rse-motif-pattern-([a-z]+)-([a-z]+)" xlink:href="#rse-motif-pattern-\2-\3" transform="translate\((-?[\d.]+) (-?[\d.]+)\) scale\(([\d.]+)\)"\/><\/g>/g;
const patternCells = (svg) => [...svg.matchAll(CELL_RE)].map((m) => ({
  d: Number(m[1]), shape: m[2], hue: m[3], x: Number(m[4]), y: Number(m[5]), s: Number(m[6]),
}));
const cellCount = (svg) => (svg.match(/class="rse-motif-pattern__cell"/g) ?? []).length;
// FNV-1a, 32 bit, over UTF-16 code units: a stable fingerprint of the whole output string.
const fnv1a = (str) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
};
const rowsOf = (cells) => {
  const map = new Map();
  for (const c of cells) map.set(c.y, [...(map.get(c.y) ?? []), c]);
  return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([, cs]) => cs.sort((a, b) => a.x - b.x));
};
const isValidSvg = (svg) => /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"[^>]*>[\s\S]*<\/svg>$/.test(svg);

test('same options give identical output', () => {
  const opts = { shape: ['triangle', 'cube', 'loop'], width: 800, height: 600, layout: 'brick', fill: 0.6, seed: 7, hues: ['blue', 'pink', 'yellow'], sequence: 'seeded', opacity: 0.3 };
  const a = engine.renderMotifPattern(opts);
  const b = engine.renderMotifPattern({ ...opts });
  assert.ok(a.length > 0);
  assert.equal(a, b);
  // Pinned: any change to the output for these options must be deliberate. Re-pinned from
  // d30fd6ec when xmlns:xlink and xlink:href were added (a regression guard, not a spec).
  assert.equal(fnv1a(a), '077bb18a');
});

test('the pattern svg declares xlink and every use carries both href and xlink:href', () => {
  const svg = engine.renderMotifPattern({ shape: 'cube', width: 400, height: 300, cell: 96, hue: 'blue' });
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/);
  const uses = svg.match(/<use [^>]*>/g) ?? [];
  assert.ok(uses.length > 0);
  for (const u of uses) {
    const h = u.match(/ href="(#[^"]+)"/)?.[1];
    assert.ok(h, u);
    assert.ok(u.includes(` xlink:href="${h}"`), u);
  }
});

test('absurd sizes never produce Infinity or NaN', () => {
  for (const v of [1e306, 1e308, Number.MAX_VALUE, Infinity, '1e999']) {
    const svg = engine.renderMotifPattern({ shape: 'cube', width: v, height: v, cell: v, gap: v });
    assert.ok(!/Infinity|NaN/.test(svg), String(v));
    const smallCell = engine.renderMotifPattern({ shape: 'cube', width: 1e306, height: 1e306, cell: 4 });
    assert.ok(!/Infinity|NaN/.test(smallCell));
  }
});

test('different seeds differ at fill 0.5', () => {
  const opts = { shape: 'cube', width: 960, height: 540, fill: 0.5 };
  const a = engine.renderMotifPattern({ ...opts, seed: 1 });
  const b = engine.renderMotifPattern({ ...opts, seed: 2 });
  assert.notEqual(a, b);
  const total = patternCells(engine.renderMotifPattern({ ...opts, fill: 1 })).length;
  for (const svg of [a, b]) {
    const n = patternCells(svg).length;
    assert.ok(n > total * 0.3 && n < total * 0.7, `${n} of ${total} cells at fill 0.5`);
  }
});

test('fill 0 returns a valid svg with no cells', () => {
  const svg = engine.renderMotifPattern({ shape: 'triangle', width: 400, height: 300, fill: 0 });
  assert.ok(isValidSvg(svg), svg);
  assert.equal(cellCount(svg), 0);
  assert.match(svg, /viewBox="0 0 400 300"/);
  assert.match(svg, /preserveAspectRatio="xMidYMid slice"/);
  assert.match(svg, /aria-hidden="true"/);
  assert.match(svg, /focusable="false"/);
});

test('cell count never exceeds MAX_PATTERN_CELLS (width 4000, height 4000, cell 8)', () => {
  assert.equal(engine.MAX_PATTERN_CELLS, 1500);
  const t0 = performance.now();
  const svg = engine.renderMotifPattern({ shape: 'twin', width: 4000, height: 4000, cell: 8 });
  const ms = performance.now() - t0;
  assert.ok(isValidSvg(svg));
  const n = cellCount(svg);
  assert.ok(n > 0 && n <= engine.MAX_PATTERN_CELLS, `${n} cells`);
  assert.ok(ms < 1000, `${ms} ms`);
  for (const opts of [{ width: 4000, height: 1, cell: 1 }, { width: 1e7, height: 1e7 }, { width: 3000, height: 3000, cell: 1, layout: 'isometric' }]) {
    const out = engine.renderMotifPattern({ shape: 'cube', ...opts });
    assert.ok(isValidSvg(out), JSON.stringify(opts));
    assert.ok(cellCount(out) <= engine.MAX_PATTERN_CELLS, JSON.stringify(opts));
  }
});

test('brick rows are offset by half a cell', () => {
  const svg = engine.renderMotifPattern({ shape: 'cube', width: 480, height: 480, cell: 96, layout: 'brick' });
  const rows = rowsOf(patternCells(svg));
  assert.ok(rows.length >= 4);
  for (let r = 1; r < rows.length; r++) {
    assert.ok(close(rows[r][0].y - rows[r - 1][0].y, 96), `row pitch ${rows[r][0].y - rows[r - 1][0].y}`);
    assert.ok(close(Math.abs(rows[r][0].x - rows[r - 1][0].x), 48), `row ${r} offset ${rows[r][0].x - rows[r - 1][0].x}`);
    for (let c = 1; c < rows[r].length; c++) assert.ok(close(rows[r][c].x - rows[r][c - 1].x, 96));
  }
  // grid rows are not offset
  const grid = rowsOf(patternCells(engine.renderMotifPattern({ shape: 'cube', width: 480, height: 480, cell: 96 })));
  for (let r = 1; r < grid.length; r++) assert.equal(grid[r][0].x, grid[0][0].x);
});

test('isometric layout produces interlocking offsets', () => {
  // Documented lattice: hex radius R = cell / 2; column pitch 2·R·cos30 = cell·cos30, row pitch
  // 1.5·R = 0.75·cell, every other row shifted by R·cos30 = cell·cos30 / 2.
  const cell = 96;
  const cos30 = Math.sqrt(3) / 2;
  const svg = engine.renderMotifPattern({ shape: 'cube', width: 960, height: 540, cell, layout: 'isometric' });
  const rows = rowsOf(patternCells(svg));
  assert.ok(rows.length >= 4);
  for (let r = 1; r < rows.length; r++) {
    assert.ok(close(rows[r][0].y - rows[r - 1][0].y, 0.75 * cell), `row pitch ${rows[r][0].y - rows[r - 1][0].y}`);
    assert.ok(close(Math.abs(rows[r][0].x - rows[r - 1][0].x), (cell * cos30) / 2), `row ${r} offset`);
    for (let c = 1; c < rows[r].length; c++) assert.ok(close(rows[r][c].x - rows[r][c - 1].x, cell * cos30, 0.02));
  }
  // The cube's hexagon spans the full cell height (gap 0), so vertically neighbouring rows overlap
  // by a quarter cell: the hexagons interlock instead of stacking.
  const s = rows[0][0].s;
  assert.ok(close(s * 8, cell, 0.05), `cube height ${s * 8}`);
});

test('hues with sequence "row" cycles hue per row', () => {
  const hues = ['blue', 'green', 'pink'];
  const svg = engine.renderMotifPattern({ shape: 'triangle', width: 600, height: 600, cell: 100, hues, sequence: 'row' });
  const rows = rowsOf(patternCells(svg));
  assert.ok(rows.length >= 6);
  // The first row is the bleed ring above the top edge (row index -1).
  rows.forEach((row, i) => {
    const want = hues[(((i - 1) % 3) + 3) % 3];
    for (const c of row) assert.equal(c.hue, want, `row ${i}`);
  });
  const diag = patternCells(engine.renderMotifPattern({ shape: 'triangle', width: 600, height: 600, cell: 100, hues, sequence: 'diagonal' }));
  for (const c of diag) {
    const col = Math.round((c.x - 50) / 100), row = Math.round((c.y - 50) / 100);
    assert.equal(c.hue, hues[(((col + row) % 3) + 3) % 3], `cell ${col},${row}`);
  }
  // a list of one behaves like hue; an empty list falls back to purple
  assert.equal(
    engine.renderMotifPattern({ shape: 'cube', width: 200, height: 200, hues: ['orange'] }),
    engine.renderMotifPattern({ shape: 'cube', width: 200, height: 200, hue: 'orange' }),
  );
  assert.equal(
    engine.renderMotifPattern({ shape: 'cube', width: 200, height: 200, hues: [] }),
    engine.renderMotifPattern({ shape: 'cube', width: 200, height: 200, hue: 'purple' }),
  );
  assert.equal(
    engine.renderMotifPattern({ shape: 'cube', width: 200, height: 200 }),
    engine.renderMotifPattern({ shape: 'cube', width: 200, height: 200, hue: 'purple' }),
  );
});

test('unknown shape returns \'\'', () => {
  assert.equal(engine.renderMotifPattern({ shape: 'hexagon', width: 400, height: 300 }), '');
  assert.equal(engine.renderMotifPattern({ shape: ['cube', 'hexagon'], width: 400, height: 300 }), '');
  assert.equal(engine.renderMotifPattern({ shape: [], width: 400, height: 300 }), '');
  assert.equal(engine.renderMotifPattern({ width: 400, height: 300 }), '');
  assert.equal(engine.renderMotifPattern({ shape: 'toString', width: 400, height: 300 }), '');
  assert.equal(engine.renderMotifPattern(), '');
});

test('unknown hue returns \'\'', () => {
  assert.equal(engine.renderMotifPattern({ shape: 'cube', width: 400, height: 300, hue: 'chartreuse' }), '');
  assert.equal(engine.renderMotifPattern({ shape: 'cube', width: 400, height: 300, hues: ['blue', 'chartreuse'] }), '');
  assert.equal(engine.renderMotifPattern({ shape: 'cube', width: 400, height: 300, hues: ['chartreuse'] }), '');
});

test('fills come only from ramps', () => {
  const allowed = new Set(HUES6.flatMap((h) => engine.motifRamp(h, 3)));
  const svg = engine.renderMotifPattern({ shape: [...SHAPE_NAMES], width: 1200, height: 800, hues: HUES6, sequence: 'seeded', seed: 3 });
  const fills = [...svg.matchAll(/fill="([^"]*)"/g)].map((m) => m[1]);
  assert.ok(fills.length > 0);
  for (const f of fills) assert.ok(allowed.has(f), f);
  assert.doesNotMatch(svg, /gradient|filter|stroke|style="(?!--d:\d+")/i);
  // every def holds exactly its own hue's ramp
  for (const m of svg.matchAll(/<g id="rse-motif-pattern-([a-z]+)-([a-z]+)">(.*?)<\/g>/g)) {
    const ramp = new Set(engine.motifRamp(m[2], 3));
    for (const f of m[3].matchAll(/fill="([^"]*)"/g)) assert.ok(ramp.has(f[1]), `${m[1]}-${m[2]}: ${f[1]}`);
  }
  // single hue: only that ramp
  const single = engine.renderMotifPattern({ shape: 'stair', width: 600, height: 400, hue: 'green' });
  const green = new Set(engine.motifRamp('green', 3));
  for (const m of single.matchAll(/fill="([^"]*)"/g)) assert.ok(green.has(m[1]), m[1]);
});

test('a list of shapes is chosen deterministically by seed', () => {
  const opts = { shape: ['cube', 'triangle', 'twin'], width: 960, height: 540 };
  const a = patternCells(engine.renderMotifPattern({ ...opts, seed: 5 }));
  const b = patternCells(engine.renderMotifPattern({ ...opts, seed: 5 }));
  const c = patternCells(engine.renderMotifPattern({ ...opts, seed: 6 }));
  assert.deepEqual(a.map((x) => x.shape), b.map((x) => x.shape));
  assert.notDeepEqual(a.map((x) => x.shape), c.map((x) => x.shape));
  assert.deepEqual(new Set(a.map((x) => x.shape)), new Set(opts.shape));
  // one shape geometry per (shape, hue) in defs, never per cell
  const svg = engine.renderMotifPattern({ ...opts, seed: 5 });
  assert.equal((svg.match(/<g id="rse-motif-pattern-/g) ?? []).length, 3);
});

test('no -0, no NaN, no Infinity in output', () => {
  const cases = [
    { shape: 'twin', width: 1920, height: 1080, layout: 'isometric', hues: HUES6, sequence: 'diagonal', gap: 12 },
    { shape: ['loop', 'stair'], width: 333, height: 777, cell: 37, layout: 'brick', fill: 0.4, seed: -3, opacity: 0.25 },
    { shape: 'cube', width: 0, height: 0 },
    { shape: 'cube', width: NaN, height: Infinity, cell: -5, gap: 1e9, fill: NaN, seed: NaN, opacity: -1 },
    { shape: 'tower', width: '640', height: '480', cell: '64', layout: 'nope', sequence: 'nope', hues: ['blue', 'pink'] },
  ];
  for (const opts of cases) {
    const svg = engine.renderMotifPattern(opts);
    assert.ok(isValidSvg(svg), JSON.stringify(opts));
    assert.doesNotMatch(svg, /NaN|Infinity|(?<![\d.])-0(?![\d.])|-0\.0*(?!\d)/, JSON.stringify(opts));
    for (const m of svg.matchAll(/-?\d+\.\d+/g)) assert.ok(m[0].split('.')[1].length <= 2, `${m[0]} has more than 2 decimals`);
  }
});

test('animate none emits no data-animate and reveal/ambient do', () => {
  const base = { shape: 'cube', width: 400, height: 300 };
  const none = engine.renderMotifPattern(base);
  assert.equal(none, engine.renderMotifPattern({ ...base, animate: 'none' }));
  assert.doesNotMatch(none, /data-animate/);
  for (const animate of ['reveal', 'ambient']) {
    const svg = engine.renderMotifPattern({ ...base, animate });
    assert.match(svg, new RegExp(`^<svg [^>]*data-animate="${animate}"`));
    assert.equal((svg.match(/data-animate/g) ?? []).length, 1);
  }
  assert.doesNotMatch(engine.renderMotifPattern({ ...base, animate: 'spin' }), /data-animate/);
  // --d is the stagger step by distance from the top-left: 0 at the corner, growing outward.
  const cells = patternCells(none);
  const at = (x, y) => cells.reduce((best, c) => (Math.hypot(c.x - x, c.y - y) < Math.hypot(best.x - x, best.y - y) ? c : best));
  assert.equal(at(0, 0).d, 0);
  assert.ok(at(400, 300).d > at(200, 150).d);
  assert.ok(cells.every((c) => Number.isInteger(c.d) && c.d >= 0 && c.d < 100));
});

test('opacity applies on the root group', () => {
  assert.match(engine.renderMotifPattern({ shape: 'cube', width: 400, height: 300, opacity: 0.3 }), /<g class="rse-motif-pattern__cells" opacity="0.3">/);
  assert.match(engine.renderMotifPattern({ shape: 'cube', width: 400, height: 300 }), /<g class="rse-motif-pattern__cells">/);
});

test('1920x1080 at cell 96 renders quickly', () => {
  engine.renderMotifPattern({ shape: 'twin', width: 1920, height: 1080 });
  const t0 = performance.now();
  const svg = engine.renderMotifPattern({ shape: [...SHAPE_NAMES], width: 1920, height: 1080, cell: 96, hues: HUES6, sequence: 'seeded' });
  const ms = performance.now() - t0;
  assert.equal(cellCount(svg), 22 * 14);
  assert.ok(ms < 250, `${ms} ms`);
});

// ─── MotifPattern (components/brand/MotifPattern.jsx) ───────────────────────
const patternRoot = (props = {}) => engine.MotifPattern({ shape: 'cube', ...props }, null);
const patternButtons = (tree) => find(tree, (n) => n.type === 'button');

test('renders aria-hidden art and a non-hidden root', () => {
  const tree = patternRoot({ hue: 'green' });
  assert.equal(tree.type, 'div');
  assert.match(tree.props.className, /\brse-motif-pattern\b/);
  assert.match(tree.props.className, /\brse-motion-managed\b/);
  assert.equal(tree.props['aria-hidden'], undefined, 'the root is not hidden (the pause button lives in it)');
  const art = find(tree, (n) => /\brse-motif-pattern__art\b/.test(n.props.className ?? ''));
  assert.equal(art.length, 1);
  assert.equal(art[0].props['aria-hidden'], 'true');
  const html = art[0].props.dangerouslySetInnerHTML.__html;
  assert.match(html, /^<svg /);
  assert.match(html, /rse-motif-pattern__cell/);
  assert.match(html, /viewBox="0 0 1920 1080"/);
  assert.match(html, /preserveAspectRatio="xMidYMid slice"/);
  assert.equal(engine.MotifPattern({ shape: 'cube', width: 640, height: 360, className: 'hero' }, null).props.className.includes('hero'), true);
  assert.match(engine.MotifPattern({ shape: 'cube', width: 640, height: 360 }, null).children.flat(Infinity)[0].props.dangerouslySetInnerHTML.__html, /viewBox="0 0 640 360"/);
});

test('ambient renders exactly one pause button, none/reveal render none', () => {
  const ambient = patternRoot({ animate: 'ambient' });
  const buttons = patternButtons(ambient);
  assert.equal(buttons.length, 1);
  const b = buttons[0];
  assert.equal(b.props.type, 'button');
  assert.match(b.props.className, /\brse-motif-pattern__pause\b/);
  assert.equal(b.props['aria-pressed'], 'false');
  assert.equal(b.props['aria-label'], 'Pausar animação');
  assert.equal(ambient.props['data-animate'], 'ambient');
  // The button is not inside the aria-hidden art.
  const art = find(ambient, (n) => /rse-motif-pattern__art/.test(n.props.className ?? ''))[0];
  assert.equal(find(art, (n) => n.type === 'button').length, 0);
  // Both icon states are in the markup; CSS swaps them on [aria-pressed].
  assert.equal(find(b, (n) => /rse-motif-pattern__icon--pause/.test(n.props.className ?? '')).length, 1);
  assert.equal(find(b, (n) => /rse-motif-pattern__icon--play/.test(n.props.className ?? '')).length, 1);
  for (const animate of [undefined, 'none', 'reveal']) {
    const t = patternRoot({ animate });
    assert.equal(patternButtons(t).length, 0, String(animate));
    assert.equal(t.props['data-animate'], animate === 'reveal' ? 'reveal' : undefined, String(animate));
  }
});

test('the pause click handler stops propagation so the delegated handler never double-toggles', () => {
  const tree = patternRoot({ animate: 'ambient' });
  let stopped = 0;
  patternButtons(tree)[0].props.onClick({ stopPropagation: () => { stopped++; } });
  assert.equal(stopped, 1);
});

test('unknown hue returns null', () => {
  assert.equal(patternRoot({ hue: 'chartreuse' }), null);
  assert.equal(patternRoot({ hues: ['green', 'chartreuse'] }), null);
  assert.equal(engine.MotifPattern({ shape: 'dodecahedron' }, null), null);
  assert.equal(engine.MotifPattern({}, null), null);
});

test('server render without window does not throw', () => {
  assert.equal(typeof globalThis.window, 'undefined');
  assert.equal(typeof globalThis.document, 'undefined');
  assert.doesNotThrow(() => patternRoot({ animate: 'ambient' }));
  assert.doesNotThrow(() => patternRoot({ animate: 'reveal' }));
  // The reveal effect is a no-op without window.RSE.motion.
  engine.React.effects.length = 0;
  patternRoot({ animate: 'reveal' });
  assert.ok(engine.React.effects.length >= 1);
  for (const fx of engine.React.effects) assert.doesNotThrow(() => fx());
});

test('the reveal effect calls RSE.motion.reveal with the root when it exists, and imports nothing from motion.js', () => {
  const src = readFileSync(join(HERE, '..', 'components', 'brand', 'MotifPattern.jsx'), 'utf8');
  assert.match(src, /^'use client';/);
  assert.ok(!/from ['"][^'"]*motion/.test(src));
  assert.match(src, /rse-motion-managed/);
  const seen = [];
  globalThis.window = { RSE: { motion: { reveal: (el) => seen.push(el) } } };
  try {
    engine.React.effects.length = 0;
    patternRoot({ animate: 'reveal' });
    // The stub ref holds null, so the effect has no element yet and must skip rather than reveal the document.
    for (const fx of engine.React.effects) fx();
    assert.deepEqual(seen, []);
  } finally { delete globalThis.window; }
});

// ─── Baked presets (scripts/build-patterns.mjs -> assets/patterns/generated/) ───
const { PRESETS, presetFileName, presetSvgFile } = await import('./lib/pattern-presets.mjs');
const GENERATED = join(HERE, '..', 'assets', 'patterns', 'generated');
const PRESET_NAMES = ['triangle-brick-purple', 'stair-grid-blue', 'loop-isometric-green', 'tower-grid-pink', 'twin-brick-orange', 'cube-isometric-yellow', 'spectrum'];

test('the preset list is exactly the seven agreed names, 1920x1080, static', () => {
  assert.deepEqual(PRESETS.map((p) => p.name), PRESET_NAMES);
  for (const p of PRESETS) {
    assert.equal(p.options.width, 1920, p.name);
    assert.equal(p.options.height, 1080, p.name);
    assert.equal(p.options.animate, 'none', p.name);
  }
  assert.ok(PRESETS.filter((p) => p.options.fill < 1).length >= 2);
});

test('every preset file exists and matches a fresh render', () => {
  for (const p of PRESETS) {
    const file = join(GENERATED, presetFileName(p));
    assert.ok(existsSync(file), `${p.name}: missing ${file}`);
    const disk = readFileSync(file, 'utf8');
    assert.equal(disk, presetSvgFile(engine, p), `${p.name} differs from a fresh render`);
    assert.ok(disk.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<svg '), p.name);
    assert.match(disk, /xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/);
    assert.match(disk, /aria-hidden="true"/);
  }
  const extra = readdirSync(GENERATED).filter((f) => f !== 'README.md' && !PRESETS.some((p) => presetFileName(p) === f));
  assert.deepEqual(extra, []);
});

test('presets have no gradients, no url(, no filter and only ramp colours', () => {
  const ramp = new Set(engine.motifHues.flatMap((h) => engine.motifRamp(h, 3)));
  for (const p of PRESETS) {
    const svg = readFileSync(join(GENERATED, presetFileName(p)), 'utf8');
    assert.ok(!/gradient|url\(|filter|<image|<style|<script/i.test(svg), p.name);
    const fills = [...svg.matchAll(/fill="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(fills.length > 0, p.name);
    for (const f of fills) assert.ok(ramp.has(f), `${p.name}: ${f}`);
  }
});

test('spectrum uses all six hues; single-hue presets use one', () => {
  const fillsOf = (name) => new Set([...readFileSync(join(GENERATED, `${name}.svg`), 'utf8').matchAll(/fill="([^"]+)"/g)].map((m) => m[1]));
  const familyOf = (f) => engine.motifHues.find((h) => engine.motifRamp(h, 3).includes(f));
  const spectrum = new Set([...fillsOf('spectrum')].map(familyOf));
  assert.deepEqual([...spectrum].sort(), [...engine.motifHues].sort());
  assert.equal(engine.motifHues.length, 6);
  for (const name of PRESET_NAMES.slice(0, 6)) {
    assert.deepEqual([...new Set([...fillsOf(name)].map(familyOf))], [name.split('-').pop()], name);
  }
});
