"use strict";



const FACES = [
  "2024-00002040.jpg", "2024-00002095.jpg", "2024-00002352.jpg",
  "2024-00002546.jpg", "2024-00002736.jpg", "2024-00002990.jpg",
  "2024-00003052.jpg", "2024-00003063.jpg", "2024-00003251.jpg",
  "2025-00000085.jpg", "2025-00000103.jpg", "2025-00000181.jpg",
  "2025-00000183.jpg", "2025-00000297.jpg", "2025-00000346.jpg",
  "2025-00000552.jpg", "2025-00000611.jpg", "2025-00000633.jpg",
];

const wall = document.getElementById("heroWall");
const wallCount = document.getElementById("wallCount");

FACES.forEach(function (name, i) {
  const img = document.createElement("img");
  img.className = "face";
  img.src = "assets/faces/" + name;
  img.alt = "";
  img.loading = i < 6 ? "eager" : "lazy";
  img.decoding = "async";
  wall.appendChild(img);
});

if (wallCount) wallCount.textContent = String(FACES.length).padStart(2, "0");


function swapNeighbours() {
  const tiles = Array.from(wall.children);
  if (tiles.length < 2) return;

  const i = Math.floor(Math.random() * (tiles.length - 1));
  const a = tiles[i];
  const b = tiles[i + 1];

  const before = new Map();
  tiles.forEach(function (t) { before.set(t, t.getBoundingClientRect()); });

  const marker = document.createComment("swap");
  a.parentNode.insertBefore(marker, a);
  b.parentNode.insertBefore(a, b);
  marker.parentNode.insertBefore(b, marker);
  marker.remove();

  tiles.forEach(function (t) {
    const prev = before.get(t);
    const now = t.getBoundingClientRect();
    const dx = prev.left - now.left;
    const dy = prev.top - now.top;
    if (!dx && !dy) return;
    t.style.transition = "none";
    t.style.transform = "translate(" + dx + "px," + dy + "px)";
  });

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      tiles.forEach(function (t) {
        t.style.transition = "";
        t.style.transform = "";
      });
    });
  });
}

if (wall) {
  setInterval(function () {
    if (!document.hidden) swapNeighbours();
  }, 2400);
}



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
