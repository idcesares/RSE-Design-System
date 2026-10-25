// Motif engine: builds impossible isometric shapes from the parts the official cubo impossível is
// made of, and renders them as flat-filled SVG in any of the six palette families.
//
// A pure-function library, not a React component: no JSX, no React, no hooks. It is registered in
// rse.manifest.json only so build-bundle copies it onto window.RSE; MotifLoader and MotifPattern
// build on it. Every export is a named `export function` / `export const` (the only forms the
// bundle sees) and is prefixed, because window.RSE is one flat namespace.
//
// Model (see the spec, "Motif engine"):
// - Lattice. A point [x, y, z] projects with x at +30°, y at −30° (screen y points down, so +30°
//   runs down-right) and z straight up, unit length 1. Every vertex is a projected lattice point.
// - Parts. A bar or a cube is an axis-aligned box. Seen from the +x+y+z side it shows up to three
//   faces, shaded by orientation like the supplied cube: top (+z) lightest, left (+y) mid,
//   right (+x) darkest.
// - Crossings. Declared data, never inferred: `over` passes in front of `under` at its `overAt`
//   end and behind it at the other. That contradiction is what makes a shape impossible.
// - Colour. Only motifRamp(hue, 3), the palette ramp BrandMotif uses. No hex lives here.
import { motifRamp } from './BrandMotif.jsx';

const COS30 = Math.sqrt(3) / 2;
const AXES = ['x', 'y', 'z'];
// The role of the face a box shows at the + end of each axis.
const CAP_ROLE = { x: 'right', y: 'left', z: 'top' };
const FACE_ORDER = ['top', 'left', 'right'];
const SHADE = { top: 0, left: 1, right: 2 };

const r2 = (v) => Math.round(v * 100) / 100 + 0; // + 0 turns -0 into 0
const unit = (axis) => [axis === 'x' ? 1 : 0, axis === 'y' ? 1 : 0, axis === 'z' ? 1 : 0];
const checkAxis = (axis) => {
  if (!AXES.includes(axis)) throw new Error(`motif engine: unknown axis ${JSON.stringify(axis)}`);
};

/** Lattice point to screen point, rounded to 2 decimals. */
export function isoPoint(p) {
  const [x, y, z] = p;
  return [r2((x - y) * COS30), r2((x + y) / 2 - z)];
}

/** A bar along `axis` from `start`, `length` long and `thickness` square in section. */
export function motifBar(axis, start, length, thickness = 1) {
  checkAxis(axis);
  const size = AXES.map((a) => (a === axis ? length : thickness));
  return { kind: 'bar', axis, at: [...start], size };
}

/** A cube with its low corner at `at`. Its axis (for motion) is z. */
export function motifCube(at, size = 1) {
  return { kind: 'cube', axis: 'z', at: [...at], size: [size, size, size] };
}

/** A named shape: parts plus the crossings that make it impossible. Throws on a bad crossing. */
export function makeMotifShape(name, parts, crossings = []) {
  const seen = new Map();
  for (const c of crossings) {
    const ok = (i) => Number.isInteger(i) && i >= 0 && i < parts.length;
    if (!ok(c.over) || !ok(c.under) || c.over === c.under) {
      throw new Error(`motif engine: ${name}: crossing ${JSON.stringify(c)} names a missing or the same part`);
    }
    if (c.overAt !== 'start' && c.overAt !== 'end') {
      throw new Error(`motif engine: ${name}: crossing overAt must be 'start' or 'end'`);
    }
    const over = parts[c.over];
    if (over.size[AXES.indexOf(over.axis)] < 2) {
      throw new Error(`motif engine: ${name}: part ${c.over} is too short to split for a crossing`);
    }
    const pair = `${c.over}>${c.under}`;
    if (seen.has(pair) && seen.get(pair) !== c.overAt) {
      throw new Error(`motif engine: ${name}: part ${c.over} cannot be over part ${c.under} at both ends`);
    }
    seen.set(pair, c.overAt);
  }
  return { name, parts: parts.map((p) => ({ ...p, at: [...p.at], size: [...p.size] })), crossings: crossings.map((c) => ({ ...c })) };
}

