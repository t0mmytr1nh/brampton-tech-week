// Image hover effect: dim everything but the image with a subtle veil, and draw
// four pink guide lines that span the viewport and frame the image's edges.
// Progressive enhancement, pointer:fine only.
(function () {
  if (!(window.matchMedia && window.matchMedia('(pointer: fine)').matches)) return;
  var img = document.querySelector('.figure');
  if (!img) return;

  var frame = document.createElement('div');
  frame.className = 'img-frame';
  frame.setAttribute('aria-hidden', 'true');
  frame.innerHTML =
    '<div class="if-line if-top"></div>' +
    '<div class="if-line if-bottom"></div>' +
    '<div class="if-line if-left"></div>' +
    '<div class="if-line if-right"></div>';
  document.body.appendChild(frame);

  var top = frame.querySelector('.if-top');
  var bottom = frame.querySelector('.if-bottom');
  var left = frame.querySelector('.if-left');
  var right = frame.querySelector('.if-right');

  var PAD = 14;                      // gap between the image and the frame lines
  function place() {
    var r = img.getBoundingClientRect();
    var cx = r.left + r.width / 2;   // image centre, so lines emanate from the image
    var cy = r.top + r.height / 2;
    top.style.top = (r.top - PAD) + 'px';        top.style.transformOrigin = cx + 'px center';
    bottom.style.top = (r.bottom + PAD) + 'px';  bottom.style.transformOrigin = cx + 'px center';
    left.style.left = (r.left - PAD) + 'px';     left.style.transformOrigin = 'center ' + cy + 'px';
    right.style.left = (r.right + PAD) + 'px';   right.style.transformOrigin = 'center ' + cy + 'px';
  }

  var active = false;
  img.addEventListener('mouseenter', function () {
    place();
    active = true;
    frame.classList.add('active');
    document.body.classList.add('img-focus');
  });
  img.addEventListener('mouseleave', function () {
    active = false;
    frame.classList.remove('active');
    document.body.classList.remove('img-focus');
  });
  window.addEventListener('scroll', function () { if (active) place(); }, { passive: true });
  window.addEventListener('resize', function () { if (active) place(); });
})();
