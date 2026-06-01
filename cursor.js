// Custom crosshair cursor with a HUD-style lock-on reticle over interactive
// elements. Progressive enhancement: pointer:fine devices only; the native
// cursor is the fallback everywhere else.
(function () {
  var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  if (!fine) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var root = document.createElement('div');
  root.className = 'cursor';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML =
    '<span class="cursor-cross"></span>' +
    '<span class="cursor-reticle"><i></i><i></i><i></i><i></i></span>';
  document.body.appendChild(root);
  document.documentElement.classList.add('cursor-active');

  var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  var cx = tx, cy = ty;
  var shown = false;

  function loop() {
    var k = reduce ? 1 : 0.28;               // tracking lag (instant if reduced-motion)
    cx += (tx - cx) * k;
    cy += (ty - cy) * k;
    root.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
    requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('mousemove', function (e) {
    tx = e.clientX; ty = e.clientY;
    if (!shown) { shown = true; root.classList.add('visible'); }
  }, { passive: true });

  document.addEventListener('mouseleave', function () {
    shown = false; root.classList.remove('visible');
  });

  // Lock-on over interactive targets. ".soon" items lock on in a softer grey.
  var SEL = 'a, button, input, textarea, select, [role="button"], [data-cursor="target"], .soon';
  var SOFT = '.soon';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest && e.target.closest(SEL)) {
      root.classList.add('targeting');
      root.classList.toggle('soft', !!e.target.closest(SOFT));
    }
  });
  document.addEventListener('mouseout', function (e) {
    var to = e.relatedTarget;
    if (!to || !to.closest || !to.closest(SEL)) {
      root.classList.remove('targeting');
      root.classList.remove('soft');
    }
  });

  // Trigger pulse on press.
  document.addEventListener('mousedown', function () { root.classList.add('firing'); });
  document.addEventListener('mouseup', function () { root.classList.remove('firing'); });
})();
