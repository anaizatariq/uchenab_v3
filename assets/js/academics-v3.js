/* University of Chenab â€” Academics experience layer (v3)
   Orientation + reading comfort helpers. Progressive enhancement only. */
(function () {
  "use strict";
  if (!document.body.classList.contains("acad")) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Subnav: mark current page, keep it in view ---------- */
  function initSubnav() {
    var nav = document.querySelector(".uc-subnav");
    if (!nav) return;
    var rail = nav.querySelector(".uc-subnav__rail");
    var list = nav.querySelector(".uc-subnav__links");
    var active = nav.querySelector(".uc-subnav__links a.active");
    if (active && list) {
      var off = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
      list.scrollLeft = Math.max(0, off);
    }
    if (!rail || !list) return;
    function edges() {
      rail.dataset.start = list.scrollLeft > 8 ? "0" : "1";
      rail.dataset.end =
        list.scrollLeft + list.clientWidth < list.scrollWidth - 8 ? "0" : "1";
    }
    edges();
    list.addEventListener("scroll", edges, { passive: true });
    window.addEventListener("resize", edges);

    var scrollBtn = document.getElementById("subnavScrollBtn");
    if (scrollBtn) {
      scrollBtn.addEventListener("click", function() {
        list.scrollBy({ left: list.clientWidth * 0.6, behavior: reduce ? "auto" : "smooth" });
      });
    }
  }

  /* ---------- 2. On-this-page nav: build mobile chips + scrollspy ---------- */
  function initToc() {
    var sidebar = document.getElementById("program-scrollspy");
    var doc = document.querySelector(".acad-doc");
    if (!sidebar || !doc) return;

    var links = Array.prototype.slice.call(sidebar.querySelectorAll("a[href^='#']"));
    if (!links.length) return;

    // Mobile chip rail mirrors the sidebar
    var mobile = document.createElement("nav");
    mobile.className = "acad-toc-mobile";
    mobile.setAttribute("aria-label", "On this page");
    var scroll = document.createElement("div");
    scroll.className = "acad-toc-mobile__scroll container";
    links.forEach(function (a) {
      var c = document.createElement("a");
      c.href = a.getAttribute("href");
      c.textContent = a.textContent.trim();
      scroll.appendChild(c);
    });
    mobile.appendChild(scroll);
    var anchor = document.querySelector(".acad-shell") || doc;
    anchor.parentNode.insertBefore(mobile, anchor);
    var chips = Array.prototype.slice.call(scroll.querySelectorAll("a"));

    var targets = links
      .map(function (a) {
        return document.querySelector(a.getAttribute("href"));
      })
      .filter(Boolean);
    if (!targets.length) return;

    function setActive(id) {
      links.concat(chips).forEach(function (a) {
        var on = a.getAttribute("href") === "#" + id;
        a.classList.toggle("active", on);
        if (on && a.parentNode === scroll) {
          var off = a.offsetLeft - (scroll.clientWidth - a.offsetWidth) / 2;
          scroll.scrollTo({ left: Math.max(0, off), behavior: reduce ? "auto" : "smooth" });
        }
      });
    }

    var visible = {};
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          visible[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0;
        });
        var best = null,
          score = 0;
        targets.forEach(function (t) {
          if ((visible[t.id] || 0) > score) {
            score = visible[t.id];
            best = t.id;
          }
        });
        if (best) setActive(best);
      },
      { rootMargin: "-140px 0px -55% 0px", threshold: [0, 0.15, 0.4, 0.75, 1] }
    );
    targets.forEach(function (t) {
      io.observe(t);
    });
    setActive(targets[0].id);
  }

  /* ---------- 3. Tables: hint when horizontally scrollable ---------- */
  function initTables() {
    document.querySelectorAll(".acad-tablewrap").forEach(function (wrap) {
      var box = wrap.querySelector(".table-responsive");
      if (!box) return;
      var check = function () {
        wrap.classList.toggle("is-scrollable", box.scrollWidth > box.clientWidth + 4);
      };
      check();
      window.addEventListener("resize", check);
    });
  }

  /* ---------- 4. Reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-acad-reveal]");
    if (!items.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- 5. Reading progress + back to top ---------- */
  function initChrome() {
    var bar = document.createElement("div");
    bar.className = "acad-progress";
    document.body.appendChild(bar);

    var top = document.createElement("button");
    top.type = "button";
    top.className = "acad-top";
    top.setAttribute("aria-label", "Back to top");
    top.innerHTML = '<i class="bi bi-arrow-up"></i>';
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
    document.body.appendChild(top);

    var tick = false;
    function onScroll() {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var p = h > 0 ? (window.scrollY / h) * 100 : 0;
        bar.style.width = p + "%";
        top.classList.toggle("is-on", window.scrollY > 900);
        tick = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 6. Filters & Simplified View ---------- */
  function initFilters() {
    var checkboxes = document.querySelectorAll(".filter-checkbox");
    if (!checkboxes.length) return;

    var courseList = document.getElementById("courseList");
    var clearBtn = document.getElementById("clearFilters");
    var toggleView = document.getElementById("simplifiedViewToggle");
    var items = document.querySelectorAll(".uc-course-item");
    var resultsCount = document.getElementById("resultsCount");
    
    function applyFilters() {
      var activeGroups = Array.prototype.slice.call(document.querySelectorAll(".uc-filter-acc .accordion-item"))
        .map(function(item) {
          return Array.prototype.slice.call(item.querySelectorAll(".filter-checkbox:checked"))
            .map(function(cb) { return cb.value.toLowerCase(); });
        })
        .filter(function(group) { return group.length > 0; });

      var count = 0;
      items.forEach(function(item) {
        var cats = (item.getAttribute("data-category") || "").toLowerCase().split(/\s+/);
        var matches = true;
        if (activeGroups.length > 0) {
           matches = activeGroups.every(function(group) {
             return group.some(function(val) { return cats.indexOf(val) !== -1; });
           });
        }
        
        if (matches) {
          item.style.display = "";
          count++;
        } else {
          item.style.display = "none";
        }
      });

      if (resultsCount) {
        resultsCount.innerHTML = "Results: <strong>" + count + "</strong> (of " + items.length + " total)";
      }
    }

    checkboxes.forEach(function(cb) {
      cb.addEventListener("change", applyFilters);
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", function(e) {
        e.preventDefault();
        checkboxes.forEach(function(cb) { cb.checked = false; });
        applyFilters();
      });
    }

    if (toggleView && courseList) {
      toggleView.addEventListener("change", function() {
        if (this.checked) {
          courseList.classList.add("is-simplified");
        } else {
          courseList.classList.remove("is-simplified");
        }
      });
    }
  }

  /* ---------- 0. Measure sticky header so offsets never guess ---------- */
  function initOffsets() {
    var header = document.querySelector(".v2-header");
    var set = function () {
      var h = header ? Math.round(header.getBoundingClientRect().height) : 76;
      document.body.style.setProperty("--acad-headerh", h + "px");
    };
    set();
    window.addEventListener("resize", set);
    window.addEventListener("load", set);
  }

  function boot() {
    initOffsets();
    initSubnav();
    initToc();
    initTables();
    initReveal();
    initChrome();
    initFilters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

/* =========================================================
   INLINE EXPANDING PROGRAM SEARCH LOGIC
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const inlineSearchWrappers = document.querySelectorAll('.acad-inline-search');
    
    inlineSearchWrappers.forEach(wrapper => {
        const btn = wrapper.querySelector('.acad-inline-search-btn');
        const input = wrapper.querySelector('.acad-inline-search-input');
        const dropdown = wrapper.querySelector('.acad-search-results-dropdown');
        const resultList = dropdown.querySelector('ul');
        
        if(!btn || !input || !dropdown) return;

        // Open search on click
        btn.addEventListener('click', (e) => {
            // Prevent navigating if it's acting as a button now
            if(e.target.tagName !== 'A' || btn.tagName === 'BUTTON' || wrapper.classList.contains('is-expanded')) {
                e.preventDefault();
            }
            
            if(!wrapper.classList.contains('is-expanded')) {
                wrapper.classList.add('is-expanded'); document.body.classList.add('search-is-active'); const hero = wrapper.closest('.acad-hero'); if(hero) hero.classList.add('search-is-active');
                input.focus();
            }
        });

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if(!wrapper.contains(e.target)) {
                wrapper.classList.remove('is-expanded'); document.body.classList.remove('search-is-active'); const hero = wrapper.closest('.acad-hero'); if(hero) hero.classList.remove('search-is-active');
                dropdown.classList.remove('is-active');
                input.value = ''; // clear on close
            }
        });

        // Live filtering logic
        input.addEventListener('input', () => {
            const query = input.value.toLowerCase().trim();
            
            if(query.length < 2) {
                dropdown.classList.remove('is-active');
                return;
            }

            if(typeof acadProgramIndex !== 'undefined') {
                const matches = acadProgramIndex.filter(p => p.title.toLowerCase().includes(query));
                
                resultList.innerHTML = '';
                
                if(matches.length > 0) {
                    matches.forEach(match => {
                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        a.href = '../academics/' + match.url;
                        
                        // Fix paths if we are already in root (like index.html)
                        if(window.location.pathname.endsWith('/index.html') && !window.location.pathname.includes('/academics/')) {
                            a.href = 'academics/' + match.url;
                        } else if (window.location.pathname.includes('/admissions/')) {
                            a.href = '../academics/' + match.url;
                        } else {
                             a.href = match.url; // We are in academics folder
                        }

                        a.innerHTML = match.title + ' <i class="bi bi-arrow-right-short text-muted ms-2"></i>';
                        li.appendChild(a);
                        resultList.appendChild(li);
                    });
                } else {
                    resultList.innerHTML = '<li class="acad-search-results-empty">No programs found for "'+query+'"</li>';
                }
                
                dropdown.classList.add('is-active');
            }
        });
    });
});

