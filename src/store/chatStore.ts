import { create } from 'zustand';
import type {
  Chat,
  MensajeWebSocketDTO,
  EscribiendoDTO,
  EstadoUsuarioDTO,
} from '@/types/chat.types';

interface ChatState {
  chats: Map<string, Chat>;
  messages: Map<string, MensajeWebSocketDTO[]>;
  activeChat: string | null;
  isConnected: boolean;
  typingUsers: Map<string, EscribiendoDTO[]>;
  userStatus: Map<string, EstadoUsuarioDTO>;
  isChatOpen: boolean;
  totalUnreadCount: number;

  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;

  setMessages: (chatId: string, messages: MensajeWebSocketDTO[]) => void;
  addMessage: (chatId: string, message: MensajeWebSocketDTO) => void;

  setActiveChat: (chatId: string | null) => void;
  setConnected: (connected: boolean) => void;

  setTyping: (chatId: string, typing: EscribiendoDTO) => void;
  removeTyping: (chatId: string, userId: string) => void;

  setUserStatus: (status: EstadoUsuarioDTO) => void;

  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;

  incrementUnreadCount: () => void;
  decrementUnreadCount: (count: number) => void;
  resetUnreadCount: () => void;

  clearChat: (chatId: string) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: new Map(),
  messages: new Map(),
  activeChat: null,
  isConnected: false,
  typingUsers: new Map(),
  userStatus: new Map(),
  isChatOpen: false,
  totalUnreadCount: 0,

  setChats: (chats) =>
    set(() => {
      const chatsMap = new Map<string, Chat>();
      chats.forEach((chat) => chatsMap.set(chat.id, chat));
      return { chats: chatsMap };
    }),

  addChat: (chat) =>
    set((state) => {
      const newChats = new Map(state.chats);
      newChats.set(chat.id, chat);
      return { chats: newChats };
    }),

  updateChat: (chatId, updates) =>
    set((state) => {
      const chat = state.chats.get(chatId);
      if (!chat) return state;

      const newChats = new Map(state.chats);
      newChats.set(chatId, { ...chat, ...updates });
      return { chats: newChats };
    }),

  setMessages: (chatId, messages) =>
    set((state) => {
      const newMessages = new Map(state.messages);
      newMessages.set(chatId, messages);
      return { messages: newMessages };
    }),

  addMessage: (chatId, message) =>
    set((state) => {
      const currentMessages = state.messages.get(chatId) || [];
      const newMessages = new Map(state.messages);
      newMessages.set(chatId, [...currentMessages, message]);

      const chat = state.chats.get(chatId);
      if (chat) {
        const newChats = new Map(state.chats);
        newChats.set(chatId, {
          ...chat,
          ultimoMensaje: message,
        });
        return { messages: newMessages, chats: newChats };
      }

      return { messages: newMessages };
    }),

  setActiveChat: (chatId) => set({ activeChat: chatId }),

  setConnected: (connected) => set({ isConnected: connected }),

  setTyping: (chatId, typing) =>
    set((state) => {
      const currentTyping = state.typingUsers.get(chatId) || [];
      const filteredTyping = currentTyping.filter((t) => t.userId !== typing.userId);

      if (typing.escribiendo) {
        const newTypingUsers = new Map(state.typingUsers);
        newTypingUsers.set(chatId, [...filteredTyping, typing]);
        return { typingUsers: newTypingUsers };
      } else {
        const newTypingUsers = new Map(state.typingUsers);
        newTypingUsers.set(chatId, filteredTyping);
        return { typingUsers: newTypingUsers };
      }
    }),

  removeTyping: (chatId, userId) =>
    set((state) => {
      const currentTyping = state.typingUsers.get(chatId) || [];
      const newTypingUsers = new Map(state.typingUsers);
      newTypingUsers.set(
        chatId,
        currentTyping.filter((t) => t.userId !== userId)
      );
      return { typingUsers: newTypingUsers };
    }),

  setUserStatus: (status) =>
    set((state) => {
      const newUserStatus = new Map(state.userStatus);
      newUserStatus.set(status.userId, status);
      return { userStatus: newUserStatus };
    }),

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

  openChat: () => set({ isChatOpen: true }),

  closeChat: () => set({ isChatOpen: false }),

  incrementUnreadCount: () =>
    set((state) => ({ totalUnreadCount: state.totalUnreadCount + 1 })),

  decrementUnreadCount: (count) =>
    set((state) => ({
      totalUnreadCount: Math.max(0, state.totalUnreadCount - count),
    })),

  resetUnreadCount: () => set({ totalUnreadCount: 0 }),

  clearChat: (chatId) =>
    set((state) => {
      const newMessages = new Map(state.messages);
      newMessages.delete(chatId);
      return { messages: newMessages };
    }),

  reset: () =>
    set({
      chats: new Map(),
      messages: new Map(),
      activeChat: null,
      isConnected: false,
      typingUsers: new Map(),
      userStatus: new Map(),
      isChatOpen: false,
      totalUnreadCount: 0,
    }),
}));
