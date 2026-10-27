import { initCursor } from './cursor.js';
import { initScrollAnimations } from './animations.js';
import { initChatbot } from './chatbot.js';
import { initBikeRun } from './bike-anim.js';
import { initNeuralCanvas } from './neural.js';
import { initLossVerification } from './verification.js';
import { initRotaryCounter } from './rotary.js'; 
import { initAvatar } from './avatar.js';
import { initSynapse } from './synapse.js';
import { initScrollbar } from './scrollbar.js';
import { initLogoAnim } from './logo-anim.js';
import { initPreloader } from './preloader.js';

// ================= NAME MORPH =================
function initBrandMorph() {
  const brandIdentity = document.getElementById('brand-identity');
  if (!brandIdentity) return;

  let isScrolled = false;
  const handleBrandScroll = () => {
    // Triggers packing into RV logo once scrolled past 50px
    const shouldScroll = window.scrollY > 50;
    if (shouldScroll !== isScrolled) {
      isScrolled = shouldScroll;
      brandIdentity.classList.toggle('is-scrolled', isScrolled);
    }
  };

  window.addEventListener('scroll', handleBrandScroll, { passive: true });
  handleBrandScroll(); // Initial check on load/refresh
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initCursor();
  initScrollAnimations();
  initChatbot();
  initNeuralCanvas();
  initBikeRun();
  initLossVerification();
  initRotaryCounter(); 
  initAvatar();
  initSynapse();
  initScrollbar();
  initLogoAnim();
  initPreloader();

  // ================= CLICK-TO-COPY EMAIL =================
  const emailCard = document.querySelector('a[href^="mailto:"]');
  emailCard?.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('rahulvenuklr@gmail.com');
    const p = emailCard.querySelector('p');
    if (p) {
      const originalText = p.textContent;
      p.textContent = 'Copied to Clipboard! ✓';
      p.classList.add('text-emerald-400');
      setTimeout(() => {
        p.textContent = originalText;
        p.classList.remove('text-emerald-400');
      }, 2000);
    }
  });
});