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
// API - Suporta OpenRouter e Google Gemini
// ============================================
async function callGeminiAPI(userMessage, context) {
    const provider = CONFIG.provider || 'openrouter';
    
    // Monta o prompt com contexto
    const fullPrompt = `${context}\n\nPergunta do usuário: ${userMessage}`;
    
    if (provider === 'offline') {
        // ==== SISTEMA OFFLINE ====
        // Busca resposta baseada nos documentos
        return generateOfflineResponse(userMessage, context);
        
    } else if (provider === 'openrouter') {
        // ==== OPENROUTER API ====
        const payload = {
            model: CONFIG.openrouterModel,
            messages: [
                {
                    role: 'user',
                    content: fullPrompt
                }
            ],
            temperature: CONFIG.temperature,
            max_tokens: CONFIG.maxTokens
        };
        
        const response = await fetch(CONFIG.openrouterEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.openrouterKey}`
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Erro da API:', errorData);
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        }
        
        throw new Error('Resposta inesperada da API');
        
    } else {
        // ==== GOOGLE GEMINI API ====
        const payload = {
            contents: [{
                parts: [{
                    text: fullPrompt
                }]
            }],
            generationConfig: {
                temperature: CONFIG.temperature,
                maxOutputTokens: CONFIG.maxTokens,
            }
        };
        
        const response = await fetch(`${CONFIG.geminiEndpoint}?key=${CONFIG.geminiKey}`, {
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
        
        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                return candidate.content.parts[0].text;
            }
        }
        
        throw new Error('Resposta inesperada da API');
    }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================
function formatResponse(text) {
    // Formata a resposta (pode adicionar markdown, links, etc)
    return text;
}

// ============================================
// SISTEMA OFFLINE - Respostas inteligentes
// ============================================
function generateOfflineResponse(userMessage, context) {
    const message = userMessage.toLowerCase();
    
    // Respostas específicas para SAEB 2025
    if (message.includes('saeb') || message.includes('avaliação')) {
        return `O SAEB 2025 é uma avaliação educacional do Sistema de Avaliação da Educação Básica. 

📋 **Principais informações:**
• É aplicado a cada dois anos para estudantes da educação básica
• Avalia competências em Língua Portuguesa e Matemática
• Fornece diagnóstico da qualidade do ensino brasileiro
• Os resultados são usados para políticas educacionais

${context.includes('aplicacao') ? 
'📝 **Para aplicação:** Siga rigorosamente os procedimentos do manual de aplicação.' : 
'💡 Use o menu lateral para navegar pelas categorias específicas.'}`;
    }
    
    if (message.includes('coordenador') || message.includes('coordenação')) {
        return `Como **Coordenador do SAEB 2025**, suas principais responsabilidades incluem:

🎯 **Funções principais:**
• Organizar e supervisionar a aplicação
• Orientar aplicadores e fiscais
• Garantir o cumprimento dos procedimentos
• Resolver questões durante a aplicação
• Elaborar relatórios pós-aplicação

📋 **Documentos importantes:**
• Manual do Coordenador
• Lista de presença dos estudantes
• Atas de aplicação
• Relatório de ocorrências

💡 **Dica:** Mantenha sempre comunicação com a equipe do INEP para dúvidas.`;
    }
    
    if (message.includes('aplicação') || message.includes('aplicar')) {
        return `📝 **Procedimentos de Aplicação do SAEB 2025:**

⏰ **Horários:**
• Início: 7h30 (conferir horário local)
• Duração: 4h30 para cada turno
• Intervalo: 15 minutos (obrigatório)

👥 **Equipe necessária:**
• 1 Aplicador para cada 25 estudantes
• 1 Fiscal por sala
• 1 Coordenador por escola

📋 **Materiais obrigatórios:**
• Cadernos de prova lacrados
• Cartões de respostas
• Lista de presença
• Ata de aplicação

⚠️ **IMPORTANTE:** Conferir documentos dos estudantes e manter rigoroso controle do tempo.`;
    }
    
    if (message.includes('procedimento') || message.includes('como fazer')) {
        return `📋 **Procedimentos Gerais do SAEB 2025:**

🔐 **Antes da aplicação:**
• Verificar lacres dos materiais
• Conferir quantidades de provas e cartões
• Organizar salas conforme orientações
• Briefing com toda a equipe

📝 **Durante a aplicação:**
• Seguir rigorosamente os horários
• Não permitir uso de celulares
• Auxiliar apenas com dúvidas sobre preenchimento
• Registrar todas as ocorrências

✅ **Após a aplicação:**
• Recolher todos os materiais
• Preencher atas e relatórios
• Lacrar envelopes conforme instruções
• Enviar documentação no prazo

💡 **Em caso de dúvidas:** Consulte o manual ou entre em contato com o suporte do INEP.`;
    }
    
    if (message.includes('orientações') || message.includes('orientação')) {
        return `📋 **Orientações Importantes SAEB 2025:**

👨‍🎓 **Para estudantes:**
• Trazer documento com foto
• Caneta esferográfica azul ou preta
• Não usar corretor líquido
• Preencher cartão-resposta corretamente

👨‍🏫 **Para aplicadores:**
• Chegar 1h antes do início
• Portar documento de identidade
• Seguir script de aplicação
• Não dar dicas sobre as questões

🏫 **Para a escola:**
• Disponibilizar salas adequadas
• Garantir silêncio durante a prova
• Providenciar água e banheiros limpos
• Apoiar a equipe de aplicação

⚠️ **ATENÇÃO:** Qualquer irregularidade deve ser comunicada imediatamente ao coordenador.`;
    }
    
    // Resposta genérica baseada no contexto
    const contextWords = context.split(' ').slice(0, 100).join(' ');
    
    return `Com base nos documentos do SAEB 2025, aqui estão as informações relevantes:

${contextWords}...

💡 **Sugestões:**
• Use o menu lateral para navegar pelas categorias específicas
• Faça perguntas mais específicas sobre: aplicação, procedimentos, coordenação ou orientações
• Consulte sempre o manual oficial para confirmação

📞 **Suporte:** Em caso de dúvidas, entre em contato com o INEP através dos canais oficiais.`;
}

// Exporta funções para debugging
window.chatDebug = {
    sendMessage,
    currentCategory: () => currentCategory,
    history: () => conversationHistory,
    clearMessages
};
