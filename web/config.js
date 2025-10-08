// ============================================
// CONFIGURAÇÃO - config.js
// Configurações da API Google Gemini
// ============================================

const CONFIG = {
    // API Key do Google Gemini
    apiKey: 'AIzaSyAo-sK56pBwFeR3dlLXFOetHFyLVCt_9LY',
    
    // Endpoint da API (atualizado para v1beta)
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    
    // Configurações do modelo
    model: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
    },
    
    // Configurações de segurança
    safetySettings: [
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
    ]
};

// Exporta configuração para uso global
window.CONFIG = CONFIG;
