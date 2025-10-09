import React, { useRef, useEffect } from 'react';
import { useAiChatStore } from '@/store/aiChatStore';
import { Header } from '@/components/layout/Header';
import { ChatHeader } from '@/components/features/ai/ChatHeader';
import { ChatMessage } from '@/components/features/ai/ChatMessage';
import { ChatInput } from '@/components/features/ai/ChatInput';
import { QuickSuggestions } from '@/components/features/ai/QuickSuggestions';
//import { ChatSidebar } from '@/components/features/ai/ChatSidebar';
import { aiService } from '@/api/services/aiService';
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
    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // Consultar al agente de IA
    setTyping(true);
    try {
      const response = await aiService.queryAI(content);
      
      // Usar la nueva función para manejar respuestas MCP
      addMCPResponse(response);
    } catch (error) {
      console.error('Error al consultar el agente:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.',
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
      
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 flex gap-6 h-[calc(100vh-64px)]">
        {/* Main Chat Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden">
          <ChatHeader />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-gradient-to-br from-primary to-primary-dark text-white">
                  B
                </div>
                <div className="px-4 py-3 bg-gray-100 rounded-xl rounded-bl-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">Bondy está procesando tu consulta...</span>
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