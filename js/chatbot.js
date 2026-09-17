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

  // CORE FUNCTION: Sends a message to the Python Groq Backend
  async function sendQuery(userText) {
    if (!userText || !userText.trim()) return;
    const cleanText = userText.trim();

    // 1. Add User's Message Bubble to Chat
    appendMessage(cleanText, 'user');
    chatInput.value = '';

    // 2. Add Temporary Thinking Bubble
    const loadingBubble = appendMessage("Thinking...", 'bot');

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cleanText })
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      
      // Update bubble with the answer from Groq
      loadingBubble.innerHTML = formatMarkdown(data.reply);
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

    // Get the question text from the chip (strips leading emoji)
    const promptText = chip.textContent.replace(/^[^\w\s?]+/, '').trim();
    sendQuery(promptText);
  });

  // Converts LLM Markdown into clean HTML with bolding and spaced bullet points
function formatMarkdown(text) {
  if (!text) return '';
  return text
    // 1. Bold text: **text** -> <strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    
    // 2. Bullet points: - item -> clean spaced line with purple bullet
    .replace(/(?:^|\n)[-*]\s+(.+)/g, '<div class="flex items-start gap-2 my-1.5"><span class="text-purple-400 font-bold shrink-0">•</span><span>$1</span></div>')
    
    // 3. Double linebreaks -> spacious paragraph gaps
    .replace(/\n\n/g, '<div class="h-2"></div>')
    
    // 4. Single linebreaks -> <br>
    .replace(/\n/g, '<br/>');
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