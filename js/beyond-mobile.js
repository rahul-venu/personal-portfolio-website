/* ================= BEYOND THE CODE — MOBILE & TABLET VERTICAL FEED (js/beyond-mobile.js) =================
   - Zero main-thread blocking on open (hydrates chapters progressively via IntersectionObserver).
   - Unblocks native vertical touch/wheel scrolling (stops desktop drag & wheel capture on < 1024px).
*/

export function initBeyondMobile() {
  const overlay = document.getElementById('beyond-dimension-overlay');
  if (!overlay) return;

  const style = document.createElement('style');
  style.textContent = `
    .by-mob-country-caption,
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
        padding: 76px 18px 52px !important;
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
      #beyond-dimension-overlay .by-season-gallery-pane.is-active .anim-spring,
      #beyond-dimension-overlay .by-season-gallery-pane.is-active .anim-summer,
      #beyond-dimension-overlay .by-season-gallery-pane.is-active .anim-autumn,
      #beyond-dimension-overlay .by-season-gallery-pane.is-active .anim-winter {
        opacity: 1 !important;
        clip-path: none !important;
        transform: none !important;
      }

      #beyond-dimension-overlay .ch1-bg-himalayas,
      #beyond-dimension-overlay .ch2-bg-beach,
      #beyond-dimension-overlay .ch3-bg-img,
      #beyond-dimension-overlay .ch4-bg-img,
      #beyond-dimension-overlay .ch5-season-bg-pane.is-active .ch5-bg-img {
        opacity: 0.75 !important;
        transform: scale(1) !important;
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
      #by-photo-tabs,
      #by-season-tabs {
        position: relative !important;
        z-index: 80 !important;
        pointer-events: auto !important;
      }

      #by-photo-tabs .by-photo-tab,
      #by-season-tabs .by-season-tab {
        position: relative !important;
        z-index: 85 !important;
        pointer-events: auto !important;
        touch-action: manipulation;
      }

      .by-photo-copy-pane:not(.is-active),
      .by-season-copy-pane:not(.is-active) {
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

      /* ================= 5. CH 05: UNIFIED PAIRED COUNTRY CARDS ================= */
      #by-season-spread .by-country-list,
      #by-season-spread .by-season-copy-pane[data-season-copy="3"] > div:not(.by-country-list) {
        display: none !important;
      }

      #by-season-spread > div.absolute.bottom-6,
      #by-season-spread > div.absolute.bottom-8 {
        display: none !important;
      }

      #by-season-spread #by-season-tabs {
        flex-wrap: wrap !important;
      }

      #by-season-spread #by-season-galleries {
        padding-left: 0 !important;
        min-height: auto !important;
      }

      #by-season-spread .by-season-gallery-pane {
        display: none !important;
      }

      #by-season-spread .by-season-gallery-pane.is-active {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 16px !important;
      }

      @media (min-width: 640px) and (max-width: 1023px) {
        #by-season-spread .by-season-gallery-pane.is-active {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
      }

      #by-season-spread .by-season-gallery-pane > div:not(.by-mob-country-unit) {
        display: contents !important;
      }

      #by-season-spread .by-mob-country-unit {
        grid-column: span 1 !important;
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        border-radius: 14px !important;
        background: #121214 !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        overflow: hidden !important;
      }

      #by-season-spread .by-mob-country-unit .by-trio-frame {
        border: none !important;
        border-radius: 0 !important;
      }

      .by-mob-country-caption {
        display: block !important;
        padding: 12px 14px 14px !important;
        background: #121214 !important;
        border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
        text-align: left !important;
      }

      .by-mob-ch5-footer {
        position: relative !important;
        z-index: 90 !important;
        pointer-events: auto !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        margin-top: 32px !important;
        padding-top: 20px !important;
        padding-bottom: 24px !important;
        border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
        gap: 18px !important;
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

      #by-season-spread #by-season-step-hint,
      #by-photo-spread #by-photo-step-hint {
        display: none !important;
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

  // Hydrate a single spread's images cleanly without blocking the main thread
  function hydrateSpreadImages(spreadEl) {
    if (!spreadEl || spreadEl.dataset.mobHydrated) return;
    spreadEl.dataset.mobHydrated = 'true';
    spreadEl.classList.add('is-current');
    spreadEl.style.visibility = 'visible';
    spreadEl.style.opacity = '1';

    spreadEl.querySelectorAll('img').forEach((img) => {
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
  // 3. ONE-TIME MOBILE DOM SETUP
  // =========================================================================
  const seasonSpread = document.getElementById('by-season-spread');
  if (seasonSpread && !seasonSpread.dataset.mobPaired) {
    seasonSpread.dataset.mobPaired = 'true';

    for (let s = 0; s < 4; s++) {
      const copyPane = seasonSpread.querySelector(`.by-season-copy-pane[data-season-copy="${s}"]`);
      const galleryPane = seasonSpread.querySelector(`.by-season-gallery-pane[data-season-gallery="${s}"]`);
      if (!copyPane || !galleryPane) continue;

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

    const winterCopy = seasonSpread.querySelector('.by-season-copy-pane[data-season-copy="3"]');
    const sigSvg = winterCopy?.querySelector('svg');
    if (!seasonSpread.querySelector('.by-mob-ch5-footer')) {
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
      seasonSpread.appendChild(mobFooter);

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

  // Progressive per-chapter hydration via IntersectionObserver (Never blocks main thread!)
  const spreads = Array.from(overlay.querySelectorAll('.by-spread'));
  if ('IntersectionObserver' in window) {
    const spreadObserver = new IntersectionObserver(
      (entries) => {
        if (window.innerWidth >= 1024) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            hydrateSpreadImages(entry.target);
            if (entry.target.id === 'by-photo-spread') {
              overlay.dataset.ch3Visible = '1';
              syncMobileLeicaCanvasPos();
            }
          } else if (entry.target.id === 'by-photo-spread') {
            overlay.dataset.ch3Visible = '0';
          }
        });
      },
      { root: overlay, rootMargin: '600px 0px' }
    );
    spreads.forEach((s) => spreadObserver.observe(s));
  }

  // Hydrate only Spread 01 & 02 on open so the opening animation is 100% instant & never freezes!
  document.getElementById('by-open-trigger')?.addEventListener('click', () => {
    if (window.innerWidth < 1024) {
      if (spreads[0]) hydrateSpreadImages(spreads[0]);
      if (spreads[1]) hydrateSpreadImages(spreads[1]);
      setTimeout(syncMobileLeicaCanvasPos, 150);
    }
  });

  // Stop desktop pointerdown drag-listener from hijacking vertical touch scroll on < 1024px
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

  // Mobile Scroll Progress Bar
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