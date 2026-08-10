/* ==========================================================================
   University of Chenab — V3 homepage behaviour
   Vanilla JS only. Progressive enhancement, reduced-motion aware.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- utility bar: portals ---------- */
  var portalsBtn = $('[data-portals]');
  var portalsMenu = $('#portalsMenu');
  if (portalsBtn && portalsMenu) {
    portalsBtn.addEventListener('click', function () {
      var open = portalsBtn.getAttribute('aria-expanded') === 'true';
      portalsBtn.setAttribute('aria-expanded', String(!open));
      portalsMenu.hidden = open;
    });
  }

  /* ---------- mega panels ---------- */
  var panelBtns = $$('[data-panel]');

  function closePanels(except) {
    panelBtns.forEach(function (btn) {
      if (btn === except) return;
      btn.setAttribute('aria-expanded', 'false');
      var p = document.getElementById(btn.dataset.panel);
      if (p) p.hidden = true;
    });
  }

  panelBtns.forEach(function (btn) {
    var panel = document.getElementById(btn.dataset.panel);
    if (!panel) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      closePanels(btn);
      closeSearch();
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closePanels();
    closeSearch();
    closeDrawer();
  });

  document.addEventListener('click', function (e) {
    var head = $('#masthead');
    if (head && !head.contains(e.target)) closePanels();
    if (portalsBtn && portalsMenu && !portalsMenu.contains(e.target) && e.target !== portalsBtn && !portalsBtn.contains(e.target)) {
      portalsBtn.setAttribute('aria-expanded', 'false');
      portalsMenu.hidden = true;
    }
  });

  /* ---------- search ---------- */
  var searchBtn = $('[data-search]');
  var searchBox = $('#siteSearch');

  function closeSearch() {
    if (!searchBtn || !searchBox) return;
    searchBtn.setAttribute('aria-expanded', 'false');
    searchBox.hidden = true;
  }

  if (searchBtn && searchBox) {
    searchBtn.addEventListener('click', function () {
      var open = searchBtn.getAttribute('aria-expanded') === 'true';
      closePanels();
      searchBtn.setAttribute('aria-expanded', String(!open));
      searchBox.hidden = open;
      if (!open) { var i = $('#searchInput'); if (i) i.focus(); }
    });
    var closeEl = $('[data-search-close]', searchBox);
    if (closeEl) closeEl.addEventListener('click', function () { closeSearch(); searchBtn.focus(); });
  }

  /* ---------- mobile drawer ---------- */
  var burger = $('[data-drawer]');
  var drawer = $('#mobileNav');

  function closeDrawer() {
    if (!burger || !drawer) return;
    burger.setAttribute('aria-expanded', 'false');
    drawer.hidden = true;
    document.body.style.overflow = '';
  }

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      drawer.hidden = open;
      document.body.style.overflow = open ? '' : 'hidden';
    });
    $$('a', drawer).forEach(function (a) { a.addEventListener('click', closeDrawer); });
  }

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) closeDrawer();
  });

  /* ---------- sticky masthead shadow ---------- */
  var masthead = $('#masthead');
  if (masthead) {
    var onScroll = function () {
      masthead.classList.toggle('is-stuck', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- hero image sequence ---------- */
  var frames = $$('.hero__frame img');
  var dots = $$('.hero__dots button');
  if (frames.length > 1) {
    var current = 0;
    var timer = null;

    function show(i) {
      current = (i + frames.length) % frames.length;
      frames.forEach(function (img, n) { img.classList.toggle('is-active', n === current); });
      dots.forEach(function (d, n) { d.setAttribute('aria-selected', String(n === current)); });
    }

    function start() {
      if (reduced) return;
      stop();
      timer = window.setInterval(function () { show(current + 1); }, 6500);
    }
    function stop() { if (timer) window.clearInterval(timer); timer = null; }

    dots.forEach(function (d, n) {
      d.addEventListener('click', function () { show(n); start(); });
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    show(0);
    start();
  }

  /* ---------- degree finder tabs ---------- */
  var deptBtns = $$('.finder__depts [role="tab"]');
  var panels = $$('.finder__panel');

  function activateDept(index, focus) {
    deptBtns.forEach(function (b, n) {
      var on = n === index;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    panels.forEach(function (p, n) { p.hidden = n !== index; p.classList.toggle('is-active', n === index); });
  }

  deptBtns.forEach(function (btn, n) {
    btn.addEventListener('click', function () { activateDept(n); });
    btn.addEventListener('keydown', function (e) {
      var i = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') i = (n + 1) % deptBtns.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') i = (n - 1 + deptBtns.length) % deptBtns.length;
      if (e.key === 'Home') i = 0;
      if (e.key === 'End') i = deptBtns.length - 1;
      if (i === null) return;
      e.preventDefault();
      activateDept(i, true);
    });
  });

  /* ---------- faculty index hover preview ---------- */
  var facList = $('[data-fac]');
  var facPreview = $('.fac-preview');
  if (facList && facPreview && window.matchMedia('(min-width: 1025px)').matches) {
    var facImg = $('img', facPreview);
    $$('a', facList).forEach(function (link) {
      var enter = function () {
        var src = link.dataset.img;
        if (src && facImg.getAttribute('src') !== src) facImg.setAttribute('src', src);
        var r = link.getBoundingClientRect();
        var host = facList.getBoundingClientRect();
        facPreview.style.top = (r.top - host.top + r.height / 2) + 'px';
        facPreview.classList.add('is-on');
      };
      var leave = function () { facPreview.classList.remove('is-on'); };
      link.addEventListener('mouseenter', enter);
      link.addEventListener('focus', enter);
      link.addEventListener('mouseleave', leave);
      link.addEventListener('blur', leave);
    });
    facList.addEventListener('mouseleave', function () { facPreview.classList.remove('is-on'); });
  }

  /* ---------- counters ---------- */
  function runCounter(el) {
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    var suffix = el.dataset.suffix || '';
    if (reduced) { el.textContent = target + suffix; return; }
    var dur = 1400;
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  /* ---------- reveals ---------- */
  var revealTargets = [
    '.statement__grid', '.scale', '.sec-head', '.path-list li', '.finder',
    '.fac-index li', '.why__media', '.why__body', '.research__inner',
    '.news__lead', '.news__rest article', '.closing__inner', '.degrees__foot',
    '.faculties__head', '.faculties__foot'
  ];
  revealTargets.forEach(function (sel) {
    $$(sel).forEach(function (el, n) {
      el.setAttribute('data-reveal', '');
      el.style.transitionDelay = Math.min(n * 70, 350) + 'ms';
    });
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

    $$('[data-reveal]').forEach(function (el) { io.observe(el); });

    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        $$('[data-count]', entry.target).forEach(runCounter);
        co.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    $$('[data-counters]').forEach(function (el) { co.observe(el); });
  } else {
    $$('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
    $$('[data-count]').forEach(runCounter);
  }
})();
