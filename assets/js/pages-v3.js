document.addEventListener("DOMContentLoaded", function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Reveal on scroll ---- */
  var items = document.querySelectorAll("[data-u3-reveal]");
  if (items.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
          });
        },
        { rootMargin: "0px 0px -5% 0px", threshold: 0 }
      );
      items.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---- Subnav — identical logic to academics-v3.js ---- */
  // The scrollable container is .uc-subnav__links (the <ul>) — same as academics CSS.
  var nav = document.querySelector(".uc-subnav");
  if (!nav) return;

  var rail = nav.querySelector(".uc-subnav__rail");
  var list = nav.querySelector(".uc-subnav__links");
  if (!rail || !list) return;

  // 1. Center active link on load (scroll the list, just like academics)
  var active = nav.querySelector(".uc-subnav__links a.active");
  if (active) {
    var off = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
    list.scrollLeft = Math.max(0, off);
  }

  // 2. Edge fades on the rail (decorative CSS ::before/::after)
  function edges() {
    rail.dataset.start = list.scrollLeft > 8 ? "0" : "1";
    rail.dataset.end   = list.scrollLeft + list.clientWidth < list.scrollWidth - 8 ? "0" : "1";
  }
  edges();
  list.addEventListener("scroll", edges, { passive: true });
  window.addEventListener("resize", edges);

  // 3. Scroll button — same pattern as academics-v3.js
  var scrollBtn = document.querySelector(".uc-subnav__scroll");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", function () {
      list.scrollBy({ left: list.clientWidth * 0.6, behavior: reduce ? "auto" : "smooth" });
    });
  }
});
