import { apiClient } from '../axios.config';
import type {
  ChatHistoryResponse,
  UnreadCountResponse,
  UserChat,
  CreateDirectChatRequest,
  CreateDirectChatResponse,
} from '@/types/chat.types';

class ChatService {
  private basePath = '/api/chats';

  async getChatHistory(chatId: string): Promise<ChatHistoryResponse> {
    const response = await apiClient.get<ChatHistoryResponse>(
      `${this.basePath}/${chatId}/mensajes`
    );
    return response.data;
  }

  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    await apiClient.put(
      `${this.basePath}/${chatId}/marcar-leido/${userId}`
    );
  }

  async getUnreadCount(chatId: string, userId: string): Promise<UnreadCountResponse> {
    const response = await apiClient.get<UnreadCountResponse>(
      `${this.basePath}/${chatId}/no-leidos/${userId}`
    );
    return response.data;
  }

  /**
   * Obtiene todos los chats del usuario (grupales y directos)
   * NOTA: Este endpoint debe implementarse en el backend
   * GET /api/chats/usuario/{userId}
   */
  async getUserChats(userId: string): Promise<UserChat[]> {
    try {
      const response = await apiClient.get<UserChat[]>(
        `${this.basePath}/usuario/${userId}`
      );
      return response.data;
    } catch (error) {
      // Si el endpoint no existe aún, retornar array vacío
      console.warn('Endpoint /api/chats/usuario/{userId} no disponible aún');
      return [];
    }
  }

  /**
   * Crea o obtiene un chat directo entre dos usuarios
   * NOTA: Este endpoint debe implementarse en el backend
   * POST /api/chats/directo
   *
   * Si existe un chat privado entre ambos usuarios, lo retorna
   * Si no existe, lo crea y retorna
   */
  async createOrGetDirectChat(userId1: string, userId2: string): Promise<CreateDirectChatResponse | null> {
    try {
      const request: CreateDirectChatRequest = {
        userId1,
        userId2,
      };

      const response = await apiClient.post<CreateDirectChatResponse>(
        `${this.basePath}/directo`,
        request
      );
      return response.data;
    } catch (error) {
      console.warn('Endpoint /api/chats/directo no disponible aún');
      return null;
    }
  }
}

export const chatService = new ChatService();
