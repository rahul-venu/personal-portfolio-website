/* ================= SIGNATURE WRITING PRELOADER -> FLY TO NAVBAR LOGO (js/preloader.js) ================= */

import { SIGNATURE_PATHS } from './config.js';

export function initPreloader() {
  const preloader = document.getElementById('site-preloader');
  if (!preloader) return;

  // 1. Disable browser scroll-position memory on refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // 2. Clear any section #hash from URL so refresh always starts on Home
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  // 3. Instantly jump to top (Home) behind the preloader screen
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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

    .pre-sig-ghost {
      fill: none;
      stroke: rgba(255, 255, 255, 0.06);
      stroke-width: 3.6;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

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

  preloader.innerHTML = `
    <div class="pre-content">
      <div class="pre-sig-wrap">
        <svg id="preloader-sig-svg" viewBox="0 0 430 75" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading Signature">
          <path class="pre-sig-ghost" d="${SIGNATURE_PATHS.rahul}" />
          <path class="pre-sig-ghost" d="${SIGNATURE_PATHS.venu}" />

          <path class="pre-sig-ink ink-rahul" pathLength="1" d="${SIGNATURE_PATHS.rahul}" />
          <path class="pre-sig-ink ink-venu" pathLength="1" d="${SIGNATURE_PATHS.venu}" />
        </svg>
      </div>

      <div class="pre-divider"></div>
      <p class="pre-note">
        OPTIMIZED FOR DESKTOP VIEWING &nbsp;•&nbsp; CRAFTED WITH 🤍
      </p>
    </div>
  `.trim();

  // =========================================================================
  // RAM-SAFE ASSET PRELOADER: Decodes ONLY Main-Page Critical Images
  // (Beyond the Code images use data-src and hydrate on-demand per chapter)
  // =========================================================================
  function preloadCriticalSiteAssets() {
    const criticalImages = Array.from(document.querySelectorAll('main img[src]:not([data-src])'));

    const imagePromises = criticalImages.map((domImg) => {
      domImg.loading = 'eager';
      domImg.decoding = 'async';

      const src = domImg.getAttribute('src');
      if (!src) return Promise.resolve();

      return new Promise((resolve) => {
        const onReady = () => {
          domImg.classList.add('is-loaded');
          if (typeof domImg.decode === 'function') {
            domImg.decode().then(resolve).catch(resolve);
          } else {
            resolve();
          }
        };

        if (domImg.complete && domImg.naturalWidth > 0) {
          onReady();
        } else {
          domImg.addEventListener('load', onReady, { once: true });
          domImg.addEventListener('error', () => resolve(), { once: true });
        }
      });
    });

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const windowLoaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((res) => window.addEventListener('load', res, { once: true }));

    const minSigTime = new Promise((res) => setTimeout(res, 2250));
    const maxSafetyTimeout = new Promise((res) => setTimeout(res, 5500));

    return Promise.all([
      minSigTime,
      Promise.race([Promise.all([...imagePromises, fontsReady, windowLoaded]), maxSafetyTimeout])
    ]);
  }

  requestAnimationFrame(() => {
    preloadCriticalSiteAssets().then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      const sigWrap = preloader.querySelector('.pre-sig-wrap');
      const navLogo = document.getElementById('brand-identity');

      if (sigWrap && navLogo) {
        const sigRect = sigWrap.getBoundingClientRect();
        const navRect = navLogo.getBoundingClientRect();

        const dx = (navRect.left + navRect.width / 2) - (sigRect.left + sigRect.width / 2);
        const dy = (navRect.top + navRect.height / 2) - (sigRect.top + sigRect.height / 2);

        sigWrap.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(0.35)`;
        sigWrap.style.opacity = '0';
      }

      preloader.classList.add('is-docking');
      document.documentElement.style.overflow = '';

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('preloader:done'));
      }, 520);

      setTimeout(() => {
        style.remove();
        preloader.remove();
      }, 900);
    });
  });
}