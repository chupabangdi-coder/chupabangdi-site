document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav ul');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('active');
        menu.classList.remove('open');
      });
    });
  }

  // marquee / trust strip auto-fill: repeat the base content enough times so
  // the loop never shows a gap, no matter how wide the screen is. Builds
  // [block][block] (block = original content repeated k times) and lets the
  // existing -50% translateX keyframes scroll seamlessly.
  function fillLoop(track) {
    var band = track.parentElement;
    if (!band) return;
    // cache the pristine single copy so repeated calls (e.g. on resize)
    // always rebuild from the original, not from an already-expanded track
    if (!track.dataset.original) {
      track.dataset.original = track.innerHTML;
    }
    var original = track.dataset.original;
    track.innerHTML = original;
    var oneWidth = track.scrollWidth || 1;
    var targetWidth = (band.getBoundingClientRect().width || window.innerWidth) * 1.2;
    var k = Math.max(1, Math.ceil(targetWidth / oneWidth) + 1);
    var block = original.repeat(k);
    track.innerHTML = block + block;
  }
  function fillAllLoops() {
    document.querySelectorAll('[data-fill]').forEach(fillLoop);
  }
  if (document.querySelector('[data-fill]')) {
    fillAllLoops();
    var resizeT;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(fillAllLoops, 300);
    });
  }

  // side-index scroll spy (only runs when both exist, e.g. home.html)
  var dots = document.querySelectorAll('.side-index a');
  var sections = document.querySelectorAll('[data-section]');
  if (dots.length && sections.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          dots.forEach(function (d) {
            d.classList.toggle('active', d.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(function (s) { obs.observe(s); });
  }
});
