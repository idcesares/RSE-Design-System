/* motion.js — the data-rse-motion accessibility setting ("full" | "reduced").
   Classic script, no dependencies. Load it before first paint to avoid a flash, then call
   RSE.motion.init(). Choice order: stored value, else the OS preference, else "full".
   The attribute lands on <html>; tokens/base-runtime.css turns it into --rse-motion-travel.
   Also home to the MotifPattern helpers: RSE.motion.reveal() (scroll-triggered reveal) and
   RSE.motion.bindPause() (the delegated pause button, bound once at load).
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

  var REVEAL = '.rse-motif-pattern[data-animate="reveal"]';
  var PAUSE = '.rse-motif-pattern__pause';
  var bound = false;

  // Progressive enhancement: cells are visible unless this runs AND IntersectionObserver exists.
  // Then the pattern waits (data-reveal-ready hides its cells in CSS) until it scrolls into view.
  function reveal(root) {
    var scope = root || window.document;
    var IO = window.IntersectionObserver;
    if (!scope || !IO) return;
    var found = [];
    if (scope.matches && scope.matches(REVEAL)) found.push(scope);
    if (scope.querySelectorAll) {
      var list = scope.querySelectorAll(REVEAL);
      for (var i = 0; i < list.length; i++) found.push(list[i]);
    }
    var todo = [];
    for (var j = 0; j < found.length; j++) {
      var el = found[j];
      if (el.hasAttribute('data-reveal-ready') || (el.classList && el.classList.contains('is-visible'))) continue;
      todo.push(el);
    }
    if (!todo.length) return;
    var io = new IO(function (entries) {
      for (var k = 0; k < entries.length; k++) {
        if (!entries[k].isIntersecting) continue;
        entries[k].target.classList.add('is-visible');
        io.unobserve(entries[k].target);
      }
    });
    for (var m = 0; m < todo.length; m++) {
      todo[m].setAttribute('data-reveal-ready', '');
      io.observe(todo[m]);
    }
  }

  // One delegated click handler for every pause button, React-rendered or static HTML. The icon
  // swap is CSS ([aria-pressed]); this only toggles the state the CSS and assistive tech read.
  function bindPause() {
    var doc = window.document;
    if (bound || !doc || !doc.addEventListener) return;
    bound = true;
    doc.addEventListener('click', function (event) {
      var target = event.target;
      var btn = target && target.closest ? target.closest(PAUSE) : null;
      var root = btn && btn.closest('.rse-motif-pattern');
      if (!btn || !root) return;
      var paused = !root.hasAttribute('data-paused');
      if (paused) root.setAttribute('data-paused', ''); else root.removeAttribute('data-paused');
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      btn.setAttribute('aria-label', paused ? 'Retomar animação' : 'Pausar animação');
    });
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
    },
    reveal: reveal,
    bindPause: bindPause
  };

  window.RSE = window.RSE || {};
  window.RSE.motion = motion;
  bindPause();
})(typeof window === 'undefined' ? undefined : window);
