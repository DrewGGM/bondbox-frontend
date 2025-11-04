import React, { useRef, useEffect } from 'react';
import { useAiChatStore } from '@/store/aiChatStore';
import { Header } from '@/components/layout/Header';
import { ChatHeader } from '@/components/features/ai/ChatHeader';
import { ChatMessage } from '@/components/features/ai/ChatMessage';
import { ChatInput } from '@/components/features/ai/ChatInput';
import { QuickSuggestions } from '@/components/features/ai/QuickSuggestions';
//import { ChatSidebar } from '@/components/features/ai/ChatSidebar';
import { aiService, type ConversationMessage } from '@/api/services/aiService';
import type { Message } from '@/types/ai.types';

export const BondyAIPage: React.FC = () => {
  const { messages, isTyping, addMessage, addMCPResponse, setTyping } = useAiChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Construir historial de conversación (excluir mensaje inicial de bienvenida y limitar a últimos 10 mensajes)
    const conversationHistory: ConversationMessage[] = messages
      .filter(msg => msg.id !== '1') // Excluir mensaje de bienvenida
      .slice(-10) // Últimos 10 mensajes
      .map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // Consultar al agente de IA con historial de conversación
    setTyping(true);
    try {
      const response = await aiService.queryAI(content, conversationHistory);

      // Usar la nueva función para manejar respuestas MCP
      addMCPResponse(response);
    } catch (error) {
      console.error('Error al consultar el agente:', error);

      // Extraer mensaje de error específico
      const errorMessage = error instanceof Error
        ? error.message
        : 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.';

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: errorMessage,
        timestamp: new Date(),
      };
      addMessage(errorResponse);
    } finally {
      setTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 w-full mx-auto p-3 md:p-6 flex gap-6 h-[calc(100vh-64px)] max-w-7xl">
        {/* Main Chat Area */}
        <div className="flex-1 bg-white rounded-lg md:rounded-xl shadow-sm flex flex-col overflow-hidden">
          <ChatHeader />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-5">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isTyping && (
              <div className="flex gap-2 md:gap-3 max-w-[95%] md:max-w-[80%]">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0 bg-gradient-to-br from-primary to-primary-dark text-white">
                  B
                </div>
                <div className="px-3 py-2 md:px-4 md:py-3 bg-gray-100 rounded-xl rounded-bl-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs md:text-sm text-gray-600">Bondy está procesando...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <QuickSuggestions onSuggestionClick={handleSuggestionClick} />
          <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
        {/* <ChatSidebar stats={stats} /> */}
      </div>
    </div>
  );
};