/* ================= UNIFIED LOGO ANIMATIONS (RIBBON STYLE) =================
   - Zero blur, zero drop-shadow, zero gradient overspill.
   - Uses true SVG <clipPath> + centerline <path pathLength="1"> stroke-dashoffset
     so a 100% solid, razor-sharp #6d35e8 purple ribbon snakes through the exact
     centerline geometry of R and V (and hard-stop wipes through A-H-U-L),
     finishing by filling the top-right slash of V!
*/

export function initLogoAnim() {
  const style = document.createElement('style');
  style.textContent = `
    /* ================= HARD-EDGE SOLID RIBBON FOR TEXT (A, H, U, L) ================= */
    /* Zero feathering, zero drop-shadow: 100% hard-stop solid #6d35e8 ribbon */
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

    /* ================= SVG CENTERLINE RIBBON STROKE (R, V & V-CAP) ================= */
    .lp-ribbon-stroke {
      fill: none;
      stroke: #6d35e8;
      stroke-linecap: butt;
      stroke-linejoin: miter;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
    }

    /* Permanent V-cap fill once the ribbon writes into it */
    .lp-v-slash-base {
      fill: #ffffff;
      transition: fill 0.15s linear;
    }
    .lp-v-slash-base.is-ignited {
      fill: #6d35e8 !important;
    }

    /* Kill any old purple drop-shadow bleed on scrolled RV */
    #brand-identity.is-scrolled .brand-svg-v,
    #brand-identity.is-scrolled:hover .brand-svg-v,
    .footer-svg-v,
    .group\\/footer-logo:hover .footer-svg-v {
      filter: none !important;
    }

    /* ================= FOOTER TYPEWRITER & BUTTER-SMOOTH COLLAPSE ================= */
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

  // =========================================================================
  // TRUE VECTOR CLIP-PATH + CENTERLINE STROKE-DASHOFFSET BUILDERS (R & V)
  // =========================================================================
  function injectLandoStyleSvgR(container, prefix) {
    // Clips a thick centerline stroke strictly inside R's exact vector silhouette (0 overspill!)
    container.innerHTML = `
      <svg class="h-[0.85em] w-auto block" viewBox="0 300 485 445" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="${prefix}-r-clip">
            <path d="M8 312 H385 V392 H8 Z"/>
            <path d="M68 508 H392 A35 35 0 0 1 392 578 H348 L483 733 H382 L250 578 H145 V733 H68 Z"/>
          </clipPath>
        </defs>
        <!-- Crisp Pure White Base -->
        <g fill="#ffffff">
          <path d="M8 312 H385 V392 H8 Z"/>
          <path d="M68 508 H392 A35 35 0 0 1 392 578 H348 L483 733 H382 L250 578 H145 V733 H68 Z"/>
        </g>
        <!-- Solid Purple Ribbon Clipped Strictly Inside R -->
        <g clip-path="url(#${prefix}-r-clip)">
          <!-- Stroke 1: Top horizontal bar (Left -> Right) -->
          <path id="${prefix}-r-stroke-1" class="lp-ribbon-stroke" stroke-width="110" pathLength="1" d="M 0 352 L 395 352" />
          <!-- Stroke 2: Stem up, across loop, and down diagonal leg -->
          <path id="${prefix}-r-stroke-2" class="lp-ribbon-stroke" stroke-width="130" pathLength="1" d="M 106 740 L 106 543 L 415 543 L 290 560 L 450 740" />
        </g>
      </svg>
    `.trim();
  }

  function injectLandoStyleSvgV(container, prefix) {
    // Clips a thick centerline stroke strictly inside V's exact vector silhouette (0 overspill!)
    container.innerHTML = `
      <svg class="h-[0.85em] w-auto block" viewBox="380 300 555 445" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="${prefix}-v-body-clip">
            <path d="M385 312 C415 312 436 326 452 350 L630 585 L718 458 H812 L630 720 L405 413 C397 402 388 392 368 392 L385 312 Z"/>
          </clipPath>
          <clipPath id="${prefix}-v-slash-clip">
            <polygon points="805,312 928,312 840,420 718,420"/>
          </clipPath>
        </defs>
        <!-- Crisp Pure White Base -->
        <path fill="#ffffff" d="M385 312 C415 312 436 326 452 350 L630 585 L718 458 H812 L630 720 L405 413 C397 402 388 392 368 392 L385 312 Z"/>
        <polygon id="${prefix}-v-slash-base" class="lp-v-slash-base" points="805,312 928,312 840,420 718,420"/>

        <!-- Solid Purple Ribbon Clipped Strictly Inside V Body (Down left leg -> Up right leg) -->
        <g clip-path="url(#${prefix}-v-body-clip)">
          <path id="${prefix}-v-stroke" class="lp-ribbon-stroke" stroke-width="140" pathLength="1" d="M 385 310 L 630 665 L 780 445" />
        </g>

        <!-- Solid Purple Ribbon Drawing Up Into the V Cap/Slash (and staying filled!) -->
        <g clip-path="url(#${prefix}-v-slash-clip)">
          <path id="${prefix}-v-cap-stroke" class="lp-ribbon-stroke" stroke-width="160" pathLength="1" d="M 750 430 L 885 300" />
        </g>
      </svg>
    `.trim();
  }

  // Animates a stroke-dashoffset from +1 -> 0 (draws in) -> -1
  function animateRibbonPass(pathEl, durationMs, rafList) {
    if (!pathEl) return;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / durationMs);
      // Smooth cubic ease-in-out
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      // +1 (hidden before start) -> 0 (fully drawn) -> -1 (exited at end)
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

  // Animates the V-cap stroke from +1 -> 0 (draws in and STAYS filled!)
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

  // Master 2.0-second Ribbon Sequence: R -> A -> H -> U -> L -> V -> V-Cap
  function runWritingFlow(prefix, charNodes, timerList, rafList, startDelay = 0) {
    const rStroke1 = document.getElementById(`${prefix}-r-stroke-1`);
    const rStroke2 = document.getElementById(`${prefix}-r-stroke-2`);
    const vStroke = document.getElementById(`${prefix}-v-stroke`);
    const vCapStroke = document.getElementById(`${prefix}-v-cap-stroke`);
    const vSlashBase = document.getElementById(`${prefix}-v-slash-base`);

    // Reset all strokes to hidden (+1)
    [rStroke1, rStroke2, vStroke, vCapStroke].forEach((el) => {
      if (el) el.style.strokeDashoffset = '1';
    });
    if (vSlashBase) vSlashBase.classList.remove('is-ignited');

    // 1. Draw R: Top bar first (0ms -> 380ms), then stem/loop/leg (180ms -> 680ms)
    timerList.push(setTimeout(() => {
      animateRibbonPass(rStroke1, 380, rafList);
    }, startDelay));

    timerList.push(setTimeout(() => {
      animateRibbonPass(rStroke2, 500, rafList);
    }, startDelay + 180));

    // 2. Draw A -> H -> U -> L sequentially (520ms -> 1360ms)
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

    // 3. Draw V body: snakes down left leg & up right leg (1320ms -> 1870ms)
    const vStart = startDelay + 1320;
    timerList.push(setTimeout(() => {
      animateRibbonPass(vStroke, 550, rafList);
    }, vStart));

    // 4. As ribbon reaches top of V's right leg, it draws straight into the V Cap and stays! (1720ms -> 2000ms)
    const vCapStart = startDelay + 1720;
    timerList.push(setTimeout(() => {
      animateRibbonFillIn(vCapStroke, vSlashBase, 280, rafList);
    }, vCapStart));

    return startDelay + 2000;
  }

  // =========================================================================
  // 1. HEADER NAVBAR LOGO (#brand-identity)
  // =========================================================================
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

    // Run the 2.0s ribbon write on page load
    runWritingFlow('hdr', hChars, hdrTimers, hdrRafs, 400);

    // Bonus: Re-snake the ribbon on hover 
    brandIdentity.addEventListener('mouseenter', () => {
      hdrTimers.forEach((t) => clearTimeout(t));
      hdrRafs.forEach((r) => cancelAnimationFrame(r));
      hdrTimers = [];
      hdrRafs = [];
      const activeChars = brandIdentity.classList.contains('is-scrolled') ? [] : hChars;
      runWritingFlow('hdr', activeChars, hdrTimers, hdrRafs, 0);
    });

    // Scroll collapse into RV past 50px
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

  // =========================================================================
  // 2. FOOTER LOGO (.cs-foot-logo / #footer-brand-logo)
  // =========================================================================
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
      fTimers.forEach((t) => clearTimeout(t));
      fRafs.forEach((r) => cancelAnimationFrame(r));
      fTimers = [];
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

      // 1. Type out R-A-H-U-L V-E-N-U one by one in pure white
      const TYPE_STEP = 100;
      allChars.forEach((charEl, i) => {
        fTimers.push(
          setTimeout(() => {
            charEl.classList.add('is-typed');
          }, i * TYPE_STEP)
        );
      });

      // 2. Run the 2.0-second solid purple ribbon write
      const writeStart = allChars.length * TYPE_STEP + 200;
      const vCapDoneTime = runWritingFlow('ftr', fAhulChars, fTimers, fRafs, writeStart);

      // 3. Hold for 850ms after V cap fills, then smoothly collapse into compact RV
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
}

// =========================================================================
  // 3. TOP BUMP CURSIVE SIGNATURE ("Rahul Venu" — Writes Once Per Page Load)
  // =========================================================================
  const bumpFill = document.querySelector('#contact .cs-bump .cs-fill');
  if (bumpFill) {
    const sigStyle = document.createElement('style');
    sigStyle.textContent = `
      #contact .cs-bump .cs-fill {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: visible;
      }

      #bump-signature-svg {
        height: 22px;
        width: auto;
        overflow: visible;
        transform: translateY(3px); /* Visually centers inside the bump tab */
        filter: drop-shadow(0 0 6px rgba(109, 53, 232, 0.35));
      }

      .bump-sig-stroke {
        fill: none;
        stroke: #6d35e8; /* Exact V-cap purple */
        stroke-width: 3.6;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-dasharray: 1;
        stroke-dashoffset: 1;
      }

      /* Stroke 1 ( Rahul ) writes from 0.1s -> 2.25s (Duration: 2.15s) */ 
      #bump-signature-svg.is-signed .sig-rahul { 
        animation: drawBumpSig 2.15s cubic-bezier(0.35, 0, 0.25, 1) 0.1s forwards; 
      } 

      /* Stroke 2 ( Venu ) writes from 2.25s -> 3.40s (Duration: 1.15s) */ 
      #bump-signature-svg.is-signed .sig-venu { 
        animation: drawBumpSig 1.15s cubic-bezier(0.25, 0.1, 0.25, 1) 2.25s forwards; 
      }

      @keyframes drawBumpSig {
        0%   { stroke-dashoffset: 1; }
        100% { stroke-dashoffset: 0; }
      }
    `;
    document.head.appendChild(sigStyle);

    // Traced centerline vector paths matching your attached "Rahul Venu" cursive signature
    bumpFill.innerHTML = `
      <svg id="bump-signature-svg" viewBox="0 0 430 75" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Rahul Venu Signature">
        <!-- Stroke 1: "Rahul" (Vertical stem -> Top R loop -> tail -> a -> h -> u -> l) -->
        <path 
          class="bump-sig-stroke sig-rahul" 
          pathLength="1"
          d="M 24 28 L 22 60 C 21 38, 30 14, 46 15 C 60 16, 56 38, 32 48 C 22 52, 16 52, 19 50 C 26 48, 40 58, 54 60 C 64 61, 78 52, 74 44 C 69 39, 57 47, 60 57 C 63 63, 72 56, 76 47 C 76 56, 82 61, 90 59 C 101 56, 107 34, 108 16 C 107 36, 106 54, 107 60 C 109 50, 117 44, 121 53 C 123 60, 134 61, 144 56 C 150 52, 152 46, 152 54 C 152 61, 163 61, 169 53 C 169 60, 178 61, 186 55 C 193 48, 196 28, 194 14 C 193 34, 195 56, 202 59 C 207 61, 214 57, 219 51"
        />

        <!-- Stroke 2: "Venu" (Sweeping V entry -> looped V apex -> e -> n -> u) -->
        <path 
          class="bump-sig-stroke sig-venu" 
          pathLength="1"
          d="M 254 16 C 268 25, 278 44, 282 60 C 287 44, 300 26, 297 18 C 294 12, 284 26, 285 45 C 286 58, 299 60, 310 55 C 319 50, 322 42, 316 41 C 310 40, 308 52, 316 58 C 324 63, 335 56, 340 48 C 342 54, 342 60, 342 58 C 344 50, 353 44, 357 52 C 360 59, 368 60, 376 55 C 381 51, 383 46, 383 54 C 383 60, 393 60, 398 53 C 398 60, 408 60, 421 51"
        />
      </svg>
    `.trim();

    const sigSvg = document.getElementById('bump-signature-svg');
    const bumpContainer = document.querySelector('#contact .cs-bump');

    if (sigSvg && bumpContainer && 'IntersectionObserver' in window) {
      const sigObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              sigSvg.classList.add('is-signed');
              // Disconnect immediately so it only writes ONCE per refresh!
              obs.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );
      sigObserver.observe(bumpContainer);
    } else if (sigSvg) {
      sigSvg.classList.add('is-signed');
    }
  }