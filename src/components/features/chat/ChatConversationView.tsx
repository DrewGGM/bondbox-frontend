import React, { useEffect, useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { webSocketService } from '@/services/websocket.service';
import { chatService } from '@/api/services/chatService';
import credentialManager from '@/utils/credentialManager';
import { parseBackendTimestamp, sortMessagesByTimestamp } from '@/utils/dateUtils';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { BondyChatInput } from './BondyChatInput';
import { GroupUsersModal } from './GroupUsersModal';

interface ChatConversationViewProps {
  chatId: string;
  chatType: 'group' | 'bondy' | 'direct';
  chatName: string;
  onBack: () => void;
  onStartDirectChat?: (userId: string, userName: string) => void;
}

export const ChatConversationView: React.FC<ChatConversationViewProps> = ({
  chatId,
  chatType,
  chatName,
  onBack,
  onStartDirectChat,
}) => {
  const { isConnected, setConnected, setMessages, addMessage } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUsersModal, setShowUsersModal] = useState(false);

  const userId = credentialManager.getUserId();
  const userEmail = credentialManager.getUserEmail();

  const initializeBondyChat = () => {
    // Initialize Bondy chat with welcome message if no messages exist
    const existingMessages = useChatStore.getState().messages.get(chatId) || [];

    if (existingMessages.length === 0) {
      setMessages(chatId, [
        {
          chatId,
          remitenteId: null,
          remitenteNombre: 'Bondy AI',
          contenido: '¡Hola! Soy Bondy AI, tu asistente familiar. Puedo ayudarte con tus finanzas, tareas, inventario y más. ¿En qué puedo ayudarte hoy?',
          timestamp: new Date(),
        },
      ]);
    }
  };

  useEffect(() => {
    if (chatType === 'bondy') {
      initializeBondyChat();
      return;
    }

    if (!userId) {
      return;
    }

    // Tanto chats grupales como directos usan WebSocket
    initializeChat();

    return () => {
      webSocketService.unsubscribeFromChat(chatId);
    };
  }, [chatId, chatType, userId]);

  const initializeChat = async () => {
    if (!userId) {
      setError('Error: usuario no identificado');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Check actual WebSocket service state, not just store state
      const actuallyConnected = webSocketService.isConnected();

      if (!actuallyConnected) {
        await webSocketService.connect(userId);
        setConnected(true);
      }

      webSocketService.subscribeToChatMessages(chatId, (message) => {
        addMessage(chatId, message);

        if (message.remitenteId !== userId) {
          webSocketService.markAsRead(chatId, userId);
        }
      });

      const history = await chatService.getChatHistory(chatId);

      // Check if history is the array directly or has mensajes property
      const messages = Array.isArray(history) ? history : history.mensajes;

      // Convert timestamps from strings to Date objects with proper timezone handling
      const messagesWithDates = messages.map((msg: any) => {
        // Handle both 'timestamp' and 'fechaEnvio' fields
        const rawTimestamp = msg.timestamp || msg.fechaEnvio;

        return {
          ...msg,
          timestamp: parseBackendTimestamp(rawTimestamp),
        };
      });

      // Ordenar mensajes por timestamp (de más antiguo a más reciente)
      const sortedMessages = sortMessagesByTimestamp(messagesWithDates);

      setMessages(chatId, sortedMessages);
      webSocketService.markAsRead(chatId, userId);
    } catch (err) {
      setError('Error al conectar con el chat. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (chatType === 'bondy') {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary text-white">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-semibold">{chatName}</h3>
                <p className="text-xs text-white/80">Asistente IA</p>
              </div>
            </div>
          </div>
          <a
            href="/bondy-ai"
            className="text-xs text-white/80 hover:text-white hover:underline transition-colors"
            title="Ir a la versión completa con más funcionalidades"
          >
            Versión completa →
          </a>
        </div>

        {userId ? (
          <>
            <ChatMessageList chatId={chatId} currentUserId={userId} />
            <BondyChatInput chatId={chatId} userId={userId} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-gray-500 text-center text-sm">
              Error al obtener información del usuario
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            {chatType === 'direct' ? (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-sm font-semibold">
                  {chatName.charAt(0).toUpperCase()}
                </span>
              </div>
            ) : (
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-400' : 'bg-yellow-400'
                }`}
              ></div>
            )}
            <div>
              <h3 className="font-semibold">{chatName}</h3>
              <p className="text-xs text-white/80">
                {chatType === 'direct'
                  ? 'Chat directo'
                  : isConnected ? 'Conectado' : 'Conectando...'}
              </p>
            </div>
          </div>
        </div>

        {chatType === 'group' && (
          <button
            onClick={() => setShowUsersModal(true)}
            className="hover:bg-white/20 rounded p-2 transition-colors"
            title="Ver miembros del grupo"
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Cargando mensajes...</p>
          </div>
        </div>
      ) : userId ? (
        <>
          <ChatMessageList chatId={chatId} currentUserId={userId} />
          <ChatInput
            chatId={chatId}
            userId={userId}
            userName={userEmail || 'Usuario'}
            disabled={!isConnected}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-gray-500 text-center text-sm">
            Error al obtener información del usuario
          </p>
        </div>
      )}

      {/* Modal de usuarios del grupo */}
      {chatType === 'group' && onStartDirectChat && (
        <GroupUsersModal
          groupId={chatId}
          groupName={chatName}
          isOpen={showUsersModal}
          onClose={() => setShowUsersModal(false)}
          onStartDirectChat={onStartDirectChat}
        />
      )}
    </div>
  );
};
