document.addEventListener("DOMContentLoaded", function() {
    
    const caminhoImagemMascote = "Assets/Mascote.jpg"; 

    // 1. Injeta o HTML do Chat
    const chatHTML = `
        <button class="netsafe-trigger" onclick="toggleChat()">
            <i class="fas fa-shield-alt"></i> 
            <span class="netsafe-label">NetSafe AI</span>
        </button>
        
        <div class="netsafe-window" id="netSafeWindow">
            <div class="chat-header">
                <div class="header-info">
                    <div class="bot-avatar">
                        <img src="${caminhoImagemMascote}" alt="Mascote NetSafe" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                    </div>
                    <div class="header-text"><h3>NetSafe AI</h3></div>
                </div>
                
                <div class="header-actions-container">
                    <button class="theme-btn" onclick="toggleThemeChat()" title="Alternar Tema">
                        <i class="fas fa-moon" id="themeIcon"></i>
                    </button>

                    <button class="close-btn" onclick="toggleChat()"><i class="fas fa-times"></i></button>
                </div>
            </div>
            
            <div class="chat-body" id="chatBody">
                <div class="message bot-msg">
                    Olá! Sou o NetSafe. 🛡️<br>
                    O meu tema segue o do site principal!

                    <div class="suggestions" style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="chip" onclick="sendQuickMsg('O que é uma CVE?')" style="background:transparent; border:1px solid var(--accent-color); color:var(--accent-color); padding:5px 12px; border-radius:20px; font-size:12px; cursor:pointer;">O que é CVE?</button>
                        <button class="chip" onclick="sendQuickMsg('Qual o setor mais atacado?')" style="background:transparent; border:1px solid var(--accent-color); color:var(--accent-color); padding:5px 12px; border-radius:20px; font-size:12px; cursor:pointer;">Setor Crítico</button>
                        <button class="chip" onclick="sendQuickMsg('Quem são os criadores do projeto?')" style="background:transparent; border:1px solid var(--accent-color); color:var(--accent-color); padding:5px 12px; border-radius:20px; font-size:12px; cursor:pointer;">Criadores</button>
                    </div>
                </div>
            </div>
            
            <div class="chat-footer">
                <input type="text" class="chat-input" id="userInput" placeholder="Digite..." onkeypress="handleKeyPress(event)">
                <button class="send-btn" onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    
    const div = document.createElement('div');
    div.innerHTML = chatHTML;
    document.body.appendChild(div);

    // Sincroniza botões da página principal
    const pageButtons = document.querySelectorAll('.btn-control');
    pageButtons.forEach(btn => {
        if(btn.innerText.includes('Modo') || btn.innerText.includes('Escuro')) {
            btn.onclick = function() { toggleThemeChat(); };
        }
    });
});

// --- Funções Lógicas ---

function toggleChat() {
    const w = document.getElementById('netSafeWindow');
    w.style.display = (w.style.display === 'flex') ? 'none' : 'flex';
}

function toggleThemeChat() {
    // Essa linha adiciona/remove a classe que o CSS agora reconhece
    document.body.classList.toggle('light-mode');
    
    const isLight = document.body.classList.contains('light-mode');
    const icon = document.getElementById('themeIcon');
    
    if (icon) {
        if (isLight) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Atualiza botões da página
    const pageButtons = document.querySelectorAll('.btn-control');
    pageButtons.forEach(btn => {
        if(btn.innerText.includes('Modo')) {
            btn.innerText = isLight ? "Modo Escuro" : "Modo Claro";
        }
    });
}

function sendQuickMsg(text) {
    const input = document.getElementById('userInput');
    input.value = text; 
    sendMessage(); 
}

function handleKeyPress(e) { if (e.key === 'Enter') sendMessage(); }

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
