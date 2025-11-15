export interface Notification {
  id: string;
  userId: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
  fechaCreacion: string;
  fechaLectura?: string;
}

export interface ResponseNotificationDTO {
  id: string;
  userId: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
  fechaCreacion: string;
  fechaLectura?: string;
}
