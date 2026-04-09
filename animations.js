/* ═══════════════════════════════════════════════════════════
   AETHERIS LUMINA — ANIMATION ENGINE  v2.0
   InterveuX Design System
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Easing ── */
  const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

  /* ══════════════════════════════════
     COUNT UP
  ══════════════════════════════════ */
  function countUp(el, end, duration, decimals, suffix) {
    decimals = decimals || 0;
    suffix   = suffix   || '';
    duration = duration || 1200;
    const startTime = performance.now();
    function tick(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const v = easeOutExpo(t) * end;
      el.textContent = (decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString()) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ══════════════════════════════════
     SCORE RING FILL
  ══════════════════════════════════ */
  function animateRing(wrapper) {
    const score  = parseFloat(wrapper.dataset.scoreRing || 0);
    const circle = wrapper.querySelector('.score-ring-fill');
    const numEl  = wrapper.querySelector('[data-count]');
    if (!circle) return;

    const r = parseFloat(circle.getAttribute('r') || 72);
    const C = 2 * Math.PI * r;
    circle.setAttribute('stroke-dasharray',  C);
    circle.setAttribute('stroke-dashoffset', C);

    const color = score >= 80 ? '#bf81ff' : score >= 60 ? '#9c42f4' : '#c8475d';

    requestAnimationFrame(() => requestAnimationFrame(() => {
      circle.style.transition = `stroke-dashoffset 1400ms cubic-bezier(0.16,1,0.3,1), stroke 800ms ease`;
      circle.setAttribute('stroke', color);
      circle.setAttribute('stroke-dashoffset', C - (score / 100) * C);
    }));

    if (numEl) {
      const decimals = parseInt(numEl.dataset.decimals || 0);
      const suffix   = numEl.dataset.suffix || '%';
      countUp(numEl, score, 1400, decimals, suffix);
    }
  }

  /* ══════════════════════════════════
     PROGRESS BAR FILL
  ══════════════════════════════════ */
  function fillProgressBar(bar) {
    const target = bar.dataset.width || bar.dataset.targetWidth || '0%';
    bar.style.setProperty('--target-width', target);
    requestAnimationFrame(() => {
      bar.style.width = target;
      bar.classList.add('filled');
    });
  }

  /* ══════════════════════════════════
     STAGGER CHILDREN
  ══════════════════════════════════ */
  function staggerReveal(parent) {
    const stagger = parseInt(parent.dataset.stagger || 80);
    Array.from(parent.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * stagger}ms`;
    });
    requestAnimationFrame(() => parent.classList.add('revealed'));
  }

  /* ══════════════════════════════════
     RIPPLE ON CLICK
  ══════════════════════════════════ */
  function addRipple(el) {
    el.classList.add('btn-ripple');
    el.addEventListener('click', function (e) {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const r = document.createElement('span');
      r.className = 'ripple-effect';
      r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
      el.appendChild(r);
      r.addEventListener('animationend', () => r.remove());
    });
  }

  /* ══════════════════════════════════
     WAVEFORM BARS
  ══════════════════════════════════ */
  function initWaveform() {
    document.querySelectorAll('.waveform-bar, .waveform-live').forEach(bar => {
      bar.classList.add('waveform-live');
      const d = (0.4 + Math.random() * 0.8).toFixed(2);
      const delay = (Math.random()).toFixed(2);
      bar.style.animation = `waveformLive ${d}s ${delay}s ease-in-out infinite`;
      bar.style.transformOrigin = 'center bottom';
    });
  }

  /* ══════════════════════════════════
     SIDEBAR ENTRANCE
  ══════════════════════════════════ */
  function initSidebar() {
    const sidebar = document.querySelector('aside');
    if (!sidebar) return;
    sidebar.classList.add('sidebar-entrance');
    const items = sidebar.querySelectorAll('a, button');
    items.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-10px)';
      setTimeout(() => {
        item.style.transition = 'opacity 220ms ease, transform 220ms ease';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, 250 + i * 45);
    });
  }

  /* ══════════════════════════════════
     NAV ENTRANCE
  ══════════════════════════════════ */
  function initNav() {
    const nav = document.querySelector('nav:first-of-type, header');
    if (nav && !nav.closest('aside')) {
      nav.classList.add('nav-entrance');
    }
  }

  /* ══════════════════════════════════
     HOVER LIFT ON CARDS
  ══════════════════════════════════ */
  function initHoverLifts() {
    document.querySelectorAll('.hover-lift').forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = '0 12px 40px rgba(191,129,255,0.12)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.boxShadow = '';
      });
    });
  }

  /* ══════════════════════════════════
     PAGE TRANSITIONS
  ══════════════════════════════════ */
  function initPageTransitions() {
    // Enter animation
    document.body.classList.add('page-enter');
    document.body.addEventListener('animationend', () => {
      document.body.classList.remove('page-enter');
    }, { once: true });

    // Exit on link clicks
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript') ||
          href.startsWith('http') || href.startsWith('mailto') || link.target === '_blank') return;
      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(() => { window.location.href = href; }, 200);
    });
  }

  /* ══════════════════════════════════
     TAB SWITCHER
  ══════════════════════════════════ */
  function initTabs() {
    document.querySelectorAll('[data-tabs-container]').forEach(container => {
      const tabs = container.querySelectorAll('[data-tab-id]');
      const indicator = container.querySelector('.tab-indicator');

      function activate(tab) {
        tabs.forEach(t => {
          const isActive = t === tab;
          t.classList.toggle('text-primary',  isActive);
          t.classList.toggle('font-bold',     isActive);
          t.classList.toggle('border-primary', isActive);
          const panel = document.getElementById(t.dataset.tabId);
          if (!panel) return;
          if (isActive) {
            panel.removeAttribute('hidden');
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(8px)';
            requestAnimationFrame(() => {
              panel.style.transition = 'opacity 200ms ease, transform 200ms ease';
              panel.style.opacity = '1';
              panel.style.transform = 'translateY(0)';
            });
          } else {
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(-8px)';
            setTimeout(() => panel.setAttribute('hidden', ''), 150);
          }
        });

        if (indicator) {
          const r = tab.getBoundingClientRect();
          const cr = container.getBoundingClientRect();
          indicator.style.left  = (r.left - cr.left) + 'px';
          indicator.style.width = r.width + 'px';
        }
      }

      tabs.forEach(tab => tab.addEventListener('click', () => activate(tab)));
      const first = tabs[0];
      if (first) activate(first);
    });
  }

  /* ══════════════════════════════════
     UPLOAD ZONE
  ══════════════════════════════════ */
  function initUploadZone() {
    document.querySelectorAll('.upload-zone').forEach(zone => {
      ['dragenter', 'dragover'].forEach(e => {
        zone.addEventListener(e, ev => {
          ev.preventDefault();
          zone.classList.add('drag-over');
        });
      });
      ['dragleave', 'drop'].forEach(e => {
        zone.addEventListener(e, ev => {
          ev.preventDefault();
          zone.classList.remove('drag-over');
        });
      });
    });
  }

  /* ══════════════════════════════════
     TIMELINE DRAW
  ══════════════════════════════════ */
  function initTimeline(el) {
    const line = el.querySelector('.timeline-line-draw');
    const nodes = el.querySelectorAll('.timeline-node');
    if (line) {
      requestAnimationFrame(() => line.classList.add('drawn'));
    }
    nodes.forEach((node, i) => {
      setTimeout(() => {
        node.classList.add('appeared');
        // Ripple ring
        const ring = document.createElement('div');
        ring.className = 'ripple-ring';
        node.style.position = 'relative';
        node.appendChild(ring);
        ring.addEventListener('animationend', () => ring.remove());
      }, 200 + i * 100);
    });
  }

  /* ══════════════════════════════════
     ANALYSE BUTTON STATES
  ══════════════════════════════════ */
  function initAnalyseButton() {
    document.querySelectorAll('[data-analyse-btn]').forEach(btn => {
      btn.addEventListener('click', function () {
        const originalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.innerHTML = `<span class="material-symbols-outlined spinner" style="font-size:20px">autorenew</span> Analysing…`;
        setTimeout(() => {
          btn.innerHTML = `<span class="material-symbols-outlined scale-spring" style="font-size:20px">check_circle</span> Complete`;
          btn.style.opacity = '1';
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
          }, 1600);
        }, 2400);
      });
    });
  }

  /* ══════════════════════════════════
     INTERSECTION OBSERVER CORE
  ══════════════════════════════════ */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0);

      if (el.classList.contains('reveal-on-scroll') || el.classList.contains('reveal-scale') || el.classList.contains('reveal-right')) {
        setTimeout(() => el.classList.add('revealed'), delay);
        io.unobserve(el);
      }

      if (el.classList.contains('stagger-children')) {
        setTimeout(() => staggerReveal(el), delay);
        io.unobserve(el);
      }

      if (el.dataset.countup !== undefined) {
        const end      = parseFloat(el.dataset.countup);
        const duration = parseInt(el.dataset.duration || 1200);
        const decimals = parseInt(el.dataset.decimals  || 0);
        const suffix   = el.dataset.suffix  || '';
        setTimeout(() => countUp(el, end, duration, decimals, suffix), delay);
        io.unobserve(el);
      }

      if (el.classList.contains('progress-bar-animated')) {
        setTimeout(() => fillProgressBar(el), delay);
        io.unobserve(el);
      }

      if (el.dataset.scoreRing !== undefined) {
        setTimeout(() => animateRing(el), delay);
        io.unobserve(el);
      }

      if (el.classList.contains('glass-focus-pulse')) {
        setTimeout(() => {
          el.classList.add('pulse-active');
          el.addEventListener('animationend', () => el.classList.remove('pulse-active'), { once: true });
        }, delay);
        io.unobserve(el);
      }

      if (el.classList.contains('timeline-auto')) {
        setTimeout(() => initTimeline(el), delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  /* ══════════════════════════════════
     MAIN INIT
  ══════════════════════════════════ */
  function init() {
    initNav();
    initSidebar();
    initWaveform();
    initHoverLifts();
    initPageTransitions();
    initTabs();
    initUploadZone();
    initAnalyseButton();

    // Observe all animated elements
    const selectors = [
      '.reveal-on-scroll', '.reveal-scale', '.reveal-right',
      '.stagger-children', '[data-countup]',
      '.progress-bar-animated', '[data-score-ring]',
      '.glass-focus-pulse', '.timeline-auto'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(el => io.observe(el));

    // Add ripple to interactive elements
    document.querySelectorAll('button, a.btn-ripple, [data-ripple]').forEach(addRipple);

    // Ambient orbs softFloat
    document.querySelectorAll('[data-ambient]').forEach(el => {
      el.classList.add('ambient-pulse');
      if (el.dataset.ambientOffset) el.style.animationDelay = el.dataset.ambientOffset;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
