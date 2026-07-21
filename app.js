/* ==============================================
   Aster Dev · Donate — app.js
   ============================================== */

(function () {
  'use strict';

  /* ── Mobile nav ──────────────────────────── */
  var mobBtn  = document.getElementById('mobBtn');
  var navList = document.getElementById('navList');

  if (mobBtn && navList) {
    mobBtn.addEventListener('click', function () {
      navList.classList.toggle('open');
    });
    navList.querySelectorAll('.nav__link').forEach(function (a) {
      a.addEventListener('click', function () {
        navList.classList.remove('open');
      });
    });
  }

  /* ── Donation panel toggle ───────────────── */
  window.togglePanel = function (id) {
    var panel   = document.getElementById('panel-' + id);
    var wasOpen = panel.classList.contains('open');

    // Close all panels first
    document.querySelectorAll('.d-panel').forEach(function (p) {
      p.classList.remove('open');
    });

    if (!wasOpen) {
      panel.classList.add('open');
      setTimeout(function () {
        document.getElementById('card-' + id)
          .scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    }
  };

  window.closePanel = function (id) {
    document.getElementById('panel-' + id).classList.remove('open');
  };

  /* ── Copy to clipboard ───────────────────── */
  window.copyText = function (elId) {
    var text = document.getElementById(elId).textContent.trim();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showToast);
    } else {
      // Fallback for older browsers
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showToast(); } catch (e) { /* silent */ }
      document.body.removeChild(ta);
    }
  };

  /* ── Toast notification ──────────────────── */
  function showToast() {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  /* ── Smooth scroll for anchor links ─────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
