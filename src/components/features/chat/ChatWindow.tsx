import React, { useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import credentialManager from '@/utils/credentialManager';
import { directChatsCache } from '@/utils/directChatsCache';
import { chatService } from '@/api/services/chatService';
import { ChatListView } from './ChatListView';
import { ChatConversationView } from './ChatConversationView';

export const ChatWindow: React.FC = () => {
  const { isChatOpen, closeChat } = useChatStore();
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    type: 'group' | 'bondy' | 'direct';
    name: string;
  } | null>(null);

  const handleSelectChat = (chatId: string, chatType: 'group' | 'bondy' | 'direct', chatName: string) => {
    setSelectedChat({
      id: chatId,
      type: chatType,
      name: chatName,
    });
  };

  const handleStartDirectChat = async (userId: string, userName: string) => {
    const currentUserId = credentialManager.getUserId();
    if (!currentUserId) return;

    try {
      // Intentar crear/obtener el chat desde el backend
      const backendChat = await chatService.createOrGetDirectChat(currentUserId, userId);

      let chatId: string;

      if (backendChat) {
        // Si el backend responde, usar el chatId del backend
        chatId = backendChat.id;

        // Guardar en cache con el ID del backend
        directChatsCache.saveOrUpdate({
          chatId: backendChat.id,
          userId,
          userName,
          lastMessage: 'Inicia una conversación',
          lastMessageTime: Date.now(),
        });
      } else {
        // Fallback: Si el endpoint no existe aún, usar ID local
        chatId = [currentUserId, userId].sort().join('-');

        directChatsCache.saveOrUpdate({
          chatId,
          userId,
          userName,
          lastMessage: 'Inicia una conversación',
          lastMessageTime: Date.now(),
        });
      }

      setSelectedChat({
        id: chatId,
        type: 'direct',
        name: userName,
      });
    } catch (error) {
      // Si hay error, usar fallback local
      const chatId = [currentUserId, userId].sort().join('-');

      directChatsCache.saveOrUpdate({
        chatId,
        userId,
        userName,
        lastMessage: 'Inicia una conversación',
        lastMessageTime: Date.now(),
      });

      setSelectedChat({
        id: chatId,
        type: 'direct',
        name: userName,
      });
    }
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-40">
      {selectedChat ? (
        <ChatConversationView
          chatId={selectedChat.id}
          chatType={selectedChat.type}
          chatName={selectedChat.name}
          onBack={handleBackToList}
          onStartDirectChat={handleStartDirectChat}
        />
      ) : (
        <>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary text-white rounded-t-lg flex-shrink-0">
            <h3 className="font-semibold">Chats</h3>
            <button
              onClick={closeChat}
              className="hover:bg-white/20 rounded p-1 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <ChatListView onSelectChat={handleSelectChat} />
          </div>
        </>
      )}
    </div>
  );
};
