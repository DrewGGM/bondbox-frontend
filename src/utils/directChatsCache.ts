/**
 * Gestión de chats directos en localStorage
 */

export interface DirectChatInfo {
  chatId: string;
  userId: string;
  userName: string;
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount?: number;
}

const CACHE_KEY = 'bondbox_direct_chats';

export const directChatsCache = {
  /**
   * Obtiene todos los chats directos del usuario actual
   */
  getAll(): DirectChatInfo[] {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return [];
      return JSON.parse(cached) as DirectChatInfo[];
    } catch (error) {
      return [];
    }
  },

  /**
   * Guarda o actualiza un chat directo
   */
  saveOrUpdate(chatInfo: DirectChatInfo): void {
    try {
      const chats = this.getAll();
      const existingIndex = chats.findIndex(c => c.chatId === chatInfo.chatId);

      if (existingIndex >= 0) {
        // Actualizar existente
        chats[existingIndex] = {
          ...chats[existingIndex],
          ...chatInfo,
        };
      } else {
        // Agregar nuevo
        chats.push(chatInfo);
      }

      localStorage.setItem(CACHE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error('[DirectChatsCache] Error saving chat:', error);
    }
  },

  /**
   * Actualiza el último mensaje de un chat
   */
  updateLastMessage(chatId: string, message: string, timestamp: number): void {
    try {
      const chats = this.getAll();
      const chat = chats.find(c => c.chatId === chatId);

      if (chat) {
        chat.lastMessage = message;
        chat.lastMessageTime = timestamp;
        localStorage.setItem(CACHE_KEY, JSON.stringify(chats));
      }
    } catch (error) {
      console.error('[DirectChatsCache] Error updating last message:', error);
    }
  },

  /**
   * Obtiene un chat directo específico
   */
  get(chatId: string): DirectChatInfo | null {
    const chats = this.getAll();
    return chats.find(c => c.chatId === chatId) || null;
  },

  /**
   * Elimina un chat directo
   */
  remove(chatId: string): void {
    try {
      const chats = this.getAll();
      const filtered = chats.filter(c => c.chatId !== chatId);
      localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('[DirectChatsCache] Error removing chat:', error);
    }
  },

  /**
   * Limpia todos los chats directos
   */
  clear(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('[DirectChatsCache] Error clearing cache:', error);
    }
  },
};
