import SockJS from 'sockjs-client';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { parseBackendTimestamp } from '@/utils/dateUtils';
import type {
  MensajeWebSocketDTO,
  EscribiendoDTO,
  EstadoUsuarioDTO,
} from '@/types/chat.types';

type MessageCallback = (message: MensajeWebSocketDTO) => void;
type StatusCallback = (status: EstadoUsuarioDTO) => void;

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // SockJS needs HTTP/HTTPS URLs, not WS/WSS - it handles the upgrade internally
      const apiUrl = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';
      const socketUrl = `${apiUrl}/ws`;

      this.client = new Client({
        webSocketFactory: () => new SockJS(socketUrl) as any,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          this.connected = true;
          this.reconnectAttempts = 0;

          // Wait a bit to ensure STOMP client is fully ready for subscriptions
          setTimeout(() => {
            resolve();
          }, 100);
        },
        onStompError: (frame) => {
          reject(new Error(frame.headers['message'] || 'STOMP connection error'));
        },
        onWebSocketError: (error) => {
          reject(error);
        },
        onDisconnect: () => {
          this.connected = false;
          this.handleReconnect(userId);
        },
      });

      this.client.activate();
    });
  }

  private handleReconnect(userId: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect(userId).catch(() => {});
      }, 5000 * this.reconnectAttempts);
    }
  }

  subscribeToChatMessages(chatId: string, callback: MessageCallback): void {
    if (!this.client || !this.connected || !this.client.connected) {
      return;
    }

    const destination = `/topic/chat/${chatId}`;
    const subscriptionKey = `chat-${chatId}`;

    if (this.subscriptions.has(subscriptionKey)) {
      return;
    }

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const messageData: MensajeWebSocketDTO = JSON.parse(message.body);

        // Convert backend timestamp to proper Date object with timezone handling
        messageData.timestamp = parseBackendTimestamp(messageData.timestamp);

        callback(messageData);
      } catch (error) {
        // Silent error handling
      }
    });

    this.subscriptions.set(subscriptionKey, subscription);
  }

  subscribeToUserStatus(callback: StatusCallback): void {
    if (!this.client || !this.connected || !this.client.connected) {
      return;
    }

    const destination = '/topic/user.status';
    const subscriptionKey = 'user-status';

    if (this.subscriptions.has(subscriptionKey)) {
      return;
    }

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const statusData: EstadoUsuarioDTO = JSON.parse(message.body);
        statusData.ultimaConexion = parseBackendTimestamp(statusData.ultimaConexion);
        callback(statusData);
      } catch (error) {
        // Silent error handling
      }
    });

    this.subscriptions.set(subscriptionKey, subscription);
  }

  sendMessage(message: MensajeWebSocketDTO): void {
    if (!this.client || !this.connected || !this.client.connected) {
      return;
    }

    this.client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message),
    });
  }

  sendTypingIndicator(typing: EscribiendoDTO): void {
    if (!this.client || !this.connected || !this.client.connected) {
      return;
    }

    this.client.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify(typing),
    });
  }

  markAsRead(chatId: string, userId: string): void {
    if (!this.client || !this.connected || !this.client.connected) {
      return;
    }

    this.client.publish({
      destination: '/app/chat.markRead',
      body: JSON.stringify({ chatId, userId }),
    });
  }

  unsubscribeFromChat(chatId: string): void {
    const subscriptionKey = `chat-${chatId}`;
    const subscription = this.subscriptions.get(subscriptionKey);

    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionKey);
    }
  }

  unsubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }

  disconnect(): void {
    if (this.client) {
      this.unsubscribeAll();
      this.client.deactivate();
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export const webSocketService = new WebSocketService();
