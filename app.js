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
  window.copyText = function (elId, e) {
    if (e) e.stopPropagation();
    var text = document.getElementById(elId).textContent.trim();
    var btn = e ? e.currentTarget : null;

    var onSuccess = function() {
      if (btn) {
        var oldHTML = btn.innerHTML;
        btn.innerHTML = '&#10003;';
        btn.style.color = 'var(--accent)';
        setTimeout(function() {
          btn.innerHTML = oldHTML;
          btn.style.color = '';
        }, 2000);
      }
      showToast(btn);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess);
    } else {
      // Fallback for older browsers
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); onSuccess(); } catch (err) { /* silent */ }
      document.body.removeChild(ta);
    }
  };

  /* ── Toast notification ──────────────────── */
  function showToast(btn) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    
    if (btn) {
      var rect = btn.getBoundingClientRect();
      toast.style.left = (rect.left + rect.width / 2) + 'px';
      toast.style.top = (rect.top - 10) + 'px';
    }
    
    toast.classList.add('show');
    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(function () { toast.classList.remove('show'); }, 2000);
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

  /* ── Crypto Selection & QR Update ────────── */
  window.selectCrypto = function (type) {
    var text = document.getElementById(type).textContent.trim();
    var qrImg = document.getElementById('crypto-qr-img');
    var qrLbl = document.getElementById('crypto-qr-lbl');
    
    if (qrImg) {
      qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=' + encodeURIComponent(text) + '&color=6c63ff&bgcolor=ffffff';
    }
    if (qrLbl) {
      qrLbl.textContent = type.toUpperCase() + ' address';
    }

    document.querySelectorAll('.crypto-row').forEach(function(row) {
      row.classList.remove('active');
    });
    var activeRow = document.getElementById('row-' + type);
    if (activeRow) {
      activeRow.classList.add('active');
    }
  };

})();
