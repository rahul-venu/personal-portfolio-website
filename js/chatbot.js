export function initChatbot() {
  const toggleBtn = document.getElementById('chatbot-toggle');
  const chatWindow = document.getElementById('chatbot-window');
  const iconOpen = document.getElementById('chat-icon-open');
  const iconClose = document.getElementById('chat-icon-close');
  const closeHeader = document.getElementById('chatbot-close-header');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('chat-messages');

  if (!toggleBtn || !chatWindow || !chatForm || !chatInput || !messagesContainer) return;

// Live Render URL:
const BACKEND_URL = "https://rahul-portfolio-api.onrender.com/api/chat"; 
  function toggleChat() {
    const isHidden = chatWindow.classList.contains('hidden');
    if (isHidden) {
      chatWindow.classList.remove('hidden');
      iconOpen?.classList.add('hidden');
      iconClose?.classList.remove('hidden');
      chatInput.focus();
    } else {
      chatWindow.classList.add('hidden');
      iconOpen?.classList.remove('hidden');
      iconClose?.classList.add('hidden');
    }
  }

  toggleBtn.addEventListener('click', toggleChat);
  if (closeHeader) closeHeader.addEventListener('click', toggleChat);

  // --- IN-MEMORY CONVERSATION HISTORY ---
  let chatHistory = [];

// CORE FUNCTION: Streams response with smooth typewriter pacing
  async function sendQuery(userText) {
    if (!userText || !userText.trim()) return;
    const cleanText = userText.trim();

    // 1. Add User Bubble
    appendMessage(cleanText, 'user');
    chatInput.value = '';

    // 2. Free-floating pulsing orb 
    const pulseOrb = `
      <span class="relative flex h-2.5 w-2.5 my-1">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.9)]"></span>
      </span>
    `;

    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'flex items-center py-1.5 px-1 self-start'; // Transparent, no background box!
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

      // 3. Adaptive Smooth Typewriter Pacer
      const typeLoop = new Promise((resolve) => {
        const step = () => {
          if (displayedLength < fullStreamedText.length) {
            // Remove the floating state and style as a message when text lands
            if (isFirstChar) {
              loadingBubble.className = 'bot-bubble leading-relaxed';
              loadingBubble.innerHTML = '';
              isFirstChar = false;
            }

            // Adaptive Speed: Types 1 char at a time, but speeds up if queue is long
            const diff = fullStreamedText.length - displayedLength;
            const charsToAdd = diff > 80 ? 6 : diff > 30 ? 3 : 1;
            displayedLength = Math.min(displayedLength + charsToAdd, fullStreamedText.length);

            loadingBubble.innerHTML = formatMarkdown(fullStreamedText.slice(0, displayedLength));
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // ~18ms per character gives that buttery smooth typing rhythm
            setTimeout(step, 8);
          } else if (streamDone) {
            // Ensure full text & markdown links are cleanly resolved at the end
            loadingBubble.innerHTML = formatMarkdown(fullStreamedText);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            resolve();
          } else {
            // Wait for next network packet
            setTimeout(step, 20);
          }
        };
        step();
      });

      // 4. Stream Reader Consumer
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          streamDone = true;
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        fullStreamedText += chunk;
      }

      // Wait until the visual typewriter finishes printing
      await typeLoop;

      // 5. Save completed turn to conversation history
      chatHistory.push({ role: 'user', content: cleanText });
      chatHistory.push({ role: 'assistant', content: fullStreamedText.trim() });
      if (chatHistory.length > 6) {
        chatHistory = chatHistory.slice(-6);
      }

    } catch (err) {
      loadingBubble.textContent = "AI engine is currently offline. Please ensure your Python server is running.";
      console.error(err);
    }
  }

  // 1. Handle typing & pressing Enter / Send Button
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendQuery(chatInput.value);
  });

  // 2. Handle Clicking Any Quick-Tap Prompt Chip
  messagesContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.chat-chip');
    if (!chip) return;

    // Get question text from chip (strips leading emoji)
    const promptText = chip.textContent.replace(/^[^\w\s?]+/, '').trim();
    sendQuery(promptText);
  });

  // Converts LLM output into clean HTML: Links, Emails, Bold, Italics, and Bullets
  function formatMarkdown(text) {
    if (!text) return '';
    let formatted = text;

    // 1. Convert Markdown links: [Title](URL)
    formatted = formatted.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:text-purple-300 underline font-medium transition-colors">$1</a>'
    );

    // 2. Convert Raw URLs (e.g. https://linkedin.com/... -> clickable link)
    formatted = formatted.replace(
      /(?<!href=["'])(https?:\/\/[^\s<]+)/g,
      (match) => {
        const cleanUrl = match.replace(/[.,!?;:]$/, '');
        const punctuation = match.slice(cleanUrl.length);
        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:text-purple-300 underline font-medium transition-colors break-all">${cleanUrl}</a>${punctuation}`;
      }
    );

    // 3. Convert Raw Emails (e.g. name@gmail.com -> mailto: link)
    formatted = formatted.replace(
      /(?<!mailto:|\w)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?![^<]*>)/g,
      '<a href="mailto:$1" class="text-purple-400 hover:text-purple-300 underline font-medium transition-colors">$1</a>'
    );

    // 4. Double asterisks: **bold** -> <strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

    // 5. Single asterisks: *italics* -> <em> (Strips raw stars from movie & show titles!)
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-200 font-normal">$1</em>');

    // 6. Fix floating bullets where the bullet was placed on its own line
    formatted = formatted.replace(/(?:^|\n)\s*[-*•]\s*[\r\n]+\s*(.+)/g, '\n• $1');

    // 7. Styled Bullet points with a glowing purple dot
    formatted = formatted.replace(
      /(?:^|\n)\s*[-*•]\s+(.+)/g,
      '<div class="flex items-start gap-2 my-1.5"><span class="text-purple-400 font-bold shrink-0">•</span><span>$1</span></div>'
    );

    // 8. Spacing & line breaks
    formatted = formatted.replace(/\n\n/g, '<div class="h-2"></div>');
    formatted = formatted.replace(/\n/g, '<br/>');

    return formatted;
  }
  
  function appendMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = sender === 'user' ? 'user-bubble' : 'bot-bubble leading-relaxed';
    
    if (sender === 'bot') {
    // If it's the pulsing orb HTML, inject directly; otherwise format markdown
    bubble.innerHTML = text.startsWith('<') ? text : formatMarkdown(text);
  } else {
    bubble.textContent = text;
  }
    
    messagesContainer.appendChild(bubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return bubble;
  }
}