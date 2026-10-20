'use strict';

/* ── prefers-reduced-motion ── */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Yıl ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ================================================================
   INTRO ANİMASYONU
   ================================================================ */
(function initIntro() {
  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  /* Reduced motion: animasyonu gösterme */
  if (prefersReduced) {
    overlay.classList.add('skip');
    return;
  }

  /* Aynı session'da tekrar oynamasın (URL'de ?intro veya #intro varsa her zaman oynat) */
  const forceIntro = window.location.search.includes('intro') || window.location.hash.includes('intro');
  if (!forceIntro && sessionStorage.getItem('intro_played')) {
    overlay.classList.add('skip');
    return;
  }

  /* ~2 saniye sonra overlay kaldır */
  setTimeout(() => {
    overlay.classList.add('exit');
    /* Transition bitince DOM'dan kaldır */
    overlay.addEventListener('transitionend', () => {
      overlay.remove();
    }, { once: true });
    sessionStorage.setItem('intro_played', '1');
  }, 2200);
})();

/* ================================================================
   HEADER — Scroll'da yoğunlaş
   ================================================================ */
(function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('solid', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ================================================================
   MOBİL MENÜ
   ================================================================ */
(function initMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav    = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  });

  /* Menüdeki bağlantıya tıklayınca kapat */
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Menüyü aç');
    });
  });

  /* Dışarı tıklayınca kapat */
  document.addEventListener('click', e => {
    if (nav.classList.contains('open') &&
        !nav.contains(e.target) &&
        !toggle.contains(e.target)) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ================================================================
   AKTİF NAV BAĞLANTISI — IntersectionObserver
   ================================================================ */
(function initActiveNav() {
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.main-nav a')];
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link =>
        link.classList.toggle('active', link.getAttribute('href')?.includes('#' + id) ||
          (id === 'ana-sayfa' && link.getAttribute('href') === 'index.html'))
      );
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* ================================================================
   SCROLL REVEAL ANİMASYONLARI
   ================================================================ */
(function initReveal() {
  if (prefersReduced) return;

  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -72px 0px',
    threshold: 0.1
  });

  els.forEach(el => observer.observe(el));
})();

/* ================================================================
   İLETİŞİM FORMU
   ================================================================ */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name   = (document.getElementById('name')?.value || '').trim();
    const status = form.querySelector('.form-status');
    if (!status) return;
    status.textContent =
      `Teşekkürler${name ? ', ' + name : ''}. Bu demo formu mesaj göndermiyor; ` +
      `form servisi (Formspree, Web3Forms vb.) bağlandıktan sonra aktif olacaktır.`;
    status.setAttribute('role', 'alert');
  });
})();
