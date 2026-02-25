/* ==========================================================
   CKRStudios — script.js  (Cinematic Edition)
   ==========================================================

   TABLE OF CONTENTS
   01. Cinematic Background Color System
   02. Navbar — transparent ↔ frosted glass
   03. Mobile Menu
   04. Stars — generated for Moon section
   05. Horizontal Scroll System (Clients & Services)
   06. Scroll Reveal (IntersectionObserver)
   07. Animated Number Counters
   08. Contact Form Handler
   09. Smooth Anchor Scroll
   10. Page Load Transition
   11. Custom Mouse Cursor
   ========================================================== */

'use strict';

/* ----------------------------------------------------------
   HELPERS
   ---------------------------------------------------------- */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
function invLerp(a, b, v) { return clamp((v - a) / (b - a), 0, 1); }
function mapRange(v, a, b, c, d) { return c + (d - c) * invLerp(a, b, v); }

/* Parse hex to [r,g,b] */
function hex2rgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

/* Interpolate two [r,g,b] arrays */
function lerpColor(a, b, t) {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ];
}

function rgb2css(c) { return `rgb(${c[0]},${c[1]},${c[2]})`; }


/* ==========================================================
   01. CINEMATIC BACKGROUND COLOR SYSTEM
   ==========================================================
   ✏️ HOW TO CHANGE COLORS:
      Edit the color stops array below.
      Each entry is { pct: 0-1, color: '#rrggbb' }
      pct is the % of total scroll height at which that color peaks.

   The background smoothly interpolates between stops based
   on how far the user has scrolled.
   ========================================================== */
function initCinematicBg() {
  const bg = $('#cinematic-bg');
  if (!bg) return;

  /* ✏️ EDIT THESE STOPS to change the day/night journey */
  const stops = [
    { pct: 0.00, hex: '#FFFFFF' },   // Pure white — morning
    { pct: 0.12, hex: '#F5F4F2' },   // Soft warm white
    { pct: 0.22, hex: '#E8E5DF' },   // Light warm gray
    { pct: 0.32, hex: '#C0BBB0' },   // Medium warm gray
    { pct: 0.43, hex: '#6E6860' },   // Dark warm gray
    { pct: 0.52, hex: '#1A1714' },   // Near black
    { pct: 0.60, hex: '#080706' },   // Deep night — Moon section
    { pct: 0.68, hex: '#0A0908' },   // Still night
    { pct: 0.76, hex: '#1C1A16' },   // Dawn beginning
    { pct: 0.83, hex: '#5A5448' },   // Warm gray — sunrise
    { pct: 0.90, hex: '#C4BEB4' },   // Light gray
    { pct: 0.95, hex: '#EAE7E1' },   // Almost white
    { pct: 1.00, hex: '#FFFFFF' },   // Full white — morning again
  ];

  const rgbStops = stops.map(s => ({ pct: s.pct, rgb: hex2rgb(s.hex) }));

  /* Determine if bg is "dark" (for inverting text/nav) */
  function isDark(rgb) {
    // luminance
    const lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
    return lum < 128;
  }

  let currentBgRgb = [255, 255, 255];
  let rafId = null;

  function getColorAtScroll(scrollPct) {
    // Find surrounding stops
    for (let i = 0; i < rgbStops.length - 1; i++) {
      const a = rgbStops[i];
      const b = rgbStops[i + 1];
      if (scrollPct >= a.pct && scrollPct <= b.pct) {
        const t = invLerp(a.pct, b.pct, scrollPct);
        return lerpColor(a.rgb, b.rgb, t);
      }
    }
    return rgbStops[rgbStops.length - 1].rgb;
  }

  function update() {
    const doc = document.documentElement;
    const scrollY = window.scrollY;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? scrollY / maxScroll : 0;

    const target = getColorAtScroll(pct);
    // Smooth lerp toward target
    currentBgRgb = lerpColor(currentBgRgb, target, 0.12);

    bg.style.backgroundColor = rgb2css(currentBgRgb);

    // Toggle dark theme
    const dark = isDark(currentBgRgb);
    doc.setAttribute('data-theme', dark ? 'dark' : 'light');

    rafId = requestAnimationFrame(update);
  }

  // Start
  rafId = requestAnimationFrame(update);

  // Pause when tab not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(rafId); }
    else { rafId = requestAnimationFrame(update); }
  });
}