// A box's screen silhouette is a hexagon bounded by three functionals that are constant along the
// view direction (1, 1, 1): x - z, y - z and x - y. Two silhouettes overlap (with area) exactly when
// all three ranges overlap strictly.
const motifSpans = (b) => {
  const [x0, y0, z0] = b.at;
  const [x1, y1, z1] = b.at.map((v, i) => v + b.size[i]);
  return [[x0 - z1, x1 - z0], [y0 - z1, y1 - z0], [x0 - y1, x1 - y0]];
};
const motifOverlap = (p, q) => p.spans.every(([lo, hi], i) => lo < q.spans[i][1] && q.spans[i][0] < hi);
// Seen from the +x+y+z side, p is behind q when they are separated on some axis with p on the low
// side. For disjoint boxes whose silhouettes overlap, the axes never disagree.
const motifBehind = (p, q) => [0, 1, 2].some((k) => p.at[k] + p.size[k] <= q.at[k]);

// Boxes to paint, one per part, or two for a part that is `over` in a crossing: it is cut at its
// midpoint (rounded down to the lattice) and the start half drops its cap at the cut, so the seam
// never shows. Paint order is a topological sort of "paints before" edges between boxes whose
// silhouettes overlap:
// 1. crossing edges, in declaration order: back half -> under (each of its boxes) -> front half;
// 2. geometry edges: the box behind -> the box in front, in (part, half) order.
// An edge that would close a cycle is skipped, so crossing edges win over geometry and an earlier
// crossing wins over a later one; that is how a cyclic declaration (A over B, B over C, C over A)
// stays well defined. Among boxes free to paint, the lowest (part, half) goes first.
const motifBoxes = (shape) => {
  const split = new Set(shape.crossings.map((c) => c.over));
  const boxes = [];
  shape.parts.forEach((part, index) => {
    if (!split.has(index)) {
      boxes.push({ index, half: 0, axis: part.axis, at: part.at, size: part.size, skip: null });
      return;
    }
    const k = AXES.indexOf(part.axis);
    const cut = Math.floor(part.size[k] / 2);
    boxes.push(
      { index, half: 0, axis: part.axis, at: part.at, size: part.size.map((s, i) => (i === k ? cut : s)), skip: CAP_ROLE[part.axis] },
      { index, half: 1, axis: part.axis, at: part.at.map((v, i) => (i === k ? v + cut : v)), size: part.size.map((s, i) => (i === k ? s - cut : s)), skip: null },
    );
  });
  boxes.forEach((b, i) => { b.id = i; b.spans = motifSpans(b); b.after = new Set(); });

  const reaches = (from, to) => {
    const stack = [from];
    const seen = new Set();
    while (stack.length) {
      const b = stack.pop();
      if (b === to) return true;
      if (seen.has(b)) continue;
      seen.add(b);
      stack.push(...b.after);
    }
    return false;
  };
  const edge = (p, q) => {
    if (p !== q && motifOverlap(p, q) && !reaches(q, p)) p.after.add(q);
  };
  for (const c of shape.crossings) {
    const halves = boxes.filter((b) => b.index === c.over);
    const front = halves[c.overAt === 'start' ? 0 : 1];
    const back = halves[c.overAt === 'start' ? 1 : 0];
    for (const u of boxes.filter((b) => b.index === c.under)) {
      edge(back, u);
      edge(u, front);
    }
  }
  for (const p of boxes) for (const q of boxes) if (motifBehind(p, q)) edge(p, q);

  const pending = new Map(boxes.map((b) => [b, 0]));
  for (const b of boxes) for (const q of b.after) pending.set(q, pending.get(q) + 1);
  const order = [];
  while (order.length < boxes.length) {
    const next = boxes.find((b) => pending.get(b) === 0);
    pending.set(next, -1);
    for (const q of next.after) pending.set(q, pending.get(q) - 1);
    order.push(next);
  }
  order.forEach((b, rank) => { b.layer = rank; });
  return order;
};

