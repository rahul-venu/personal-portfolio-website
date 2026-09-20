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

// SVG Warning Icon for clear visual feedback
  const SVG_WARN = `<svg class="w-4 h-4 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

     // --- REAL EMAIL SUBMISSION WITH MULTI-TIER AUTHENTICATION ---
     
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

      // 1. Loss Slider check
      if (!isVerified) {
        displayError('Please slide to minimize loss first!');
        return;
      }

      // 2. Required Fields check
      const firstName = contactForm.querySelector('input[name="firstName"]')?.value.trim();
      const email = contactForm.querySelector('input[name="email"]')?.value.trim().toLowerCase();
      const message = contactForm.querySelector('textarea[name="message"]')?.value.trim();

      if (!firstName || !email || !message) {
        displayError('Please fill in all required fields (*)');
        return;
      }

      // 3. Syntax Schema Regex
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      if (!emailRegex.test(email)) {
        displayError('Enter a valid email (e.g. name@domain.com)');
        contactForm.querySelector('input[name="email"]')?.focus();
        return;
      }

      const domain = email.split('@')[1];

      // ================= TIER 1: TRUSTED PROVIDERS & ACADEMIC =================
      const trustedProviders = [
        'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 
        'yahoo.com', 'yahoo.co.in', 'icloud.com', 'me.com', 'proton.me', 
        'protonmail.com', 'zoho.com', 'aol.com', 'mail.com'
      ];

      const isTrusted = trustedProviders.includes(domain) || 
                        domain.endsWith('.edu') || 
                        domain.endsWith('.ac.in') || 
                        domain.endsWith('.gov');

      // ================= TIER 2: DISPOSABLE DOMAIN SIGNATURES =================
      const knownBurnerPatterns = [
        'tempmail', '10minutemail', 'guerrillamail', 'mailinator', 'throwaway',
        'yopmail', 'burner', 'fakeinbox', 'trashmail', 'dispostable', 'mohmal',
        'airychen.com', 'hideam.com', 'findize.com', 'blobapps.com' // Temp-mail.org pool
      ];

      const isKnownBurner = knownBurnerPatterns.some(pattern => domain.includes(pattern));

      if (isKnownBurner) {
        displayError('Disposable / temporary emails are not allowed');
        return;
      }

      // ================= TIER 3: REAL-TIME DNS & MX VIA GOOGLE 8.8.8.8 =================
      if (!isTrusted) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Verifying business domain...</span>`;

        try {
          // Query Google's official DNS-over-HTTPS API
          const googleDnsRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`);
          const dnsData = await googleDnsRes.json();

          // Status !== 0 means domain doesn't exist or has DNS errors
          if (dnsData.Status !== 0 || !dnsData.Answer || dnsData.Answer.length === 0) {
            displayError('Email domain does not exist or has no mail server');
            return;
          }

          // Inspect the actual MX records (Detect self-hosted disposable mail servers)
          const mxRecords = dnsData.Answer.map(ans => (ans.data || '').toLowerCase());
          const isSuspiciousMx = mxRecords.some(mx => 
            mx.includes('airychen') || 
            mx.includes('temp-mail') || 
            mx.includes('dnsowl') || 
            mx.includes('mail.' + domain) // Self-referential disposable host
          );

          if (isSuspiciousMx) {
            displayError('Temporary email network detected. Use a real ID');
            return;
          }

        } catch (err) {
          console.warn('DNS validation fallback:', err);
        }
      }

      // ================= SUBMIT TO WEB3FORMS =================
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

  // Mouse Events
  thumb.addEventListener('mousedown', (e) => onStart(e.clientX));
  window.addEventListener('mousemove', (e) => onMove(e.clientX));
  window.addEventListener('mouseup', onEnd);

  // Touch Events (Mobile)
  thumb.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchend', onEnd);
}