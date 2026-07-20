/* ============================================================
   script.js — Rishav Kumar Portfolio (terminal theme)
   ============================================================ */

'use strict';

/* ============================================================
   1. TYPED COMMAND IN HERO TERMINAL
   ============================================================ */
(function initTypedCommand() {
  const el = document.getElementById('typedCmd');
  const output = document.getElementById('termOutput');
  if (!el) return;

  if (window.Typed) {
    new Typed('#typedCmd', {
      strings: ['whoami --verbose'],
      typeSpeed: 55,
      showCursor: true,
      cursorChar: '▌',
      onComplete: () => {
        setTimeout(() => output.classList.add('output-visible'), 250);
      }
    });
  } else {
    el.textContent = 'whoami --verbose';
    output.classList.add('output-visible');
  }
})();

/* ============================================================
   1b. MATRIX RAIN — ambient hero backdrop
   ============================================================ */
(function initMatrixRain() {
  const canvas = document.getElementById('matrixRain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('hero');
  let W, H, cols, drops;

  const CHARS = '01{}<>[]/;=+-*&|!$#%^~_'.split('');

  function resize() {
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
    const fontSize = 15;
    cols = Math.floor(W / fontSize);
    drops = new Array(cols).fill(0).map(() => Math.random() * -50);
  }
  window.addEventListener('resize', resize);
  resize();

  const fontSize = 15;
  function draw() {
    ctx.fillStyle = 'rgba(13,17,23,0.08)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < cols; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      const alpha = Math.random() * 0.35 + 0.08;
      ctx.fillStyle = `rgba(63,185,80,${alpha})`;
      ctx.fillText(char, x, y);

      if (y > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================================
   2a. SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = scrolled + '%';
  }, { passive: true });
})();

/* ============================================================
   2b. CURSOR GLOW
   ============================================================ */
(function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
})();

/* ============================================================
   1c. INTERACTIVE TERMINAL — real commands, real output
   ============================================================ */
(function initInteractiveTerminal() {
  const input   = document.getElementById('termInput');
  const history = document.getElementById('termHistory');
  if (!input || !history) return;

  const cmdHistory = [];
  let historyIdx = -1;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  };

  const commands = {
    help: () =>
      `Available commands:\n` +
      `  <strong>about</strong>        — who I am\n` +
      `  <strong>skills</strong>       — tech stack\n` +
      `  <strong>projects</strong>     — featured work\n` +
      `  <strong>education</strong>    — academic background\n` +
      `  <strong>achievements</strong> — highlights\n` +
      `  <strong>contact</strong>      — get in touch\n` +
      `  <strong>resume</strong>       — download resume\n` +
      `  <strong>clear</strong>        — clear this terminal`,

    about: () => {
      scrollTo('about');
      return `Rishav Kumar — Full Stack Developer, B.Tech CSE @ LPU.\nReact on the front end, Node.js/Express/PostgreSQL on the back end.\nScrolling to <strong>about</strong>…`;
    },
    skills: () => {
      scrollTo('skills');
      return `JavaScript · C++ · Python · SQL · React.js · Node.js · Express.js\nPostgreSQL · Prisma · MongoDB · Redis · Docker · AWS\nScrolling to <strong>stack.json</strong>…`;
    },
    projects: () => {
      scrollTo('projects');
      return `1. LibOps — Library Ops Management System (Node, Postgres, Redis, BullMQ)\n2. InfraGuard Lite — API Monitoring Platform (React, Node, MongoDB)\nScrolling to <strong>projects/</strong>…`;
    },
    education: () => {
      scrollTo('education');
      return `B.Tech CSE, LPU (2023–Present) · CGPA 7.1\nIntermediate, Holy Cross School — 74.6%\nMatriculation, Gourav Awas Uchcha Vidyalaya — 76.8%`;
    },
    achievements: () => {
      scrollTo('log');
      return `Rank 8 / 80+ teams @ Call of Code hackathon\n250+ DSA problems solved · Branch hygiene workshop for 20+ juniors`;
    },
    contact: () => {
      scrollTo('contact');
      return `Email: rishav90318@gmail.com\nGitHub: github.com/rishav903188\nLinkedIn: linkedin.com/in/rishavkumar903`;
    },
    resume: () => {
      window.open('assets/Rishav_Kumar_Resume.pdf', '_blank');
      return `Opening <strong>Rishav_Kumar_Resume.pdf</strong>…`;
    },
    whoami: () => `rishav — full-stack developer, backend-leaning, permanently debugging something.`,
    ls: () => `about/  skills/  projects/  education/  achievements/  contact/`,
    'sudo hire-me': () => `<span class="hint">Permission granted.</span> Redirecting to <strong>contact</strong>…`,
  };

  function render(cmd, outputHTML, isError) {
    const line = document.createElement('div');
    line.className = 'term-history-line';
    line.innerHTML =
      `<div class="term-history-cmd"><span class="prompt">rishav@dev</span><span class="path">:~$</span> ${cmd}</div>` +
      `<div class="term-history-out">${isError ? `<span class="err">${outputHTML}</span>` : outputHTML}</div>`;
    history.appendChild(line);
    history.scrollTop = history.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length) {
        historyIdx = Math.max(0, historyIdx - 1);
        input.value = cmdHistory[historyIdx] || '';
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistory.length) {
        historyIdx = Math.min(cmdHistory.length, historyIdx + 1);
        input.value = cmdHistory[historyIdx] || '';
      }
      return;
    }
    if (e.key !== 'Enter') return;

    const raw = input.value.trim();
    if (!raw) return;

    cmdHistory.push(raw);
    historyIdx = cmdHistory.length;

    const key = raw.toLowerCase();
    if (key === 'clear') {
      history.innerHTML = '';
      input.value = '';
      return;
    }

    if (commands[key]) {
      render(raw, commands[key]());
    } else {
      render(raw, `command not found: ${raw}. Type <strong>help</strong> for available commands.`, true);
    }
    input.value = '';
  });

  input.addEventListener('focus', () => {
    if (!history.children.length) {
      render('help', commands.help());
    }
  });
})();
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const navLinks   = document.querySelectorAll('.nav-link');
  const hamburger  = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  const sections   = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    highlightNav();
  }, { passive: true });

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

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

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
   3. REVEAL ON SCROLL
   ============================================================ */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 70}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ============================================================
   4. ANIMATED STAT COUNTERS
   ============================================================ */
(function initCounters() {
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.target, 10);
      let cur = 0;
      const duration = 1200;
      const step = end / (duration / 16) || end;
      const timer = setInterval(() => {
        cur = Math.min(cur + step, end);
        el.textContent = Math.floor(cur);
        if (cur >= end) clearInterval(timer);
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. PROJECT CARD — subtle tilt
   ============================================================ */
(function initTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
    });
  });
})();