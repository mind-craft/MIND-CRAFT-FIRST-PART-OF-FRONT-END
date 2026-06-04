/**
 * Chat UI Module
 * Handles message rendering, sidebar updates, and UI interactions
 */

function updateSidebarHistory() {
    const historyContainer = document.getElementById('chatHistory');
    if (!historyContainer) return;
    
    historyContainer.innerHTML = '';
    
    chatSessions.slice().reverse().forEach(session => {
        const item = document.createElement('div');
        item.className = 'history-item';
        if (session.id === currentSessionId) {
            item.classList.add('active');
        }
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'history-title';
        
        const isRTL = /[\u0600-\u06FF]/.test(session.title || '');
        if (isRTL) titleSpan.setAttribute('dir', 'rtl');
        
        if (session.id === currentSessionId) {
            titleSpan.textContent = 'CURRENT CHAT';
            titleSpan.setAttribute('data-real-title', session.title || 'New Chat');
        } else {
            titleSpan.textContent = session.title || 'New Chat';
        }
        
        item.appendChild(titleSpan);
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'history-actions';
        
        const editBtn = createHistoryBtn('edit', (e) => {
            e.stopPropagation();
            editChatTitle(session, titleSpan);
        });
        
        const deleteBtn = createHistoryBtn('delete', (e) => {
            e.stopPropagation();
            deleteChatSession(session.id, item);
        });
        
        actionsDiv.append(editBtn, deleteBtn);
        item.appendChild(actionsDiv);
        item.addEventListener('click', () => loadSession(session.id));
        
        historyContainer.appendChild(item);
    });
}

function createHistoryBtn(type, onClick) {
    const btn = document.createElement('button');
    btn.className = `history-action-btn ${type}`;
    btn.innerHTML = type === 'edit' 
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
    btn.addEventListener('click', onClick);
    return btn;
}

function editChatTitle(session, titleSpan) {
    const input = document.createElement('input');
    input.className = 'history-edit-input';
    input.value = session.title || 'New Chat';
    if (/[\u0600-\u06FF]/.test(input.value)) input.setAttribute('dir', 'rtl');
    
    titleSpan.replaceWith(input);
    input.focus();
    input.select();
    
    const save = () => {
        if (input.value.trim()) session.title = input.value.trim();
        saveSessions();
        updateSidebarHistory();
    };
    
    input.onblur = save;
    input.onkeydown = (e) => {
        if (e.key === 'Enter') save();
        if (e.key === 'Escape') updateSidebarHistory();
    };
}

function deleteChatSession(sessionId, itemElement) {
    itemElement.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    itemElement.style.opacity = '0';
    itemElement.style.transform = 'translateX(-20px) scale(0.95)';
    
    setTimeout(() => {
        const index = chatSessions.findIndex(s => s.id === sessionId);
        if (index > -1) {
            chatSessions.splice(index, 1);
            saveSessions();
            if (sessionId === currentSessionId) {
                if (chatSessions.length > 0) loadSession(chatSessions[chatSessions.length-1].id);
                else location.reload(); // Simple reset
            } else {
                updateSidebarHistory();
            }
        }
    }, 400);
}

function addMessageToDOM(text, type, msgId, duration = null, media = []) {
    const container = document.getElementById('messagesContainer');
    if (!container) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.setAttribute('data-msg-id', msgId);
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    if (type === 'bot') avatar.textContent = '🤖';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = text;
    
    media?.forEach(item => content.appendChild(renderMediaItem(item)));
    
    const actions = document.createElement('div');
    actions.className = 'message-actions';
    
    actions.appendChild(createActionBtn('copy', () => copyToClipboard(text, actions.querySelector('.action-btn-copy'))));
    if (type === 'user') {
        actions.appendChild(createActionBtn('edit', () => editMessage(msgId, text)));
        actions.appendChild(createActionBtn('delete', () => deleteMessageFromDOM(msgId)));
    } else if (duration) {
        const badge = document.createElement('span');
        badge.className = 'response-timer';
        badge.textContent = `Generated in ${duration}s`;
        actions.appendChild(badge);
    }
    
    messageDiv.append(avatar, content, actions);
    container.appendChild(messageDiv);
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
}

function renderMediaItem(item) {
    const el = document.createElement('div');
    const isVisual = item.type.startsWith('image/') || item.type.startsWith('video/');
    el.className = isVisual ? 'message-media' : 'message-file';
    
    if (item.type.startsWith('image/')) {
        el.innerHTML = `<img src="${item.data}" alt="${item.name}" loading="lazy">`;
    } else if (item.type.startsWith('video/')) {
        el.innerHTML = `<video src="${item.data}" controls preload="metadata"></video>`;
    } else {
        const icon = getFileIcon(item.type);
        el.innerHTML = `${icon}
                        <div class="message-file-info">
                            <div class="message-file-name">${item.name}</div>
                        </div>`;
    }
    return el;
}

function getFileIcon(type) {
    if (type.includes('pdf')) return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`;
}

function showTypingIndicator() {
    const container = document.getElementById('messagesContainer');
    const div = document.createElement('div');
    div.className = 'message bot';
    div.id = 'typing-indicator';
    div.innerHTML = '<div class="message-avatar">🤖</div><div class="message-content typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return 'typing-indicator';
}

function removeTypingIndicator(id) {
    document.getElementById(id)?.remove();
}

function createActionBtn(type, onClick) {
    const btn = document.createElement('button');
    btn.className = `action-btn action-btn-${type}`;
    const icons = {
        copy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
        edit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
        delete: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`
    };
    btn.innerHTML = icons[type];
    btn.onclick = onClick;
    return btn;
}

function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('success');
        setTimeout(() => btn.classList.remove('success'), 2000);
    });
}

function editMessage(msgId, currentText) {
    const div = document.querySelector(`[data-msg-id="${msgId}"]`);
    const content = div.querySelector('.message-content');
    const input = document.createElement('textarea');
    input.className = 'edit-input';
    input.value = currentText;
    content.replaceWith(input);
    input.focus();
    input.onblur = () => {
        const session = getCurrentSession();
        const msg = session.messages.find(m => m.id === msgId);
        if (msg) msg.text = input.value.trim();
        saveSessions();
        content.textContent = input.value.trim();
        input.replaceWith(content);
    };
}

function deleteMessageFromDOM(msgId) {
    const session = getCurrentSession();
    session.messages = session.messages.filter(m => m.id !== msgId);
    saveSessions();
    const div = document.querySelector(`[data-msg-id="${msgId}"]`);
    div.style.opacity = '0';
    setTimeout(() => div.remove(), 300);
}