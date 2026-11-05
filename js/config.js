/* ================= GLOBAL CONFIGURATION, SUPABASE CDN & SHARED ASSETS (js/config.js) ================= */

/**
 * Public Supabase Storage bucket base URL
 * Project ID: cmofepqpzqkijftxafxl | Bucket: models
 */
export const SUPABASE_STORAGE_URL =
  'https://cmofepqpzqkijftxafxl.supabase.co/storage/v1/object/public/models';

/**
 * Maps local asset paths to the Supabase 'models' bucket structure:
 * - 'assets/models/camera-leica-m3.glb'    -> '.../models/3D/camera-leica-m3.glb'
 * - 'assets/images/beyond/ch1-left-1.webp' -> '.../models/images/beyond/ch1-left-1.webp'
 * - 'assets/images/section-bg/ch3-bg.webp' -> '.../models/images/section-bg/ch3-bg.webp'
 */
export function assetUrl(localPath = '') {
  if (!localPath) return '';
  const cleanPath = localPath.replace(/^\/+/, '');
  if (!SUPABASE_STORAGE_URL) return cleanPath;

  const base = SUPABASE_STORAGE_URL.replace(/\/+$/, '');

  // Route 3D models to the '3D/' folder in the bucket
  if (cleanPath.startsWith('assets/models/')) {
    return `${base}/${cleanPath.replace(/^assets\/models\//, '3D/')}`;
  }

  // Route gallery & background images to the 'images/' folder in the bucket
  if (cleanPath.startsWith('assets/images/')) {
    return `${base}/${cleanPath.replace(/^assets\/images\//, 'images/')}`;
  }

  return `${base}/${cleanPath}`;
}

/* ================= SHARED CURSIVE SIGNATURE VECTOR PATHS ================= */
export const SIGNATURE_PATHS = {
  rahul:
    'M 24 28 L 22 60 C 21 38, 30 14, 46 15 C 60 16, 56 38, 32 48 C 22 52, 16 52, 19 50 C 26 48, 40 58, 54 60 C 64 61, 78 52, 74 44 C 69 39, 57 47, 60 57 C 63 63, 72 56, 76 47 C 76 56, 82 61, 90 59 C 101 56, 107 34, 108 16 C 107 36, 106 54, 107 60 C 109 50, 117 44, 121 53 C 123 60, 134 61, 144 56 C 150 52, 152 46, 152 54 C 152 61, 163 61, 169 53 C 169 60, 178 61, 186 55 C 193 48, 196 28, 194 14 C 193 34, 195 56, 202 59 C 207 61, 214 57, 219 51',
  venu:
    'M 254 16 C 268 25, 278 44, 282 60 C 287 44, 300 26, 297 18 C 294 12, 284 26, 285 45 C 286 58, 299 60, 310 55 C 319 50, 322 42, 316 41 C 310 40, 308 52, 316 58 C 324 63, 335 56, 340 48 C 342 54, 342 60, 342 58 C 344 50, 353 44, 357 52 C 360 59, 368 60, 376 55 C 381 51, 383 46, 383 54 C 383 60, 393 60, 398 53 C 398 60, 408 60, 421 51'
};

/* ================= SHARED BRAND R & V VECTOR PATHS ================= */
export const BRAND_RV_PATHS = {
  rTop: 'M8 312 H385 V392 H8 Z',
  rBody: 'M68 508 H392 A35 35 0 0 1 392 578 H348 L483 733 H382 L250 578 H145 V733 H68 Z',
  vBody: 'M385 312 C415 312 436 326 452 350 L630 585 L718 458 H812 L630 720 L405 413 C397 402 388 392 368 392 L385 312 Z',
  vSlashPoints: '805,312 928,312 840,420 718,420'
};

/* ================= SHARED BADGE ICONS (BEYOND THE CODE) ================= */
export const BADGE_ICONS = {
  exif: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#38bdf8;"><circle cx="12" cy="12" r="10"/><line x1="14.31" y1="8" x2="20.05" y2="17.94"/><line x1="9.69" y1="8" x2="21.17" y2="8"/><line x1="7.38" y1="12" x2="13.12" y2="2.06"/><line x1="9.69" y1="16" x2="3.95" y2="6.06"/><line x1="14.31" y1="16" x2="2.83" y2="16"/><line x1="16.62" y1="12" x2="10.88" y2="21.94"/></svg>`,
  diy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#fb7185;"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
  mech: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#fbbf24;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  grade: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#c084fc;"><circle cx="12" cy="8" r="4"/><circle cx="8" cy="15" r="4"/><circle cx="16" cy="15" r="4"/></svg>`,
  tools: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#38bdf8;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  pcb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:#34d399;"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
  loc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
};

/* ================= SHARED UTILITIES ================= */
export function clearTimerList(timers) {
  if (!Array.isArray(timers)) return;
  while (timers.length) {
    clearTimeout(timers.pop());
  }
}

export function rafThrottle(fn) {
  let ticking = false;
  return (...args) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      fn(...args);
    });
  };
}