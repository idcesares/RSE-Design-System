import React from 'react';
import { motifShapes, motifPieces } from '../brand/MotifEngine.jsx';
// Markup only: MotifLoader.css animates it (assemble, hold, release; hue steps). No hooks, no
// window or document access, so it renders on the server. Fills are the engine's ramp colours
// (data, set per face); everything about how it looks and moves lives in the CSS contract.
const cx = (...c) => c.filter(Boolean).join(' ');

// viewBox from the pieces' own points, so the shape fills the box and travel has room to show.
function viewBoxOf(pieces) {
  const xs = [];
  const ys = [];
  for (const p of pieces) for (const f of p.faces) for (const pt of f.points.split(' ')) { const [x, y] = pt.split(','); xs.push(+x); ys.push(+y); }
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return [minX, minY, Math.max(...xs) - minX, Math.max(...ys) - minY].map((v) => Math.round(v * 100) / 100).join(' ');
}

export const MotifLoader = React.forwardRef(function MotifLoader({ shape, hue = 'purple', hues, size, variant = 'section', tone = 'primary', label = 'Carregando', className, style, ...rest }, ref) {
  const inline = variant === 'inline' || (typeof size === 'number' && size < 32);
  const dimension = size === undefined ? (inline ? 24 : 48) : size;
  shape = shape === undefined ? (inline ? 'triangle' : 'cube') : shape;
  // Own property only: 'constructor', 'toString' and '__proto__' are not shapes.
  if (typeof shape !== 'string' || !Object.prototype.hasOwnProperty.call(motifShapes, shape)) return null;
  const def = motifShapes[shape];
  const set = !inline && Array.isArray(hues) && hues.length >= 2 && hues.length <= 4 ? hues : null;
  const byHue = (set || [hue]).map((h) => motifPieces(def, h));
  if (byHue.some((p) => !p)) return null;
  const pieces = byHue[0];
  const groups = pieces.map((piece, i) => React.createElement('g', {
    key: i,
    className: 'rse-motif-loader__piece',
    style: { '--i': i, '--ax': piece.axis.x, '--ay': piece.axis.y }
  }, piece.faces.map((face, j) => React.createElement('polygon', {
    key: j,
    points: face.points,
    fill: inline ? 'currentColor' : face.fill,
    // With hues, each face carries one colour per hue for its role; the CSS steps through them.
    style: set ? Object.fromEntries(byHue.map((p, k) => ['--c' + k, p[i].faces[j].fill])) : undefined
  }))));
  return React.createElement('span', {
    ref,
    role: 'status',
    'aria-label': label,
    className: cx('rse-motif-loader', 'rse-motion-managed', inline && 'rse-motif-loader--inline', inline && tone === 'inverse' && 'rse-motif-loader--inverse', set && 'rse-motif-loader--hues-' + set.length, className),
    // --n (piece count) sets the stagger: data, not look.
    style: { ...style, '--n': pieces.length },
    ...rest
  }, React.createElement('svg', {
    viewBox: viewBoxOf(pieces),
    width: dimension,
    height: dimension,
    'aria-hidden': 'true',
    focusable: 'false'
  }, groups));
});
