/* ============================================================
   script.js — Rishav Kumar Portfolio
   Typing animation · Particle canvas · Scroll effects
   Cursor glow · Nav highlight · Reveal on scroll
   ============================================================ */

'use strict';

/* ============================================================
   1. CUSTOM CURSOR GLOW
   ============================================================ */
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = -1000, mouseY = -1000;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});
document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursorGlow.style.opacity = '1'; });

/* ============================================================
   2. PARTICLE CANVAS
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const PARTICLE_COUNT = 80;
  const COLORS = ['#7c3aed', '#4f46e5', '#06b6d4', '#a78bfa'];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.8 + 0.4;
      this.speed = Math.random() * 0.3 + 0.1;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.drift = (Math.random() - 0.5) * 0.2;
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ============================================================
   3. TYPING ANIMATION
   ============================================================ */
(function initTyping() {
  const el     = document.getElementById('typingText');
  const cursor = document.querySelector('.typing-cursor');
  const words  = [
    'full-stack apps',
    'real-time systems',
    'scalable APIs',
    'cloud solutions',
    'clean interfaces',
  ];

  let wIdx = 0, cIdx = 0, deleting = false, paused = false;

  function type() {
    if (paused) return;
    const word = words[wIdx];

    if (!deleting) {
      el.textContent = word.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx === word.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; }, 2000);
      }
    } else {
      el.textContent = word.slice(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
      }
    }

    const speed = deleting ? 60 : 100;
    setTimeout(type, speed);
  }
  setTimeout(type, 800);
})();

/* ============================================================
   4. NAVBAR — scroll behaviour & active link
   ============================================================ */
(function initNavbar() {
  const navbar      = document.getElementById('navbar');
  const navLinks    = document.querySelectorAll('.nav-link');
  const hamburger   = document.getElementById('hamburger');
  const navLinksEl  = document.getElementById('navLinks');
  const sections    = document.querySelectorAll('section[id]');

  /* Sticky background on scroll */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    highlightNav();
  }, { passive: true });

  /* Active link highlight */
  function highlightNav() {
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 100;
      if (window.scrollY >= top) current = s.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  /* Hamburger toggle */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  /* Close menu on link click */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  /* Smooth scroll for all anchor links with # */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ============================================================
   5. REVEAL ON SCROLL (Intersection Observer)
   ============================================================ */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        /* Staggered delay for siblings */
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ============================================================
   6. PROJECT CARD — mouse tilt effect
   ============================================================ */
(function initTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)';
    });
  });
})();

/* ============================================================
   7. ANIMATED COUNTER (stats section)
   ============================================================ */
(function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  const targets  = [200, 2, 2];
  const suffixes = ['+', '+', ''];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const idx = [...statNums].indexOf(el);
      const end = targets[idx];
      const suf = suffixes[idx];
      let cur   = 0;
      const duration = 1400;
      const step = end / (duration / 16);
      const timer = setInterval(() => {
        cur = Math.min(cur + step, end);
        el.textContent = Math.floor(cur) + suf;
        if (cur >= end) clearInterval(timer);
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();

/* ============================================================
   8. SKILL TAG — wave animation on hover
   ============================================================ */
document.querySelectorAll('.skill-card').forEach(card => {
  const tags = card.querySelectorAll('.skill-tag');
  card.addEventListener('mouseenter', () => {
    tags.forEach((tag, i) => {
      tag.style.transitionDelay = `${i * 40}ms`;
      tag.style.transform = 'translateY(-3px)';
      tag.style.color = 'var(--accent-1)';
      tag.style.borderColor = 'rgba(124,58,237,0.4)';
      tag.style.background = 'rgba(124,58,237,0.12)';
    });
  });
  card.addEventListener('mouseleave', () => {
    tags.forEach(tag => {
      tag.style.transitionDelay = '0ms';
      tag.style.transform = '';
      tag.style.color = '';
      tag.style.borderColor = '';
      tag.style.background = '';
    });
  });
});

/* ============================================================
   9. BACKGROUND MESH GRADIENT ANIMATION
   ============================================================ */
(function initMesh() {
  let angle = 0;
  const body = document.body;

  function animateMesh() {
    angle = (angle + 0.15) % 360;
    const a = angle * Math.PI / 180;
    const x = 50 + 20 * Math.sin(a);
    const y = 50 + 20 * Math.cos(a * 0.7);
    body.style.setProperty('--mesh-x', x + 'vw');
    body.style.setProperty('--mesh-y', y + 'vh');
    requestAnimationFrame(animateMesh);
  }
  animateMesh();
})();
