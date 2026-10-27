/* ================= SIGNATURE WRITING PRELOADER -> FLY TO NAVBAR LOGO (js/preloader.js) ================= */

export function initPreloader() {
  const preloader = document.getElementById('site-preloader');
  if (!preloader) return;

  // 1. Disable browser scroll-position memory on refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // 2. Clear any section #hash (e.g. #about, #projects) from URL so refresh always starts on Home
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  // 3. Instantly jump to top (Home) behind the preloader screen
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.documentElement.style.overflow = 'hidden';

  document.documentElement.style.overflow = 'hidden';

  const style = document.createElement('style');
  style.textContent = `
    #site-preloader {
      transition:
        background-color 0.75s cubic-bezier(0.22, 1, 0.36, 1),
        visibility 0.85s;
      will-change: background-color;
      user-select: none;
    }

    /* Background dissolves to transparent while signature flies up into the navbar */
    #site-preloader.is-docking {
      background-color: rgba(11, 11, 12, 0) !important;
      pointer-events: none;
    }

    .pre-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0 24px;
    }

    .pre-sig-wrap {
      margin: 0 0 28px;
      position: relative;
      transform-origin: center center;
      transition:
        transform 0.82s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.72s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform, opacity;
    }

    #preloader-sig-svg {
      width: clamp(220px, 30vw, 290px);
      height: auto;
      overflow: visible;
    }

    /* Faint ghost track of the signature */
    .pre-sig-ghost {
      fill: none;
      stroke: rgba(255, 255, 255, 0.06);
      stroke-width: 3.6;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* Active writing ink stroke */
    .pre-sig-ink {
      fill: none;
      stroke: #6d35e8;
      stroke-width: 3.8;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 1.05;
      stroke-dashoffset: 1.05;
      opacity: 0;
      filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.55));
    }

    .pre-sig-ink.ink-rahul {
      animation: preWriteSig 1.1s cubic-bezier(0.35, 0, 0.25, 1) 0.15s forwards;
    }

    .pre-sig-ink.ink-venu {
      animation: preWriteSig 0.85s cubic-bezier(0.25, 0.1, 0.25, 1) 1.25s forwards;
    }

    .pre-divider,
    .pre-note {
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .pre-divider {
      width: 28px;
      height: 1px;
      background: rgba(255, 255, 255, 0.18);
      margin-bottom: 14px;
      opacity: 0;
      animation: preFadeUp 0.6s ease 0.2s forwards;
    }

    .pre-note {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px;
      font-weight: 400;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #a1a1aa;
      opacity: 0;
      transform: translateY(6px);
      animation: preFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.25s forwards;
    }

    /* Fade out bottom text quickly as signature starts flying up */
    #site-preloader.is-docking .pre-divider,
    #site-preloader.is-docking .pre-note {
      opacity: 0 !important;
      transform: translateY(10px) !important;
      animation: none !important;
    }

    @keyframes preWriteSig {
      0% {
        stroke-dashoffset: 1.05;
        opacity: 0;
      }
      2% {
        opacity: 1;
      }
      50% {
        filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.75));
      }
      100% {
        stroke-dashoffset: 0;
        opacity: 1;
        filter: drop-shadow(0 0 5px rgba(109, 53, 232, 0.4));
      }
    }

    @keyframes preFadeUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  const rahulPath = "M 24 28 L 22 60 C 21 38, 30 14, 46 15 C 60 16, 56 38, 32 48 C 22 52, 16 52, 19 50 C 26 48, 40 58, 54 60 C 64 61, 78 52, 74 44 C 69 39, 57 47, 60 57 C 63 63, 72 56, 76 47 C 76 56, 82 61, 90 59 C 101 56, 107 34, 108 16 C 107 36, 106 54, 107 60 C 109 50, 117 44, 121 53 C 123 60, 134 61, 144 56 C 150 52, 152 46, 152 54 C 152 61, 163 61, 169 53 C 169 60, 178 61, 186 55 C 193 48, 196 28, 194 14 C 193 34, 195 56, 202 59 C 207 61, 214 57, 219 51";
  const venuPath  = "M 254 16 C 268 25, 278 44, 282 60 C 287 44, 300 26, 297 18 C 294 12, 284 26, 285 45 C 286 58, 299 60, 310 55 C 319 50, 322 42, 316 41 C 310 40, 308 52, 316 58 C 324 63, 335 56, 340 48 C 342 54, 342 60, 342 58 C 344 50, 353 44, 357 52 C 360 59, 368 60, 376 55 C 381 51, 383 46, 383 54 C 383 60, 393 60, 398 53 C 398 60, 408 60, 421 51";

  preloader.innerHTML = `
    <div class="pre-content">
      <div class="pre-sig-wrap">
        <svg id="preloader-sig-svg" viewBox="0 0 430 75" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading Signature">
          <path class="pre-sig-ghost" d="${rahulPath}" />
          <path class="pre-sig-ghost" d="${venuPath}" />

          <path class="pre-sig-ink ink-rahul" pathLength="1" d="${rahulPath}" />
          <path class="pre-sig-ink ink-venu" pathLength="1" d="${venuPath}" />
        </svg>
      </div>

      <div class="pre-divider"></div>
      <p class="pre-note">
        OPTIMIZED FOR DESKTOP VIEWING &nbsp;•&nbsp; CRAFTED WITH 🤍
      </p>
    </div>
  `.trim();

  // After signature finishes writing (~2.25s), fly & zoom out directly into #brand-identity in the navbar!
  setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); // <-- Ensures we are 100% on Home before measuring navbar!
    const sigWrap = preloader.querySelector('.pre-sig-wrap');
    const navLogo = document.getElementById('brand-identity');

    if (sigWrap && navLogo) {
      const sigRect = sigWrap.getBoundingClientRect();
      const navRect = navLogo.getBoundingClientRect();

      // Calculate exact vector from center of preloader signature to center of navbar logo
      const dx = (navRect.left + navRect.width / 2) - (sigRect.left + sigRect.width / 2);
      const dy = (navRect.top + navRect.height / 2) - (sigRect.top + sigRect.height / 2);

      // Zoom down to navbar scale (0.35) while flying to the exact navbar coordinates
      sigWrap.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(0.35)`;
      sigWrap.style.opacity = '0';
    }

    preloader.classList.add('is-docking');
    document.documentElement.style.overflow = '';

    // Fire preloader:done right as the shrinking signature arrives at the navbar logo (~550ms into flight)
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('preloader:done'));
    }, 520);

    setTimeout(() => {
      preloader.remove();
    }, 900);
  }, 2250);
}