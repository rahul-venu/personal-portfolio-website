export function initLossVerification() {
  const track = document.getElementById('loss-track');
  const thumb = document.getElementById('loss-thumb');
  const fill = document.getElementById('loss-progress-fill');
  const trackText = document.getElementById('loss-track-text');
  const lossDisplay = document.getElementById('loss-display');
  const submitBtn = document.getElementById('contact-submit-btn');
  const btnText = document.getElementById('btn-text');
  const contactForm = document.getElementById('contact-form');

  if (!track || !thumb || !submitBtn) return;

  let isDragging = false;
  let isVerified = false;
  let startX = 0;
  let currentX = 0;
  let resetTimer = null; // 10-second auto-reset timer

  // Direct SVGs to guarantee icons appear without Lucide caching issues
  const SVG_LOCK = `<svg id="btn-icon" class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
  const SVG_SEND = `<svg id="btn-icon" class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
  const SVG_CHEVRONS = `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>`;
  const SVG_CHECK = `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

  function getMaxDistance() {
    return track.clientWidth - thumb.clientWidth - 8;
  }

  // --- Reset Function (Glides back and locks after 10s) ---
  function resetVerification() {
    isVerified = false;
    isDragging = false;
    currentX = 0;

    // Smooth glide back
    thumb.classList.add('transition-all');
    fill.classList.add('transition-all');
    thumb.style.transform = 'translateX(0px)';
    fill.style.width = '0px';

    // Reset loss display
    lossDisplay.textContent = 'Loss: 0.892';
    lossDisplay.className = 'text-amber-400 font-semibold transition-colors';

    // Reset track
    track.className = 'relative w-full h-12 rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden p-1 flex items-center cursor-pointer';
    if (trackText) {
      trackText.textContent = 'Slide to minimize loss →';
      trackText.className = 'absolute inset-0 flex items-center justify-center text-xs font-mono text-brand-muted/70 pointer-events-none transition-opacity';
      trackText.style.opacity = '1';
    }

    // Reset thumb puck
    thumb.className = 'relative z-10 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-black/60 cursor-grab active:cursor-grabbing touch-none transition-colors';
    thumb.innerHTML = SVG_CHEVRONS;

    // Lock Submit Button & Show Lock Icon
    submitBtn.disabled = true;
    submitBtn.className = 'w-full py-3.5 rounded-xl bg-purple-600 text-white font-semibold text-sm shadow-lg shadow-purple-600/20 opacity-40 cursor-not-allowed transition-all flex items-center justify-center gap-2';
    submitBtn.innerHTML = `<span id="btn-text">Send Message (Locked)</span> ${SVG_LOCK}`;
  }

  // --- Start Drag ---
  function onStart(clientX) {
    if (isVerified) return;
    isDragging = true;
    startX = clientX - currentX;
    thumb.classList.remove('transition-all');
    fill.classList.remove('transition-all');
  }

  // --- Move Drag ---
  function onMove(clientX) {
    if (!isDragging || isVerified) return;

    const maxDist = getMaxDistance();
    currentX = Math.max(0, Math.min(clientX - startX, maxDist));
    const progress = currentX / maxDist;

    thumb.style.transform = `translateX(${currentX}px)`;
    fill.style.width = `${currentX + thumb.clientWidth}px`;

    const currentLoss = (1 - progress) * 0.88 + 0.012;
    lossDisplay.textContent = `Loss: ${currentLoss.toFixed(3)}`;

    if (trackText) {
      trackText.style.opacity = `${1 - progress * 1.5}`;
    }

    if (progress >= 0.9) {
      triggerSuccess();
    }
  }

  // --- Release Drag ---
  function onEnd() {
    if (isVerified) return;
    isDragging = false;
    resetVerification();
  }

  // --- Success Handler ---
  function triggerSuccess() {
    isVerified = true;
    isDragging = false;

    const maxDist = getMaxDistance();
    currentX = maxDist;
    thumb.style.transform = `translateX(${maxDist}px)`;
    fill.style.width = '100%';

    // Visual updates
    lossDisplay.textContent = 'Loss: 0.009 (Converged)';
    lossDisplay.className = 'text-emerald-400 font-bold';

    track.className = 'relative w-full h-12 rounded-xl bg-emerald-950/20 border border-emerald-500/40 p-1 flex items-center';
    trackText.textContent = '✔ Model Converged • Human Verified';
    trackText.className = 'absolute inset-0 flex items-center justify-center text-xs font-mono font-semibold text-emerald-300 pointer-events-none';
    trackText.style.opacity = '1';

    // Show Checkmark on Thumb
    thumb.className = 'relative z-10 w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-950';
    thumb.innerHTML = SVG_CHECK;

    // UNLOCK BUTTON & DISPLAY FLIGHT/SEND ICON
    submitBtn.disabled = false;
    submitBtn.className = 'w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer';
    submitBtn.innerHTML = `<span id="btn-text">Send Message</span> ${SVG_SEND}`;

    // Auto-reset after 10 seconds if untouched
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      resetVerification();
    }, 10000);
  }

  // --- REAL EMAIL SUBMISSION VIA WEB3FORMS ---
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!isVerified) {
        alert('Please slide to minimize loss and verify before sending.');
        return;
      }

      if (resetTimer) clearTimeout(resetTimer);

      const btnTextEl = document.getElementById('btn-text');
      if (btnTextEl) btnTextEl.textContent = 'Sending Message...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          submitBtn.className = 'w-full py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-default';
          submitBtn.innerHTML = `<span>Message Sent Successfully! 🎉</span> ${SVG_CHECK}`;
          contactForm.reset();

          // Reset the slider after 5 seconds of success
          setTimeout(() => resetVerification(), 5000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        console.error(err);
        submitBtn.className = 'w-full py-3.5 rounded-xl bg-red-600 text-white font-semibold text-sm flex items-center justify-center gap-2';
        submitBtn.innerHTML = `<span>Failed to Send. Please Email Directly.</span>`;
        setTimeout(() => resetVerification(), 5000);
      }
    });
  }

  // Mouse Events
  thumb.addEventListener('mousedown', (e) => onStart(e.clientX));
  window.addEventListener('mousemove', (e) => onMove(e.clientX));
  window.addEventListener('mouseup', onEnd);

  // Touch Events (Mobile)
  thumb.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchend', onEnd);
}