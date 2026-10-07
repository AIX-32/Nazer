"use strict";


const heroWord = document.getElementById("heroWord");
requestAnimationFrame(function () { heroWord.classList.add("in"); });



const hd = document.getElementById("hd");
const hero = document.getElementById("hero");
let heroBottom = 0;

function measureHero() { heroBottom = hero.offsetTop + hero.offsetHeight; }
function navOnScroll() { hd.classList.toggle("visible", window.scrollY > heroBottom - 8); }

measureHero();
navOnScroll();
window.addEventListener("scroll", navOnScroll, { passive: true });
window.addEventListener("resize", measureHero);



const io = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal-up").forEach(function (el) { io.observe(el); });



const camCount = document.getElementById("camCount");
const TARGET = 25000;

const cio = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (!e.isIntersecting) return;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / 1800, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      camCount.textContent = Math.round(TARGET * eased).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    cio.unobserve(e.target);
  });
}, { threshold: 0.4 });

if (camCount) cio.observe(camCount);



const modal = document.getElementById("modal");

document.querySelectorAll(".js-modal").forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    modal.hidden = false;
  });
});

modal.addEventListener("click", function (e) {
  if (e.target.closest("[data-close]")) modal.hidden = true;
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") modal.hidden = true;
});
