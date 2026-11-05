/* ================= AI CHATBOT COMPANION INTERFACE (js/chatbot.js) =================
   - Manages Zoe conversation drawer, streaming typewriter responses, and context history.
   - Wires hero CTA button (#clone-btn) directly to toggle and focus the chat drawer.
   - Handles multi-turn conversational memory, quick-prompt chips, and markdown rendering.
*/

export function initChatbot() {
  const toggleBtn = document.getElementById('chatbot-toggle');
  const cloneBtn = document.getElementById('clone-btn');
  const chatWindow = document.getElementById('chatbot-window');
  const iconOpen = document.getElementById('chat-icon-open');
  const iconClose = document.getElementById('chat-icon-close');
  const closeHeader = document.getElementById('chatbot-close-header');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('chat-messages');

  if (!toggleBtn || !chatWindow || !chatForm || !chatInput || !messagesContainer) return;

  const BACKEND_URL = "https://rahul-portfolio-api.onrender.com/api/chat";

  function toggleChat(forceOpen = false) {
    const isHidden = chatWindow.classList.contains('hidden');

    if (isHidden || forceOpen) {
      chatWindow.classList.remove('hidden');
      iconOpen?.classList.add('hidden');
      iconClose?.classList.remove('hidden');
      setTimeout(() => chatInput.focus(), 80);
    } else {
      chatWindow.classList.add('hidden');
      iconOpen?.classList.remove('hidden');
      iconClose?.classList.add('hidden');
    }
  }

  toggleBtn.addEventListener('click', () => toggleChat());
  if (closeHeader) closeHeader.addEventListener('click', () => toggleChat());

  // Direct Hero CTA wire-up (instant launch replacing previous bike ride)
  if (cloneBtn) {
    cloneBtn.addEventListener('click', () => toggleChat(true));
  }

  // In-memory conversation history
  let chatHistory = [];

  // Streams responses with adaptive typewriter pacing
  async function sendQuery(userText) {
    if (!userText || !userText.trim()) return;
    const cleanText = userText.trim();

    // 1. Append user query bubble
    appendMessage(cleanText, 'user');
    chatInput.value = '';

    // 2. Render pulsing status orb
    const pulseOrb = `
      <span class="relative flex h-2.5 w-2.5 my-1">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.9)]"></span>
      </span>
    `;

    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'flex items-center py-1.5 px-1 self-start';
    loadingBubble.innerHTML = pulseOrb;
    messagesContainer.appendChild(loadingBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          history: chatHistory
        })
      });

      if (!res.ok) throw new Error('Network error');

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let fullStreamedText = '';
      let displayedLength = 0;
      let isFirstChar = true;
      let streamDone = false;

      // 3. Adaptive Smooth Typewriter Loop
      const typeLoop = new Promise((resolve) => {
        const step = () => {
          if (displayedLength < fullStreamedText.length) {
            if (isFirstChar) {
              loadingBubble.className = 'bot-bubble leading-relaxed';
              loadingBubble.innerHTML = '';
              isFirstChar = false;
            }

            const diff = fullStreamedText.length - displayedLength;
            const charsToAdd = diff > 80 ? 6 : diff > 30 ? 3 : 1;
            displayedLength = Math.min(displayedLength + charsToAdd, fullStreamedText.length);

            loadingBubble.innerHTML = formatMarkdown(fullStreamedText.slice(0, displayedLength));
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            setTimeout(step, 8);
          } else if (streamDone) {
            loadingBubble.innerHTML = formatMarkdown(fullStreamedText);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            resolve();
          } else {
            setTimeout(step, 20);
          }
        };
        step();
      });

      // 4. Stream consumer
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          streamDone = true;
          break;
        }
        fullStreamedText += decoder.decode(value, { stream: true });
      }

      await typeLoop;

      // 5. Commit turn to rolling history
      chatHistory.push({ role: 'user', content: cleanText });
      chatHistory.push({ role: 'assistant', content: fullStreamedText.trim() });
      if (chatHistory.length > 6) {
        chatHistory = chatHistory.slice(-6);
      }
    } catch (err) {
      loadingBubble.className = 'bot-bubble leading-relaxed';
      loadingBubble.textContent = 'AI engine is currently offline. Please ensure the Python server is running.';
      console.error(err);
    }
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendQuery(chatInput.value);
  });

  messagesContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.chat-chip');
    if (!chip) return;
    const promptText = chip.textContent.replace(/^[^\w\s?]+/, '').trim();
    sendQuery(promptText);
  });

  // Converts response markdown into clean DOM nodes
  function formatMarkdown(text) {
    if (!text) return '';
    let formatted = text;

    // Convert Markdown links: [Title](URL)
    formatted = formatted.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:text-purple-300 underline font-medium transition-colors">$1</a>'
    );

    // Convert raw URLs
    formatted = formatted.replace(
      /(?<!href=["'])(https?:\/\/[^\s<]+)/g,
      (match) => {
        const cleanUrl = match.replace(/[.,!?;:]$/, '');
        const punctuation = match.slice(cleanUrl.length);
        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:text-purple-300 underline font-medium transition-colors break-all">${cleanUrl}</a>${punctuation}`;
      }
    );

    // Convert raw email addresses
    formatted = formatted.replace(
      /(?<!mailto:|\w)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?![^<]*>)/g,
      '<a href="mailto:$1" class="text-purple-400 hover:text-purple-300 underline font-medium transition-colors">$1</a>'
    );

    // Double asterisks for bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

    // Single asterisks for italics
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-200 font-normal">$1</em>');

    // Normalize isolated bullet markers
    formatted = formatted.replace(/(?:^|\n)\s*[-*•]\s*[\r\n]+\s*(.+)/g, '\n• $1');

    // Styled bullet lists
    formatted = formatted.replace(
      /(?:^|\n)\s*[-*•]\s+(.+)/g,
      '<div class="flex items-start gap-2 my-1.5"><span class="text-purple-400 font-bold shrink-0">•</span><span>$1</span></div>'
    );

    // Paragraph breaks and newlines
    formatted = formatted.replace(/\n\n/g, '<div class="h-2"></div>');
    formatted = formatted.replace(/\n/g, '<br/>');

    return formatted;
  }

  function appendMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = sender === 'user' ? 'user-bubble' : 'bot-bubble leading-relaxed';

    if (sender === 'bot') {
      bubble.innerHTML = text.startsWith('<') ? text : formatMarkdown(text);
    } else {
      bubble.textContent = text;
    }

    messagesContainer.appendChild(bubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return bubble;
  }
}