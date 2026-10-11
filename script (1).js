// ===== Helpers =====
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover)').matches;

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ===== Footer year =====
$('#year').textContent = new Date().getFullYear();

// ===== Tema warna (disimpan di localStorage) =====
const root = document.documentElement;
function setTheme(name) {
  if (name === 'pink') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', name);
  $$('.dot').forEach(d => d.classList.toggle('active', d.dataset.theme === name));
  try { localStorage.setItem('theme', name); } catch (e) {}
}
$$('.dot').forEach(d => d.addEventListener('click', () => {
  setTheme(d.dataset.theme);
  toast('Tema: ' + d.title);
}));
let savedTheme = 'pink';
try { savedTheme = localStorage.getItem('theme') || 'pink'; } catch (e) {}
setTheme(savedTheme);

// ===== Efek mengetik pada role =====
(function typing() {
  const el = $('#typed');
  const words = [
    'Information Systems student at UNESA',
    'UI/UX Design enthusiast',
    'Graphic designer with Canva',
    'Python & Arduino explorer'
  ];
  if (reduceMotion) { el.textContent = words[0]; return; }
  let w = 0, i = 0, deleting = false;
  function tick() {
    const word = words[w];
    el.textContent = word.slice(0, i);
    let delay = deleting ? 35 : 70;
    if (!deleting && i === word.length) { deleting = true; delay = 1600; }
    else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 400; }
    i += deleting ? -1 : 1;
    setTimeout(tick, delay);
  }
  tick();
})();

// ===== Hati melayang di latar =====
(function floaters() {
  if (reduceMotion) return;
  const box = $('#floaters');
  const icons = ['💗', '🌸', '✨', '💖', '🎀'];
  function spawn() {
    const f = document.createElement('span');
    f.className = 'floater';
    f.textContent = icons[Math.floor(Math.random() * icons.length)];
    f.style.left = Math.random() * 100 + '%';
    f.style.fontSize = 14 + Math.random() * 18 + 'px';
    f.style.animationDuration = 9 + Math.random() * 8 + 's';
    box.appendChild(f);
    f.addEventListener('animationend', () => f.remove());
  }
  setInterval(() => { if (!document.hidden) spawn(); }, 1200);
})();

// ===== Jejak kilau mengikuti kursor =====
(function sparkleTrail() {
  if (reduceMotion || !canHover) return;
  let last = 0;
  document.addEventListener('mousemove', e => {
    const now = performance.now();
    if (now - last < 70) return;
    last = now;
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = ['✦', '✧', '♡'][Math.floor(Math.random() * 3)];
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    s.style.color = getComputedStyle(root).getPropertyValue('--pink-500');
    s.style.fontSize = 10 + Math.random() * 10 + 'px';
    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  });
})();

// ===== Efek ripple pada tombol =====
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  const size = Math.max(r.width, r.height);
  const span = document.createElement('span');
  span.className = 'ripple';
  span.style.width = span.style.height = size + 'px';
  span.style.left = e.clientX - r.left - size / 2 + 'px';
  span.style.top = e.clientY - r.top - size / 2 + 'px';
  btn.appendChild(span);
  span.addEventListener('animationend', () => span.remove());
});

// ===== Konfeti =====
function confetti(x, y) {
  if (reduceMotion) return;
  const colors = ['#ffa8c8', '#f06292', '#fff3d6', '#c2185b', '#ffffff'];
  for (let i = 0; i < 26; i++) {
    const c = document.createElement('span');
    c.className = 'confetti';
    c.style.left = x + 'px';
    c.style.top = y + 'px';
    c.style.width = 6 + Math.random() * 6 + 'px';
    c.style.height = 8 + Math.random() * 8 + 'px';
    c.style.background = colors[i % colors.length];
    c.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
    document.body.appendChild(c);
    const angle = Math.random() * Math.PI * 2;
    const dist = 70 + Math.random() * 120;
    c.animate([
      { transform: 'translate(0,0) rotate(0)', opacity: 1 },
      { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 80}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)' })
      .onfinish = () => c.remove();
  }
}

// ===== Foto: klik untuk berputar + konfeti =====
$('#photo').addEventListener('click', e => {
  e.currentTarget.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.2) rotate(360deg)' }, { transform: 'scale(1)' }],
    { duration: 700, easing: 'ease-in-out' }
  );
  const r = e.currentTarget.getBoundingClientRect();
  confetti(r.left + r.width / 2, r.top + r.height / 2);
});

// ===== Salin email =====
$('#copyEmail').addEventListener('click', async () => {
  const email = 'sofiaemeraldazb1@gmail.com';
  try {
    await navigator.clipboard.writeText(email);
    toast('Email disalin 💌');
  } catch (err) {
    toast(email);
  }
});

// ===== Skills: klik untuk buka/tutup =====
$$('.skill').forEach(s => {
  s.setAttribute('tabindex', '0');
  s.setAttribute('role', 'button');
  const toggle = () => s.classList.toggle('open');
  s.addEventListener('click', toggle);
  s.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});

// ===== Proyek: filter + pencarian =====
const filterBtns = $$('.filters .btn');
const projects = $$('.project');
const searchInput = $('#search');
let activeFilter = 'all';

function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  let shown = 0;
  projects.forEach(p => {
    const matchCat = activeFilter === 'all' || p.dataset.cat === activeFilter;
    const matchText = !q || p.textContent.toLowerCase().includes(q);
    const visible = matchCat && matchText;
    p.classList.toggle('hide', !visible);
    if (visible) shown++;
  });
  $('#empty').classList.toggle('show', shown === 0);
}
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  applyFilters();
}));
searchInput.addEventListener('input', applyFilters);

// ===== Kartu proyek: efek miring 3D mengikuti kursor =====
if (!reduceMotion && canHover) {
  projects.forEach(p => {
    p.addEventListener('mousemove', e => {
      const r = p.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      p.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
    });
    p.addEventListener('mouseleave', () => { p.style.transform = ''; });
  });
}

// ===== Modal proyek =====
const modalBg = $('#modalBg');
let lastFocus = null;
function openModal(p) {
  lastFocus = document.activeElement;
  $('#mIcon').textContent = p.dataset.icon;
  $('#mTitle').textContent = p.dataset.title;
  $('#mDesc').textContent = p.dataset.desc;
  modalBg.classList.add('show');
  $('#mClose').focus();
}
function closeModal() {
  modalBg.classList.remove('show');
  if (lastFocus) lastFocus.focus();
}
projects.forEach(p => {
  p.setAttribute('tabindex', '0');
  p.addEventListener('click', () => openModal(p));
  p.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(p); });
});
$('#mClose').addEventListener('click', closeModal);
modalBg.addEventListener('click', e => { if (e.target === modalBg) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== Muncul saat scroll =====
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); });
}, { threshold: .1 });
$$('.reveal').forEach(el => io.observe(el));

// ===== Progress bar, tombol Top, menu aktif =====
const progress = $('#progress');
const toTop = $('#toTop');
const links = $$('nav a');
const sections = $$('section');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  toTop.classList.toggle('show', h.scrollTop > 400);
  let current = sections[0].id;
  sections.forEach(s => { if (h.scrollTop >= s.offsetTop - 200) current = s.id; });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
