import { initCursor } from './cursor.js';
import { initScrollAnimations } from './animations.js';
import { initChatbot } from './chatbot.js';
import { initCloneRunner } from './bike-anim.js';
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
});