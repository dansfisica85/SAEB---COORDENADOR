// ============================================
// CHAT - chat.js
// Interface de chat com Google Gemini
// ============================================

// Estado do chat
let currentCategory = 'todas';
let conversationHistory = [];

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
    setupEventListeners();
    setupNavigation();
});

function initializeChat() {
    // Verifica se está autenticado
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    console.log('Chat inicializado. Categoria:', currentCategory);
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    
    // Envio de mensagem
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Limpa input
        messageInput.value = '';
        
        // Envia mensagem
        await sendMessage(message);
    });
    
    // Suggestion chips
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', async function() {
            const message = this.textContent.trim();
            await sendMessage(message);
        });
    });
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active de todos
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Adiciona active ao clicado
            this.classList.add('active');
            
            // Atualiza categoria
            currentCategory = this.dataset.section || 'todas';
            console.log('Categoria alterada para:', currentCategory);
            
            // Limpa mensagens (opcional)
            // clearMessages();
        });
    });
}

// ============================================
// FUNÇÕES DE MENSAGEM
// ============================================
async function sendMessage(text) {
    // Remove mensagem de boas-vindas
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    // Adiciona mensagem do usuário
    addMessage(text, 'user');
    
    // Adiciona indicador de loading
    const loadingId = addLoadingMessage();
    
    try {
        // Obtém contexto baseado na categoria
        const context = getContextForAI(currentCategory);
        
        // Faz chamada à API
        const response = await callGeminiAPI(text, context);
        
        // Remove loading
        removeLoadingMessage(loadingId);
        
        // Adiciona resposta
        addMessage(response, 'assistant');
        
        // Salva no histórico
        conversationHistory.push({
            user: text,
            assistant: response,
            category: currentCategory,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        
        // Remove loading
        removeLoadingMessage(loadingId);
        
        // Mostra erro
        addMessage('Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.', 'assistant');
    }
}

function addMessage(text, type) {
    const messagesContainer = document.getElementById('messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll para o final
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addLoadingMessage() {
    const messagesContainer = document.getElementById('messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message message-assistant';
    messageDiv.id = 'loading-message';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content message-loading';
    contentDiv.innerHTML = '<span></span><span></span><span></span>';
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll para o final
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return 'loading-message';
}

function removeLoadingMessage(id) {
    const loadingMessage = document.getElementById(id);
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

function clearMessages() {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-icon">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
            </div>
            <h2>Bem-vindo ao Assistente SAEB 2025</h2>
            <p>Selecione uma categoria no menu ou faça sua pergunta abaixo.</p>
        </div>
    `;
}

// ============================================
// API GEMINI
// ============================================
async function callGeminiAPI(userMessage, context) {
    const apiKey = CONFIG.apiKey;
    const endpoint = CONFIG.apiEndpoint;
    
    // Monta o prompt com contexto
    const fullPrompt = `${context}\n\nPergunta do usuário: ${userMessage}`;
    
    // Prepara o payload
    const payload = {
        contents: [{
            parts: [{
                text: fullPrompt
            }]
        }],
        generationConfig: {
            temperature: CONFIG.model.temperature,
            topK: CONFIG.model.topK,
            topP: CONFIG.model.topP,
            maxOutputTokens: CONFIG.model.maxOutputTokens,
        },
        safetySettings: CONFIG.safetySettings
    };
    
    // Faz a requisição
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro da API:', errorData);
        throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extrai o texto da resposta
    if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
            return candidate.content.parts[0].text;
        }
    }
    
    throw new Error('Resposta inesperada da API');
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================
function formatResponse(text) {
    // Formata a resposta (pode adicionar markdown, links, etc)
    return text;
}

// Exporta funções para debugging
window.chatDebug = {
    sendMessage,
    currentCategory: () => currentCategory,
    history: () => conversationHistory,
    clearMessages
};
