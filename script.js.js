// ============================================
//   PORTFOLIO – script.js
// ============================================

// ─── CUSTOM CURSOR ───────────────────────────
(function () {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });

  // Smooth ring follow
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .stat-card, .skill-category, .project-card, .contact-card, .tag'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();


// ─── STICKY NAV ──────────────────────────────
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const handler = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handler, { passive: true });
})();


// ─── MOBILE MENU ─────────────────────────────
(function () {
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  if (!burger || !mobileMenu) return;

  const toggle = () => {
    const open = mobileMenu.classList.toggle('open');
    burger.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger.addEventListener('click', toggle);
  mobileLinks.forEach(link => link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('active');
    document.body.style.overflow = '';
  }));
})();


// ─── SCROLL REVEAL ───────────────────────────
(function () {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();


// ─── COUNTER ANIMATION ───────────────────────
(function () {
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  if (!statNums.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCount(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const start    = performance.now();

    const step = now => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();


// ─── SMOOTH NAV SCROLL ───────────────────────
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ─── ACTIVE NAV HIGHLIGHT ────────────────────
(function () {
  const sections  = document.querySelectorAll('section[id], header[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  if (!navLinks.length) return;

  const activate = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.style.color = href === current ? 'var(--accent)' : '';
    });
  };

  window.addEventListener('scroll', activate, { passive: true });
  activate();
})();


// ─── TYPEWRITER HERO SUBTITLE ────────────────
(function () {
  const subtitleEl = document.querySelector('.hero-desc');
  if (!subtitleEl) return;

  const phrases = [
    'Développeur full-stack passionné.',
    'Explorateur de l\'intelligence artificielle.',
    'Résolveur de problèmes complexes.',
    'Ingénieur informatique en devenir.'
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  const line2 = document.createElement('span');
  line2.className = 'typewriter-line';
  line2.style.cssText = 'display:block; color: var(--accent); font-size:0.9rem; margin-top:0.5rem;';
  subtitleEl.appendChild(line2);

  const cursor_el = document.createElement('span');
  cursor_el.textContent = '|';
  cursor_el.style.cssText = 'color:var(--accent); animation: blink 1s infinite;';
  subtitleEl.appendChild(cursor_el);

  function type() {
    if (paused) return;

    const phrase = phrases[phraseIdx];

    if (!deleting) {
      line2.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        paused = true;
        setTimeout(() => { deleting = true; paused = false; }, 2200);
      }
    } else {
      line2.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    const speed = deleting ? 40 : 60;
    setTimeout(type, speed);
  }

  // Start after hero reveal delay
  setTimeout(type, 800);
})();


// ─── TILT EFFECT on project cards ────────────
(function () {
  const cards = document.querySelectorAll('.project-card, .skill-category');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -5;
      const rotY   = ((x - cx) / cx) *  5;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


// ─── PARTICLE BACKGROUND ─────────────────────
(function () {
  const hero = document.querySelector('.hero-bg');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;opacity:0.35;';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  const PARTICLE_COUNT = 50;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a:  Math.random()
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${p.a * 0.6})`;
      ctx.fill();
    });

    // Draw connections
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dx   = a.x - b.x;
        const dy   = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${(1 - dist / 120) * 0.12})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => { resize(); createParticles(); });
})();


// ─── LANGUAGE BAR ANIMATE ────────────────────
(function () {
  const fills = document.querySelectorAll('.lang-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.style.getPropertyValue('--w') ||
          getComputedStyle(entry.target).getPropertyValue('--w');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(f => {
    f.style.width = '0';
    observer.observe(f);
  });
})();


// ─── INIT LOG ────────────────────────────────
console.log('%c⚡ Portfolio chargé avec succès', 'color:#00e5ff;font-weight:bold;font-size:14px;');