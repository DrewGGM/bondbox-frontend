import React, { useEffect, useState } from 'react';
import { GroupsServiceImp } from '@/api/services/groupService';
import { chatService } from '@/api/services/chatService';
import { groupsCache } from '@/utils/groupsCache';
import { directChatsCache } from '@/utils/directChatsCache';
import { useChatStore } from '@/store/chatStore';
import { formatTime } from '@/utils/dateUtils';
import credentialManager from '@/utils/credentialManager';
import type { GroupInformation } from '@/types/groups.types';

interface ChatListItem {
  id: string;
  name: string;
  type: 'group' | 'bondy' | 'direct';
  icon: string;
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount?: number;
  isOnline?: boolean;
}

interface ChatListViewProps {
  onSelectChat: (chatId: string, chatType: 'group' | 'bondy' | 'direct', chatName: string) => void;
}

const bondyChat: ChatListItem = {
  id: 'bondy-ai',
  name: 'Bondy AI',
  type: 'bondy',
  icon: '🤖',
  lastMessage: 'Tu asistente personal está listo para ayudarte',
  lastMessageTime: Date.now(),
  isOnline: true,
};

export const ChatListView: React.FC<ChatListViewProps> = ({ onSelectChat }) => {
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const groupService = new GroupsServiceImp();

  // Suscribirse a cambios en los mensajes del store
  const messagesMap = useChatStore((state) => state.messages);

  useEffect(() => {
    loadChats();
  }, []);

  // Actualizar chats cuando cambien los mensajes
  useEffect(() => {
    if (!isLoading) {
      updateChatsWithLatestMessages();
    }
  }, [messagesMap]);

  const getLastMessageInfo = (chatId: string) => {
    const messages = messagesMap.get(chatId);
    if (!messages || messages.length === 0) {
      return { lastMessage: undefined, lastMessageTime: undefined };
    }

    const lastMsg = messages[messages.length - 1];
    return {
      lastMessage: lastMsg.contenido.substring(0, 50) + (lastMsg.contenido.length > 50 ? '...' : ''),
      lastMessageTime: lastMsg.timestamp instanceof Date ? lastMsg.timestamp.getTime() : new Date(lastMsg.timestamp).getTime(),
    };
  };

  const updateChatsWithLatestMessages = () => {
    setChats(prevChats => {
      const updatedChats = prevChats.map(chat => {
        const { lastMessage, lastMessageTime } = getLastMessageInfo(chat.id);

        // Actualizar cache de chats directos
        if (chat.type === 'direct' && lastMessage && lastMessageTime) {
          directChatsCache.updateLastMessage(chat.id, lastMessage, lastMessageTime);
        }

        return {
          ...chat,
          lastMessage: lastMessage || chat.lastMessage,
          lastMessageTime: lastMessageTime || chat.lastMessageTime || 0,
        };
      });

      // Ordenar por último mensaje (más reciente primero)
      return sortChatsByLastMessage(updatedChats);
    });
  };

  const sortChatsByLastMessage = (chats: ChatListItem[]): ChatListItem[] => {
    return [...chats].sort((a, b) => {
      // Bondy siempre al principio
      if (a.type === 'bondy') return -1;
      if (b.type === 'bondy') return 1;

      const timeA = a.lastMessageTime || 0;
      const timeB = b.lastMessageTime || 0;

      return timeB - timeA; // Más reciente primero
    });
  };

  const convertGroupsToChats = (grupos: GroupInformation[]): ChatListItem[] => {
    return grupos.map((grupo) => {
      const { lastMessage, lastMessageTime } = getLastMessageInfo(grupo.id);

      return {
        id: grupo.id,
        name: grupo.name,
        type: 'group' as const,
        icon: '👥',
        lastMessage: lastMessage || 'Sin mensajes',
        lastMessageTime: lastMessageTime || 0,
        unreadCount: 0,
      };
    });
  };

  // Intenta obtener el nombre del otro usuario desde los mensajes
  const getUserNameFromMessages = (chatId: string, userId: string): string | null => {
    const messages = messagesMap.get(chatId);
    if (!messages || messages.length === 0) return null;

    // Buscar el primer mensaje del otro usuario
    const otherUserMessage = messages.find(msg => msg.remitenteId === userId);
    return otherUserMessage?.remitenteNombre || null;
  };

  const loadDirectChats = async (): Promise<ChatListItem[]> => {
    const currentUserId = credentialManager.getUserId();
    if (!currentUserId) return [];

    try {
      // Intentar cargar desde el backend primero
      const backendChats = await chatService.getUserChats(currentUserId);

      if (backendChats.length > 0) {
        // Filtrar solo chats directos (tipo PRIVADO)
        const directChats = backendChats.filter(chat => chat.tipo === 'PRIVADO');

        // Convertir a ChatListItem
        return directChats.map(chat => {
          const { lastMessage, lastMessageTime } = getLastMessageInfo(chat.id);

          // Obtener el ID del otro usuario
          const otherUserId = chat.participantes.find(p => p !== currentUserId) || '';

          // Intentar obtener el nombre del otro usuario desde varias fuentes
          const cachedChat = directChatsCache.get(chat.id);
          const userName = cachedChat?.userName
            || getUserNameFromMessages(chat.id, otherUserId)
            || 'Chat Directo';

          // Actualizar cache con la info del backend
          if (otherUserId) {
            directChatsCache.saveOrUpdate({
              chatId: chat.id,
              userId: otherUserId,
              userName: userName,
              lastMessage: lastMessage,
              lastMessageTime: lastMessageTime,
            });
          }

          return {
            id: chat.id,
            name: userName,
            type: 'direct' as const,
            icon: userName.charAt(0).toUpperCase(),
            lastMessage: lastMessage || 'Inicia una conversación',
            lastMessageTime: lastMessageTime || 0,
            unreadCount: 0,
          };
        });
      }
    } catch (error) {
      // Si falla el backend, cargar desde localStorage
    }

    // Fallback: cargar desde localStorage
    const directChatsInfo = directChatsCache.getAll();

    return directChatsInfo.map(chatInfo => {
      const { lastMessage, lastMessageTime } = getLastMessageInfo(chatInfo.chatId);

      return {
        id: chatInfo.chatId,
        name: chatInfo.userName,
        type: 'direct' as const,
        icon: chatInfo.userName.charAt(0).toUpperCase(),
        lastMessage: lastMessage || chatInfo.lastMessage || 'Inicia una conversación',
        lastMessageTime: lastMessageTime || chatInfo.lastMessageTime || 0,
        unreadCount: chatInfo.unreadCount || 0,
      };
    });
  };

  const loadChats = async () => {
    try {
      // 1. Cargar chats directos (intenta backend, fallback a localStorage)
      const directChats = await loadDirectChats();

      // 2. Cargar desde cache de grupos primero (instantáneo)
      const cachedGroups = groupsCache.getStale();
      if (cachedGroups && cachedGroups.length > 0) {
        const groupChats = convertGroupsToChats(cachedGroups);
        const allChats = [bondyChat, ...groupChats, ...directChats];
        setChats(sortChatsByLastMessage(allChats));
        setIsLoading(false);
      }

      // 3. Actualizar desde API en background
      const grupos: GroupInformation[] = await groupService.getUserGroups();

      // Guardar en cache
      groupsCache.set(grupos);

      // Actualizar UI (recargar directChats para tener datos frescos)
      const freshDirectChats = await loadDirectChats();
      const groupChats = convertGroupsToChats(grupos);
      const allChats = [bondyChat, ...groupChats, ...freshDirectChats];
      setChats(sortChatsByLastMessage(allChats));
    } catch (error) {
      // Si falla el API pero hay cache, mantener el cache
      const cachedGroups = groupsCache.getStale();
      const directChats = await loadDirectChats();

      if (cachedGroups && cachedGroups.length > 0) {
        const groupChats = convertGroupsToChats(cachedGroups);
        const allChats = [bondyChat, ...groupChats, ...directChats];
        setChats(sortChatsByLastMessage(allChats));
      } else {
        // Solo Bondy y chats directos si no hay cache de grupos
        const allChats = [bondyChat, ...directChats];
        setChats(sortChatsByLastMessage(allChats));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatLastMessageTime = (timestamp?: number) => {
    if (!timestamp) return '';

    const now = new Date();
    const msgDate = new Date(timestamp);
    const diffMs = now.getTime() - msgDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;

    return formatTime(msgDate);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Chats</h3>
        <p className="text-xs text-gray-500 mt-1">{chats.length} conversaciones</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            <p className="text-gray-500 text-sm text-center">
              No tienes chats disponibles
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id, chat.type, chat.name)}
                className="w-full p-4 hover:bg-gray-50 transition-colors text-left flex items-center gap-3"
              >
                <div className="relative flex-shrink-0">
                  {chat.type === 'direct' ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-lg font-semibold">
                      {chat.icon}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-2xl">
                      {chat.icon}
                    </div>
                  )}
                  {chat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-gray-800 truncate">
                      {chat.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      {chat.lastMessageTime && (
                        <span className="text-xs text-gray-400">
                          {formatLastMessageTime(chat.lastMessageTime)}
                        </span>
                      )}
                      {chat.unreadCount && chat.unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
