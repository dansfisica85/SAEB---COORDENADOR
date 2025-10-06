import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ProcessedDocument, SearchResult } from '@/lib/types';

// Carregar documentos processados
function loadDocuments(): ProcessedDocument[] {
  const docsPath = path.join(process.cwd(), 'data', 'processed', 'documents.json');
  
  if (!fs.existsSync(docsPath)) {
    return [];
  }
  
  const data = fs.readFileSync(docsPath, 'utf-8');
  return JSON.parse(data);
}

// Função de busca simples por similaridade
function searchDocuments(query: string, documents: ProcessedDocument[]): SearchResult[] {
  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  for (const doc of documents) {
    for (const page of doc.pages) {
      const pageText = page.text.toLowerCase();
      
      // Calcular relevância baseada em quantas palavras da query aparecem
      let relevance = 0;
      for (const word of queryWords) {
        const count = (pageText.match(new RegExp(word, 'g')) || []).length;
        relevance += count;
      }
      
      if (relevance > 0) {
        // Extrair contexto ao redor das palavras encontradas
        const firstWord = queryWords[0];
        const index = pageText.indexOf(firstWord);
        const start = Math.max(0, index - 100);
        const end = Math.min(pageText.length, index + 200);
        const excerpt = '...' + page.text.substring(start, end) + '...';
        
        results.push({
          document: doc.filename,
          pageNumber: page.pageNumber,
          excerpt,
          relevance
        });
      }
    }
  }
  
  // Ordenar por relevância
  results.sort((a, b) => b.relevance - a.relevance);
  
  // Retornar top 5 resultados
  return results.slice(0, 5);
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query é obrigatória' },
        { status: 400 }
      );
    }
    
    // Carregar documentos
    const documents = loadDocuments();
    
    if (documents.length === 0) {
      return NextResponse.json({
        answer: 'Os documentos ainda não foram processados. Por favor, execute o script de processamento primeiro.',
        results: []
      });
    }
    
    // Buscar nos documentos
    const results = searchDocuments(query, documents);
    
    if (results.length === 0) {
      return NextResponse.json({
        answer: 'Não encontrei informações relevantes sobre essa consulta nos documentos disponíveis.',
        results: []
      });
    }
    
    // Preparar contexto para a IA
    const context = results.map(r => 
      `[${r.document} - Página ${r.pageNumber}]\n${r.excerpt}`
    ).join('\n\n');
    
    // Gerar resposta com IA
    let answer = '';
    
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const prompt = `Você é um assistente especializado em documentos do SAEB (Sistema de Avaliação da Educação Básica).

Contexto dos documentos encontrados:
${context}

Pergunta do usuário: ${query}

Com base apenas nas informações fornecidas acima, responda à pergunta do usuário de forma clara e objetiva. Se as informações não forem suficientes, mencione isso.

Inclua referências aos documentos e páginas quando relevante.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        answer = response.text();
      } catch (error) {
        console.error('Erro ao chamar API Gemini:', error);
        answer = `Encontrei informações relevantes nos seguintes documentos:\n\n${results.map(r => 
          `📄 ${r.document} - Página ${r.pageNumber}`
        ).join('\n')}`;
      }
    } else {
      // Fallback se não houver API key
      answer = `Encontrei informações relevantes nos seguintes documentos:\n\n${results.map(r => 
        `📄 ${r.document} - Página ${r.pageNumber}\n"${r.excerpt}"`
      ).join('\n\n')}`;
    }
    
    return NextResponse.json({
      answer,
      results
    });
    
  } catch (error) {
    console.error('Erro na API de busca:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a busca' },
      { status: 500 }
    );
  }
}
