/**
 * Sidebar Module
 * Handles collapsible behavior and persistence
 */

function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const chatSidebar = document.getElementById('chatSidebar');
    
    // Load state
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (sidebarCollapsed) {
        document.body.classList.add('sidebar-collapsed');
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-collapsed');
            const isCollapsed = document.body.classList.contains('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
            
            if (window.innerWidth <= 768 && chatSidebar) {
                chatSidebar.classList.toggle('mobile-open');
            }
        });
    }

    // Mobile click-outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && chatSidebar && sidebarToggle) {
            if (!chatSidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                chatSidebar.classList.remove('mobile-open');
            }
        }
    });
    
    // Hover reveal for active chat title
    setupActiveHoverReveal();
}

function setupActiveHoverReveal() {
    const historyContainer = document.getElementById('chatHistory');
    if (!historyContainer) return;
    
    historyContainer.addEventListener('mouseover', (e) => {
        const item = e.target.closest('.history-item.active');
        if (!item) return;
        
        const titleSpan = item.querySelector('.history-title');
        if (!titleSpan) return;
        
        const realTitle = titleSpan.getAttribute('data-real-title');
        if (realTitle) {
            titleSpan.textContent = realTitle;
        }
    });
    
    historyContainer.addEventListener('mouseout', (e) => {
        const item = e.target.closest('.history-item.active');
        if (!item) return;
        
        const titleSpan = item.querySelector('.history-title');
        if (!titleSpan) return;
        
        const realTitle = titleSpan.getAttribute('data-real-title');
        if (realTitle) {
            titleSpan.textContent = 'CURRENT CHAT';
        }
    });
}