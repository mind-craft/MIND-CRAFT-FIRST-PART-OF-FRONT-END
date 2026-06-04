/**
 * Chat State Module
 * Manages chat sessions, persistence, and session lifecycle
 */

var chatSessions = JSON.parse(localStorage.getItem('chatSessions')) || [];
var currentSessionId = null;

function saveSessions() {
    localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
}

function getCurrentSession() {
    return chatSessions.find(s => s.id === currentSessionId);
}

function setCurrentSessionId(id) {
    currentSessionId = id;
}

function addSession(session) {
    chatSessions.push(session);
    saveSessions();
}

function removeSession(sessionId) {
    chatSessions = chatSessions.filter(s => s.id !== sessionId);
    saveSessions();
}

function generateSmartTitle(message) {
    const words = message.trim().split(/\s+/);
    if (words.length <= 3) return message;
    
    const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'can', 'could', 'will', 'would', 'please', 'help', 'me', 'with'];
    const meaningfulWords = words.filter(w => !stopWords.includes(w.toLowerCase()));
    
    const titleWords = meaningfulWords.slice(0, 3);
    let title = titleWords.join(' ');
    
    title = title.charAt(0).toUpperCase() + title.slice(1);
    
    if (title.length > 25) {
        title = title.substring(0, 22) + '...';
    }
    
    return title || message.substring(0, 20);
}