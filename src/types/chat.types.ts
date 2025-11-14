export interface MensajeWebSocketDTO {
  id?: string;
  chatId: string;
  remitenteId: string | null;
  remitenteNombre: string | null;
  contenido: string;
  timestamp: Date | string;
  tipo?: string;
  leido?: boolean;
}

export interface EscribiendoDTO {
  chatId: string;
  userId: string;
  nombreUsuario: string;
  escribiendo: boolean;
}

export interface EstadoUsuarioDTO {
  userId: string;
  enLinea: boolean;
  ultimaConexion: Date;
}

export interface Chat {
  id: string;
  participantes: string[];
  ultimoMensaje?: MensajeWebSocketDTO;
  mensajesNoLeidos?: number;
  createdAt?: Date;
}

export interface ChatMessage extends MensajeWebSocketDTO {
  id: string;
  timestamp: Date;
}

export interface UnreadCountResponse {
  chatId: string;
  userId: string;
  count: number;
}

export interface ChatHistoryResponse {
  chatId: string;
  mensajes: MensajeWebSocketDTO[];
  total: number;
}

// Tipos para sincronización con backend
// Este tipo coincide EXACTAMENTE con lo que el backend retorna
export interface UserChat {
  id: string;
  nombre: string;
  tipo: 'GRUPO' | 'PRIVADO' | 'CANAL';
  descripcion: string;
  participantes: string[];
  fechaCreacion: string;
  activo: boolean;
}

export interface CreateDirectChatRequest {
  userId1: string;
  userId2: string;
}

// El backend retorna un objeto Chat completo
export interface CreateDirectChatResponse {
  id: string;
  nombre: string;
  tipo: 'PRIVADO';
  descripcion: string;
  participantes: string[];
  fechaCreacion: string;
  activo: boolean;
}
