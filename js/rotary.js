// ================= MECHANICAL ROTARY / ODOMETER COUNTER =================
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function setupRotaryElement(el) {
  const originalText = el.textContent.trim();
  el.setAttribute('aria-label', originalText);
  el.innerHTML = '';
  el.classList.add('inline-flex', 'items-center', 'overflow-hidden');

  const columns = [];

  for (let i = 0; i < originalText.length; i++) {
    const char = originalText[i];

    // Preserve natural spaces
    if (char === ' ') {
      const space = document.createElement('span');
      space.className = 'inline-block w-[0.6ch]';
      space.innerHTML = '&nbsp;';
      el.appendChild(space);
      continue;
    }

    // Single character window (overflow hidden)
    const col = document.createElement('span');
    col.className = 'inline-block relative overflow-hidden h-[1.25em] leading-[1.25em] align-top';

    // Vertical strip of rotating characters
    const strip = document.createElement('span');
    strip.className = 'inline-flex flex-col';

    // Increased to 22-30 spins so it travels more distance during the extra second
    const rollsCount = 22 + Math.floor(Math.random() * 8); 
    const items = [];
    for (let r = 0; r < rollsCount; r++) {
      items.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
    }
    items.push(char); // Target character is the last one in the reel

    items.forEach((c) => {
      const span = document.createElement('span');
      span.className = 'h-[1.25em] flex items-center justify-center';
      span.textContent = c;
      strip.appendChild(span);
    });

    col.appendChild(strip);
    el.appendChild(col);

    columns.push({
      strip: strip,
      totalItems: items.length
    });
  }

  return columns;
}

function spinColumns(columns) {
  columns.forEach((colObj, index) => {
    const { strip, totalItems } = colObj;
    const targetY = -((totalItems - 1) * (100 / totalItems));

    // Staggered cascade 
    const delay = index * 50;
    const duration = 2000 + (index * 40);

    strip.animate([
      { transform: 'translateY(0%)' },
      { transform: `translateY(${targetY}%)` }
    ], {
      duration: duration,
      delay: delay,
      easing: 'cubic-bezier(0.12, 0.8, 0.22, 1)', // Smooth mechanical deceleration
      fill: 'forwards'
    });
  });
}

export function initRotaryCounter() {
  const targets = document.querySelectorAll('.rotary-title');
  if (!targets.length) return;

  const elementsData = [];
  targets.forEach((el) => {
    const columns = setupRotaryElement(el);
    elementsData.push({ el, columns, played: false });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const data = elementsData.find((d) => d.el === entry.target);
        if (data && !data.played) {
          data.played = true;
          spinColumns(data.columns);
          observer.unobserve(entry.target);
        }
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px'
  });

  elementsData.forEach((d) => observer.observe(d.el));
}