/* ================= MAIN APPLICATION ENTRY POINT (js/main.js) =================
   - Bootstraps global UI modules, custom cursor, preloader, and canvas systems.
   - Automatically duplicates About running band pills to ensure seamless infinite looping.
*/

import { initCursor } from './cursor.js';
import { initScrollAnimations } from './animations.js';
import { initChatbot } from './chatbot.js';
import { initNeuralCanvas } from './neural.js';
import { initLossVerification } from './verification.js';
import { initRotaryCounter } from './rotary.js'; 
import { initAvatar } from './avatar.js';
import { initSynapse } from './synapse.js';
import { initScrollbar } from './scrollbar.js';
import { initLogoAnim } from './logo-anim.js';
import { initPreloader } from './preloader.js';
import { initSkillsCircuit } from './skills-circuit.js';
import { initBeyondWorld } from './beyond-world.js';
import { initBeyondMobile } from './beyond-mobile.js';

document.addEventListener('DOMContentLoaded', () => {
  // Clones About marquee pills for seamless CSS loop
  document.querySelectorAll('.about-marquee-track').forEach((track) => {
    Array.from(track.children).forEach((pill) => {
      const clone = pill.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initCursor();
  initScrollAnimations();
  initChatbot();
  initNeuralCanvas();
  initLossVerification();
  initRotaryCounter(); 
  initAvatar();
  initSynapse();
  initScrollbar();
  initLogoAnim();
  initPreloader();
  initSkillsCircuit();
  initBeyondWorld();
  initBeyondMobile();

  // Click-to-copy email helper
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