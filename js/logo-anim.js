/* ================= UNIFIED LOGO ANIMATIONS (RIBBON STYLE) =================
   - Zero blur, zero drop-shadow, zero gradient overspill.
   - Uses true SVG <clipPath> + centerline stroke-dashoffset so a 100% solid
     #6d35e8 purple ribbon snakes through R and V geometry and wipes through A-H-U-L.
   - Consolidates signature and RV vector paths from central config.
*/

import { SIGNATURE_PATHS, BRAND_RV_PATHS, clearTimerList } from './config.js';

export function initLogoAnim() {
  const style = document.createElement('style');
  style.textContent = `
    /* Hard-edge solid ribbon for text characters (A, H, U, L) */
    .lp-ink-char {
      display: inline-block;
      color: #ffffff;
      background-image: linear-gradient(
        105deg,
        #ffffff 0%,
        #ffffff 35%,
        #6d35e8 35.1%,
        #6d35e8 64.9%,
        #ffffff 65%,
        #ffffff 100%
      );
      background-size: 300% 100%;
      background-position: 100% 0%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: none !important;
    }

    .lp-ink-char.is-writing {
      animation: solidRibbonChar 0.65s linear forwards;
    }

    @keyframes solidRibbonChar {
      0%   { background-position: 100% 0%; }
      100% { background-position: 0% 0%; }
    }

    /* SVG centerline ribbon stroke */
    .lp-ribbon-stroke {
      fill: none;
      stroke: #6d35e8;
      stroke-linecap: butt;
      stroke-linejoin: miter;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
    }

    .lp-v-slash-base {
      fill: #ffffff;
      transition: fill 0.15s linear;
    }
    .lp-v-slash-base.is-ignited {
      fill: #6d35e8 !important;
    }

    #brand-identity.is-scrolled .brand-svg-v,
    #brand-identity.is-scrolled:hover .brand-svg-v,
    .footer-svg-v,
    .group\\/footer-logo:hover .footer-svg-v {
      filter: none !important;
    }

    /* Footer logo typewriter and collapse styles */
    #footer-brand-logo .fb-char {
      opacity: 0;
      transform: translateY(6px);
      transition:
        opacity 0.42s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
    }

    #footer-brand-logo .fb-char.is-typed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    #footer-brand-logo .fb-collapse {
      display: inline-flex;
      align-items: center;
      overflow: hidden;
      white-space: nowrap;
      transform-origin: left center;
      transition:
        max-width 1.1s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
        margin 1.1s cubic-bezier(0.22, 1, 0.36, 1),
        transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
    }

    #footer-brand-logo .fb-collapse-ahul {
      max-width: 80px;
      margin-left: 3px;
      opacity: 1;
    }

    #footer-brand-logo .fb-collapse-space {
      width: 7px;
      max-width: 7px;
      opacity: 1;
    }

    #footer-brand-logo .fb-collapse-enu {
      max-width: 65px;
      margin-left: 2px;
      opacity: 1;
    }

    #footer-brand-logo .fb-svg-v {
      margin-left: 0;
      transition:
        opacity 0.42s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
        margin-left 1.1s cubic-bezier(0.22, 1, 0.36, 1);
    }

    #footer-brand-logo.is-collapsed .fb-collapse {
      max-width: 0px !important;
      opacity: 0 !important;
      margin-left: 0px !important;
      transform: scaleX(0.75);
    }

    #footer-brand-logo.is-collapsed .fb-svg-v {
      margin-left: -0.30em !important;
    }

    #footer-brand-logo.is-collapsed:hover .fb-collapse-ahul {
      max-width: 80px !important;
      opacity: 1 !important;
      margin-left: 3px !important;
      transform: scaleX(1);
    }

    #footer-brand-logo.is-collapsed:hover .fb-collapse-space {
      max-width: 7px !important;
      opacity: 1 !important;
      transform: scaleX(1);
    }

    #footer-brand-logo.is-collapsed:hover .fb-collapse-enu {
      max-width: 65px !important;
      opacity: 1 !important;
      margin-left: 2px !important;
      transform: scaleX(1);
    }

    #footer-brand-logo.is-collapsed:hover .fb-svg-v {
      margin-left: 0 !important;
    }
  `;
  document.head.appendChild(style);

  // Vector clip-path and centerline stroke injection for letter R
  function injectLandoStyleSvgR(container, prefix) {
    container.innerHTML = `
      <svg class="h-[0.85em] w-auto block" viewBox="0 300 485 445" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="${prefix}-r-clip">
            <path d="${BRAND_RV_PATHS.rTop}"/>
            <path d="${BRAND_RV_PATHS.rBody}"/>
          </clipPath>
        </defs>
        <g fill="#ffffff">
          <path d="${BRAND_RV_PATHS.rTop}"/>
          <path d="${BRAND_RV_PATHS.rBody}"/>
        </g>
        <g clip-path="url(#${prefix}-r-clip)">
          <path id="${prefix}-r-stroke-1" class="lp-ribbon-stroke" stroke-width="110" pathLength="1" d="M 0 352 L 395 352" />
          <path id="${prefix}-r-stroke-2" class="lp-ribbon-stroke" stroke-width="130" pathLength="1" d="M 106 740 L 106 543 L 415 543 L 290 560 L 450 740" />
        </g>
      </svg>
    `.trim();
  }

  // Vector clip-path and centerline stroke injection for letter V
  function injectLandoStyleSvgV(container, prefix) {
    container.innerHTML = `
      <svg class="h-[0.85em] w-auto block" viewBox="380 300 555 445" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="${prefix}-v-body-clip">
            <path d="${BRAND_RV_PATHS.vBody}"/>
          </clipPath>
          <clipPath id="${prefix}-v-slash-clip">
            <polygon points="${BRAND_RV_PATHS.vSlashPoints}"/>
          </clipPath>
        </defs>
        <path fill="#ffffff" d="${BRAND_RV_PATHS.vBody}"/>
        <polygon id="${prefix}-v-slash-base" class="lp-v-slash-base" points="${BRAND_RV_PATHS.vSlashPoints}"/>

        <g clip-path="url(#${prefix}-v-body-clip)">
          <path id="${prefix}-v-stroke" class="lp-ribbon-stroke" stroke-width="140" pathLength="1" d="M 385 310 L 630 665 L 780 445" />
        </g>

        <g clip-path="url(#${prefix}-v-slash-clip)">
          <path id="${prefix}-v-cap-stroke" class="lp-ribbon-stroke" stroke-width="160" pathLength="1" d="M 750 430 L 885 300" />
        </g>
      </svg>
    `.trim();
  }

  // Smooth cubic ease stroke-dashoffset transition
  function animateRibbonPass(pathEl, durationMs, rafList) {
    if (!pathEl) return;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / durationMs);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const offset = 1 - 2 * ease;
      pathEl.style.strokeDashoffset = offset.toFixed(4);
      if (t < 1) {
        rafList.push(requestAnimationFrame(frame));
      } else {
        pathEl.style.strokeDashoffset = '1';
      }
    }
    rafList.push(requestAnimationFrame(frame));
  }

  // Completes ribbon path and maintains solid fill on the V slash
  function animateRibbonFillIn(pathEl, slashBaseEl, durationMs, rafList) {
    if (!pathEl) return;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / durationMs);
      const ease = 1 - Math.pow(1 - t, 3);
      const offset = 1 - ease;
      pathEl.style.strokeDashoffset = offset.toFixed(4);
      if (t < 1) {
        rafList.push(requestAnimationFrame(frame));
      } else {
        if (slashBaseEl) slashBaseEl.classList.add('is-ignited');
      }
    }
    rafList.push(requestAnimationFrame(frame));
  }

  // Master sequence: R -> A -> H -> U -> L -> V -> V-Cap
  function runWritingFlow(prefix, charNodes, timerList, rafList, startDelay = 0) {
    const rStroke1 = document.getElementById(`${prefix}-r-stroke-1`);
    const rStroke2 = document.getElementById(`${prefix}-r-stroke-2`);
    const vStroke = document.getElementById(`${prefix}-v-stroke`);
    const vCapStroke = document.getElementById(`${prefix}-v-cap-stroke`);
    const vSlashBase = document.getElementById(`${prefix}-v-slash-base`);

    [rStroke1, rStroke2, vStroke, vCapStroke].forEach((el) => {
      if (el) el.style.strokeDashoffset = '1';
    });
    if (vSlashBase) vSlashBase.classList.remove('is-ignited');

    timerList.push(setTimeout(() => {
      animateRibbonPass(rStroke1, 380, rafList);
    }, startDelay));

    timerList.push(setTimeout(() => {
      animateRibbonPass(rStroke2, 500, rafList);
    }, startDelay + 180));

    const CHAR_START = startDelay + 520;
    const CHAR_STEP = 190;
    charNodes.forEach((charEl, idx) => {
      if (!charEl) return;
      timerList.push(setTimeout(() => {
        charEl.classList.remove('is-writing');
        void charEl.offsetWidth;
        charEl.classList.add('is-writing');
      }, CHAR_START + idx * CHAR_STEP));
    });

    const vStart = startDelay + 1320;
    timerList.push(setTimeout(() => {
      animateRibbonPass(vStroke, 550, rafList);
    }, vStart));

    const vCapStart = startDelay + 1720;
    timerList.push(setTimeout(() => {
      animateRibbonFillIn(vCapStroke, vSlashBase, 280, rafList);
    }, vCapStart));

    return startDelay + 2000;
  }

  // ================= 1. HEADER NAVBAR LOGO =================
  const brandIdentity = document.getElementById('brand-identity');
  if (brandIdentity) {
    const rWrap = brandIdentity.querySelector('.brand-svg-r');
    const vWrap = brandIdentity.querySelector('.brand-svg-v');
    const ahulWrap = brandIdentity.querySelector('.brand-collapsible-char');

    if (rWrap) injectLandoStyleSvgR(rWrap, 'hdr');
    if (vWrap) injectLandoStyleSvgV(vWrap, 'hdr');

    let hChars = [];
    if (ahulWrap) {
      ahulWrap.innerHTML = `
        <span class="lp-ink-char hb-a">A</span><span class="lp-ink-char hb-h">H</span><span class="lp-ink-char hb-u">U</span><span class="lp-ink-char hb-l">L</span>
      `.trim();
      hChars = Array.from(ahulWrap.querySelectorAll('.lp-ink-char'));
    }

    let hdrTimers = [];
    let hdrRafs = [];

    const clearHdrAnims = () => {
      clearTimerList(hdrTimers);
      hdrRafs.forEach((r) => cancelAnimationFrame(r));
      hdrRafs = [];
    };

    if (document.getElementById('site-preloader')) {
      window.addEventListener('preloader:done', () => {
        runWritingFlow('hdr', hChars, hdrTimers, hdrRafs, 0);
      }, { once: true });
    } else {
      runWritingFlow('hdr', hChars, hdrTimers, hdrRafs, 400);
    }

    brandIdentity.addEventListener('mouseenter', () => {
      clearHdrAnims();
      const activeChars = brandIdentity.classList.contains('is-scrolled') ? [] : hChars;
      runWritingFlow('hdr', activeChars, hdrTimers, hdrRafs, 0);
    });

    let isScrolled = false;
    const handleBrandScroll = () => {
      const shouldScroll = window.scrollY > 50;
      if (shouldScroll !== isScrolled) {
        isScrolled = shouldScroll;
        brandIdentity.classList.toggle('is-scrolled', isScrolled);
      }
    };

    window.addEventListener('scroll', handleBrandScroll, { passive: true });
    handleBrandScroll();
  }

  // ================= 2. FOOTER LOGO =================
  const footerLogo = document.querySelector('.cs-foot-logo') || document.getElementById('footer-brand-logo');
  const footerEl = document.querySelector('.cs-foot') || document.getElementById('contact');

  if (footerLogo) {
    footerLogo.id = 'footer-brand-logo';

    footerLogo.innerHTML = `
      <span class="fb-char fb-svg-r inline-flex items-center shrink-0 text-sm sm:text-base"></span>
      <span class="fb-collapse fb-collapse-ahul">
        <span class="fb-char lp-ink-char fb-a">A</span>
        <span class="fb-char lp-ink-char fb-h">H</span>
        <span class="fb-char lp-ink-char fb-u">U</span>
        <span class="fb-char lp-ink-char fb-l">L</span>
      </span>
      <span class="fb-collapse fb-collapse-space"></span>
      <span class="fb-char fb-svg-v inline-flex items-center shrink-0 text-sm sm:text-base"></span>
      <span class="fb-collapse fb-collapse-enu">
        <span class="fb-char lp-ink-char fb-e">E</span>
        <span class="fb-char lp-ink-char fb-n">N</span>
        <span class="fb-char lp-ink-char fb-u2">U</span>
      </span>
    `.trim();

    const fRWrap = footerLogo.querySelector('.fb-svg-r');
    const fVWrap = footerLogo.querySelector('.fb-svg-v');
    injectLandoStyleSvgR(fRWrap, 'ftr');
    injectLandoStyleSvgV(fVWrap, 'ftr');

    const allChars = Array.from(footerLogo.querySelectorAll('.fb-char'));
    const fAhulChars = [
      footerLogo.querySelector('.fb-a'),
      footerLogo.querySelector('.fb-h'),
      footerLogo.querySelector('.fb-u'),
      footerLogo.querySelector('.fb-l')
    ];

    let fTimers = [];
    let fRafs = [];
    let isPlaying = false;

    const clearFooterAnims = () => {
      clearTimerList(fTimers);
      fRafs.forEach((r) => cancelAnimationFrame(r));
      fRafs = [];
    };

    const resetFooterLogo = () => {
      clearFooterAnims();
      isPlaying = false;
      footerLogo.classList.remove('is-collapsed');
      allChars.forEach((c) => c.classList.remove('is-typed', 'is-writing'));
      const fSlashBase = document.getElementById('ftr-v-slash-base');
      const fCapStroke = document.getElementById('ftr-v-cap-stroke');
      if (fSlashBase) fSlashBase.classList.remove('is-ignited');
      if (fCapStroke) fCapStroke.style.strokeDashoffset = '1';
    };

    const playFooterSequence = () => {
      if (isPlaying) return;
      isPlaying = true;
      clearFooterAnims();

      const TYPE_STEP = 100;
      allChars.forEach((charEl, i) => {
        fTimers.push(
          setTimeout(() => {
            charEl.classList.add('is-typed');
          }, i * TYPE_STEP)
        );
      });

      const writeStart = allChars.length * TYPE_STEP + 200;
      const vCapDoneTime = runWritingFlow('ftr', fAhulChars, fTimers, fRafs, writeStart);

      fTimers.push(
        setTimeout(() => {
          footerLogo.classList.add('is-collapsed');
        }, vCapDoneTime + 850)
      );
    };

    const checkFooterVisibility = () => {
      const target = footerEl || footerLogo;
      const rect = target.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh - 10 && rect.bottom > 0) {
        playFooterSequence();
      } else if (rect.top > vh + 100) {
        resetFooterLogo();
      }
    };

    window.addEventListener('scroll', checkFooterVisibility, { passive: true });
    window.addEventListener('resize', checkFooterVisibility, { passive: true });
    checkFooterVisibility();
  }

  // ================= 3. ABOUT PORTRAIT CURSIVE SIGNATURE =================
  const sigMounts = document.querySelectorAll('#about .about-sig-mount');
  if (sigMounts.length) {
    const sigStyle = document.createElement('style');
    sigStyle.textContent = `
      .about-sig-svg {
        width: 160px;
        height: auto;
        overflow: visible;
        transform: rotate(-25deg);
        transform-origin: center center;
        filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.85));
      }

      .about-sig-stroke {
        fill: none;
        stroke: #a1a1aa; 
        stroke-width: 3.8;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-dasharray: 1;
        stroke-dashoffset: 1;
      }

      .about-sig-svg.is-signed .sig-rahul {
        animation: drawAboutSig 1.15s cubic-bezier(0.35, 0, 0.25, 1) 0.25s forwards;
      }

      .about-sig-svg.is-signed .sig-venu {
        animation: drawAboutSig 0.9s cubic-bezier(0.25, 0.1, 0.25, 1) 1.4s forwards;
      }

      @keyframes drawAboutSig {
        0%   { stroke-dashoffset: 1; }
        100% { stroke-dashoffset: 0; }
      }
    `;
    document.head.appendChild(sigStyle);

    const sigMarkup = `
      <svg class="about-sig-svg" viewBox="0 0 430 75" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Rahul Venu Signature">
        <path class="about-sig-stroke sig-rahul" pathLength="1" d="${SIGNATURE_PATHS.rahul}" />
        <path class="about-sig-stroke sig-venu" pathLength="1" d="${SIGNATURE_PATHS.venu}" />
      </svg>
    `.trim();

    sigMounts.forEach((mount) => {
      mount.innerHTML = sigMarkup;
    });

    const aboutSection = document.getElementById('about');
    if (aboutSection && 'IntersectionObserver' in window) {
      const sigObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const svgs = document.querySelectorAll('#about .about-sig-svg');
            if (entry.isIntersecting) {
              svgs.forEach((svg) => svg.classList.add('is-signed'));
            } else {
              svgs.forEach((svg) => svg.classList.remove('is-signed'));
            }
          });
        },
        { threshold: 0.25 }
      );
      sigObserver.observe(aboutSection);
    }
  }

  // ================= 4. PORTRAIT HOVER COLOR SPOTLIGHT TRACKER =================
  document.querySelectorAll('.photo-color-spotlight').forEach((box) => {
    box.addEventListener('pointermove', (e) => {
      const rect = box.getBoundingClientRect();
      box.style.setProperty('--spot-x', `${(e.clientX - rect.left).toFixed(1)}px`);
      box.style.setProperty('--spot-y', `${(e.clientY - rect.top).toFixed(1)}px`);
      box.style.setProperty('--spot-r', '165px');
    });

    box.addEventListener('pointerleave', () => {
      box.style.setProperty('--spot-r', '0px');
    });
  });
}