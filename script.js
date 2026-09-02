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

  // project filter tabs (전체/홍보영상/유튜브/SNS/행사/사진) — only runs on project.html
  // "사진" is special-cased: instead of filtering the flat video grid, it
  // shows a separate section where photos are grouped by category.
  var filterTags = document.getElementById('filterTags');
  var grid = document.getElementById('portfolioGrid');
  var emptyMsg = document.getElementById('emptyMsg');
  var photoSection = document.getElementById('photoSection');
  if (filterTags && grid) {
    var cards = grid.querySelectorAll('.card');
    filterTags.querySelectorAll('.tag-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        filterTags.querySelectorAll('.tag-pill').forEach(function (p) {
          p.classList.remove('active');
        });
        pill.classList.add('active');
        var filter = pill.getAttribute('data-filter');

        if (filter === '사진') {
          grid.style.display = 'none';
          if (emptyMsg) emptyMsg.style.display = 'none';
          if (photoSection) photoSection.style.display = '';
          return;
        }
        if (photoSection) photoSection.style.display = 'none';
        grid.style.display = '';

        var visibleCount = 0;
        cards.forEach(function (card) {
          var match = filter === 'all' || card.getAttribute('data-category') === filter;
          card.style.display = match ? '' : 'none';
          if (match) visibleCount++;
        });
        if (emptyMsg) emptyMsg.style.display = visibleCount === 0 ? '' : 'none';
      });
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
