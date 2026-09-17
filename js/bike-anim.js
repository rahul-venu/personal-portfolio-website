export function initBikeRun() {
  const cloneBtn = document.getElementById('clone-btn');
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatWindow = document.getElementById('chatbot-window');

  if (!cloneBtn || !chatbotToggle) return;

  let isRunning = false;

  cloneBtn.addEventListener('click', () => {
    if (isRunning) return;

    if (chatWindow && !chatWindow.classList.contains('hidden')) {
      document.getElementById('chat-input')?.focus();
      return;
    }

    isRunning = true;

    // Calculate dynamic coordinates
    const startRect = cloneBtn.getBoundingClientRect();
    const endRect = chatbotToggle.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;

    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;

    // 1. Create Scooter Element
    const clone = document.createElement('div');
    clone.className = 'clone-character';
    clone.innerHTML = `
      <div class="scooter-ride relative">
        <img 
          src="assets/images/rahul.png" 
          alt="Scooter Character" 
          class="w-28 h-28 object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.65)] select-none pointer-events-none"
        />
      </div>
    `;

    clone.style.position = 'fixed';
    clone.style.left = `${startX}px`;
    clone.style.top = `${startY}px`;
    clone.style.transform = 'translate(-50%, -50%) scale(0)';
    document.body.appendChild(clone);

    // STAGE 1: Pop up above button with a little wheelie rev
    const popAnim = clone.animate([
      { transform: 'translate(-50%, -50%) scale(0) rotate(-10deg)', opacity: 0 },
      { transform: 'translate(-50%, -125%) scale(1.15) rotate(10deg)', opacity: 1, offset: 0.7 },
      { transform: 'translate(-50%, -100%) scale(1) rotate(0deg)', opacity: 1 }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      fill: 'forwards'
    });

    popAnim.onfinish = () => {
      setTimeout(() => {
        const midX = (startX + endX) / 2;
        const midY = Math.min(startY, endY) - 90;

        const nearEndX = startX + (endX - startX) * 0.88;
        const nearEndY = startY + (endY - startY) * 0.88 - 10;

        // 2. REAL-TIME EXHAUST SMOKE EMITTER
        // Spawns expanding smoke clouds from the back wheel every 45ms
        const smokeInterval = setInterval(() => {
          const rect = clone.getBoundingClientRect();
          if (!rect.width) return;

          // Exhaust pipe location (rear-bottom of the scooter)
          const puffX = rect.left + rect.width * 0.2;
          const puffY = rect.bottom - rect.height * 0.25;

          createSmokePuff(puffX, puffY);
        }, 45);

        // STAGE 2: Drive across screen (100% VISIBLE until the very end)
        const runAnim = clone.animate([
          // Start: Level drive
          { 
            left: `${startX}px`, 
            top: `${startY - 40}px`,
            transform: 'translate(-50%, -50%) scale(1) rotate(4deg)',
            opacity: 1
          },
          // Mid-flight: Tilts forward into the turn
          { 
            left: `${midX}px`, 
            top: `${midY}px`,
            transform: 'translate(-50%, -50%) scale(0.95) rotate(12deg)',
            opacity: 1,
            offset: 0.5
          },
          // 88% of way: STILL 100% SOLID right in front of the chatbot button
          { 
            left: `${nearEndX}px`, 
            top: `${nearEndY}px`,
            transform: 'translate(-50%, -50%) scale(0.9) rotate(20deg)',
            opacity: 1,
            offset: 0.88
          },
          // Final 12%: Zooms directly into the button and dissolves
          { 
            left: `${endX}px`, 
            top: `${endY}px`,
            transform: 'translate(-50%, -50%) scale(0.1) rotate(20deg)',
            opacity: 0
          }
        ], {
          duration: 5100, // 1.7 second smooth ride
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          fill: 'forwards'
        });

        // STAGE 3: Stop smoke, absorb into chatbot, and open
        runAnim.onfinish = () => {
          clearInterval(smokeInterval);
          clone.remove();

          chatbotToggle.classList.add('clone-impact');
          setTimeout(() => chatbotToggle.classList.remove('clone-impact'), 500);

          if (chatWindow && chatWindow.classList.contains('hidden')) {
            chatbotToggle.click();
          }

          isRunning = false;
        };
      }, 100);
    };
  });

  // Helper: Generates a single expanding, fading smoke puff
  function createSmokePuff(x, y) {
    const puff = document.createElement('div');
    puff.className = 'scooter-smoke-puff';
    puff.style.left = `${x}px`;
    puff.style.top = `${y}px`;

    // Randomize puff sizes for natural puffy look
    const size = Math.random() * 12 + 14; // 14px to 26px
    puff.style.width = `${size}px`;
    puff.style.height = `${size}px`;

    document.body.appendChild(puff);

    // Puff floats backwards, expands, and dissolves
    puff.animate([
      { 
        transform: 'translate(-50%, -50%) scale(0.5)', 
        opacity: 0.7 
      },
      { 
        transform: `translate(-50%, -50%) translate(${(Math.random() - 0.5) * 16 - 18}px, ${-Math.random() * 12}px) scale(2.2)`, 
        opacity: 0 
      }
    ], {
      duration: 650,
      easing: 'ease-out',
      fill: 'forwards'
    }).onfinish = () => puff.remove();
  }
}