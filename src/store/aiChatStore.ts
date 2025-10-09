import { create } from 'zustand';
import type { Message, ChatStats, MCPResponse } from '@/types/ai.types';

interface AiChatState {
  messages: Message[];
  isTyping: boolean;
  stats: ChatStats;
  addMessage: (message: Message) => void;
  addMCPResponse: (response: MCPResponse) => void;
  setTyping: (isTyping: boolean) => void;
  clearMessages: () => void;
}

export const useAiChatStore = create<AiChatState>((set) => ({
  messages: [
    {
      id: '1',
      type: 'bot',
      content: '¡Hola! Soy Bondy AI, tu asistente familiar. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ],
  isTyping: false,
  stats: {
    tasksPending: 8,
    tasksCompleted: 3,
    expensesToday: 185400,
    incomeToday: 2500000,
  },
  
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  addMCPResponse: (response) =>
    set((state) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: response.client_response,
        client_response: response.client_response,
        mcp_data: response.data,
        timestamp: new Date(),
      };
      return {
        messages: [...state.messages, newMessage],
      };
    }),
    
  setTyping: (isTyping) => set({ isTyping }),
  
  clearMessages: () =>
    set({
      messages: [
        {
          id: '1',
          type: 'bot',
          content: '¡Hola! Soy Bondy AI, tu asistente familiar. ¿En qué puedo ayudarte hoy?',
          timestamp: new Date(),
        },
      ],
    }),
}));