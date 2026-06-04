/**
 * Main Application Entry Point
 * Orchestrates module initialization and transitions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Auth Module
    initAuth(() => transitionToChatbot());
    
    // Initialize shared utilities
    initGoogleAuth();
});

function transitionToChatbot() {
    const mainContainer = document.getElementById('mainContainer');
    const chatbotDashboard = document.getElementById('chatbot-dashboard');
    
    if (!mainContainer || !chatbotDashboard) return;

    // Fade out login
    mainContainer.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    mainContainer.style.opacity = '0';
    mainContainer.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        mainContainer.style.display = 'none';
        chatbotDashboard.classList.remove('dashboard-hidden');
        
        // Initialize Dashboard Modules
        initSidebar();
        initChat();
    }, 600);
}

// removed function showLogin() {}
// removed function showSignup() {}
// removed function attachToggles() {}
// removed function checkMatch() {}
// removed function showNotice() {}
// removed function initializeChatbot() {}
// removed function setupActionChips() {}
// removed function setupChatInput() {}
// removed function setupInputField() {}
// removed function sendMessage() {}
// removed function addMessage() {}
// removed function showTypingIndicator() {}
// removed function removeTypingIndicator() {}
// removed function generateAIResponse() {}