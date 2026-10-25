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

/** The whole engine as one object, for consumers that prefer a namespace. */
export const MotifEngine = Object.freeze({ isoPoint, motifBar, motifCube, makeMotifShape, motifFaces, motifPieces, motifToSvg });
