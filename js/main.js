import { initCursor } from './cursor.js';
import { initScrollAnimations } from './animations.js';
import { initChatbot } from './chatbot.js';
import { initBikeRun } from './bike-anim.js';
import { initNeuralCanvas } from './neural.js';
import { initLossVerification } from './verification.js';

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