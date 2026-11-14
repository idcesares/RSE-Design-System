// Template runtime: renders a .dc.html template (an <x-dc> block plus an optional logic script)
// with React and the design system's components. It replaces the generated, 1,900-line
// dc-runtime build each template folder used to carry, whose source was not in this repo. It
// implements only what the templates use, and renders the same DOM, so pages look identical:
//
//   <x-dc> … </x-dc>                    the template. Replaced by <div id="dc-root"><div class="sc-host">.
//   <x-import component-from-global-scope="RSE.Hero" title="…" media="{{ heroMedia }}">
//                                       mounts window.RSE.Hero (any dotted global path, or a custom
//                                       element such as deck-stage). kebab-case attributes become
//                                       camelCase props, except aria-* and data-*; class-name is
//                                       className. Literal values stay strings; children are passed
//                                       as children. hint-* and from are design-tool hints, ignored.
//   <sc-if value="{{ showX }}"> … </sc-if>   renders its children when the value is truthy.
//   {{ expr }}                          in text or attributes: a path (a.b.c), !expr, a literal
//                                       (true, false, null, undefined, numbers, quoted strings) or
//                                       an (in)equality of two of those. Not arbitrary JavaScript.
//   <script type="text/x-dc" data-dc-script>
//     class Component extends DCLogic { state = { … }; renderVals() { return { … }; } }
//   </script>                           the template's logic. renderVals() supplies the {{ }}
//                                       values; this.setState(patch) re-renders.
//
// Loaded by each template's ds-base.js after React, ReactDOM and dist/rse.js. No build step.
(function () {
  'use strict';
  if (window.RSETemplateRuntime) return;
  const React = window.React;
  const ReactDOM = window.ReactDOM;
  if (!React || !ReactDOM) throw new Error('template runtime: React and ReactDOM must load first');
  const h = React.createElement;

  // ─── Expressions ──────────────────────────────────────────────────────────
  const NUMBER = /^-?\d+(?:\.\d+)?$/;
  const COMPARISON = /^(.+?)\s*(===|!==|==|!=)\s*(.+)$/;
  function resolve(vals, raw) {
    const expr = raw.trim();
    const cmp = expr.match(COMPARISON);
    if (cmp) {
      const l = resolve(vals, cmp[1]);
      const r = resolve(vals, cmp[3]);
      switch (cmp[2]) {
        case '===': return l === r;
        case '!==': return l !== r;
        case '==': return l == r; // eslint-disable-line eqeqeq
        default: return l != r; // eslint-disable-line eqeqeq
      }
    }
    if (expr[0] === '!') return !resolve(vals, expr.slice(1));
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;
    if (expr === 'undefined') return undefined;
    if (NUMBER.test(expr)) return Number(expr);
    if (expr.length >= 2 && (expr[0] === '"' || expr[0] === "'") && expr[expr.length - 1] === expr[0]) return expr.slice(1, -1);
    let v = vals;
    for (const part of expr.split('.')) {
      if (v == null || part === '__proto__' || part === 'constructor' || part === 'prototype') return undefined;
      v = v[part];
    }
    return v;
  }
  // An attribute value: a single {{ }} keeps its type (array, element, function); mixed text joins.
  function compileValue(raw) {
    const whole = raw.match(/^\s*\{\{([\s\S]+?)\}\}\s*$/);
    if (whole) return (vals) => resolve(vals, whole[1]);
    if (!raw.includes('{{')) return () => raw;
    const parts = raw.split(/\{\{([\s\S]+?)\}\}/g);
    return (vals) => parts.map((s, i) => (i & 1 ? resolve(vals, s) ?? '' : s)).join('');
  }

  // ─── Attributes → props ───────────────────────────────────────────────────
  const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const DOM_ATTR = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', colspan: 'colSpan', rowspan: 'rowSpan', readonly: 'readOnly', maxlength: 'maxLength', autocomplete: 'autoComplete', crossorigin: 'crossOrigin', srcset: 'srcSet', viewbox: 'viewBox' };
  const EVENTS = { onclick: 'onClick', onchange: 'onChange', oninput: 'onInput', onsubmit: 'onSubmit', onkeydown: 'onKeyDown', onkeyup: 'onKeyUp', onfocus: 'onFocus', onblur: 'onBlur' };
  const SKIP = new Set(['component-from-global-scope', 'from', 'sc-name', 'data-dc-tpl']);
  function styleObject(css) {
    const out = {};
    for (const decl of String(css).split(';')) {
      const i = decl.indexOf(':');
      if (i < 0) continue;
      const prop = decl.slice(0, i).trim();
      out[prop.startsWith('--') ? prop : camel(prop)] = decl.slice(i + 1).trim();
    }
    return out;
  }
  function compileProps(el, isImport) {
    const getters = [];
    for (const { name, value } of [...el.attributes]) {
      if (SKIP.has(name) || name.startsWith('hint-')) continue;
      let key = name;
      if (isImport) {
        if (key.includes('-') && !key.startsWith('aria-') && !key.startsWith('data-')) key = camel(key);
      } else if (DOM_ATTR[key]) key = DOM_ATTR[key];
      else if (key.startsWith('on')) key = EVENTS[key] || 'on' + key[2].toUpperCase() + key.slice(3);
      getters.push([key, compileValue(value)]);
    }
    return (vals) => {
      const props = {};
      for (const [k, get] of getters) {
        let v = get(vals);
        if (k === 'style' && typeof v === 'string') v = styleObject(v);
        props[k] = v;
      }
      return props;
    };
  }

  // ─── Template → render functions ──────────────────────────────────────────
  // Each node compiles once to (vals, key) => React node; renders re-run them with fresh vals.
  function resolveComponent(path) {
    let v = window;
    for (const part of path.split('.')) v = v == null ? undefined : v[part];
    if (v) return v;
    if (path.includes('-') && !path.includes('.')) return path; // a custom element, e.g. deck-stage
    return null;
  }
  const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
  function compileChildren(node) {
    return [...node.childNodes].map(compileNode).filter(Boolean);
  }
  const renderAll = (kids, vals) => kids.map((k, i) => k(vals, i));
  function compileNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue || '';
      if (!text.includes('{{')) return text.trim() || text.includes(' ') ? () => text : null;
      const parts = text.split(/\{\{([\s\S]+?)\}\}/g);
      return (vals, key) => h(React.Fragment, { key }, ...parts.map((p, i) => {
        if (!(i & 1)) return p;
        const v = resolve(vals, p);
        if (v === undefined || v === null || typeof v === 'boolean') return null;
        if (React.isValidElement(v) || Array.isArray(v)) return h(React.Fragment, { key: i }, v);
        return h('span', { key: i, className: 'sc-interp' }, String(v));
      }));
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const tag = node.localName;
    if (tag === 'script' || tag === 'template') return null;
    if (tag === 'sc-if') {
      const test = compileValue(node.getAttribute('value') || '');
      const kids = compileChildren(node);
      return (vals, key) => (test(vals) ? h(React.Fragment, { key }, ...renderAll(kids, vals)) : null);
    }
    if (tag === 'x-import') {
      const name = node.getAttribute('component-from-global-scope') || '';
      const props = compileProps(node, true);
      const kids = compileChildren(node);
      return (vals, key) => {
        const C = resolveComponent(name);
        if (!C) { console.error(`template runtime: ${name} is not loaded`); return null; }
        const p = props(vals);
        p.key = key;
        return kids.length ? h(C, p, ...renderAll(kids, vals)) : h(C, p);
      };
    }
    const props = compileProps(node, false);
    const kids = compileChildren(node);
    return (vals, key) => {
      const p = props(vals);
      p.key = key;
      if ('value' in p && p.value === undefined) p.value = '';
      if ('checked' in p && p.checked === undefined) p.checked = false;
      return VOID.has(tag) ? h(tag, p) : h(tag, p, ...renderAll(kids, vals));
    };
  }

  // ─── Logic ────────────────────────────────────────────────────────────────
  class DCLogic {
    constructor() { this.state = {}; this.props = {}; }
    setState(patch) {
      const next = typeof patch === 'function' ? patch(this.state, this.props) : patch;
      this.state = { ...this.state, ...next };
      if (this.__update) this.__update();
    }
    renderVals() { return {}; }
  }
  function loadLogic(doc) {
    const script = doc.querySelector('script[data-dc-script]');
    if (!script) return DCLogic;
    // The template's own logic, shipped in the same page: evaluated like any inline script.
    return new Function('DCLogic', 'React', 'RSE', `${script.textContent}\nreturn typeof Component === 'function' ? Component : DCLogic;`)(DCLogic, React, window.RSE);
  }

  // ─── Mount ────────────────────────────────────────────────────────────────
  function mount(doc = document) {
    const dc = doc.querySelector('x-dc');
    if (!dc) return null;
    const kids = compileChildren(dc);
    const Logic = loadLogic(doc);
    const host = doc.createElement('div');
    host.id = 'dc-root';
    dc.replaceWith(host);
    const style = doc.createElement('style');
    style.textContent = 'html,body{height:100%;margin:0}#dc-root,#dc-root>.sc-host{height:100%}';
    doc.head.appendChild(style);
    function Root() {
      const [, tick] = React.useReducer((n) => n + 1, 0);
      const logic = React.useMemo(() => new Logic(), []);
      logic.__update = tick;
      let vals = {};
      try { vals = logic.renderVals() || {}; } catch (error) { console.error('template runtime: renderVals()', error); }
      return h('div', { className: 'sc-host' }, ...renderAll(kids, vals));
    }
    ReactDOM.createRoot(host).render(h(Root));
    return host;
  }

  const hide = document.createElement('style');
  hide.textContent = 'x-dc{display:none!important}';
  document.head.appendChild(hide);
  window.RSETemplateRuntime = { mount, resolve, DCLogic };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => mount(), { once: true });
  else mount();
})();
