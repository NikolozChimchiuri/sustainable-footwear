// loader
window.addEventListener('load', () => setTimeout(() => document.getElementById('loader').classList.add('done'), 350));

// progress + back-to-top + nav highlight
const bar = document.getElementById('progress');
const topBtn = document.getElementById('topbtn');
const links = [...document.querySelectorAll('#menu a')];

function onScroll() {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (scrollY / h * 100) + '%';
  topBtn.classList.toggle('show', scrollY > 600);
  let cur = 'home';
  document.querySelectorAll('section[id]').forEach(s => {
    if (scrollY >= s.offsetTop - 200) cur = s.id;
  });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}

addEventListener('scroll', onScroll, { passive: true });
onScroll();
topBtn.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

// smooth scroll for all in-page links (header offset)
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  if (id.length < 2) return;
  const t = document.querySelector(id);
  if (!t) return;
  e.preventDefault();
  dd.classList.remove('open');
  window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' });
}));

// product gallery lightbox with prev/next, click and keyboard
const prods = [...document.querySelectorAll('.prod')];
let pi = 0;
const lb = document.getElementById('lb');

function showP(i) {
  pi = (i + prods.length) % prods.length;
  const p = prods[pi];
  document.getElementById('lbImg').innerHTML = p.querySelector('.pimg').innerHTML;
  document.getElementById('lbT').textContent = p.querySelector('h3').textContent;
  document.getElementById('lbD').textContent = p.querySelector('p').textContent;
  document.getElementById('lbN').textContent = (pi + 1) + ' / ' + prods.length;
}

function closeLb() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

prods.forEach((p, i) => p.onclick = () => {
  showP(i);
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
});

document.getElementById('lbClose').onclick = closeLb;
document.getElementById('lbPrev').onclick = () => showP(pi - 1);
document.getElementById('lbNext').onclick = () => showP(pi + 1);
lb.onclick = e => { if (e.target === lb) closeLb(); };

addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') showP(pi - 1);
  if (e.key === 'ArrowRight') showP(pi + 1);
});

// mobile menu
const burger = document.getElementById('burger');
const dd = document.getElementById('dropdown');
burger.onclick = () => dd.classList.toggle('open');
dd.querySelectorAll('a').forEach(a => a.onclick = () => dd.classList.remove('open'));

// reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('in');
    io.unobserve(e.target);
  }
}), { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// count-up stats + chart + bars
function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const dec = +el.dataset.dec || 0;
  const suf = el.dataset.suffix || '';
  const t0 = performance.now(), dur = 1400;
  (function step(t) {
    const p = Math.min((t - t0) / dur, 1);
    const v = target * (1 - Math.pow(1 - p, 3));
    el.textContent = v.toFixed(dec) + suf;
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

const io2 = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  if (e.target.id === 'chartCard') { e.target.classList.add('in'); }
  e.target.querySelectorAll?.('[data-count]').forEach(countUp);
  e.target.querySelectorAll?.('.bar').forEach(b => b.style.height = b.dataset.h + '%');
  io2.unobserve(e.target);
}), { threshold: 0.3 });

document.querySelectorAll('#market .stats, #market .chart-card, #needBars').forEach(el => io2.observe(el));
document.querySelectorAll('.bar').forEach(b => b.parentElement.style.position = 'relative');

// expandable material cards
document.querySelectorAll('.mat').forEach(m => {
  const toggle = () => m.classList.toggle('open');
  m.onclick = toggle;
  m.onkeydown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };
});