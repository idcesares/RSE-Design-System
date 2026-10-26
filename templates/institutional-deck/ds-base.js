// Copy this folder, then point this one base line at the design-system root.
(() => {
  const base = '../..';
  const local = new URL('.', document.currentScript.src);
  const root = new URL(base + '/', local);
  if (window.RSE_TEMPLATE_BOOTSTRAP) return;
  window.RSE_TEMPLATE_BASE = root.href;
  const css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = new URL('styles.css', root).href;
  document.head.appendChild(css);
  const load = (url) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url; script.onload = resolve;
    script.onerror = () => reject(new Error('Template dependency failed: ' + url));
    document.head.appendChild(script);
  });
  window.RSE_TEMPLATE_BOOTSTRAP = (async () => {
    await load(new URL('motion.js', root).href);
    window.RSE.motion.init();
    if (!window.React) await load(new URL('assets/vendor/react.production.min.js', root).href);
    if (!window.ReactDOM) await load(new URL('assets/vendor/react-dom.production.min.js', root).href);
    if (!window.RSE.Hero) await load(new URL('dist/rse.js', root).href);
    window.RSEReferenceLogo = ({ className, tone = 'purple' }) => window.React.createElement('img', { className, src: new URL('assets/logos/wordmark-' + tone + '.svg', root).href, alt: 'Rede Sesc de Educa\u00e7\u00e3o' });
    await load(new URL('image-slot.js', root).href);
    await load(new URL('deck-stage.js', local).href);
    await load(new URL('support.js', local).href);
  })().catch((error) => {
    console.error(error);
    const report = () => {
      const message = document.createElement('p');
      message.setAttribute('role', 'alert');
      message.textContent = 'Não foi possível abrir o modelo. Confira a linha base em ds-base.js e mantenha os arquivos da pasta juntos.';
      document.body.prepend(message);
    };
    if (document.body) report(); else document.addEventListener('DOMContentLoaded', report, { once: true });
  });
})();
