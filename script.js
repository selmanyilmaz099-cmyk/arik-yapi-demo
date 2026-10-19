/* =====================================================
   ARIK YAPI — script.js
   Aşama 2: Scroll animasyonları + Header scroll efekti
   ===================================================== */

'use strict';

/* ── prefers-reduced-motion kontrolü ── */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Yıl ── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Hamburger Menü ── */
const toggle = document.querySelector('.menu-toggle');
const nav    = document.querySelector('.main-nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menüyü aç');
  });
});

/* ── Aktif nav bağlantısı (IntersectionObserver) ── */
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.main-nav a')];

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(link =>
      link.classList.toggle('active', link.getAttribute('href') === '#' + id)
    );
  });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

/* ── Header: scroll'da cam yoğunlaşır ── */
const header = document.querySelector('.site-header');

const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // ilk yüklemede kontrol

/* ── Scroll Animasyonu ── */
if (!prefersReduced) {
  /* Animasyon uygulanacak elementleri seç */
  const revealTargets = [
    '.section-label',
    '.intro-grid > div',
    '.value-card',
    '.service-card',
    '.project-placeholder',
    '.realestate-copy',
    '.contact-copy',
    '.contact-form',
    '.founder-content > *',
  ];

  const revealEls = document.querySelectorAll(revealTargets.join(', '));

  /* Gecikme sınıfları: aynı ebeveyn içindeki kardeşlere sıralı gecikme */
  revealEls.forEach(el => {
    el.classList.add('reveal');

    /* Kardeş indexine göre gecikme ekle (max 3 adım) */
    const siblings = [...(el.parentElement?.children ?? [])].filter(c =>
      c.classList.contains('reveal')
    );
    const idx = siblings.indexOf(el);
    if (idx === 1) el.classList.add('reveal-delay-1');
    if (idx === 2) el.classList.add('reveal-delay-2');
    if (idx >= 3)  el.classList.add('reveal-delay-3');
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); /* bir kez çalıştır */
      }
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));
}

/* ── İletişim Formu ── */
document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const name   = document.getElementById('name').value.trim();
  const status = document.querySelector('.form-status');
  status.textContent =
    `Teşekkürler ${name}. Bu demo formu mesaj göndermiyor; ` +
    `yayına almadan önce firma e-postası veya form servisi (Formspree vb.) bağlanmalı.`;
  status.setAttribute('role', 'alert');
});
