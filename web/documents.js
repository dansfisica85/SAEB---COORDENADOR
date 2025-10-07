// ============================================
// DOCUMENTOS - documents.js
// Base de conhecimento SAEB 2025
// ============================================

const DOCUMENTS = {
    // SCAN0000.PDF - 2 páginas
    scan0000: {
        filename: 'SCAN0000.PDF',
        totalPages: 2,
        title: 'Manual de Procedimentos SAEB 2025',
        category: 'procedimentos',
        pages: [
            {
                page: 1,
                content: 'Página 1 - Capa e Introdução do Manual de Procedimentos SAEB 2025. Contém informações iniciais sobre o Sistema de Avaliação da Educação Básica.'
            },
            {
                page: 2,
                content: 'Página 2 - Orientações gerais sobre a aplicação do SAEB 2025 e responsabilidades dos coordenadores.'
            }
        ]
    },
    
    // SCAN0001.PDF - 79 páginas
    scan0001: {
        filename: 'SCAN0001.PDF',
        totalPages: 79,
        title: 'Manual Completo SAEB 2025 - Aplicação e Coordenação',
        category: 'todas',
        pages: [
            // Seção: Aplicação (páginas 1-20)
            {
                page: 1,
                category: 'aplicacao',
                content: 'Introdução ao processo de aplicação do SAEB 2025. Cronograma geral e etapas principais.'
            },
            {
                page: 2,
                category: 'aplicacao',
                content: 'Materiais necessários para aplicação: cadernos de teste, cartões de resposta, lista de presença.'
            },
            {
                page: 3,
                category: 'aplicacao',
                content: 'Preparação da sala de aplicação: disposição das carteiras, identificação, materiais de apoio.'
            },
            {
                page: 4,
                category: 'aplicacao',
                content: 'Protocolo de recebimento dos estudantes: conferência de documentos, orientações iniciais.'
            },
            {
                page: 5,
                category: 'aplicacao',
                content: 'Procedimentos para leitura das instruções: tempo, clareza, dúvidas permitidas.'
            },
            // Páginas 6-20: mais detalhes sobre aplicação
            ...Array.from({length: 15}, (_, i) => ({
                page: i + 6,
                category: 'aplicacao',
                content: `Página ${i + 6} - Procedimentos específicos de aplicação, instruções para aplicadores e coordenadores.`
            })),
            
            // Seção: Procedimentos (páginas 21-40)
            {
                page: 21,
                category: 'procedimentos',
                content: 'Procedimentos administrativos: controle de presença, documentação necessária, relatórios.'
            },
            {
                page: 22,
                category: 'procedimentos',
                content: 'Gestão de materiais: recebimento, conferência, distribuição e devolução de cadernos.'
            },
            {
                page: 23,
                category: 'procedimentos',
                content: 'Controle de tempo: duração das provas, intervalos, procedimentos para atrasos.'
            },
            {
                page: 24,
                category: 'procedimentos',
                content: 'Procedimentos para estudantes com necessidades especiais: adaptações, tempo adicional, recursos de acessibilidade.'
            },
            {
                page: 25,
                category: 'procedimentos',
                content: 'Protocolo de segurança: lacres, acondicionamento de materiais, cadeia de custódia.'
            },
            // Páginas 26-40: mais procedimentos
            ...Array.from({length: 15}, (_, i) => ({
                page: i + 26,
                category: 'procedimentos',
                content: `Página ${i + 26} - Procedimentos operacionais, protocolos de segurança e documentação.`
            })),
            
            // Seção: Coordenação (páginas 41-60)
            {
                page: 41,
                category: 'coordenacao',
                content: 'Atribuições do coordenador de aplicação: supervisão, resolução de problemas, comunicação com INEP.'
            },
            {
                page: 42,
                category: 'coordenacao',
                content: 'Gestão da equipe de aplicadores: orientação, distribuição de tarefas, suporte durante aplicação.'
            },
            {
                page: 43,
                category: 'coordenacao',
                content: 'Protocolo de comunicação: contatos de emergência, canais oficiais, prazos de resposta.'
            },
            {
                page: 44,
                category: 'coordenacao',
                content: 'Resolução de problemas: estudantes ausentes, materiais danificados, incidentes durante aplicação.'
            },
            {
                page: 45,
                category: 'coordenacao',
                content: 'Relatório final: elaboração, informações obrigatórias, prazos de entrega.'
            },
            // Páginas 46-60: mais orientações para coordenação
            ...Array.from({length: 15}, (_, i) => ({
                page: i + 46,
                category: 'coordenacao',
                content: `Página ${i + 46} - Gestão e coordenação do processo de aplicação, liderança da equipe.`
            })),
            
            // Seção: Orientações Gerais (páginas 61-79)
            {
                page: 61,
                category: 'orientacoes',
                content: 'Orientações gerais sobre o SAEB: objetivos, componentes curriculares avaliados, escalas de proficiência.'
            },
            {
                page: 62,
                category: 'orientacoes',
                content: 'Cronograma completo: datas de aplicação, prazos de entrega de materiais, divulgação de resultados.'
            },
            {
                page: 63,
                category: 'orientacoes',
                content: 'Legislação e normas: resoluções do INEP, portarias aplicáveis, diretrizes do MEC.'
            },
            {
                page: 64,
                category: 'orientacoes',
                content: 'Ética e sigilo: confidencialidade dos dados, proteção de informações, responsabilidades legais.'
            },
            {
                page: 65,
                category: 'orientacoes',
                content: 'Suporte técnico: canais de atendimento, FAQ, resolução de dúvidas técnicas.'
            },
            // Páginas 66-79: orientações complementares
            ...Array.from({length: 14}, (_, i) => ({
                page: i + 66,
                category: 'orientacoes',
                content: `Página ${i + 66} - Orientações complementares, legislação e normas do SAEB 2025.`
            }))
        ]
    }
};

