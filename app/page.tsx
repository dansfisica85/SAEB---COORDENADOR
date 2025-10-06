'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, LogOut, Search, FileText, Loader2, BookOpen } from 'lucide-react';
import { ChatMessage, SearchResult } from '@/lib/types';

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('todas');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: 'todas', name: 'Todas as Seções' },
    { id: 'aplicacao', name: 'Aplicação da Prova' },
    { id: 'procedimentos', name: 'Procedimentos' },
    { id: 'coordenacao', name: 'Coordenação' },
    { id: 'orientacoes', name: 'Orientações Gerais' },
  ];

  const frequentQuestions = [
    'Como aplicar a prova do SAEB?',
    'Quais são as responsabilidades do coordenador?',
    'Qual o procedimento em caso de ausência de aplicador?',
    'Como organizar as salas para aplicação?',
    'Quais documentos são necessários?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.answer || 'Desculpe, não consegui processar sua solicitação.',
        results: data.results || [],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Erro ao processar sua solicitação. Por favor, tente novamente.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SAEB 2025</h1>
              <p className="text-sm text-gray-600">Sistema de Pesquisa</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Seções</h2>
            <div className="space-y-2">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    selectedSection === section.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Perguntas Frequentes</h2>
            <div className="space-y-2">
              {frequentQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Chat de Pesquisa - {sections.find(s => s.id === selectedSection)?.name}
          </h2>
          <p className="text-sm text-gray-600">
            Faça perguntas sobre os documentos do SAEB
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Search className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Bem-vindo ao Sistema de Pesquisa SAEB
              </h3>
              <p className="text-gray-600 max-w-md">
                Faça perguntas sobre os documentos e receberá respostas baseadas no conteúdo,
                com referências às páginas e slides relevantes.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-2xl px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.results && message.results.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <p className="text-sm font-semibold text-gray-700">
                        📚 Fontes encontradas:
                      </p>
                      {message.results.map((result, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded-lg p-3 text-sm"
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {result.document}
                              </p>
                              <p className="text-xs text-gray-600">
                                Página/Slide: {result.pageNumber}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 text-xs leading-relaxed">
                            {result.excerpt}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua pergunta sobre os documentos do SAEB..."
              className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
