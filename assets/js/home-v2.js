/* University of Chenab — Homepage v2 interactions
   Scope: mega-menu, sticky header, portals dropdown, search drawer,
   hero rotator, animated counters, program finder. Vanilla JS, no deps. */
(function () {
  "use strict";

  var doc = document;

  /* ---------- Footer year ---------- */
  var year = doc.getElementById("v2Year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------- */
  var header = doc.querySelector(".v2-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Utility-bar portals dropdown ---------- */
  var portals = doc.querySelector(".v2-portals");
  if (portals) {
    var pTrigger = portals.querySelector(".v2-portals__trigger");
    var closePortals = function () {
      portals.classList.remove("is-open");
      pTrigger.setAttribute("aria-expanded", "false");
    };
    pTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = portals.classList.toggle("is-open");
      pTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    doc.addEventListener("click", function (e) {
      if (!portals.contains(e.target)) closePortals();
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePortals();
    });
  }

  /* ---------- Mega menu (click + hover + keyboard) ---------- */
  var megaItems = Array.prototype.slice.call(doc.querySelectorAll(".v2-nav__item.has-mega"));
  var closeAllMega = function (except) {
    megaItems.forEach(function (item) {
      if (item === except) return;
      item.classList.remove("is-open");
      var btn = item.querySelector(".v2-nav__link");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  };

  megaItems.forEach(function (item) {
    var btn = item.querySelector(".v2-nav__link");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var willOpen = !item.classList.contains("is-open");
      closeAllMega(item);
      item.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });

    var hoverTimer;
    item.addEventListener("mouseenter", function () {
      if (window.matchMedia("(min-width: 1200px)").matches) {
        clearTimeout(hoverTimer);
        closeAllMega(item);
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
    item.addEventListener("mouseleave", function () {
      if (window.matchMedia("(min-width: 1200px)").matches) {
        hoverTimer = setTimeout(function () {
          item.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
        }, 140);
      }
    });
  });

  doc.addEventListener("click", function (e) {
    if (!e.target.closest(".v2-nav__item")) closeAllMega(null);
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllMega(null);
  });

  /* ---------- Search drawer ---------- */
  var searchDrawer = doc.getElementById("v2Search");
  doc.querySelectorAll("[data-v2-search]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!searchDrawer) return;
      searchDrawer.hidden = !searchDrawer.hidden;
      if (!searchDrawer.hidden) {
        var input = searchDrawer.querySelector("input");
        if (input) input.focus();
      }
    });
  });
  doc.querySelectorAll("[data-v2-search-close]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (searchDrawer) searchDrawer.hidden = true;
    });
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && searchDrawer && !searchDrawer.hidden) searchDrawer.hidden = true;
  });

  /* ---------- Hero rotator ---------- */
  var slides = Array.prototype.slice.call(doc.querySelectorAll(".v2-hero__slide"));
  var dots = Array.prototype.slice.call(doc.querySelectorAll(".v2-hero__dots button"));
  if (slides.length > 1) {
    var index = 0;
    var timer = null;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var show = function (next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("is-active", i === index); });
      dots.forEach(function (d, i) { d.setAttribute("aria-current", i === index ? "true" : "false"); });
    };

    var play = function () {
      if (reduced) return;
      clearInterval(timer);
      timer = setInterval(function () { show(index + 1); }, 6500);
    };

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { show(i); play(); });
    });

    show(0);
    play();
  }

  /* ---------- V3 Hero Premium Slider ---------- */
  var v3Slides = Array.prototype.slice.call(doc.querySelectorAll(".v3-hero-slide"));
  var v3ProgressItems = Array.prototype.slice.call(doc.querySelectorAll(".v3-progress-item"));
  if (v3Slides.length > 1 && v3ProgressItems.length > 0) {
    var v3Index = 0;
    var v3Timer = null;
    var v3Duration = 2500; // Fast 2.5s duration for a video-like kinetic feel

    // Apply baseline styles to make transitions smooth and fast
    v3Slides.forEach(function(s) {
       s.style.transition = "opacity 0.6s ease-in-out, transform 4s ease-out";
       s.style.position = "absolute";
       s.style.top = "0";
       s.style.left = "0";
       s.style.width = "100%";
       s.style.height = "100%";
       s.style.backgroundSize = "cover";
       s.style.backgroundPosition = "center";
       s.style.opacity = "0";
       s.style.transform = "scale(1.05)";
    });

    var v3Show = function (next) {
      v3Index = (next + v3Slides.length) % v3Slides.length;
      
      v3Slides.forEach(function (s, i) { 
        if (i === v3Index) {
          s.classList.add("is-active");
          s.style.opacity = "1";
          s.style.transform = "scale(1)";
        } else {
          s.classList.remove("is-active");
          s.style.opacity = "0";
          s.style.transform = "scale(1.05)";
        }
      });

      v3ProgressItems.forEach(function (p, i) { 
        if (i === v3Index) {
          p.classList.add("is-active");
        } else {
          p.classList.remove("is-active");
        }
      });
    };

    var v3Play = function () {
      clearInterval(v3Timer);
      v3Timer = setInterval(function () { v3Show(v3Index + 1); }, v3Duration);
    };

    v3ProgressItems.forEach(function (item, i) {
      item.style.cursor = "pointer";
      item.addEventListener("click", function () { 
        v3Show(i); 
        v3Play(); 
      });
    });

    v3Show(0);
    v3Play();
  }

  /* ---------- Animated counters ---------- */
  var counters = Array.prototype.slice.call(doc.querySelectorAll("[data-count]"));
  if (counters.length && "IntersectionObserver" in window) {
    var run = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = target.toLocaleString() + suffix;
        return;
      }
      var start = null;
      var dur = 1400;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (c) { io.observe(c); });
  }

  /* ---------- Program finder ---------- */
  var finder = doc.getElementById("v2Finder");
  if (finder) {
    finder.addEventListener("submit", function (e) {
      e.preventDefault();
      var level = finder.querySelector("#v2Level").value;
      var faculty = finder.querySelector("#v2Faculty").value;
      var q = finder.querySelector("#v2Keyword").value.trim();
      var params = [];
      if (level) params.push("level=" + encodeURIComponent(level));
      if (faculty) params.push("faculty=" + encodeURIComponent(faculty));
      if (q) params.push("q=" + encodeURIComponent(q));
      window.location.href = "./admissions/degree-finder.html" + (params.length ? "?" + params.join("&") : "");
    });
  }

  /* ---------- Accreditation rail arrows ---------- */
  var rail = doc.querySelector(".v2-accred__track");
  doc.querySelectorAll("[data-rail]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!rail) return;
      var dir = btn.getAttribute("data-rail") === "prev" ? -1 : 1;
      rail.scrollBy({ left: dir * 340, behavior: "smooth" });
    });
  });

  /* ---------- Active Navbar Link Auto-highlight ---------- */
  var navLinks = doc.querySelectorAll(".v2-nav__link");
  var currentUrl = window.location.href.split('?')[0].split('#')[0];
  
  navLinks.forEach(function (link) {
    if (!link.href) return;
    
    // 1. Exact match (handles root and direct page hits)
    if (link.href.split('?')[0].split('#')[0] === currentUrl) {
      link.classList.add("active");
      return;
    }
    
    // 2. Sub-section matching (e.g. highlighting "Academics" when on "/academics/postgraduate.html")
    var hrefAttr = link.getAttribute("href");
    if (hrefAttr && hrefAttr.startsWith("./") && hrefAttr.endsWith("/index.html")) {
      var section = hrefAttr.slice(2, -11); // extracts "academics" from "./academics/index.html"
      if (section && currentUrl.indexOf("/" + section + "/") !== -1) {
        link.classList.add("active");
      }
    }
  });

})();
