/* ================= BEYOND THE CODE — MOBILE & TABLET VERTICAL FEED (js/beyond-mobile.js) =================
   - Zero impact on Desktop (>= 1024px).
   - Continuous, compact one-by-one vertical flow for all 4 seasons on < 1024px (no 100dvh gaps,
     no grid-auto-rows:1fr header stretching, and full-bleed uncropped seasonal backgrounds).
*/

export function initBeyondMobile() {
  const overlay = document.getElementById('beyond-dimension-overlay');
  if (!overlay) return;

  const SEASON_ACCENTS = ['#c084fc', '#fbbf24', '#ea580c', '#7dd3fc'];

  const style = document.createElement('style');
  style.textContent = `
    .by-mob-country-caption,
    .by-mob-season-header,
    .by-mob-ch5-footer {
      display: none;
    }

    @media (max-width: 1023px) {
      #beyond-dimension-overlay {
        overflow-y: auto !important;
        overflow-x: hidden !important;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-y !important;
      }

      #beyond-dimension-overlay .by-track {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        height: auto !important;
        transform: none !important;
        cursor: default !important;
        touch-action: pan-y !important;
      }

      #beyond-dimension-overlay .by-spread {
        width: 100% !important;
        height: auto !important;
        min-height: auto !important;
        padding: 76px 16px 52px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-start !important;
        overflow: visible !important;
        visibility: visible !important;
        opacity: 1 !important;
        content-visibility: visible !important;
        contain: none !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      #beyond-dimension-overlay [data-parallax],
      #beyond-dimension-overlay [data-inner-pan],
      #beyond-dimension-overlay #by-photo-galleries,
      #beyond-dimension-overlay #by-season-galleries {
        transform: none !important;
        visibility: visible !important;
      }

      #beyond-dimension-overlay .by-spread .by-kicker,
      #beyond-dimension-overlay .by-spread h2,
      #beyond-dimension-overlay .by-spread h3,
      #beyond-dimension-overlay .by-spread .by-story-text {
        opacity: 1 !important;
        visibility: visible !important;
      }

      #beyond-dimension-overlay .by-photo-inner img.is-loaded,
      #beyond-dimension-overlay .by-quad-cell img.is-loaded,
      #beyond-dimension-overlay .by-trio-slide.is-active-slide.is-loaded {
        opacity: 1 !important;
      }

      #beyond-dimension-overlay .by-photo-gallery-pane.is-active .s-card-up,
      #beyond-dimension-overlay .by-photo-gallery-pane.is-active .s-card-down,
      #beyond-dimension-overlay .by-photo-gallery-pane.is-active .s-card-zoom,
      #beyond-dimension-overlay .by-season-gallery-pane .anim-spring,
      #beyond-dimension-overlay .by-season-gallery-pane .anim-summer,
      #beyond-dimension-overlay .by-season-gallery-pane .anim-autumn,
      #beyond-dimension-overlay .by-season-gallery-pane .anim-winter {
        opacity: 1 !important;
        clip-path: none !important;
        transform: none !important;
      }

      /* Full-bleed uncropped backgrounds across all chapters on mobile */
      #beyond-dimension-overlay .ch1-bg-himalayas,
      #beyond-dimension-overlay .ch2-bg-beach,
      #beyond-dimension-overlay .ch3-bg-img,
      #beyond-dimension-overlay .ch4-bg-img,
      #beyond-dimension-overlay .ch5-season-bg-pane.is-active .ch5-bg-img {
        opacity: 0.72 !important;
        transform: scale(1) !important;
        -webkit-mask-image: none !important;
        mask-image: none !important;
      }

      #beyond-dimension-overlay .ch1-bg-helmet,
      #beyond-dimension-overlay .ch2-bg-overlay,
      #beyond-dimension-overlay .ch4-overlay-tl,
      #beyond-dimension-overlay .ch4-overlay-br {
        opacity: 0.25 !important;
        transform: scale(1) !important;
      }

      #beyond-dimension-overlay .by-hud-top {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        padding: 14px 18px !important;
        background: linear-gradient(to bottom, rgba(11, 11, 12, 0.94) 45%, transparent 100%);
        z-index: 99995 !important;
      }

      #beyond-dimension-overlay .by-progress-track {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        z-index: 99995 !important;
      }

      /* ================= 2. CH 01 & CH 02: STORY FIRST + 2-COLUMN BENTO GRID ================= */
      #beyond-dimension-overlay .by-spread:nth-child(1) > .grid > div:nth-child(2),
      #beyond-dimension-overlay .by-spread:nth-child(2) > .grid > div:nth-child(2) {
        order: -1 !important;
        min-height: auto !important;
        margin-bottom: 16px !important;
      }

      #beyond-dimension-overlay .by-spread:nth-child(1) .by-story-text,
      #beyond-dimension-overlay .by-spread:nth-child(2) .by-story-text {
        width: 100% !important;
        max-width: 100% !important;
        margin-bottom: 0 !important;
        transform: none !important;
      }

      #beyond-dimension-overlay .ch1-title-pop {
        white-space: normal !important;
        font-size: clamp(1.6rem, 5.8vw, 2.2rem) !important;
        margin: 10px 0 !important;
      }

      #beyond-dimension-overlay .by-spread:nth-child(1) > .grid > div:nth-child(1),
      #beyond-dimension-overlay .by-spread:nth-child(1) > .grid > div:nth-child(3),
      #beyond-dimension-overlay .by-spread:nth-child(2) > .grid > div:nth-child(1),
      #beyond-dimension-overlay .by-spread:nth-child(2) > .grid > div:nth-child(3) {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 12px !important;
        align-items: stretch !important;
      }

      #beyond-dimension-overlay .by-spread:nth-child(1) > .grid > div > div,
      #beyond-dimension-overlay .by-spread:nth-child(2) > .grid > div > div {
        grid-column: span 1 !important;
        margin: 0 !important;
        max-width: 100% !important;
      }

      #beyond-dimension-overlay .by-spread:nth-child(1) > .grid > div:nth-child(1) > div:nth-child(1),
      #beyond-dimension-overlay .by-spread:nth-child(1) > .grid > div:nth-child(3) > div:nth-child(3),
      #beyond-dimension-overlay .by-spread:nth-child(2) > .grid > div:nth-child(1) > div:nth-child(1),
      #beyond-dimension-overlay .by-spread:nth-child(2) > .grid > div:nth-child(3) > div:nth-child(3) {
        grid-column: span 2 !important;
      }

      #beyond-dimension-overlay .by-photo-frame {
        max-width: 100% !important;
      }

      #beyond-dimension-overlay .by-spread:nth-child(2) > .grid > div:nth-child(2) > div:nth-child(2) {
        display: grid !important;
        grid-template-columns: 1.4fr 1fr !important;
        gap: 12px !important;
        width: 100% !important;
        margin: 16px 0 !important;
      }
      #beyond-dimension-overlay .by-spread:nth-child(2) > .grid > div:nth-child(2) > div:nth-child(2) > div {
        display: block !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }

      /* ================= 3. CH 03: LEICA SLOT & CLICKABLE PILLS ================= */
      #by-photo-tabs {
        position: relative !important;
        z-index: 80 !important;
        pointer-events: auto !important;
      }

      #by-photo-tabs .by-photo-tab {
        position: relative !important;
        z-index: 85 !important;
        pointer-events: auto !important;
        touch-action: manipulation;
      }

      .by-photo-copy-pane:not(.is-active) {
        pointer-events: none !important;
        display: none !important;
      }

      #by-photo-spread .ch3-leica-slot {
        height: 195px !important;
        width: 100% !important;
        margin: 4px 0 8px 0 !important;
        pointer-events: none !important;
        position: relative !important;
      }

      #by-photo-spread #by-photo-galleries {
        padding-left: 0 !important;
        min-height: auto !important;
        margin-top: 16px !important;
      }

      #by-photo-spread .by-photo-gallery-pane {
        display: none !important;
      }
      #by-photo-spread .by-photo-gallery-pane.is-active {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 12px !important;
      }
      #by-photo-spread .by-photo-gallery-pane > div {
        grid-column: span 1 !important;
        margin: 0 !important;
        width: 100% !important;
      }
      #by-photo-spread .by-photo-gallery-pane[data-photo-gallery="0"].is-active {
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
      }
      #by-photo-spread .by-photo-gallery-pane[data-photo-gallery="0"] > div {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 12px !important;
        width: 100% !important;
      }

      /* ================= 4. CH 04: MAKER & MECHANIC 2x2 GRIDS ================= */
      #beyond-dimension-overlay .by-spread:nth-child(4) .lg\\:col-span-9 {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 12px !important;
      }
      #beyond-dimension-overlay .by-spread:nth-child(4) .lg\\:col-span-9 > div {
        margin: 0 !important;
        width: 100% !important;
      }

      /* ================= 5. CH 05: COMPACT CONTINUOUS ONE-BY-ONE SEASON FLOW ================= */
      #by-season-spread {
        position: relative !important;
        padding: 52px 16px 40px !important;
        border-bottom: none !important;
        overflow: hidden !important;
      }

      /* Keep the Master Background Stage 100% Full-Bleed Edge-to-Edge (Zero Crop!) */
      #by-season-spread > .ch1-bg-stage {
        display: block !important;
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 0 !important;
      }

      #by-season-spread .ch5-season-bg-pane,
      #by-season-spread .ch5-season-bg-pane .ch1-parallax-layer {
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        transform: none !important;
      }

      #by-season-spread .ch5-bg-img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        transform: none !important;
        -webkit-mask-image: none !important;
        mask-image: none !important;
      }

      /* Hide Desktop Season Tabs, Left Copy Column, and Extra Bottom Bar */
      #by-season-spread #by-season-tabs,
      #by-season-spread .lg\\:col-span-4,
      #by-season-spread > div.absolute,
      #by-season-spread #by-season-step-hint,
      #by-photo-spread #by-photo-step-hint {
        display: none !important;
      }

      /* Master Header at Top of Chapter 05 */
      #by-season-spread > .max-w-\\[1400px\\] {
        gap: 12px !important;
        margin: 0 !important;
        width: 100% !important;
      }

      #by-season-spread > .max-w-\\[1400px\\] > .flex-col.items-center {
        padding: 0 !important;
        margin: 0 0 8px 0 !important;
      }

      /* Continuous Vertical Flow of All 4 Seasons (Tight 28px gap between seasons, no 100dvh!) */
      #by-season-spread #by-season-galleries {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        min-height: auto !important;
        padding: 0 !important;
        margin: 0 !important;
        gap: 28px !important;
      }

      /* CRITICAL FIX: grid-auto-rows: auto (NOT 1fr!) so the Season Title Row NEVER stretches to 300px tall! */
      #by-season-spread .by-season-gallery-pane {
        position: relative !important;
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        grid-auto-rows: auto !important;
        align-items: stretch !important;
        gap: 12px !important;
        width: 100% !important;
        min-height: auto !important;
        padding: 0 0 24px 0 !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }

      #by-season-spread .by-season-gallery-pane:last-child {
        border-bottom: none !important;
        padding-bottom: 0 !important;
      }

      /* Per-Season Header (Natural compact height right above the 4 cards — ZERO gap!) */
      .by-mob-season-header {
        grid-column: span 2 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        text-align: left !important;
        margin: 0 0 2px 0 !important;
        padding: 0 !important;
        height: auto !important;
        position: relative !important;
        z-index: 10 !important;
      }

      /* Flatten ONLY intermediate desktop wrappers (never flatten .by-mob-country-caption) */
      #by-season-spread .by-season-gallery-pane > div:not(.by-mob-country-unit):not(.by-mob-season-header):not(.by-mob-ch5-footer),
      #by-season-spread .by-season-gallery-pane > div > div:not(.by-mob-country-unit):not(.by-trio-frame):not(.by-mob-country-caption) {
        display: contents !important;
      }

      /* Equal-Height Country Card in the 2x2 Grid */
      #by-season-spread .by-mob-country-unit {
        grid-column: span 1 !important;
        position: relative !important;
        z-index: 10 !important;
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        max-width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border-radius: 12px !important;
        background: rgba(18, 18, 20, 0.92) !important;
        border: 1px solid color-mix(in srgb, var(--mob-s-accent, #ffffff) 28%, rgba(255, 255, 255, 0.08)) !important;
        box-shadow: 0 10px 25px -8px rgba(0, 0, 0, 0.65) !important;
        overflow: hidden !important;
      }

      /* Identical 16:10 photo frame across all 16 countries */
      #by-season-spread .by-mob-country-unit .by-trio-frame {
        width: 100% !important;
        max-width: 100% !important;
        aspect-ratio: 16 / 10 !important;
        height: auto !important;
        flex-shrink: 0 !important;
        border: none !important;
        border-radius: 0 !important;
        margin: 0 !important;
      }

      #by-season-spread .by-mob-country-unit .by-loc-badge {
        bottom: 6px !important;
        left: 8px !important;
        font-size: 9.5px !important;
      }

      #by-season-spread .by-mob-country-unit .by-trio-dots {
        top: 6px !important;
        right: 8px !important;
      }

      /* Full Untruncated Country Description Box */
      .by-mob-country-caption {
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-start !important;
        padding: 10px 11px 12px !important;
        background: #121214 !important;
        border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
        text-align: left !important;
        flex: 1 1 auto !important;
        height: auto !important;
        overflow: visible !important;
      }

      .by-mob-country-caption .by-country-tag {
        color: var(--mob-s-accent, #e2e8f0) !important;
        font-size: 8.5px !important;
        letter-spacing: 0.08em !important;
        margin-bottom: 4px !important;
        line-height: 1.3 !important;
        white-space: normal !important;
      }

      .by-mob-country-caption .by-country-desc {
        font-size: 10.5px !important;
        line-height: 1.42 !important;
        color: rgba(228, 228, 231, 0.9) !important;
        display: block !important;
        overflow: visible !important;
      }

      /* Finale Footer at the Bottom of Season 04 Winter */
      .by-mob-ch5-footer {
        grid-column: span 2 !important;
        position: relative !important;
        z-index: 90 !important;
        pointer-events: auto !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        margin-top: 14px !important;
        padding-top: 18px !important;
        padding-bottom: 8px !important;
        border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
        gap: 14px !important;
      }

      .by-mob-ch5-footer-btns,
      .by-mob-ch5-footer-btns button,
      .by-mob-ch5-footer-btns a {
        position: relative !important;
        z-index: 95 !important;
        pointer-events: auto !important;
        touch-action: manipulation;
      }

      .by-mob-ch5-footer-btns {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 12px !important;
        width: 100% !important;
      }
    }
  `;
  document.head.appendChild(style);

  // =========================================================================
  // 2. POSITION 3D LEICA CANVAS OVER #ch3-leica-anchor ON MOBILE
  // =========================================================================
  function syncMobileLeicaCanvasPos() {
    const canvas = document.getElementById('ch3-leica-canvas');
    const anchor = document.getElementById('ch3-leica-anchor');
    const spread3 = document.getElementById('by-photo-spread');
    if (!canvas || !anchor || !spread3) return;

    if (window.innerWidth < 1024) {
      const spreadRect = spread3.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      if (spreadRect.height > 0 && anchorRect.height > 0) {
        const anchorCenterY = anchorRect.top - spreadRect.top + anchorRect.height / 2;
        const vh = window.innerHeight;
        canvas.style.setProperty('top', `${(anchorCenterY - vh / 2).toFixed(0)}px`, 'important');
        canvas.style.setProperty('height', `${vh}px`, 'important');
        canvas.style.setProperty('width', '100%', 'important');
      }
    } else {
      canvas.style.removeProperty('top');
      canvas.style.removeProperty('height');
      canvas.style.removeProperty('width');
    }
  }

  function hydrateSpreadImages(spreadEl) {
    if (!spreadEl || spreadEl.dataset.mobHydrated) return;
    spreadEl.dataset.mobHydrated = 'true';
    spreadEl.classList.add('is-current');
    spreadEl.style.visibility = 'visible';
    spreadEl.style.opacity = '1';

    spreadEl.querySelectorAll('img').forEach((img) => {
      img.loading = 'eager';
      const lazySrc = img.dataset.src || img.dataset.lazy || img.getAttribute('data-src');
      if (lazySrc && !img.getAttribute('src')) {
        img.src = lazySrc;
        img.removeAttribute('data-src');
      }
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('is-loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
      }
    });
  }

  // =========================================================================
  // 3. BUILD COMPACT CONTINUOUS MOBILE SEASON SECTIONS (SPRING -> SUMMER -> AUTUMN -> WINTER)
  // =========================================================================
  const seasonSpread = document.getElementById('by-season-spread');
  if (seasonSpread && !seasonSpread.dataset.mobPaired) {
    seasonSpread.dataset.mobPaired = 'true';

    for (let s = 0; s < 4; s++) {
      const copyPane = seasonSpread.querySelector(`.by-season-copy-pane[data-season-copy="${s}"]`);
      const galleryPane = seasonSpread.querySelector(`.by-season-gallery-pane[data-season-gallery="${s}"]`);
      if (!copyPane || !galleryPane) continue;

      galleryPane.style.setProperty('--mob-s-accent', SEASON_ACCENTS[s]);

      // A. Prepend each season's Kicker + Title right above its 2x2 grid
      const kickerEl = copyPane.querySelector('.by-kicker');
      const titleEl = copyPane.querySelector('h2, h3');
      if (kickerEl && titleEl && !galleryPane.querySelector('.by-mob-season-header')) {
        const header = document.createElement('div');
        header.className = 'by-mob-season-header';
        header.innerHTML = `
          ${kickerEl.outerHTML}
          <h3 class="font-magnify-thin text-2xl sm:text-3xl tracking-[0.1em] uppercase text-white leading-tight">${titleEl.textContent.trim()}</h3>
        `;
        galleryPane.prepend(header);
      }

      // B. Pair each of the 4 country 16:10 photo reels with its description caption directly below it
      const countryItems = Array.from(copyPane.querySelectorAll('.by-country-item'));
      const trioFrames = Array.from(galleryPane.querySelectorAll('.by-trio-frame'));

      trioFrames.forEach((frame, idx) => {
        const cardWrapper = frame.parentElement;
        if (!cardWrapper) return;
        cardWrapper.classList.add('by-mob-country-unit');

        const locBadgeText = (frame.querySelector('.by-loc-badge span')?.textContent || '').toLowerCase();
        const firstWord = locBadgeText.split(',')[0].split('&')[0].trim();

        let matchedItem = countryItems.find((item) => {
          const tagCountry = (item.querySelector('.by-country-tag')?.textContent || '')
            .split('•')[0]
            .toLowerCase()
            .trim();
          return firstWord && (tagCountry.includes(firstWord) || firstWord.includes(tagCountry));
        });

        if (!matchedItem) matchedItem = countryItems[idx];

        if (matchedItem && !cardWrapper.querySelector('.by-mob-country-caption')) {
          const caption = document.createElement('div');
          caption.className = 'by-mob-country-caption';
          caption.innerHTML = matchedItem.innerHTML;
          cardWrapper.appendChild(caption);
        }
      });
    }

    // C. Append Finale Footer (Signature + Rewind Reel + Proceed to Contact) at the bottom of Season 04 (Winter)!
    const winterCopy = seasonSpread.querySelector('.by-season-copy-pane[data-season-copy="3"]');
    const winterGallery = seasonSpread.querySelector('.by-season-gallery-pane[data-season-gallery="3"]');
    const sigSvg = winterCopy?.querySelector('svg');

    if (winterGallery && !winterGallery.querySelector('.by-mob-ch5-footer')) {
      const mobFooter = document.createElement('div');
      mobFooter.className = 'by-mob-ch5-footer';
      mobFooter.innerHTML = `
        ${sigSvg ? `<div class="w-full flex justify-center select-none pointer-events-none">${sigSvg.outerHTML}</div>` : ''}
        <div class="by-mob-ch5-footer-btns">
          <button type="button" id="by-mob-rewind-btn" class="by-hud-btn">&larr; Rewind Reel</button>
          <a href="#contact" id="by-mob-contact-jump" class="by-enter-btn !py-2.5 !px-5 !text-[10px]">
            <span>Proceed to Contact &darr;</span>
          </a>
        </div>
      `;
      winterGallery.appendChild(mobFooter);

      document.getElementById('by-mob-rewind-btn')?.addEventListener('click', () => {
        overlay.scrollTo({ top: 0, behavior: 'smooth' });
        document.getElementById('by-rewind-btn')?.click();
      });

      document.getElementById('by-mob-contact-jump')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('by-close-btn')?.click();
        setTimeout(() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }, 240);
      });
    }
  }

  // =========================================================================
  // 4. INDUSTRY-STANDARD CENTER-LINE LOCK + SCROLL-IDLE DEBOUNCE (SINGLE ACTIVE SEASON)
  //    - rootMargin: '-45% 0px -45% 0px' creates a 10% dead-center laser band on screen,
  //      guaranteeing ONLY ONE season can ever be detected as dominant at a time!
  //    - Waits 180ms for scroll momentum to settle before switching BG & starting 3-img reel.
  // =========================================================================
  if ('IntersectionObserver' in window && seasonSpread) {
    const seasonPanes = Array.from(seasonSpread.querySelectorAll('.by-season-gallery-pane'));
    const seasonTabs = Array.from(seasonSpread.querySelectorAll('.by-season-tab'));
    let activeMobSeason = 0;
    let pendingSeasonIdx = 0;
    let seasonSwitchTimer = null;

    const commitSeasonSwitch = (sIdx) => {
      if (sIdx === activeMobSeason) return;
      activeMobSeason = sIdx;
      seasonTabs[sIdx]?.click();
    };

    const seasonScrollObserver = new IntersectionObserver(
      (entries) => {
        if (window.innerWidth >= 1024) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pendingSeasonIdx = parseInt(entry.target.dataset.seasonGallery || '0', 10);
            clearTimeout(seasonSwitchTimer);
            // Wait 180ms for scroll to settle so BG cross-fade & slide timers NEVER fire mid-scroll!
            seasonSwitchTimer = setTimeout(() => {
              commitSeasonSwitch(pendingSeasonIdx);
            }, 180);
          }
        });
      },
      {
        root: overlay,
        // Narrow 10% band at the exact vertical center of the screen (only 1 season can ever intersect!)
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0
      }
    );

    seasonPanes.forEach((pane) => seasonScrollObserver.observe(pane));

    // Also reset the debounce timer while actively scrolling so rapid flick-scrolls cost 0 CPU!
    overlay.addEventListener(
      'scroll',
      () => {
        if (window.innerWidth >= 1024 || pendingSeasonIdx === activeMobSeason) return;
        clearTimeout(seasonSwitchTimer);
        seasonSwitchTimer = setTimeout(() => {
          commitSeasonSwitch(pendingSeasonIdx);
        }, 180);
      },
      { passive: true }
    );
  }

  // =========================================================================
  // 5. SECTION 04 / 05 PREDICTIVE PRE-WARMER (MATCHES DESKTOP ARCHITECTURE 1:1)
  // =========================================================================
  const spreads = Array.from(overlay.querySelectorAll('.by-spread'));
  let prewarmStarted = false;

  function prewarmAllMobileChapters() {
    if (prewarmStarted || window.innerWidth >= 1024) return;
    prewarmStarted = true;

    spreads.forEach((spreadEl, idx) => {
      setTimeout(() => {
        hydrateSpreadImages(spreadEl);
      }, idx * 180);
    });
  }

  const triggerTarget = document.getElementById('certifications') || document.getElementById('beyond');
  if (triggerTarget && 'IntersectionObserver' in window) {
    const prewarmObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && window.innerWidth < 1024) {
            prewarmAllMobileChapters();
            obs.disconnect();
          }
        });
      },
      { rootMargin: '350px 0px' }
    );
    prewarmObserver.observe(triggerTarget);
  }

  if ('IntersectionObserver' in window) {
    const ch3Spread = document.getElementById('by-photo-spread');
    if (ch3Spread) {
      new IntersectionObserver(
        (entries) => {
          if (window.innerWidth >= 1024) return;
          entries.forEach((entry) => {
            overlay.dataset.ch3Visible = entry.isIntersecting ? '1' : '0';
            if (entry.isIntersecting) syncMobileLeicaCanvasPos();
          });
        },
        { root: overlay, rootMargin: '300px 0px' }
      ).observe(ch3Spread);
    }
  }

  document.getElementById('by-open-trigger')?.addEventListener('click', () => {
    if (window.innerWidth < 1024) {
      prewarmAllMobileChapters();
      setTimeout(syncMobileLeicaCanvasPos, 150);
    }
  });

  const track = document.getElementById('by-track');
  track?.addEventListener(
    'pointerdown',
    (e) => {
      if (window.innerWidth < 1024 && !e.target.closest('button, a')) {
        e.stopImmediatePropagation();
      }
    },
    { capture: true, passive: true }
  );

  const progEl = document.getElementById('by-progress-fill');
  overlay.addEventListener(
    'scroll',
    () => {
      if (window.innerWidth >= 1024) return;
      const maxScroll = Math.max(1, overlay.scrollHeight - overlay.clientHeight);
      const pct = Math.min(100, Math.max(10, (overlay.scrollTop / maxScroll) * 100));
      if (progEl) progEl.style.width = `${pct.toFixed(1)}%`;
    },
    { passive: true }
  );

  overlay.addEventListener(
    'wheel',
    (e) => {
      if (window.innerWidth < 1024) {
        e.stopImmediatePropagation();
      }
    },
    { capture: true, passive: true }
  );
}