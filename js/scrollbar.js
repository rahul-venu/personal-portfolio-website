export function initScrollbar() {
  // Only on desktop with a mouse. Phones/tablets keep their own overlay scrollbar.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const de = document.documentElement;

  const style = document.createElement('style');
  style.textContent = `
    /* 1. Completely kill the native scrollbar and its background box/gutter */
    html.custom-scroll,
    html.custom-scroll body {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    html.custom-scroll::-webkit-scrollbar,
    html.custom-scroll body::-webkit-scrollbar,
    html.custom-scroll::-webkit-scrollbar-track,
    html.custom-scroll::-webkit-scrollbar-track-piece {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
      background: transparent !important;
    }

    /* 2. Floating translucent pill thumb (GPU-composited, zero blur-repaint lag) */
    #page-scrollthumb {
      position: fixed;
      top: 0;
      right: 5px;
      width: 7px;
      border-radius: 9999px;
      background: rgba(185, 200, 215, 0.38);
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow: none !important;
      z-index: 9999;
      cursor: grab;
      user-select: none;
      pointer-events: auto;
      transition: background-color 0.2s ease, width 0.2s ease, border-color 0.2s ease;
      will-change: transform;
      contain: layout style paint;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }

    /* 3. Hide native scrollbar inside Chatbot messages */
    #chat-messages {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    #chat-messages::-webkit-scrollbar,
    #chat-messages::-webkit-scrollbar-track {
      display: none !important;
      width: 0 !important;
      background: transparent !important;
    }

    /* 4. Floating translucent pill thumb inside Chatbot window */
    #chat-scrollthumb {
      position: absolute;
      right: 2px;
      width: 4px;
      border-radius: 9999px;
      background: rgba(185, 200, 215, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.12);
      z-index: 60;
      cursor: grab;
      user-select: none;
      pointer-events: auto;
      transition: background-color 0.2s ease, width 0.2s ease, opacity 0.2s ease;
      will-change: transform;
    }

    #chat-scrollthumb:hover,
    #chat-scrollthumb.dragging {
      width: 7px;
      background: rgba(210, 225, 240, 0.6);
      border-color: rgba(255, 255, 255, 0.28);
    }

    #page-scrollthumb.dragging {
      cursor: grabbing;
    }
  `;
  document.head.appendChild(style);

  const thumb = document.createElement('div');
  thumb.id = 'page-scrollthumb';
  document.body.appendChild(thumb);
  de.classList.add('custom-scroll');

  const PAD = 6;
  let vh = window.innerHeight;
  let total = de.scrollHeight;
  let thumbH = 70;
  let maxScroll = 1;
  let trackTravel = 1;

  function measure() {
    vh = window.innerHeight;
    total = de.scrollHeight;
    if (total <= vh + 1) {
      thumb.style.display = 'none';
      return;
    }
    thumb.style.display = 'block';

    // Dynamic height capped between 44px and 90px
    thumbH = Math.min(90, Math.max(44, Math.round((vh * vh) / total)));
    thumb.style.height = thumbH + 'px';

    maxScroll = Math.max(1, total - vh);
    trackTravel = Math.max(1, vh - thumbH - PAD * 2);
    renderPosition();
  }

  function renderPosition() {
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    const y = progress * trackTravel + PAD;
    thumb.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
  }

  window.addEventListener('scroll', renderPosition, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
  measure();

  // Drag the thumb to scroll
  let dragging = false, startY = 0, startScroll = 0;
  thumb.addEventListener('pointerdown', (e) => {
    dragging = true;
    startY = e.clientY;
    startScroll = window.scrollY;
    thumb.setPointerCapture(e.pointerId);
    thumb.classList.add('dragging');
    e.preventDefault();
  });
  thumb.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const ratio = maxScroll / trackTravel;
    window.scrollTo({ top: startScroll + (e.clientY - startY) * ratio, behavior: 'instant' });
  });
  function stop() {
    dragging = false;
    thumb.classList.remove('dragging');
  }
  thumb.addEventListener('pointerup', stop);
  thumb.addEventListener('pointercancel', stop);

  // ================= CHATBOT BOX FLOATING PILL SCROLLBAR =================
  const chatWindow = document.getElementById('chatbot-window');
  const chatMsgs = document.getElementById('chat-messages');

  if (chatWindow && chatMsgs) {
    const chatThumb = document.createElement('div');
    chatThumb.id = 'chat-scrollthumb';
    chatWindow.appendChild(chatThumb);

    const CHAT_PAD = 6;
    let cMaxScroll = 1;
    let cTrackTravel = 1;

    function updateChatScrollbar() {
      const ch = chatMsgs.clientHeight;
      const total = chatMsgs.scrollHeight;

      // Hide pill if chat is closed or content fits without scrolling
      if (total <= ch + 2 || chatWindow.classList.contains('hidden')) {
        chatThumb.style.display = 'none';
        return;
      }
      chatThumb.style.display = 'block';

      const topOffset = chatMsgs.offsetTop;
      const h = Math.min(75, Math.max(30, Math.round((ch * ch) / total)));
      chatThumb.style.height = h + 'px';
      chatThumb.style.top = topOffset + 'px';

      cMaxScroll = Math.max(1, total - ch);
      cTrackTravel = Math.max(1, ch - h - CHAT_PAD * 2);

      const progress = Math.min(1, Math.max(0, chatMsgs.scrollTop / cMaxScroll));
      const y = progress * cTrackTravel + CHAT_PAD;
      chatThumb.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    }

    chatMsgs.addEventListener('scroll', updateChatScrollbar, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(updateChatScrollbar).observe(chatMsgs);
    // Also watch for new chat bubbles being added or chat window opening
    new MutationObserver(updateChatScrollbar).observe(chatMsgs, { childList: true, subtree: true });
    new MutationObserver(updateChatScrollbar).observe(chatWindow, { attributes: true, attributeFilter: ['class'] });

    // Drag support for chat thumb
    let cDragging = false, cStartY = 0, cStartScroll = 0;
    chatThumb.addEventListener('pointerdown', (e) => {
      cDragging = true;
      cStartY = e.clientY;
      cStartScroll = chatMsgs.scrollTop;
      chatThumb.setPointerCapture(e.pointerId);
      chatThumb.classList.add('dragging');
      e.preventDefault();
    });
    chatThumb.addEventListener('pointermove', (e) => {
      if (!cDragging) return;
      const ratio = cMaxScroll / cTrackTravel;
      chatMsgs.scrollTop = cStartScroll + (e.clientY - cStartY) * ratio;
    });
    const stopChatDrag = () => {
      cDragging = false;
      chatThumb.classList.remove('dragging');
    };
    chatThumb.addEventListener('pointerup', stopChatDrag);
    chatThumb.addEventListener('pointercancel', stopChatDrag);
  }
}