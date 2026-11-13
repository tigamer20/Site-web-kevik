(function () {
  "use strict";

  var calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Année
  document.querySelectorAll(".annee").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Menu téléphone
  var bouton = document.getElementById("menu-btn");
  var nav = document.getElementById("nav");
  if (bouton && nav) {
    bouton.addEventListener("click", function () {
      var ouvert = nav.classList.toggle("ouvert");
      bouton.setAttribute("aria-expanded", String(ouvert));
      bouton.textContent = ouvert ? "Fermer" : "Menu";
    });
  }

  // Copier l'adresse courriel
  var copier = document.getElementById("copier");
  var statut = document.getElementById("copier-statut");
  if (copier && navigator.clipboard && window.isSecureContext) {
    copier.addEventListener("click", function () {
      navigator.clipboard.writeText(copier.dataset.courriel).then(function () {
        statut.textContent = "copiée!";
        setTimeout(function () { statut.textContent = ""; }, 2000);
      });
    });
  } else if (copier) {
    copier.hidden = true;
  }

  // Ciel étoilé
  var canvas = document.getElementById("ciel");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var etoiles = [];
  var filante = null;
  var l = 0, h = 0;

  function preparer() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    l = window.innerWidth;
    h = window.innerHeight;
    canvas.width = l * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    etoiles = [];
    var n = Math.round(Math.min(160, (l * h) / 9000));
    for (var i = 0; i < n; i++) {
      etoiles.push({
        x: Math.random() * l,
        y: Math.random() * h,
        r: Math.random() < 0.9 ? Math.random() * 0.8 + 0.3 : Math.random() * 0.6 + 1.1,
        a: Math.random() * 0.5 + 0.2,
        v: Math.random() * 0.0012 + 0.0003,
        p: Math.random() * 6.28
      });
    }
    dessiner(0);
  }

  function dessiner(t) {
    ctx.clearRect(0, 0, l, h);
    for (var i = 0; i < etoiles.length; i++) {
      var e = etoiles[i];
      var a = calme ? e.a : Math.max(0.05, e.a + Math.sin(t * e.v + e.p) * 0.2);
      ctx.fillStyle = "rgba(255,248,230," + a.toFixed(2) + ")";
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, 6.28);
      ctx.fill();
    }
    if (filante) {
      var f = filante;
      f.x += f.vx; f.y += f.vy; f.vie--;
      var g = ctx.createLinearGradient(f.x, f.y, f.x - f.vx * 10, f.y - f.vy * 10);
      g.addColorStop(0, "rgba(255,240,200," + (f.vie / 60).toFixed(2) + ")");
      g.addColorStop(1, "rgba(255,240,200,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.lineTo(f.x - f.vx * 10, f.y - f.vy * 10);
      ctx.stroke();
      if (f.vie <= 0) filante = null;
    }
  }

  var prochaine = 8000;
  function boucle(t) {
    if (!document.hidden) {
      if (!filante && t > prochaine) {
        filante = { x: Math.random() * l * 0.8, y: Math.random() * h * 0.3, vx: 7, vy: 3.5, vie: 60 };
        prochaine = t + 12000 + Math.random() * 15000;
      }
      dessiner(t);
    }
    requestAnimationFrame(boucle);
  }

  var largeurAvant = 0;
  window.addEventListener("resize", function () {
    // Sur téléphone, la barre d'adresse change la hauteur en défilant : on ignore.
    if (window.innerWidth === largeurAvant) return;
    largeurAvant = window.innerWidth;
    preparer();
  });

  largeurAvant = window.innerWidth;
  preparer();
  if (!calme) requestAnimationFrame(boucle);
})();
