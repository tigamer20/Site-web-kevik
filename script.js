(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var reduitMouvement = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Année du pied de page ---------- */
  var annee = document.getElementById("annee");
  if (annee) annee.textContent = new Date().getFullYear();

  /* ---------- En-tête au défilement ---------- */
  var entete = document.getElementById("entete");
  function majEntete() {
    entete.classList.toggle("defile", window.scrollY > 10);
  }
  majEntete();
  window.addEventListener("scroll", majEntete, { passive: true });

  /* ---------- Menu mobile ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var nav = document.getElementById("nav");
  function fermerMenu() {
    nav.classList.remove("ouvert");
    entete.classList.remove("menu-ouvert");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Ouvrir le menu");
  }
  menuBtn.addEventListener("click", function () {
    var ouvert = nav.classList.toggle("ouvert");
    entete.classList.toggle("menu-ouvert", ouvert);
    menuBtn.setAttribute("aria-expanded", String(ouvert));
    menuBtn.setAttribute("aria-label", ouvert ? "Fermer le menu" : "Ouvrir le menu");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) fermerMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fermerMenu();
  });

  /* ---------- Apparition des éléments ---------- */
  var elements = document.querySelectorAll(".revele");
  if ("IntersectionObserver" in window && !reduitMouvement) {
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (entree.isIntersecting) {
          entree.target.classList.add("visible");
          obs.unobserve(entree.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    elements.forEach(function (el) { obs.observe(el); });
  } else {
    elements.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Lien actif dans le menu ---------- */
  var liens = Array.prototype.slice.call(document.querySelectorAll('.nav a:not(.btn)'));
  var sections = liens
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    var obsNav = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        var id = "#" + entree.target.id;
        liens.forEach(function (a) { a.classList.toggle("actif", a.getAttribute("href") === id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { obsNav.observe(s); });
  }

  /* ---------- Copier le courriel ---------- */
  var copier = document.getElementById("copier");
  var statut = document.getElementById("copier-statut");
  if (copier) {
    copier.addEventListener("click", function () {
      var courriel = copier.getAttribute("data-courriel");
      function succes() { statut.textContent = "Adresse copiée ✦"; setTimeout(function () { statut.textContent = ""; }, 2500); }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(courriel).then(succes, function () { window.location.href = "mailto:" + courriel; });
      } else {
        window.location.href = "mailto:" + courriel;
      }
    });
  }

  /* ---------- Ciel étoilé ---------- */
  var canvas = document.getElementById("ciel");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var etoiles = [];
  var filantes = [];
  var largeur = 0, hauteur = 0, dpr = 1;

  function creerEtoiles() {
    var nombre = Math.round(Math.min(260, (largeur * hauteur) / 5200));
    etoiles = [];
    for (var i = 0; i < nombre; i++) {
      var doree = Math.random() < 0.18;
      etoiles.push({
        x: Math.random() * largeur,
        y: Math.random() * hauteur,
        r: Math.random() * 1.15 + 0.25,
        base: Math.random() * 0.55 + 0.25,
        vitesse: Math.random() * 0.0016 + 0.0004,
        phase: Math.random() * Math.PI * 2,
        couleur: doree ? "255, 222, 140" : "255, 255, 255"
      });
    }
  }

  function redimensionner() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    largeur = window.innerWidth;
    hauteur = window.innerHeight;
    canvas.width = largeur * dpr;
    canvas.height = hauteur * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    creerEtoiles();
    if (reduitMouvement) dessiner(0);
  }

  function lancerFilante() {
    var angle = Math.PI / 5 + Math.random() * 0.25;
    filantes.push({
      x: Math.random() * largeur * 0.7 + largeur * 0.1,
      y: Math.random() * hauteur * 0.35,
      vx: Math.cos(angle) * 9,
      vy: Math.sin(angle) * 9,
      vie: 0,
      duree: 70
    });
  }

  function dessiner(t) {
    ctx.clearRect(0, 0, largeur, hauteur);
    for (var i = 0; i < etoiles.length; i++) {
      var e = etoiles[i];
      var a = e.base + Math.sin(t * e.vitesse + e.phase) * 0.3;
      if (a < 0.05) a = 0.05;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + e.couleur + "," + a.toFixed(3) + ")";
      ctx.fill();
      if (e.r > 1.15) {
        ctx.fillStyle = "rgba(" + e.couleur + "," + (a * 0.18).toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (var j = filantes.length - 1; j >= 0; j--) {
      var f = filantes[j];
      f.vie++;
      f.x += f.vx;
      f.y += f.vy;
      var p = f.vie / f.duree;
      var opacite = p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8;
      var grad = ctx.createLinearGradient(f.x, f.y, f.x - f.vx * 12, f.y - f.vy * 12);
      grad.addColorStop(0, "rgba(255, 236, 180," + opacite + ")");
      grad.addColorStop(1, "rgba(255, 236, 180, 0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.lineTo(f.x - f.vx * 12, f.y - f.vy * 12);
      ctx.stroke();
      if (f.vie >= f.duree) filantes.splice(j, 1);
    }
  }

  var prochaineFilante = 2500;
  var dernier = 0;
  function boucle(t) {
    if (!document.hidden) {
      if (t - dernier > prochaineFilante) {
        lancerFilante();
        dernier = t;
        prochaineFilante = 5000 + Math.random() * 7000;
      }
      dessiner(t);
    }
    requestAnimationFrame(boucle);
  }

  var minuterie;
  window.addEventListener("resize", function () {
    // Sur mobile, la barre d'adresse change la hauteur au défilement : on ignore.
    if (window.innerWidth === largeur && Math.abs(window.innerHeight - hauteur) < 160) return;
    clearTimeout(minuterie);
    minuterie = setTimeout(redimensionner, 150);
  });

  redimensionner();
  if (!reduitMouvement) requestAnimationFrame(boucle);
})();
