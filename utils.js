/**
 * UI Utilities and Shared Helpers
 */

function showNotice(title, msg, success = true) {
    const noticeTitle = document.getElementById('notice-title');
    const noticeMsg = document.getElementById('notice-msg');
    const noticeIcon = document.querySelector('.notice-icon');
    const noticeOverlay = document.getElementById('notice-overlay');

    if (!noticeTitle || !noticeMsg || !noticeIcon || !noticeOverlay) return;

    noticeTitle.textContent = title;
    noticeMsg.textContent = msg;
    noticeIcon.textContent = success ? "✓" : "✕";
    noticeIcon.style.color = success ? "var(--success)" : "var(--error)";
    
    noticeOverlay.style.display = 'flex';
    setTimeout(() => {
        noticeOverlay.style.display = 'none';
    }, 2500);
}

// Google Auth Simulation
function initGoogleAuth() {
    const googleBtn = document.getElementById('google-auth');
    if (googleBtn) {
        googleBtn.onclick = () => {
            showNotice("Google Sync", "Authenticating via Google Cloud...", true);
        };
    }
}