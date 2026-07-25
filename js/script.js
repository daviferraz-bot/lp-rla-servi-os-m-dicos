/* ============================================================
   Dra. Maria Eduarda Deon Ceccato — interações da landing
   ============================================================ */
(function () {
  "use strict";

  /* --- Ano no rodapé --- */
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* --- Menu mobile --- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Fecha ao clicar num link
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });
    // Fecha com ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* --- Sombra do header ao rolar --- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- Reveal ao entrar na viewport --- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
