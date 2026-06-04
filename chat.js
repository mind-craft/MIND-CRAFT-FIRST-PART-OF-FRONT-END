/**
 * Chat Entry Module
 * Orchestrates refactored sub-modules
 */

function initChat() {
    setupActionChips();
    setupChatInputs();
    setupMediaUpload();
    setupVoiceRecording(sendVoiceMessage);
    initNetworkBackground();
    
    document.getElementById('newChatBtn').onclick = createNewSession;
    document.querySelectorAll('.stop-generate-btn').forEach(b => b.onclick = stopAITask);

    if (chatSessions.length > 0) loadSession(chatSessions[chatSessions.length-1].id);
    else createNewSession();
}

function createNewSession() {
    const id = 'chat_' + Date.now();
    addSession({ id, title: null, messages: [], createdAt: Date.now() });
    loadSession(id);
}

function loadSession(id) {
    setCurrentSessionId(id);
    const session = getCurrentSession();
    const container = document.getElementById('messagesContainer');
    const hero = document.getElementById('heroSection');
    const bottom = document.getElementById('bottomInputContainer');

    container.innerHTML = '';
    if (!session.messages.length) {
        hero.classList.remove('hidden');
        bottom.style.display = 'none';
    } else {
        hero.classList.add('hidden');
        bottom.style.display = 'block';
        session.messages.forEach(m => addMessageToDOM(m.text, m.type, m.id, m.duration, m.media));
    }
    updateSidebarHistory();
}

function setupChatInputs() {
    [document.getElementById('chatInput'), document.getElementById('chatInputBottom')].forEach((input, i) => {
        const btn = [document.getElementById('sendBtn'), document.getElementById('sendBtnBottom')][i];
        input.oninput = () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 200) + 'px';
            input.value.trim() ? btn.classList.add('active') : btn.classList.remove('active');
        };
        input.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
        btn.onclick = sendMessage;
    });

    const heroWrap = document.querySelector('.input-wrapper-chat.hero-input');
    heroWrap.onmousemove = (e) => {
        const r = heroWrap.getBoundingClientRect();
        heroWrap.style.setProperty('--mouse-x', `${((e.clientX - r.left) / r.width) * 100}%`);
        heroWrap.style.setProperty('--mouse-y', `${((e.clientY - r.top) / r.height) * 100}%`);
    };
}

function setupActionChips() {
    document.querySelectorAll('.action-chip').forEach(chip => {
        chip.onclick = () => chip.classList.toggle('active');
    });
}

function sendMessage() {
    if (isGenerating) return;
    const session = getCurrentSession();
    const input = session.messages.length ? document.getElementById('chatInputBottom') : document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text && !currentMediaFiles.length) return;

    if (!session.title) session.title = generateSmartTitle(text || 'Media');
    
    const activePrompts = Array.from(document.querySelectorAll('.action-chip.active')).map(c => c.getAttribute('data-prompt'));
    const augmented = activePrompts.length ? `${text}\n[HIDDEN CONTEXT: Requirements: ${activePrompts.join(', ')}]` : text;
    
    const id = 'msg_' + Date.now();
    const media = [...currentMediaFiles];
    session.messages.push({ id, text, type: 'user', media, timestamp: Date.now() });
    saveSessions();
    
    addMessageToDOM(text || '[Media]', 'user', id, null, media);
    input.value = '';
    clearMedia();
    loadSession(session.id);
    startAITask(augmented);
}

function sendVoiceMessage(duration) {
    const session = getCurrentSession();
    if (!session.title) session.title = 'Voice Message';
    const id = 'msg_' + Date.now();
    session.messages.push({ id, type: 'user', voice: true, duration, timestamp: Date.now() });
    saveSessions();
    loadSession(session.id);
    startAITask("Received voice message.");
}

// removed function setupMediaUpload() {}
// removed function handleMediaFiles() {}
// removed function startVoiceRecording() {}
// removed function stopVoiceRecording() {}
// removed function sendVoiceMessage() {}
// removed function addVoiceMessageToDOM() {}
// removed function setupActionChips() {}
// removed function setupChatInputs() {}
// removed function setupInputField() {}
// removed function sendMessage() {}
// removed function addMessage() {}
// removed function addMessageToDOM() {}
// removed function showTypingIndicator() {}
// removed function removeTypingIndicator() {}
// removed function generateAIResponse() {}
// removed function initNetworkBackground() {}
// removed function createNewSession() {}
// removed function loadSession() {}
// removed function saveSessions() {}
// removed function updateSidebarHistory() {}
// removed function generateSmartTitle() {}