const boxFaces = (box) => {
  const [x0, y0, z0] = box.at;
  const [x1, y1, z1] = box.at.map((v, i) => v + box.size[i]);
  const corners = {
    top: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]],
    left: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]],
    right: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]],
  };
  return FACE_ORDER.filter((role) => role !== box.skip)
    .map((role) => ({ points: corners[role].map(isoPoint), role, layer: box.layer, piece: box.index }));
};

/** Every visible face, in paint order. `piece` is its part's index, `layer` its box's paint position. */
export function motifFaces(shape) {
  return motifBoxes(shape).flatMap(boxFaces);
}

/** Faces grouped into pieces (one per box, in paint order) and filled from the hue's ramp; null for an unknown hue. */
export function motifPieces(shape, hue) {
  const ramp = motifRamp(hue, 3);
  if (!ramp) return null;
  return motifBoxes(shape).map((box) => {
    const [ax, ay] = isoPoint(unit(box.axis));
    return {
      index: box.index,
      axis: { x: ax, y: ay },
      faces: boxFaces(box).map((f) => ({
        points: f.points.map(([x, y]) => `${x},${y}`).join(' '),
        role: f.role,
        fill: ramp[SHADE[f.role]],
      })),
    };
  });
}

const escapeXml = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

/** The shape as an SVG string fitted to its bounds; '' for an unknown hue. */
export function motifToSvg(shape, opts = {}) {
  const { hue, size = 240, title } = opts;
  const pieces = motifPieces(shape, hue);
  if (!pieces) return '';
  const xs = [];
  const ys = [];
  for (const f of motifFaces(shape)) for (const [x, y] of f.points) { xs.push(x); ys.push(y); }
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const viewBox = [minX, minY, Math.max(...xs) - minX, Math.max(...ys) - minY].map(r2).join(' ');
  const a11y = title ? 'role="img"' : 'aria-hidden="true" focusable="false"';
  const head = title ? `<title>${escapeXml(title)}</title>` : '';
  const body = pieces.map((p) => {
    const faces = p.faces.map((f) => `<polygon points="${f.points}" fill="${f.fill}"/>`).join('');
    return `<g class="rse-motif__piece" style="--i:${p.index};--ax:${p.axis.x};--ay:${p.axis.y}">${faces}</g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${size}" height="${size}" ${a11y}>${head}${body}</svg>`;
}

// ─── Shape library ───────────────────────────────────────────────────────────
// Six generated shapes, system work (not artwork supplied by Sesc). Each was tuned by rendering it
// in all six hues and looking: the test suite cannot tell whether a figure reads as impossible.
// Two tricks make them impossible:
// - Depth shift. A point and the point (k, k, k) further along the view direction land on the same
//   screen spot, so a path of bars may "close" on screen while it is k units apart in space. The
//   seam is declared as a crossing so the far end paints over the near one and the join looks solid.
// - Escher crossing. A bar that is behind another is declared to pass in front of it at one end.

// The 12 edges of a box frame W (x) by D (y) by H (z), bars 1 thick, low corner at `o`. Columns run
// the full height; the rings fit between them. Order: columns far, right, left, near; x-bars far
// bottom, near bottom, far top, near top; y-bars far bottom, near bottom, far top, near top.
const motifFrame = (W, D, H, o = [0, 0, 0]) => {
  const at = (p) => p.map((v, i) => v + o[i]);
  return [
    ...[[0, 0], [W - 1, 0], [0, D - 1], [W - 1, D - 1]].map(([x, y]) => motifBar('z', at([x, y, 0]), H)),
    ...[[0, 0], [D - 1, 0], [0, H - 1], [D - 1, H - 1]].map(([y, z]) => motifBar('x', at([1, y, z]), W - 2)),
    ...[[0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1]].map(([x, z]) => motifBar('y', at([x, 1, z]), D - 2)),
  ];
};

/** Names of the generated shapes, in showcase order. */
export const motifShapeNames = Object.freeze(['cube', 'triangle', 'stair', 'loop', 'tower', 'twin']);

/** The generated shape library, keyed by name. */
export const motifShapes = Object.freeze({
  // The grammar's own cube: a 4-unit box frame of 12 bars, the family of the supplied cube-frame.
  // A plain (possible) cube; it anchors the set and is the loader's default.
  cube: makeMotifShape('cube', motifFrame(4, 4, 4)),

  // Penrose triangle. x bar, then y bar from its far end, then z bar standing on that one's far end.
  // The z bar's top lands, on screen, exactly on the x bar's start (depth shift 4). Crossing 1 puts
  // the x bar's start over it, so the join reads as a corner; crossing 2 keeps the z bar over the y
  // bar it stands on (without it the paint-order cycle breaks at the wrong joint).
  triangle: makeMotifShape('triangle', [
    motifBar('x', [0, 0, 0], 5),
    motifBar('y', [4, 1, 0], 4),
    motifBar('z', [4, 4, 1], 4),
  ], [{ over: 0, under: 2, overAt: 'start' }, { over: 2, under: 1, overAt: 'start' }]),

  // Endless stair. Walk the far flat (x) and the near flat (y) on one level, climb two steps away
  // along -x and two along -y, step onto a flat bar one level up... which is, on screen, the far
  // flat you started on (depth shift 5). The stairs climb away from the viewer so their risers show
  // (a stair climbing toward the viewer projects onto a straight line). Steps are 2-tall columns.
  // The seam sits inside the top flat: the closing bar (6) and the far flat (0) read as one bar.
  stair: makeMotifShape('stair', [
    motifBar('x', [3, 0, 0], 5),
    motifBar('y', [7, 1, 0], 8),
    motifBar('z', [6, 8, 0], 2),
    motifBar('z', [5, 8, 1], 2),
    motifBar('z', [5, 7, 2], 2),
    motifBar('z', [5, 6, 3], 2),
    motifBar('x', [5, 5, 5], 3),
  ], [{ over: 0, under: 6, overAt: 'start' }]),

  // Impossible pentagon: a flat U on the floor (x, y, -x), a post up (z), a bar back along -y and a
  // bar along x that meets the floor bar it started from (depth shift 3). Bars x, y, z with nothing
  // coming back down: the eye sees a loop that cannot close. Seam inside the first x bar.
  loop: makeMotifShape('loop', [
    motifBar('x', [0, 0, 0], 4),
    motifBar('y', [3, 1, 0], 5),
    motifBar('x', [1, 5, 0], 2),
    motifBar('z', [1, 5, 1], 3),
    motifBar('y', [1, 3, 3], 2),
    motifBar('x', [2, 3, 3], 2),
  ], [{ over: 0, under: 5, overAt: 'start' }]),

  // Escher's impossible box, tall: a 6 x 4 x 8 frame whose back column passes in front of the front
  // top bar (crossing 1). The far top y bar is split too (crossing 2), so the three-way cycle
  // column > front bar > far bar > column resolves where each pair actually overlaps.
  tower: makeMotifShape('tower', motifFrame(6, 4, 8), [
    { over: 0, under: 7, overAt: 'end' },
    { over: 10, under: 7, overAt: 'start' },
  ]),

  // Two frame cubes, the second one step down the view diagonal (3, 3, 0), sharing one column: the
  // first cube's front column is the second's back column. The first cube's left column passes in
  // front of the second cube's front top bar, which is nearer: the two cubes interlock impossibly.
  twin: makeMotifShape('twin', [
    ...motifFrame(4, 4, 4),
    ...motifFrame(4, 4, 4, [3, 3, 0]).filter((_, i) => i !== 0),
  ], [{ over: 2, under: 18, overAt: 'start' }]),
});

/** The whole engine as one object, for consumers that prefer a namespace. */
export const MotifEngine = Object.freeze({ isoPoint, motifBar, motifCube, makeMotifShape, motifFaces, motifPieces, motifToSvg, motifShapeNames, motifShapes });
