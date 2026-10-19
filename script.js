const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));
document.getElementById('year').textContent = new Date().getFullYear();
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.main-nav a')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = entry.target.id;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + target));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => observer.observe(section));
document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  document.querySelector('.form-status').textContent =
    `Teşekkürler ${name}. Bu demo formu mesaj göndermiyor; yayına almadan önce firma e-postası veya form servisi bağlanmalı.`;
});