/* ==========================================================
   02. NAVBAR — transparent ↔ frosted glass
   ========================================================== */
function initNavbar() {
  const nav = $('#nav');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ==========================================================
   03. MOBILE MENU
   ========================================================== */
function initMobileMenu() {
  const burger = $('#burger');
  const links = $('#navLinks');
  if (!burger || !links) return;

  function open() {
    links.classList.add('open');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    links.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () =>
    links.classList.contains('open') ? close() : open()
  );
  $$('.nav-a', links).forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.addEventListener('click', e => {
    if (links.classList.contains('open') && !links.contains(e.target) && !burger.contains(e.target)) close();
  });
}


/* ==========================================================
   04. STARS — generated dynamically for Moon section
   ========================================================== */
function initStars() {
  const container = $('#stars');
  if (!container) return;

  const COUNT = 160;

  for (let i = 0; i < COUNT; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const size = Math.random() * 2 + 0.5;  // 0.5–2.5px
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = (Math.random() * 4 + 2).toFixed(1);  // 2–6s
    const del = (Math.random() * 6).toFixed(2);       // 0–6s delay
    const peak = (Math.random() * 0.5 + 0.3).toFixed(2); // opacity

    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      --dur: ${dur}s;
      --delay: ${del}s;
      --peak-opacity: ${peak};
    `;

    container.appendChild(star);
  }
}


/* ==========================================================
   05. HORIZONTAL CLIENT SCROLL
   ==========================================================
   The .clients-outer section is very tall (370vh).
   .clients-sticky is position:sticky and fills the viewport.
   As the user scrolls through clients-outer,
   we translate .clients-track horizontally.

   This creates the illusion of horizontal scrolling
   while the user scrolls vertically.
   ========================================================== */

/* Let's refactor initHorizontalScroll to be more generic */
function initHorizontalScroll() {
  const configs = [
    {
      outer: document.getElementById('services'),
      track: document.getElementById('servicesTrack'),
      progress: document.getElementById('servicesProgress')
    },
    {
      outer: document.getElementById('clients'),
      track: document.getElementById('clientsTrack'),
      progress: document.getElementById('clientsProgress')
    }
  ];

  configs.forEach(conf => {
    if (!conf.outer || !conf.track) return;
    if (window.matchMedia('(max-width: 720px)').matches) return;

    function update() {
      const outerRect = conf.outer.getBoundingClientRect();
      const outerH = conf.outer.offsetHeight;
      const viewH = window.innerHeight;
      const scrolled = -outerRect.top;
      const scrollable = outerH - viewH;
      const pct = clamp(scrolled / scrollable, 0, 1);
      const trackW = conf.track.scrollWidth;
      const viewportW = conf.track.parentElement.offsetWidth;
      const maxShift = trackW - viewportW + parseInt(getComputedStyle(conf.track).paddingLeft) * 2;

      if (maxShift > 0) {
        const shift = pct * maxShift;
        conf.track.style.transform = `translateX(-${shift}px)`;
      }
      if (conf.progress) conf.progress.style.width = `${pct * 100}%`;
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
}


/* ==========================================================
   06. SCROLL REVEAL
   Elements with class .reveal-scroll fade in
   when they enter the viewport.
   ========================================================== */
function initScrollReveal() {
  const elements = $$('.reveal-scroll');
  if (!elements.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => obs.observe(el));
}


/* ==========================================================
   07. ANIMATED COUNTERS
   ========================================================== */
function initCounters() {
  const nums = $$('.stat-num');
  if (!nums.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateNum(el) {
    const original = el.textContent.trim();
    const num = parseInt(original.replace(/\D/g, ''));
    const hasPct = original.includes('%');
    const hasPlus = original.includes('+');
    if (!num) return;

    const START = performance.now();
    const DURATION = 1700;

    function step(now) {
      const t = Math.min((now - START) / DURATION, 1);
      const val = Math.floor(easeOut(t) * num);
      el.textContent = val + (hasPct ? '%' : '') + (hasPlus ? '+' : '');
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = original;
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateNum(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.6 });

  nums.forEach(el => obs.observe(el));
}


/* ==========================================================
   08. CONTACT FORM HANDLER
   ==========================================================
   ✏️ TO USE A REAL FORM SERVICE:

   Option A — Formspree (recommended, free):
     1. Sign up at formspree.io
     2. Create a new form and copy the endpoint URL
     3. Replace the simulated delay below with:
        ─────────────────────────────────────────
        const res = await fetch('https://formspree.io/f/YOUR_ID', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, message })
        });
        if (!res.ok) throw new Error('failed');
        ─────────────────────────────────────────

   Option B — Netlify Forms (if hosted on Netlify):
     Add  netlify  attribute to <form> tag, remove JS fetch.

   Option C — EmailJS:
     See emailjs.com/docs/ for setup.
   ========================================================== */
function initContactForm() {
  const form = $('#contactForm');
  const success = $('#formSuccess');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = $('#submitBtn', form);
    btn.disabled = true;
    btn.classList.add('loading');

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });

      const result = await response.json();

      if (response.status === 200) {
        form.hidden = true;
        success.hidden = false;
      } else {
        throw new Error(result.message || 'Submission failed');
      }

    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please reach us on Instagram @ckr_studios');
    } finally {
      btn.disabled = false;
      btn.classList.remove('loading');
    }
  });
}


/* ==========================================================
   09. SMOOTH ANCHOR SCROLL
   ========================================================== */
function initAnchors() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ==========================================================
   10. PAGE LOAD TRANSITION
   ========================================================== */
function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
}


function initCursor() {
  const dot = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let dotX = -100, dotY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    // Smooth trailing
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    dot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;
    ring.style.transform = `translate(${ringX - 17}px, ${ringY - 17}px)`;

    requestAnimationFrame(animate);
  }
  animate();

  // Hover effects
  const targets = 'a, button, .svc, .client-card, [role="button"]';
  $$(targets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.transform += ' scale(2.2)';
      ring.style.borderColor = 'var(--accent)';
      ring.style.background = 'var(--accent-dim)';
      ring.style.opacity = '1';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.background = 'transparent';
      ring.style.opacity = '0.5';
    });
  });
}

/* ==========================================================
   INIT — run everything
   ========================================================== */
(function init() {
  initPageLoad();
  initCinematicBg();

  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initStars();
    initHorizontalScroll();
    initScrollReveal();
    initCounters();
    initContactForm();
    initAnchors();
    initCursor();

    // Add reveal-scroll class to sections that should animate on scroll
    const revealTargets = [
      '#services .section-label',
      '#services .section-title',
      '.svc',
      '.clients-header .section-label',
      '.clients-header .section-title',
      '.moon-content .moon-label',
      '.moon-content .moon-headline',
      '.moon-content .moon-sub',
      '.process .section-label',
      '.process .section-title',
      '.process-item',
      '.contact-left .section-label',
      '.contact-left .section-title',
      '.contact-sub',
      '.contact-detail',
      '.contact-right',
    ];

    revealTargets.forEach((sel, si) => {
      $$(sel).forEach((el, i) => {
        el.classList.add('reveal-scroll');
        // Stagger items within a group slightly
        if (sel.includes('svc') || sel.includes('process-item') || sel.includes('contact-detail')) {
          el.style.setProperty('--rd', `${i * 0.08}s`);
        }
      });
    });

    // Re-init scroll reveal after adding classes
    initScrollReveal();
  });
})();
