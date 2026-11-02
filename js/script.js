(function () {
  var root = document.documentElement;
  root.classList.add('js');

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // ----- Theme toggle -----
  var toggle = document.getElementById('themeToggle');
  var meta = document.querySelector('meta[name="theme-color"]');
  function applyTheme(t, save) {
    root.setAttribute('data-theme', t);
    toggle.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#0e0e10' : '#f5f5f0');
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
  }
  applyTheme(root.getAttribute('data-theme') || 'dark', false);
  toggle.addEventListener('click', function () {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });
  // Follow the device setting until the visitor picks a theme manually
  try {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
      if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'light' : 'dark', false);
    });
  } catch (e) {}

  // ----- Mobile menu -----
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });
  window.matchMedia('(min-width: 721px)').addEventListener('change', function () { setMenu(false); });

  // ----- Reveal on scroll -----
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('visible'); revealObs.unobserve(en.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });

  // ----- Header border after scroll (rAF throttled) -----
  var header = document.getElementById('header');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
      ticking = false;
    });
  }, { passive: true });

  // ----- Active nav link -----
  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var secObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { secObs.observe(s); });
})();
