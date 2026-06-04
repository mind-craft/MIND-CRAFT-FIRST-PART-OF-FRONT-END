/**
 * Chat AI Module
 * Simulated AI logic and response generation
 */

var isGenerating = false;
var generationId = null;

function generateAIResponse(userMessage) {
    const responses = [
        "That's an interesting perspective! I'm here to help you explore that further.",
        "I understand what you're saying. Let me provide some insights on that.",
        "Great question! Based on your input, I'd suggest considering multiple angles.",
        "Absolutely! The MIND CRAFTS AI is designed to assist with exactly this kind of inquiry.",
        "I can help you with that. Let's break it down step by step.",
        "Fascinating! Your creativity aligns perfectly with what MIND CRAFTS can achieve."
    ];
    let res = responses[Math.floor(Math.random() * responses.length)];
    if (userMessage.includes('[HIDDEN CONTEXT:')) res += " I've integrated your selected requirements into this analysis.";
    return res;
}

function startAITask(augmentedMessage) {
    isGenerating = true;
    const start = Date.now();
    generationId = showTypingIndicator();
    document.querySelectorAll('.stop-generate-btn').forEach(b => b.style.display = 'flex');

    setTimeout(() => {
        if (!isGenerating) return;
        removeTypingIndicator(generationId);
        const dur = ((Date.now() - start) / 1000).toFixed(1);
        const text = generateAIResponse(augmentedMessage);
        const id = 'msg_' + Date.now();
        
        const session = getCurrentSession();
        session.messages.push({ id, text, type: 'bot', duration: dur, timestamp: Date.now() });
        saveSessions();
        
        addMessageToDOM(text, 'bot', id, dur);
        isGenerating = false;
        document.querySelectorAll('.stop-generate-btn').forEach(b => b.style.display = 'none');
    }, 1500 + Math.random() * 1000);
}

function stopAITask() {
    isGenerating = false;
    removeTypingIndicator(generationId);
    document.querySelectorAll('.stop-generate-btn').forEach(b => b.style.display = 'none');
}