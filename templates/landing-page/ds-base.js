// Loads the design system into this template. Copying the template elsewhere? Point `base` at
// the design system root relative to this file (the package folder, or the unzipped static kit
// from `npm run pack`) — that one line is the only wiring.
(() => {
  const base = '../..';
  for (const p of ["styles.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/dist/rse.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — point the base line in ds-base.js at the design system root relative to this page.');
  document.head.appendChild(s);
})();
