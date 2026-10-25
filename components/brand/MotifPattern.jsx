'use client';
import React from 'react';
import { renderMotifPattern } from './MotifEngine.jsx';
import { Icon } from '../core/Icon.jsx';
// A field of impossible shapes, as markup: the engine's SVG goes in the art div, and MotifPattern.css
// does everything else (fill the host, reveal, ambient, pause). Hooks only for what plain HTML
// also does: the pause toggle (the same attributes motion.js sets for static pages) and calling
// RSE.motion.reveal when it exists. Nothing is imported from motion.js, and nothing touches window
// during render, so it renders on the server.
const cx = (...c) => c.filter(Boolean).join(' ');

export const MotifPattern = React.forwardRef(function MotifPattern({ width = 1920, height = 1080, shape, cell, gap, layout, fill, seed, hue, hues, sequence, opacity, animate = 'none', className, ...rest }, ref) {
  const mode = animate === 'reveal' || animate === 'ambient' ? animate : null;
  const options = { shape, width, height, cell, gap, layout, fill, seed, hue, hues, sequence, opacity, animate: mode || undefined };
  const key = JSON.stringify(options);
  const svg = React.useMemo(() => renderMotifPattern(options), [key]);
  const [paused, setPaused] = React.useState(false);
  const own = React.useRef(null);
  const setRef = React.useCallback((node) => {
    own.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  // Reveal: hand the root to RSE.motion.reveal when motion.js is on the page; without it (or without
  // IntersectionObserver) the cells simply stay visible. The cleanup lifts the "waiting" mark so a
  // re-render that rewrites the class cannot leave the cells hidden for good.
  React.useEffect(() => {
    const node = own.current;
    if (mode !== 'reveal' || !node || typeof window === 'undefined') return undefined;
    const motion = window.RSE && window.RSE.motion;
    if (motion && typeof motion.reveal === 'function') motion.reveal(node);
    return () => node.removeAttribute('data-reveal-ready');
  }, [mode, key, className]);

  if (!svg) return null;
  const art = React.createElement('div', { className: 'rse-motif-pattern__art', 'aria-hidden': 'true', dangerouslySetInnerHTML: { __html: svg } });
  const button = mode === 'ambient' ? React.createElement('button', {
    type: 'button',
    className: 'rse-motif-pattern__pause',
    'aria-pressed': paused ? 'true' : 'false',
    'aria-label': paused ? 'Retomar animação' : 'Pausar animação',
    // Same toggle motion.js does for static markup; stopping the event keeps its delegated handler from toggling twice.
    onClick: (event) => { event.stopPropagation(); setPaused((p) => !p); }
  },
  React.createElement('span', { className: 'rse-motif-pattern__icon rse-motif-pattern__icon--pause' }, React.createElement(Icon, { name: 'pause', size: 20 })),
  React.createElement('span', { className: 'rse-motif-pattern__icon rse-motif-pattern__icon--play' }, React.createElement(Icon, { name: 'play', size: 20 }))) : null;
  return React.createElement('div', {
    ref: setRef,
    className: cx('rse-motif-pattern', 'rse-motion-managed', className),
    'data-animate': mode || undefined,
    'data-paused': mode === 'ambient' && paused ? '' : undefined,
    ...rest
  }, art, button);
});
