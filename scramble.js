// Text scramble effects. Progressive enhancement: the real text lives in the
// HTML; this only animates it (decode-on-load, and TBA -> date on hover).
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var GLYPHS = '!<>-_\\/[]{}=+*^?#abcdefghijklmnopqrstuvwxyz0123456789';

  function TextScramble(el) {
    this.el = el;
    this.update = this.update.bind(this);
  }
  TextScramble.prototype.setText = function (newText) {
    var self = this;
    var length = newText.length;
    var promise = new Promise(function (resolve) { self.resolve = resolve; });
    this.queue = [];
    for (var i = 0; i < length; i++) {
      var to = newText[i];
      // All characters shuffle from frame 0 so the full line appears at once,
      // then settles at staggered end frames. No grow-in from the left.
      var end = 12 + Math.floor(Math.random() * 40);
      this.queue.push({ to: to, start: 0, end: end, char: null });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  };
  TextScramble.prototype.update = function () {
    var output = '';
    var complete = 0;
    for (var i = 0; i < this.queue.length; i++) {
      var q = this.queue[i];
      if (this.frame >= q.end) {
        complete++;
        output += q.to;
      } else if (this.frame >= q.start) {
        if (q.to === ' ') {
          output += ' ';
        } else {
          if (!q.char || Math.random() < 0.28) {
            q.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
          output += '<span class="dud">' + q.char + '</span>';
        }
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  };

  // --- Decode-on-load (skipped for reduced-motion) ---
  function run() {
    var selectors = ['.title', '.blurb', '.caption', '.section-label', '.partner', '.footnote'];
    var items = [];
    selectors.forEach(function (sel) {
      var els = document.querySelectorAll(sel);
      for (var i = 0; i < els.length; i++) {
        items.push({ el: els[i], text: els[i].textContent, html: els[i].innerHTML });
      }
    });
    items.forEach(function (it) { it.el.style.visibility = 'hidden'; });

    var delay = 0;
    items.forEach(function (it) {
      setTimeout(function () {
        it.el.style.visibility = 'visible';
        new TextScramble(it.el).setText(it.text).then(function () {
          // restore original markup (links, refs, .reveal spans) if the line had any
          if (it.html !== it.text) it.el.innerHTML = it.html;
        });
      }, delay);
      delay += 240;
    });
  }

  if (!reduce) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  // --- Hover reveal: TBA <-> date on .soon items ---
  // Delegated so it keeps working after the load animation re-creates nodes.
  function reveal(host, attr) {
    var el = host.querySelector('.reveal');
    if (!el) return;
    var to = el.getAttribute(attr);
    if (to == null) return;
    if (reduce) { el.textContent = to; return; }
    el._fx = el._fx || new TextScramble(el);
    el._fx.setText(to);
  }

  var current = null;
  document.addEventListener('mouseover', function (e) {
    var host = e.target.closest && e.target.closest('.soon');
    if (host && host !== current) {
      current = host;
      reveal(host, 'data-date');
    }
  });
  document.addEventListener('mouseout', function (e) {
    if (!current) return;
    var to = e.relatedTarget;
    if (!to || !current.contains(to)) {
      reveal(current, 'data-tba');
      current = null;
    }
  });
})();
