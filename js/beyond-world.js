/* ================= 05. BEYOND THE CODE — FULLSCREEN 5-CHAPTER PARALLAX WORLD (js/beyond-world.js) =================
   - Stage A: Full-bleed Neon Planetary Horizon SVG with Argon CTA button.
   - Stage B: 500vw 5-Chapter Horizontal Parallax Lookbook with 3D Leica M3 & 4-Season Dream Atlas.
   - Predictive 2-Phase Pre-Warmer: Decodes Spreads 01 & 02 + compiles Leica shaders before portal click,
     then queues Spreads 03–05 via idle callbacks for zero-stutter 120fps navigation.
   - Dynamic GPU Layer Culling: Promotes will-change only on current/neighbor spreads and hides distant spreads.
*/

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { assetUrl, SIGNATURE_PATHS, BADGE_ICONS, rafThrottle } from './config.js';

export function initBeyondWorld() {
  const portalMount = document.getElementById('beyond-portal-mount');
  const overlay = document.getElementById('beyond-dimension-overlay');
  if (!portalMount || !overlay) return;

  // Move overlay directly to document.body so parent containers never trap it
  document.body.appendChild(overlay);
  overlay.classList.add('is-astral');

  const style = document.createElement('style');
  style.textContent = `
    /* Hide Navbar, Chatbot, Avatar & Page Scrollbar when in the Other Dimension */
    body.beyond-lifting header,
    body.beyond-lifting #chatbot-toggle,
    body.beyond-lifting #chatbot-window,
    body.beyond-lifting #avatar-peek-wrapper,
    body.beyond-lifting #page-scrollthumb,
    body.beyond-world-open header,
    body.beyond-world-open #chatbot-toggle,
    body.beyond-world-open #chatbot-window,
    body.beyond-world-open #avatar-peek-wrapper,
    body.beyond-world-open #page-scrollthumb {
      opacity: 0 !important;
      pointer-events: none !important;
      visibility: hidden !important;
      transition: opacity 0.3s ease, visibility 0.3s ease !important;
    }

    /* ================= STAGE A: FULL-SECTION NEON PLANETARY HORIZON ================= */
    #beyond-section-stage {
      background: #020409 !important;
    }

    .by-horizon-svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 220%;
      pointer-events: none;
      transform: translate3d(0, 0, 0);
      transition: transform 0.95s cubic-bezier(0.22, 1, 0.36, 1);
      backface-visibility: hidden;
    }

    #beyond-section-stage .relative.z-10 {
      transform: translate3d(0, 0, 0);
      transition:
        transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.45s ease;
    }

    body.beyond-lifting .by-horizon-svg,
    body.beyond-world-open .by-horizon-svg {
      transform: translate3d(0, -52%, 0) !important;
    }

    body.beyond-lifting #beyond-section-stage .relative.z-10,
    body.beyond-world-open #beyond-section-stage .relative.z-10 {
      transform: translate3d(0, -64px, 0);
      opacity: 0;
      pointer-events: none;
    }

    /* ================= ENTER THE OTHER SIDE BUTTON (GEMINI ARGON BORDER ON HOVER) ================= */
    .by-enter-btn {
      position: relative;
      isolation: isolate;
      overflow: visible !important;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 13px 26px;
      border-radius: 9999px;
      background: #080a10;
      color: #f8fafc;
      border: 1px solid rgba(255, 255, 255, 0.14);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.85);
      transition:
        transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
        border-color 0.3s ease;
    }

    .by-enter-btn > span {
      position: relative;
      z-index: 2;
    }

    .by-enter-btn::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      background:
        linear-gradient(#080a10, #080a10) padding-box,
        conic-gradient(
          from var(--argon-angle),
          rgba(255, 255, 255, 0.08) 0%,
          rgba(255, 255, 255, 0.08) 28%,
          #4285f4 44%,
          #34a853 60%,
          #fbbc05 76%,
          #ea4335 90%,
          rgba(255, 255, 255, 0.08) 100%
        ) border-box;
      border: 1px solid transparent;
      opacity: 0;
      animation: argonSpin 4s linear infinite;
      transition: opacity 0.35s ease;
      pointer-events: none;
      z-index: -1;
    }

    .by-enter-btn::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: inherit;
      background: conic-gradient(
        from var(--argon-angle),
        transparent 0%,
        transparent 26%,
        #4285f4 44%,
        #34a853 60%,
        #fbbc05 76%,
        #ea4335 90%,
        transparent 100%
      );
      filter: blur(16px);
      opacity: 0;
      animation: argonSpin 4s linear infinite;
      transition: opacity 0.35s ease;
      pointer-events: none;
      z-index: -2;
    }

    .by-enter-btn:hover {
      border-color: transparent;
      transform: translateX(4px);
    }

    .by-enter-btn:hover::before {
      opacity: 0.95;
    }

    .by-enter-btn:hover::after {
      opacity: 0.48;
    }

    /* ================= STAGE B: ZERO-CLIPPING FULLSCREEN DIMENSION ================= */
    #beyond-dimension-overlay {
      position: fixed;
      inset: 0 !important;
      width: 100vw;
      height: 100dvh;
      z-index: 99990;
      background: #0b0b0c;
      color: #f8fafc;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
      transition:
        opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
        visibility 0.65s;
      overflow: hidden;
      user-select: none;
    }

    #beyond-dimension-overlay.is-open {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }

    .by-track {
      display: flex;
      height: 100%;
      width: 500vw;
      cursor: grab;
      backface-visibility: hidden;
      will-change: transform;
    }

    .by-track.is-dragging {
      cursor: grabbing;
    }

    .by-spread {
      position: relative;
      width: 100vw;
      height: 100%;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 64px clamp(24px, 6vw, 96px) 72px;
      overflow: hidden;
      contain: layout paint;
    }

    /* Dynamic GPU Layer Culling: Only promote active & adjacent spreads */
    .by-spread.is-culled {
      visibility: hidden;
      pointer-events: none;
    }

    #beyond-dimension-overlay.is-open .by-spread.is-current [data-parallax],
    #beyond-dimension-overlay.is-open .by-spread.is-neighbor [data-parallax],
    #beyond-dimension-overlay.is-open .by-spread.is-current [data-inner-pan],
    #beyond-dimension-overlay.is-open .by-spread.is-neighbor [data-inner-pan] {
      will-change: transform;
    }

    /* ================= CHAPTER 01 EXCLUSIVE: 2-LAYER HIMALAYAS + HELMET BG ================= */
    .ch1-bg-stage {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
    }

    .ch1-parallax-layer {
      position: absolute;
      inset: -6%;
      width: 112%;
      height: 112%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ch1-bg-himalayas {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      opacity: 0;
      transform: translate3d(45px, -38px, 0) scale(1.08);
      transition:
        transform 1.25s cubic-bezier(0.16, 1, 0.3, 1),
        opacity 0.95s ease;
      -webkit-mask-image: radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0.55) 20%, rgba(0,0,0,0.25) 65%, transparent 100%);
      mask-image: radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0.55) 20%, rgba(0,0,0,0.25) 65%, transparent 100%);
    }

    .ch1-bg-helmet {
      width: clamp(280px, 34vw, 480px);
      height: clamp(280px, 34vw, 480px);
      object-fit: contain;
      object-position: center center;
      opacity: 0;
      transform: translate3d(0, 78px, 0) scale(0.92);
      transition:
        transform 1.35s cubic-bezier(0.16, 1, 0.3, 1) 0.14s,
        opacity 0.95s ease 0.14s;
      filter: drop-shadow(0 25px 45px rgba(0, 0, 0, 0.85));
    }

    #beyond-dimension-overlay.is-open .by-spread.is-current .ch1-bg-himalayas {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }

    #beyond-dimension-overlay.is-open .by-spread.is-current .ch1-bg-helmet {
      opacity: 0.45;
      filter: brightness(0.78) contrast(1.08);
      transform: translate3d(0, 0, 0) scale(1);
    }

    .ch1-title-pop {
      font-family: var(--font-magnify), sans-serif !important;
      font-weight: 500 !important;
      color: #ffffff;
      -webkit-text-stroke: 0.4px #ffffff;
      background: none !important;
      text-shadow: none !important;
      padding: 0;
    }

    /* ================= CHAPTER 02 EXCLUSIVE: 2-LAYER BEACH + FOREGROUND OVERLAY BG ================= */
    .ch2-bg-beach {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      opacity: 0;
      transform: translate3d(45px, -30px, 0) scale(1.08);
      transition:
        transform 1.25s cubic-bezier(0.16, 1, 0.3, 1),
        opacity 0.95s ease;
      -webkit-mask-image: radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.22) 65%, transparent 100%);
      mask-image: radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.22) 65%, transparent 100%);
    }

    .ch2-bg-overlay {
      position: relative;
      top: -100px;
      width: clamp(360px, 34vw, 480px);
      height: clamp(360px, 34vw, 480px);
      object-fit: contain;
      object-position: center center;
      opacity: 0;
      transform: translate3d(0, 75px, 0) scale(0.92);
      transition:
        transform 1.35s cubic-bezier(0.16, 1, 0.3, 1) 0.14s,
        opacity 0.95s ease 0.14s;
      filter: drop-shadow(0 25px 45px rgba(0, 0, 0, 0.85));
    }

    #beyond-dimension-overlay.is-open .by-spread.is-current .ch2-bg-beach {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }

    #beyond-dimension-overlay.is-open .by-spread.is-current .ch2-bg-overlay {
      opacity: 0.36;
      filter: brightness(0.8) contrast(1.08);
      transform: translate3d(0, 0, 0) scale(1);
    }

    .ch2-main-frame .by-photo-frame {
      border-color: rgba(251, 146, 60, 0.32) !important;
      box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.9), 0 0 28px -8px rgba(251, 146, 60, 0.22) !important;
    }

    /* ================= CHAPTER 03 EXCLUSIVE: BG IMAGE + 3D LEICA M3 OVERLAY ================= */
    .ch3-bg-stage {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
    }

    .ch3-bg-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      opacity: 0;
      transform: translate3d(45px, -25px, 0) scale(1.08);
      transition:
        transform 1.2s cubic-bezier(0.16, 1, 0.3, 1),
        opacity 0.95s ease;
      -webkit-mask-image: radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0.52) 20%, rgba(0,0,0,0.22) 65%, transparent 100%);
      mask-image: radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0.52) 20%, rgba(0,0,0,0.22) 65%, transparent 100%);
    }

    #beyond-dimension-overlay.is-open .by-spread.is-current .ch3-bg-img {
      opacity: 1;
      transform: translate3d(0%, 0, 0) scale(1.05);
    }

    #beyond-dimension-overlay.is-open #by-photo-spread.is-current.is-mode-1 .ch3-bg-img {
      opacity: 1;
      transform: translate3d(-6.5%, 0, 0) scale(1.07);
    }

    .ch3-leica-slot {
      position: relative;
      width: 100%;
      height: 340px;
      pointer-events: none;
    }

    #ch3-leica-canvas {
      position: absolute;
      inset: 0;
      width: 100% !important;
      height: 100% !important;
      display: block;
      pointer-events: none;
      z-index: 4;
    }

    /* ================= CHAPTER 04 EXCLUSIVE: 2-LAYER BG + 4-SPLIT PCB QUAD FRAME ================= */
    .ch4-bg-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      opacity: 0;
      transform: translate3d(45px, -30px, 0) scale(1.08);
      transition:
        transform 1.25s cubic-bezier(0.16, 1, 0.3, 1),
        opacity 0.95s ease;
      -webkit-mask-image: radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.22) 65%, transparent 100%);
      mask-image: radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.22) 65%, transparent 100%);
    }

    .ch4-overlay-tl {
      position: absolute;
      top: 14%;
      left: 5.5%;
      width: clamp(240px, 26vw, 370px);
      height: clamp(240px, 26vw, 370px);
      object-fit: contain;
      object-position: center center;
      opacity: 0;
      transform: translate3d(-260px, -150px, 0) rotate(-18deg) scale(0.85);
      transition: opacity 0.25s ease, transform 0.25s ease;
      filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.85));
    }

    .ch4-overlay-br {
      position: absolute;
      bottom: 0.5%;
      right: 9%;
      width: clamp(240px, 26vw, 370px);
      height: clamp(240px, 26vw, 370px);
      object-fit: contain;
      object-position: center center;
      opacity: 0;
      transform: translate3d(280px, 180px, 0) rotate(360deg) scale(0.78);
      transition: opacity 0.25s ease, transform 0.25s ease;
      filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.85));
    }

    #beyond-dimension-overlay.is-open .by-spread.is-current .ch4-bg-img {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }

    #beyond-dimension-overlay.is-open .by-spread.is-current .ch4-overlay-tl {
      opacity: 0.36;
      filter: brightness(0.78) contrast(1.08) drop-shadow(0 20px 40px rgba(0, 0, 0, 0.85));
      transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
      transition:
        transform 2.1s cubic-bezier(0.16, 1, 0.3, 1) 0.65s,
        opacity 1.4s ease 0.65s;
    }

    #beyond-dimension-overlay.is-open .by-spread.is-current .ch4-overlay-br {
      opacity: 0.36;
      filter: brightness(0.78) contrast(1.08) drop-shadow(0 20px 40px rgba(0, 0, 0, 0.85));
      transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
      transition:
        transform 2.4s cubic-bezier(0.16, 1, 0.3, 1) 0.85s,
        opacity 1.5s ease 0.85s;
    }

    /* 2x2 Quad-Split PCB Diagnostics Frame */
    .by-quad-frame {
      position: relative;
      overflow: hidden;
      background: #121214;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.75);
      padding: 6px;
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      grid-template-rows: repeat(2, minmax(0, 1fr)) !important;
      align-items: stretch !important;
      justify-items: stretch !important;
      gap: 6px;
      z-index: 10;
    }

    .by-quad-cell {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 8px;
      background: #0b0b0c;
      border: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .by-quad-cell img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.4s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .by-quad-cell img.is-loaded {
      opacity: 1;
    }

    .by-quad-cell:hover img.is-loaded {
      transform: scale(1.1);
    }

    .by-quad-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5px;
      letter-spacing: 0.08em;
      color: rgba(255, 255, 255, 0.45);
    }

    .by-photo-frame::after {
      content: '';
      position: absolute;
      inset: auto 0 0 0;
      height: 42%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.25) 55%, transparent 100%);
      pointer-events: none;
      z-index: 15;
    }

    .by-loc-badge {
      position: absolute;
      bottom: 9px;
      left: 11px;
      right: 10px;
      z-index: 20;
      display: inline-flex;
      align-items: center;
      gap: 4.5px;
      padding: 0;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
      font-family: var(--font-magnify), sans-serif;
      font-weight: 500;
      font-size: 10.5px;
      letter-spacing: 0.04em;
      color: #f8fafc;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9);
      pointer-events: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .by-loc-badge svg {
      width: 11px;
      height: 11px;
      color: #fbbf24;
      flex-shrink: 0;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8));
    }

    .by-spread .by-kicker,
    .by-spread h2,
    .by-spread .by-story-text {
      transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .by-spread:not(.is-current) .by-kicker,
    .by-spread:not(.is-current) h2,
    .by-spread:not(.is-current) .by-story-text {
      opacity: 0.25;
    }

    .by-vert-giant {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-family: var(--font-magnify), sans-serif;
      font-weight: 200;
      font-size: clamp(2.4rem, 4.8vw, 4.6rem);
      letter-spacing: 0.14em;
      line-height: 0.95;
      text-transform: uppercase;
      pointer-events: none;
      z-index: 15;
    }

    .by-story-text {
      font-family: var(--font-magnify), sans-serif;
      font-weight: 500;
      font-size: clamp(13px, 1.05vw, 15px);
      line-height: 1.65;
      opacity: 0.82;
      max-width: 390px;
    }

    .by-kicker {
      font-family: var(--font-magnify), sans-serif !important;
      font-size: 11.5px;
      font-weight: 300;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      margin-bottom: 10px;
      display: block;
      opacity: 0.8;
    }

    /* ================= ARCHITECTURAL BLANK RATIO PLACEHOLDER FRAMES ================= */
    .by-photo-frame {
      position: relative;
      overflow: hidden;
      background: #121214;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.75);
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .by-photo-inner {
      position: absolute;
      inset: -8%;
      width: 116%;
      height: 116%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-image:
        linear-gradient(to right, rgba(148,163,184,0.07) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(148,163,184,0.07) 1px, transparent 1px);
      background-size: 28px 28px;
    }

    .by-photo-inner img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .by-photo-inner img.is-loaded {
      opacity: 1;
    }

    .by-ratio-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px dashed currentColor;
      opacity: 0.65;
      margin-bottom: 6px;
    }

    .by-ratio-sub {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5px;
      opacity: 0.45;
      letter-spacing: 0.06em;
    }

    .by-hud-top {
      position: absolute;
      top: 24px;
      left: clamp(24px, 5vw, 64px);
      right: clamp(24px, 5vw, 64px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 30;
      pointer-events: none;
    }

    .by-hud-btn {
      pointer-events: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      padding: 8px 16px;
      border-radius: 9999px;
      border: 1px solid rgba(148, 163, 184, 0.35);
      background: rgba(11, 14, 26, 0.75);
      color: inherit;
      cursor: pointer;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }

    .by-hud-btn:hover {
      border-color: currentColor;
      transform: translateY(-1px);
    }

    .by-progress-track {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: rgba(120, 120, 128, 0.16);
      z-index: 30;
    }

    .by-progress-fill {
      height: 100%;
      width: 20%;
      background: linear-gradient(90deg, #8b5cf6, #00ff9d, #22d3ee);
      transition: width 0.25s ease;
    }

    /* ================= SUB-STAGE SWITCHERS (SPREAD 03 PHOTOGRAPHY & SPREAD 05 SEASONS) ================= */
    #by-photo-spread,
    #by-season-spread {
      --season-accent: #34d399;
      perspective: 1200px;
    }

    .by-season-tab,
    .by-photo-tab {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: #121214;
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-family: var(--font-magnify), sans-serif;
      font-size: 11.5px;
      font-weight: 300;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #71717a;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .by-season-tab span:first-child,
    .by-photo-tab span:first-child {
      font-weight: 500;
      opacity: 0.6;
    }

    .by-season-tab:hover,
    .by-season-tab.is-active,
    .by-photo-tab:hover,
    .by-photo-tab.is-active {
      color: #ffffff;
      background: #17171c;
      border-color: var(--tab-accent, #ffffff);
      box-shadow: 0 0 18px -4px var(--tab-accent, rgba(255,255,255,0.3));
    }

    .by-season-tab.is-active span:first-child,
    .by-photo-tab.is-active span:first-child {
      color: var(--tab-accent, #ffffff);
      opacity: 1;
    }

    .by-season-copy-pane,
    .by-photo-copy-pane {
      grid-area: 1 / 1;
      opacity: 0;
      pointer-events: none;
      transform-origin: center top;
      transform: perspective(900px) rotateX(-65deg) translate3d(0, 36px, 0);
      transition:
        transform 0.75s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.5s ease;
    }

    .by-season-copy-pane.is-active,
    .by-photo-copy-pane.is-active {
      opacity: 1;
      pointer-events: auto;
      transform: perspective(900px) rotateX(0deg) translate3d(0, 0, 0);
    }

    .by-season-gallery-pane,
    .by-photo-gallery-pane {
      grid-area: 1 / 1;
      width: 100%;
      pointer-events: none;
    }

    .by-season-gallery-pane.is-active,
    .by-photo-gallery-pane.is-active {
      pointer-events: auto;
      z-index: 10;
    }

    /* Photo 1: Glides UPWARD + Bottom-to-Top Curtain Shutter */
    .s-card-up {
      opacity: 0;
      clip-path: inset(100% 0 0 0 round 12px);
      transform: translate3d(0, 68px, 0);
      transition:
        transform 0.85s cubic-bezier(0.16, 1, 0.3, 1),
        clip-path 0.85s cubic-bezier(0.16, 1, 0.3, 1),
        opacity 0.45s ease;
    }

    /* Photo 2: Glides DOWNWARD in Counter-Motion + Top-to-Bottom Shutter */
    .s-card-down {
      opacity: 0;
      clip-path: inset(0 0 100% 0 round 12px);
      transform: translate3d(0, -64px, 0);
      transition:
        transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.1s,
        clip-path 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.1s,
        opacity 0.45s ease 0.1s;
    }

    /* Photo 3: Zooms Forward from 3D Z-Depth */
    .s-card-zoom {
      opacity: 0;
      transform: perspective(900px) translate3d(0, 28px, -110px) scale(0.84);
      transition:
        transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.18s,
        opacity 0.55s ease 0.18s;
    }

    .by-season-gallery-pane.is-active .s-card-up,
    .by-season-gallery-pane.is-active .s-card-down,
    .by-photo-gallery-pane.is-active .s-card-up,
    .by-photo-gallery-pane.is-active .s-card-down {
      opacity: 1;
      clip-path: inset(0% 0 0% 0 round 12px);
      transform: translate3d(0, 0, 0);
    }

    .by-season-gallery-pane.is-active .s-card-zoom,
    .by-photo-gallery-pane.is-active .s-card-zoom {
      opacity: 1;
      transform: perspective(900px) translate3d(0, 0, 0) scale(1);
    }

    .by-season-gallery-pane.is-active .by-photo-frame {
      border-color: color-mix(in srgb, var(--season-accent) 32%, rgba(255,255,255,0.08)) !important;
    }

    /* Chapter 03 Exclusive: Borderless Photo Frames */
    #by-photo-spread .by-photo-frame {
      border: none !important;
    }

    /* ================= CHAPTER 05 EXCLUSIVE: 4-SEASON BG & 4 UNIQUE ANIMATIONS ================= */
    .ch5-season-bg-pane {
      position: absolute;
      inset: -6%;
      width: 112%;
      height: 112%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.85s ease;
    }

    .ch5-season-bg-pane.is-active {
      opacity: 1;
    }

    .ch5-bg-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      transform: translate3d(40px, -20px, 0) scale(1.07);
      transition: transform 1.25s cubic-bezier(0.16, 1, 0.3, 1);
      -webkit-mask-image: radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0.48) 20%, rgba(0,0,0,0.2) 65%, transparent 100%);
      mask-image: radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0.48) 20%, rgba(0,0,0,0.2) 65%, transparent 100%);
    }

    /* 1. SPRING ANIMATION: Diagonal Breeze Glide + Soft Tilt */
    .anim-spring {
      opacity: 0;
      transform: translate3d(-52px, 42px, 0) rotate(-3.5deg) scale(0.94);
      transition:
        transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0s),
        opacity 0.55s ease var(--stagger, 0s);
    }
    .by-season-gallery-pane.is-active .anim-spring {
      opacity: 1;
      transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
    }

    /* 2. SUMMER ANIMATION: Horizontal Center-Out Split Shutter Unfold */
    .anim-summer {
      opacity: 0;
      clip-path: inset(0 50% 0 50% round 12px);
      transform: scale(1.06);
      transition:
        clip-path 0.85s cubic-bezier(0.22, 1, 0.36, 1) var(--stagger, 0s),
        transform 0.85s cubic-bezier(0.22, 1, 0.36, 1) var(--stagger, 0s),
        opacity 0.45s ease var(--stagger, 0s);
    }
    .by-season-gallery-pane.is-active .anim-summer {
      opacity: 1;
      clip-path: inset(0 0% 0 0% round 12px);
      transform: scale(1);
    }

    /* 3. AUTUMN ANIMATION: Top-Down Falling Leaf Gravity Pendulum */
    .anim-autumn {
      opacity: 0;
      transform: translate3d(18px, -68px, 0) rotate(3deg);
      transition:
        transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) var(--stagger, 0s),
        opacity 0.55s ease var(--stagger, 0s);
    }
    .by-season-gallery-pane.is-active .anim-autumn {
      opacity: 1;
      transform: translate3d(0, 0, 0) rotate(0deg);
    }

    /* 4. WINTER ANIMATION: Deep 3D Polar Z-Space Zoom */
    .anim-winter {
      opacity: 0;
      transform: perspective(1000px) translate3d(0, 24px, -170px) scale(0.8);
      transition:
        transform 0.95s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0s),
        opacity 0.6s ease var(--stagger, 0s);
    }
    .by-season-gallery-pane.is-active .anim-winter {
      opacity: 1;
      transform: perspective(1000px) translate3d(0, 0, 0) scale(1);
    }

    /* ================= CHAPTER 05: 4-COUNTRY FIELD NOTES LIST (LEFT COLUMN) ================= */
    .by-country-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      max-width: 390px;
      margin-top: 4px;
    }

    .by-country-item {
      border-left: 1.5px solid rgba(255, 255, 255, 0.14);
      padding-left: 10px;
      transition: border-color 0.3s ease;
    }

    .by-country-item:hover {
      border-left-color: var(--season-accent, #ffffff);
    }

    .by-country-tag {
      display: block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--season-accent, #e2e8f0);
      margin-bottom: 2px;
    }

    .by-country-desc {
      font-family: var(--font-magnify), sans-serif;
      font-weight: 500;
      font-size: 11.5px;
      line-height: 1.42;
      color: rgba(228, 228, 231, 0.88);
      margin: 0;
    }

    /* ================= 3-IMAGE SYNCHRONIZED SEASONAL REEL INSIDE EACH COUNTRY FRAME ================= */
    .by-trio-slide {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0 !important;
      z-index: 1;
      pointer-events: none;
    }

    .by-trio-slide.is-Loaded-prev {
      opacity: 1 !important;
      z-index: 2;
      transform: scale(1);
      clip-path: inset(0 0 0 0);
    }

    [data-season-gallery="0"] .by-trio-slide:not(.is-active-slide):not(.is-Loaded-prev) {
      transform: translate3d(16%, 14%, 0) scale(1.1);
    }
    [data-season-gallery="0"] .by-trio-slide.is-active-slide.is-loaded {
      opacity: 1 !important;
      z-index: 3;
      transform: translate3d(0, 0, 0) scale(1);
      transition:
        transform 1.05s cubic-bezier(0.22, 1, 0.36, 1) var(--country-ripple, 0s),
        opacity 0.65s ease var(--country-ripple, 0s);
    }

    [data-season-gallery="1"] .by-trio-slide:not(.is-active-slide):not(.is-Loaded-prev) {
      clip-path: inset(0 0 0 100%);
      transform: scale(1.08);
    }
    [data-season-gallery="1"] .by-trio-slide.is-active-slide.is-loaded {
      opacity: 1 !important;
      z-index: 3;
      clip-path: inset(0 0 0 0%);
      transform: scale(1);
      transition:
        clip-path 1.05s cubic-bezier(0.22, 1, 0.36, 1) var(--country-ripple, 0s),
        transform 1.15s cubic-bezier(0.22, 1, 0.36, 1) var(--country-ripple, 0s),
        opacity 0.3s ease var(--country-ripple, 0s);
    }

    [data-season-gallery="2"] .by-trio-slide:not(.is-active-slide):not(.is-Loaded-prev) {
      clip-path: inset(0 0 100% 0);
      transform: translate3d(0, -10%, 0) scale(1.07);
    }
    [data-season-gallery="2"] .by-trio-slide.is-active-slide.is-loaded {
      opacity: 1 !important;
      z-index: 3;
      clip-path: inset(0 0 0% 0);
      transform: translate3d(0, 0, 0) scale(1);
      transition:
        clip-path 1.05s cubic-bezier(0.22, 1, 0.36, 1) var(--country-ripple, 0s),
        transform 1.15s cubic-bezier(0.22, 1, 0.36, 1) var(--country-ripple, 0s),
        opacity 0.3s ease var(--country-ripple, 0s);
    }

    [data-season-gallery="3"] .by-trio-slide:not(.is-active-slide):not(.is-Loaded-prev) {
      transform: scale(1.18);
    }
    [data-season-gallery="3"] .by-trio-slide.is-active-slide.is-loaded {
      opacity: 1 !important;
      z-index: 3;
      transform: scale(1);
      transition:
        transform 1.15s cubic-bezier(0.16, 1, 0.3, 1) var(--country-ripple, 0s),
        opacity 0.75s ease var(--country-ripple, 0s);
    }

    .by-trio-dots {
      position: absolute;
      top: 9px;
      right: 10px;
      z-index: 20;
      display: flex;
      align-items: center;
      gap: 4px;
      pointer-events: none;
    }

    .by-trio-dot {
      width: 4.5px;
      height: 4.5px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.28);
      transition: all 0.35s ease;
    }

    .by-trio-dot.is-active {
      width: 12px;
      background: var(--season-accent, #ffffff);
      box-shadow: 0 0 6px var(--season-accent, #ffffff);
    }
  `;
  document.head.appendChild(style);

  // =========================================================================
  // CONSOLIDATED FRAME & BADGE BUILDERS (USES data-src FOR PREDICTIVE WARMING)
  // =========================================================================
  function renderBadge(badgeText = '', defaultPrefix = 'loc') {
    if (!badgeText) return '';
    const [prefix, ...rest] = badgeText.includes(':') ? badgeText.split(':') : [defaultPrefix, badgeText];
    const cleanText = rest.join(':');
    const iconSvg = BADGE_ICONS[prefix] || BADGE_ICONS.loc;
    return `
      <div class="by-loc-badge">
        ${iconSvg}
        <span>${cleanText}</span>
      </div>
    `;
  }

  function ratioFrame(aspectClass, sizeClass, ratioLabel, resLabel, fileName, badgeText = '') {
    const localPath = `assets/images/beyond/${fileName}`;
    return `
      <div class="by-photo-frame ${aspectClass} ${sizeClass} rounded-xl" data-parallax="1.0">
        <div class="by-photo-inner" data-inner-pan="true">
          <span class="by-ratio-badge">${ratioLabel}</span>
          <span class="by-ratio-sub">${resLabel}</span>
          <span class="by-ratio-sub mt-1">${localPath}</span>
          <img data-src="${assetUrl(localPath)}" data-fallback="${localPath}" alt="" decoding="async" />
        </div>
        ${renderBadge(badgeText)}
      </div>
    `;
  }

  function quadPcbFrame(aspectClass, sizeClass, files, badgeLabel) {
    const cells = files
      .map((f, idx) => {
        const localPath = `assets/images/beyond/${f}`;
        return `
          <div class="by-quad-cell">
            <span class="by-quad-tag">PCB 0${idx + 1}</span>
            <img data-src="${assetUrl(localPath)}" data-fallback="${localPath}" alt="" decoding="async" />
          </div>
        `;
      })
      .join('');

    return `
      <div class="by-quad-frame by-photo-frame ${aspectClass} ${sizeClass} rounded-xl" data-parallax="1.0">
        ${cells}
        ${renderBadge(`pcb:${badgeLabel}`)}
      </div>
    `;
  }

  function seasonTrioFrame(ratioLabel, basePrefix, countryName, rippleDelay = '0s') {
    const slidesMarkup = ['a', 'b', 'c']
      .map((suffix, idx) => {
        const localPath = `assets/images/beyond/${basePrefix}${suffix}.webp`;
        return `
          <img 
            data-src="${assetUrl(localPath)}" 
            data-fallback="${localPath}"
            alt="${countryName} ${idx + 1}" 
            data-slide-idx="${idx}"
            class="by-trio-slide ${idx === 0 ? 'is-active-slide' : ''}" 
            decoding="async" 
          />
        `;
      })
      .join('');

    return `
      <div class="by-photo-frame by-trio-frame aspect-[16/10] w-full rounded-xl" data-parallax="1.0" style="--country-ripple: ${rippleDelay};">
        <div class="by-photo-inner" data-inner-pan="true">
          <span class="by-ratio-badge">${ratioLabel} • 3x REEL</span>
          <span class="by-ratio-sub">1200 × 750 px (a, b, c)</span>
          <span class="by-ratio-sub mt-1">assets/images/beyond/${basePrefix}[a-c].webp</span>
          ${slidesMarkup}
        </div>
        <div class="by-trio-dots">
          <span class="by-trio-dot is-active"></span>
          <span class="by-trio-dot"></span>
          <span class="by-trio-dot"></span>
        </div>
        ${renderBadge(countryName)}
      </div>
    `;
  }

  function bgImgTag(fileName, className) {
    const localPath = `assets/images/section-bg/${fileName}`;
    return `<img data-src="${assetUrl(localPath)}" data-fallback="${localPath}" alt="" class="${className}" decoding="async" />`;
  }

  // 1. Render Stage A: Neon Planetary Horizon SVG
  const horizonBg = document.getElementById('beyond-horizon-bg');
  if (horizonBg) {
    horizonBg.innerHTML = `
      <svg class="by-horizon-svg" viewBox="0 0 1600 1580" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="planet-rim-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.9" />
            <stop offset="25%" stop-color="#2dd4bf" stop-opacity="0.95" />
            <stop offset="50%" stop-color="#38bdf8" stop-opacity="1" />
            <stop offset="75%" stop-color="#6366f1" stop-opacity="0.95" />
            <stop offset="100%" stop-color="#9333ea" stop-opacity="0.9" />
          </linearGradient>

          <linearGradient id="planet-glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.5" />
            <stop offset="25%" stop-color="#06b6d4" stop-opacity="0.5" />
            <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.5" />
            <stop offset="75%" stop-color="#7c3aed" stop-opacity="0.5" />
            <stop offset="100%" stop-color="#9333ea" stop-opacity="0.5" />
          </linearGradient>

          <filter id="horizon-blur" x="-15%" y="-30%" width="130%" height="160%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        <path d="M 0 720 Q 800 370 1600 720" fill="none" stroke="url(#planet-glow-grad)" stroke-width="12" filter="url(#horizon-blur)" />
        <path d="M 0 720 Q 800 370 1600 720 L 1600 1580 L 0 1580 Z" fill="#0b0b0c" />
        <path d="M 0 720 Q 800 370 1600 720" fill="none" stroke="url(#planet-rim-grad)" stroke-width="2.2" />
      </svg>
    `;
  }

  portalMount.innerHTML = `
    <div class="relative z-10 max-w-2xl text-left pt-0 pb-6 -mt-2">
      <span class="by-kicker text-cyan-400">LATITUDES &amp; ALTITUDES &nbsp;•&nbsp; PERSONAL ARCHIVE</span>
      <h4 class="font-magnify-thin text-3xl sm:text-5xl xl:text-6xl tracking-[0.12em] uppercase text-white leading-tight whitespace-nowrap mb-4">
        UNDER OPEN SKIES
      </h4>
      <p class="by-story-text text-zinc-300 !max-w-xl mb-7">
        Away from logic and algorithms, every piece here was built when I felt down—diving into the tactile satisfaction of crafting from scratch and turning raw materials into warm physical builds as my favorite escape and dopamine reset.
      </p>
      <button type="button" id="by-open-trigger" class="by-enter-btn">
        <span>Enter The Other Side</span>
        <span>↗</span>
      </button>
    </div>
  `;

  // 2. Render Stage B: Fullscreen 5-Spread Lookbook
  overlay.innerHTML = `
    <div class="by-hud-top">
      <span class="font-mono text-[10.5px] tracking-[0.28em] uppercase opacity-75">05 // BEYOND THE CODE</span>
      <button type="button" id="by-close-btn" class="by-hud-btn">&times; Exit Dimension</button>
    </div>

    <div class="by-track" id="by-track">

      <!-- ================= SPREAD 01: CHAPTER 01 (3 LEFT | TOP-MID-BOTTOM HELMET SPLIT | 3 RIGHT) ================= -->
      <div class="by-spread is-current">

        <div class="ch1-bg-stage" aria-hidden="true">
          <div class="ch1-parallax-layer" data-parallax="0.55" data-mouse-depth="-0.45">
            ${bgImgTag('ch1-bg-himalayas.webp', 'ch1-bg-himalayas')}
          </div>
          <div class="ch1-parallax-layer" data-parallax="0.88" data-mouse-depth="0.95">
            ${bgImgTag('ch1-bg-helmet.webp', 'ch1-bg-helmet')}
          </div>
        </div>

        <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">

          <!-- LEFT WING -->
          <div class="lg:col-span-4 grid grid-cols-12 gap-3.5 items-center">
            <div class="col-span-11 w-full" data-parallax="0.78" data-mouse-depth="-0.9">
              ${ratioFrame('aspect-[16/10]', 'w-full max-w-[255px]', 'LEFT 01 • 16:10', '1200 × 750 px', 'ch1-left-1.webp', 'Rosemala')}
            </div>
            <div class="col-span-7 w-full mt-1" data-parallax="1.22" data-mouse-depth="1.2">
              ${ratioFrame('aspect-[4/5]', 'w-full max-w-[185px]', 'LEFT 02 • 4:5', '960 × 1200 px', 'ch1-left-2.webp', 'Mandalpatti')}
            </div>
            <div class="col-span-5 w-full -ml-2 -mt-6 z-20" data-parallax="1.05" data-mouse-depth="0.6">
              ${ratioFrame('aspect-[1/1]', 'w-full max-w-[145px]', 'LEFT 03 • 1:1', '800 × 800 px', 'ch1-left-3.webp', 'Chikkamagaluru')}
            </div>
          </div>

          <!-- CENTER STAGE -->
          <div class="lg:col-span-4 lg:min-h-[470px] xl:min-h-[510px] flex flex-col items-center justify-between text-center px-2 z-20">
            <div class="flex flex-col items-center -mt-4" data-parallax="1.15" data-mouse-depth="0.5">
              <span class="by-kicker text-amber-400 !mb-2">
                CHAPTER 01 &nbsp;•&nbsp; ALTITUDES &amp; OFF-ROADS
              </span>
              <div class="w-9 h-[1.5px] bg-amber-400/90"></div>
            </div>

            <h2 class="ch1-title-pop text-3xl sm:text-4xl xl:text-[42px] tracking-[0.14em] uppercase leading-[1.18] my-auto whitespace-nowrap" data-parallax="1.42" data-mouse-depth="1.5">
              Where The<br/>Mountains Meet<br/>The Throttle
            </h2>

            <p class="by-story-text text-zinc-200 text-center !max-w-[560px] lg:w-[150%] -mb-10 translate-y-2" data-parallax="1.12" data-mouse-depth="0.6">
              Some people find peace in stillness; I find it where the air gets thin and the tarmac starts to twist. Give me a winding mountain pass, two wheels underneath, and a horizon that keeps climbing.
            </p>
          </div>

          <!-- RIGHT WING -->
          <div class="lg:col-span-4 grid grid-cols-12 gap-3.5 items-center">
            <div class="col-span-5 w-full mt-6 -mr-2 z-20 flex justify-end" data-parallax="1.08" data-mouse-depth="0.7">
              ${ratioFrame('aspect-[1/1]', 'w-full max-w-[145px]', 'RIGHT 03 • 1:1', '800 × 800 px', 'ch1-right-3.webp', 'Kottappara')}
            </div>
            <div class="col-span-7 w-full flex justify-end" data-parallax="1.2" data-mouse-depth="1.1">
              ${ratioFrame('aspect-[4/5]', 'w-full max-w-[185px]', 'RIGHT 01 • 4:5', '960 × 1200 px', 'ch1-right-1.webp', 'Velliangiri Hills')}
            </div>
            <div class="col-span-11 col-start-2 w-full mt-1 flex justify-end" data-parallax="0.82" data-mouse-depth="-0.8">
              ${ratioFrame('aspect-[16/10]', 'w-full max-w-[255px]', 'RIGHT 02 • 16:10', '1200 × 750 px', 'ch1-right-2.webp', 'Unknown Location')}
            </div>
          </div>

        </div>
      </div>

      <!-- ================= SPREAD 02: CHAPTER 02 (SUNSETS & BEACHES) ================= -->
      <div class="by-spread is-neighbor">

        <div class="ch1-bg-stage" aria-hidden="true">
          <div class="ch1-parallax-layer" data-parallax="0.55" data-mouse-depth="-0.45">
            ${bgImgTag('ch2-bg-beach.webp', 'ch2-bg-beach')}
          </div>
          <div class="ch1-parallax-layer" data-parallax="0.88" data-mouse-depth="0.95">
            ${bgImgTag('ch2-bg-overlay.webp', 'ch2-bg-overlay')}
          </div>
        </div>

        <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-center relative z-10">

          <!-- LEFT WING -->
          <div class="lg:col-span-3 grid grid-cols-12 gap-3 items-center">
            <div class="col-span-12 w-full" data-parallax="0.8" data-mouse-depth="-0.85">
              ${ratioFrame('aspect-[16/10]', 'w-full max-w-[235px]', 'BEACH 02 • 16:10', '1200 × 750 px', 'ch2-pic-2.webp', 'Kovalam Beach')}
            </div>
            <div class="col-span-7 w-full mt-1" data-parallax="1.2" data-mouse-depth="1.15">
              ${ratioFrame('aspect-[4/5]', 'w-full max-w-[165px]', 'SUNSET 03 • 4:5', '960 × 1200 px', 'ch2-pic-3.webp', 'Kollam Beach')}
            </div>
            <div class="col-span-5 w-full -ml-2 -mt-5 z-20" data-parallax="1.05" data-mouse-depth="0.6">
              ${ratioFrame('aspect-[1/1]', 'w-full max-w-[130px]', 'COAST 04 • 1:1', '800 × 800 px', 'ch2-pic-4.webp', 'Azheekal')}
            </div>
          </div>

          <!-- CENTER STAGE -->
          <div class="lg:col-span-6 lg:min-h-[480px] xl:min-h-[520px] flex flex-col items-center justify-between text-center px-2 z-20">
            <div class="flex flex-col items-center -mt-3">
              <span class="by-kicker text-orange-400 !mb-2" data-parallax="1.15" data-mouse-depth="0.5">
                CHAPTER 02 &nbsp;•&nbsp; GOLDEN HOUR &amp; SALT AIR
              </span>
              <div class="w-9 h-[1.5px] bg-orange-400/90 mb-4" data-parallax="1.2" data-mouse-depth="0.7"></div>

              <h2 class="ch1-title-pop text-3xl sm:text-4xl xl:text-[42px] tracking-[0.14em] uppercase leading-[1.12] whitespace-nowrap" data-parallax="1.4" data-mouse-depth="1.45">
                Sunsets &amp; Coastlines
              </h2>
            </div>

            <div class="relative flex items-center justify-center my-auto py-2 w-full">
              <div class="ch2-main-frame w-full max-w-[330px] sm:max-w-[365px] z-20" data-parallax="1.25" data-mouse-depth="1.3">
                ${ratioFrame('aspect-[16/10]', 'w-full', 'MAIN FRAME 01 • 16:10', '1400 × 875 px', 'ch2-main-1.webp', 'Azheekal Beach')}
              </div>

              <div class="hidden sm:block w-[125px] xl:w-[138px] -ml-7 mt-24 z-30" data-parallax="1.42" data-mouse-depth="1.75">
                ${ratioFrame('aspect-[1/1]', 'w-full', 'HORIZON 05 • 1:1', '800 × 800 px', 'ch2-pic-5.webp', 'Azheekal Beach')}
              </div>
            </div>

            <p class="by-story-text text-zinc-200 text-center !max-w-[540px] lg:w-[115%] -mb-8 translate-y-1" data-parallax="1.1" data-mouse-depth="0.6">
              When the mountain roads wind down to the sea, nothing beats watching the sun melt into the horizon—salt in the air, waves rhythmic against the shore, and the sky burning in amber and violet.
            </p>
          </div>

          <!-- RIGHT WING -->
          <div class="lg:col-span-3 grid grid-cols-12 gap-3 items-center">
            <div class="col-span-5 w-full mt-5 -mr-2 z-20 flex justify-end" data-parallax="1.08" data-mouse-depth="0.7">
              ${ratioFrame('aspect-[1/1]', 'w-full max-w-[130px]', 'SHORE 07 • 1:1', '800 × 800 px', 'ch2-pic-7.webp', 'Coorg')}
            </div>
            <div class="col-span-7 w-full flex justify-end" data-parallax="1.2" data-mouse-depth="1.1">
              ${ratioFrame('aspect-[4/5]', 'w-full max-w-[165px]', 'BEACH 06 • 4:5', '960 × 1200 px', 'ch2-pic-6.webp', 'Azheekal Beach')}
            </div>
            <div class="col-span-12 w-full mt-1 flex justify-end" data-parallax="0.82" data-mouse-depth="-0.8">
              ${ratioFrame('aspect-[16/10]', 'w-full max-w-[235px]', 'SUNSET 08 • 16:10', '1200 × 750 px', 'ch2-pic-8.webp', 'Kovalam')}
            </div>
          </div>

        </div>
      </div>

      <!-- ================= SPREAD 03: CHAPTER 03 (PHOTOGRAPHY + 3D LEICA M3) ================= -->
      <div class="by-spread is-culled" id="by-photo-spread" style="--season-accent: #38bdf8;">

        <div class="ch3-bg-stage" aria-hidden="true">
          <div class="ch1-parallax-layer" data-parallax="0.55" data-mouse-depth="-0.45">
            ${bgImgTag('ch3-bg.webp', 'ch3-bg-img')}
          </div>
          <canvas id="ch3-leica-canvas"></canvas>

          <span class="font-magnify-light text-[10.5px] tracking-[0.24em] uppercase text-zinc-300/90 absolute bottom-10 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap pointer-events-none" id="by-photo-step-hint">
            VIEW 01 / 02 &nbsp;•&nbsp; LENS VIEW (SCROLL FOR VIEWFINDER &amp; PORTRAITS)
          </span>
        </div>

        <div class="w-full max-w-[1380px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">

          <!-- LEFT 4 COLS -->
          <div class="lg:col-span-4 flex flex-col items-start text-left z-20">
            <span class="by-kicker text-cyan-400 mb-2.5">CHAPTER 03 &nbsp;•&nbsp; VISUAL PERSPECTIVES</span>

            <div class="flex flex-wrap items-center gap-2 mb-5" id="by-photo-tabs">
              <button type="button" class="by-photo-tab is-active" data-photo-mode="0" style="--tab-accent: #38bdf8;">
                <span>01</span><span>Behind The Lens</span>
              </button>
              <button type="button" class="by-photo-tab" data-photo-mode="1" style="--tab-accent: #a855f7;">
                <span>02</span><span>In The Frame</span>
              </button>
            </div>

            <div class="grid w-full">
              <div class="by-photo-copy-pane is-active" data-photo-copy="0">
                <h2 class="font-magnify-thin text-2xl sm:text-4xl xl:text-[38px] tracking-[0.12em] uppercase text-white leading-none whitespace-nowrap">
                  Through My Lens
                </h2>
              </div>
              <div class="by-photo-copy-pane" data-photo-copy="1">
                <h2 class="font-magnify-thin text-2xl sm:text-4xl xl:text-[38px] tracking-[0.12em] uppercase text-white leading-none whitespace-nowrap">
                  In The Frame
                </h2>
              </div>
            </div>

            <div class="ch3-leica-slot" id="ch3-leica-anchor"></div>

            <div class="grid w-full">
              <div class="by-photo-copy-pane is-active" data-photo-copy="0">
                <div class="border-l-[1.5px] border-cyan-400/60 pl-3.5">
                  <p class="by-story-text text-zinc-200 !max-w-[415px] !text-[13.5px] !leading-[1.55]">
                    Every frame has a rhythm of its own. From low-light street corners to golden reflections at dusk, few frames of how the world looks from my side of the lens.
                  </p>
                </div>
              </div>

              <div class="by-photo-copy-pane" data-photo-copy="1">
                <div class="border-l-[1.5px] border-purple-400/60 pl-3.5">
                  <p class="by-story-text text-zinc-200 !max-w-[415px] !text-[13.5px] !leading-[1.55]">
                    On the other side of the shutter—unposed frames, quiet reflections, and my favorite portraits captured by my people along the way.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT 8 COLS -->
          <div class="lg:col-span-8 lg:pl-10 xl:pl-14 lg:translate-x-4 grid relative min-h-[430px] sm:min-h-[470px] items-center" id="by-photo-galleries">

            <!-- GALLERY 0: PHOTOGRAPHY (6 IMAGES) -->
            <div class="by-photo-gallery-pane is-active grid grid-cols-12 gap-3.5 items-center" data-photo-gallery="0">
              <div class="col-span-4 flex flex-col gap-3.5 items-end">
                <div class="w-full max-w-[205px] s-card-up">
                  ${ratioFrame('aspect-[4/5]', 'w-full', 'TALL 01 • 4:5', '960 × 1200 px', 'ch3-shot-1.webp', 'exif:100mm • f/2.8')}
                </div>
                <div class="w-full max-w-[240px] s-card-zoom">
                  ${ratioFrame('aspect-[16/10]', 'w-full', 'MED 02 • 16:10', '1200 × 750 px', 'ch3-shot-2.webp', 'exif:105mm • f/2.8')}
                </div>
              </div>

              <div class="col-span-4 flex flex-col gap-3.5 items-center">
                <div class="w-full max-w-[240px] s-card-down">
                  ${ratioFrame('aspect-[16/10]', 'w-full', 'MED 03 • 16:10', '1200 × 750 px', 'ch3-shot-3.webp', 'exif:105mm • f/2.8')}
                </div>
                <div class="w-full max-w-[205px] s-card-up">
                  ${ratioFrame('aspect-[4/5]', 'w-full', 'TALL 04 • 4:5', '960 × 1200 px', 'ch3-shot-4.webp', 'exif:105mm • f/2.8')}
                </div>
              </div>

              <div class="col-span-4 flex flex-col gap-3.5 items-start">
                <div class="w-full max-w-[205px] s-card-up">
                  ${ratioFrame('aspect-[4/5]', 'w-full', 'TALL 05 • 4:5', '960 × 1200 px', 'ch3-shot-5.webp', 'exif:80mm • f/1.8')}
                </div>
                <div class="w-full max-w-[240px] s-card-zoom">
                  ${ratioFrame('aspect-[16/10]', 'w-full', 'MED 06 • 16:10', '1200 × 750 px', 'ch3-shot-6.webp', 'exif:230mm • f/2.8')}
                </div>
              </div>
            </div>

            <!-- GALLERY 1: PHOTOGRAPHS OF ME (8 IMAGES) -->
            <div class="by-photo-gallery-pane grid grid-cols-12 gap-3.5 items-center" data-photo-gallery="1">
              <div class="col-span-3 flex flex-col gap-3.5 -mt-6">
                <div class="s-card-up">
                  ${ratioFrame('aspect-[3/4]', 'w-full', 'ME 01 • 3:4', '900 × 1200 px', 'ch3-me-1.webp', 'exif:85mm • f/11.0')}
                </div>
                <div class="s-card-zoom w-[92%] self-end">
                  ${ratioFrame('aspect-[4/3]', 'w-full', 'ME 05 • 4:3', '1000 × 750 px', 'ch3-me-5.webp', 'exif:70mm • f/5.0')}
                </div>
              </div>

              <div class="col-span-3 flex flex-col gap-3.5 mt-7">
                <div class="s-card-down w-[94%]">
                  ${ratioFrame('aspect-[16/10]', 'w-full', 'ME 02 • 16:10', '1000 × 625 px', 'ch3-me-2.webp', 'exif:85mm • f/2.8')}
                </div>
                <div class="s-card-up">
                  ${ratioFrame('aspect-[4/5]', 'w-full', 'ME 06 • 4:5', '960 × 1200 px', 'ch3-me-6.webp', 'exif:50mm • f/2.8')}
                </div>
              </div>

              <div class="col-span-3 flex flex-col gap-3.5 -mt-4">
                <div class="s-card-up">
                  ${ratioFrame('aspect-[4/5]', 'w-full', 'ME 03 • 4:5', '960 × 1200 px', 'ch3-me-3.webp', 'exif:70mm • f/5.0')}
                </div>
                <div class="s-card-down w-[92%] self-start">
                  ${ratioFrame('aspect-[16/10]', 'w-full', 'ME 07 • 16:10', '1000 × 625 px', 'ch3-me-7.webp', 'exif:50mm • f/1.8')}
                </div>
              </div>

              <div class="col-span-3 flex flex-col gap-3.5 mt-5">
                <div class="s-card-zoom w-[92%] self-end">
                  ${ratioFrame('aspect-[4/3]', 'w-full', 'ME 04 • 4:3', '1000 × 750 px', 'ch3-me-4.webp', 'exif:230mm • f/2.8')}
                </div>
                <div class="s-card-up">
                  ${ratioFrame('aspect-[3/4]', 'w-full', 'ME 08 • 3:4', '900 × 1200 px', 'ch3-me-8.webp', 'exif:85mm • f/2.8')}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- ================= SPREAD 04: CHAPTER 04 (DIAGONAL Z-SPLIT: TOP DIYS | BOTTOM SOLDER, WRENCH & CUT) ================= -->
      <div class="by-spread is-culled">

        <div class="ch1-bg-stage" aria-hidden="true">
          <div class="ch1-parallax-layer" data-parallax="0.55" data-mouse-depth="-0.45">
            ${bgImgTag('ch4-bg.webp', 'ch4-bg-img')}
          </div>
          <div class="ch1-parallax-layer" data-parallax="0.84" data-mouse-depth="0.9">
            ${bgImgTag('ch4-overlay-craft.webp', 'ch4-overlay-tl')}
          </div>
          <div class="ch1-parallax-layer" data-parallax="1.16" data-mouse-depth="-0.9">
            ${bgImgTag('ch4-overlay-tools.webp', 'ch4-overlay-br')}
          </div>
        </div>

        <div class="w-full max-w-7xl mx-auto flex flex-col justify-between gap-3.5 lg:gap-4 relative z-10 my-auto">

          <div class="flex flex-col items-center text-center -mt-3 mb-0.5">
            <span class="by-kicker text-rose-400 !mb-1.5" data-parallax="1.15" data-mouse-depth="0.5">
              CHAPTER 04 &nbsp;•&nbsp; MAKER &amp; MECHANIC
            </span>
            <div class="w-9 h-[1.5px] bg-gradient-to-r from-rose-400 to-amber-400 mb-2.5" data-parallax="1.2" data-mouse-depth="0.6"></div>
            <h2 class="ch1-title-pop text-2xl sm:text-3xl xl:text-[36px] tracking-[0.14em] uppercase leading-[1.12] whitespace-nowrap" data-parallax="1.35" data-mouse-depth="1.3">
              The Tactile &amp; The Technical
            </h2>
          </div>

          <!-- 1. TOP DECK -->
          <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
            <div class="lg:col-span-3 flex flex-col items-start text-left pr-2">
              <span class="by-kicker text-rose-400 !mb-1.5 whitespace-nowrap !text-[10.5px] !tracking-[0.2em]" data-parallax="1.15" data-mouse-depth="0.5">
                04.1 &nbsp;•&nbsp; AMBIENT &amp; LIGHT CRAFT
              </span>
              <div class="w-8 h-[1.5px] bg-rose-400/90 mb-2.5" data-parallax="1.2" data-mouse-depth="0.6"></div>

              <h3 class="font-magnify-thin text-2xl sm:text-3xl xl:text-[34px] tracking-[0.12em] uppercase text-white leading-[1.12] mb-2.5" data-parallax="1.32" data-mouse-depth="1.2">
                Crafted By<br/>Hand
              </h3>

              <p class="by-story-text text-zinc-300 !text-xs sm:!text-[13px] !leading-relaxed" data-parallax="1.08" data-mouse-depth="0.4">
                Away from logic and algorithms, every piece here was built when I felt down—diving into the tactile satisfaction of crafting from scratch and turning raw materials into warm physical builds as my favorite escape and dopamine reset.
                </p>
            </div>

            <div class="lg:col-span-9 grid grid-cols-2 sm:grid-cols-12 gap-3.5 items-center">
              <div class="sm:col-span-3 w-full -mt-2" data-parallax="1.1" data-mouse-depth="0.8">
                ${ratioFrame('aspect-[4/5]', 'w-full max-w-[180px] mx-auto', 'DIY 01 • 4:5', '800 × 1000 px', 'ch4-diy-1.webp', 'diy:Frosted Romance')}
              </div>
              <div class="sm:col-span-3 w-full mt-3" data-parallax="0.92" data-mouse-depth="-0.6">
                ${ratioFrame('aspect-[1/1]', 'w-full max-w-[170px] mx-auto', 'DIY 02 • 1:1', '800 × 800 px', 'ch4-diy-2.webp', 'diy:The Chakra Lamp')}
              </div>
              <div class="sm:col-span-3 w-full -mt-3" data-parallax="1.2" data-mouse-depth="1.1">
                ${ratioFrame('aspect-[1/1]', 'w-full max-w-[170px] mx-auto', 'DIY 03 • 1:1', '800 × 800 px', 'ch4-diy-3.webp', "diy:Edison's Knot")}
              </div>
              <div class="sm:col-span-3 w-full mt-2" data-parallax="0.86" data-mouse-depth="-0.8">
                ${ratioFrame('aspect-[4/5]', 'w-full max-w-[180px] mx-auto', 'DIY 04 • 4:5', '800 × 1000 px', 'ch4-diy-4.webp', 'diy:The Prism Loom')}
              </div>
            </div>
          </div>

          <!-- CENTER SCHEMATIC DIVIDER LINE -->
          <div class="w-full flex items-center gap-4 opacity-40 select-none pointer-events-none my-0.5">
            <div class="h-px flex-1 bg-gradient-to-r from-transparent via-rose-400 to-rose-400"></div>
            <span class="font-mono text-[10px] tracking-[0.3em] text-zinc-200">+ BENCH // GARAGE // SUITE +</span>
            <div class="h-px flex-1 bg-gradient-to-l from-transparent via-amber-400 to-amber-400"></div>
          </div>

          <!-- 2. BOTTOM DECK -->
          <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
            <div class="lg:col-span-9 order-2 lg:order-1 grid grid-cols-2 sm:grid-cols-12 gap-3.5 items-center">
              <div class="sm:col-span-3 w-full mt-2" data-parallax="0.85" data-mouse-depth="-0.9">
                ${quadPcbFrame(
                  'aspect-[4/5]',
                  'w-full max-w-[190px] mx-auto',
                  ['ch4-pcb-1.webp', 'ch4-pcb-2.webp', 'ch4-pcb-3.webp', 'ch4-pcb-4.webp'],
                  'Circuits & Troubles'
                )}
              </div>
              <div class="sm:col-span-3 w-full -mt-3" data-parallax="1.18" data-mouse-depth="1.0">
                ${ratioFrame('aspect-[4/5]', 'w-full max-w-[180px] mx-auto', 'GARAGE 02 • 4:5', '800 × 1000 px', 'ch4-hobby-mech.webp', 'mech:Machines & Me')}
              </div>
              <div class="sm:col-span-3 w-full mt-3" data-parallax="0.92" data-mouse-depth="-0.6">
                ${ratioFrame('aspect-[16/10]', 'w-full max-w-[220px] mx-auto', 'DAVINCI 03 • 16:10', '1200 × 750 px', 'ch4-hobby-davinci.webp', 'grade:Timeline & Color Wheels')}
              </div>
              <div class="sm:col-span-3 w-full -mt-2" data-parallax="1.14" data-mouse-depth="0.85">
                ${ratioFrame('aspect-[1/1]', 'w-full max-w-[170px] mx-auto', 'TOOLS 04 • 1:1', '800 × 800 px', 'ch4-hobby-tools.webp', 'tools:Sockets & Torque')}
              </div>
            </div>

            <div class="lg:col-span-3 order-1 lg:order-2 flex flex-col lg:items-end text-left lg:text-right pl-2">
              <span class="by-kicker text-amber-400 !mb-1.5 whitespace-nowrap !text-[10.5px] !tracking-[0.2em]" data-parallax="1.15" data-mouse-depth="0.5">
                04.2 &nbsp;•&nbsp; BENCH &amp; GARAGE
              </span>
              <div class="w-8 h-[1.5px] bg-amber-400/90 mb-2.5" data-parallax="1.2" data-mouse-depth="0.6"></div>

              <h3 class="font-magnify-thin text-2xl sm:text-3xl xl:text-[34px] tracking-[0.11em] uppercase text-white leading-[1.15] mb-2.5 whitespace-nowrap" data-parallax="1.32" data-mouse-depth="1.2">
                Solder, Wrench<br/>&amp; Cut
              </h3>

              <p class="by-story-text text-zinc-300 !text-xs sm:!text-[13px] !leading-relaxed lg:text-right" data-parallax="1.08" data-mouse-depth="0.4">
                Whether troubleshooting and soldering damaged PCBs, wrenching on my motorcycle in the garage, or color-grading timelines in DaVinci Resolve—I’m happiest with a tool in hand.
              </p>
            </div>
          </div>

        </div>
      </div>

      <!-- ================= SPREAD 05 (FINAL PAGE): CHAPTER 05 (4 SEASONS × 4 DREAM COUNTRIES) ================= -->
      <div class="by-spread is-culled" id="by-season-spread">

        <!-- Flattened Seasonal Backgrounds -->
        <div class="ch1-bg-stage" aria-hidden="true">
          <div class="ch5-season-bg-pane is-active" data-season-bg="0" data-parallax="0.55" data-mouse-depth="-0.45">
            ${bgImgTag('ch5-spring-bg.webp', 'ch5-bg-img')}
          </div>
          <div class="ch5-season-bg-pane" data-season-bg="1" data-parallax="0.55" data-mouse-depth="-0.45">
            ${bgImgTag('ch5-summer-bg.webp', 'ch5-bg-img')}
          </div>
          <div class="ch5-season-bg-pane" data-season-bg="2" data-parallax="0.55" data-mouse-depth="-0.45">
            ${bgImgTag('ch5-autumn-bg.webp', 'ch5-bg-img')}
          </div>
          <div class="ch5-season-bg-pane" data-season-bg="3" data-parallax="0.55" data-mouse-depth="-0.45">
            ${bgImgTag('ch5-winter-bg.webp', 'ch5-bg-img')}
          </div>
        </div>

        <div class="w-full max-w-[1400px] mx-auto flex flex-col justify-between gap-4 relative z-10 my-auto">

          <!-- 1. TOP-CENTER MASTER HEADER -->
          <div class="flex flex-col items-center text-center -mt-3">
            <span class="by-kicker !mb-1.5" style="color: var(--season-accent);" data-parallax="1.15" data-mouse-depth="0.5">
              CHAPTER 05 &nbsp;•&nbsp; DREAM ATLAS
            </span>
            <div class="w-9 h-[1.5px] mb-3 transition-colors duration-300" style="background-color: var(--season-accent);" data-parallax="1.2" data-mouse-depth="0.6"></div>

            <h2 class="ch1-title-pop text-2xl sm:text-3xl xl:text-[36px] tracking-[0.14em] uppercase leading-[1.12] whitespace-nowrap mb-4" data-parallax="1.35" data-mouse-depth="1.3">
              Destinations By Season
            </h2>

            <div class="flex flex-nowrap items-center justify-center gap-2 z-30" id="by-season-tabs">
              <button type="button" class="by-season-tab is-active" data-season="0" style="--tab-accent: #c084fc;">
                <span>01</span><span>Spring</span>
              </button>
              <button type="button" class="by-season-tab" data-season="1" style="--tab-accent: #fbbf24;">
                <span>02</span><span>Summer</span>
              </button>
              <button type="button" class="by-season-tab" data-season="2" style="--tab-accent: #ea580c;">
                <span>03</span><span>Autumn</span>
              </button>
              <button type="button" class="by-season-tab" data-season="3" style="--tab-accent: #7dd3fc;">
                <span>04</span><span>Winter</span>
              </button>
            </div>
          </div>

          <!-- 2. LOWER 12-COLUMN STAGE -->
          <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            <!-- LEFT 4 COLUMNS -->
            <div class="lg:col-span-4 flex flex-col items-start text-left z-20">
              <div class="grid w-full">

                <!-- 01 SPRING COPY -->
                <div class="by-season-copy-pane is-active" data-season-copy="0">
                  <span class="by-kicker text-[#c084fc] !mb-1">05.1 &nbsp;•&nbsp; SPRING BLOSSOM</span>
                  <h3 class="font-magnify-thin text-2xl sm:text-3xl xl:text-[32px] tracking-[0.1em] uppercase text-white leading-tight whitespace-nowrap mb-3">
                    Awakening Latitudes
                  </h3>
                  <div class="by-country-list">
                    <div class="by-country-item">
                      <span class="by-country-tag">JAPAN &nbsp;•&nbsp; NEON &amp; MOUNT FUJI</span>
                      <p class="by-country-desc">I’ve always wanted to experience the contrast of Tokyo’s neon-lit tech culture and Shinkansen engineering against the cherry blossoms of Kyoto and Mount Fuji.</p>
                    </div>
                    <div class="by-country-item">
                      <span class="by-country-tag">CHINA &nbsp;•&nbsp; PILLARS IN THE MIST</span>
                      <p class="by-country-desc">To stand among the avatar-like floating quartz-sandstone peaks of Zhangjiajie and watch the morning mist drift down the Li River in Guilin.</p>
                    </div>
                    <div class="by-country-item">
                      <span class="by-country-tag">HIMACHAL &nbsp;•&nbsp; THE HIMALAYAN CALL</span>
                      <p class="by-country-desc">Nothing beats the call of the Himalayas—winding through the barren, high-altitude moonscapes of Spiti Valley and the mountain passes beyond Manali.</p>
                    </div>
                    <div class="by-country-item">
                      <span class="by-country-tag">SOCOTRA &nbsp;•&nbsp; DRAGON BLOOD &amp; DUNES</span>
                      <p class="by-country-desc">A landscape that looks like another planet—crimson Dragon’s Blood trees perched on limestone plateaus above untouched turquoise waters.</p>
                    </div>
                  </div>
                </div>

                <!-- 02 SUMMER COPY -->
                <div class="by-season-copy-pane" data-season-copy="1">
                  <span class="by-kicker text-[#fbbf24] !mb-1">05.2 &nbsp;•&nbsp; HIGH SUMMER</span>
                  <h3 class="font-magnify-thin text-2xl sm:text-3xl xl:text-[32px] tracking-[0.1em] uppercase text-white leading-tight whitespace-nowrap mb-3">
                    Midnight Sun
                  </h3>
                  <div class="by-country-list">
                    <div class="by-country-item">
                      <span class="by-country-tag">ALASKA &nbsp;•&nbsp; THE OUTDOOR BOYS TRAIL</span>
                      <p class="by-country-desc">Binge-watching the Outdoor Boys YouTube channel got me obsessed with Alaska’s raw wilderness, backcountry snow camps, and the scale of Denali.</p>
                    </div>
                    <div class="by-country-item">
                      <span class="by-country-tag">NORWAY &nbsp;•&nbsp; MIDNIGHT SUN &amp; CLIFFS</span>
                      <p class="by-country-desc">Built for the ultimate summer ride—twisting up the Trollstigen mountain pass, Lofoten’s jagged peaks, and fjords lit by the 24-hour midnight sun.</p>
                    </div>
                    <div class="by-country-item">
                      <span class="by-country-tag">ICELAND &nbsp;•&nbsp; RAW EARTH</span>
                      <p class="by-country-desc">Where the Earth still feels newly formed—black basalt columns at Reynisfjara, roaring glacial waterfalls, and the endless open stretches of the Ring Road.</p>
                    </div>
                    <div class="by-country-item">
                      <span class="by-country-tag">SCOTLAND &nbsp;•&nbsp; ISLE OF SKYE &amp; LOCHS</span>
                      <p class="by-country-desc">Drawn to the dramatic, windswept cliffs of the Isle of Skye, the Glenfinnan Viaduct, and quiet highland roads wrapped in Atlantic fog.</p>
                    </div>
                  </div>
                </div>

                <!-- 03 AUTUMN COPY -->
                <div class="by-season-copy-pane" data-season-copy="2">
                  <span class="by-kicker text-[#ea580c] !mb-1">05.3 &nbsp;•&nbsp; AUTUMN EQUINOX</span>
                  <h3 class="font-magnify-thin text-2xl sm:text-3xl xl:text-[32px] tracking-[0.1em] uppercase text-white leading-tight whitespace-nowrap mb-3">
                    Golden Horizons
                  </h3>
                  <div class="by-country-list">
                    <div class="by-country-item">
                      <span class="by-country-tag">SWITZERLAND &nbsp;•&nbsp; THE ULTIMATE DREAM</span>
                      <p class="by-country-desc">Always at the very top of my list—riding scenic mountain trains past Lauterbrunnen’s 72 waterfalls and seeing the Matterhorn framed in autumn gold.</p>
                    </div>
                    <div class="by-country-item">
                      <span class="by-country-tag">FRANCE &nbsp;•&nbsp; SKYLINE TO GLACIERS</span>
                      <p class="by-country-desc">To see the Eiffel Tower light up the Paris skyline at dusk before heading south to the snow-covered alpine ridges of Chamonix and Mont Blanc.</p>
                    </div>
                    <div class="by-country-item">
                      <span class="by-country-tag">BALI &nbsp;•&nbsp; ISLAND SANCTUARY</span>
                      <p class="by-country-desc">Where volcanic ridges meet the ocean—watching the sun rise above the clouds from Mount Batur and unwinding among Ubud’s emerald rice terraces.</p>
                    </div>
                    <div class="by-country-item">
                      <span class="by-country-tag">NEW ZEALAND &nbsp;•&nbsp; SOUTHERN ALPS</span>
                      <p class="by-country-desc">Watching BoomBaangh explore New Zealand put it straight on my radar—from the fjords of Milford Sound to the alpine passes around Queenstown and Mount Cook.</p>
                    </div>
                  </div>
                </div>

                <!-- 04 WINTER COPY -->
                <div class="by-season-copy-pane" data-season-copy="3">
                  <span class="by-kicker text-[#7dd3fc] !mb-1">05.4 &nbsp;•&nbsp; WINTER ESCAPES</span>
                  <h3 class="font-magnify-thin text-2xl sm:text-3xl xl:text-[32px] tracking-[0.1em] uppercase text-white leading-tight whitespace-nowrap mb-2.5">
                    Aurora &amp; Tropics
                  </h3>
                  <div class="by-country-list">
                    <div class="by-country-item">
                      <span class="by-country-tag">LAPLAND, FINLAND &nbsp;•&nbsp; 10TH-GRADE DREAM</span>
                      <p class="by-country-desc">Ever since my 10th-grade physics sir explained how solar winds spark the Aurora, I’ve dreamed of standing under the Arctic sky in Lapland—the official home of Santa.</p>
                    </div>
                    <div class="by-country-item">
                      <span class="by-country-tag">MALDIVES &nbsp;•&nbsp; OCEAN HORIZONS</span>
                      <p class="by-country-desc">The ultimate warm-winter escape—endless turquoise lagoons, coral reefs, and night beaches glowing blue with bioluminescent waves.</p>
                    </div>
                    <div class="by-country-item">
                      <span class="by-country-tag">COSTA RICA &nbsp;•&nbsp; PACIFIC WILD</span>
                      <p class="by-country-desc">A raw blend of Pacific surf, misty canopy bridges in Monteverde, and the perfect volcanic cone of Arenal rising above the rainforest.</p>
                    </div>
                    <div class="by-country-item">
                      <span class="by-country-tag">ANDAMAN &nbsp;•&nbsp; EMERALD ARCHIPELAGO</span>
                      <p class="by-country-desc">Closer to home yet worlds away—white-sand sunsets at Radhanagar Beach on Havelock Island and crystal-clear waters fringed by dense jungle.</p>
                    </div>
                  </div>

                  <div class="w-full max-w-[380px] flex justify-end mt-2.5 mb-2 pr-2 select-none pointer-events-none">
                    <svg class="w-32 h-auto overflow-visible drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]" viewBox="0 0 430 75" fill="none">
                      <path stroke="#8b5cf6" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" d="${SIGNATURE_PATHS.rahul}" />
                      <path stroke="#8b5cf6" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" d="${SIGNATURE_PATHS.venu}" />
                    </svg>
                  </div>

                  <div class="w-full max-w-[380px] pt-3 mt-0.5 border-t border-white/10 flex items-center">
                    <button type="button" id="by-rewind-btn" class="by-hud-btn">&larr; Rewind Reel</button>
                  </div>
                </div>

              </div>
            </div>

            <!-- RIGHT 8 COLUMNS: 16 Country Frames × 3 Synchronized Sliding Images Each -->
            <div class="lg:col-span-8 lg:pl-4 grid relative min-h-[470px] sm:min-h-[510px] items-center" id="by-season-galleries">

              <!-- 01 SPRING -->
              <div class="by-season-gallery-pane is-active grid grid-cols-12 gap-5 items-center" data-season-gallery="0">
                <div class="col-span-6 flex flex-col gap-5 items-end -mt-3">
                  <div class="w-full max-w-[285px] mr-4 anim-spring" style="--stagger: 0s;">
                    ${seasonTrioFrame('SPRING 01', 'spring-1', 'Japan', '0s')}
                  </div>
                  <div class="w-full max-w-[360px] anim-spring" style="--stagger: 0.14s;">
                    ${seasonTrioFrame('SPRING 03', 'spring-3', 'Himachal Pradesh, India', '0.24s')}
                  </div>
                </div>

                <div class="col-span-6 flex flex-col gap-5 items-start mt-4">
                  <div class="w-full max-w-[280px] ml-4 anim-spring" style="--stagger: 0.07s;">
                    ${seasonTrioFrame('SPRING 02', 'spring-2', 'China', '0.12s')}
                  </div>
                  <div class="w-full max-w-[375px] anim-spring" style="--stagger: 0.21s;">
                    ${seasonTrioFrame('SPRING 04', 'spring-4', 'Socotra, Yemen', '0.36s')}
                  </div>
                </div>
              </div>

              <!-- 02 SUMMER -->
              <div class="by-season-gallery-pane grid grid-cols-12 gap-5 items-center" data-season-gallery="1">
                <div class="col-span-7 flex justify-end anim-summer" style="--stagger: 0s;">
                  <div class="w-full max-w-[395px]">
                    ${seasonTrioFrame('SUMMER 01', 'summer-1', 'Alaska', '0s')}
                  </div>
                </div>
                <div class="col-span-5 flex justify-start mt-6 anim-summer" style="--stagger: 0.09s;">
                  <div class="w-full max-w-[275px]">
                    ${seasonTrioFrame('SUMMER 02', 'summer-2', 'Norway', '0.12s')}
                  </div>
                </div>

                <div class="col-span-5 flex justify-end -mt-4 anim-summer" style="--stagger: 0.23s;">
                  <div class="w-full max-w-[275px]">
                    ${seasonTrioFrame('SUMMER 04', 'summer-4', 'Scotland', '0.36s')}
                  </div>
                </div>
                <div class="col-span-7 flex justify-start anim-summer" style="--stagger: 0.16s;">
                  <div class="w-full max-w-[385px]">
                    ${seasonTrioFrame('SUMMER 03', 'summer-3', 'Iceland', '0.24s')}
                  </div>
                </div>
              </div>

              <!-- 03 AUTUMN -->
              <div class="by-season-gallery-pane grid grid-cols-12 gap-5 items-center" data-season-gallery="2">
                <div class="col-span-12 lg:col-span-7 flex flex-col items-end justify-center anim-autumn" style="--stagger: 0s;">
                  <div class="ch2-main-frame w-full max-w-[485px]">
                    ${seasonTrioFrame('ULTIMATE DREAM', 'autumn-1', 'Switzerland', '0s')}
                  </div>
                </div>

                <div class="col-span-12 lg:col-span-5 flex flex-col gap-3.5 items-start justify-center">
                  <div class="w-full max-w-[245px] anim-autumn" style="--stagger: 0.08s;">
                    ${seasonTrioFrame('AUTUMN 02', 'autumn-2', 'France', '0.12s')}
                  </div>
                  <div class="w-full max-w-[245px] ml-5 anim-autumn" style="--stagger: 0.16s;">
                    ${seasonTrioFrame('AUTUMN 03', 'autumn-3', 'Bali', '0.24s')}
                  </div>
                  <div class="w-full max-w-[245px] anim-autumn" style="--stagger: 0.24s;">
                    ${seasonTrioFrame('AUTUMN 04', 'autumn-4', 'New Zealand', '0.36s')}
                  </div>
                </div>
              </div>

              <!-- 04 WINTER -->
              <div class="by-season-gallery-pane grid grid-cols-12 gap-4 items-center" data-season-gallery="3">
                <div class="col-span-12 flex justify-center anim-winter" style="--stagger: 0s;">
                  <div class="w-full max-w-[425px]">
                    ${seasonTrioFrame('WINTER 01', 'winter-1', 'Lapland, Finland', '0s')}
                  </div>
                </div>

                <div class="col-span-4 anim-winter" style="--stagger: 0.09s;">
                  ${seasonTrioFrame('WINTER 02', 'winter-2', 'Maldives', '0.12s')}
                </div>
                <div class="col-span-4 mt-3 anim-winter" style="--stagger: 0.16s;">
                  ${seasonTrioFrame('WINTER 04', 'winter-4', 'Andaman & Nicobar', '0.24s')}
                </div>
                <div class="col-span-4 anim-winter" style="--stagger: 0.23s;">
                  ${seasonTrioFrame('WINTER 03', 'winter-3', 'Costa Rica', '0.36s')}
                </div>
              </div>

            </div>

          </div>
        </div>

        <span class="font-magnify-light text-[10.5px] tracking-[0.24em] uppercase text-zinc-300/90 absolute bottom-10 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap pointer-events-none" id="by-season-step-hint">
          SEASON 01 / 04 &nbsp;•&nbsp; SCROLL FOR NEXT SEASON
        </span>

        <div class="absolute bottom-8 right-8 sm:right-14 z-30 flex items-center">
          <a href="#contact" id="by-contact-jump" class="by-enter-btn !py-2.5 !px-5 !text-[10px]">
            <span>Proceed to Contact &darr;</span>
          </a>
        </div>

      </div>

    </div>

    <div class="by-progress-track">
      <div class="by-progress-fill" id="by-progress-fill"></div>
    </div>
  `;

  // =========================================================================
  // 3. PREDICTIVE 2-PHASE PRE-WARMING ENGINE (BEFORE PORTAL BUTTON CLICK)
  // =========================================================================
  const track = document.getElementById('by-track');
  const progEl = document.getElementById('by-progress-fill');
  const spreadEls = Array.from(overlay.querySelectorAll('.by-spread'));

  const scheduleIdle =
    window.requestIdleCallback ||
    ((cb) => setTimeout(() => cb({ timeRemaining: () => 15 }), 150));

  function hydrateAndDecodeImg(img) {
    if (!img) return Promise.resolve();
    if (img.dataset.hydrated === '1') {
      return img._decodePromise || Promise.resolve();
    }
    img.dataset.hydrated = '1';

    const primaryUrl = img.dataset.src;
    const fallbackUrl = img.dataset.fallback;
    if (!primaryUrl) return Promise.resolve();

    img._decodePromise = new Promise((resolve) => {
      const finalize = () => {
        if (typeof img.decode === 'function') {
          img
            .decode()
            .catch(() => {})
            .finally(() => {
              img.classList.add('is-loaded');
              resolve();
            });
        } else {
          img.classList.add('is-loaded');
          resolve();
        }
      };

      img.onload = finalize;
      img.onerror = () => {
        if (fallbackUrl && img.src !== fallbackUrl && !img.dataset.triedFallback) {
          img.dataset.triedFallback = '1';
          img.src = fallbackUrl;
        } else {
          img.remove();
          resolve();
        }
      };

      img.src = primaryUrl;
    });

    return img._decodePromise;
  }

  function hydrateContainerImages(container) {
    if (!container) return Promise.resolve();
    const imgs = Array.from(container.querySelectorAll('img[data-src]'));
    return Promise.all(imgs.map(hydrateAndDecodeImg));
  }

  function hydrateSpread(idx) {
    const spread = spreadEls[idx];
    if (!spread) return Promise.resolve();
    return hydrateContainerImages(spread);
  }

  function hydrateSeasonAssets(sIdx) {
    const bgPane = overlay.querySelector(`.ch5-season-bg-pane[data-season-bg="${sIdx}"]`);
    const galleryPane = overlay.querySelector(`.by-season-gallery-pane[data-season-gallery="${sIdx}"]`);
    return Promise.all([hydrateContainerImages(bgPane), hydrateContainerImages(galleryPane)]);
  }

  // Staggered background queue for Spreads 03, 04, and 05 (4 images per idle slice)
  let phase2Started = false;
  function startPhase2IdleQueue() {
    if (phase2Started) return;
    phase2Started = true;

    const remainingSpreads = [spreadEls[2], spreadEls[3], spreadEls[4]].filter(Boolean);
    const pendingImages = [];
    remainingSpreads.forEach((sp) => {
      sp.querySelectorAll('img[data-src]').forEach((img) => {
        if (img.dataset.hydrated !== '1') pendingImages.push(img);
      });
    });

    const BATCH_SIZE = 4;
    function processNextBatch() {
      if (!pendingImages.length) return;
      const batch = pendingImages.splice(0, BATCH_SIZE);
      Promise.all(batch.map(hydrateAndDecodeImg)).finally(() => {
        if (pendingImages.length) {
          setTimeout(() => scheduleIdle(processNextBatch), 150);
        }
      });
    }

    scheduleIdle(processNextBatch);
  }

  let prewarmStarted = false;
  function startPredictivePrewarm() {
    if (prewarmStarted) return;
    prewarmStarted = true;

    // Phase 1: Immediately decode Spreads 01 & 02 + initialize & compile 3D Leica M3
    ensureLeicaLoaded();
    Promise.all([hydrateSpread(0), hydrateSpread(1)]).then(() => {
      // Phase 2: Sequentially warm Spreads 03, 04, and 05 during browser idle periods
      startPhase2IdleQueue();
    });
  }

  // Trigger Phase 1 as soon as user scrolls past #certifications toward #beyond
  const beyondSection = document.getElementById('beyond');
  if (beyondSection && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startPredictivePrewarm();
          io.disconnect();
        }
      },
      { rootMargin: '350px 0px' }
    );
    io.observe(beyondSection);
  }

  // =========================================================================
  // 4. ENHANCED PARALLAX CONTROLLER & DYNAMIC GPU CULLING
  // =========================================================================
  const spreadCache = spreadEls.map((spread) => ({
    spread,
    parallaxEls: Array.from(spread.querySelectorAll('[data-parallax]')).map((el) => ({
      el,
      speed: parseFloat(el.dataset.parallax || '1'),
      mouseDepth: parseFloat(el.dataset.mouseDepth || (parseFloat(el.dataset.parallax || '1') - 1) * 2.5),
      isVert: el.classList.contains('by-vert-giant')
    })),
    innerPanEls: Array.from(spread.querySelectorAll('[data-inner-pan]'))
  }));

  const totalSpreads = spreadCache.length;
  const photoGalleriesWrap = document.getElementById('by-photo-galleries');
  const seasonGalleriesWrap = document.getElementById('by-season-galleries');

  let currentIdx = 0;
  let targetX = 0;
  let currentX = 0;
  let liftY = 0;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let isOpen = false;
  let rafId = null;

  overlay.addEventListener(
    'pointermove',
    (e) => {
      if (!isOpen) return;

      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      const tilt = `perspective(1100px) rotateY(${(targetMouseX * 4).toFixed(2)}deg) rotateX(${(-targetMouseY * 4).toFixed(2)}deg)`;

      if (currentIdx === 2 && photoGalleriesWrap) {
        photoGalleriesWrap.style.transform = tilt;
      } else if (currentIdx === totalSpreads - 1 && seasonGalleriesWrap) {
        seasonGalleriesWrap.style.transform = tilt;
      }
    },
    { passive: true }
  );

  function setSlide(idx) {
    currentIdx = Math.max(0, Math.min(totalSpreads - 1, idx));
    targetX = -currentIdx * window.innerWidth;
    if (progEl) progEl.style.width = `${((currentIdx + 1) / totalSpreads) * 100}%`;

    // Toggle GPU layer promotion on current/neighbor spreads and cull distant spreads
    spreadEls.forEach((s, i) => {
      const dist = Math.abs(i - currentIdx);
      s.classList.toggle('is-current', dist === 0);
      s.classList.toggle('is-neighbor', dist === 1);
      s.classList.toggle('is-culled', dist > 1);
    });

    // Ensure current and next spread are hydrated if user navigated rapidly
    if (currentIdx === totalSpreads - 1) {
      hydrateSeasonAssets(currentSeason);
    } else {
      hydrateSpread(currentIdx);
    }
    if (currentIdx + 1 < totalSpreads) {
      hydrateSpread(currentIdx + 1);
    }

    syncSeasonTrioLifecycle();
  }

  function tickParallax() {
    if (!isOpen) return;

    const prevX = currentX;
    currentX += (targetX - currentX) * 0.075;
    const velX = currentX - prevX;

    liftY += (0 - liftY) * 0.085;
    mouseX += (targetMouseX - mouseX) * 0.06;
    mouseY += (targetMouseY - mouseY) * 0.06;

    track.style.transform = `translate3d(${currentX.toFixed(1)}px, ${liftY.toFixed(1)}px, 0)`;

    const vw = window.innerWidth;

    for (let i = Math.max(0, currentIdx - 1); i <= Math.min(totalSpreads - 1, currentIdx + 1); i++) {
      const item = spreadCache[i];
      const spreadCenterOffset = currentX + i * vw;
      const norm = spreadCenterOffset / vw;

      for (let j = 0; j < item.parallaxEls.length; j++) {
        const p = item.parallaxEls[j];
        const scrollShiftX = spreadCenterOffset * (p.speed - 1) * 0.85;
        const velocityLagX = -velX * (p.speed - 1) * 1.6;
        const floatX = mouseX * 14 * p.mouseDepth;
        const floatY = mouseY * 10 * p.mouseDepth + liftY * (p.speed * 0.6);

        const totalX = scrollShiftX + velocityLagX + floatX;

        if (p.isVert) {
          p.el.style.transform = `rotate(180deg) translate3d(${(-floatY).toFixed(1)}px, ${totalX.toFixed(1)}px, 0)`;
        } else {
          p.el.style.transform = `translate3d(${totalX.toFixed(1)}px, ${floatY.toFixed(1)}px, 0)`;
        }
      }

      const panX = Math.max(-11, Math.min(11, -norm * 10 - mouseX * 2.5)).toFixed(2);
      const panY = (liftY * 0.1 - mouseY * 2).toFixed(2);
      for (let k = 0; k < item.innerPanEls.length; k++) {
        item.innerPanEls[k].style.transform = `translate3d(${panX}%, ${panY}%, 0)`;
      }
    }

    // Render 3D Leica M3 on Spread 03 (Desktop: idx 2 | Mobile/Tablet: centered at x = 0)
    const isMob = window.innerWidth < 1024;
    const isMovingBetweenSpreads = Math.abs(targetX - currentX) > 0.5;
    if (
      leicaRenderer &&
      leicaGroup &&
      (isMob || currentIdx === 2 || (Math.abs(currentIdx - 2) === 1 && isMovingBetweenSpreads))
    ) {
      leicaState.currRotY += (leicaState.targetRotY - leicaState.currRotY) * 0.075;

      // Mobile/Tablet (< 1024px): Centered at X = 0, Y = 0 | Desktop: X = -1.92, Y = -0.18
      leicaGroup.position.x = (isMob ? 0 : -1.92) + mouseX * 0.1;
      leicaGroup.position.y = (isMob ? 0 : -0.18) - mouseY * 0.08;
      leicaGroup.rotation.y = leicaState.currRotY + mouseX * 0.18;
      leicaGroup.rotation.x = mouseY * 0.1;
      leicaGroup.rotation.z = 0;

      leicaRenderer.render(leicaScene, leicaCamera);
    }

    rafId = requestAnimationFrame(tickParallax);
  }

  // Zero-work click transition: Phase 1 already pre-warmed Spreads 01 & 02 in GPU memory
  function openDimension() {
    if (isOpen) return;
    isOpen = true;

    // 1. Reset everything to the very beginning (Chapter 01, Photo Mode 01, Season 01 Spring)
    currentIdx = 0;
    targetX = 0;
    currentX = 0;
    overlay.scrollTop = 0; // Resets vertical scroll to top on Mobile/Tablet (< 1024px)

    if (typeof setPhotoMode === 'function') setPhotoMode(0);
    if (typeof setSeason === 'function') setSeason(0);

    document.body.classList.add('beyond-lifting');
    document.documentElement.style.overflow = 'hidden';

    setTimeout(() => {
      liftY = 42;
      document.body.classList.add('beyond-world-open');
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      setSlide(0);
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tickParallax);
    }, 320);
  }

  function closeDimension() {
    isOpen = false;
    stopSeasonTrioTimers();
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('beyond-world-open');

    // Reset state after the 220ms exit fade finishes so next open is already at Chapter 01
    setTimeout(() => {
      document.body.classList.remove('beyond-lifting');
      document.documentElement.style.overflow = '';
      cancelAnimationFrame(rafId);

      currentIdx = 0;
      targetX = 0;
      currentX = 0;
      overlay.scrollTop = 0;
      if (typeof setPhotoMode === 'function') setPhotoMode(0);
      if (typeof setSeason === 'function') setSeason(0);
      setSlide(0);
    }, 220);
  }

  // ================= CHAPTER 03: PHOTOGRAPHY 2-MODE + 3D LEICA M3 CONTROLLER =================
  const photoSpread = document.getElementById('by-photo-spread');
  const photoTabs = Array.from(overlay.querySelectorAll('.by-photo-tab'));
  const photoCopies = Array.from(overlay.querySelectorAll('.by-photo-copy-pane'));
  const photoGalleries = Array.from(overlay.querySelectorAll('.by-photo-gallery-pane'));
  const photoHint = document.getElementById('by-photo-step-hint');
  const PHOTO_ACCENTS = ['#38bdf8', '#a855f7'];
  let currentPhotoMode = 0;

  const leicaState = {
    currRotY: 0,
    targetRotY: 0
  };

  function setPhotoMode(mIdx) {
    currentPhotoMode = Math.max(0, Math.min(1, mIdx));
    if (photoSpread) {
      photoSpread.style.setProperty('--season-accent', PHOTO_ACCENTS[currentPhotoMode]);
      photoSpread.classList.toggle('is-mode-1', currentPhotoMode === 1);
    }

    photoTabs.forEach((t, i) => t.classList.toggle('is-active', i === currentPhotoMode));
    photoCopies.forEach((c) => {
      const paneIdx = parseInt(c.dataset.photoCopy || '0', 10);
      c.classList.toggle('is-active', paneIdx === currentPhotoMode);
    });
    photoGalleries.forEach((g, i) => g.classList.toggle('is-active', i === currentPhotoMode));

    leicaState.targetRotY = currentPhotoMode === 0 ? 0 : Math.PI;

    if (photoHint) {
      photoHint.textContent =
        currentPhotoMode === 0
          ? 'VIEW 01 / 02  •  LENS VIEW (SCROLL FOR VIEWFINDER & PORTRAITS)'
          : 'VIEW 02 / 02  •  VIEWFINDER VIEW (FAVORITE PORTRAITS OF ME)';
    }
  }

  photoTabs.forEach((tab) => {
    const mIdx = parseInt(tab.dataset.photoMode || '0', 10);
    tab.addEventListener('click', () => setPhotoMode(mIdx));
    tab.addEventListener('mouseenter', () => setPhotoMode(mIdx));
  });

  // --- Predictive 3D Leica M3 WebGL Scene (Pre-compiled Shaders + VRAM Cleanup) ---
  const leicaCanvas = document.getElementById('ch3-leica-canvas');
  let leicaGroup = null;
  let leicaRenderer = null;
  let leicaScene = null;
  let leicaCamera = null;
  let leicaInitialized = false;

  function ensureLeicaLoaded() {
    if (leicaInitialized || !leicaCanvas) return;
    leicaInitialized = true;

    leicaScene = new THREE.Scene();
    leicaCamera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
    leicaCamera.position.set(0, 0, 6.2);

    leicaRenderer = new THREE.WebGLRenderer({
      canvas: leicaCanvas,
      alpha: true,
      antialias: true,
      logarithmicDepthBuffer: true
    });
    leicaRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    leicaRenderer.setSize(window.innerWidth, window.innerHeight);
    leicaRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    leicaRenderer.toneMappingExposure = 1.2;

    const pmremGenerator = new THREE.PMREMGenerator(leicaRenderer);
    const roomEnv = new RoomEnvironment();
    leicaScene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    // Immediately free temporary PMREM render targets & environment geometry from VRAM
    pmremGenerator.dispose();
    roomEnv.dispose?.();

    const ambLight = new THREE.AmbientLight(0xffffff, 1.5);
    const frontKeyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    frontKeyLight.position.set(2, 3, 6);
    leicaScene.add(ambLight, frontKeyLight);

    leicaGroup = new THREE.Group();
    leicaScene.add(leicaGroup);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const localGlb = 'assets/models/camera-leica-m3.glb';
    const onModelLoaded = (gltf) => {
      const model = gltf.scene;
      const maxAnisotropy = leicaRenderer.capabilities.getMaxAnisotropy();

      model.traverse((child) => {
        if (!child.isMesh || !child.material) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          if (mat.map) mat.map.anisotropy = maxAnisotropy;
          if (('transmission' in mat && mat.transmission > 0) || mat.opacity < 0.95) {
            mat.transmission = 0;
            mat.transparent = true;
            mat.opacity = 0.22;
            mat.roughness = 0.04;
            mat.metalness = 0.1;
            mat.color.setHex(0x0a0d14);
            mat.depthWrite = false;
            mat.needsUpdate = true;
          }
        });
      });

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = 2.5 / maxDim;

      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));

      leicaGroup.add(model);
      leicaGroup.position.set(-1.92, -0.18, 0);

      // Pre-compile WebGL shaders and render one warm-up frame before user reaches Chapter 03
      leicaRenderer.compile(leicaScene, leicaCamera);
      leicaRenderer.render(leicaScene, leicaCamera);
      dracoLoader.dispose();
    };

    gltfLoader.load(
      assetUrl(localGlb),
      onModelLoaded,
      undefined,
      () => {
        if (assetUrl(localGlb) !== localGlb) {
          gltfLoader.load(localGlb, onModelLoaded, undefined, () => {
            dracoLoader.dispose();
          });
        } else {
          dracoLoader.dispose();
        }
      }
    );
  }

  // ================= CHAPTER 05: 4-SEASON CONTROLLER =================
  const seasonSpread = document.getElementById('by-season-spread');
  const seasonTabs = Array.from(overlay.querySelectorAll('.by-season-tab'));
  const seasonCopies = Array.from(overlay.querySelectorAll('.by-season-copy-pane'));
  const seasonGalleries = Array.from(overlay.querySelectorAll('.by-season-gallery-pane'));
  const seasonBgs = Array.from(overlay.querySelectorAll('.ch5-season-bg-pane'));
  const seasonHint = document.getElementById('by-season-step-hint');
  const SEASON_ACCENTS = ['#c084fc', '#fbbf24', '#ea580c', '#7dd3fc'];
  let currentSeason = 0;
  let trioStep = 0;
  let trioFirstDelayTimer = null;
  let trioCycleInterval = null;

  function stopSeasonTrioTimers() {
    if (trioFirstDelayTimer) {
      clearTimeout(trioFirstDelayTimer);
      trioFirstDelayTimer = null;
    }
    if (trioCycleInterval) {
      clearInterval(trioCycleInterval);
      trioCycleInterval = null;
    }
  }

  function resetGalleryToFirstImage(galleryEl) {
    if (!galleryEl) return;
    galleryEl.querySelectorAll('.by-trio-frame').forEach((frame) => {
      const slides = Array.from(frame.querySelectorAll('.by-trio-slide'));
      const dots = Array.from(frame.querySelectorAll('.by-trio-dot'));
      slides.forEach((s, idx) => {
        s.classList.toggle('is-active-slide', idx === 0);
        s.classList.remove('is-Loaded-prev');
      });
      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === 0));
    });
  }

  // Advance ONLY the currently active season's 4 frames to the next image
  function advanceActiveSeasonSlides() {
    if (!isOpen || (window.innerWidth >= 1024 && currentIdx !== totalSpreads - 1)) {
      stopSeasonTrioTimers();
      return;
    }

    trioStep = (trioStep + 1) % 3;
    const activeGallery = seasonGalleries[currentSeason];
    if (!activeGallery) return;

    activeGallery.querySelectorAll('.by-trio-frame').forEach((frame) => {
      // Ensure any 2nd/3rd slide that still has data-src or already finished loading gets .is-loaded!
      frame.querySelectorAll('.by-trio-slide').forEach((img) => {
        const lazy = img.dataset.src || img.getAttribute('data-src');
        if (lazy && !img.getAttribute('src')) {
          img.src = lazy;
          img.removeAttribute('data-src');
        }
        if (img.complete && img.naturalWidth > 0) {
          img.classList.add('is-loaded');
        }
      });

      const loadedSlides = Array.from(frame.querySelectorAll('.by-trio-slide.is-loaded'));
      const dots = Array.from(frame.querySelectorAll('.by-trio-dot'));

      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === trioStep));

      if (loadedSlides.length < 2) return;
      const targetSlide = loadedSlides[trioStep % loadedSlides.length];

      loadedSlides.forEach((s) => {
        if (s === targetSlide) {
          s.classList.remove('is-Loaded-prev');
          s.classList.add('is-active-slide');
        } else if (s.classList.contains('is-active-slide')) {
          s.classList.remove('is-active-slide');
          s.classList.add('is-Loaded-prev');
        } else {
          s.classList.remove('is-Loaded-prev');
        }
      });
    });
  }

  // Start fresh on 1st image -> Wait 4.2s -> Then cycle every 3.0s
  function syncSeasonTrioLifecycle() {
    stopSeasonTrioTimers();
    trioStep = 0;

    seasonGalleries.forEach((g) => resetGalleryToFirstImage(g));

    // Pre-hydrate all 3 slides (a, b, c) of the active season now so they are 100% loaded before the 4.2s timer fires!
    const activeGallery = seasonGalleries[currentSeason];
    if (activeGallery) {
      activeGallery.querySelectorAll('.by-trio-slide').forEach((img) => {
        const lazy = img.dataset.src || img.getAttribute('data-src');
        if (lazy && !img.getAttribute('src')) {
          img.src = lazy;
          img.removeAttribute('data-src');
        }
        if (img.complete && img.naturalWidth > 0) {
          img.classList.add('is-loaded');
        } else {
          img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
        }
      });
    }

    // Allow starting on Desktop when on Chapter 05 (currentIdx === totalSpreads - 1) OR on Mobile (< 1024px)
    if (!isOpen || (window.innerWidth >= 1024 && currentIdx !== totalSpreads - 1)) return;

    trioFirstDelayTimer = setTimeout(() => {
      advanceActiveSeasonSlides();
      trioCycleInterval = setInterval(advanceActiveSeasonSlides, 3000);
    }, 4200);
  }

  function setSeason(sIdx) {
    currentSeason = Math.max(0, Math.min(3, sIdx));
    hydrateSeasonAssets(currentSeason);

    if (seasonSpread) {
      seasonSpread.style.setProperty('--season-accent', SEASON_ACCENTS[currentSeason]);
    }
    seasonTabs.forEach((t, i) => t.classList.toggle('is-active', i === currentSeason));
    seasonCopies.forEach((c, i) => c.classList.toggle('is-active', i === currentSeason));
    seasonGalleries.forEach((g, i) => g.classList.toggle('is-active', i === currentSeason));
    seasonBgs.forEach((b, i) => b.classList.toggle('is-active', i === currentSeason));

    if (seasonHint) {
      seasonHint.textContent =
        currentSeason < 3
          ? `SEASON 0${currentSeason + 1} / 04  •  SCROLL FOR NEXT SEASON`
          : `SEASON 04 / 04  •  END OF REEL`;
    }

    syncSeasonTrioLifecycle();
  }

  seasonTabs.forEach((tab) => {
    const sIdx = parseInt(tab.dataset.season || '0', 10);
    tab.addEventListener('click', () => setSeason(sIdx));
    tab.addEventListener('mouseenter', () => setSeason(sIdx));
  });

  // Global Listeners
  window.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') closeDimension();
    if (e.key === 'ArrowRight') setSlide(currentIdx + 1);
    if (e.key === 'ArrowLeft') setSlide(currentIdx - 1);
  });

  document.getElementById('by-open-trigger')?.addEventListener('click', openDimension);
  document.getElementById('by-close-btn')?.addEventListener('click', closeDimension);
  document.getElementById('by-rewind-btn')?.addEventListener('click', () => {
    setPhotoMode(0);
    setSeason(0);
    setSlide(0);
  });
  document.getElementById('by-contact-jump')?.addEventListener('click', () => {
    closeDimension();
  });

  let wheelLock = false;
  overlay.addEventListener(
    'wheel',
    (e) => {
      if (!isOpen) return;
      e.preventDefault();
      if (wheelLock) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 18) return;

      wheelLock = true;
      const onPhotoSpread = currentIdx === 2;
      const onLastSpread = currentIdx === totalSpreads - 1;

      if (delta > 0) {
        if (onPhotoSpread && currentPhotoMode < 1) {
          setPhotoMode(currentPhotoMode + 1);
        } else if (onLastSpread && currentSeason < 3) {
          setSeason(currentSeason + 1);
        } else {
          setSlide(currentIdx + 1);
        }
      } else {
        if (onPhotoSpread && currentPhotoMode > 0) {
          setPhotoMode(currentPhotoMode - 1);
        } else if (onLastSpread && currentSeason > 0) {
          setSeason(currentSeason - 1);
        } else {
          setSlide(currentIdx - 1);
        }
      }

      setTimeout(() => {
        wheelLock = false;
      }, 680);
    },
    { passive: false }
  );

  let dragging = false;
  let dragStartX = 0;
  track.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, a')) return;
    dragging = true;
    dragStartX = e.clientX;
    track.classList.add('is-dragging');
  });
  window.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('is-dragging');
    const diff = e.clientX - dragStartX;
    if (diff < -60) setSlide(currentIdx + 1);
    else if (diff > 60) setSlide(currentIdx - 1);
  });

  // Unified Resize Listener (Handles both Track TargetX and Leica 3D Camera)
  window.addEventListener(
    'resize',
    rafThrottle(() => {
      if (isOpen) targetX = -currentIdx * window.innerWidth;
      if (leicaRenderer && leicaCamera) {
        leicaCamera.aspect = window.innerWidth / window.innerHeight;
        leicaCamera.updateProjectionMatrix();
        leicaRenderer.setSize(window.innerWidth, window.innerHeight);
      }
    }),
    { passive: true }
  );
}