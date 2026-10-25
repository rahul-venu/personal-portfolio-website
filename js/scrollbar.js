export function initScrollbar() {
  // Only on desktop with a mouse. Phones/tablets keep their own overlay scrollbar.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const de = document.documentElement;

  const style = document.createElement('style');
  style.textContent = `
    /* 1. Completely kill the native scrollbar and its background box/gutter */
    html.custom-scroll,
    html.custom-scroll body {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    html.custom-scroll::-webkit-scrollbar,
    html.custom-scroll body::-webkit-scrollbar,
    html.custom-scroll::-webkit-scrollbar-track,
    html.custom-scroll::-webkit-scrollbar-track-piece {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
      background: transparent !important;
    }

    /* 2. Floating translucent pill thumb (GPU-composited, zero blur-repaint lag) */
    #page-scrollthumb {
      position: fixed;
      top: 0;
      right: 5px;
      width: 7px;
      border-radius: 9999px;
      background: rgba(185, 200, 215, 0.38);
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow: none !important;
      z-index: 9999;
      cursor: grab;
      user-select: none;
      pointer-events: auto;
      transition: background-color 0.2s ease, width 0.2s ease, border-color 0.2s ease;
      will-change: transform;
      contain: layout style paint;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }

    #page-scrollthumb:hover,
    #page-scrollthumb.dragging {
      width: 9px;
      background: rgba(210, 225, 240, 0.6);
      border-color: rgba(255, 255, 255, 0.28);
    }

    #page-scrollthumb.dragging {
      cursor: grabbing;
    }
  `;
  document.head.appendChild(style);

  const thumb = document.createElement('div');
  thumb.id = 'page-scrollthumb';
  document.body.appendChild(thumb);
  de.classList.add('custom-scroll');

  const PAD = 6;
  let vh = window.innerHeight;
  let total = de.scrollHeight;
  let thumbH = 70;
  let maxScroll = 1;
  let trackTravel = 1;

  function measure() {
    vh = window.innerHeight;
    total = de.scrollHeight;
    if (total <= vh + 1) {
      thumb.style.display = 'none';
      return;
    }
    thumb.style.display = 'block';

    // Dynamic height capped between 44px and 90px
    thumbH = Math.min(90, Math.max(44, Math.round((vh * vh) / total)));
    thumb.style.height = thumbH + 'px';

    maxScroll = Math.max(1, total - vh);
    trackTravel = Math.max(1, vh - thumbH - PAD * 2);
    renderPosition();
  }

  function renderPosition() {
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    const y = progress * trackTravel + PAD;
    thumb.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
  }

  window.addEventListener('scroll', renderPosition, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
  measure();

  // Drag the thumb to scroll
  let dragging = false, startY = 0, startScroll = 0;
  thumb.addEventListener('pointerdown', (e) => {
    dragging = true;
    startY = e.clientY;
    startScroll = window.scrollY;
    thumb.setPointerCapture(e.pointerId);
    thumb.classList.add('dragging');
    e.preventDefault();
  });
  thumb.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const ratio = maxScroll / trackTravel;
    window.scrollTo({ top: startScroll + (e.clientY - startY) * ratio, behavior: 'instant' });
  });
  function stop() {
    dragging = false;
    thumb.classList.remove('dragging');
  }
  thumb.addEventListener('pointerup', stop);
  thumb.addEventListener('pointercancel', stop);
}