/**
 * Busca documentos por categoria
 */
function getDocumentsByCategory(category) {
    const results = [];
    
    Object.values(DOCUMENTS).forEach(doc => {
        if (category === 'todas' || doc.category === category) {
            results.push(doc);
        } else {
            // Busca páginas específicas da categoria
            const categoryPages = doc.pages.filter(page => 
                page.category === category || doc.category === category
            );
            
            if (categoryPages.length > 0) {
                results.push({
                    ...doc,
                    pages: categoryPages
                });
            }
        }
    });
    
    return results;
}

/**
 * Busca texto nos documentos
 */
function searchInDocuments(query) {
    const results = [];
    const queryLower = query.toLowerCase();
    
    Object.values(DOCUMENTS).forEach(doc => {
        doc.pages.forEach(page => {
            if (page.content.toLowerCase().includes(queryLower)) {
                results.push({
                    document: doc.filename,
                    page: page.page,
                    content: page.content,
                    category: page.category || doc.category
                });
            }
        });
    });
    
    return results;
}

/**
 * Obtém contexto para a IA baseado na categoria atual
 */
function getContextForAI(category = 'todas') {
    const docs = getDocumentsByCategory(category);
    
    let context = `Você é um assistente especializado no SAEB 2025 (Sistema de Avaliação da Educação Básica). 
Você tem acesso aos seguintes documentos:\n\n`;
    
    docs.forEach(doc => {
        context += `${doc.filename} (${doc.totalPages} páginas) - ${doc.title}\n`;
        
        // Adiciona resumo das primeiras páginas
        const previewPages = doc.pages.slice(0, 3);
        previewPages.forEach(page => {
            context += `  - Página ${page.page}: ${page.content.substring(0, 100)}...\n`;
        });
    });
    
    context += `\nResponda às perguntas do coordenador de forma clara, objetiva e baseada nos documentos. 
Sempre cite a página e documento quando possível. Se a informação não estiver nos documentos, informe isso claramente.`;
    
    return context;
}

// Exporta para uso global
window.DOCUMENTS = DOCUMENTS;
window.getDocumentsByCategory = getDocumentsByCategory;
window.searchInDocuments = searchInDocuments;
window.getContextForAI = getContextForAI;
