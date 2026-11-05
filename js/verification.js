/* ================= LOSS VERIFICATION SLIDER & CONTACT SUBMISSION (js/verification.js) =================
   - Simulates gradient descent loss minimization from 0.892 down to 0.009 (converged).
   - Uses Pointer Capture on the slider thumb to eliminate global window mouse listener leaks.
   - Positions elements via GPU-composited translate3d transforms.
   - Executes multi-tier validation: syntax schema, burner lists, and Google DNS-over-HTTPS MX verification.
   - Transmits submissions to Web3Forms with automatic timeout resets.
*/

export function initLossVerification() {
  const track = document.getElementById('loss-track');
  const thumb = document.getElementById('loss-thumb');
  const fill = document.getElementById('loss-progress-fill');
  const trackText = document.getElementById('loss-track-text');
  const lossDisplay = document.getElementById('loss-display');
  const submitBtn = document.getElementById('contact-submit-btn');
  const contactForm = document.getElementById('contact-form');

  if (!track || !thumb || !submitBtn) return;

  let isDragging = false;
  let isVerified = false;
  let startX = 0;
  let currentX = 0;
  let resetTimer = null;

  // Direct SVG templates for deterministic icon rendering
  const SVG_LOCK = `<svg id="btn-icon" class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
  const SVG_SEND = `<svg id="btn-icon" class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
  const SVG_CHEVRONS = `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>`;
  const SVG_CHECK = `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  const SVG_WARN = `<svg class="w-4 h-4 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  function getMaxDistance() {
    return track.clientWidth - thumb.clientWidth - 8;
  }

  // Resets slider to starting state and locks submission
  function resetVerification() {
    isVerified = false;
    isDragging = false;
    currentX = 0;

    thumb.classList.add('transition-all');
    fill.classList.add('transition-all');
    thumb.style.transform = 'translate3d(0px, 0, 0)';
    fill.style.width = '0px';

    lossDisplay.textContent = 'Loss: 0.892';
    lossDisplay.className = 'text-amber-400 font-semibold transition-colors';

    track.className = 'relative w-full h-12 rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden p-1 flex items-center cursor-pointer';
    if (trackText) {
      trackText.textContent = 'Slide to minimize loss →';
      trackText.className = 'absolute inset-0 flex items-center justify-center text-xs font-mono text-brand-muted/70 pointer-events-none transition-opacity';
      trackText.style.opacity = '1';
    }

    thumb.className = 'relative z-10 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-black/60 cursor-grab active:cursor-grabbing touch-none transition-colors';
    thumb.innerHTML = SVG_CHEVRONS;

    submitBtn.disabled = true;
    submitBtn.className = 'w-full py-3.5 rounded-xl bg-purple-600 text-white font-semibold text-sm shadow-lg shadow-purple-600/20 opacity-40 cursor-not-allowed transition-all flex items-center justify-center gap-2';
    submitBtn.innerHTML = `<span id="btn-text">Send Message (Locked)</span> ${SVG_LOCK}`;
  }

  // Success handler once slider reaches 90% convergence
  function triggerSuccess() {
    isVerified = true;
    isDragging = false;

    const maxDist = getMaxDistance();
    currentX = maxDist;
    thumb.style.transform = `translate3d(${maxDist}px, 0, 0)`;
    fill.style.width = '100%';

    lossDisplay.textContent = 'Loss: 0.009 (Converged)';
    lossDisplay.className = 'text-emerald-400 font-bold';

    track.className = 'relative w-full h-12 rounded-xl bg-emerald-950/20 border border-emerald-500/40 p-1 flex items-center';
    trackText.textContent = '✔ Model Converged • Human Verified';
    trackText.className = 'absolute inset-0 flex items-center justify-center text-xs font-mono font-semibold text-emerald-300 pointer-events-none';
    trackText.style.opacity = '1';

    thumb.className = 'relative z-10 w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-950';
    thumb.innerHTML = SVG_CHECK;

    submitBtn.disabled = false;
    submitBtn.className = 'w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer';
    submitBtn.innerHTML = `<span id="btn-text">Send Message</span> ${SVG_SEND}`;

    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      resetVerification();
    }, 10000);
  }

  // Pointer Capture binding: restricts event firing strictly to active dragging
  thumb.addEventListener('pointerdown', (e) => {
    if (isVerified) return;
    isDragging = true;
    startX = e.clientX - currentX;
    thumb.setPointerCapture(e.pointerId);
    thumb.classList.remove('transition-all');
    fill.classList.remove('transition-all');
  });

  thumb.addEventListener('pointermove', (e) => {
    if (!isDragging || isVerified) return;

    const maxDist = getMaxDistance();
    currentX = Math.max(0, Math.min(e.clientX - startX, maxDist));
    const progress = currentX / maxDist;

    thumb.style.transform = `translate3d(${currentX}px, 0, 0)`;
    fill.style.width = `${currentX + thumb.clientWidth}px`;

    const currentLoss = (1 - progress) * 0.88 + 0.012;
    lossDisplay.textContent = `Loss: ${currentLoss.toFixed(3)}`;

    if (trackText) {
      trackText.style.opacity = `${1 - progress * 1.5}`;
    }

    if (progress >= 0.9) {
      triggerSuccess();
    }
  });

  const stopPointerDrag = (e) => {
    if (!isDragging || isVerified) return;
    isDragging = false;
    try {
      thumb.releasePointerCapture(e.pointerId);
    } catch (_) {}
    resetVerification();
  };

  thumb.addEventListener('pointerup', stopPointerDrag);
  thumb.addEventListener('pointercancel', stopPointerDrag);

  // Form submission and multi-tier verification
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      function displayError(message) {
        submitBtn.disabled = true;
        submitBtn.className = 'w-full py-3.5 rounded-xl bg-red-950/90 border border-red-500/60 text-red-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40';
        submitBtn.innerHTML = `<span>${message}</span> ${SVG_WARN}`;

        setTimeout(() => {
          if (isVerified) {
            submitBtn.disabled = false;
            submitBtn.className = 'w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer';
            submitBtn.innerHTML = `<span id="btn-text">Send Message</span> ${SVG_SEND}`;
          } else {
            resetVerification();
          }
        }, 3500);
      }

      if (!isVerified) {
        displayError('Please slide to minimize loss first!');
        return;
      }

      const firstName = contactForm.querySelector('input[name="firstName"]')?.value.trim();
      const email = contactForm.querySelector('input[name="email"]')?.value.trim().toLowerCase();
      const message = contactForm.querySelector('textarea[name="message"]')?.value.trim();

      if (!firstName || !email || !message) {
        displayError('Please fill in all required fields (*)');
        return;
      }

      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      if (!emailRegex.test(email)) {
        displayError('Enter a valid email (e.g. name@domain.com)');
        contactForm.querySelector('input[name="email"]')?.focus();
        return;
      }

      const domain = email.split('@')[1];

      // Tier 1: Trusted and academic email providers
      const trustedProviders = [
        'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com',
        'yahoo.com', 'yahoo.co.in', 'icloud.com', 'me.com', 'proton.me',
        'protonmail.com', 'zoho.com', 'aol.com', 'mail.com'
      ];

      const isTrusted = trustedProviders.includes(domain) ||
                        domain.endsWith('.edu') ||
                        domain.endsWith('.ac.in') ||
                        domain.endsWith('.gov');

      // Tier 2: Known burner patterns
      const knownBurnerPatterns = [
        'tempmail', '10minutemail', 'guerrillamail', 'mailinator', 'throwaway',
        'yopmail', 'burner', 'fakeinbox', 'trashmail', 'dispostable', 'mohmal',
        'airychen.com', 'hideam.com', 'findize.com', 'blobapps.com'
      ];

      if (knownBurnerPatterns.some((pattern) => domain.includes(pattern))) {
        displayError('Disposable / temporary emails are not allowed');
        return;
      }

      // Tier 3: Real-time DNS and MX validation via Google DoH
      if (!isTrusted) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Verifying business domain...</span>`;

        try {
          const googleDnsRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`);
          const dnsData = await googleDnsRes.json();

          if (dnsData.Status !== 0 || !dnsData.Answer || dnsData.Answer.length === 0) {
            displayError('Email domain does not exist or has no mail server');
            return;
          }

          const mxRecords = dnsData.Answer.map((ans) => (ans.data || '').toLowerCase());
          const isSuspiciousMx = mxRecords.some((mx) =>
            mx.includes('airychen') ||
            mx.includes('temp-mail') ||
            mx.includes('dnsowl') ||
            mx.includes('mail.' + domain)
          );

          if (isSuspiciousMx) {
            displayError('Temporary email network detected. Use a real ID');
            return;
          }
        } catch (err) {
          console.warn('DNS validation fallback:', err);
        }
      }

      // Transmit to Web3Forms
      if (resetTimer) clearTimeout(resetTimer);

      submitBtn.innerHTML = `<span>Sending Message...</span>`;
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

          setTimeout(() => resetVerification(), 5000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        console.error(err);
        displayError('Failed to send. Please email directly.');
      }
    });
  }
}