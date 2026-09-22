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

  // Local Python FastAPI backend endpoint
  const BACKEND_URL = "http://127.0.0.1:8000/api/chat";

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

  // CORE FUNCTION: Sends message + history to Python Backend
  async function sendQuery(userText) {
    if (!userText || !userText.trim()) return;
    const cleanText = userText.trim();

    // 1. Add User's Message Bubble
    appendMessage(cleanText, 'user');
    chatInput.value = '';

    // 2. Add Temporary Thinking Bubble
    const loadingBubble = appendMessage("Thinking...", 'bot');

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: cleanText,
          history: chatHistory // Sends multi-turn conversation memory
        })
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      
      // Update bubble with clean formatted answer from Groq
      loadingBubble.innerHTML = formatMarkdown(data.reply);

      // Save turns to history
      chatHistory.push({ role: 'user', content: cleanText });
      chatHistory.push({ role: 'assistant', content: data.reply });

      // Keep last 6 messages to stay lightweight
      if (chatHistory.length > 6) {
        chatHistory = chatHistory.slice(-6);
      }

    } catch (err) {
      loadingBubble.textContent = "AI engine is currently offline. Please ensure your Python server is running on port 8000.";
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
    
    // Use innerHTML for bot so formatting displays immediately
    if (sender === 'bot') {
      bubble.innerHTML = formatMarkdown(text);
    } else {
      bubble.textContent = text;
    }
    
    messagesContainer.appendChild(bubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return bubble;
  }
}