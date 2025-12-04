document.addEventListener("DOMContentLoaded", function() {
    // 1. Injeta o HTML do Chat (Com botão de tema novo)
    const chatHTML = `
        <button class="netsafe-trigger" onclick="toggleChat()">
            <i class="fas fa-shield-alt"></i> <span class="netsafe-label">NetSafe AI</span>
        </button>
        
        <div class="netsafe-window" id="netSafeWindow" data-theme="dark">
            <div class="chat-header">
                <div class="header-info">
                    <div class="bot-avatar"><i class="fas fa-robot"></i></div>
                    <div class="header-text"><h3>NetSafe AI</h3></div>
                </div>
                <div class="header-actions">
                    <button class="icon-btn" onclick="toggleTheme()" title="Mudar Tema">
                        <i class="fas fa-sun" id="themeIcon"></i>
                    </button>
                    <button class="icon-btn" onclick="toggleChat()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="chat-body" id="chatBody">
                <div class="message bot-msg">
                    Olá! Sou o NetSafe. 🛡️<br>
                    Posso ajudar com segurança ou dados do painel.
                </div>
            </div>
            
            <div class="chat-footer">
                <input type="text" class="chat-input" id="userInput" placeholder="Digite sua dúvida..." onkeypress="handleKeyPress(event)">
                <button class="send-btn" onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    
    const div = document.createElement('div');
    div.innerHTML = chatHTML;
    document.body.appendChild(div);
});

// --- Lógica de Interface ---

function toggleChat() {
    const w = document.getElementById('netSafeWindow');
    w.style.display = (w.style.display === 'flex') ? 'none' : 'flex';
}

function toggleTheme() {
    const windowEl = document.getElementById('netSafeWindow');
    const iconEl = document.getElementById('themeIcon');
    
    // Verifica qual é o tema atual
    const currentTheme = windowEl.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        // Muda para CLARO
        windowEl.setAttribute('data-theme', 'light');
        iconEl.className = 'fas fa-moon'; // Troca ícone para Lua
    } else {
        // Muda para ESCURO
        windowEl.setAttribute('data-theme', 'dark');
        iconEl.className = 'fas fa-sun'; // Troca ícone para Sol
    }
}

function handleKeyPress(e) { if (e.key === 'Enter') sendMessage(); }

// --- Lógica de Envio (Igual ao anterior) ---
async function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text) return;
    
    appendMsg(text, 'user-msg');
    input.value = '';
    
    const loadId = 'load-' + Date.now();
    appendMsg('<i class="fas fa-spinner fa-spin"></i> ...', 'bot-msg', loadId);

    try {
        const req = await fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ message: text })
        });
        const res = await req.json();
        document.getElementById(loadId).innerHTML = res.response.replace(/\n/g, '<br>');
    } catch (err) {
        document.getElementById(loadId).innerHTML = "⚠️ Erro: Backend offline.";
    }
}

function appendMsg(html, cls, id) {
    const d = document.createElement('div');
    d.className = `message ${cls}`;
    if(id) d.id = id;
    d.innerHTML = html;
    const b = document.getElementById('chatBody');
    b.appendChild(d);
    b.scrollTop = b.scrollHeight;
}