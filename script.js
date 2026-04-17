(function() {
    // ESTAS CONFIGURAÇÕES MUDAM PARA CADA CLIENTE QUE VOCÊ VENDER
    const CONFIG = {
        apiUrl: "https://chatbot-pi-tawny-68.vercel.app/chat", // URL da sua Vercel
        token: "token-loja-001",                       // Token único do cliente
        nomeBot: "Suporte AuAu",                      // Nome que aparece no topo
        corPrincipal: "#2c3e50"                       // Cor do chat do cliente
    };

    const chatHTML = `
        <div id="chat-container" style="position:fixed; bottom:20px; right:20px; z-index:9999; font-family:Arial,sans-serif;">
            <div id="chat-bubble" style="width:60px; height:60px; background:${CONFIG.corPrincipal}; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; color:white; font-size:24px; box-shadow:0 4px 10px rgba(0,0,0,0.3);">💬</div>
            <div id="chat-window" style="display:none; position:absolute; bottom:80px; right:0; width:320px; height:450px; background:white; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.2); flex-direction:column; overflow:hidden; border:1px solid #ddd;">
                <div style="background:${CONFIG.corPrincipal}; color:white; padding:15px; font-weight:bold; display:flex; justify-content:space-between;">
                    <span>${CONFIG.nomeBot}</span>
                    <span id="chat-close" style="cursor:pointer;">✕</span>
                </div>
                <div id="chat-msgs" style="flex:1; padding:15px; overflow-y:auto; background:#fdfdfd; display:flex; flex-direction:column; gap:10px;"></div>
                <div style="padding:10px; border-top:1px solid #eee; display:flex;">
                    <input type="text" id="chat-input" placeholder="Pergunte algo..." style="flex:1; border:none; outline:none; font-size:14px;">
                    <button id="chat-send" style="background:none; border:none; color:${CONFIG.corPrincipal}; cursor:pointer; font-weight:bold;">Enviar</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const bubble = document.getElementById('chat-bubble');
    const win = document.getElementById('chat-window');
    const msgs = document.getElementById('chat-msgs');
    const input = document.getElementById('chat-input');
    const btn = document.getElementById('chat-send');

    bubble.onclick = () => win.style.display = win.style.display === 'none' ? 'flex' : 'none';
    document.getElementById('chat-close').onclick = () => win.style.display = 'none';

    function addMsg(sender, text) {
        const div = document.createElement('div');
        const isMe = sender === 'Você';
        div.style.cssText = `padding:8px 12px; border-radius:10px; font-size:14px; max-width:80%; ${isMe ? 'align-self:flex-end; background:#e1ffc7;' : 'align-self:flex-start; background:#fff; border:1px solid #eee;'}`;
        div.innerHTML = `<strong>${sender}:</strong><br>${text}`;
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    }

    async function send() {
        const text = input.value.trim();
        if (!text) return;

        addMsg('Você', text);
        input.value = 'Digitando...';
        input.disabled = true;

        try {
            const r = await fetch(CONFIG.apiUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ message: text, token: CONFIG.token })
            });
            const d = await r.json();
            addMsg('Bot', d.reply);
        } catch {
            addMsg('Erro', 'Tente novamente.');
        } finally {
            input.value = '';
            input.disabled = false;
            input.focus();
        }
    }

    btn.onclick = send;
    input.onkeypress = (e) => { if(e.key === 'Enter') send(); };
})();
