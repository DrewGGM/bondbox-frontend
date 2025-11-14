import React, { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { formatTime, formatDate } from '@/utils/dateUtils';
import type { MensajeWebSocketDTO } from '@/types/chat.types';

interface ChatMessageListProps {
  chatId: string;
  currentUserId: string;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  chatId,
  currentUserId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use specific selectors to ensure reactivity
  const chatMessages = useChatStore((state) => state.messages.get(chatId) || []);
  const typingInChat = useChatStore((state) => state.typingUsers.get(chatId) || []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, typingInChat]);

  const shouldShowDateSeparator = (currentMsg: MensajeWebSocketDTO, index: number) => {
    if (index === 0) return true;

    const previousMsg = chatMessages[index - 1];
    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const previousDate = new Date(previousMsg.timestamp).toDateString();

    return currentDate !== previousDate;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
      {chatMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-sm">No hay mensajes aún</p>
        </div>
      ) : (
        <>
          {chatMessages.map((msg, index) => {
            const isOwnMessage = msg.remitenteId === currentUserId;

            return (
              <React.Fragment key={msg.id || index}>
                {shouldShowDateSeparator(msg, index) && (
                  <div className="flex items-center justify-center my-4">
                    <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                      {formatDate(msg.timestamp)}
                    </span>
                  </div>
                )}

                <div
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {!isOwnMessage && (
                      <p className="text-xs font-semibold mb-1 text-gray-600">
                        {msg.remitenteNombre || 'Usuario'}
                      </p>
                    )}
                    <p className="text-sm break-words">{msg.contenido}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {typingInChat.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-lg shadow-sm">
                <p className="text-xs text-gray-600 mb-1">
                  {typingInChat.map((t) => t.nombreUsuario).join(', ')}
                </p>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};
