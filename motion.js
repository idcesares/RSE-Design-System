/* motion.js — the data-rse-motion accessibility setting ("full" | "reduced").
   Classic script, no dependencies. Load it before first paint to avoid a flash, then call
   RSE.motion.init(). Choice order: stored value, else the OS preference, else "full".
   The attribute lands on <html>; tokens/base-runtime.css turns it into --rse-motion-travel.
   A no-op when window is undefined (server render). */
(function (window) {
  if (typeof window === 'undefined') return;
  var KEY = 'rse-motion';
  var current = null;

  function valid(v) { return v === 'full' || v === 'reduced'; }

  function read() {
    try { var v = window.localStorage.getItem(KEY); return valid(v) ? v : null; } catch (e) { return null; }
  }

  function osValue() {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduced';
    } catch (e) { /* fall through */ }
    return 'full';
  }

  function apply(v) {
    current = v;
    try { window.document.documentElement.setAttribute('data-rse-motion', v); } catch (e) { /* no document */ }
  }

  var motion = {
    get: function () { return current || read() || osValue(); },
    set: function (v) {
      if (!valid(v)) return;
      try { window.localStorage.setItem(KEY, v); } catch (e) { /* storage blocked: the choice lasts for this page only */ }
      apply(v);
    },
    init: function () {
      var v = read() || osValue();
      apply(v);
      return v;
    }
  };

  window.RSE = window.RSE || {};
  window.RSE.motion = motion;
})(typeof window === 'undefined' ? undefined : window);
