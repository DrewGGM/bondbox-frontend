import React, { useState } from 'react';
import { aiService, type ConversationMessage } from '@/api/services/aiService';
import { useChatStore } from '@/store/chatStore';

interface BondyChatInputProps {
  chatId: string;
  userId: string;
  disabled?: boolean;
}

export const BondyChatInput: React.FC<BondyChatInputProps> = ({
  chatId,
  userId,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addMessage } = useChatStore();

  const handleSend = async () => {
    if (!message.trim() || disabled || isLoading) return;

    const userMessage = message.trim();
    setMessage('');

    // Add user message to chat
    addMessage(chatId, {
      chatId,
      remitenteId: userId,
      remitenteNombre: 'Tú',
      contenido: userMessage,
      timestamp: new Date(),
    });

    setIsLoading(true);

    try {
      // Get conversation history from store
      const messages = useChatStore.getState().messages.get(chatId) || [];

      // Convert to AI service format (last 10 messages for context)
      const conversationHistory: ConversationMessage[] = messages
        .slice(-10)
        .map((msg) => ({
          role: msg.remitenteId === userId ? 'user' : 'assistant',
          content: msg.contenido,
        }));

      // Query Bondy AI
      const response = await aiService.queryAI(userMessage, conversationHistory);

      // Add Bondy's response to chat
      addMessage(chatId, {
        chatId,
        remitenteId: null,
        remitenteNombre: 'Bondy AI',
        contenido: response.client_response,
        timestamp: new Date(),
      });
    } catch (error) {
      // Add error message
      const errorMessage = error instanceof Error
        ? error.message
        : 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.';

      addMessage(chatId, {
        chatId,
        remitenteId: null,
        remitenteNombre: 'Bondy AI',
        contenido: errorMessage,
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isLoading ? 'Bondy está pensando...' : 'Pregúntale algo a Bondy...'}
          disabled={disabled || isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isLoading}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          )}
        </button>
      </div>
      {isLoading && (
        <p className="text-xs text-gray-500 mt-2 animate-pulse">
          Bondy está procesando tu consulta...
        </p>
      )}
    </div>
  );
};
