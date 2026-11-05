/* ================= SYNAPSE NEURAL NETWORK BACKGROUND (js/synapse.js) =================
   - Renders drifting nodes, low-opacity links, and traveling cyan pulses on canvas.
   - Throttles resize events to eliminate unnecessary canvas re-allocations.
   - Pauses rendering automatically when off-screen or when Beyond World is open.
*/

import { rafThrottle } from './config.js';

export function initSynapse() {
  let started = false;

  function start() {
    if (started) return true;
    const wrap = document.getElementById('synapse-wrap');
    const cv = document.getElementById('synapse-canvas');
    if (!wrap || !cv) return false;
    started = true;
    init(wrap, cv);
    return true;
  }

  function init(wrap, cv) {
    const ctx = cv.getContext('2d', { alpha: true });
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LINK = 140;
    let w = 0, h = 0, nodes = [], pulses = [], raf = null, visible = true, beyondOpen = false;

    function resize() {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      if (!w || !h) return;

      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cap = w < 640 ? 34 : 70;
      const count = Math.max(18, Math.min(cap, Math.round((w * h) / 20000)));
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 1 + Math.random() * 1.6
        });
      }
      pulses = [];
      if (reduce) draw();
    }

    function spawnPulse() {
      if (pulses.length >= 14 || Math.random() > 0.08) return;
      const a = Math.floor(Math.random() * nodes.length);
      const near = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === a) continue;
        if (Math.hypot(nodes[a].x - nodes[j].x, nodes[a].y - nodes[j].y) < LINK) near.push(j);
      }
      if (near.length) {
        pulses.push({
          a: a,
          b: near[Math.floor(Math.random() * near.length)],
          t: 0,
          s: 0.012 + Math.random() * 0.012
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      let i, j, n, d;

      ctx.lineWidth = 1;
      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(167,139,250,${((1 - d / LINK) * 0.22).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        ctx.fillStyle = 'rgba(167,139,250,0.08)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3.2, 0, 6.2832);
        ctx.fill();

        ctx.fillStyle = 'rgba(196,181,253,0.6)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, 6.2832);
        ctx.fill();
      }

      for (i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const A = nodes[p.a];
        const B = nodes[p.b];

        if (p.t >= 1 || Math.hypot(A.x - B.x, A.y - B.y) > LINK * 1.15) {
          pulses.splice(i, 1);
          continue;
        }

        const x = A.x + (B.x - A.x) * p.t;
        const y = A.y + (B.y - A.y) * p.t;

        ctx.fillStyle = 'rgba(103,232,249,0.16)';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 6.2832);
        ctx.fill();

        ctx.fillStyle = 'rgba(165,243,252,0.95)';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 6.2832);
        ctx.fill();

        p.t += p.s;
      }
    }

    function tick() {
      if (!visible || beyondOpen) {
        raf = null;
        return;
      }
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      spawnPulse();
      draw();
      raf = requestAnimationFrame(tick);
    }

    resize();
    const handleResize = rafThrottle(resize);
    if ('ResizeObserver' in window) new ResizeObserver(handleResize).observe(wrap);
    else window.addEventListener('resize', handleResize, { passive: true });

    if (reduce) return;

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible && !beyondOpen && !raf) raf = requestAnimationFrame(tick);
      }).observe(wrap);
    }

    window.addEventListener('beyond:statechange', (e) => {
      beyondOpen = Boolean(e.detail?.open);
      if (beyondOpen && raf) {
        cancelAnimationFrame(raf);
        raf = null;
      } else if (!beyondOpen && visible && !raf) {
        raf = requestAnimationFrame(tick);
      }
    });

    raf = requestAnimationFrame(tick);
  }

  if (!start()) {
    const watcher = new MutationObserver(() => {
      if (start()) watcher.disconnect();
    });
    watcher.observe(document.documentElement, { childList: true, subtree: true });
  }
}