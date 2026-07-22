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

  /* ── Modal toggle ──────────────────────────── */
  window.openModal = function (id) {
    var modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
  };

  window.closeModal = function (id) {
    var modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
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

  /* ── Theme Toggle ────────────────────────── */
  var themeToggle = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');
  var currentTheme = localStorage.getItem('theme') || 'light';

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.innerHTML = '&#9728;&#65039;'; // Sun icon
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.innerHTML = '&#127769;'; // Moon icon
      localStorage.setItem('theme', 'light');
    }
  }

  // Initialize theme
  setTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      var isDark = document.documentElement.hasAttribute('data-theme');
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  /* ── Mobile Grid Carousel ────────────────── */
  var grid = document.getElementById('projectsGrid');
  var btnPrev = document.getElementById('btnPrev');
  var btnNext = document.getElementById('btnNext');

  if (grid && btnPrev && btnNext) {
    btnNext.addEventListener('click', function() {
      var itemWidth = grid.querySelector('.m-card').offsetWidth + 20;
      // Se chegou no final, volta pro início suavemente
      if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 10) {
        grid.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        grid.scrollBy({ left: itemWidth, behavior: 'smooth' });
      }
    });

    btnPrev.addEventListener('click', function() {
      var itemWidth = grid.querySelector('.m-card').offsetWidth + 20;
      // Se está no início, vai pro final suavemente
      if (grid.scrollLeft <= 10) {
        grid.scrollTo({ left: grid.scrollWidth, behavior: 'smooth' });
      } else {
        grid.scrollBy({ left: -itemWidth, behavior: 'smooth' });
      }
    });
  }

  /* ── i18n & Language Selection ───────────── */
  var langBtn = document.getElementById('langBtn');
  var langDropdown = document.getElementById('langDropdown');
  var currentLangEl = document.getElementById('currentLang');
  var localesDict = {}; // Will be populated dynamically via fetch

  var langMap = {
    'br': 'PT-BR', 'en': 'EN-US', 'es': 'ES', 'fr': 'FR',
    'de': 'DE', 'it': 'IT', 'nl': 'NL', 'pt': 'PT-PT',
    'id': 'ID', 'ru': 'RU', 'vn': 'VN', 'ar': 'AR',
    'cn': 'CN', 'jp': 'JP', 'kr': 'KR'
  };

  // The available languages
  var availableLangs = Object.keys(langMap);

  function getBrowserLang() {
    var l = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (l === 'pt-br') return 'br';
    if (l.startsWith('pt')) return 'pt';
    if (l.startsWith('zh')) return 'cn';
    if (l.startsWith('ja')) return 'jp';
    if (l.startsWith('ko')) return 'kr';
    if (l.startsWith('vi')) return 'vn';
    var shortLang = l.substring(0, 2);
    if (availableLangs.indexOf(shortLang) > -1) return shortLang;
    return 'en';
  }

  var currentLang = localStorage.getItem('lang') || 'en';

  function applyLanguageDOM(lang, data) {
    if (currentLangEl) currentLangEl.textContent = langMap[lang] || lang.toUpperCase();

    // Update active state in dropdown
    document.querySelectorAll('.lang-option').forEach(function(opt) {
      if (opt.getAttribute('data-lang') === lang) opt.classList.add('active');
      else opt.classList.remove('active');
    });

    // Translate DOM
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (data[key]) {
        el.innerHTML = data[key]; 
      }
    });
  }

  function setLanguage(lang) {
    if (availableLangs.indexOf(lang) === -1) lang = 'en';

    // Se já temos em memória
    if (localesDict[lang]) {
      localStorage.setItem('lang', lang);
      currentLang = lang;
      applyLanguageDOM(lang, localesDict[lang]);
      return;
    }

    // Carregar via Fetch
    fetch('locales/' + lang + '.json')
      .then(function(res) {
        if (!res.ok) throw new Error('Failed to load locale');
        return res.json();
      })
      .then(function(data) {
        localesDict[lang] = data;
        localStorage.setItem('lang', lang);
        currentLang = lang;
        applyLanguageDOM(lang, data);
      })
      .catch(function(err) {
        console.error('Error loading language file:', err);
      });
  }

  // Populate Dropdown
  if (langDropdown) {
    var langKeys = availableLangs.sort();
    langKeys.forEach(function(l) {
      var btn = document.createElement('button');
      btn.className = 'lang-option' + (l === currentLang ? ' active' : '');
      btn.setAttribute('data-lang', l);
      btn.type = 'button';
      btn.textContent = langMap[l] || l.toUpperCase();
      btn.addEventListener('click', function() {
        setLanguage(l);
        langDropdown.classList.remove('show');
      });
      langDropdown.appendChild(btn);
    });
  }

  // Toggle dropdown
  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      langDropdown.classList.toggle('show');
    });
    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
        langDropdown.classList.remove('show');
      }
    });
  }

  // Initial load logic with IP Geolocation
  function initLanguage() {
    var storedLang = localStorage.getItem('lang');
    if (storedLang) {
      currentLang = storedLang;
      setLanguage(currentLang);
    } else {
      // Detect based on physical location (IP)
      fetch('https://get.geojs.io/v1/ip/country.json')
        .then(function(res) { return res.json(); })
        .then(function(data) {
          var countryMap = {
            'BR': 'br', 'PT': 'pt', 
            'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es', 'VE': 'es',
            'FR': 'fr', 'DE': 'de', 'IT': 'it', 'NL': 'nl', 'ID': 'id', 'RU': 'ru', 'VN': 'vn',
            'SA': 'ar', 'AE': 'ar', 'EG': 'ar', 'MA': 'ar',
            'CN': 'cn', 'TW': 'cn', 'HK': 'cn',
            'JP': 'jp', 'KR': 'kr'
          };
          currentLang = countryMap[data.country] || getBrowserLang();
          setLanguage(currentLang);
        })
        .catch(function(err) {
          // Fallback to browser language if API fails
          currentLang = getBrowserLang();
          setLanguage(currentLang);
        });
    }
  }

  initLanguage();

})();
