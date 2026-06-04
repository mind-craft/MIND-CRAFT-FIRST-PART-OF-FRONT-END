/**
 * Chat Media Module
 * Handles media uploads, previews, and voice recording logic
 */

var currentMediaFiles = [];
var recordingInterval = null;

function setupMediaUpload(onFileAdd) {
    const btns = [document.getElementById('mediaUploadBtn'), document.getElementById('mediaUploadBtnBottom')];
    const inputs = [document.getElementById('mediaInput'), document.getElementById('mediaInputBottom')];
    const previews = ['mediaPreview', 'mediaPreviewBottom'];

    btns.forEach((btn, i) => {
        if (btn) btn.onclick = () => inputs[i].click();
    });

    inputs.forEach((input, i) => {
        if (input) input.onchange = (e) => handleFiles(e.target.files, previews[i]);
    });
}

function handleFiles(files, containerId) {
    const container = document.getElementById(containerId);
    container.style.display = 'flex';
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const item = document.createElement('div');
            item.className = 'media-preview-item';
            item.innerHTML = file.type.startsWith('image/') ? `<img src="${e.target.result}">` : `<div class="file-icon"><span>${file.name.slice(0,10)}...</span></div>`;
            
            const close = document.createElement('button');
            close.className = 'media-preview-remove';
            close.innerHTML = '×';
            close.onclick = () => {
                item.remove();
                currentMediaFiles = currentMediaFiles.filter(f => f.file !== file);
                if (!container.children.length) container.style.display = 'none';
            };
            
            item.appendChild(close);
            container.appendChild(item);
            currentMediaFiles.push({ file, data: e.target.result, type: file.type, name: file.name });
        };
        reader.readAsDataURL(file);
    });
}

function clearMedia() {
    currentMediaFiles = [];
    ['mediaPreview', 'mediaPreviewBottom'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = '';
            el.style.display = 'none';
        }
    });
}

function setupVoiceRecording(onVoiceSend) {
    [document.getElementById('voiceRecordBtn'), document.getElementById('voiceRecordBtnBottom')].forEach(btn => {
        if (btn) btn.onclick = () => startRecording(onVoiceSend);
    });
}

function startRecording(onVoiceSend) {
    const activeSession = getCurrentSession();
    const isHero = !activeSession || activeSession.messages.length === 0;
    const inputWrapper = isHero ? document.querySelector('.input-wrapper-chat.hero-input') : document.querySelector('.chat-input-container .input-wrapper-chat');
    const textarea = inputWrapper.querySelector('textarea');
    const recordBtn = isHero ? document.getElementById('voiceRecordBtn') : document.getElementById('voiceRecordBtnBottom');
    const sendBtn = isHero ? document.getElementById('sendBtn') : document.getElementById('sendBtnBottom');
    
    if (recordBtn.classList.contains('recording')) {
        stopVoiceAction(true, onVoiceSend);
        return;
    }

    const start = Date.now();
    recordBtn.classList.add('recording');
    textarea.style.display = 'none';
    
    // Create recording state elements if they don't exist
    let recordingState = inputWrapper.querySelector('.recording-state-content');
    if (!recordingState) {
        recordingState = document.createElement('div');
        recordingState.className = 'recording-state-content';
        recordingState.innerHTML = `
            <div class="recording-waveform"></div>
            <div class="recording-timer">00:00</div>
        `;
        inputWrapper.insertBefore(recordingState, recordBtn);
        
        const waveform = recordingState.querySelector('.recording-waveform');
        for (let i = 0; i < 30; i++) {
            const bar = document.createElement('div');
            bar.className = 'waveform-bar';
            bar.style.animation = `waveformPulse ${0.5 + Math.random()}s ease-in-out infinite`;
            waveform.appendChild(bar);
        }
    }
    
    recordingState.style.display = 'flex';
    
    recordingInterval = setInterval(() => {
        const s = Math.floor((Date.now() - start) / 1000);
        const timeStr = `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
        recordingState.querySelector('.recording-timer').textContent = timeStr;
    }, 1000);

    window.lastRecordingStart = start;
}

function stopVoiceAction(send, callback) {
    clearInterval(recordingInterval);
    const wrappers = document.querySelectorAll('.input-wrapper-chat');
    wrappers.forEach(w => {
        const txt = w.querySelector('textarea');
        const state = w.querySelector('.recording-state-content');
        if (txt) txt.style.display = 'block';
        if (state) state.style.display = 'none';
    });
    
    document.querySelectorAll('.voice-record-btn').forEach(b => b.classList.remove('recording'));

    if (send && window.lastRecordingStart) {
        const dur = Math.floor((Date.now() - window.lastRecordingStart) / 1000);
        callback(`${Math.floor(dur/60).toString().padStart(2,'0')}:${(dur%60).toString().padStart(2,'0')}`);
    }
    window.lastRecordingStart = null;
}

