// ============================================
// CONFIGURAÇÃO - config.js
// Configurações da API Google Gemini
// ============================================

const CONFIG = {
    // ==================================================
    // OpenRouter API - Sistema de IA Principal
    // ==================================================
    provider: 'openrouter',
    
    // Nova chave OpenRouter
    apiKey: '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',
    
    // Endpoint da API OpenRouter
    apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
    
    // Modelo gratuito do OpenRouter
    model: 'meta-llama/llama-3.2-3b-instruct:free',
    
    // ==================================================
    // OPÇÃO 2: OpenRouter (se conseguir ativar)
    // ==================================================
    openrouterKey: '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',
    openrouterEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
    openrouterModel: 'meta-llama/llama-3.2-3b-instruct:free',
    
    // ==================================================
    // OPÇÃO 2: Google Gemini (se ativar a API)
    // ==================================================
    geminiKey: 'AIzaSyAo-sK56pBwFeR3dlLXFOetHFyLVCt_9LY',
    geminiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    
    // Configurações do modelo
    temperature: 0.7,
    maxTokens: 2048,
    
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
