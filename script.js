/* ══════════════════════════════════════════════════════
   MEU MAMUTE FAVORITO — script.js
   Partículas douradas · Parallax · Navbar · Reveal · etc.
   ══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAVBAR: Scroll sólido ─────────────────────────────
  const navbar = document.getElementById('navbar');
  function onNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  // ─── HAMBURGER MENU ────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');
  hamburger.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    // Animate hamburger → X
    const spans = hamburger.querySelectorAll('span');
    if (navMobile.classList.contains('open')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  // Close on link click
  navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMobile.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ─── BACK TO TOP ───────────────────────────────────────
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ─── CURSOR GLOW ───────────────────────────────────────
  const cursorGlow = document.getElementById('cursorGlow');
  let gx = window.innerWidth / 2;
  let gy = window.innerHeight / 2;
  let cgx = gx, cgy = gy;

  window.addEventListener('mousemove', e => { gx = e.clientX; gy = e.clientY; });
  window.addEventListener('mouseleave', () => cursorGlow.style.opacity = '0');
  window.addEventListener('mouseenter', () => cursorGlow.style.opacity = '1');

  function animateCursor() {
    cgx += (gx - cgx) * 0.08;
    cgy += (gy - cgy) * 0.08;
    cursorGlow.style.left = cgx + 'px';
    cursorGlow.style.top  = cgy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // ─── PARALLAX HERO ─────────────────────────────────────
  const parallaxBg = document.querySelector('.parallax-bg');
  function onParallax() {
    if (!parallaxBg) return;
    const scrollY = window.scrollY;
    const speed = parseFloat(parallaxBg.dataset.speed) || 0.3;
    parallaxBg.style.transform = `translateY(${scrollY * speed}px)`;
  }
  window.addEventListener('scroll', onParallax, { passive: true });

  // ─── SCROLL REVEAL ─────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ─── GOLDEN PARTICLE CANVAS ────────────────────────────
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  // Particle class
  class Particle {
    constructor() { this.reset(true); }

    reset(init = false) {
      this.x    = Math.random() * W;
      this.y    = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.5 + 0.4;
      this.vx   = (Math.random() - 0.5) * 0.3;
      this.vy   = -(Math.random() * 0.5 + 0.2);
      this.life = 0;
      this.maxLife = Math.random() * 260 + 160;
      // Gold colour variants
      const hue = 42 + (Math.random() - 0.5) * 12;
      this.hue  = hue;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      // Gentle drift
      this.vx += (Math.random() - 0.5) * 0.02;
      if (this.life >= this.maxLife || this.y < -10) this.reset();
    }

    draw() {
      const progress = this.life / this.maxLife;
      // Fade in then out
      const alpha = progress < 0.15
        ? progress / 0.15
        : progress > 0.75
          ? (1 - progress) / 0.25
          : 1;

      ctx.save();
      ctx.globalAlpha = alpha * 0.7;
      ctx.fillStyle   = `hsl(${this.hue}, 80%, 65%)`;
      ctx.shadowBlur  = 4;
      ctx.shadowColor = `hsl(${this.hue}, 90%, 55%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Avalon road lines — subtle luminous lines drifting upward
  class RoadLine {
    constructor() { this.reset(true); }

    reset(init = false) {
      this.x1   = Math.random() * W;
      this.y1   = init ? Math.random() * H : H + 20;
      const angle = (Math.random() - 0.5) * 0.6;
      const len   = Math.random() * 80 + 40;
      this.x2   = this.x1 + Math.sin(angle) * len;
      this.y2   = this.y1 - Math.cos(angle) * len;
      this.vy   = -(Math.random() * 0.35 + 0.1);
      this.life    = 0;
      this.maxLife = Math.random() * 400 + 200;
      this.alpha   = Math.random() * 0.08 + 0.02;
    }

    update() {
      this.y1 += this.vy;
      this.y2 += this.vy;
      this.life++;
      if (this.life >= this.maxLife || this.y2 < -30) this.reset();
    }

    draw() {
      const progress = this.life / this.maxLife;
      const a = progress < 0.2 ? progress / 0.2
              : progress > 0.7 ? (1 - progress) / 0.3
              : 1;
      ctx.save();
      ctx.globalAlpha = a * this.alpha;
      const grad = ctx.createLinearGradient(this.x1, this.y1, this.x2, this.y2);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.5, '#D4AF37');
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 0.8;
      ctx.beginPath();
      ctx.moveTo(this.x1, this.y1);
      ctx.lineTo(this.x2, this.y2);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Spawn particles & lines
  const PARTICLE_COUNT = 90;
  const LINE_COUNT     = 30;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  const lines     = Array.from({ length: LINE_COUNT },     () => new RoadLine());

  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    lines.forEach(l => { l.update(); l.draw(); });
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // ─── SMOOTH SECTION LINKS ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

});
